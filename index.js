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
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        }
      }
    );

    const results = response.data.results.map(page => {
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

    res.status(200).json({ projects: results });
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({ error: 'Failed to fetch from Notion' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
