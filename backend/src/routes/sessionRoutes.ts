import { Router } from "express";

import { login } from "../controllers/sessionController";

const router = Router();

router.post("/login", login);

export default router;
