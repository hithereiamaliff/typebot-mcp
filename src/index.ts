import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

import { authenticate } from './tools/auth';
import {
  createBot,
  listBots,
  getBot,
  updateBot,
  deleteBot,
  publishBot, 
  unpublishBot,
  listResults 
} from './tools/bots';

// ———————————————————————————————
// 1. Declaración de la colección de herramientas
// ———————————————————————————————
type ToolFn = (args: any) => Promise<any>;
const tools = new Map<string, { func: ToolFn; description: string }>();

// ———————————————————————————————
// 2. Registro de herramientas
// ———————————————————————————————
tools.set('authenticate', {
  func: authenticate,
  description:
    'Configura tu API token de Typebot y verifica que sea válido (usa TYPEBOT_TOKEN en .env)',
});
tools.set('createBot', {
  func: createBot,
  description: 'Crea un nuevo Typebot con nombre y descripción opcional',
});
tools.set('listBots', {
  func: listBots,
  description:
    'Lista todos los Typebots de un workspace (workspaceId en args o en .env)',
});
tools.set('getBot', {
  func: getBot,
  description: 'Recupera un Typebot por su ID',
});
tools.set('updateBot', {
  func: updateBot,
  description:
    'Actualiza un Typebot existente. Parámetros: botId, typebot (campos a cambiar), overwrite?',
});
tools.set('deleteBot', {
  func: deleteBot,
  description: 'Elimina un Typebot por su ID',
});

tools.set('publishBot', {
  func: publishBot,
  description: 'Publica un Typebot existente (botId requerido)'
});

tools.set('unpublishBot', {
  func: unpublishBot,
  description: 'Despublica un Typebot existente (botId requerido)'
});

tools.set('listResults', {
  func: listResults,
  description:
    'Lista resultados de un Typebot. Parámetros: botId, limit?, cursor?, timeFilter?, timeZone?'
});

// ———————————————————————————————
// 3. Configuración global de Axios (token desde .env)
// ———————————————————————————————
const token = process.env.TYPEBOT_TOKEN;
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
  console.warn(
    '⚠️  No se encontró TYPEBOT_TOKEN en .env. Algunas operaciones fallarán sin autenticación.'
  );
}

// ———————————————————————————————
// 4. Tipos para la petición y respuesta MCP
// ———————————————————————————————
interface InvokeRequest {
  tool: string;
  arguments: Record<string, any>;
}

interface InvokeResponse {
  ok: boolean;
  result?: any;
  error?: string;
}

// ———————————————————————————————
// 5. Función genérica para invocar herramientas
// ———————————————————————————————
async function invokeTool(toolName: string, args: any): Promise<any> {
  const entry = tools.get(toolName);
  if (!entry) {
    throw new Error(`Herramienta desconocida: ${toolName}`);
  }
  return entry.func(args);
}

// ———————————————————————————————
// 6. Middleware de validación básica
// ———————————————————————————————
function validateInvoke(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const body = req.body as Partial<InvokeRequest>;
  if (typeof body.tool !== 'string') {
    res.json({ ok: false, error: '`tool` debe ser un string' });
    return;
  }
  if (typeof body.arguments !== 'object' || body.arguments === null) {
    res.json({ ok: false, error: '`arguments` debe ser un objeto' });
    return;
  }
  next();
}

// ———————————————————————————————
// 7. Arranque del servidor y endpoint /invoke
// ———————————————————————————————
async function main(): Promise<void> {
  const app = express();
  app.use(bodyParser.json());

  app.post(
    '/invoke',
    validateInvoke,
    async (req: Request<{}, {}, InvokeRequest>, res: Response<InvokeResponse>) => {
      const { tool: toolName, arguments: args } = req.body;
      try {
        const result = await invokeTool(toolName, args);
        res.json({ ok: true, result });
      } catch (e: any) {
        res.json({ ok: false, error: e.message });
      }
    }
  );

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`MCP-Typebot escuchando en http://localhost:${PORT}`)
  );
}

main().catch((err) => {
  console.error('Error al arrancar el servidor:', err);
  process.exit(1);
});
