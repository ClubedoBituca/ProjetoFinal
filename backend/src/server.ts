import "dotenv/config";

import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import deckRoutes from "./routes/deckRoutes";
import authMiddleware from "./middlewares/auth";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/usuarios", userRoutes);
app.use("/session", sessionRoutes);
app.use("/decks", authMiddleware, deckRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
