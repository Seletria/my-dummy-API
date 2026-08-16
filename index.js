const express = require('express');
const app = express();
const port = 3000;

const users = [
  { id: 1, name: 'Ayşe' },
  { id: 2, name: 'Mehmet' },
  { id: 3, name: 'Zeynep' }
];

app.get('/user/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(user => user.id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

app.use(express.json());

app.post('/user', (req, res) => {

  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/user/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(user => user.id === id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.name = req.body.name;
  res.json(user);
});

app.delete('/user/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(user => user.id === id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  users = users.filter(user => user.id !== id);
  res.json({ message: 'User deleted' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Server is running on http://localhost:${port}/user/2`);
  console.log(`Server is running on http://localhost:${port}/user/99`);
});