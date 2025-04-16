import express from "express";
import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

const notion = new Client({ auth: process.env.NOTION_SECRET });

const projectsDatabaseId = process.env.NOTION_PROJECTS_DB_ID;
const tasksDatabaseId = process.env.NOTION_TASKS_DB_ID;

// Utility function to paginate through large Notion DBs
async function getAllPages(databaseId) {
  let allPages = [];
  let cursor = undefined;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
    });

    allPages = allPages.concat(response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return allPages;
}

// Route: GET /projects
app.get("/projects", async (req, res) => {
  try {
    const results = await getAllPages(projectsDatabaseId);
    res.json({ total: results.length, results });
  } catch (error) {
    console.error("❌ Error fetching projects:", error.message);
    res.status(500).json({ error: "Failed to fetch projects." });
  }
});

// Route: GET /tasks
app.get("/tasks", async (req, res) => {
  try {
    const results = await getAllPages(tasksDatabaseId);
    res.json({ total: results.length, results });
  } catch (error) {
    console.error("❌ Error fetching tasks:", error.message);
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
});

// Default health check
app.get("/", (req, res) => {
  res.send("🔄 MAF.OS Notion API is running");
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
