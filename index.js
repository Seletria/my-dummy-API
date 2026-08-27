const express = require('express');
const usersRoutes = require('./routes/users.routes');
const healthCheck = require('./routes/healthCheck.routes');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/users', usersRoutes);
app.use('/health-check', healthCheck);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});