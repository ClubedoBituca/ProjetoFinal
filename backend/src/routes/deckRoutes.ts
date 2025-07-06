import { Router } from "express";

import { createDeck, deleteDeck, listUserDecks } from "../controllers/deckController";

const router = Router();

router.post("/", createDeck);
router.get("/", listUserDecks);
router.delete("/:deckId", deleteDeck);

export default router;
