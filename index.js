const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/projects', async (req, res) => {
  const expand = req.query.expand === 'all';

  try {
<<<<<<< HEAD
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
      {},
=======
        let allResults = [];
    let hasMore = true;
    let nextCursor = undefined;

    while (hasMore) {
      const response = await axios.post(
        `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
        nextCursor ? { start_cursor: nextCursor } : {},

>>>>>>> 0dca5f0 (🧠 Add Notion pagination to fetch all projects reliably)
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        }
      }
    );

<<<<<<< HEAD
    const results = response.data.results.map(page => {
=======
    const results = allResults.map(page => {
>>>>>>> 0dca5f0 (🧠 Add Notion pagination to fetch all projects reliably)
      const props = page.properties;

      const base = {
        id: page.id,
        name: props['Project name']?.title?.[0]?.plain_text || '',
        status: props['Status']?.select?.name || '',
        assignee: props['Assignee']?.people?.[0]?.name || '',
        startDate: props['Start date']?.date?.start || '',
        tags: props['Tags']?.multi_select?.map(t => t.name) || []
      };

      if (!expand) return base;

      return {
        ...base,
        team: props['Team']?.multi_select?.map(t => t.name) || [],
        strategicImpact: props['Strategic Impact']?.rich_text?.[0]?.plain_text || '',
        stakeholders: props['Stakeholders']?.people?.map(p => p.name) || [],
        aiInvolvement: props['AI Involvement']?.rich_text?.[0]?.plain_text || '',
        currentPrompt: props['Current Prompt']?.rich_text?.[0]?.plain_text || '',
        nextGptTask: props['Next GPT Task']?.rich_text?.[0]?.plain_text || '',
        mafkSummary: props['MAFK Summary']?.rich_text?.[0]?.plain_text || '',
        risks: props['Risks / Blocks']?.rich_text?.[0]?.plain_text || '',
        successCriteria: props['Success Criteria']?.rich_text?.[0]?.plain_text || '',
        priority: props['Priority']?.select?.name || '',
        gptNotes: props['GPT Notes']?.rich_text?.[0]?.plain_text || '',
        client: props['Client']?.rich_text?.[0]?.plain_text || '',
        dueDate: props['Due Date']?.date?.start || '',
        repository: props['Repository']?.url || ''
      };
    });

<<<<<<< HEAD
    res.status(200).json({ projects: results });
=======
          allResults.push(...response.data.results);
      hasMore = response.data.has_more;
      nextCursor = response.data.next_cursor;
    }

    res.status(200).json({ projects: results });

>>>>>>> 0dca5f0 (🧠 Add Notion pagination to fetch all projects reliably)
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({ error: 'Failed to fetch from Notion' });
  }
});

<<<<<<< HEAD
=======
app.get('/tasks', async (req, res) => {
  const expand = req.query.expand === 'all';

  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${process.env.NOTION_TASKS_DATABASE_ID}/query`,
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        }
      }
    );

    const results = allResults.map(page => {
      const props = page.properties;

      const base = {
        id: page.id,
        project: props['Project name']?.title?.[0]?.plain_text || '',
        status: props['Status']?.select?.name || '',
        assignee: props['Assignee']?.people?.[0]?.name || '',
        startDate: props['Start date']?.date?.start || '',
        priority: props['Priority']?.select?.name || ''
      };

      if (!expand) return base;

      return {
        ...base,
        team: props['Team']?.multi_select?.map(t => t.name) || [],
        strategicImpact: props['Strategic Impact']?.rich_text?.[0]?.plain_text || '',
        stakeholders: props['Stakeholders']?.people?.map(p => p.name) || [],
        aiInvolvement: props['AI Involvement']?.rich_text?.[0]?.plain_text || '',
        currentPrompt: props['Current Prompt']?.rich_text?.[0]?.plain_text || '',
        nextGptTask: props['Next GPT Task']?.rich_text?.[0]?.plain_text || '',
        mafkSummary: props['MAFK Summary']?.rich_text?.[0]?.plain_text || '',
        risks: props['Risks / Blocks']?.rich_text?.[0]?.plain_text || '',
        successCriteria: props['Success Criteria']?.rich_text?.[0]?.plain_text || '',
        tags: props['Tags']?.multi_select?.map(t => t.name) || [],
        gptNotes: props['GPT Notes']?.rich_text?.[0]?.plain_text || '',
        client: props['Client']?.rich_text?.[0]?.plain_text || '',
        dueDate: props['Due Date']?.date?.start || '',
        repository: props['Repository']?.url || ''
      };
    });

    res.status(200).json({ tasks: results });
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ error: 'Failed to fetch tasks from Notion' });
  }
});

>>>>>>> 0dca5f0 (🧠 Add Notion pagination to fetch all projects reliably)
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
