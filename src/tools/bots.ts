import axios from 'axios';

//
// CREATE BOT
//
export interface CreateBotArgs {
  /** Opcional: si no se pasa, lo tomamos de process.env.TYPEBOT_WORKSPACE_ID */
  workspaceId?: string;
  /** Nombre del nuevo typebot */
  name: string;
  /** Descripción opcional */
  description?: string;
}

export async function createBot(args: CreateBotArgs) {
  const workspaceId = args.workspaceId || process.env.TYPEBOT_WORKSPACE_ID;
  if (!workspaceId) {
    throw new Error(
      'createBot: falta workspaceId (ni en args ni en process.env.TYPEBOT_WORKSPACE_ID)'
    );
  }

  const payload = {
    workspaceId,
    typebot: {
      name: args.name,
      description: args.description,
    },
  };

  const response = await axios.post(
    'https://app.typebot.io/api/v1/typebots',
    payload
  );
  return response.data;
}

//
// LIST BOTS
//
export interface ListBotsArgs {
  /** Opcional: si no se pasa, lo tomamos de process.env.TYPEBOT_WORKSPACE_ID */
  workspaceId?: string;
}

export async function listBots(args: ListBotsArgs = {}) {
  const workspaceId = args.workspaceId || process.env.TYPEBOT_WORKSPACE_ID;
  if (!workspaceId) {
    throw new Error(
      'listBots: falta workspaceId (ni en args ni en process.env.TYPEBOT_WORKSPACE_ID)'
    );
  }

  const response = await axios.get(
    'https://app.typebot.io/api/v1/typebots',
    { params: { workspaceId } }
  );
  return response.data;
}

//
// GET BOT
//
export interface GetBotArgs {
  /** ID del typebot a consultar */
  botId: string;
}

export async function getBot(args: GetBotArgs) {
  const { botId } = args;
  if (!botId) {
    throw new Error('getBot: falta botId');
  }
  const response = await axios.get(
    `https://app.typebot.io/api/v1/typebots/${botId}`
  );
  return response.data;
}

//
// UPDATE BOT
//
export interface UpdateBotArgs {
  /** ID del typebot a actualizar */
  botId: string;
  /** Campos V6 a modificar */
  typebot: Record<string, any>;
  /** Si true, fuerza el overwrite en conflicto */
  overwrite?: boolean;
}

export async function updateBot(args: UpdateBotArgs) {
  const { botId, typebot, overwrite = false } = args;
  if (!botId) {
    throw new Error('updateBot: falta botId');
  }
  if (typeof typebot !== 'object') {
    throw new Error('updateBot: falta objeto typebot con la actualización');
  }

  const payload: Record<string, any> = { typebot };
  if (overwrite) payload.overwrite = true;

  const response = await axios.patch(
    `https://app.typebot.io/api/v1/typebots/${botId}`,
    payload
  );
  return response.data;
}

//
// DELETE BOT
//
export interface DeleteBotArgs {
  /** ID del typebot a eliminar */
  botId: string;
}

export async function deleteBot(args: DeleteBotArgs) {
  const { botId } = args;
  if (!botId) {
    throw new Error('deleteBot: falta botId');
  }
  const response = await axios.delete(
    `https://app.typebot.io/api/v1/typebots/${botId}`
  );
  return response.data;
}

//
// PUBLISH BOT
//
export interface PublishBotArgs {
  /** ID del typebot que quieres publicar */
  botId: string;
}
export async function publishBot(args: PublishBotArgs) {
  const { botId } = args;
  if (!botId) throw new Error('publishBot: falta botId');

  // Enviar un payload JSON vacío para que el servidor acepte el Content-Type
  const response = await axios.post(
    `https://app.typebot.io/api/v1/typebots/${botId}/publish`,
    {}
  );
  return response.data;  // { message: "success" }
}

//
// UNPUBLISH BOT
//
export interface UnpublishBotArgs {
  /** ID del typebot que quieres despublicar */
  botId: string;
}
export async function unpublishBot(args: UnpublishBotArgs) {
  const { botId } = args;
  if (!botId) throw new Error('unpublishBot: falta botId');

  // Mismo patrón: payload vacío
  const response = await axios.post(
    `https://app.typebot.io/api/v1/typebots/${botId}/unpublish`,
    {}
  );
  return response.data;  // { message: "success" }
}

//
// LIST RESULTS
//
export interface ListResultsArgs {
  /** ID del Typebot del que quieres listar los resultados */
  botId: string;
  /** Límite de elementos a devolver (1–100). Default: 50 */
  limit?: number;
  /** Cursor para paginación (opcional) */
  cursor?: string;
  /** Filtro temporal. Opciones: 'today','last7Days','last30Days','monthToDate','lastMonth','yearToDate','allTime'. Default: 'last7Days' */
  timeFilter?: 'today'|'last7Days'|'last30Days'|'monthToDate'|'lastMonth'|'yearToDate'|'allTime';
  /** Zona horaria en formato IANA (ej. 'America/Bogota') */
  timeZone?: string;
}

export async function listResults(args: ListResultsArgs) {
  const {
    botId,
    limit = 50,
    cursor,
    timeFilter = 'last7Days',
    timeZone,
  } = args;

  if (!botId) {
    throw new Error('listResults: falta botId');
  }
  if (limit < 1 || limit > 100) {
    throw new Error('listResults: limit debe estar entre 1 y 100');
  }

  const params: Record<string, any> = { limit, timeFilter };
  if (cursor)   params.cursor   = cursor;
  if (timeZone) params.timeZone = timeZone;

  const response = await axios.get(
    `https://app.typebot.io/api/v1/typebots/${botId}/results`,
    { params }
  );
  return response.data;
}