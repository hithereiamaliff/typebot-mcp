Endpoint

bash
Copiar
Editar
POST https://app.typebot.io/api/v1/typebots
Headers

Authorization: Bearer <TOKEN>

Content-Type: application/json

Body schema

jsonc
Copiar
Editar
{
  "workspaceId": "string",        // required: ID de tu workspace
  "typebot": {                    // required: objeto con la definición del bot
    "name": "string",             // required: nombre del bot
    "icon?": "string",            // URL o identificador de icono
    "selectedThemeTemplateId?": "string",
    "groups?": [                  // flujo de conversación (nodos)
      {
        "id?": "string",
        "title?": "string",
        "graphCoordinates": { "x": number, "y": number },
        "blocks": [
          {
            "id": "string",
            "outgoingEdgeId?": "string",
            "type": "start" | "message" | "question" | /*…otros tipos*/,
            "label?": "string"
          }
        ]
      }
    ],
    "events?": [                  // eventos de inicio / triggers
      {
        "id?": "string",
        "outgoingEdgeId?": "string",
        "graphCoordinates": { "x": number, "y": number },
        "type": "start" | /*…otros tipos*/
      }
    ],
    "theme?": {                   // personalización visual
      "general?": {
        "font?": "string",
        "background?": { "type": "Color"|/*…*/, "content": "string" },
        "progressBar?": {
          "isEnabled": boolean,
          "color?": "string",
          "backgroundColor?": "string",
          "placement?": "Top"|"Bottom",
          "thickness?": number,
          "position?": "fixed"|"relative"
        }
      },
      "chat?": {
        "container?": {
          "maxWidth?": "string",
          "maxHeight?": "string",
          "backgroundColor?": "string",
          "color?": "string",
          "blur?": number,
          "opacity?": number,
          "shadow?": "none"|/*…*/,
          "border?": {
            "thickness?": number,
            "color?": "string",
            "roundeness?": "none"|/*…*/,
            "customRoundeness?": number,
            "opacity?": number
          }
        },
        "hostAvatar?": { "isEnabled": boolean, "url?": "string" },
        "guestAvatar?": { "isEnabled": boolean, "url?": "string" },
        "hostBubbles?": {/* similar a container.border */},
        "guestBubbles?": {/* … */},
        "buttons?": {/* … */},
        "inputs?": {/* … */},
        "roundness?": "none"|/*…*/,
        "buttonsInput?": { "layout?": "wrap"|/*…*/ }
      },
      "customCss?": "string"
    },
    "settings?": {                // comportamiento y opciones
      "general?": {
        "isBrandingEnabled?": boolean,
        "isTypingEmulationEnabled?": boolean,
        "isInputPrefillEnabled?": boolean,
        "isHideQueryParamsEnabled?": boolean,
        "isNewResultOnRefreshEnabled?": boolean,
        "rememberUser?": { "isEnabled": boolean, "storage": "session"|"local" },
        "systemMessages?": { /* varios textos de error y alertas */ }
      },
      "typingEmulation?": { "enabled": boolean, "speed?": number, /*…*/ },
      "metadata?": { "title?": "string", "description?": "string", /*…*/ },
      "whatsApp?": { "isEnabled": boolean, /*…*/ },
      "publicShare?": { "isEnabled": boolean },
      "security?": { "allowedOrigins?": ["string"] }
    },
    "folderId?": "string",         // sitúa el bot dentro de una carpeta
    "variables?": [                // variables de entorno del bot
      { "id?": "string", "name": "string", "isSessionVariable": boolean, "value": "string" }
    ],
    "edges?": [                    // conexiones entre grupos/bloques
      {
        "id?": "string",
        "from": { "blockId": "string", "itemId?": "string", "pathId?": "string" },
        "to": { "groupId": "string", "blockId": "string" }
      }
    ],
    "resultsTablePreferences?": {
      "columnsOrder?": ["string"],
      "columnsVisibility?": { [columnId: string]: boolean },
      "columnsWidth?": { [columnId: string]: number }
    },
    "publicId?": "string",         // slug público
    "customDomain?": "string"      // dominio propio
  }
}
Campos con ? son opcionales.

Estructuras anidadas (groups, events, theme, settings, etc.) las puedes omitir por completo y el bot se creará con valores por defecto.

Para documentación interna, puedes pegar esta definición como un bloque de JSON Schema o TS-Interface y ajustarla a tus necesidades.








Invocación vía MCP

http
Copiar
Editar
POST http://localhost:3000/invoke
Content-Type: application/json

{
  "tool": "listBots",
  "arguments": {
    // opcional: workspaceId; si no se pasa, se lee de TYPEBOT_WORKSPACE_ID en .env
    "workspaceId": "cm1vizqdr000rvag38p36itox"
  }
}
💡 Si ya defines TYPEBOT_WORKSPACE_ID en tu .env, puedes omitir workspaceId en arguments.

Argumentos
Argumento	Tipo	Requisito	Descripción
workspaceId	string	opcional (pero necesario si no está en .env)	ID del workspace en el que listar los bots.

Response exitosa
json
Copiar
Editar
{
  "ok": true,
  "result": {
    "typebots": [
      {
        "id": "cm2o1m4x30001s2kmxqdx7u4m",
        "name": "SEO chat",
        "icon": null,
        "accessRight": "write",
        "publishedTypebotId": null
      },
      {
        "id": "cm2o0xkoy000e9fapcf729x78",
        "name": "Crypto test",
        "icon": null,
        "accessRight": "write",
        "publishedTypebotId": null
      }
      /* … más typebots … */
    ]
  }
}
typebots (array): listado de bots en el workspace.

id (string): identificador único del bot.

name (string): nombre del bot.

icon (string|null): URL o identificador de icono, si está definido.

accessRight ("write"|"read"): nivel de permisos.

publishedTypebotId (string|null): si el bot está publicado, su ID público; null si no.

Response de error
400 Bad Request: falta workspaceId y no está en .env

json
Copiar
Editar
{ "ok": false, "error": "listBots: falta workspaceId (ni en args ni en process.env.TYPEBOT_WORKSPACE_ID)" }
401 Unauthorized: token ausente o inválido

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 401" }
500 Internal Server Error: error interno / fallo de red

json
Copiar
Editar
{ "ok": false, "error": "Network Error" }
Implementación en src/tools/bots.ts
ts
Copiar
Editar
export interface ListBotsArgs {
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
Eso es todo para listBots. Si necesitas ajustar algo más, ¡dime!


Invocación vía MCP

http
Copiar
Editar
POST http://localhost:3000/invoke
Content-Type: application/json

{
  "tool": "authenticate",
  "arguments": {
    "token": "<TU_TOKEN_AQUÍ>"
  }
}
Este paso sólo debe ejecutarse una vez por sesión o cuando cambies de token. Configura el header Authorization para todas las llamadas siguientes.

Argumentos
Argumento	Tipo	Requisito	Descripción
token	string	required	Tu API token de Typebot (Bearer token).

Response exitosa
json
Copiar
Editar
{
  "ok": true,
  "result": {
    "workspaces": [
      {
        "id": "cm1vizqdr000rvag38p36itox",
        "name": "Osdeibi Acurero's workspace",
        "icon": null,
        "plan": "FREE"
      }
      // …otros workspaces si los tienes…
    ]
  }
}
workspaces (array): lista de workspaces accesibles con este token.

id: identificador del workspace.

name: nombre del workspace.

icon: URL o null si no tiene icono.

plan: plan de Typebot asociado (FREE, PRO, etc.).

Responses de error
400 Bad Request (JSON inválido o falta de token):

json
Copiar
Editar
{ "ok": false, "error": "`token` debe ser un string" }
401 Unauthorized (token inválido o expirado):

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 401" }
500 Internal Server Error (fallo de red, sin conexión, etc.):

json
Copiar
Editar
{ "ok": false, "error": "Network Error" }
Implementación en src/tools/auth.ts
ts
Copiar
Editar
import axios from 'axios';

export interface AuthArgs {
  token: string;
}

/**
 * Configura el bearer token para todas las peticiones Axios
 * y prueba la conexión listando los workspaces.
 */
export async function authenticate(args: AuthArgs) {
  const { token } = args;

  // 1) Inyecta el header en axios
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // 2) Llamada de prueba
  const response = await axios.get(
    'https://app.typebot.io/api/v1/workspaces'
  );

  // 3) Devuelve la lista de workspaces
  return response.data;
}
— Asegúrate de que, tras invocar authenticate, todas las demás herramientas (listBots, createBot, etc.) usarán automáticamente ese token en su header.








Invocación vía MCP

http
Copiar
Editar
POST http://localhost:3000/invoke
Content-Type: application/json

{
  "tool": "getBot",
  "arguments": {
    "botId": "<ID_DEL_TYPEBOT>"
  }
}
Argumentos
Argumento	Tipo	Requerido	Descripción
botId	string	sí	ID único del Typebot que quieres recuperar.

Response exitosa
jsonc
Copiar
Editar
{
  "ok": true,
  "result": {
    "typebot": {
      "version": "6",                 
      "id": "cm2o1m4x30001s2kmxqdx7u4m",
      "name": "SEO chat",
      "events": [                     // lista de nodos de inicio o triggers
        {
          "id": "xi29yuog67g6br9a4t4i76qh",
          "outgoingEdgeId": "f05arh7ekz1ehp4e60d5q5e7",
          "graphCoordinates": { "x": -62, "y": -96 },
          "type": "start"
        }
      ],
      "groups": [                     // definición de los grupos y bloques
        {
          "id": "kq57mzm1yd1s4hvft624e3b0",
          "title": "SEO API",
          "graphCoordinates": { "x": 296, "y": -189 },
          "blocks": [
            {
              "id": "q0gmmi45x0o8otvpxey5xlih",
              "type": "Webhook",
              "options": {
                "responseVariableMapping": [
                  { "id": "...", "variableId": "...", "bodyPath": "data.domain" },
                  // …
                ],
                "webhook": {
                  "method": "GET",
                  "url": "http://seo-api-seoenespanol.vercel.app/api/seo/osdeibi.dev"
                }
              }
            },
            {
              "id": "rrxbwhlxilarxl0ss18ilpqy",
              "type": "text",
              "content": {
                "richText": [
                  { "type": "p", "children": [{ "text": "tus datos son:" }] },
                  // …
                ]
              }
            }
          ]
        },
        // …otros grupos…
      ],
      "edges": [                     // aristas que conectan eventos, bloques y grupos
        {
          "id": "f05arh7ekz1ehp4e60d5q5e7",
          "from": { "eventId": "xi29yuog67g6br9a4t4i76qh" },
          "to": { "groupId": "grw6ehauu3hms3tupb4jcsu4", "blockId": "ikw8jl3z5l9r3qg9n5ks18uk" }
        },
        // …
      ],
      "variables": [                 // variables usadas en el flujo
        { "id": "vt54kk49ec3m6er5cpri1doz0", "name": "user_domain",      "isSessionVariable": false },
        { "id": "vg4haehe5yzaj4gtvh7afpbcg", "name": "r_img_count_svg",  "isSessionVariable": true },
        // …
      ],
      "theme": {                     // configuración visual (solo un ejemplo)
        "chat": { "hostAvatar": { "isEnabled": false } }
      },
      "selectedThemeTemplateId": null,
      "settings": {                  // ajustes de comportamiento mínimos
        "general": { "isBrandingEnabled": true }
      },
      "createdAt": "2024-10-25T01:17:55.431Z",
      "updatedAt": "2024-10-26T06:03:15.880Z",
      "icon": null,
      "folderId": null,
      "publicId": "seo-chat-qdx7u4m",
      "customDomain": null,
      "workspaceId": "cm1vizqdr000rvag38p36itox",
      "resultsTablePreferences": null,
      "isArchived": false,
      "isClosed": false,
      "whatsAppCredentialsId": null,
      "riskLevel": null,
      "currentUserMode": "write"
    }
  }
}
Campos clave de typebot
Campo	Tipo	Descripción
version	string	Versión interna del bot.
id	string	ID único del Typebot.
name	string	Nombre del bot.
events	Event[]	Lista de eventos de inicio/trigger.
groups	Group[]	Grupos con sus bloques (flujo de conversación).
edges	Edge[]	Conexiones entre eventos, bloques y grupos.
variables	Variable[]	Variables definidas en el bot.
theme	object	Configuración visual básica.
selectedThemeTemplateId	string | null	Plantilla de tema seleccionada.
settings	object	Opciones de comportamiento (general, etc.).
createdAt, updatedAt	string (ISO8601)	Tiempos de creación y última modificación.
icon, folderId	string | null	Icono y carpeta asociada (si aplica).
publicId, customDomain	string | null	Identificador público y dominio personalizado.
workspaceId	string	ID del workspace al que pertenece.
resultsTablePreferences	object | null	Preferencias de tabla de resultados.
isArchived, isClosed	boolean	Estado de archivo o cerrado.
whatsAppCredentialsId	string | null	ID de credenciales de WhatsApp (si aplica).
riskLevel	string | null	Nivel de riesgo asignado (interno).
currentUserMode	string	Permiso del usuario actual (write o read).

Responses de error
400 Bad Request

json
Copiar
Editar
{ "ok": false, "error": "`botId` debe ser un string" }
401 Unauthorized

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 401" }
404 Not Found

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 404" }
500 Internal Server Error

json
Copiar
Editar
{ "ok": false, "error": "Network Error" }
Implementación en src/tools/bots.ts
ts
Copiar
Editar
export interface GetBotArgs {
  botId: string;
}

export async function getBot(args: GetBotArgs) {
  if (!args.botId) {
    throw new Error('getBot: falta botId');
  }
  const response = await axios.get(
    `https://app.typebot.io/api/v1/typebots/${args.botId}`
  );
  return response.data;
}
Con esta documentación ya tienes un resumen completo de los datos que devuelve getBot.








Omitir e ir al contenido
Historial del chat

Tú dijiste:
entiendes este proyecto? https://github.com/AiondaDotCom/mcp-wordpress
ChatGPT Plus

Pensó durante 6 segundos
Sí, lo entiendo perfectamente. Este proyecto es un servidor MCP (Model Context Protocol) para gestionar de forma completa un CMS de WordPress a través de la REST API v2 de WordPress. Está implementado en TypeScript/Node.js, lo que proporciona tipado estricto, módulos ES modernos y una excelente experiencia de desarrollo con IntelliSense y verificación de tipos en tiempo de compilación 
github.com
.

Entre sus características principales:

Integración con WordPress REST API v2: permite crear, leer, actualizar y eliminar contenidos (entradas, páginas, medios), así como gestionar usuarios, taxonomías, comentarios, ajustes del sitio, temas y plugins 
github.com
.

Arquitectura MCP: se sitúa entre un cliente MCP (por ejemplo, Claude u otro LLM) y un sitio WordPress. El flujo es:

El LLM envía peticiones al servidor MCP-WordPress.

El servidor traduce esas peticiones a llamadas REST.

WordPress ejecuta las operaciones y devuelve los resultados, que el servidor MCP reenvía al cliente 
github.com
.

Herramientas y organización:

54 herramientas agrupadas en 8 categorías (Posts, Pages, Media, Users, Comments, Taxonomies, Site Management, Authentication) para cubrir prácticamente todas las operaciones posibles en WordPress 
github.com
.

Scripts auxiliares:

npm run setup (o npx @aiondadotcom/mcp-wordpress setup) – asistente interactivo de configuración.

npm run status – diagnóstico de conexión y carga de herramientas.

npm run test:mcp – suite de pruebas de integración completa 
github.com
.

Flujo de instalación y uso rápido:

NPX: npx @aiondadotcom/mcp-wordpress (sin instalación local).

Local: clonar el repositorio, instalar dependencias, configurar .env con las credenciales de WordPress y lanzar el servidor con npm start.

Integración con Claude Desktop: se añade al archivo claude_desktop_config.json para que el LLM disponga de las herramientas WordPress directamente 
github.com
.

¿Te interesa que te ayude a instalarlo, configurarlo o a profundizar en alguna de sus partes (por ejemplo, extender alguna herramienta, ajustar la autenticación o personalizar el asistente de configuración)?

Tú dijiste:
se puede hacer un MCP para administrar typebot?
ChatGPT Plus

Pensó durante un par de segundos
Sí. Un MCP para administrar Typebot funcionaría de manera muy similar al de WordPress, siempre y cuando Typebot exponga una API (REST u OpenAPI) lo bastante completa. La idea clave es:

Definir las “herramientas” (tools) que el LLM podrá invocar, agrupadas por dominio:

Bots: crear, clonar, listar, eliminar bots.

Flows: crear/actualizar flujos de conversación, ramas, condiciones.

Blocks: añadir o modificar bloques de pregunta, texto, integraciones.

Webhooks / Integraciones: configurar endpoints externos, variables de entorno.

Analytics / Responses: consultar respuestas de usuarios, métricas, exportar datos.

Orientar cada tool a un endpoint de la API de Typebot. Por ejemplo:

createBot({ name, description }) → POST /bots

updateFlow({ botId, flowId, steps }) → PUT /bots/{botId}/flows/{flowId}

listResponses({ botId, dateFrom, dateTo }) → GET /bots/{botId}/responses

Implementarlo en TypeScript/Node.js para aprovechar:

Tipado fuerte (interfaces generadas a partir del esquema OpenAPI).

Módulos ES y bundling ligeros.

Scripts CLI: mcp-typebot setup, mcp-typebot status, mcp-typebot test.

Circuito de petición:

El cliente (p. ej. un LLM) envía un objeto { tool: "updateFlow", args: { … } }.

El servidor MCP traduce internamente a una llamada HTTP a Typebot.

La API de Typebot devuelve el resultado, que se pasa de vuelta al LLM.

Beneficios:

Autocompletado y validación de parámetros.

Registro centralizado de todas las operaciones de bot.

Posibilidad de “playbooks” automáticos: backup de flujos, despliegue de nuevas versiones, rollback,…

Pasos para arrancar:

Revisar la documentación de la API de Typebot y, si existe, descargar o generar el cliente OpenAPI (openapi-generator, @openapitools/openapi-generator-cli).

Crear un esqueleto de proyecto con npm init o npm create y una estructura parecida a:

src/
  tools/
    bots.ts
    flows.ts
    responses.ts
  index.ts      // arranca el servidor MCP
  cli.ts        // comandos de setup/status/test
Definir el protocolo MCP (qué JSON espera el LLM y qué le devuelve).

Escribir pruebas de integración para cada herramienta (jest, mocha).

¿Quieres que te ayude a esbozar el package.json y la estructura de carpetas, o a generar los primeros ejemplos de “tools” para CRUD de bots y flujos en TypeScript?

Tú dijiste:
esta es la api https://docs.typebot.io/api-reference/authentication
ChatGPT Plus

Pensó durante 6 segundos
Claro. La autenticación en Typebot es muy sencilla (token-based) y no hay endpoints de “login” ni “refresh” en la API: simplemente generas un token en tu dashboard y lo envías en el header Authorization: Bearer <token> en todas las llamadas 
docs.typebot.io
. Para tu MCP de Typebot convendría:

Herramienta de autenticación

Nombre: authenticate

Descripción: “Configura el token de API de Typebot y verifica la conexión”.

Parámetros:

{
  token: string
}
Implementación (pseudocódigo):

import axios from 'axios';

export async function authenticate({ token }: { token: string }) {
  // 1) Configurar header global
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // 2) Probar petición simple (por ejemplo, listar workspaces)
  const response = await axios.get('https://api.typebot.io/api/workspaces');
  return response.data; // si falla, axios lanzará un error
}
Flujo en el CLI:

# mcp-typebot setup
> Introduce tu API token de Typebot: *******************
✔ Conexión válida (12 workspaces encontrados)
Integrar la herramienta en el servidor MCP
En tu index.ts o donde definas el router de herramientas, añade:

import { authenticate } from './tools/auth';

// dentro del map de herramientas que expones al LLM
tools.set('authenticate', {
  func: authenticate,
  description: 'Configura tu token y comprueba que es válido',
  args: {
    token: { type: 'string', description: 'Tu API token de Typebot' }
  }
});
Uso por parte del LLM
El LLM enviaría, por ejemplo:

{
  "tool": "authenticate",
  "arguments": { "token": "míaTrèsSecreto123" }
}
Y recibirá la lista de workspaces como prueba de que el token funciona.

A partir de ahí, todas las demás herramientas (bots, flows, responses…) no necesitan preocuparse por la autenticación: axios ya incluirá el header automáticamente. Así tu MCP mantiene el mismo patrón de “tools” que para WordPress, pero usando el simple esquema de bearer token de Typebot.

Tú dijiste:
ok perfecto, me puedes dar los pasos desde cero para hacer mi MCP, vamos de espacio no te saltes ningun paso y vamos a ir probando cada uno de a poco
ChatGPT Plus

Pensó durante un par de segundos
Perfecto. Vamos a construir tu MCP para Typebot desde cero, paso a paso, sin saltarnos nada. En cada bloque te propondré una tarea concreta y esperaremos a que la ejecutes y compruebes antes de pasar a la siguiente.

Plan general de alto nivel
Pre-requisitos

Creación del proyecto y control de versiones

Inicializar npm y TypeScript

Instalar dependencias básicas

Configurar el servidor MCP (Express + router de herramientas)

Implementar la herramienta authenticate y probar conexión

Definir el protocolo MCP (entrada/salida JSON)

Crear las primeras “tools” para CRUD de bots

Añadir scripts CLI para setup/status/test

Escribir pruebas de integración

Iremos cubriendo cada paso en detalle.

Paso 1: Pre-requisitos
Antes de nada, asegúrate de tener instalado en tu máquina:

Node.js (v18+). Comprueba con:

node --version
npm (v8+). Comprueba con:

npm --version
Git para control de versiones. Comprueba con:

git --version
Un editor de código (VSCode recomendado).

Si alguno de estos no está instalado, instálalo antes de continuar.

Tarea: en tu terminal, ejecuta las tres comprobaciones de versión.
Cuando lo tengas listo, dime “✅ listo paso 1” y pasamos al siguiente.

Tú dijiste:
PS C:\Users\osdei> node --version
v24.2.0
PS C:\Users\osdei> npm --version
11.3.0
ChatGPT Plus
✅ ¡Perfecto, paso 1 completado!

Paso 2: Crear el proyecto y el control de versiones
En tu terminal, sitúate en la carpeta donde quieras crear el proyecto. Por ejemplo:

cd ~/proyectos
Crea un directorio para tu MCP de Typebot y accede a él:

mkdir mcp-typebot
cd mcp-typebot
Inicializa un repositorio Git:

git init
Crea un primer archivo de configuración mínima (por ejemplo, un .gitignore):

echo "node_modules/" > .gitignore
echo "dist/" >> .gitignore
Haz tu primer commit:

git add .
git commit -m "chore: iniciar repo mcp-typebot"
Tarea: Ejecuta estos comandos y confirma con “✅ listo paso 2” para seguir con la inicialización de npm y TypeScript.

Tú dijiste:
no me importa lo de git obviemos eso
ChatGPT Plus

Pensó durante un par de segundos
¡Entendido! Omitimos Git y seguimos sólo con lo esencial.

Paso 2 (sin Git): Crear carpeta del proyecto y configurar npm/TypeScript
En tu terminal, crea y entra al directorio del proyecto:

mkdir mcp-typebot
cd mcp-typebot
Inicializa npm con valores por defecto:

npm init -y
Instala TypeScript y las definiciones de Node:

npm install --save-dev typescript @types/node
Genera un tsconfig.json básico:

npx tsc --init --rootDir src --outDir dist --esModuleInterop --resolveJsonModule --lib es2021,node
Crea la estructura de carpetas inicial:

mkdir src
touch src/index.ts
Tarea: ejecuta estos comandos. Cuando hayas generado el package.json, tsconfig.json y el directorio src con index.ts, dime “✅ listo paso 2” y seguimos con la instalación de las dependencias de Express y configuración del servidor MCP.

Tú dijiste:
listo paso 2
ChatGPT Plus

Pensó durante un par de segundos
Paso 3: Instalar Express y montar el “core” del servidor MCP
Vamos a crear el esqueleto mínimo de un servidor HTTP que reciba peticiones JSON del LLM, las envíe a la herramienta correspondiente y devuelva la respuesta.

3.1. Instalar dependencias
En tu proyecto (mcp-typebot/), ejecuta:

npm install express axios
npm install --save-dev @types/express
express: framework para el servidor HTTP.

axios: cliente HTTP para llamar a la API de Typebot.

3.2. Configurar el servidor en src/index.ts
Reemplaza el contenido de src/index.ts por lo siguiente:

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

// (Más adelante añadiremos aquí el registro de tus “tools”)
const tools = new Map<string, {
  func: (args: any) => Promise<any>,
  description: string
}>();

// Función genérica para invocar una tool por nombre
async function invokeTool(toolName: string, args: any) {
  const tool = tools.get(toolName);
  if (!tool) throw new Error(`Herramienta desconocida: ${toolName}`);
  return await tool.func(args);
}

async function main() {
  const app = express();
  app.use(bodyParser.json());

  // Endpoint para que el LLM invoque herramientas
  app.post('/invoke', async (req: Request, res: Response) => {
    const { tool: toolName, arguments: args } = req.body;
    try {
      const result = await invokeTool(toolName, args);
      res.json({ ok: true, result });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`MCP-Typebot escuchando en http://localhost:${PORT}`);
  });
}

main().catch(err => {
  console.error('Error al arrancar el servidor:', err);
  process.exit(1);
});
3.3. Compilar y arrancar
Añade estos scripts a tu package.json:

// package.json (fragmento)
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
Compila y lanza el servidor:

npm run build
npm start
Deberías ver en consola:

MCP-Typebot escuchando en http://localhost:3000
Tarea:

Instala las dependencias con npm.

Sustituye src/index.ts con el código anterior.

Actualiza package.json con los scripts build y start.

Ejecuta npm run build && npm start y verifica que el servidor arranque sin errores.

Cuando lo tengas funcionando, di ✅ listo paso 3 y pasamos a implementar la primera herramienta (authenticate).

Tú dijiste:
npm start

> mcp-typebot@1.0.0 start
> node dist/index.js

node:internal/modules/cjs/loader:1408
  throw err;
  ^

Error: Cannot find module 'C:\Users\osdei\sources\mcp-typebot\dist\index.js'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1405:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1061:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1066:22)
    at Module._load (node:internal/modules/cjs/loader:1215:37)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:235:24)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:152:5)
    at node:internal/main/run_main_module:33:47 {
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}

