# Typebot MCP Server

[![smithery badge](https://smithery.ai/badge/@hithereiamaliff/typebot-mcp)](https://smithery.ai/server/@hithereiamaliff/typebot-mcp)

A small MCP server that exposes Typebot's REST API as callable tools in Claude Desktop and other MCP clients (via Streamable HTTP transport).
You can create, list, get, update, delete, publish/unpublish Typebots, list results, and start chats—using natural-language commands.

---

## Features

- **createBot**  
  Create a new Typebot in your workspace.  
  **Required:** `name`  
  **Optional:** `workspaceId`, `description`

- **listBots**  
  List all Typebots in your workspace.  
  **Optional:** `workspaceId`

- **getBot**  
  Fetch a Typebot by its ID.  
  **Required:** `botId`

- **updateBot**  
  Patch an existing Typebot (e.g. rename).  
  **Required:** `botId`, `typebot` (object with fields to change)  
  **Optional:** `overwrite`

- **deleteBot**  
  Delete a Typebot by its ID.  
  **Required:** `botId`

- **publishBot** / **unpublishBot**  
  Toggle a Typebot’s published state.  
  **Required:** `botId`

- **listResults**  
  Retrieve conversation results for a Typebot.  
  **Required:** `botId`  
  **Optional:** `limit`, `cursor`, `timeFilter`, `timeZone`

- **startChat**  
  Begin a new chat session with a Typebot.  
  **Required:** `botId`  
  **Optional:** `chat.context`

---

## Prerequisites

1. **Node.js 18+**  
2. A valid **Typebot API token** and **workspace ID**  
3. Claude Desktop connected to your local MCP server

---

## Installation

### Option 1: Clone the repository

```bash
git clone <repo-url>
cd typebot-mcp
npm install
npm run build
```

### Option 2: Install via npm

```bash
npm install typebot-mcp
npm run dev # for development
# or
npm run build # for production build
```

### Option 3: Install via Smithery

You can easily install this MCP server through Smithery:

1. Visit [https://smithery.ai/server/@hithereiamaliff/typebot-mcp](https://smithery.ai/server/@hithereiamaliff/typebot-mcp)
2. Follow the installation instructions on the Smithery page
3. Configure your environment variables as described in the Deployment Options section

---

## Running

### Development Mode

```bash
npm run dev
```

This will start the server in development mode with hot reloading using Smithery CLI.

### Production Build

```bash
npm run build
```

This will create a production build using Smithery CLI.

---

## Usage in Claude Desktop

Simply write natural commands like:

> **User**: “Create me a new typebot”  
> **Claude**: “Sure—what name?”  
> **User**: “MyDemoBot”  
> **Claude** (internally invokes):
> ```
> @createBot {"name":"MyDemoBot"}
> ```

Or, explicitly:

```
@updateBot {"botId":"<your_bot_id>","typebot":{"name":"NewName"},"overwrite":true}
```

You can also start a chat:

```
@startChat {"botId":"<your_bot_id>"}
```

---

## Extending

- Add new tools by implementing them in `src/tools/bots.ts` and registering them in `src/index.ts`.  
- Define a Zod schema for each tool to get automatic prompting and validation.

---

## Deployment Options

### Local Configuration (Claude Desktop)

To connect Claude Desktop to this MCP server locally, you can run it in development mode and use the HTTP URL:

```bash
npm run dev
```

This will start the server on http://localhost:8181 by default. You can then add this URL to your Claude Desktop configuration.

### Smithery Deployment

To deploy this MCP server on Smithery:

1. Push your code to a GitHub repository
2. Log into your Smithery account
3. Create a new deployment and connect it to your GitHub repository
4. Configure the following environment variables in Smithery:
   - `TYPEBOT_TOKEN`: Your Typebot API token
   - `TYPEBOT_WORKSPACE_ID`: Your Typebot workspace ID
   - `TYPEBOT_API_URL`: The full URL to your Typebot API including the /api/v1 path (e.g., https://your-typebot-domain.com/api/v1)
5. Deploy the application
6. Use the provided URL to connect Claude to your MCP server

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

This project is a direct fork of [osdeibi's MCP-typebot](https://github.com/osdeibi/MCP-typebot). It builds upon the original work with the following improvements:

- **Configurable API URL**: Added support for custom Typebot API endpoints via the `TYPEBOT_API_URL` environment variable instead of hardcoded URLs
- **Improved Error Handling**: Enhanced error messages and validation in English
- **Better Configuration**: More flexible configuration options for different Typebot instances
- **Code Quality**: Various code improvements and optimizations

## Migration from STDIO to HTTP Transport

This MCP server has been migrated from the deprecated STDIO transport to the recommended Streamable HTTP transport using the Smithery CLI. This migration provides several benefits:

- **Better Scalability**: HTTP transport allows for multiple concurrent connections
- **Improved Reliability**: Avoids issues with process management and IPC
- **Enhanced Monitoring**: Better logging and debugging capabilities
- **Future Compatibility**: Ensures compatibility with future MCP clients and standards

The migration was completed before the September 7, 2025 deadline set by Smithery for discontinuing STDIO transport support.