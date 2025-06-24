import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { User } from "../types";

const dbPath = path.join(__dirname, "..", "db", "usuarios.json");

export const listarUsuarios = (req: Request, res: Response) => {
  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    const usuarios = JSON.parse(data);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao ler os usuários." });
  }
};

export const cadastrarUsuario = (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    res.status(400).json({ erro: "Username, email e senha são obrigatórios." });
    return;
  }

  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    const usuarios: User[] = JSON.parse(data);

    const emailJaExiste = usuarios.find((u) => u.email === email);
    if (emailJaExiste) {
      res.status(400).json({ erro: "Email já cadastrado." });
      return;
    }

    const novoUsuario = {
      id: `user_${Date.now()}`,
      email,
      username,
      password,
      createdAt: new Date().toISOString(),
    };

    usuarios.push(novoUsuario);
    fs.writeFileSync(dbPath, JSON.stringify(usuarios, null, 2), "utf-8");

    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao cadastrar o usuário." });
  }
};

export const loginUsuario = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ erro: "Email e senha são obrigatórios." });
    return;
  }

  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    const usuarios: User[] = JSON.parse(data);

    const usuario = usuarios.find((u) => u.email === email && u.password === password);

    if (!usuario) {
      res.status(401).json({ erro: "Credenciais inválidas." });
      return;
    }

    res.json({ mensagem: "Login bem-sucedido", usuario });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao processar o login." });
  }
};
