import { Router } from "express";

import { listarUsuarios, cadastrarUsuario } from "../controllers/userController";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, listarUsuarios);
router.post("/", cadastrarUsuario);

export default router;
