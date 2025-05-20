import express, { Request, Response } from "express";
import { Card } from "../models/card";

import Cards from "../services/card-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Cards.index()
    .then((list: Card[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

// Get all cards in a section, e.g. /api/cards/exercises
router.get("/:section", (req: Request, res: Response) => {
  const { section } = req.params;
  Cards.findBySection(section)
    .then((list: Card[]) => {
      if (list.length) return res.json(list);
      res.status(404).send();
    })
    .catch((err) => res.status(500).send(err));
});

// Get a single card by section and name, e.g. /api/cards/exercises/Bench%20Press
router.get("/:section/:cardName", (req: Request, res: Response) => {
  const { section, cardName } = req.params;
  Cards.findBySection(section)
    .then((list: Card[]) => {
      const card = list.find(c => c.cardName === cardName);
      if (card) return res.json(card);
      res.status(404).send();
    })
    .catch((err) => res.status(500).send(err));
});

// Create a new card
router.post("/", (req: Request, res: Response) => {
  const cardData: Card = req.body;
  Cards.create(cardData)
    .then((card: Card) => res.status(201).json(card))
    .catch((err) => res.status(500).send(err));
});

// Update an existing card
router.put("/:cardName", (req: Request, res: Response) => {
  const { cardName } = req.params;
  const cardData: Card = req.body;
  Cards.update(cardName, cardData)
    .then((card: Card) => res.json(card))
    .catch((err) => res.status(500).send(err));
});

// Delete a card
router.delete("/:cardName", (req: Request, res: Response) => {
  const { cardName } = req.params;
  Cards.remove(cardName)
    .then(() => res.status(204).end())
    .catch((err) => res.status(500).send(err));
});

export default router;
