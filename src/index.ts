import { DirectClient as BaseDirectClient } from '@elizaos/client-direct';
import { AgentRuntime, elizaLogger, stringToUuid } from '@elizaos/core';
import { bootstrapPlugin } from '@elizaos/plugin-bootstrap';
import { createNodePlugin } from '@elizaos/plugin-node';
import { solanaPlugin } from '@elizaos/plugin-solana';
import { createClient } from '@supabase/supabase-js';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { initializeDbCache } from './cache/index.ts';
import { character } from './character.ts';
import { createAiBetworksClient } from './clients/AiBetworksIntegration.ts';
import { getTokenForProvider, loadCharacters, parseArguments } from './config/index.ts';
import { initializeDatabase } from './database/index.ts';
import { Database } from './types/database.types.ts';
import type { Character, ExtendedAgentRuntime, Character as ExtendedCharacter } from './types/index.ts';
import {
  agentMessageInputSchema,
  gmInstructDecisionInputSchema,
  observationMessageInputSchema,
} from './types/schemas.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//TODO Move variables into ExtendedCharacter config later
export const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export const wait = (minTime: number = 1000, maxTime: number = 3000) => {
  const waitTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  return new Promise(resolve => setTimeout(resolve, waitTime));
};

let nodePlugin: any | undefined;

export function createAgent(character: Character, db: any, cache: any, token: string): ExtendedAgentRuntime {
  const extendedChar = character as unknown as ExtendedCharacter;

  elizaLogger.success(elizaLogger.successesTitle, 'Creating runtime for character', extendedChar.name);

  nodePlugin ??= createNodePlugin();

  const runtime = new AgentRuntime({
    databaseAdapter: db,
    token,
    modelProvider: extendedChar.modelProvider,
    evaluators: [],
    character: extendedChar,
    plugins: [
      bootstrapPlugin,
      nodePlugin,
      extendedChar.settings?.secrets?.WALLET_PUBLIC_KEY ? solanaPlugin : null,
    ].filter(Boolean),
    providers: [],
    actions: [],
    services: [],
    managers: [],
    cacheManager: cache,
  }) as ExtendedAgentRuntime;

  // Add chat interface to runtime

  return runtime;
}

async function startAgent(character: Character, directClient: BaseDirectClient) {
  try {
    const extendedChar = character as unknown as ExtendedCharacter;
    extendedChar.id ??= stringToUuid(extendedChar.name);
    extendedChar.username ??= extendedChar.name;

    const token = getTokenForProvider(extendedChar.modelProvider, extendedChar);
    const dataDir = path.join(__dirname, '../data');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const db = initializeDatabase(dataDir);
    await db.init();

    const cache = initializeDbCache(extendedChar, db);
    const runtime = createAgent(extendedChar, db, cache, token);

    await runtime.initialize();
    runtime.clients = {};

    if (extendedChar.settings?.aiBetworks) {
      try {
        const { aiBetworksServerUrl, ethWalletAddress, creatorId, agentId, clientPort } =
          extendedChar.settings.aiBetworks;
        const config = {
          aiBetworksUrl: aiBetworksServerUrl,
          walletAddress: ethWalletAddress,
          creatorId: Number(creatorId),
          agentId: Number(agentId),
          privateKey: process.env[`AGENT_${agentId}_PRIVATE_KEY`],
        };

        // Create and initialize client
        const aiBetworksClient = await createAiBetworksClient(runtime, config);
        if (aiBetworksClient) {
          await aiBetworksClient.initialize();
          runtime.clients['aiBetworks'] = aiBetworksClient;
        }

        // Start listening on the appropriate port
        await new Promise<void>((resolve, reject) => {
          try {
            // Add routes before starting the server
            directClient.app.get('/health', (req, res) => {
              res.json({
                status: 'ok',
                agentId,
              });
            });

            // Add context route

            // Add message routes with schema validation
            directClient.app.get('/agentContext', async (req, res) => {
              try {
                const context = aiBetworksClient?.getClient()?.getContext();
                res.json(context);
              } catch (error) {
                res.status(500).json({
                  error: 'Failed to get context',
                  details: error instanceof Error ? error.message : String(error),
                });
              }
            });

            // Add message routes with schema validation
            directClient.app.post('/messages/receiveAgentMessage', express.json(), async (req, res) => {
              try {
                const validatedMessage = agentMessageInputSchema.parse(req.body);
                // Handle the validated message
                try {
                  const result = await aiBetworksClient?.getClient()?.handleAgentMessage?.(validatedMessage);

                  res.json({
                    received: true,
                    message: validatedMessage,
                    ...result,
                  });
                } catch (error) {
                  // We are going to assume, unless the error is a validation error, that the message was processed successfully and something happened with the agent
                  console.error('Error handling agent message (index):', error);
                  res.json({
                    received: false,
                    success: false,
                    errorMessage: 'Error processing message',
                    details: error instanceof Error ? error.message : String(error),
                  });
                }
              } catch (error) {
                // Only validation errors return 400
                res.status(400).json({
                  error: 'Invalid message format',
                  details: error,
                });
              }
            });

            directClient.app.post('/messages/receiveObservation', express.json(), async (req, res) => {
              try {
                const validatedMessage = observationMessageInputSchema.parse(req.body);

                try {
                  const result = await aiBetworksClient?.getClient()?.handleReceiveObservation?.(validatedMessage);

                  res.json({
                    received: true,
                    message: validatedMessage,
                    ...result,
                  });
                } catch (error) {
                  console.error('Error handling observation:', error);
                  res.json({
                    received: false,
                    success: false,
                    errorMessage: 'Error processing observation',
                    details: error instanceof Error ? error.message : String(error),
                  });
                }
              } catch (error) {
                // Only validation errors return 400
                res.status(400).json({
                  error: 'Invalid message format',
                  details: error,
                });
              }
            });

            directClient.app.listen(clientPort || 3001, () => {
              console.log(`${extendedChar.name} (#${agentId}) listening on port ${clientPort || 3001}`);

              resolve();
            });
          } catch (err) {
            reject(err);
          }

          // Decision endpoint
          directClient.app.post('/messages/gmInstructDecision', express.json(), async (req, res) => {
            try {
              const validatedMessage = gmInstructDecisionInputSchema.parse(req.body);
              console.log('gmInstructDecision', validatedMessage);
              const result = await aiBetworksClient
                ?.getClient()
                ?.handleDecisionRequest(validatedMessage.content.roomId, validatedMessage.content.roundId);
              res.json({
                success: true,
                result,
              });
            } catch (error) {
              // If it's a validation error, return 400
              if (error instanceof z.ZodError) {
                res.status(400).json({
                  success: false,
                  error: 'Invalid message format',
                  details: error.errors,
                });
                return;
              }
              // For other errors, return 500
              res.status(500).json({
                success: false,
                error: 'Error processing decision',
                details: error instanceof Error ? error.message : String(error),
              });
            }
          });
        });

        console.log(`Successfully initialized AI Betworks client for ${extendedChar.name}`);
      } catch (error) {
        console.error(`Failed to initialize AI Betworks client for ${extendedChar.name}:`, error);
        throw error; // Re-throw to handle failure
      }
    }

    directClient.registerAgent(runtime);
    elizaLogger.debug(`Started ${extendedChar.name} as ${runtime.agentId}`);

    return runtime;
  } catch (error) {
    elizaLogger.error(`Error starting agent for character ${(character as unknown as ExtendedCharacter).name}:`, error);
    console.error(error);
    throw error;
  }
}

