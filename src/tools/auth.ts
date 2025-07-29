import axios from 'axios';

export interface AuthArgs {
  token?: string;
}

export async function authenticate(args: AuthArgs) {
  const token = args.token || process.env.TYPEBOT_TOKEN;
  if (!token) {
    throw new Error(
      'authenticate: missing token (neither in args nor in process.env.TYPEBOT_TOKEN)'
    );
  }

  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  if (!process.env.TYPEBOT_API_URL) {
    throw new Error('TYPEBOT_API_URL environment variable is not set');
  }
  const apiBaseUrl = process.env.TYPEBOT_API_URL;
  const response = await axios.get(
    `${apiBaseUrl}/workspaces`
  );

  return {
    message: 'Authentication successful',
    workspaces: response.data,
  };
}
