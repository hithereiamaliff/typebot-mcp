import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
if (process.env.TYPEBOT_TOKEN) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.TYPEBOT_TOKEN}`;
}

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
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

async function main() {
  const server = new McpServer({
    name: 'mcp-typebot',
    version: '1.0.0',
  });

  const toolsMap = new Map<string, {
    func: (args: any) => Promise<any>;
    description: string;
    schema: ZodObject<ZodRawShape>;
  }>([
    ['createBot', {
      func: createBot,
      description: 'Crea un nuevo Typebot. Requiere “name”, opcional “description”',
      schema: z.object({
        workspaceId: z.string().optional(),
        name:        z.string().min(1, "El campo 'name' es obligatorio."),
        description: z.string().optional(),
      }),
    }],
    ['listBots', {
      func: listBots,
      description: 'Lista todos los Typebots de un workspace',
      schema: z.object({ workspaceId: z.string().optional() }),
    }],
    ['getBot', {
      func: getBot,
      description: 'Recupera un Typebot por su ID',
      schema: z.object({ botId: z.string().min(1, "El campo 'botId' es obligatorio.") }),
    }],
    ['updateBot', {
      func: updateBot,
      description: 'Actualiza un Typebot existente (p.ej. cambia nombre)',
      schema: z.object({
        botId:     z.string().min(1, "El campo 'botId' es obligatorio."),
        typebot:   z.record(z.any()).refine(x => typeof x === 'object', "El campo 'typebot' es obligatorio."),
        overwrite: z.boolean().optional(),
      }),
    }],
    ['deleteBot', {
      func: deleteBot,
      description: 'Elimina un Typebot por su ID',
      schema: z.object({ botId: z.string().min(1, "El campo 'botId' es obligatorio.") }),
    }],
    ['publishBot', {
      func: publishBot,
      description: 'Publica un Typebot existente',
      schema: z.object({ botId: z.string().min(1, "El campo 'botId' es obligatorio.") }),
    }],
    ['unpublishBot', {
      func: unpublishBot,
      description: 'Despublica un Typebot existente',
      schema: z.object({ botId: z.string().min(1, "El campo 'botId' es obligatorio.") }),
    }],
    ['listResults', {
      func: listResults,
      description: 'Lista resultados de un Typebot',
      schema: z.object({
        botId:      z.string().min(1, "El campo 'botId' es obligatorio."),
        limit:      z.number().int().min(1).max(100).optional(),
        cursor:     z.string().optional(),
        timeFilter: z.string().optional(),
        timeZone:   z.string().optional(),
      }),
    }],
    ['startChat', {
      func: startChat,
      description: 'Inicia un chat con un Typebot. Requiere botId, opcional chat.context',
      schema: z.object({
        botId: z.string().min(1, "El campo 'botId' es obligatorio."),
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
              text: `Error de validación en ${name}: ${parsed.error.message}`
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
              text: `Error en ${name}: ${e.message}`
            }]
          };
        }
      }
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(err => {
  console.error('Error al arrancar MCP server:', err);
  process.exit(1);
});
