import { Request, Response } from 'express';
import { User, CreateUserDTO, UpdateUserDTO } from '../types/user';

let users: User[] = [
  { id: 1, email: 'alice@example.com', password: '123456', name: 'Alice García', birthdate: '1995-04-23' },
  { id: 2, email: 'bob@example.com', password: 'abcdef', name: 'Bob Martínez', birthdate: '1990-11-08' },
];
let nextId = 3;

// Omit<User, 'password'> — TypeScript garantiza que nunca olvidemos quitar la contraseña
function sanitizeUser(user: User): Omit<User, 'password'> {
  const { password, ...rest } = user;
  return rest;
}

export function getAllUsers(req: Request, res: Response): void {
  res.status(200).json({
    success: true,
    total: users.length,
    data: users.map(sanitizeUser),
  });
}

export function getUserById(req: Request, res: Response): void {
  const id = parseInt(req.params.id as string);
  const user = users.find((u) => u.id === id);

  if (!user) {
    res.status(404).json({ success: false, message: `Usuario ${id} no encontrado.` });
    return;
  }

  res.status(200).json({ success: true, data: sanitizeUser(user) });
}

export function createUser(req: Request, res: Response): void {
  // TypeScript nos permite tipar el body que esperamos recibir
  const { email, password, name, birthdate } = req.body as CreateUserDTO;

  if (!email || !password || !name || !birthdate) {
    res.status(400).json({
      success: false,
      message: 'Los campos email, password, name y birthdate son requeridos.',
    });
    return;
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(birthdate)) {
    res.status(400).json({ success: false, message: 'birthdate debe tener formato YYYY-MM-DD.' });
    return;
  }

  if (users.find((u) => u.email === email)) {
    res.status(409).json({ success: false, message: `El email "${email}" ya está registrado.` });
    return;
  }

  const newUser: User = { id: nextId++, email, password, name, birthdate };
  users.push(newUser);

  res.status(201).json({ success: true, message: 'Usuario creado.', data: sanitizeUser(newUser) });
}

export function updateUser(req: Request, res: Response): void {
  const id = parseInt(req.params.id as string);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: `Usuario ${id} no encontrado.` });
    return;
  }

  const { email, password, name, birthdate } = req.body as UpdateUserDTO;

  if (birthdate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthdate)) {
      res.status(400).json({ success: false, message: 'birthdate debe tener formato YYYY-MM-DD.' });
      return;
    }
  }

  users[index] = {
    ...users[index],
    ...(email && { email }),
    ...(password && { password }),
    ...(name && { name }),
    ...(birthdate && { birthdate }),
  };

  res.status(200).json({ success: true, message: 'Usuario actualizado.', data: sanitizeUser(users[index]) });
}

export function deleteUser(req: Request, res: Response): void {
  const id = parseInt(req.params.id as string);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: `Usuario ${id} no encontrado.` });
    return;
  }

  const deleted = users.splice(index, 1)[0];
  res.status(200).json({ success: true, message: `Usuario "${deleted.name}" eliminado.`, data: sanitizeUser(deleted) });
}