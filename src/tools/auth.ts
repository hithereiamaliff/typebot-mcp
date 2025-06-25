import axios from 'axios';

export interface AuthArgs {
  token: string;
}

/**
 * Configura el bearer token y prueba la conexión
 */
export async function authenticate(args: AuthArgs) {
  const { token } = args;
  // 1) Guarda el token para futuras peticiones
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // 2) Haz una petición de prueba: listar workspaces
  const response = await axios.get('https://app.typebot.io/api/v1/workspaces');
  return response.data; // devolvemos directamente los datos
}
