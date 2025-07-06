import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import z from "zod";

import { Deck } from "../types";
import { withRequired } from "../utils/validations";

const dbPath = path.join(__dirname, "..", "db", "decks.json");

export const listUserDecks = (req: Request, res: Response) => {
  try {
    const data = fs.readFileSync(dbPath, "utf-8");

    const allDecks: Deck[] = JSON.parse(data);

    const userDecks = allDecks.filter((deck) => deck.userId === req.userId);

    res.json(userDecks);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao ler os decks." });
  }
};

const registerSchema = z.object({
  name: z.string(withRequired("Nome do Deck")),
  description: z.string().optional(),
});

export const createDeck = (req: Request, res: Response) => {
  const { name, description } = req.body;

  const result = registerSchema.safeParse({ name, description });

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
    const decks: Deck[] = JSON.parse(data);

    const newDeck: Deck = {
      id: `deck_${Date.now()}`,
      name,
      description,
      cards: [],
      userId: req.userId!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    decks.push(newDeck);
    fs.writeFileSync(dbPath, JSON.stringify(decks, null, 2), "utf-8");

    res.status(201).json(newDeck);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar novo deck." });
  }
};

const deleteSchema = z.object({
  deckId: z.string(withRequired("ID")),
});

export const deleteDeck = (req: Request, res: Response) => {
  const { deckId } = req.params;

  const result = deleteSchema.safeParse({ deckId });

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
    const decks: Deck[] = JSON.parse(data);

    const deckExists = decks.find((deck) => deck.id === deckId);

    if (!deckExists) {
      res.status(404).json({ erro: "Nenhum deck encontrado com o ID fornecido." });
      return;
    }

    const filteredDecks = decks.filter((deck) => deck.id !== deckId);

    fs.writeFileSync(dbPath, JSON.stringify(filteredDecks, null, 2), "utf-8");

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir deck." });
  }
};
