const express = require('express');
const router = express.Router();

const users = [
  { id: 1, name: 'Ayşe', role: 'admin', active: true },
  { id: 2, name: 'Mehmet', role: 'user', active: true },
  { id: 3, name: 'Zeynep', role: 'user', active: true }
];

const MESSAGES = {
  NAME_REQUIRED: 'Name is required and must be a non-empty string',
  USER_NOT_FOUND: 'User not found',
  INVALID_ROLE: 'Invalid role',
};

const VALID_ROLES = ['admin', 'user'];

const isValidName = (name) => {
  return typeof name === 'string' && name.trim() !== '';
};

const isValidRole = (role) => {
  if (typeof role !== 'string') return false;
  return VALID_ROLES.includes(role.toLowerCase());
};

router.get('/', (req, res) => {
  res.json(users.filter(user => user.active));
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
  const { name, role, active } = req.body;

  if (!isValidName(name)) {
    return res.status(400).json({ message: MESSAGES.NAME_REQUIRED });
  }

  if (role !== undefined && !isValidRole(role)) {
    return res.status(400).json({ message: MESSAGES.INVALID_ROLE });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name: name.trim(),
    role: role !== undefined ? role.toLowerCase() : 'user',
    active: active !== undefined ? active : true
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, role, active } = req.body;

  const user = users.find(user => user.id === id);
  if (!user) {
    return res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });
  }

  if (!isValidName(name)) {
    return res.status(400).json({ message: MESSAGES.NAME_REQUIRED });
  }

  if (role !== undefined && !isValidRole(role)) {
    return res.status(400).json({ message: MESSAGES.INVALID_ROLE });
  }

  user.name = name.trim();
  if (role !== undefined) {
    user.role = role.toLowerCase();
  }
  if (active !== undefined) {
    user.active = active;
  }
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