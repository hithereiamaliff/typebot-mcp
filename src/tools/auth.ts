import axios from 'axios';

export interface AuthArgs {
  token?: string;
}

export async function authenticate(args: AuthArgs) {
  const token = args.token || process.env.TYPEBOT_TOKEN;
  if (!token) {
    throw new Error(
      'authenticate: falta token (ni en args ni en process.env.TYPEBOT_TOKEN)'
    );
  }

  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const response = await axios.get(
    'https://app.typebot.io/api/v1/workspaces'
  );

  return {
    message: 'Autenticación exitosa',
    workspaces: response.data,
  };
}
