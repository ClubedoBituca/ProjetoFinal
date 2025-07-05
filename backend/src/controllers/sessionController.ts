import bcrypt from "bcrypt";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { z } from "zod";

import { User } from "../types";
import { withRequired } from "../utils/validations";
import { signToken } from "../services/authService";

const dbPath = path.join(__dirname, "..", "db", "usuarios.json");

const loginSchema = z.object({
  email: z.string(withRequired("Email")).email("Email inválido"),
  password: z.string(withRequired("Senha")).min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    let errorMsg = "";

    result.error.issues.forEach(({ message }) => {
      errorMsg += message + ". ";
    });

    res.status(400).json({ erro: errorMsg.trim() });
    return;
  }

  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    const usuarios: User[] = JSON.parse(data);

    const usuario = usuarios.find((u) => u.email === email);

    const passwordMatches = !!usuario && (await bcrypt.compare(password, usuario.password));

    if (!usuario || !passwordMatches) {
      res.status(401).json({ erro: "Credenciais inválidas." });
      return;
    }

    const token = signToken(usuario.id);

    res.json({ mensagem: "Login bem-sucedido", usuario: { ...usuario, password: undefined }, token });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao processar o login." });
  }
};
