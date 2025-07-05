import bcrypt from "bcrypt";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import z from "zod";

import { User } from "../types";
import { withRequired } from "../utils/validations";
import { signToken } from "../services/authService";

const dbPath = path.join(__dirname, "..", "db", "usuarios.json");

export const listarUsuarios = (_req: Request, res: Response) => {
  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    const usuarios = JSON.parse(data).map((usuario: User) => ({ ...usuario, password: undefined }));
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao ler os usuários." });
  }
};

const registerSchema = z.object({
  email: z.string(withRequired("Email")).email("Email inválido"),
  username: z.string(withRequired("Username")).min(3, "O username deve ter pelo menos 3 caracteres"),
  password: z.string(withRequired("Senha")).min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const cadastrarUsuario = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  const result = registerSchema.safeParse({ email, username, password });

  if (!result.success) {
    let errorMsg = "";

    result.error.issues.forEach((issue) => {
      errorMsg += issue.message + ". ";
    });

    res.status(400).json({ erro: errorMsg.trim() });
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

    const passwordHash = await bcrypt.hash(password, 10);

    const novoUsuario = {
      id: `user_${Date.now()}`,
      email,
      username,
      password: passwordHash,
      createdAt: new Date().toISOString(),
    };

    usuarios.push(novoUsuario);
    fs.writeFileSync(dbPath, JSON.stringify(usuarios, null, 2), "utf-8");

    const token = signToken({ userId: novoUsuario.id });

    res.status(201).json({ usuario: { ...novoUsuario, password: undefined }, token });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao cadastrar o usuário." });
  }
};
