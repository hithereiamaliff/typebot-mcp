import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z, ZodObject, ZodRawShape } from "zod";

import {
  createBot,
  listBots,
  getBot,
  updateBot,
  deleteBot,
  publishBot,
  unpublishBot,
  listResults,
  startChat,
} from './tools/bots';

// Configuration schema for smithery.yaml
export const configSchema = z.object({
  TYPEBOT_TOKEN: z.string().describe("API token for Typebot"),
  TYPEBOT_WORKSPACE_ID: z.string().describe("Default workspace ID for Typebot"),
  TYPEBOT_API_URL: z.string().describe("API URL for Typebot")
});

export default function createServer({
  config,
}: {
  config: z.infer<typeof configSchema>;
}) {
  // Set up axios with the token from config
  if (config.TYPEBOT_TOKEN) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${config.TYPEBOT_TOKEN}`;
  }
  
  // Set environment variables for compatibility with existing code
  process.env.TYPEBOT_TOKEN = config.TYPEBOT_TOKEN;
  process.env.TYPEBOT_WORKSPACE_ID = config.TYPEBOT_WORKSPACE_ID;
  process.env.TYPEBOT_API_URL = config.TYPEBOT_API_URL;

  const server = new McpServer({
    name: 'typebot-mcp',
    version: '1.0.3',
  });

  const toolsMap = new Map<string, {
    func: (args: any) => Promise<any>;
    description: string;
    schema: ZodObject<ZodRawShape>;
  }>([
    ['createBot', {
      func: createBot,
      description: 'Create a new Typebot. Requires "name", optional "description"',
      schema: z.object({
        workspaceId: z.string().optional(),
        name:        z.string().min(1, "The 'name' field is required."),
        description: z.string().optional(),
      }),
    }],
    ['listBots', {
      func: listBots,
      description: 'List all Typebots in a workspace',
      schema: z.object({ workspaceId: z.string().optional() }),
    }],
    ['getBot', {
      func: getBot,
      description: 'Get a Typebot by its ID',
      schema: z.object({ botId: z.string().min(1, "El campo 'botId' es obligatorio.") }),
    }],
    ['updateBot', {
      func: updateBot,
      description: 'Update an existing Typebot (e.g., change name)',
      schema: z.object({
        botId:     z.string().min(1, "The 'botId' field is required."),
        typebot:   z.record(z.any()).refine((x: any) => typeof x === 'object', "The 'typebot' field is required."),
        overwrite: z.boolean().optional(),
      }),
    }],
    ['deleteBot', {
      func: deleteBot,
      description: 'Delete a Typebot by its ID',
      schema: z.object({ botId: z.string().min(1, "El campo 'botId' es obligatorio.") }),
    }],
    ['publishBot', {
      func: publishBot,
      description: 'Publish an existing Typebot',
      schema: z.object({ botId: z.string().min(1, "El campo 'botId' es obligatorio.") }),
    }],
    ['unpublishBot', {
      func: unpublishBot,
      description: 'Unpublish an existing Typebot',
      schema: z.object({ botId: z.string().min(1, "El campo 'botId' es obligatorio.") }),
    }],
    ['listResults', {
      func: listResults,
      description: 'List results of a Typebot',
      schema: z.object({
        botId:      z.string().min(1, "The 'botId' field is required."),
        limit:      z.number().int().min(1).max(100).optional(),
        cursor:     z.string().optional(),
        timeFilter: z.string().optional(),
        timeZone:   z.string().optional(),
      }),
    }],
    ['startChat', {
      func: startChat,
      description: 'Start a chat with a Typebot. Requires botId, optional chat.context',
      schema: z.object({
        botId: z.string().min(1, "The 'botId' field is required."),
        chat: z.object({
          context: z.record(z.any()).optional(),
        }).optional(),
      }),
    }],
  ]);

  for (const [name, { func, description, schema }] of toolsMap) {
    server.registerTool(
      name,
      {
        title: name,
        description,
        inputSchema: (schema as ZodObject<ZodRawShape>).shape,
      },
      async (rawArgs: any, _extra: any) => {
        if (process.env.TYPEBOT_TOKEN) {
          axios.defaults.headers.common['Authorization'] =
            `Bearer ${process.env.TYPEBOT_TOKEN}`;
        }

        const parsed = schema.safeParse(rawArgs);
        if (!parsed.success) {
          return {
            content: [{
              type: 'text' as const,
              text: `Validation error in ${name}: ${parsed.error.message}`
            }]
          };
        }

        try {
          const result = await func(parsed.data);
          return {
            content: [{
              type: 'text' as const,
              text: JSON.stringify(result)
            }]
          };
        } catch (e: any) {
          return {
            content: [{
              type: 'text' as const,
              text: `Error in ${name}: ${e.message}`
            }]
          };
        }
      }
    );
  }

  return server.server;
}
