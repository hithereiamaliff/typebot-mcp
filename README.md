# Typebot MCP Server

A small MCP server that exposes Typebot’s REST API as callable tools in Claude Desktop (via STDIO).
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
cd mcp-typebot
npm install
npm run build
```

### Option 2: Install via npm

```bash
npm install typebot-mcp
npm start
```

### Option 3: Install via Smithery

You can easily install this MCP server through Smithery:

1. Visit [https://smithery.ai/server/@hithereiamaliff/mcp-typebot](https://smithery.ai/server/@hithereiamaliff/mcp-typebot)
2. Follow the installation instructions on the Smithery page
3. Configure your environment variables as described in the Deployment Options section

---

## Running

```bash
npm start
```

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

To connect Claude Desktop to this MCP server locally, add the following to your Claude configuration (e.g. `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "mcp-typebot": {
      "command": "node",
      "args": [
        "path/to/project/dist/index.js"
      ],
      "env": {
        "TYPEBOT_TOKEN": "YOUR_TOKEN_HERE",
        "TYPEBOT_WORKSPACE_ID": "YOUR_WORKSPACE_ID",
        "TYPEBOT_API_URL": "YOUR_TYPEBOT_API_URL"
      }
    }
  }
}
```

Make sure the `command` and `args` point to your local built `index.js`, and that your environment variables are correctly set.

### Smithery Deployment

To deploy this MCP server on Smithery:

1. Push your code to a GitHub repository
2. Log into your Smithery account
3. Create a new deployment and connect it to your GitHub repository
4. Configure the following environment variables in Smithery:
   - `TYPEBOT_TOKEN`: Your Typebot API token
   - `TYPEBOT_WORKSPACE_ID`: Your Typebot workspace ID
   - `TYPEBOT_API_URL`: The URL to your Typebot API (e.g., https://your-typebot-instance.com/api/v1)
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

This starts the MCP server on STDIO. Claude Desktop (or any MCP client) will connect to it automatically.
