require('dotenv').config();
const express = require('express');
const app = express();

// 🔧 Port fallback logic
const DEFAULT_PORT = 10000;
const PORT = process.env.PORT || DEFAULT_PORT;

app.use(express.json());

// Sample route for health check
app.get('/', (req, res) => {
  res.send('MAF.OS API is alive 🔁');
});

// Placeholder for more routes
// e.g., app.post('/projects', handleProjects)

app.listen(PORT, () => {
  console.log(`🚀 MAF.OS API is live at http://localhost:${PORT}`);
});
