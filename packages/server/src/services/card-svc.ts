import {Schema, model } from 'mongoose';
import { Card } from "../models/card";

const CardSchema = new Schema<Card>({
    cardName: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String },
    section: { type: String, required: true },
    sets:        { type: Number, default: 0 },
    reps:        { type: Number, default: 0 },
    equipment:   { type: String, trim: true },
    targets:     { type: String, trim: true }
}, {
    collection: 'cards',
    timestamps: true,
});

const CardModel = model<Card>('Card', CardSchema);

function index(): Promise<Card[]> {
    return CardModel.find();
}

async function get(cardName: string): Promise<Card> {
  const card = await CardModel.findOne({ cardName }).exec();
  if (!card) {
    throw new Error(`${cardName} not found`);
  }
  return card;
}

/** Return all cards in the given section */
function findBySection(section: string): Promise<Card[]> {
  return CardModel.find({ section });
}

/** Create a new card */
function create(json: Card): Promise<Card> {
  const card = new CardModel(json);
  return card.save();
}

/** Update an existing card */
function update(
  section: string,
  cardName: string,
  cardData: Partial<Card>
): Promise<Card> {
  // Build a “$set” object that includes only defined fields:
  const patch: Partial<Card> = {};
  if (typeof cardData.sets === "number")      patch.sets = cardData.sets;
  if (typeof cardData.reps === "number")      patch.reps = cardData.reps;
  if (typeof cardData.equipment === "string") patch.equipment = cardData.equipment;
  if (typeof cardData.targets === "string")   patch.targets = cardData.targets;
  // (and so on for any other optional fields…)

  return CardModel.findOneAndUpdate(
    { section, cardName },
    { $set: patch },
    { new: true }
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        throw new Error(`Card ${cardName} not found`);
      }
      return updatedCard as Card;
    })
    .catch((err) => {
      throw new Error(`Error updating card ${cardName}: ${err.message}`);
    });
}

/* Delete a card */
function remove(cardName: string): Promise<void> {
    return CardModel.findOneAndDelete({ cardName }).then(
        (deletedCard) => {
            if (!deletedCard) {
                throw new Error(`Card ${cardName} not found`);
            }
        }
    ).catch((err) => {
        throw new Error(`Error deleting card ${cardName}: ${err.message}`);
    });
}

export default {
    index,
    get,
    findBySection,
    create,
    update,
    remove,
};