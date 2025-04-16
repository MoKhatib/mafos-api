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

app.get("/projects", async (req, res) => {
  try {
    let allResults = [];
    let hasMore = true;
    let nextCursor = undefined;

    while (hasMore) {
      const response = await axios.post(
        `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
        nextCursor ? { start_cursor: nextCursor } : {},
        {
          headers: {
            Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
        }
      );

      allResults = [...allResults, ...response.data.results];
      hasMore = response.data.has_more;
      nextCursor = response.data.next_cursor;
    }

    res.json(allResults);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch projects." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
