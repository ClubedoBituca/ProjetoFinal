import { Router } from "express";

import {
  addCardToDeck,
  createDeck,
  deleteDeck,
  listUserDecks,
  removeCardFromDeck,
} from "../controllers/deckController";

const router = Router();

router.post("/", createDeck);
router.post("/:deckId/cards", addCardToDeck);
router.get("/", listUserDecks);
router.delete("/:deckId", deleteDeck);
router.delete("/:deckId/cards/:cardId", removeCardFromDeck);

export default router;
