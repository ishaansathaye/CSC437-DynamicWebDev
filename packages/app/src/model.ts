// model.ts
import { Card } from "server/models";

export interface Model {
  selectedCard?: Card;                      
}

export const init: Model = {}
