import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import authConfig from "../config/auth";

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  const [, token] = authHeader.split(" ");

  try {
    const payload = jwt.verify(token, authConfig.secret) as JwtPayload;
    req.userId = payload;

    next();
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
};
