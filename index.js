const { Client } = require('@notionhq/client');
const express = require('express');
const app = express();
const port = 10000;

require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_KEY });
const projectsDb = process.env.NOTION_PROJECTS_DB;
const tasksDb = process.env.NOTION_TASKS_DB;

async function paginate(databaseId) {
  let results = [];
  let cursor;
  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
    });
    results = results.concat(response.results);
    cursor = response.has_more ? response.next_cursor : null;
  } while (cursor);
  return results;
}

app.get('/projects', async (req, res) => {
  try {
    const projects = await paginate(projectsDb);
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await paginate(tasksDb);
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
