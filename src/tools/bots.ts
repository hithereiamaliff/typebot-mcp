import axios from 'axios';

// Get API base URL from environment variable
const getApiBaseUrl = () => {
  if (!process.env.TYPEBOT_API_URL) {
    throw new Error('TYPEBOT_API_URL environment variable is not set');
  }
  return process.env.TYPEBOT_API_URL;
};

function ensureAuth() {
  const header = axios.defaults.headers.common['Authorization'];
  if (!header) {
    throw new Error(
      'No token configured. Call authenticate first or define TYPEBOT_TOKEN.'
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
      'createBot: missing workspaceId (neither in args nor in process.env)'
    );
  }

  const payload = {
    workspaceId,
    typebot: {
      name: args.name,
      description: args.description,
    },
  };

  const apiBaseUrl = getApiBaseUrl();
  const response = await axios.post(
    `${apiBaseUrl}/typebots`,
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
      'listBots: missing workspaceId (neither in args nor in process.env)'
    );
  }

  const apiBaseUrl = getApiBaseUrl();
  const response = await axios.get(
    `${apiBaseUrl}/typebots`,
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
  if (!botId) throw new Error('getBot: missing botId');

  const apiBaseUrl = getApiBaseUrl();
  const response = await axios.get(
    `${apiBaseUrl}/typebots/${botId}`
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
  if (!botId) throw new Error('updateBot: missing botId');
  if (typeof changes !== 'object' || Object.keys(changes).length === 0) {
    throw new Error(
      'updateBot: the `typebot` object with fields to change is required'
    );
  }

  const apiBaseUrl = getApiBaseUrl();
  const getRes = await axios.get<{ typebot: { version: string } }>(
    `${apiBaseUrl}/typebots/${botId}`
  );
  const version = getRes.data.typebot.version;
  if (!version) {
    throw new Error(
      'updateBot: could not get the current version of the Typebot'
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
    `${apiBaseUrl}/typebots/${botId}`,
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
  if (!botId) throw new Error('deleteBot: missing botId');

  const apiBaseUrl = getApiBaseUrl();
  const response = await axios.delete(
    `${apiBaseUrl}/typebots/${botId}`
  );
  return response.data;
}

export interface PublishBotArgs {
  botId: string;
}

export async function publishBot(args: PublishBotArgs) {
  ensureAuth(); 
  const { botId } = args;
  if (!botId) throw new Error('publishBot: missing botId');

  const apiBaseUrl = getApiBaseUrl();
  const response = await axios.post(
    `${apiBaseUrl}/typebots/${botId}/publish`,
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
  if (!botId) throw new Error('unpublishBot: missing botId');

  const apiBaseUrl = getApiBaseUrl();
  const response = await axios.post(
    `${apiBaseUrl}/typebots/${botId}/unpublish`,
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

  if (!botId) throw new Error('listResults: missing botId');
  if (limit < 1 || limit > 100) {
    throw new Error('listResults: limit must be between 1 and 100');
  }

  const params: Record<string, any> = { limit, timeFilter };
  if (cursor) params.cursor = cursor;
  if (timeZone) params.timeZone = timeZone;

  const apiBaseUrl = getApiBaseUrl();
  const response = await axios.get(
    `${apiBaseUrl}/typebots/${botId}/results`,
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
  if (!botId) throw new Error('startChat: missing botId');

  const payload: Record<string, any> = {};
  if (chat) payload.chat = chat;

  const apiBaseUrl = getApiBaseUrl();
  const response = await axios.post(
    `${apiBaseUrl}/typebots/${botId}/chat/start`,
    payload
  );
  return response.data;
}