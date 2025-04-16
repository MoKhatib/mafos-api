# Notion Projects API

This project exposes a simple Express API to fetch Projects and Tasks from a Notion database using the official Notion SDK.

## Endpoints

- `GET /projects` - Fetch all projects (with pagination support)
- `GET /tasks` - Fetch all tasks (with pagination support)
- `GET /health` - Health check

## Setup

Create a `.env` file with your credentials:

```env
NOTION_KEY=your_notion_internal_integration_key
NOTION_PROJECTS_DB=your_projects_db_id
NOTION_TASKS_DB=your_tasks_db_id
```

Then run:

```bash
npm install
node index.js
```
