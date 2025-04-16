require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();

// 🔧 Port fallback logic
const DEFAULT_PORT = 10000;
const PORT = process.env.PORT || DEFAULT_PORT;

app.use(express.json());

// ✅ Health check
app.get('/', (req, res) => {
  res.send('MAF.OS API is alive 🔁');
});

// ✅ Basic Notion Projects Listing
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
        },
      }
    );

    const projects = response.data.results.map((page) => ({
      id: page.id,
      title: page.properties?.["Project name"]?.title?.[0]?.plain_text || 'Untitled',
      lastEdited: page.last_edited_time,
    }));

    res.status(200).json(projects);
  } catch (error) {
    console.error('❌ Error fetching projects:', error.message);
    res.status(500).json({ error: 'Failed to fetch Notion projects' });
  }
});

// ✅ Full Notion Project Metadata
app.get('/projects/full', async (req, res) => {
  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${process.env.PROJECTS_DB_ID}/query`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
      }
    );

    const projects = response.data.results.map((page) => ({
      id: page.id,
      title: page.properties?.["Project name"]?.title?.[0]?.plain_text || "Untitled",
      status: page.properties?.["Status"]?.select?.name || null,
      priority: page.properties?.["Priority"]?.select?.name || null,
      assignee: page.properties?.["Assignee"]?.people?.map(p => p.name) || [],
      tags: page.properties?.["Tags"]?.multi_select?.map(t => t.name) || [],
      team: page.properties?.["Team"]?.multi_select?.map(t => t.name) || [],
      stakeholders: page.properties?.["Stakeholders"]?.people?.map(p => p.name) || [],
      client: page.properties?.["Client"]?.select?.name || null,
      aiInvolvement: page.properties?.["AI Involvement"]?.select?.name || null,
      summary: page.properties?.["Summary"]?.rich_text?.[0]?.plain_text || null,
      strategicImpact: page.properties?.["Strategic Impact"]?.rich_text?.[0]?.plain_text || null,
      successCriteria: page.properties?.["Success Criteria"]?.rich_text?.[0]?.plain_text || null,
      nextTask: page.properties?.["Next GPT Task"]?.rich_text?.[0]?.plain_text || null,
      prompt: page.properties?.["Current Prompt"]?.rich_text?.[0]?.plain_text || null,
      notes: page.properties?.["GPT Notes"]?.rich_text?.[0]?.plain_text || null,
      repository: page.properties?.["Repository"]?.url || null,
      startDate: page.properties?.["Start date"]?.date?.start || null,
      dueDate: page.properties?.["Due Date"]?.date?.start || null,
      lastEdited: page.last_edited_time,
    }));

    res.json(projects);
  } catch (error) {
    console.error('❌ /projects/full error:', error.message);
    res.status(500).json({ error: 'Failed to fetch full Notion project data' });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 MAF.OS API is live at http://localhost:${PORT}`);
});