const startAgents = async () => {
  const directClient = new BaseDirectClient();
  const args = parseArguments();

  let charactersArg = args.characters || args.character;
  let characters = [character];

  if (charactersArg) {
    characters = await loadCharacters(charactersArg);
  }

  try {
    // Start all agents
    const runtimes: ExtendedAgentRuntime[] = [];

    for (const char of characters) {
      const extendedChar = char as unknown as ExtendedCharacter;
      if (!extendedChar.agentRole) {
        throw new Error(`Character ${extendedChar.name} missing required agentRole configuration`);
      }

      const extendedCharacter: Character = {
        ...extendedChar,
        settings: extendedChar.settings || {},
        agentRole: extendedChar.agentRole,
      };

      const runtime = await startAgent(extendedCharacter, directClient);
      runtimes.push(runtime);

      console.log('Started agent:', {
        name: runtime.character.name,
        type: runtime.character.agentRole?.type,
        id: runtime.agentId,
        roomId: runtime.clients['aiBetworks']?.getClient()?.getRoomId(),
        port: runtime.clients['aiBetworks']?.getClient()?.getPort(),
        context: runtime.clients['aiBetworks']?.getClient()?.getContext(),
      });
    }

    // // Find GM in runtimes
    // const gmRuntime = runtimes.find(
    //   (r) => r.character.agentRole?.type.toUpperCase() === "GM"
    // );
    // if (gmRuntime) {
    //   // Start debate orchestrator with all runtimes
    //   const orchestrator = new DebateOrchestrator(runtimes);
    //   elizaLogger.log("Waiting for connections to establish...");
    //   await new Promise((resolve) => setTimeout(resolve, 8000));

    //   try {
    //     elizaLogger.log("Starting debate...");
    //     const roomId = process.env.ROOM_ID
    //       ? parseInt(process.env.ROOM_ID)
    //       : 290;
    //     await orchestrator.initialize(roomId);
    //     await orchestrator.startDebate();
    //   } catch (error) {
    //     elizaLogger.error("Error starting debate:", error);
    //   }

    //   process.on("SIGINT", () => {
    //     elizaLogger.log("Stopping debate...");
    //     orchestrator.stopDebate();
    //     process.exit(0);
    //   });
    // }
  } catch (error) {
    elizaLogger.error('Error starting agents:', error);
    process.exit(1);
  }
};

startAgents().catch(error => {
  elizaLogger.error('Unhandled error in startAgents:', error);
  process.exit(1);
});
