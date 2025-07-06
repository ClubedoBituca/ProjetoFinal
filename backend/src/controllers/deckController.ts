import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { z } from "zod";

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

const addCardParamsSchema = z.object({
  deckId: z.string(withRequired("ID")),
});

const addCardBodySchema = z.object({
  id: z.string(withRequired("id")),
  name: z.string(withRequired("name")),
  mana_cost: z.string().nullish(),
  cmc: z.number(withRequired("cmc")),
  type_line: z.string(withRequired("type_line")),
  oracle_text: z.string().nullish(),
  power: z.string().nullish(),
  toughness: z.string().nullish(),
  colors: z.array(z.string()).nullish(),
  color_identity: z.array(z.string()).nullish(),
  set: z.string(withRequired("set")),
  set_name: z.string(withRequired("set_name")),
  collector_number: z.string(withRequired("collector_number")),
  rarity: z.string(withRequired("rarity")),
  image_uris: z
    .object({
      small: z.string(withRequired("image_uris.small")),
      normal: z.string(withRequired("image_uris.normal")),
      large: z.string(withRequired("image_uris.large")),
      png: z.string(withRequired("image_uris.png")),
    })
    .nullish(),
  card_faces: z
    .array(
      z.object({
        name: z.string(withRequired("card_faces.name")),
        mana_cost: z.string().nullish(),
        type_line: z.string().nullish(),
        oracle_text: z.string().nullish(),
        image_uris: z
          .object({
            small: z.string(withRequired("card_faces.image_uris.small")),
            normal: z.string(withRequired("card_faces.image_uris.normal")),
            large: z.string(withRequired("card_faces.image_uris.large")),
            png: z.string(withRequired("card_faces.image_uris.png")),
          })
          .nullish(),
      })
    )
    .nullish(),
  prices: z
    .object({
      usd: z.string().nullish(),
      usd_foil: z.string().nullish(),
    })
    .nullish(),
});

export const addCardToDeck = (req: Request, res: Response) => {
  const { deckId } = req.params;

  const card = req.body;

  const deckIdValidation = addCardParamsSchema.safeParse({ deckId });

  if (!deckIdValidation.success) {
    let errorMsg = "";

    deckIdValidation.error.issues.forEach((issue) => {
      errorMsg += issue.message + ". ";
    });

    res.status(400).json({ erro: errorMsg.trim() });
    return;
  }

  const cardValidation = addCardBodySchema.safeParse(card);

  if (!cardValidation.success) {
    let errorMsg = "";

    cardValidation.error.issues.forEach((issue) => {
      errorMsg += issue.message + ". ";
    });

    res.status(400).json({ erro: errorMsg.trim() });
    return;
  }

  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    const decks: Deck[] = JSON.parse(data);

    const deckIdx = decks.findIndex((deck) => deck.id === deckId);

    if (deckIdx < 0) {
      res.status(404).json({ erro: "Nenhum deck encontrado com o ID fornecido." });
      return;
    }

    const cardIdx = decks[deckIdx].cards.findIndex((deckCard) => deckCard.card.id === card.id);

    if (cardIdx >= 0) {
      decks[deckIdx].cards[cardIdx].quantity++;
    } else {
      decks[deckIdx].cards.push({ card, quantity: 1 });
    }

    fs.writeFileSync(dbPath, JSON.stringify(decks, null, 2), "utf-8");

    res.status(200).json(decks[deckIdx]);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir deck." });
  }
};
