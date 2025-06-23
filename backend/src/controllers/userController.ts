import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';



const dbPath = path.join(__dirname, '..', 'db', 'usuarios.json');

export const listarUsuarios = (req: Request, res: Response): Response => {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    const usuarios = JSON.parse(data);
    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao ler os usuários.' });
  }
};

export const cadastrarUsuario = (req: Request, res: Response): Response => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ erro: 'Username, email e senha são obrigatórios.' });
  }

  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    const usuarios = JSON.parse(data);

    const emailJaExiste = usuarios.find((u: any) => u.email === email);
    if (emailJaExiste) {
      return res.status(409).json({ erro: 'Email já cadastrado.' });
    }

    const novoUsuario = {
      id: `user_${Date.now()}`,
      email,
      username,
      password,
      createdAt: new Date().toISOString()
    };

    usuarios.push(novoUsuario);
    fs.writeFileSync(dbPath, JSON.stringify(usuarios, null, 2), 'utf-8');

    return res.status(201).json(novoUsuario);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao cadastrar o usuário.' });
  }
};

export const loginUsuario = (req: Request, res: Response): Response => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
  }

  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    const usuarios = JSON.parse(data);

    const usuario = usuarios.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    return res.json({ mensagem: 'Login bem-sucedido', usuario });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao processar o login.' });
  }
};