Node.js v24.2.0
ChatGPT Plus

Pensó durante unos pocos segundos
El error indica que aún no has generado el archivo compilado en dist/. Antes de arrancar, debes transpilar tu TypeScript a JavaScript:

Ejecuta la compilación:

npm run build
Esto creará dist/index.js.

Una vez completado, levanta el servidor:

npm start
Deberías ver en consola:

MCP-Typebot escuchando en http://localhost:3000
Tip opcional: si quieres comodidad, puedes cambiar tu package.json para que el script start compile y luego arranque en un solo paso:

"scripts": {
  "build": "tsc",
  "start": "npm run build && node dist/index.js"
}
Prueba esos comandos y dime ✅ listo paso 3 cuando veas el mensaje de que el servidor está escuchando.

Tú dijiste:
npm run build
>>

> mcp-typebot@1.0.0 build
> tsc

Version 5.8.3
tsc: The TypeScript Compiler - Version 5.8.3                                                                            
                                                                                                                     TS 
COMMON COMMANDS

  tsc
  Compiles the current project (tsconfig.json in the working directory.)

  tsc app.ts util.ts
  Ignoring tsconfig.json, compiles the specified files with default compiler options.

  tsc -b
  Build a composite project in the working directory.

  tsc --init
  Creates a tsconfig.json with the recommended settings in the working directory.

  tsc -p ./path/to/tsconfig.json
  Compiles the TypeScript project located at the specified path.

  tsc --help --all
  An expanded version of this information, showing all possible compiler options

  tsc --noEmit
  tsc --target esnext
  Compiles the current project, with additional settings.

COMMAND LINE FLAGS

     --help, -h  Print this message.

    --watch, -w  Watch input files.

          --all  Show all compiler options.

  --version, -v  Print the compiler's version.

         --init  Initializes a TypeScript project and creates a tsconfig.json file.

  --project, -p  Compile the project given the path to its configuration file, or to a folder with a 'tsconfig.json'.

   --showConfig  Print the final configuration instead of building.

    --build, -b  Build one or more projects and their dependencies, if out of date

COMMON COMPILER OPTIONS

               --pretty  Enable color and formatting in TypeScript's output to make compiler errors easier to read.
                  type:  boolean
               default:  true

      --declaration, -d  Generate .d.ts files from TypeScript and JavaScript files in your project.
                  type:  boolean
               default:  false, unless composite is set

       --declarationMap  Create sourcemaps for d.ts files.
                  type:  boolean
               default:  false

  --emitDeclarationOnly  Only output d.ts files and not JavaScript files.
                  type:  boolean
               default:  false

            --sourceMap  Create source map files for emitted JavaScript files.
                  type:  boolean
               default:  false

               --noEmit  Disable emitting files from a compilation.
                  type:  boolean
               default:  false

           --target, -t  Set the JavaScript language version for emitted JavaScript and include compatible library declarations.
                one of:  es5, es6/es2015, es2016, es2017, es2018, es2019, es2020, es2021, es2022, es2023, es2024, esnext
               default:  es5

           --module, -m  Specify what module code is generated.
                one of:  none, commonjs, amd, umd, system, es6/es2015, es2020, es2022, esnext, node16, node18, nodenext, preserve
               default:  undefined

                  --lib  Specify a set of bundled library declaration files that describe the target runtime environment.
           one or more:  es5, es6/es2015, es7/es2016, es2017, es2018, es2019, es2020, es2021, es2022, es2023, es2024, esnext, dom, dom.iterable, dom.asynciterable, webworker, webworker.importscripts, webworker.iterable,                          webworker.asynciterable, scripthost, es2015.core, es2015.collection, es2015.generator, es2015.iterable, es2015.promise, es2015.proxy, es2015.reflect, es2015.symbol, es2015.symbol.wellknown, es2                         016.array.include, es2016.intl, es2017.arraybuffer, es2017.date, es2017.object, es2017.sharedmemory, es2017.string, es2017.intl, es2017.typedarrays, es2018.asyncgenerator, es2018.asynciterable/e                         snext.asynciterable, es2018.intl, es2018.promise, es2018.regexp, es2019.array, es2019.object, es2019.string, es2019.symbol/esnext.symbol, es2019.intl, es2020.bigint/esnext.bigint, es2020.date, e                         s2020.promise, es2020.sharedmemory, es2020.string, es2020.symbol.wellknown, es2020.intl, es2020.number, es2021.promise, es2021.string, es2021.weakref/esnext.weakref, es2021.intl, es2022.array, e                         s2022.error, es2022.intl, es2022.object, es2022.string, es2022.regexp, es2023.array, es2023.collection, es2023.intl, es2024.arraybuffer, es2024.collection, es2024.object/esnext.object, es2024.pr                         omise, es2024.regexp/esnext.regexp, es2024.sharedmemory, es2024.string/esnext.string, esnext.array, esnext.collection, esnext.intl, esnext.disposable, esnext.promise, esnext.decorators, esnext.i                         terator, esnext.float16, decorators, decorators.legacy
               default:  undefined

              --allowJs  Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files.
                  type:  boolean
               default:  false

              --checkJs  Enable error reporting in type-checked JavaScript files.
                  type:  boolean
               default:  false

                  --jsx  Specify what JSX code is generated.
                one of:  preserve, react, react-native, react-jsx, react-jsxdev
               default:  undefined

              --outFile  Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output.

               --outDir  Specify an output folder for all emitted files.

       --removeComments  Disable emitting comments.
                  type:  boolean
               default:  false

               --strict  Enable all strict type-checking options.
                  type:  boolean
               default:  false

                --types  Specify type package names to be included without being referenced in a source file.

      --esModuleInterop  Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility.
                  type:  boolean
               default:  false

You can learn about all of the compiler options at https://aka.ms/tsc

PS C:\Users\osdei\sources\mcp-typebot> 
ChatGPT Plus

Pensó durante 9 segundos
Parece que tsc no está encontrando tu configuración o los archivos a compilar, por eso sólo imprime la ayuda en lugar de generar dist/index.js. Vamos a revisarlo:

¿Tienes el tsconfig.json en la raíz?
En tu terminal, estando dentro de mcp-typebot, ejecuta:

dir tsconfig.json
(o ls tsconfig.json en PowerShell). Deberías ver el archivo listado.

Abre tu tsconfig.json y comprueba que tenga al menos esto:

{
  "compilerOptions": {
    "target": "es2021",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "strict": true
  },
  "include": ["src/**/*"]
}
Si no está el "include": ["src/**/*"], agrégalo justo al final.

Verifica que el archivo fuente existe:

dir src\index.ts
(o ls src/index.ts). Debe estar ahí con el código que pusimos.

Vuelve a compilar:

npm run build
Y luego:

dir dist\index.js
Si todo va bien, ahora sí verás index.js en la carpeta dist.

Arranca el servidor:

npm start
Deberías ver:

MCP-Typebot escuchando en http://localhost:3000
Por favor revisa esos puntos y dime qué ves en cada paso. Cuando tengas dist/index.js, responde ✅ tsconfig ok y avanzamos a implementar la herramienta authenticate.

Tú dijiste:
nunca me dijiste que hjiciera tsconfig.json
ChatGPT Plus
Entendido. Vamos a crear el tsconfig.json para que tsc sepa dónde están tus fuentes y dónde debe salir el JavaScript:

En la raíz de tu proyecto (donde está tu package.json), ejecuta:

npx tsc --init
Esto generará un tsconfig.json con valores por defecto.

Abre ese tsconfig.json y reemplaza (o añade) las opciones clave para tu proyecto con este bloque:

{
  "compilerOptions": {
    "target": "es2021",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "strict": true
  },
  "include": ["src/**/*"]
}
rootDir: le dice a TypeScript que compile todo lo que esté en src/.

outDir: pondrá el JavaScript compilado en dist/.

include: le indica al compilador que solo mire dentro de src/.

Guarda los cambios y vuelve a compilar:

npm run build
Verifica que ahora exista tu dist/index.js:

ls dist/index.js
Y finalmente arranca:

npm start
Deberías ver:

MCP-Typebot escuchando en http://localhost:3000
Cuando lo veas, dime ✅ tsconfig ok y seguimos con la herramienta authenticate.

Tú dijiste:
tsconfig ok
ChatGPT Plus

Pensó durante 4 segundos
Paso 4: Implementar la herramienta authenticate
Vamos a crear el primer “tool” de tu MCP: la que configura el token y comprueba la conexión con la API de Typebot.

4.1. Crea la carpeta de tools y el archivo de autenticación
En tu proyecto, crea la carpeta src/tools:

mkdir src/tools
Crea el archivo src/tools/auth.ts con este contenido:

// src/tools/auth.ts
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
  const response = await axios.get('https://api.typebot.io/api/workspaces');
  return response.data; // devolvemos directamente los datos
}
4.2. Registra la herramienta en el servidor
Abre src/index.ts y, justo después de donde importas Express y antes de la función invokeTool, añade:

import { authenticate } from './tools/auth';

// ...

const tools = new Map<string, {
  func: (args: any) => Promise<any>,
  description: string
}>();

// Aquí registramos la herramienta 'authenticate'
tools.set('authenticate', {
  func: authenticate,
  description: 'Configura tu API token de Typebot y verifica que sea válido'
});
Tu src/index.ts debería quedar más o menos así por la parte relevante:

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { authenticate } from './tools/auth';

const tools = new Map<string, { func: (args: any) => Promise<any>, description: string }>();

tools.set('authenticate', {
  func: authenticate,
  description: 'Configura tu API token de Typebot y verifica que sea válido'
});

async function invokeTool(toolName: string, args: any) {
  const tool = tools.get(toolName);
  if (!tool) throw new Error(`Herramienta desconocida: ${toolName}`);
  return await tool.func(args);
}

// ... resto sin cambios
4.3. Compilar y arrancar
Compila:

npm run build
Arranca:

