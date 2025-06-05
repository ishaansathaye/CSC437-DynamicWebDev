// app/src/model.ts
import { Card } from "server/models";

export interface Model {
  // whenever a single card is “selected”:
  selectedCard?: Card;

  // store each section’s list of cards here:
  cardsBySection: Record<string, Card[]>;
}

export const init: Model = {
  cardsBySection: {}
};