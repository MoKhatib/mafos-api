import express from 'express';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 10000;

const notion = new Client({
  auth: 'ntn_b3245542151Ytb8PV4qasCMJPCqrB7yCKQZxpEOK0FEbe1',
});

const projectsDatabaseId = '1159327e131e4f6a996108edb5b2b5b8';
const tasksDatabaseId = '1d60c1730b0780db85dcd951aa22a720';

app.use(express.json());

async function paginate(queryFn, options) {
  let results = [];
  let cursor = undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await queryFn({
      ...options,
      start_cursor: cursor,
    });
    results = results.concat(response.results);
    cursor = response.next_cursor;
    hasMore = response.has_more;
  }

  return results;
}

app.get('/projects', async (req, res) => {
  try {
    const projects = await paginate(notion.databases.query, {
      database_id: projectsDatabaseId,
    });

    res.json({ projects });
  } catch (error) {
    console.error('Failed to fetch projects:', error.message);
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await paginate(notion.databases.query, {
      database_id: tasksDatabaseId,
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Failed to fetch tasks:', error.message);
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
