import { Router } from "express";

import { listarUsuarios, cadastrarUsuario } from "../controllers/userController";

const router = Router();

router.get("/", listarUsuarios);
router.post("/", cadastrarUsuario);

export default router;
