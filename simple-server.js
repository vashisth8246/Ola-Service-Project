const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 Ola Service Tracking - RUNNING!</h1>
    <p>Dashboard is working on port 3001</p>
    <p>Server time: ${new Date().toLocaleString()}</p>
  `);
});

app.listen(3001, () => {
  console.log('✅ Server running at http://localhost:3001');
});