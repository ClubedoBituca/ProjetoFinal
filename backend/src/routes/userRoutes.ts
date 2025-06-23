import { Router } from 'express';
import { listarUsuarios, cadastrarUsuario, loginUsuario } from '../controllers/userController';

const router = Router();

router.get('/', listarUsuarios);
router.post('/', cadastrarUsuario);
router.post('/login', loginUsuario); // ✅ agora o login funciona

export default router;
