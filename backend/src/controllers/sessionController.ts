import { Request, Response } from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";

import authConfig from "../config/auth";
import { User } from "../types";

const dbPath = path.join(__dirname, "..", "db", "usuarios.json");

export const login = (req: Request, res: Response) => {
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

    const token = jwt.sign({ userId: usuario.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    res.json({ mensagem: "Login bem-sucedido", usuario, token });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao processar o login." });
  }
};