npm start
Deberías seguir viendo:

MCP-Typebot escuchando en http://localhost:3000
4.4. Probar la herramienta
Usa curl (o Postman) para invocar tu endpoint /invoke. Sustituye <TU_TOKEN> por tu token real de Typebot:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "authenticate",
    "arguments": { "token": "<TU_TOKEN>" }
  }'
Si todo va bien, la respuesta será JSON con "ok": true y un listado de tus workspaces.

Si falla, verás "ok": false con el mensaje de error.

Tarea:

Crea src/tools/auth.ts.

Registra la herramienta en src/index.ts.

Compila y arranca el servidor.

Ejecuta el curl de prueba.

Cuando obtengas la lista de workspaces y veas "ok": true, contesta ✅ listo paso 4 y seguimos con la definición del protocolo MCP.

Tú dijiste:
"ok": true,
    "result": "<!DOCTYPE html><html lang=\"en\" dir=\"ltr\"><head><meta charSet=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width\"/><meta name=\"next-head-count\" content=\"2\"/><link rel=\"preload\" href=\"/_next/static/css/fab7b8a8210950ea4a19.css\" as=\"style\"/><link rel=\"stylesheet\" href=\"/_next/static/css/fab7b8a8210950ea4a19.css\" data-n-g=\"\"/><noscript data-n-css=\"\"></noscript><script defer=\"\" nomodule=\"\" src=\"/_next/static/chunks/polyfills-687e794d8e071078d3f3.js\"></script><script src=\"/_next/static/chunks/webpack-f9681b283507d561ee5f.js\" defer=\"\"></script><script src=\"/_next/static/chunks/framework-7b87b70dbb5ac4de5859.js\" defer=\"\"></script><script src=\"/_next/static/chunks/main-669810d0c10a283199fe.js\" defer=\"\"></script><script src=\"/_next/static/chunks/pages/_app-ea9bccb2860cf2facf2a.js\" defer=\"\"></script><script src=\"/_next/static/chunks/981-ecaf112119529517b695.js\" defer=\"\"></script><script src=\"/_next/static/chunks/669-b699510063e6101aff08.js\" defer=\"\"></script><script src=\"/_next/static/chunks/947-5c7a986fb2309a95ffda.js\" defer=\"\"></script><script src=\"/_next/static/chunks/pages/%5B...chatbotId%5D-02cc9054afe18c56f49f.js\" defer=\"\"></script><script src=\"/_next/static/sAL91tF_gqu-tiRMVra_y/_buildManifest.js\" defer=\"\"></script><script src=\"/_next/static/sAL91tF_gqu-tiRMVra_y/_ssgManifest.js\" defer=\"\"></script></head><body><div id=\"__next\"><div style=\"height:100vh;display:flex;justify-content:center;align-items:center;flex-direction:column\"><h1 style=\"font-weight:bold;font-size:30px\">404</h1><h2>The bot you&#x27;re looking for doesn&#x27;t exist</h2></div></div><script id=\"__NEXT_DATA__\" type=\"application/json\">{\"props\":{\"pageProps\":{},\"__N_SSP\":true},\"page\":\"/[...chatbotId]\",\"query\":{\"chatbotId\":[\"api\",\"workspaces\"]},\"buildId\":\"sAL91tF_gqu-tiRMVra_y\",\"isFallback\":false,\"gssp\":true,\"scriptLoader\":[]}</script></body></html>"
}
ChatGPT Plus

Pensó durante 6 segundos
El HTML de error 404 te indica que estás llamando a la ruta equivocada. Según la documentación, el endpoint para listar workspaces es:

GET https://app.typebot.io/api/v1/workspaces
y no “https://api.typebot.io/api/workspaces” 
docs.typebot.io
docs.typebot.io
.

Cambia en src/tools/auth.ts
Reemplaza esta línea:

const response = await axios.get('https://api.typebot.io/api/workspaces');
por:

const response = await axios.get('https://app.typebot.io/api/v1/workspaces');
De modo que tu función authenticate quede así:

// src/tools/auth.ts
import axios from 'axios';

export interface AuthArgs {
  token: string;
}

/**
 * Configura el bearer token y prueba la conexión
 */
export async function authenticate(args: AuthArgs) {
  const { token } = args;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // 👉 Llamada corregida para listar workspaces
  const response = await axios.get('https://app.typebot.io/api/v1/workspaces');
  return response.data;
}
Vuelve a compilar y probar
npm run build
npm start
Lanza de nuevo el curl de prueba:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "authenticate",
    "arguments": { "token": "<TU_TOKEN>" }
  }'
Ahora deberías recibir un JSON tipo:

{
  "ok": true,
  "result": {
    "workspaces": [
      { "id": "...", "name": "...", /* etc */ },
      …
    ]
  }
}
Cuando veas esa lista de workspaces y "ok": true, responde ✅ listo paso 4 y continuamos con la definición del protocolo MCP.

Tú dijiste:
{
    "ok": true,
    "result": {
        "workspaces": [
            {
                "id": "cm1vizqdr000rvag38p36itox",
                "name": "Osdeibi Acurero's workspace",
                "icon": null,
                "plan": "FREE"
            }
        ]
    }
}
ChatGPT Plus
¡Genial, ya tenemos la autenticación funcionando!

Paso 5: Definir el protocolo MCP (entrada/salida JSON)
Antes de crear más herramientas, establezcamos cómo hablaremos con el MCP. Esto te permitirá al LLM (o tú con curl) saber siempre qué estructura mandar y qué esperar de vuelta.

5.1. Estructura de la petición
Cada llamada al endpoint /invoke deberá tener este cuerpo JSON:

{
  "tool": "<nombre de la herramienta>",
  "arguments": { /* objeto con los parámetros específicos de esa herramienta */ }
}
tool (string): el identificador que registramos en tools.set().

arguments (object): un mapa clave–valor con los parámetros que espera la función.

5.2. Estructura de la respuesta
En la respuesta siempre devolveremos un JSON con dos propiedades:

ok (boolean)

true si la herramienta devolvió exitosamente un resultado.

false si hubo error (p.ej. herramienta no existe, fallo de red, validación).

result (any)

Si ok: true, aquí estará el valor que devolvió la función (puede ser un objeto, array, string…).

Si ok: false, derribamos result y en su lugar usamos error (string) con el mensaje.

Debería quedar así en tu código (revisa src/index.ts):

app.post('/invoke', async (req, res) => {
  const { tool: toolName, arguments: args } = req.body;
  try {
    const result = await invokeTool(toolName, args);
    res.json({ ok: true, result });
  } catch (e: any) {
    res.json({ ok: false, error: e.message });
  }
});
(Ya lo tienes así, solo repásalo para estar seguro.)

5.3. Validación básica de los argumentos
Para evitar errores por parámetros faltantes o mal tipeados, podemos añadir un middleware muy simple antes de invocar la herramienta. Por ejemplo, en src/index.ts:

// Middleware para validar que venga tool + arguments
app.use('/invoke', (req, res, next) => {
  const body = req.body;
  if (typeof body.tool !== 'string') {
    return res.json({ ok: false, error: '`tool` debe ser un string' });
  }
  if (typeof body.arguments !== 'object') {
    return res.json({ ok: false, error: '`arguments` debe ser un objeto' });
  }
  next();
});
Esto te asegura que nunca entremos a invokeTool con un formato inválido.

5.4. Tipado en TypeScript
Para comodidad y autocompletado, define en src/index.ts:

interface InvokeRequest {
  tool: string;
  arguments: Record<string, any>;
}

interface InvokeResponse {
  ok: boolean;
  result?: any;
  error?: string;
}
Y úsalo así:

app.post('/invoke', async (req: Request<{}, {}, InvokeRequest>, res: Response<InvokeResponse>) => {
  // ...
});
Tu tarea para el Paso 5
Repasa y ajusta src/index.ts para incluir el middleware de validación

Añade las interfaces InvokeRequest y InvokeResponse con los genéricos de Express

Vuelve a compilar (npm run build) y arranca (npm start), y prueba que, si llamas sin "arguments" o sin "tool", recibes un error de validación.

Por ejemplo:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{}'
# 👉 Debe devolver: {"ok":false,"error":"`tool` debe ser un string"}
Cuando tengas esta validación funcionando, dime ✅ listo paso 5 y pasamos a crear las primeras herramientas CRUD para bots.

Tú dijiste:
dame el index.ts completo
ChatGPT Plus

Pensó durante 5 segundos
He creado en canvas el archivo completo index.ts con:

Importaciones de Express y authenticate.

Tipos InvokeRequest y InvokeResponse.

Registro de herramientas y función invokeTool.

Middleware de validación.

Endpoint /invoke.

Arranque del servidor.

Revísalo y dime si quieres ajustar algo o si pasamos al siguiente paso.

Tú dijiste:
npm run build

> mcp-typebot@1.0.0 build
> tsc

src/index.ts:31:1 - error TS1128: Declaration or statement expected.

31 }
   ~

src/index.ts:57:4 - error TS1128: Declaration or statement expected.

57   });
      ~

src/index.ts:63:1 - error TS1128: Declaration or statement expected.

63 }
   ~


Found 3 errors in the same file, starting at: src/index.ts:31
ChatGPT Plus

Pensó durante 5 segundos
He corregido completamente index.ts:

Añadido NextFunction en las importaciones y en el middleware de validación.

Ajustado el tipado de app.post y la firma de main.

Cerrado correctamente todas las llaves y paréntesis.

Compila de nuevo con npm run build y arranca con npm start. Luego prueba:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{}'
Deberías recibir:

{"ok":false,"error":"`tool` debe ser un string"}
Cuando todo funcione, dime ✅ listo paso 5 y seguimos con las herramientas CRUD para bots.

Tú dijiste:
 npm run build

> mcp-typebot@1.0.0 build
> tsc

src/index.ts:39:22 - error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request, res: Response, next: NextFunction) => express.Response<any, Record<string, any>> | undefined' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => Response<...> | undefined' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.

39   app.use('/invoke', (req: Request, res: Response, next: NextFunction) => {
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  node_modules/@types/express-serve-static-core/index.d.ts:168:5
    168     (path: PathParams, subApplication: Application): T;
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    The last overload is declared here.


Found 1 error in src/index.ts:39
ChatGPT Plus

Pensó durante 18 segundos
He actualizado index.ts para combinar la validación y el handler en una sola llamada a app.post, evitando así usar app.use con un middleware separado que causaba conflicto de tipos. Ahora tenemos:

bodyParser.json() global.

app.post('/invoke', validateMiddleware, handler).

Eliminado el app.use('/invoke', ...).

Por favor, vuelve a compilar:

npm run build
y luego arranca:

npm start
y prueba de nuevo:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{}'
Deberías obtener:

{"ok":false,"error":"`tool` debe ser un string"}
Cuando funcione, dime ✅ listo paso 5 para seguir con las herramientas CRUD de bots.

Tú dijiste:
No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request, res: Response, next: NextFunction) => express.Response<any, Record<string, any>> | undefined' is not assignable to parameter of type 'RequestHandlerParams<{}, any, InvokeRequest, ParsedQs, Record<string, any>>'.
      Type '(req: Request, res: Response, next: NextFunction) => express.Response<any, Record<string, any>> | undefined' is not assignable to type 'RequestHandler<{}, any, InvokeRequest, ParsedQs, Record<string, any>>'.
        Type 'Response<any, Record<string, any>> | undefined' is not assignable to type 'void | Promise<void>'.
          Type 'Response<any, Record<string, any>>' is not assignable to type 'void | Promise<void>'.ts(2769)
index.d.ts(157, 5): The last overload is declared here.
ChatGPT Plus

Pensó durante 6 segundos
He actualizado index.ts para usar un middleware validateInvoke que no devuelve valor al usar res.json, satisfaciendo el tipo void. Ahora:

Middleware validateInvoke provoca res.json(...) y luego return;, con firma void.

La llamada a app.post usa validateInvoke seguido del handler.

Por favor, compila de nuevo:

npm run build
y arranca:

npm start
Si se compila sin errores y al llamar curl -X POST ... -d '{}' obtienes {"ok":false,"error":"\tool` debe ser un string"}`, indícalo ✅ listo paso 5 y avanzamos a las herramientas CRUD para bots.

Tú dijiste:
cual es el metodo curl para probar esto?
ChatGPT Plus
Para probar tu endpoint /invoke con curl, puedes usar este comando (adaptándolo a tu caso):

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"authenticate","arguments":{"token":"<TU_TOKEN>"}}'
Donde:

-X POST indica que es una petición POST.

-H "Content-Type: application/json" fija el header de tipo JSON.

En -d va el cuerpo, con:

"tool": el nombre de la herramienta (en este caso authenticate).

"arguments": el objeto con los parámetros que la herramienta espera (aquí tu token).

Si quieres probar la validación de parámetros vacíos, por ejemplo, envía un body vacío o sin “tool”:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{}'
Deberías recibir:

{"ok":false,"error":"`tool` debe ser un string"}
Tú dijiste:
{
    "ok": false,
    "error": "Request failed with status code 401"
}
ChatGPT Plus

Pensó durante un par de segundos
Para probar la validación de tu endpoint (que devuelva el error de falta de tool), usa:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{}'
Debería responder:

{"ok":false,"error":"`tool` debe ser un string"}
Y para invocar la herramienta authenticate, reemplaza <TU_TOKEN> por tu token real:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "authenticate",
    "arguments": {
      "token": "<TU_TOKEN>"
    }
  }'
Si recibes un 401, confirma que el token es correcto y que no le falte ninguna cabecera o carácter.

Tú dijiste:
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>SyntaxError: Expected &#39;,&#39; or &#39;}&#39; after property value in JSON at position 102 (line 5 column 6)<br> &nbsp; &nbsp;at JSON.parse (&lt;anonymous&gt;)<br> &nbsp; &nbsp;at parse (C:\Users\osdei\sources\mcp-typebot\node_modules\body-parser\lib\types\json.js:77:19)<br> &nbsp; &nbsp;at C:\Users\osdei\sources\mcp-typebot\node_modules\body-parser\lib\read.js:123:18<br> &nbsp; &nbsp;at AsyncResource.runInAsyncScope (node:async_hooks:214:14)<br> &nbsp; &nbsp;at invokeCallback (C:\Users\osdei\sources\mcp-typebot\node_modules\raw-body\index.js:238:16)<br> &nbsp; &nbsp;at done (C:\Users\osdei\sources\mcp-typebot\node_modules\raw-body\index.js:227:7)<br> &nbsp; &nbsp;at IncomingMessage.onEnd (C:\Users\osdei\sources\mcp-typebot\node_modules\raw-body\index.js:287:7)<br> &nbsp; &nbsp;at IncomingMessage.emit (node:events:507:28)<br> &nbsp; &nbsp;at endReadableNT (node:internal/streams/readable:1701:12)<br> &nbsp; &nbsp;at process.processTicksAndRejections (node:internal/process/task_queues:90:21)</pre>
</body>
</html>
ChatGPT Plus

Pensó durante 6 segundos
En Windows PowerShell (para evitar el alias de curl y que se interprete bien el JSON) puedes usar:

curl.exe -X POST http://localhost:3000/invoke `
  -H "Content-Type: application/json" `
  -d '{"tool":"authenticate","arguments":{"token":"<TU_TOKEN_HERE>"}}'
O, si prefieres el cmdlet nativo:

Invoke-RestMethod -Uri http://localhost:3000/invoke `
  -Method Post `
  -ContentType 'application/json' `
  -Body '{"tool":"authenticate","arguments":{"token":"<TU_TOKEN_HERE>"}}'
En macOS/Linux (o WSL) con Bash basta con:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"authenticate","arguments":{"token":"<TU_TOKEN_HERE>"}}'
Puntos clave

El JSON debe ir todo entre comillas simples ('…') para que el shell no rompa las dobles internas.

Asegúrate de que no falten comas ni llaves:

{
  "tool": "authenticate",
  "arguments": {
    "token": "<TU_TOKEN_HERE>"
  }
}
Si ves un error de SyntaxError: Expected ',' or '}', significa que el cuerpo no está bien formado JSON (fíjate en comillas y comas).

Prueba con alguno de esos comandos (reemplazando <TU_TOKEN_HERE> por tu token real) y deberías obtener tu respuesta JSON sin el error de parseo.

Tú dijiste:
ahora si
ChatGPT Plus

Pensó durante 15 segundos
¡Perfecto, la autenticación ya responde correctamente!

Paso 6: Crear las herramientas CRUD de Bots
Vamos a añadir las primeras operaciones para gestionar bots en Typebot. Creamos un nuevo archivo src/tools/bots.ts con cuatro funciones:

createBot – POST /api/v1/chatbots

listBots – GET /api/v1/chatbots

getBot – GET /api/v1/chatbots/{botId}

deleteBot – DELETE /api/v1/chatbots/{botId}

6.1. Crear el archivo de tools
En tu proyecto, ejecuta:

touch src/tools/bots.ts
Y añade este esqueleto:

import axios from 'axios';

export interface CreateBotArgs {
  name: string;
  description?: string;
}

export async function createBot(args: CreateBotArgs) {
  const { name, description } = args;
  const response = await axios.post(
    'https://app.typebot.io/api/v1/chatbots',
    { name, description }
  );
  return response.data;
}

export interface ListBotsArgs {
  workspaceId: string;
}

export async function listBots(args: ListBotsArgs) {
  const { workspaceId } = args;
  const response = await axios.get(
    `https://app.typebot.io/api/v1/workspaces/${workspaceId}/chatbots`
  );
  return response.data;
}

// Similar para getBot y deleteBot…
6.2. Registrar las nuevas tools en src/index.ts
import { createBot, listBots, getBot, deleteBot } from './tools/bots';

tools.set('createBot', {
  func: createBot,
  description: 'Crea un nuevo bot en Typebot con nombre y descripción'
});
tools.set('listBots', {
  func: listBots,
  description: 'Lista todos los bots de un workspace dado'
});
// Igual para getBot y deleteBot
Tarea:

Crea src/tools/bots.ts e implementa createBot y listBots.

Registra estas dos herramientas en src/index.ts.

Compila y arranca el servidor.

Prueba con curl:

