import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import bodyParser from "body-parser";
dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("🧠 MAF.OS Notion API is live");
});

async function fetchFromNotion(databaseId) {
  let allResults = [];
  let hasMore = true;
  let nextCursor = undefined;

  while (hasMore) {
const response = await axios.post(
  "https://api.notion.com/v1/databases/" + databaseId + "/query",
  { page_size: 100 },
  {
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
  }
);

    allResults = [...allResults, ...response.data.results];
    hasMore = response.data.has_more;
    nextCursor = response.data.next_cursor;
  }

  return allResults;
}

app.get("/projects", async (req, res) => {
  try {
    const results = await fetchFromNotion(process.env.NOTION_PROJECTS_DB_ID);
    res.json(results);
  } catch (error) {
    console.error("❌ Failed to fetch projects:", error.message);
    res.status(500).json({ error: "Failed to fetch projects." });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const results = await fetchFromNotion(process.env.NOTION_TASKS_DB_ID);
    res.json(results);
  } catch (error) {
    console.error("❌ Failed to fetch tasks:", error.message);
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
