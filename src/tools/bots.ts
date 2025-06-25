import axios from 'axios';

function ensureAuth() {
  const header = axios.defaults.headers.common['Authorization'];
  if (!header) {
    throw new Error(
      'No hay token configurado. Llama primero a authenticate o define TYPEBOT_TOKEN.'
    );
  }
}

export interface CreateBotArgs {
  workspaceId?: string;
  name: string;
  description?: string;
}

export async function createBot(args: CreateBotArgs) {
  ensureAuth(); 
  const workspaceId =
    args.workspaceId || process.env.TYPEBOT_WORKSPACE_ID;
  if (!workspaceId) {
    throw new Error(
      'createBot: falta workspaceId (ni en args ni en process.env)'
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

export interface ListBotsArgs {
  workspaceId?: string;
}

export async function listBots(args: ListBotsArgs = {}) {
  ensureAuth(); 
  const workspaceId =
    args.workspaceId || process.env.TYPEBOT_WORKSPACE_ID;
  if (!workspaceId) {
    throw new Error(
      'listBots: falta workspaceId (ni en args ni en process.env)'
    );
  }

  const response = await axios.get(
    'https://app.typebot.io/api/v1/typebots',
    { params: { workspaceId } }
  );
  return response.data;
}

export interface GetBotArgs {
  botId: string;
}

export async function getBot(args: GetBotArgs) {
  ensureAuth(); 
  const { botId } = args;
  if (!botId) throw new Error('getBot: falta botId');

  const response = await axios.get(
    `https://app.typebot.io/api/v1/typebots/${botId}`
  );
  return response.data;
}

export interface UpdateBotArgs {
  botId: string;
  typebot: Record<string, any>; 
  overwrite?: boolean;
}

export async function updateBot(args: UpdateBotArgs) {
  ensureAuth();

  const { botId, typebot: changes, overwrite = false } = args;
  if (!botId) throw new Error('updateBot: falta botId');
  if (typeof changes !== 'object' || Object.keys(changes).length === 0) {
    throw new Error(
      'updateBot: el objeto `typebot` con campos a cambiar es obligatorio'
    );
  }

  const getRes = await axios.get<{ typebot: { version: string } }>(
    `https://app.typebot.io/api/v1/typebots/${botId}`
  );
  const version = getRes.data.typebot.version;
  if (!version) {
    throw new Error(
      'updateBot: no pude obtener la versión actual del Typebot'
    );
  }

  const payload: Record<string, any> = {
    typebot: {
      version,
      ...changes
    }
  };
  if (overwrite) {
    payload.overwrite = true;
  }

  const patchRes = await axios.patch(
    `https://app.typebot.io/api/v1/typebots/${botId}`,
    payload
  );
  return patchRes.data;
}

export interface DeleteBotArgs {
  botId: string;
}

export async function deleteBot(args: DeleteBotArgs) {
  ensureAuth(); 
  const { botId } = args;
  if (!botId) throw new Error('deleteBot: falta botId');

  const response = await axios.delete(
    `https://app.typebot.io/api/v1/typebots/${botId}`
  );
  return response.data;
}

export interface PublishBotArgs {
  botId: string;
}

export async function publishBot(args: PublishBotArgs) {
  ensureAuth(); 
  const { botId } = args;
  if (!botId) throw new Error('publishBot: falta botId');

  const response = await axios.post(
    `https://app.typebot.io/api/v1/typebots/${botId}/publish`,
    {}
  );
  return response.data;
}

export interface UnpublishBotArgs {
  botId: string;
}

export async function unpublishBot(args: UnpublishBotArgs) {
  ensureAuth();  
  const { botId } = args;
  if (!botId) throw new Error('unpublishBot: falta botId');

  const response = await axios.post(
    `https://app.typebot.io/api/v1/typebots/${botId}/unpublish`,
    {}
  );
  return response.data;
}

export interface ListResultsArgs {
  botId: string;
  limit?: number;
  cursor?: string;
  timeFilter?:
    | 'today'
    | 'last7Days'
    | 'last30Days'
    | 'monthToDate'
    | 'lastMonth'
    | 'yearToDate'
    | 'allTime';
  timeZone?: string;
}

export async function listResults(args: ListResultsArgs) {
  ensureAuth(); 
  const {
    botId,
    limit = 50,
    cursor,
    timeFilter = 'last7Days',
    timeZone,
  } = args;

  if (!botId) throw new Error('listResults: falta botId');
  if (limit < 1 || limit > 100) {
    throw new Error('listResults: limit debe estar entre 1 y 100');
  }

  const params: Record<string, any> = { limit, timeFilter };
  if (cursor) params.cursor = cursor;
  if (timeZone) params.timeZone = timeZone;

  const response = await axios.get(
    `https://app.typebot.io/api/v1/typebots/${botId}/results`,
    { params }
  );
  return response.data;
}

export interface StartChatArgs {
  botId: string;
  chat?: {
    context?: Record<string, any>;
  };
}

export async function startChat(args: StartChatArgs) {
  ensureAuth();

  const { botId, chat } = args;
  if (!botId) throw new Error('startChat: falta botId');

  const payload: Record<string, any> = {};
  if (chat) payload.chat = chat;

  const response = await axios.post(
    `https://app.typebot.io/api/v1/typebots/${botId}/chat/start`,
    payload
  );
  return response.data;
}