# Crear un bot
curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"createBot","arguments":{"name":"MiBotDePrueba","description":"Bot de prueba"}}'

# Listar bots
curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"listBots","arguments":{"workspaceId":"<TU_WORKSPACE_ID_HERE>"}}'
Cuando tengas estos dos funcionando, dime ✅ listo paso 6 para seguir con getBot y deleteBot.

Tú dijiste:
asi tengo m iindex.ts:
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { authenticate } from './tools/auth';
import { createBot, listBots, getBot, deleteBot } from './tools/bots';

tools.set('createBot', {
  func: createBot,
  description: 'Crea un nuevo bot en Typebot con nombre y descripción'
});
tools.set('listBots', {
  func: listBots,
  description: 'Lista todos los bots de un workspace dado'
});

// Definición de la estructura de la petición y respuesta MCP
interface InvokeRequest {
  tool: string;
  arguments: Record<string, any>;
}

interface InvokeResponse {
  ok: boolean;
  result?: any;
  error?: string;
}

// Registro de herramientas
const tools = new Map<string, { func: (args: any) => Promise<any>; description: string }>();

tools.set('authenticate', {
  func: authenticate,
  description: 'Configura tu API token de Typebot y verifica que sea válido',
});

// Función genérica para invocar herramientas por nombre
async function invokeTool(toolName: string, args: any): Promise<any> {
  const tool = tools.get(toolName);
  if (!tool) {
    throw new Error(Herramienta desconocida: ${toolName});
  }
  return await tool.func(args);
}

// Middleware de validación básica
function validateInvoke(req: Request, res: Response, next: NextFunction): void {
  const body = req.body as Partial<InvokeRequest>;
  if (typeof body.tool !== 'string') {
    res.json({ ok: false, error: 'tool debe ser un string' });
    return;
  }
  if (typeof body.arguments !== 'object' || body.arguments === null) {
    res.json({ ok: false, error: 'arguments debe ser un objeto' });
    return;
  }
  next();
}

async function main(): Promise<void> {
  const app = express();
  app.use(bodyParser.json());

  // Endpoint para invocar herramientas, con validación
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
  app.listen(PORT, () => {
    console.log(MCP-Typebot escuchando en http://localhost:${PORT});
  });
}

main().catch((err) => {
  console.error('Error al arrancar el servidor:', err);
  process.exit(1);
});

y mi bots.ts:
import axios from 'axios';

export interface CreateBotArgs {
  name: string;
  description?: string;
}

export async function createBot(args: CreateBotArgs) {
  const { name, description } = args;
  const response = await axios.post(
    'https://app.typebot.io/api/v1/chatbots',
    { name, description }
  );
  return response.data;
}

export interface ListBotsArgs {
  workspaceId: string;
}

export async function listBots(args: ListBotsArgs) {
  const { workspaceId } = args;
  const response = await axios.get(
    https://app.typebot.io/api/v1/workspaces/${workspaceId}/chatbots
  );
  return response.data;
}

// Similar para getBot y deleteBot…
ChatGPT Plus

Pensó durante 4 segundos
He reorganizado y completado index.ts, registrando todas las herramientas de bots y asegurando el orden correcto de declaraciones. También añadí comentarios para guiarte en la implementación de bots.ts.

Ahora, asegúrate de que en src/tools/bots.ts tengas también estas cuatro funciones:

import axios from 'axios';

export interface CreateBotArgs { name: string; description?: string; }
export async function createBot(args: CreateBotArgs) {
  const response = await axios.post('https://app.typebot.io/api/v1/chatbots', {
    name: args.name,
    description: args.description,
  });
  return response.data;
}

export interface ListBotsArgs { workspaceId: string; }
export async function listBots(args: ListBotsArgs) {
  const response = await axios.get(
    `https://app.typebot.io/api/v1/workspaces/${args.workspaceId}/chatbots`
  );
  return response.data;
}

export interface GetBotArgs { botId: string; }
export async function getBot(args: GetBotArgs) {
  const response = await axios.get(
    `https://app.typebot.io/api/v1/chatbots/${args.botId}`
  );
  return response.data;
}

export interface DeleteBotArgs { botId: string; }
export async function deleteBot(args: DeleteBotArgs) {
  await axios.delete(`https://app.typebot.io/api/v1/chatbots/${args.botId}`);
  return { success: true };
}
Aplica esos cambios, recompila (npm run build) y arranca. Luego prueba con:

# Crear bot
curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"createBot","arguments":{"name":"MiBot","description":"Test"}}'

# Listar bots
curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"listBots","arguments":{"workspaceId":"<WORKSPACE_ID>"}}'

# Obtener bot
curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"getBot","arguments":{"botId":"<BOT_ID>"}}'

# Eliminar bot
curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"deleteBot","arguments":{"botId":"<BOT_ID>"}}'
Cuando todo esté listo, dime ✅ listo paso 6 y continuamos con las herramientas de flujos.

Tú dijiste:
todos me dan {
    "ok": false,
    "error": "Request failed with status code 404"
} hay que pasar de alguna manera el api key o token segun la api de typebot https://docs.typebot.io/api-reference/typebot/list
ChatGPT Plus

Pensó durante 14 segundos
He actualizado src/tools/bots.ts para usar los endpoints correctos según la documentación de Typebot:

Listar: GET https://app.typebot.io/api/v1/typebots

Crear: POST https://app.typebot.io/api/v1/typebots

Obtener: GET https://app.typebot.io/api/v1/typebots/{typebotId}

Eliminar: DELETE https://app.typebot.io/api/v1/typebots/{typebotId}

Además, quité el parámetro workspaceId, ya que la API de Typebot no lo requiere para estos endpoints.

Próximos pasos
Compila y arranca:

npm run build
npm start
Autentícate (configura el token) antes de llamar a estas herramientas:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "authenticate",
    "arguments": { "token": "<TU_TOKEN_AQUI>" }
  }'
Prueba listar bots (sin argumentos):

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "listBots",
    "arguments": {}
  }'
Prueba crear un bot:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "createBot",
    "arguments": { "name": "MiNuevoTypebot" }
  }'
Con esto ya no deberías recibir 404. Si todo funciona, contesta ✅ listo paso 6 y avanzamos a getBot y deleteBot.

Tú dijiste:
mismo sintoma     "ok": false,
    "error": "Request failed with status code 401"
}
ChatGPT Plus

Pensó durante 14 segundos
Para todas las llamadas a la API de Typebot (incluyendo listBots, createBot, etc.) debes enviar tu token en un header Authorization: Bearer <token>. En tu MCP esto se hace ejecutando primero la herramienta authenticate, que fija ese header globalmente en Axios, y luego invocando las demás tools. Si saltas el paso de authenticate, cualquier petición a /typebots devolverá 401.

1. Paso “authenticate” (solo se hace una vez)
curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"authenticate","arguments":{"token":"<TU_TOKEN_AQUÍ>"}}'
Respuesta esperada:

{"ok":true,"result":{ … lista de workspaces … }}
2. Llamadas a listBots, createBot, etc.
Ya con el header puesto, puedes hacer:

# Listar typebots
curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"listBots","arguments":{}}'
# Crear un typebot nuevo
curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"createBot","arguments":{"name":"MiTypebotDePrueba"}}'
Si repites estos pasos en ese orden, ya no deberías recibir 401.

Alternativa: inyectar el header en cada request
Si prefieres no depender de axios.defaults, puedes crear un cliente Axios con tu token y usarlo en cada tool. Por ejemplo, en src/tools/bots.ts:

import axios from 'axios';

let api = axios.create({ baseURL: 'https://app.typebot.io/api/v1' });

export function setToken(token: string) {
  api = axios.create({
    baseURL: 'https://app.typebot.io/api/v1',
    headers: { Authorization: `Bearer ${token}` }
  });
}

// y en authenticate, en lugar de axios.defaults, llamas a setToken(token),
// y luego en createBot, listBots… usas `api.post(...)`, `api.get(...)`, etc.
De ese modo te aseguras de que todas las llamadas llevan el header correcto. Pero de forma rápida, con el MCP tal como lo tienes, basta con ejecutar authenticate antes que nada.

Tú dijiste:
mejor guarda el token en un .env y asi inyectarlo en el header
ChatGPT Plus

Pensó durante 6 segundos
He modificado tu index.ts para:

Cargar variables de entorno con dotenv (.env en la raíz).

Leer TYPEBOT_TOKEN de process.env y configurar axios.defaults.headers.common.Authorization si existe, con una advertencia si no.

Ajustar la descripción de la herramienta authenticate para reflejar el uso de .env.

Siguientes pasos:

Instala dotenv:

npm install dotenv
Crea un archivo .env en la raíz:

TYPEBOT_TOKEN=tu_token_aquí
Compila y arranca:

npm run build
npm start
Ahora haz un curl directo a listBots sin necesidad de invocar authenticate:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"listBots","arguments":{}}'
Prueba y avísame si funciona correctamente ✅ listo token env o si quieres más ajustes.

Tú dijiste:
 npm run build

> mcp-typebot@1.0.0 build
> tsc

src/index.ts:62:1 - error TS1434: Unexpected keyword or identifier.

62 def function validateInvoke(req: Request, res: Response, next: NextFunction): void {
   ~~~


Found 1 error in src/index.ts:62
ChatGPT Plus

Pensó durante 7 segundos
He corregido el validateInvoke eliminando el def sobrante y asegurado que la firma sea function validateInvoke. Compila de nuevo con:

npm run build
Luego arranca:

npm start
Y prueba tu endpoint para confirmar que ahora el middleware y el servidor funcionan sin error de sintaxis.

Tú dijiste:
post http://localhost:3000/invoke

{
    "tool": "listBots",
    "arguments": {}
  }

{
    "ok": false,
    "error": "Request failed with status code 400"
}
ChatGPT Plus

Pensó durante 10 segundos
El error 400 viene porque el endpoint de “List typebots” exige un parámetro obligatorio workspaceId (vía query), y hasta ahora lo estáis llamando sin él. Para arreglarlo, podéis:

Añadir el workspaceId a vuestro .env (o crear otra variable).

Modificar src/tools/bots.ts para que listBots use ese valor, o lo acepte por argumento.

1) Actualiza tu .env
Al lado de TYPEBOT_TOKEN, añade:

TYPEBOT_WORKSPACE_ID=cm1vizqdr000rvag38p36itox
(Usa el ID que te devolvió el authenticate.)

2) Cambia listBots en src/tools/bots.ts
Reemplaza la implementación actual por algo así:

// src/tools/bots.ts
import axios from 'axios';

export interface ListBotsArgs {
  workspaceId?: string;
  folderId?: string;
}

export async function listBots(args: ListBotsArgs = {}) {
  // 1) Saca workspaceId de args o de .env
  const workspaceId = args.workspaceId || process.env.TYPEBOT_WORKSPACE_ID;
  if (!workspaceId) {
    throw new Error('❌ listBots: faltó workspaceId (ni en args ni en .env)');
  }

  // 2) Llama al endpoint con query params
  const response = await axios.get(
    'https://app.typebot.io/api/v1/typebots',
    { params: { workspaceId, folderId: args.folderId } }
  );
  return response.data;
}
🔑 Nota: si prefieres mandar workspaceId manualmente, puedes invocar con

{ "tool": "listBots", "arguments": { "workspaceId": "TU_WORKSPACE_ID" } }
3) Recarga y prueba
npm run build
npm start
Luego, con curl (o PowerShell curl.exe):

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"listBots","arguments":{}}'
Como ahora toma el ID de .env, deberías ver algo así:

{
  "ok": true,
  "result": {
    "typebots": [
      { "id": "...", "name": "...", /* etc */ }
    ]
  }
}
Si quieres puramente pasar el ID en la llamada:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"listBots","arguments":{"workspaceId":"cm1vizqdr000rvag38p36itox"}}'
Con esto ya no deberías recibir 400. ¡Pruébalo y me comentas!

Tú dijiste:
como debe quedar bots.ts
ChatGPT Plus

Pensó durante un par de segundos
Tu src/tools/bots.ts podría quedar así, aprovechando que ya cargaste TYPEBOT_TOKEN en tu .env (vía dotenv en index.ts) y que configuraste axios.defaults.headers.common['Authorization'] al arrancar el servidor:

// src/tools/bots.ts
import axios from 'axios';

//
// CREATE BOT
//
export interface CreateBotArgs {
  name: string;
  description?: string;
}

export async function createBot(args: CreateBotArgs) {
  const { name, description } = args;
  const response = await axios.post(
    'https://app.typebot.io/api/v1/typebots',
    { name, description }
  );
  return response.data;
}

//
// LIST BOTS
//
export interface ListBotsArgs {
  /**
   * Opcional: si no se pasa, lo tomamos de process.env.TYPEBOT_WORKSPACE_ID
   */
  workspaceId?: string;
}

export async function listBots(args: ListBotsArgs = {}) {
  const workspaceId =
    args.workspaceId || process.env.TYPEBOT_WORKSPACE_ID;
  if (!workspaceId) {
    throw new Error(
      'listBots: falta workspaceId (ni en args ni en .env)'
    );
  }

  // El endpoint requiere el workspaceId como query param
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
  botId: string;
}

export async function getBot(args: GetBotArgs) {
  const { botId } = args;
  const response = await axios.get(
    `https://app.typebot.io/api/v1/typebots/${botId}`
  );
  return response.data;
}

//
// DELETE BOT
//
export interface DeleteBotArgs {
  botId: string;
}

export async function deleteBot(args: DeleteBotArgs) {
  const { botId } = args;
  await axios.delete(
    `https://app.typebot.io/api/v1/typebots/${botId}`
  );
  return { success: true };
}
Puntos clave:

Usamos axios.defaults.headers.common['Authorization']
(se configura en index.ts al cargar TYPEBOT_TOKEN desde .env).

listBots extrae workspaceId de args o de la variable de entorno.

Los demás métodos (createBot, getBot, deleteBot) llaman directamente al endpoint correspondiente.

Todos devuelven response.data, salvo deleteBot que devuelve un objeto simple de confirmación.

Con esto, tras compilar (npm run build) y arrancar (npm start), tus herramientas de bots deberían funcionar sin 400/401 siempre que tengas bien establecida la variable TYPEBOT_TOKEN (y opcionalmente TYPEBOT_WORKSPACE_ID) en tu .env.

Tú dijiste:
perfecto list bot funciona:
{"ok":true,"result":{"typebots":[{"name":"SEO chat","icon":null,"id":"cm2o1m4x30001s2kmxqdx7u4m","accessRight":"write"},{"name":"Crypto test","icon":null,"id":"cm2o0xkoy000e9fapcf729x78","accessRight":"write"},{"name":"test vuelos","icon":null,"id":"cm1x7ywbg000dlec3msb67srx","accessRight":"write"},{"name":"Flujo completo","icon":null,"id":"cm1vkq3ku000i1fez2m8l30k4","publishedTypebotId":"cm2o0sw71000gfk96upenl4fz","accessRight":"write"}]}}

ahora vamos con create bot y get bot, vamos uno a uno de espacio y por pasos
ChatGPT Plus

Pensó durante un par de segundos
Perfecto, vamos a por createBot primero, paso a paso y sin saltarnos nada.

Paso 7: Implementar createBot
7.1. Código en src/tools/bots.ts
Asegúrate de que tu createBot esté así:

// src/tools/bots.ts
import axios from 'axios';

export interface CreateBotArgs {
  name: string;
  description?: string;
}

export async function createBot(args: CreateBotArgs) {
  const { name, description } = args;
  const response = await axios.post(
    'https://app.typebot.io/api/v1/typebots',
    { name, description }
  );
  return response.data;
}
Nota: No necesitas workspaceId aquí, la API crea el bot en tu workspace predeterminado según el token.

7.2. Registrar la herramienta en src/index.ts
En la sección donde registras las tools, añade:

tools.set('createBot', {
  func: createBot,
  description: 'Crea un nuevo Typebot con nombre y descripción opcional'
});
Quedaría justo junto a tus registros de authenticate y listBots.

7.3. Compilar y arrancar
npm run build
npm start
Verifica en consola que arranca sin errores:

MCP-Typebot escuchando en http://localhost:3000
7.4. Probar con curl
Desde tu terminal:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "createBot",
    "arguments": {
      "name": "MiBotDePrueba",
      "description": "Bot creado vía MCP"
    }
  }'
Deberías obtener algo como:

{
  "ok": true,
  "result": {
    "typebot": {
      "id": "cmXYZ...",
      "name": "MiBotDePrueba",
      "icon": null,
      "accessRight": "write",
      …  
    }
  }
}
Tarea:

Implementa y registra createBot.

Compila y arranca.

Lanza el curl de prueba.

Cuando veas "ok": true y los datos de tu nuevo bot, responde ✅ listo createBot y pasamos a getBot.

Tú dijiste:
pasando al body:
{
    "tool": "createBot",
    "arguments": {
      "name": "MiBotDePrueba",
      "description": "Bot creado vía MCP"
    }
  }

en la url http://localhost:3000/invoke en post, me da {"ok":false,"error":"Request failed with status code 400"}

https://docs.typebot.io/api-reference/typebot/create mira la docu Typebot
Create a typebot
POST
/
v1
/
typebots

Try it
Authorizations
​
Authorization
stringheaderrequired
Bearer authentication header of the form Bearer <token>, where <token> is your auth token.

Body
application/json
​
workspaceId
stringrequired
​
typebot
objectrequired

Show child attributes

Response
200

200
application/json
Successful response

​
typebot
objectrequired

Show child attributes

Suggest edits
Get a typebot
Import a typebot
website
discord
github
Powered by Mintlify

cURL

Python

JavaScript

PHP

Go

Java

