const express = require('express');
const apiRoutes = require('./api');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/', apiRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});