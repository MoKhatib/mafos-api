require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();

// 🔧 Port fallback logic
const DEFAULT_PORT = 10000;
const PORT = process.env.PORT || DEFAULT_PORT;

app.use(express.json());

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('MAF.OS API is alive 🔁');
});

// ✅ Notion projects fetch route
app.get('/projects', async (req, res) => {
  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${process.env.PROJECTS_DB_ID}/query`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        }
      }
    );

    // Format and return only necessary fields
    const projects = response.data.results.map((page) => ({
      id: page.id,
      title: page.properties?.Name?.title?.[0]?.plain_text || 'Untitled',
      lastEdited: page.last_edited_time
    }));

    res.status(200).json(projects);
  } catch (error) {
    console.error('❌ Error fetching projects:', error.message);
    res.status(500).json({ error: 'Failed to fetch Notion projects' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 MAF.OS API is live at http://localhost:${PORT}`);
});