Copy
curl --request POST \
  --url https://app.typebot.io/api/v1/typebots \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "workspaceId": "<string>",
  "typebot": {
    "name": "<string>",
    "icon": "<string>",
    "selectedThemeTemplateId": "<string>",
    "groups": [
      {
        "id": "<string>",
        "title": "<string>",
        "graphCoordinates": {
          "x": 123,
          "y": 123
        },
        "blocks": [
          {
            "id": "<string>",
            "outgoingEdgeId": "<string>",
            "type": "start",
            "label": "<string>"
          }
        ]
      }
    ],
    "events": [
      {
        "id": "<string>",
        "outgoingEdgeId": "<string>",
        "graphCoordinates": {
          "x": 123,
          "y": 123
        },
        "type": "start"
      }
    ],
    "theme": {
      "general": {
        "font": "<string>",
        "background": {
          "type": "Color",
          "content": "<string>"
        },
        "progressBar": {
          "isEnabled": true,
          "color": "<string>",
          "backgroundColor": "<string>",
          "placement": "Top",
          "thickness": 123,
          "position": "fixed"
        }
      },
      "chat": {
        "container": {
          "maxWidth": "<string>",
          "maxHeight": "<string>",
          "backgroundColor": "<string>",
          "color": "<string>",
          "blur": 123,
          "opacity": 0.5,
          "shadow": "none",
          "border": {
            "thickness": 123,
            "color": "<string>",
            "roundeness": "none",
            "customRoundeness": 123,
            "opacity": 0.5
          }
        },
        "hostAvatar": {
          "isEnabled": true,
          "url": "<string>"
        },
        "guestAvatar": {
          "isEnabled": true,
          "url": "<string>"
        },
        "hostBubbles": {
          "backgroundColor": "<string>",
          "color": "<string>",
          "blur": 123,
          "opacity": 0.5,
          "shadow": "none",
          "border": {
            "thickness": 123,
            "color": "<string>",
            "roundeness": "none",
            "customRoundeness": 123,
            "opacity": 0.5
          }
        },
        "guestBubbles": {
          "backgroundColor": "<string>",
          "color": "<string>",
          "blur": 123,
          "opacity": 0.5,
          "shadow": "none",
          "border": {
            "thickness": 123,
            "color": "<string>",
            "roundeness": "none",
            "customRoundeness": 123,
            "opacity": 0.5
          }
        },
        "buttons": {
          "backgroundColor": "<string>",
          "color": "<string>",
          "blur": 123,
          "opacity": 0.5,
          "shadow": "none",
          "border": {
            "thickness": 123,
            "color": "<string>",
            "roundeness": "none",
            "customRoundeness": 123,
            "opacity": 0.5
          }
        },
        "inputs": {
          "backgroundColor": "<string>",
          "color": "<string>",
          "blur": 123,
          "opacity": 0.5,
          "shadow": "none",
          "border": {
            "thickness": 123,
            "color": "<string>",
            "roundeness": "none",
            "customRoundeness": 123,
            "opacity": 0.5
          },
          "placeholderColor": "<string>"
        },
        "roundness": "none",
        "buttonsInput": {
          "layout": "wrap"
        }
      },
      "customCss": "<string>"
    },
    "settings": {
      "general": {
        "isBrandingEnabled": true,
        "isTypingEmulationEnabled": true,
        "isInputPrefillEnabled": true,
        "isHideQueryParamsEnabled": true,
        "isNewResultOnRefreshEnabled": true,
        "rememberUser": {
          "isEnabled": true,
          "storage": "session"
        },
        "systemMessages": {
          "invalidMessage": "<string>",
          "botClosed": "<string>",
          "networkErrorTitle": "<string>",
          "networkErrorMessage": "<string>",
          "popupBlockedTitle": "<string>",
          "popupBlockedDescription": "<string>",
          "popupBlockedButtonLabel": "<string>",
          "fileUploadError": "<string>",
          "fileUploadSizeError": "<string>",
          "whatsAppPictureChoiceSelectLabel": "<string>"
        }
      },
      "typingEmulation": {
        "enabled": true,
        "speed": 123,
        "maxDelay": 123,
        "delayBetweenBubbles": 2.5,
        "isDisabledOnFirstMessage": true
      },
      "metadata": {
        "title": "<string>",
        "description": "<string>",
        "imageUrl": "<string>",
        "favIconUrl": "<string>",
        "customHeadCode": "<string>",
        "googleTagManagerId": "<string>",
        "allowIndexing": true
      },
      "whatsApp": {
        "isEnabled": true,
        "startCondition": {
          "logicalOperator": "OR",
          "comparisons": [
            {
              "id": "<string>",
              "comparisonOperator": "Equal to",
              "value": "<string>"
            }
          ]
        },
        "sessionExpiryTimeout": 24.005
      },
      "publicShare": {
        "isEnabled": true
      },
      "security": {
        "allowedOrigins": [
          "<string>"
        ]
      }
    },
    "folderId": "<string>",
    "variables": [
      {
        "id": "<string>",
        "name": "<string>",
        "isSessionVariable": true,
        "value": "<string>"
      }
    ],
    "edges": [
      {
        "id": "<string>",
        "from": {
          "blockId": "<string>",
          "itemId": "<string>",
          "pathId": "<string>"
        },
        "to": {
          "groupId": "<string>",
          "blockId": "<string>"
        }
      }
    ],
    "resultsTablePreferences": {
      "columnsOrder": [
        "<string>"
      ],
      "columnsVisibility": {},
      "columnsWidth": {}
    },
    "publicId": "<string>",
    "customDomain": "<string>"
  }
}'
ChatGPT Plus

Pensó durante 6 segundos
Aquí tienes cómo debe quedar solo la parte de createBot en tu src/tools/bots.ts, para ajustarte al contrato de la API de Typebot (que exige workspaceId y un objeto typebot en el body).

// src/tools/bots.ts
import axios from 'axios';

export interface CreateBotArgs {
  /**
   * Opcional: si no se pasa, lo cogemos de process.env.TYPEBOT_WORKSPACE_ID
   */
  workspaceId?: string;
  name: string;
  description?: string;
}

export async function createBot(args: CreateBotArgs) {
  // 1) Determinar workspaceId
  const workspaceId = args.workspaceId || process.env.TYPEBOT_WORKSPACE_ID;
  if (!workspaceId) {
    throw new Error(
      'createBot: falta workspaceId (ni en args ni en process.env.TYPEBOT_WORKSPACE_ID)'
    );
  }

  // 2) Construir el payload siguiendo la specs de la API
  const payload = {
    workspaceId,
    typebot: {
      name: args.name,
      description: args.description,
    },
  };

  // 3) Hacer la petición
  const response = await axios.post(
    'https://app.typebot.io/api/v1/typebots',
    payload
  );

  // 4) Devolver el body
  return response.data;
}
Pasos siguientes
Guarda ese cambio en src/tools/bots.ts.

Compila y arranca:

npm run build
npm start
Prueba con curl (PowerShell o Bash):

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "createBot",
    "arguments": {
      "name": "MiBotDePrueba",
      "description": "Creado vía MCP",
      "workspaceId": "cm1vizqdr000rvag38p36itox"
    }
  }'
— O, si tienes TYPEBOT_WORKSPACE_ID en tu .env, puedes omitirlo:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "createBot",
    "arguments": {
      "name": "MiBotDePrueba",
      "description": "Creado vía MCP"
    }
  }'
Deberías recibir ok: true y los datos del nuevo typebot. Cuando lo tengas, dime ✅ listo createBot y seguimos con getBot.

Tú dijiste:
este es mi bots.ts:
// src/tools/bots.ts
import axios from 'axios';

//
// CREATE BOT
//
export interface CreateBotArgs {
  name: string;
  description?: string;
}

export async function createBot(args: CreateBotArgs) {
  const { name, description } = args;
  const response = await axios.post(
    'https://app.typebot.io/api/v1/typebots',
    { name, description }
  );
  return response.data;
}

//
// LIST BOTS
//
export interface ListBotsArgs {
  /**
   * Opcional: si no se pasa, lo tomamos de process.env.TYPEBOT_WORKSPACE_ID
   */
  workspaceId?: string;
}

export async function listBots(args: ListBotsArgs = {}) {
  const workspaceId =
    args.workspaceId || process.env.TYPEBOT_WORKSPACE_ID;
  if (!workspaceId) {
    throw new Error(
      'listBots: falta workspaceId (ni en args ni en .env)'
    );
  }

  // El endpoint requiere el workspaceId como query param
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
  botId: string;
}

export async function getBot(args: GetBotArgs) {
  const { botId } = args;
  const response = await axios.get(
    https://app.typebot.io/api/v1/typebots/${botId}
  );
  return response.data;
}

//
// DELETE BOT
//
export interface DeleteBotArgs {
  botId: string;
}

export async function deleteBot(args: DeleteBotArgs) {
  const { botId } = args;
  await axios.delete(
    https://app.typebot.io/api/v1/typebots/${botId}
  );
  return { success: true };
}
ChatGPT Plus

Pensó durante un par de segundos
Aquí tienes el archivo completo src/tools/bots.ts con createBot ajustado al contrato de la API (requiere workspaceId y un objeto typebot en el body), y las demás funciones (listBots, getBot, deleteBot) listas para usar:

// src/tools/bots.ts
import axios from 'axios';

//
// CREATE BOT
//
export interface CreateBotArgs {
  /**
   * Opcional: si no se pasa, lo tomamos de process.env.TYPEBOT_WORKSPACE_ID
   */
  workspaceId?: string;
  /** Nombre del nuevo typebot */
  name: string;
  /** Descripción opcional */
  description?: string;
}

export async function createBot(args: CreateBotArgs) {
  // 1) Determinar workspaceId
  const workspaceId = args.workspaceId || process.env.TYPEBOT_WORKSPACE_ID;
  if (!workspaceId) {
    throw new Error(
      'createBot: falta workspaceId (ni en args ni en process.env.TYPEBOT_WORKSPACE_ID)'
    );
  }

  // 2) Construir payload según specs de la API
  const payload = {
    workspaceId,
    typebot: {
      name: args.name,
      description: args.description,
    },
  };

  // 3) Hacer la petición
  const response = await axios.post(
    'https://app.typebot.io/api/v1/typebots',
    payload
  );

  // 4) Devolver el body de la respuesta
  return response.data;
}

//
// LIST BOTS
//
export interface ListBotsArgs {
  /**
   * Opcional: si no se pasa, lo tomamos de process.env.TYPEBOT_WORKSPACE_ID
   */
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
  await axios.delete(`https://app.typebot.io/api/v1/typebots/${botId}`);
  return { success: true };
}
Pasos a seguir:

Sustituye tu src/tools/bots.ts por este contenido.

Compila y arranca de nuevo:

npm run build
npm start
Prueba createBot con tu workspaceId (o confiando en process.env.TYPEBOT_WORKSPACE_ID):

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "createBot",
    "arguments": {
      "name": "MiBotDePrueba",
      "description": "Creado vía MCP",
      "workspaceId": "cm1vizqdr000rvag38p36itox"
    }
  }'
— Si usas .env:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "createBot",
    "arguments": {
      "name": "MiBotDePrueba",
      "description": "Creado vía MCP"
    }
  }'
Cuando veas "ok": true y los datos de tu nuevo bot, responde ✅ listo createBot y continuamos con getBot.

Tú dijiste:
perfecto ahora funciono, dame los metodos o lo permitido para ese metodo post de create para irlo documentando
ChatGPT Plus

Pensó durante 6 segundos
Aquí tienes la documentación de la petición POST /api/v1/typebots (el método createBot) con todos los campos que puedes enviar en el body para crear o clonar un Typebot. Úsalo para tu README o tu propia docs.

Endpoint

POST https://app.typebot.io/api/v1/typebots
Headers

Authorization: Bearer <TOKEN>

Content-Type: application/json

Body schema

{
  "workspaceId": "string",        // required: ID de tu workspace
  "typebot": {                    // required: objeto con la definición del bot
    "name": "string",             // required: nombre del bot
    "icon?": "string",            // URL o identificador de icono
    "selectedThemeTemplateId?": "string",
    "groups?": [                  // flujo de conversación (nodos)
      {
        "id?": "string",
        "title?": "string",
        "graphCoordinates": { "x": number, "y": number },
        "blocks": [
          {
            "id": "string",
            "outgoingEdgeId?": "string",
            "type": "start" | "message" | "question" | /*…otros tipos*/,
            "label?": "string"
          }
        ]
      }
    ],
    "events?": [                  // eventos de inicio / triggers
      {
        "id?": "string",
        "outgoingEdgeId?": "string",
        "graphCoordinates": { "x": number, "y": number },
        "type": "start" | /*…otros tipos*/
      }
    ],
    "theme?": {                   // personalización visual
      "general?": {
        "font?": "string",
        "background?": { "type": "Color"|/*…*/, "content": "string" },
        "progressBar?": {
          "isEnabled": boolean,
          "color?": "string",
          "backgroundColor?": "string",
          "placement?": "Top"|"Bottom",
          "thickness?": number,
          "position?": "fixed"|"relative"
        }
      },
      "chat?": {
        "container?": {
          "maxWidth?": "string",
          "maxHeight?": "string",
          "backgroundColor?": "string",
          "color?": "string",
          "blur?": number,
          "opacity?": number,
          "shadow?": "none"|/*…*/,
          "border?": {
            "thickness?": number,
            "color?": "string",
            "roundeness?": "none"|/*…*/,
            "customRoundeness?": number,
            "opacity?": number
          }
        },
        "hostAvatar?": { "isEnabled": boolean, "url?": "string" },
        "guestAvatar?": { "isEnabled": boolean, "url?": "string" },
        "hostBubbles?": {/* similar a container.border */},
        "guestBubbles?": {/* … */},
        "buttons?": {/* … */},
        "inputs?": {/* … */},
        "roundness?": "none"|/*…*/,
        "buttonsInput?": { "layout?": "wrap"|/*…*/ }
      },
      "customCss?": "string"
    },
    "settings?": {                // comportamiento y opciones
      "general?": {
        "isBrandingEnabled?": boolean,
        "isTypingEmulationEnabled?": boolean,
        "isInputPrefillEnabled?": boolean,
        "isHideQueryParamsEnabled?": boolean,
        "isNewResultOnRefreshEnabled?": boolean,
        "rememberUser?": { "isEnabled": boolean, "storage": "session"|"local" },
        "systemMessages?": { /* varios textos de error y alertas */ }
      },
      "typingEmulation?": { "enabled": boolean, "speed?": number, /*…*/ },
      "metadata?": { "title?": "string", "description?": "string", /*…*/ },
      "whatsApp?": { "isEnabled": boolean, /*…*/ },
      "publicShare?": { "isEnabled": boolean },
      "security?": { "allowedOrigins?": ["string"] }
    },
    "folderId?": "string",         // sitúa el bot dentro de una carpeta
    "variables?": [                // variables de entorno del bot
      { "id?": "string", "name": "string", "isSessionVariable": boolean, "value": "string" }
    ],
    "edges?": [                    // conexiones entre grupos/bloques
      {
        "id?": "string",
        "from": { "blockId": "string", "itemId?": "string", "pathId?": "string" },
        "to": { "groupId": "string", "blockId": "string" }
      }
    ],
    "resultsTablePreferences?": {
      "columnsOrder?": ["string"],
      "columnsVisibility?": { [columnId: string]: boolean },
      "columnsWidth?": { [columnId: string]: number }
    },
    "publicId?": "string",         // slug público
    "customDomain?": "string"      // dominio propio
  }
}
Campos con ? son opcionales.

Estructuras anidadas (groups, events, theme, settings, etc.) las puedes omitir por completo y el bot se creará con valores por defecto.

Para documentación interna, puedes pegar esta definición como un bloque de JSON Schema o TS-Interface y ajustarla a tus necesidades.

Tú dijiste:
dame documentacion de list bots
post http://localhost:3000/invoke 

{
    "tool": "listBots",
    "arguments": {}
  }
ChatGPT Plus
Aquí tienes la documentación para la herramienta listBots de tu MCP:

Invocación vía MCP

POST http://localhost:3000/invoke
Content-Type: application/json

{
  "tool": "listBots",
  "arguments": {
    // opcional: workspaceId; si no se pasa, se lee de TYPEBOT_WORKSPACE_ID en .env
    "workspaceId": "cm1vizqdr000rvag38p36itox"
  }
}
💡 Si ya defines TYPEBOT_WORKSPACE_ID en tu .env, puedes omitir workspaceId en arguments.

Argumentos
Argumento	Tipo	Requisito	Descripción
workspaceId	string	opcional (pero necesario si no está en .env)	ID del workspace en el que listar los bots.
Response exitosa
{
  "ok": true,
  "result": {
    "typebots": [
      {
        "id": "cm2o1m4x30001s2kmxqdx7u4m",
        "name": "SEO chat",
        "icon": null,
        "accessRight": "write",
        "publishedTypebotId": null
      },
      {
        "id": "cm2o0xkoy000e9fapcf729x78",
        "name": "Crypto test",
        "icon": null,
        "accessRight": "write",
        "publishedTypebotId": null
      }
      /* … más typebots … */
    ]
  }
}
typebots (array): listado de bots en el workspace.

id (string): identificador único del bot.

name (string): nombre del bot.

icon (string|null): URL o identificador de icono, si está definido.

accessRight ("write"|"read"): nivel de permisos.

publishedTypebotId (string|null): si el bot está publicado, su ID público; null si no.

Response de error
400 Bad Request: falta workspaceId y no está en .env

{ "ok": false, "error": "listBots: falta workspaceId (ni en args ni en process.env.TYPEBOT_WORKSPACE_ID)" }
401 Unauthorized: token ausente o inválido

{ "ok": false, "error": "Request failed with status code 401" }
500 Internal Server Error: error interno / fallo de red

