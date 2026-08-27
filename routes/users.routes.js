const express = require('express');
const router = express.Router();

const users = [
  { id: 1, name: 'Ayşe' },
  { id: 2, name: 'Mehmet' },
  { id: 3, name: 'Zeynep' }
];

const MESSAGES = {
  NAME_REQUIRED: 'Name is required and must be a non-empty string',
  USER_NOT_FOUND: 'User not found',
};

const isValidName = (name) => {
  return typeof name === 'string' && name.trim() !== '';
}

router.get('/', (req, res) => {
  res.json(users);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(user => user.id === id);

  if (!user) {
    return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });
  }

  res.json(user);
});

router.post('/', (req, res) => {
  const { name } = req.body;

  if (!isValidName(name)) {
    return res.status(400).json({ message: MESSAGES.NAME_REQUIRED });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name: name.trim()
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  const user = users.find(user => user.id === id);
  if (!user) {
    return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });
  }

  if (!isValidName(name)) {
    return res.status(400).json({ message: MESSAGES.NAME_REQUIRED });
  }

  user.name = name.trim();
  res.json(user);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex(user => user.id === id);
  if (index === -1) {
    return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });
  }
  users.splice(index, 1);
  res.status(204).send();
});

module.exports = router;