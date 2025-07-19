const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // Allow all origins by default

app.get('/api/universities', async (req, res) => {
  const url = 'http://universities.hipolabs.com/search?country=United+States';
  const response = await fetch(url);
  let data = await response.json();
//   console.log(data)

  data.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
