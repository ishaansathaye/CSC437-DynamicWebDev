import {Schema, model } from 'mongoose';
import { Card } from "../models/card";

const CardSchema = new Schema<Card>({
    cardName: { type: String, required: true },
    icon: { type: String, required: true },
    href: { type: String, required: true },
    description: { type: String },
    section: { type: String, required: true },
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
    cardName: string,
    card: Card
): Promise<Card> {
    return CardModel.findOneAndUpdate(
        { cardName },
        card,
        { new: true }
    ).then((updatedCard) => {
        if (!updatedCard) {
            throw new Error(`Card ${cardName} not found`);
        }
        return updatedCard as Card;
    }).catch((err) => {
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