{ "ok": false, "error": "Network Error" }
Implementación en src/tools/bots.ts
export interface ListBotsArgs {
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
Eso es todo para listBots. Si necesitas ajustar algo más, ¡dime!

Tú dijiste:
ahora para auth: 
post http://localhost:3000/invoke
{"tool":"authenticate","arguments":{"token":"9pDtqOAuITHMufiOiWIv6pez"}}
ChatGPT Plus
Invocación vía MCP

POST http://localhost:3000/invoke
Content-Type: application/json

{
  "tool": "authenticate",
  "arguments": {
    "token": "<TU_TOKEN_AQUÍ>"
  }
}
Este paso sólo debe ejecutarse una vez por sesión o cuando cambies de token. Configura el header Authorization para todas las llamadas siguientes.

Argumentos
Argumento	Tipo	Requisito	Descripción
token	string	required	Tu API token de Typebot (Bearer token).
Response exitosa
{
  "ok": true,
  "result": {
    "workspaces": [
      {
        "id": "cm1vizqdr000rvag38p36itox",
        "name": "Osdeibi Acurero's workspace",
        "icon": null,
        "plan": "FREE"
      }
      // …otros workspaces si los tienes…
    ]
  }
}
workspaces (array): lista de workspaces accesibles con este token.

id: identificador del workspace.

name: nombre del workspace.

icon: URL o null si no tiene icono.

plan: plan de Typebot asociado (FREE, PRO, etc.).

Responses de error
400 Bad Request (JSON inválido o falta de token):

{ "ok": false, "error": "`token` debe ser un string" }
401 Unauthorized (token inválido o expirado):

{ "ok": false, "error": "Request failed with status code 401" }
500 Internal Server Error (fallo de red, sin conexión, etc.):

{ "ok": false, "error": "Network Error" }
Implementación en src/tools/auth.ts
import axios from 'axios';

export interface AuthArgs {
  token: string;
}

/**
 * Configura el bearer token para todas las peticiones Axios
 * y prueba la conexión listando los workspaces.
 */
export async function authenticate(args: AuthArgs) {
  const { token } = args;

  // 1) Inyecta el header en axios
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // 2) Llamada de prueba
  const response = await axios.get(
    'https://app.typebot.io/api/v1/workspaces'
  );

  // 3) Devuelve la lista de workspaces
  return response.data;
}
— Asegúrate de que, tras invocar authenticate, todas las demás herramientas (listBots, createBot, etc.) usarán automáticamente ese token en su header.

Tú dijiste:
ok continuemos ahora con el get bots por id (eso no funciona
post http://localhost:3000/invoke
{"tool":"getBot","arguments":{"botId":"tuid"}}
ChatGPT Plus

Pensó durante 11 segundos
Invocación vía MCP

POST http://localhost:3000/invoke
Content-Type: application/json

{
  "tool": "getBot",
  "arguments": {
    "botId": "<ID_DEL_BOT>"
  }
}
Este endpoint recupera todos los detalles de un Typebot existente.

Argumentos
Argumento	Tipo	Requisito	Descripción
botId	string	requerido	ID único del Typebot a recuperar 
docs.typebot.io
.
Response exitosa
{
  "ok": true,
  "result": {
    "typebot": {
      "id": "<string>",
      "name": "<string>",
      "events": [ /* array de nodos de inicio */ ],
      "groups": [ /* array de grupos y bloques */ ],
      "edges": [ /* array de conexiones */ ],
      "variables": [ /* array de variables */ ],
      "theme": { /* configuración visual */ },
      "selectedThemeTemplateId": "<string>",
      "settings": { /* configuración de comportamiento */ },
      "createdAt": "<ISO8601>",
      "updatedAt": "<ISO8601>",
      "icon": "<string|null>",
      "folderId": "<string|null>",
      "publicId": "<string|null>",
      "customDomain": "<string|null>",
      "workspaceId": "<string>",
      "version": "<string>"
    }
  }
}
typebot (object): definición completa del bot, incluyendo flujo (groups, events, edges), apariencia (theme), configuraciones (settings) y metadatos (fechas, IDs) 
docs.typebot.io
.

Responses de error
400 Bad Request

{ "ok": false, "error": "`botId` debe ser un string" }
401 Unauthorized

{ "ok": false, "error": "Request failed with status code 401" }
403 Forbidden

{ "ok": false, "error": "Request failed with status code 403" }
404 Not Found

{ "ok": false, "error": "Request failed with status code 404" }
500 Internal Server Error

{ "ok": false, "error": "Network Error" }
Implementación en src/tools/bots.ts
import axios from 'axios';

export interface GetBotArgs {
  /** ID del Typebot a recuperar */
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
Asegúrate de registrar la herramienta en tu index.ts:

tools.set('getBot', {
  func: getBot,
  description: 'Recupera un Typebot por su ID'
});
Con esto, al invocar getBot vía MCP deberías recibir la definición completa del bot o el error correspondiente.

Tú dijiste:
cuando te digo que no funcina es que me da este error {
    "ok": false,
    "error": "Request failed with status code 404"
} 
ChatGPT Plus

Pensó durante 4 segundos
Aquí tienes la documentación completa de la tool getBot y un ejemplo concreto de cómo usarla para evitar el 404:

Invocación vía MCP

POST http://localhost:3000/invoke
Content-Type: application/json

{
  "tool": "getBot",
  "arguments": {
    "botId": "<ID_DEL_TYPEBOT>"
  }
}
💡 Importante: <ID_DEL_TYPEBOT> debe ser uno de los IDs que obtuviste al listar tus bots con listBots. Si mandas un valor que no existe, la API devolverá 404.

Argumentos
Argumento	Tipo	Requisito	Descripción
botId	string	required	El ID del typebot que quieres recuperar.
Ejemplo práctico
Primero, lista tus bots para tomar un ID válido (ya lo hiciste):

curl … -d '{"tool":"listBots","arguments":{}}'
Supongamos que uno de los resultados fue:

{
  "ok": true,
  "result": {
    "typebots": [
      {
        "id": "cm2o1m4x30001s2kmxqdx7u4m",
        "name": "SEO chat",
        …
      },
      …
    ]
  }
}
Luego, pásale ese ID exacto a getBot:

curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "getBot",
    "arguments": {
      "botId": "cm2o1m4x30001s2kmxqdx7u4m"
    }
  }'
Respuesta esperada:

{
  "ok": true,
  "result": {
    "typebot": {
      "id": "cm2o1m4x30001s2kmxqdx7u4m",
      "name": "SEO chat",
      "groups": [ /* … */ ],
      "events": [ /* … */ ],
      "edges": [ /* … */ ],
      "variables": [ /* … */ ],
      "theme": { /* … */ },
      "settings": { /* … */ },
      "createdAt": "2025-05-10T14:23:00.000Z",
      "updatedAt": "2025-06-01T09:45:00.000Z",
      "icon": null,
      "folderId": null,
      "publicId": null,
      "customDomain": null,
      "workspaceId": "cm1vizqdr000rvag38p36itox",
      "version": "1.0.0"
    }
  }
}
Respuestas de error comunes
404 Not Found

{ "ok": false, "error": "Request failed with status code 404" }
Significa que el botId no coincide con ningún typebot existente. Revisa que lo hayas copiado tal cual de la salida de listBots.

401 Unauthorized

{ "ok": false, "error": "Request failed with status code 401" }
Revisa tu token y asegúrate de haberlo cargado en axios.defaults.headers.common['Authorization'] (o de haber corrido authenticate / haber puesto TYPEBOT_TOKEN en tu .env).

500 Internal Server Error

{ "ok": false, "error": "Network Error" }
Implementación de getBot en src/tools/bots.ts
export interface GetBotArgs {
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
Con esto, si usas un ID válido tal como "cm2o1m4x30001s2kmxqdx7u4m", ya no deberías obtener 404. ¡Prueba y dime si te funciona!

Tú dijiste:
ya funciona:
{"ok":true,"result":{"typebot":{"version":"6","id":"cm2o1m4x30001s2kmxqdx7u4m","name":"SEO chat","events":[{"id":"xi29yuog67g6br9a4t4i76qh","outgoingEdgeId":"f05arh7ekz1ehp4e60d5q5e7","graphCoordinates":{"x":-62,"y":-96},"type":"start"}],"groups":[{"id":"kq57mzm1yd1s4hvft624e3b0","title":"SEO API","graphCoordinates":{"x":296,"y":-189},"blocks":[{"id":"q0gmmi45x0o8otvpxey5xlih","type":"Webhook","options":{"responseVariableMapping":[{"id":"zi05potod331ywo3qrpnz0ya","variableId":"vq1s0w5m08ubfk2j2lci0jbp3","bodyPath":"data.domain"},{"id":"mnjlfoo8ltxvlsj9wmfovy23","variableId":"vennm59bpd8zfzgbz9ovcxecw","bodyPath":"data.meta_description.content"},{"id":"jr5m5seqovk0m82lhurt4gnr","variableId":"vlvbj1q5w225s1uiv8zg5l5bh","bodyPath":"data.meta_description.length"},{"id":"srd9wi2pt463bgl9emef3uke","variableId":"va14bllna8d2dqvst0lj4wocj","bodyPath":"data.meta_title.content"},{"id":"zkuxks2bwdjrp7oaowhobru1","variableId":"vzkjemeu19k6m4044u4pb6bps","bodyPath":"data.meta_title.length"},{"id":"fklhcodew8x5bfbtvzcws83q","variableId":"vgc7auvlatm3tvjxp2hdc4niu","bodyPath":"data.h1_tags.count"},{"id":"saipdjdweh7jqtqaflvk8h7p","variableId":"vffra9qbyvs0u8utj8enphn9d","bodyPath":"data.viewport"},{"id":"webei49rqt0gk8i5ygwkznc9","variableId":"vxf53ygey5f1gxf67konvdjvh","bodyPath":"data.meta_robots"},{"id":"aihn4gr92tsy2jde31rim4wi","variableId":"vd4mdh71x8zqxvpgbno1up3fr","bodyPath":"data.verifications.google"},{"id":"sof64fqsrtxtkdp4sy89mbcu","variableId":"vkz6whvikzyfityrcd8i5twib","bodyPath":"data.verifications.bing"},{"id":"wucrpojkj6dq2vb9p0bxhkwh","variableId":"vqequlmmx9yhtbwslu7xi93jw","bodyPath":"data.verifications.yandex"},{"id":"tnrc0oxmo9yynbd1mmhjb0kg","variableId":"vm2nvrc96am3e8lydqux0fwo2","bodyPath":"data.structured_data.flatMap(item => item.type)"},{"id":"qeouqnv8kuxczuilz8yhkbcy","variableId":"vlbyd5e7o22c0ru6aicsv53h7","bodyPath":"data.image_count.jpg"},{"id":"ggya72u0cqsmxl4c0lubo930","variableId":"vvxefdq5jl3tzhnfp67s18dh9","bodyPath":"data.image_count.jpeg"},{"id":"caepm0s7dlkwarqjk20fd8a3","variableId":"vulq0qu3bigvaijdog09ulqnw","bodyPath":"data.image_count.png"},{"id":"bkgjc929d1bnjwdgpo45l3d5","variableId":"vp2x0azn2zdsly64jo5qsq265","bodyPath":"data.image_count.webp"},{"id":"kht21ipfqef2nsefhekpfupy","variableId":"vg4haehe5yzaj4gtvh7afpbcg","bodyPath":"data.image_count.svg"}],"webhook":{"method":"GET","url":"http://seo-api-seoenespanol.vercel.app/api/seo/osdeibi.dev"}}},{"id":"rrxbwhlxilarxl0ss18ilpqy","type":"text","content":{"richText":[{"type":"p","children":[{"text":"tus datos son:"}]},{"type":"p","children":[{"text":"{{r_strucutred_data}}"}]},{"type":"p","children":[{"text":""}]}]}}]},{"id":"grw6ehauu3hms3tupb4jcsu4","title":"Group #2","graphCoordinates":{"x":-82,"y":49},"blocks":[{"id":"ikw8jl3z5l9r3qg9n5ks18uk","type":"text","content":{"richText":[{"type":"p","children":[{"text":"Coloca tu nombre de dominio sin https ni www (ejemplo.com)"}]}]}},{"id":"uo4iad40qznqp70f6bq7fhkb","type":"text input","options":{"labels":{"placeholder":"dominio.com"},"variableId":"vt54kk49ec3m6er5cpri1doz0"}},{"id":"j9z1h7k7zn8rrpccwi4u12jh","type":"Condition","items":[{"id":"oorhjr2ei9rtid63hl2p4d8a","outgoingEdgeId":"wkf8yiw8ucsrebf2pg5psxl4","content":{"comparisons":[{"id":"uprm6igc6gdb7fpnnnjgrsjl","variableId":"vt54kk49ec3m6er5cpri1doz0","comparisonOperator":"Is set"}]}}]}]}],"edges":[{"id":"f05arh7ekz1ehp4e60d5q5e7","from":{"eventId":"xi29yuog67g6br9a4t4i76qh"},"to":{"groupId":"grw6ehauu3hms3tupb4jcsu4","blockId":"ikw8jl3z5l9r3qg9n5ks18uk"}},{"id":"wkf8yiw8ucsrebf2pg5psxl4","from":{"blockId":"j9z1h7k7zn8rrpccwi4u12jh","itemId":"oorhjr2ei9rtid63hl2p4d8a"},"to":{"groupId":"kq57mzm1yd1s4hvft624e3b0","blockId":"q0gmmi45x0o8otvpxey5xlih"}}],"variables":[{"id":"vt54kk49ec3m6er5cpri1doz0","name":"user_domain","isSessionVariable":false},{"id":"vg4haehe5yzaj4gtvh7afpbcg","name":"r_img_count_svg","isSessionVariable":true},{"id":"vp2x0azn2zdsly64jo5qsq265","name":"r_img_count_webp","isSessionVariable":true},{"id":"vulq0qu3bigvaijdog09ulqnw","name":"r_img_count_png","isSessionVariable":true},{"id":"vvxefdq5jl3tzhnfp67s18dh9","name":"r_img_count_jpeg","isSessionVariable":true},{"id":"vlbyd5e7o22c0ru6aicsv53h7","name":"r_img_count_jpg","isSessionVariable":true},{"id":"vm2nvrc96am3e8lydqux0fwo2","name":"r_strucutred_data","isSessionVariable":true},{"id":"vqequlmmx9yhtbwslu7xi93jw","name":"r_verify_yandex","isSessionVariable":true},{"id":"vkz6whvikzyfityrcd8i5twib","name":"r_verify_bing","isSessionVariable":true},{"id":"vd4mdh71x8zqxvpgbno1up3fr","name":"r_verify_google","isSessionVariable":true},{"id":"vxf53ygey5f1gxf67konvdjvh","name":"r_robots","isSessionVariable":true},{"id":"vffra9qbyvs0u8utj8enphn9d","name":"r_viewport","isSessionVariable":true},{"id":"vgc7auvlatm3tvjxp2hdc4niu","name":"r_h1_count","isSessionVariable":true},{"id":"vzkjemeu19k6m4044u4pb6bps","name":"r_meta_title_length","isSessionVariable":true},{"id":"va14bllna8d2dqvst0lj4wocj","name":"r_meta_title_content","isSessionVariable":true},{"id":"vlvbj1q5w225s1uiv8zg5l5bh","name":"r_meta_desc_length","isSessionVariable":true},{"id":"vennm59bpd8zfzgbz9ovcxecw","name":"r_meta_desc_content","isSessionVariable":true},{"id":"vq1s0w5m08ubfk2j2lci0jbp3","name":"r_domain","isSessionVariable":true}],"theme":{"chat":{"hostAvatar":{"isEnabled":false}}},"selectedThemeTemplateId":null,"settings":{"general":{"isBrandingEnabled":true}},"createdAt":"2024-10-25T01:17:55.431Z","updatedAt":"2024-10-26T06:03:15.880Z","icon":null,"folderId":null,"publicId":"seo-chat-qdx7u4m","customDomain":null,"workspaceId":"cm1vizqdr000rvag38p36itox","resultsTablePreferences":null,"isArchived":false,"isClosed":false,"whatsAppCredentialsId":null,"riskLevel":null},"currentUserMode":"write"}}


ahora dame la documentacion de eso
ChatGPT Plus

Pensó durante 8 segundos
Invocación vía MCP

POST http://localhost:3000/invoke
Content-Type: application/json

{
  "tool": "getBot",
  "arguments": {
    "botId": "<ID_DEL_TYPEBOT>"
  }
}
Argumentos
Argumento	Tipo	Requerido	Descripción
botId	string	sí	ID único del Typebot que quieres recuperar.
Response exitosa
{
  "ok": true,
  "result": {
    "typebot": {
      "version": "6",                 
      "id": "cm2o1m4x30001s2kmxqdx7u4m",
      "name": "SEO chat",
      "events": [                     // lista de nodos de inicio o triggers
        {
          "id": "xi29yuog67g6br9a4t4i76qh",
          "outgoingEdgeId": "f05arh7ekz1ehp4e60d5q5e7",
          "graphCoordinates": { "x": -62, "y": -96 },
          "type": "start"
        }
      ],
      "groups": [                     // definición de los grupos y bloques
        {
          "id": "kq57mzm1yd1s4hvft624e3b0",
          "title": "SEO API",
          "graphCoordinates": { "x": 296, "y": -189 },
          "blocks": [
            {
              "id": "q0gmmi45x0o8otvpxey5xlih",
              "type": "Webhook",
              "options": {
                "responseVariableMapping": [
                  { "id": "...", "variableId": "...", "bodyPath": "data.domain" },
                  // …
                ],
                "webhook": {
                  "method": "GET",
                  "url": "http://seo-api-seoenespanol.vercel.app/api/seo/osdeibi.dev"
                }
              }
            },
            {
              "id": "rrxbwhlxilarxl0ss18ilpqy",
              "type": "text",
              "content": {
                "richText": [
                  { "type": "p", "children": [{ "text": "tus datos son:" }] },
                  // …
                ]
              }
            }
          ]
        },
        // …otros grupos…
      ],
      "edges": [                     // aristas que conectan eventos, bloques y grupos
        {
          "id": "f05arh7ekz1ehp4e60d5q5e7",
          "from": { "eventId": "xi29yuog67g6br9a4t4i76qh" },
          "to": { "groupId": "grw6ehauu3hms3tupb4jcsu4", "blockId": "ikw8jl3z5l9r3qg9n5ks18uk" }
        },
        // …
      ],
      "variables": [                 // variables usadas en el flujo
        { "id": "vt54kk49ec3m6er5cpri1doz0", "name": "user_domain",      "isSessionVariable": false },
        { "id": "vg4haehe5yzaj4gtvh7afpbcg", "name": "r_img_count_svg",  "isSessionVariable": true },
        // …
      ],
      "theme": {                     // configuración visual (solo un ejemplo)
        "chat": { "hostAvatar": { "isEnabled": false } }
      },
      "selectedThemeTemplateId": null,
      "settings": {                  // ajustes de comportamiento mínimos
        "general": { "isBrandingEnabled": true }
      },
      "createdAt": "2024-10-25T01:17:55.431Z",
      "updatedAt": "2024-10-26T06:03:15.880Z",
      "icon": null,
      "folderId": null,
      "publicId": "seo-chat-qdx7u4m",
      "customDomain": null,
      "workspaceId": "cm1vizqdr000rvag38p36itox",
      "resultsTablePreferences": null,
      "isArchived": false,
      "isClosed": false,
      "whatsAppCredentialsId": null,
      "riskLevel": null,
      "currentUserMode": "write"
    }
  }
}
Campos clave de typebot
Campo	Tipo	Descripción
version	string	Versión interna del bot.
id	string	ID único del Typebot.
name	string	Nombre del bot.
events	Event[]	Lista de eventos de inicio/trigger.
groups	Group[]	Grupos con sus bloques (flujo de conversación).
edges	Edge[]	Conexiones entre eventos, bloques y grupos.
variables	Variable[]	Variables definidas en el bot.
theme	object	Configuración visual básica.
selectedThemeTemplateId	string | null	Plantilla de tema seleccionada.
settings	object	Opciones de comportamiento (general, etc.).
createdAt, updatedAt	string (ISO8601)	Tiempos de creación y última modificación.
icon, folderId	string | null	Icono y carpeta asociada (si aplica).
publicId, customDomain	string | null	Identificador público y dominio personalizado.
workspaceId	string	ID del workspace al que pertenece.
resultsTablePreferences	object | null	Preferencias de tabla de resultados.
isArchived, isClosed	boolean	Estado de archivo o cerrado.
whatsAppCredentialsId	string | null	ID de credenciales de WhatsApp (si aplica).
riskLevel	string | null	Nivel de riesgo asignado (interno).
currentUserMode	string	Permiso del usuario actual (write o read).
Responses de error
400 Bad Request

{ "ok": false, "error": "`botId` debe ser un string" }
401 Unauthorized

{ "ok": false, "error": "Request failed with status code 401" }
404 Not Found

{ "ok": false, "error": "Request failed with status code 404" }
500 Internal Server Error

{ "ok": false, "error": "Network Error" }
Implementación en src/tools/bots.ts
export interface GetBotArgs {
  botId: string;
}

export async function getBot(args: GetBotArgs) {
  if (!args.botId) {
    throw new Error('getBot: falta botId');
  }
  const response = await axios.get(
    `https://app.typebot.io/api/v1/typebots/${args.botId}`
  );
  return response.data;
}
Con esta documentación ya tienes un resumen completo de los datos que devuelve getBot.

Tú dijiste:
ahora trabajemos el metodo update de un tupebot:
Typebot
Update a typebot
PATCH
/
v1
/
typebots
/
{typebotId}

Try it
Authorizations
​
Authorization
stringheaderrequired
Bearer authentication header of the form Bearer <token>, where <token> is your auth token.

Path Parameters
​
typebotId
stringrequired
Where to find my bot's ID?

Body
application/json
​
typebot
objectrequired
Typebot V6
Typebot V5

Show child attributes

​
overwrite
boolean
If true, even if we detect a conflict, we will overwrite push the updates to the typebot

Response
200

200
application/json
Successful response

​
typebot
objectrequired

Show child attributes

Suggest edits
Import a typebot
Delete a typebot
website
discord
github
Powered by Mintlify

cURL

Python

JavaScript

PHP

Go

Java

Copy
curl --request PATCH \
  --url https://app.typebot.io/api/v1/typebots/{typebotId} \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "typebot": {
    "version": "6",
    "name": "<string>",
    "icon": "<string>",
    "selectedThemeTemplateId": "<string>",
    "groups": [
      {
        "id": "<string>",
        "title": "<string>",
        "graphCoordinates": {
          "x": 123,
          "y": 123
        },
        "blocks": [
          {
            "id": "<string>",
            "outgoingEdgeId": "<string>",
            "type": "start",
            "label": "<string>"
          }
        ]
      }
    ],
    "theme": {
      "general": {
        "font": "<string>",
        "background": {
          "type": "Color",
          "content": "<string>"
        },
        "progressBar": {
          "isEnabled": true,
          "color": "<string>",
          "backgroundColor": "<string>",
          "placement": "Top",
          "thickness": 123,
          "position": "fixed"
        }
      },
      "chat": {
        "container": {
          "maxWidth": "<string>",
          "maxHeight": "<string>",
          "backgroundColor": "<string>",
          "color": "<string>",
          "blur": 123,
          "opacity": 0.5,
          "shadow": "none",
          "border": {
            "thickness": 123,
            "color": "<string>",
            "roundeness": "none",
            "customRoundeness": 123,
            "opacity": 0.5
          }
        },
        "hostAvatar": {
          "isEnabled": true,
          "url": "<string>"
        },
        "guestAvatar": {
          "isEnabled": true,
          "url": "<string>"
        },
        "hostBubbles": {
          "backgroundColor": "<string>",
          "color": "<string>",
          "blur": 123,
          "opacity": 0.5,
          "shadow": "none",
          "border": {
            "thickness": 123,
            "color": "<string>",
            "roundeness": "none",
            "customRoundeness": 123,
            "opacity": 0.5
          }
        },
        "guestBubbles": {
          "backgroundColor": "<string>",
          "color": "<string>",
          "blur": 123,
          "opacity": 0.5,
          "shadow": "none",
          "border": {
            "thickness": 123,
            "color": "<string>",
            "roundeness": "none",
            "customRoundeness": 123,
            "opacity": 0.5
          }
        },
        "buttons": {
          "backgroundColor": "<string>",
          "color": "<string>",
          "blur": 123,
          "opacity": 0.5,
          "shadow": "none",
          "border": {
            "thickness": 123,
            "color": "<string>",
            "roundeness": "none",
            "customRoundeness": 123,
            "opacity": 0.5
          }
        },
        "inputs": {
          "backgroundColor": "<string>",
          "color": "<string>",
          "blur": 123,
          "opacity": 0.5,
          "shadow": "none",
          "border": {
            "thickness": 123,
            "color": "<string>",
            "roundeness": "none",
            "customRoundeness": 123,
            "opacity": 0.5
          },
          "placeholderColor": "<string>"
        },
        "roundness": "none",
        "buttonsInput": {
          "layout": "wrap"
        }
      },
      "customCss": "<string>"
    },
    "settings": {
      "general": {
        "isBrandingEnabled": true,
        "isTypingEmulationEnabled": true,
        "isInputPrefillEnabled": true,
        "isHideQueryParamsEnabled": true,
        "isNewResultOnRefreshEnabled": true,
        "rememberUser": {
          "isEnabled": true,
          "storage": "session"
        },
        "systemMessages": {
          "invalidMessage": "<string>",
          "botClosed": "<string>",
          "networkErrorTitle": "<string>",
          "networkErrorMessage": "<string>",
          "popupBlockedTitle": "<string>",
          "popupBlockedDescription": "<string>",
          "popupBlockedButtonLabel": "<string>",
          "fileUploadError": "<string>",
          "fileUploadSizeError": "<string>",
          "whatsAppPictureChoiceSelectLabel": "<string>"
        }
      },
      "typingEmulation": {
        "enabled": true,
        "speed": 123,
        "maxDelay": 123,
        "delayBetweenBubbles": 2.5,
        "isDisabledOnFirstMessage": true
      },
      "metadata": {
        "title": "<string>",
        "description": "<string>",
        "imageUrl": "<string>",
        "favIconUrl": "<string>",
        "customHeadCode": "<string>",
        "googleTagManagerId": "<string>",
        "allowIndexing": true
      },
      "whatsApp": {
        "isEnabled": true,
        "startCondition": {
          "logicalOperator": "OR",
          "comparisons": [
            {
              "id": "<string>",
              "comparisonOperator": "Equal to",
              "value": "<string>"
            }
          ]
        },
        "sessionExpiryTimeout": 24.005
      },
      "publicShare": {
        "isEnabled": true
      },
      "security": {
        "allowedOrigins": [
          "<string>"
        ]
      }
    },
    "folderId": "<string>",
    "variables": [
      {
        "id": "<string>",
        "name": "<string>",
        "isSessionVariable": true,
        "value": "<string>"
      }
    ],
    "edges": [
      {
        "id": "<string>",
        "from": {
          "blockId": "<string>",
          "itemId": "<string>",
          "pathId": "<string>"
        },
        "to": {
          "groupId": "<string>",
          "blockId": "<string>"
        }
      }
    ],
    "resultsTablePreferences": {
      "columnsOrder": [
        "<string>"
      ],
      "columnsVisibility": {},
      "columnsWidth": {}
    },
    "publicId": "<string>",
    "customDomain": "<string>",
    "isClosed": true,
    "whatsAppCredentialsId": "<string>",
    "riskLevel": 123,
    "events": [
      {
        "id": "<string>",
        "outgoingEdgeId": "<string>",
        "graphCoordinates": {
          "x": 123,
          "y": 123
        },
        "type": "start"
      }
    ],
    "updatedAt": "<string>"
  },
  "overwrite": true
}'

sin modoificar lo que ya funciona
ChatGPT Plus

Pensó durante unos pocos segundos
Aquí tienes cómo añadir el método updateBot a tu MCP sin tocar lo que ya funciona:

1. Implementación en src/tools/bots.ts
Añade al final de bots.ts:

//
// UPDATE BOT
//
export interface UpdateBotArgs {
  /** ID del typebot a actualizar */
  botId: string;
  /**
   * Parcial o completo: objeto con los campos V6 que quieras modificar.
   * Ejemplo mínimo: { name: "Nuevo nombre" }
   */
  typebot: Record<string, any>;
  /**
   * Opcional: si es true, fuerza el overwrite aunque haya conflicto.
   * Por defecto false.
   */
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
2. Registro en src/index.ts
Justo donde registras las otras herramientas (createBot, getBot, etc.), añade:

import { updateBot } from './tools/bots';

tools.set('updateBot', {
  func: updateBot,
  description: 'Actualiza un Typebot existente. Parámetros: botId, typebot (campos a cambiar), overwrite?'
});
3. Compilar y arrancar
npm run build
npm start
4. Documentación de uso vía MCP
Invocación
POST http://localhost:3000/invoke
Content-Type: application/json

{
  "tool": "updateBot",
  "arguments": {
    "botId": "cm2o1m4x30001s2kmxqdx7u4m",
    "typebot": {
      "name": "SEO chat v2",
      "settings": { "general": { "isBrandingEnabled": false } }
    },
    "overwrite": true
  }
}
botId (string, requerido): ID del bot que quieres actualizar.

typebot (object, requerido): mapa con los campos según V6 que deseas modificar (p.ej. name, groups, theme, etc.).

overwrite (boolean, opcional): si true, fuerza los cambios ante conflictos.

Ejemplo mínimo
curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "updateBot",
    "arguments": {
      "botId": "cm2o1m4x30001s2kmxqdx7u4m",
      "typebot": { "name": "SEO chat v2" }
    }
  }'
Respuesta esperada
{
  "ok": true,
  "result": {
    "typebot": {
      "id": "cm2o1m4x30001s2kmxqdx7u4m",
      "name": "SEO chat v2",
      /* …el resto de la definición actualizada… */
    }
  }
}
Errores comunes
400 Bad Request (falta botId o typebot mal formado):

{"ok":false,"error":"updateBot: falta botId"}
o

{"ok":false,"error":"updateBot: falta objeto typebot con la actualización"}
401 Unauthorized (token faltante o inválido):

{"ok":false,"error":"Request failed with status code 401"}
404 Not Found (ID de bot no existe):

{"ok":false,"error":"Request failed with status code 404"}
409 Conflict (conflicto de versión, si no usas overwrite):

{"ok":false,"error":"Request failed with status code 409"}
Con esto ya tienes tu updateBot listo para integrarse con el resto del MCP.

Tú dijiste:
Block-scoped variable 'tools' used before its declaration.ts(2448)
index.ts(36, 7): 'tools' is declared here.
ChatGPT Plus

Pensó durante un par de segundos
El error te está diciendo que estás llamando a tools.set(...) antes de haber declarado const tools = new Map(...). En JavaScript/TypeScript no puedes usar una variable de bloque antes de su declaración.

Para solucionarlo, asegúrate de que tu index.ts tenga este orden:

Importas todo (Express, bodyParser, tus tools, incluido updateBot).

Declaras la variable tools.

Registras todas las herramientas (tools.set(...), incluido updateBot).

Después defines invokeTool, middleware, main()…

Por ejemplo:

// 1. Imports
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { authenticate } from './tools/auth';
import {
  createBot,
  listBots,
  getBot,
  deleteBot,
  updateBot,          // ← import aquí
} from './tools/bots';

// 2. Declaración de tools
const tools = new Map<string, {
  func: (args: any) => Promise<any>;
  description: string;
}>();

// 3. Registro de herramientas
tools.set('authenticate', {
  func: authenticate,
  description: 'Configura tu token de Typebot y comprueba la conexión'
});
tools.set('createBot', {
  func: createBot,
  description: 'Crea un nuevo Typebot con nombre y descripción'
});
tools.set('listBots', {
  func: listBots,
  description: 'Lista todos los Typebots de un workspace'
});
tools.set('getBot', {
  func: getBot,
  description: 'Recupera un Typebot por su ID'
});
tools.set('deleteBot', {
  func: deleteBot,
  description: 'Elimina un Typebot por su ID'
});
tools.set('updateBot', {   // ← registra updateBot **después** de declarar tools
  func: updateBot,
  description: 'Actualiza un Typebot existente'
});

// 4. invokeTool, middleware, main, etc.
async function invokeTool(toolName: string, args: any): Promise<any> {
  const tool = tools.get(toolName);
  if (!tool) throw new Error(`Herramienta desconocida: ${toolName}`);
  return tool.func(args);
}

// ... resto de tu index.ts ...
Con esto, el compilador ya verá tools definido antes de cualquier tools.set(...) y desaparecerá el error de “used before its declaration”.

Tú dijiste:
este es mi index.ts:
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { authenticate } from './tools/auth';
import { createBot, listBots, getBot, deleteBot, updateBot } from './tools/bots';


tools.set('updateBot', {
  func: updateBot,
  description: 'Actualiza un Typebot existente. Parámetros: botId, typebot (campos a cambiar), overwrite?'
});

// Configura el token desde .env y lo inyecta en los headers de Axios
const token = process.env.TYPEBOT_TOKEN;
if (!token) {
  console.warn('⚠️  No se encontró TYPEBOT_TOKEN en .env. Algunas operaciones fallarán sin autenticación.');
} else {
  axios.defaults.headers.common['Authorization'] = Bearer ${token};
}

// Definición de la estructura de la petición y respuesta MCP
interface InvokeRequest {
  tool: string;
  arguments: Record<string, any>;
}

interface InvokeResponse {
  ok: boolean;
  result?: any;
  error?: string;
}

type ToolFn = (args: any) => Promise<any>;
const tools = new Map<string, { func: ToolFn; description: string }>();

tools.set('authenticate', {
  func: authenticate,
  description: 'Configura y verifica tu API token de Typebot (usa .env TYPEBOT_TOKEN)'
});
tools.set('createBot', {
  func: createBot,
  description: 'Crea un nuevo bot en Typebot con nombre'
});
tools.set('listBots', {
  func: listBots,
  description: 'Lista todos los bots disponibles'
});
tools.set('getBot', {
  func: getBot,
  description: 'Obtiene los detalles de un bot por su ID'
});
tools.set('deleteBot', {
  func: deleteBot,
  description: 'Elimina un bot por su ID'
});
tools.set('updateBot', {  
  func: updateBot,
  description: 'Actualiza un Typebot existente'
});

// Función genérica para invocar herramientas
async function invokeTool(toolName: string, args: any): Promise<any> {
  const tool = tools.get(toolName);
  if (!tool) throw new Error(Herramienta desconocida: ${toolName});
  return tool.func(args);
}

// Middleware de validación básica
function validateInvoke(req: Request, res: Response, next: NextFunction): void {
  const body = req.body as Partial<InvokeRequest>;
  if (typeof body.tool !== 'string') {
    res.json({ ok: false, error: 'tool debe ser un string' });
    return;
  }
  if (typeof body.arguments !== 'object' || body.arguments === null) {
    res.json({ ok: false, error: 'arguments debe ser un objeto' });
    return;
  }
  next();
}

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
  app.listen(PORT, () => console.log(MCP-Typebot escuchando en http://localhost:${PORT}));
}

main().catch(err => {
  console.error('Error al arrancar el servidor:', err);
  process.exit(1);
});
ChatGPT Plus

Pensó durante unos pocos segundos
El problema es que estás llamando a tools.set('updateBot', …) antes de haber declarado const tools = new Map(...). En JavaScript/TypeScript las declaraciones de bloque no se “hoistean” de la forma que imaginas, así que necesitas mover esa línea para después de la declaración de tools.

Tienes básicamente dos opciones:

Eliminar la llamada prematura:

import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { authenticate } from './tools/auth';
import { createBot, listBots, getBot, deleteBot, updateBot } from './tools/bots';

- // <-- quita esto
- tools.set('updateBot', {
-   func: updateBot,
-   description: 'Actualiza un Typebot existente. Parámetros: botId, typebot (campos a cambiar), overwrite?'
- });

// Configura el token desde .env
const token = process.env.TYPEBOT_TOKEN;
…
// Declaración de tools
const tools = new Map<string, { func: (args:any) => Promise<any>; description: string }>();

// Ahora sí puedes registrar todas las herramientas:
tools.set('authenticate', { … });
tools.set('createBot',      { … });
tools.set('listBots',       { … });
tools.set('getBot',         { … });
tools.set('deleteBot',      { … });
tools.set('updateBot', {      // ← aquí, **después** de la declaración**
  func: updateBot,
  description: 'Actualiza un Typebot existente. Parámetros: botId, typebot (campos a cambiar), overwrite?'
});
O bien, mover la declaración de tools para que esté antes de cualquier tools.set(...):

import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { authenticate } from './tools/auth';
import { createBot, listBots, getBot, deleteBot, updateBot } from './tools/bots';

// 1) Declara tools justo al principio
const tools = new Map<string, { func: (args: any) => Promise<any>; description: string }>();

// 2) Ahora puedes registrar *todas* las tools
tools.set('authenticate', { func: authenticate,  description: '…' });
tools.set('createBot',     { func: createBot,     description: '…' });
tools.set('listBots',      { func: listBots,      description: '…' });
tools.set('getBot',        { func: getBot,        description: '…' });
tools.set('deleteBot',     { func: deleteBot,     description: '…' });
tools.set('updateBot',     { func: updateBot,     description: '…' });

// 3) Luego configura el token y el resto de tu app
const token = process.env.TYPEBOT_TOKEN;
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
// …
async function main() { … }
main().catch(…);
Cualquiera de estas dos correcciones quitará el error de “Block-scoped variable ‘tools’ used before its declaration”. Solo asegúrate de que todas las llamadas a tools.set(…) estén después de:

const tools = new Map<…>();
y tu MCP volverá a compilar sin problemas.

Tú dijiste:
dame el archivo completo
ChatGPT Plus

Pensó durante un par de segundos
// src/index.ts

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
  deleteBot,
  updateBot,
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

tools.set('deleteBot', {
  func: deleteBot,
  description: 'Elimina un Typebot por su ID',
});

tools.set('updateBot', {
  func: updateBot,
  description:
    'Actualiza un Typebot existente. Parámetros: botId, typebot (campos a cambiar), overwrite?',
});

// ———————————————————————————————
// 3. Configuración global de Axios (token desde .env)
// ———————————————————————————————
const token = process.env.TYPEBOT_TOKEN;
if (!token) {
  console.warn(
    '⚠️  No se encontró TYPEBOT_TOKEN en .env. Algunas operaciones fallarán sin autenticación.'
  );
} else {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
Tú dijiste:
funciona joya! dame la docuemntacion de eso
ChatGPT Plus

Pensó durante unos pocos segundos
A continuación tienes la documentación de tu servidor MCP (el contenido de index.ts) y de todas las herramientas expuestas:

1. Descripción general
Este MCP es un servicio HTTP que escucha en POST /invoke. Recibe un JSON con:

{
  "tool": "<nombre_de_la_herramienta>",
  "arguments": { /* parámetros específicos */ }
}
Y responde siempre con:

{
  "ok": true,         // o false si hay error
  "result": { … }     // sólo si ok=true
  "error": "mensaje"  // sólo si ok=false
}
Las peticiones van al endpoint:

POST http://localhost:3000/invoke
Content-Type: application/json
2. Herramientas disponibles
2.1 authenticate
Configura y verifica tu token de Typebot (Bearer token).

POST /invoke
{
  "tool": "authenticate",
  "arguments": {
    "token": "<TU_TYPEBOT_TOKEN>"
  }
}
Argumento	Tipo	Requerido	Descripción
token	string	sí	Tu API token de Typebot.
Respuesta exitosa (ok: true):

{
  "result": {
    "workspaces": [
      { "id": "...", "name": "...", "plan": "FREE" }, …
    ]
  }
}
Errores comunes (ok: false): 401 Unauthorized, 400 Bad Request.

2.2 createBot
Crea un nuevo Typebot en el workspace.

POST /invoke
{
  "tool": "createBot",
  "arguments": {
    "name": "MiBot",
    "description": "Descripción opcional",
    "workspaceId": "cm1vizqdr000rvag38p36itox"  // opcional si está en .env
  }
}
Argumento	Tipo	Requerido	Descripción
name	string	sí	Nombre del nuevo bot.
description	string	no	Descripción opcional.
workspaceId	string	no (pero necesario si no está en .env)	ID de tu workspace.
Respuesta exitosa:

{
  "result": {
    "typebot": { "id": "cmXYZ…", "name": "MiBot", /* … */ }
  }
}
Errores: 400 Bad Request, 401 Unauthorized.

2.3 listBots
Lista todos los Typebots de un workspace.

POST /invoke
{
  "tool": "listBots",
  "arguments": {
    "workspaceId": "cm1vizqdr000rvag38p36itox"  // opcional si está en .env
  }
}
Argumento	Tipo	Requerido	Descripción
workspaceId	string	no (pero necesario si no está en .env)	ID del workspace que quieres consultar.
Respuesta exitosa:

{
  "result": {
    "typebots": [
      { "id":"…","name":"…","accessRight":"write",… },
      …
    ]
  }
}
Errores: 400 Bad Request, 401 Unauthorized.

2.4 getBot
Obtiene todos los detalles de un Typebot por su ID.

POST /invoke
{
  "tool": "getBot",
  "arguments": {
    "botId": "cm2o1m4x30001s2kmxqdx7u4m"
  }
}
Argumento	Tipo	Requerido	Descripción
botId	string	sí	ID único del Typebot a recuperar.
Respuesta exitosa:

{
  "result": {
    "typebot": { /* definición completa del bot */ }
  }
}
Errores: 400 Bad Request, 401 Unauthorized, 404 Not Found.

2.5 updateBot
Actualiza campos de un Typebot existente.

POST /invoke
{
  "tool": "updateBot",
  "arguments": {
    "botId": "cm2o1m4x30001s2kmxqdx7u4m",
    "typebot": {
      "name": "Nuevo nombre",
      "settings": { "general": { "isBrandingEnabled": false } }
    },
    "overwrite": true   // opcional, por defecto false
  }
}
Argumento	Tipo	Requerido	Descripción
botId	string	sí	ID del Typebot a actualizar.
typebot	object	sí	Objeto con los campos V6 que quieras modificar (nombre, grupos, theme, settings, etc.).
overwrite	boolean	no	Si true, fuerza la actualización aunque haya conflictos de versión (default: false).
Respuesta exitosa:

{
  "result": {
    "typebot": { /* nueva definición del bot tras la actualización */ }
  }
}
Errores:

400 Bad Request (falta botId o typebot mal formado)

401 Unauthorized

404 Not Found

409 Conflict (si hay conflicto y no usaste overwrite)

2.6 deleteBot
Elimina un Typebot existente.

POST /invoke
{
  "tool": "deleteBot",
  "arguments": {
    "botId": "cm2o1m4x30001s2kmxqdx7u4m"
  }
}
Argumento	Tipo	Requerido	Descripción
botId	string	sí	ID del Typebot que quieres eliminar.
Respuesta exitosa:

{
  "result": { "success": true }
}
Errores: 400 Bad Request, 401 Unauthorized, 404 Not Found.

3. Flujo típico de uso
(Sólo una vez) Autenticar:

curl … -d '{"tool":"authenticate","arguments":{"token":"<TOKEN>"}}'
Crear o listar bots:

curl … -d '{"tool":"createBot", "arguments":{…}}'
curl … -d '{"tool":"listBots","arguments":{}}'
Obtener, editar o eliminar un bot:

curl … -d '{"tool":"getBot",    "arguments":{"botId":"…"}}'
curl … -d '{"tool":"updateBot", "arguments":{…}}'
curl … -d '{"tool":"deleteBot", "arguments":{"botId":"…"}}'
Con esto tienes la documentación completa de tu MCP y sus herramientas. ¡A disfrutar!




No file chosenNo file chosen
ChatGPT puede cometer errores. OpenAI no usa datos del área de trabajo de South Texas Solar Systems para formar a sus modelos.
ChatGPT dice: A continuación tienes la **documentación** de tu servidor MCP (el contenido de `index.ts`) y de todas las herramientas expuestas: --- ## 1. Descripción general Este MCP es un servicio HTTP que escucha en `POST /invoke`. Recibe un JSON con: ```jsonc { "tool": "<nombre_de_la_herramienta>", "arguments": { /* parámetros específicos */ } } ``` Y responde siempre con: ```jsonc { "ok": true, // o false si hay error "result": { … } // sólo si ok=true "error": "mensaje" // sólo si ok=false } ``` Las peticiones van al endpoint: ``` POST http://localhost:3000/invoke Content-Type: application/json ``` --- ## 2. Herramientas disponibles ### 2.1 `authenticate` Configura y verifica tu token de Typebot (Bearer token). ```http POST /invoke ``` ```jsonc { "tool": "authenticate", "arguments": { "token": "<TU_TYPEBOT_TOKEN>" } } ``` | Argumento | Tipo | Requerido | Descripción | |-----------|----------|-----------|------------------------------------| | `token` | `string` | sí | Tu API token de Typebot. | **Respuesta exitosa** (`ok: true`): ```jsonc { "result": { "workspaces": [ { "id": "...", "name": "...", "plan": "FREE" }, … ] } } ``` **Errores comunes** (`ok: false`): `401 Unauthorized`, `400 Bad Request`. --- ### 2.2 `createBot` Crea un nuevo Typebot en el workspace. ```http POST /invoke ``` ```jsonc { "tool": "createBot", "arguments": { "name": "MiBot", "description": "Descripción opcional", "workspaceId": "cm1vizqdr000rvag38p36itox" // opcional si está en .env } } ``` | Argumento | Tipo | Requerido | Descripción | |---------------|----------|----------------------|-----------------------------------------------------| | `name` | `string` | sí | Nombre del nuevo bot. | | `description` | `string` | no | Descripción opcional. | | `workspaceId` | `string` | no (pero necesario si no está en `.env`) | ID de tu workspace. | **Respuesta exitosa**: ```jsonc { "result": { "typebot": { "id": "cmXYZ…", "name": "MiBot", /* … */ } } } ``` **Errores**: `400 Bad Request`, `401 Unauthorized`. --- ### 2.3 `listBots` Lista todos los Typebots de un workspace. ```http POST /invoke ``` ```jsonc { "tool": "listBots", "arguments": { "workspaceId": "cm1vizqdr000rvag38p36itox" // opcional si está en .env } } ``` | Argumento | Tipo | Requerido | Descripción | |---------------|----------|----------------------|--------------------------------------------| | `workspaceId` | `string` | no (pero necesario si no está en `.env`) | ID del workspace que quieres consultar. | **Respuesta exitosa**: ```jsonc { "result": { "typebots": [ { "id":"…","name":"…","accessRight":"write",… }, … ] } } ``` **Errores**: `400 Bad Request`, `401 Unauthorized`. --- ### 2.4 `getBot` Obtiene todos los detalles de un Typebot por su ID. ```http POST /invoke ``` ```jsonc { "tool": "getBot", "arguments": { "botId": "cm2o1m4x30001s2kmxqdx7u4m" } } ``` | Argumento | Tipo | Requerido | Descripción | |-----------|----------|-----------|-------------------------------------| | `botId` | `string` | sí | ID único del Typebot a recuperar. | **Respuesta exitosa**: ```jsonc { "result": { "typebot": { /* definición completa del bot */ } } } ``` **Errores**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`. --- ### 2.5 `updateBot` Actualiza campos de un Typebot existente. ```http POST /invoke ``` ```jsonc { "tool": "updateBot", "arguments": { "botId": "cm2o1m4x30001s2kmxqdx7u4m", "typebot": { "name": "Nuevo nombre", "settings": { "general": { "isBrandingEnabled": false } } }, "overwrite": true // opcional, por defecto false } } ``` | Argumento | Tipo | Requerido | Descripción | |-----------|----------------|-----------|----------------------------------------------------------------------------------------------| | `botId` | `string` | sí | ID del Typebot a actualizar. | | `typebot` | `object` | sí | Objeto con los campos V6 que quieras modificar (nombre, grupos, theme, settings, etc.). | | `overwrite` | `boolean` | no | Si `true`, fuerza la actualización aunque haya conflictos de versión (default: `false`). | **Respuesta exitosa**: ```jsonc { "result": { "typebot": { /* nueva definición del bot tras la actualización */ } } } ``` **Errores**: - `400 Bad Request` (falta botId o typebot mal formado) - `401 Unauthorized` - `404 Not Found` - `409 Conflict` (si hay conflicto y no usaste `overwrite`) --- ### 2.6 `deleteBot` Elimina un Typebot existente. ```http POST /invoke ``` ```jsonc { "tool": "deleteBot", "arguments": { "botId": "cm2o1m4x30001s2kmxqdx7u4m" } } ``` | Argumento | Tipo | Requerido | Descripción | |-----------|----------|-----------|-----------------------------------| | `botId` | `string` | sí | ID del Typebot que quieres eliminar. | **Respuesta exitosa**: ```jsonc { "result": { "success": true } } ``` **Errores**: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`. --- ## 3. Flujo típico de uso 1. **(Sólo una vez)** Autenticar: ```bash curl … -d '{"tool":"authenticate","arguments":{"token":"<TOKEN>"}}' ``` 2. **Crear** o **listar** bots: ```bash curl … -d '{"tool":"createBot", "arguments":{…}}' curl … -d '{"tool":"listBots","arguments":{}}' ``` 3. **Obtener**, **editar** o **eliminar** un bot: ```bash curl … -d '{"tool":"getBot", "arguments":{"botId":"…"}}' curl … -d '{"tool":"updateBot", "arguments":{…}}' curl … -d '{"tool":"deleteBot", "arguments":{"botId":"…"}}' ``` Con esto tienes la **documentación completa** de tu MCP y sus herramientas. ¡A disfrutar!

deleteBot
Invocación vía MCP

http
Copiar
Editar
POST http://localhost:3000/invoke
Content-Type: application/json

{
  "tool": "deleteBot",
  "arguments": {
    "botId": "<ID_DEL_TYPEBOT>"
  }
}
Argumento	Tipo	Requerido	Descripción
botId	string	sí	ID del Typebot que deseas eliminar.

Respuesta exitosa (200 OK)

json
Copiar
Editar
{
  "ok": true,
  "result": {
    "message": "success"
  }
}
Errores comunes

400 Bad Request

json
Copiar
Editar
{ "ok": false, "error": "deleteBot: falta botId" }
401 Unauthorized

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 401" }
403 Forbidden

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 403" }
404 Not Found

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 404" }
500 Internal Server Error

json
Copiar
Editar
{ "ok": false, "error": "Network Error" }
Implementación (src/tools/bots.ts)

ts
Copiar
Editar
export async function deleteBot(args: { botId: string }) {
  const { botId } = args;
  if (!botId) throw new Error('deleteBot: falta botId');
  const response = await axios.delete(
    `https://app.typebot.io/api/v1/typebots/${botId}`
  );
  return response.data;
}



publishBot
Invocación vía MCP

http
Copiar
Editar
POST http://localhost:3000/invoke
Content-Type: application/json

{
  "tool": "publishBot",
  "arguments": {
    "botId": "<ID_DEL_TYPEBOT>"
  }
}
Argumento	Tipo	Requerido	Descripción
botId	string	sí	ID del Typebot que quieres publicar.

Respuesta exitosa (200 OK)

json
Copiar
Editar
{
  "ok": true,
  "result": {
    "message": "success"
  }
}
Errores comunes

400 Bad Request

json
Copiar
Editar
{ "ok": false, "error": "publishBot: falta botId" }
401 Unauthorized

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 401" }
403 Forbidden

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 403" }
404 Not Found

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 404" }
415 Unsupported Media Type
Asegúrate de enviar siempre un payload JSON (incluso {}) en la petición POST.

500 Internal Server Error

json
Copiar
Editar
{ "ok": false, "error": "Network Error" }
unpublishBot
Invocación vía MCP

http
Copiar
Editar
POST http://localhost:3000/invoke
Content-Type: application/json

{
  "tool": "unpublishBot",
  "arguments": {
    "botId": "<ID_DEL_TYPEBOT>"
  }
}
Argumento	Tipo	Requerido	Descripción
botId	string	sí	ID del Typebot que quieres despublicar.

Respuesta exitosa (200 OK)

json
Copiar
Editar
{
  "ok": true,
  "result": {
    "message": "success"
  }
}
Errores comunes

400 Bad Request

json
Copiar
Editar
{ "ok": false, "error": "unpublishBot: falta botId" }
401 Unauthorized

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 401" }
403 Forbidden

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 403" }
404 Not Found

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 404" }
415 Unsupported Media Type
Recuerda incluir siempre un body JSON (por ejemplo {}) en la petición.

500 Internal Server Error

json
Copiar
Editar
{ "ok": false, "error": "Network Error" }

listResults
Invocación vía MCP

http
Copiar
Editar
POST http://localhost:3000/invoke  
Content-Type: application/json

{
  "tool": "listResults",
  "arguments": {
    "botId": "<ID_DEL_TYPEBOT>",
    "limit": 50,                    // opcional, por defecto 50 (rango 1–100)
    "cursor": "<CURSOR_OPCIONAL>",  // opcional, para paginación
    "timeFilter": "last7Days",      // opcional, por defecto 'last7Days'
    "timeZone": "America/Bogota"    // opcional, IANA tz
  }
}
Argumento	Tipo	Requerido	Descripción
botId	string	sí	ID del Typebot cuyos resultados quieres listar.
limit	number	no	Límite de resultados (1–100). Default: 50.
cursor	string	no	Cursor para paginación de resultados.
timeFilter	string	no	Rango temporal:
today, last7Days, last30Days, monthToDate,
lastMonth, yearToDate, allTime.
Default: last7Days.
timeZone	string	no	Zona horaria IANA (ej. America/Bogota) para interpretar filtros de tiempo.

Ejemplo con curl

bash
Copiar
Editar
curl -X POST http://localhost:3000/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "listResults",
    "arguments": {
      "botId": "cm2o1m4x30001s2kmxqdx7u4m",
      "limit": 25,
      "timeFilter": "last30Days",
      "timeZone": "America/Bogota"
    }
  }'
Respuesta exitosa (200 OK)
json
Copiar
Editar
{
  "ok": true,
  "result": {
    "results": [
      {
        "id": "<string>",
        "userId": "<string>",
        "timestamp": "<ISO8601>",
        "input": { /* payload enviado por el usuario */ },
        "output": { /* respuesta generada por el bot */ }
        // …otros campos…
      }
      // …más resultados…
    ],
    "cursor": "<string>"  // si hay más páginas
  }
}
Errores comunes
400 Bad Request

listResults: falta botId

listResults: limit debe estar entre 1 y 100

401 Unauthorized

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 401" }
403 Forbidden

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 403" }
404 Not Found

json
Copiar
Editar
{ "ok": false, "error": "Request failed with status code 404" }
500 Internal Server Error

json
Copiar
Editar
{ "ok": false, "error": "Network Error" }











