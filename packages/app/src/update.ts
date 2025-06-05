// app/src/update.ts
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Card } from "server/models";

/**
 * Helper: fetch one card detail by section & cardName
 */
function loadCardDetail(
  payload: { section: string; cardName: string },
  user: Auth.User
): Promise<Card> {
  const { section, cardName } = payload;
  const encodedName = encodeURIComponent(cardName);
  return fetch(`/api/cards/${encodeURIComponent(section)}/${encodedName}`, {
    headers: Auth.headers(user),
  })
    .then((res: Response) => {
      if (res.status === 200) {
        return res.json();
      }
      throw new Error(
        `Failed to load card "${cardName}" in section "${section}", status ${res.status}`
      );
    })
    .then((json: unknown) => json as Card);
}

/**
 * Helper: send a PUT to update a card in the given section
 */
function updateCardOnServer(
  payload: { section: string; cardName: string; sets: number; reps: number },
  user: Auth.User
): Promise<Card> {
  const { section, cardName, sets, reps } = payload;
  const encodedName = encodeURIComponent(cardName);
  // Build the body with whatever fields you want to update.
  // In this example, we're only sending sets and reps,
  // but you could include other fields if needed.
  const body = { sets, reps };

    return fetch(`/api/cards/${encodeURIComponent(section)}/${encodedName}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify(body),
  })
    .then((res: Response) => {
      if (res.status === 200) {
        return res.json();
      }
      throw new Error(
        `Failed to update card "${cardName}" in section "${section}", status ${res.status}`
      );
    })
    .then((json: unknown) => json as Card);
}

function loadCardsForSection(
  payload: { section: string },
  user: Auth.User
): Promise<{ section: string; cards: Card[] }> {
  const { section } = payload;
  return fetch(`/api/cards/${encodeURIComponent(section)}`, {
    headers: Auth.headers(user),
  })
    .then((res: Response) => {
      if (res.status === 200) {
        return res.json();
      }
      throw new Error(
        `Failed to load cards for section "${section}", status ${res.status}`
      );
    })
    .then((json: unknown) => {
      return { section, cards: json as Card[] };
    });
}

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "card/select": {
      // message[1] has { section, cardName }
      loadCardDetail(message[1], user)
        .then((card) => {
          // Once we have the Card, store it in model.selectedCard
          apply((model) => ({
            ...model,
            selectedCard: card,
          }));
        })
        .catch((err) => {
          console.error("Error loading card detail:", err);
          // If the load failed, clear selectedCard
          apply((model) => ({
            ...model,
            selectedCard: undefined,
          }));
        });
      break;
    }

    case "card/update": {
      // message[1] has { section, cardName, sets, reps, onSuccess?, onFailure? }
      const { section, cardName, sets, reps, onSuccess, onFailure } = message[1];

      updateCardOnServer({ section, cardName, sets, reps }, user)
        .then((updatedCard) => {
          // Update model.selectedCard with the server’s response
          apply((model) => ({
            ...model,
            selectedCard: updatedCard,
          }));
          if (onSuccess) {
            onSuccess();
          }
        })
        .catch((err) => {
          console.error("Error updating card:", err);
          if (onFailure) {
            onFailure(err as Error);
          }
        });
      break;
    }

    case "cards/load-section": {
      loadCardsForSection(message[1], user)
        .then(({ section, cards }) => {
          apply((model) => ({
            ...model,
            cardsBySection: {
              ...model.cardsBySection,
              [section]: cards,
            },
          }));
        })
        .catch((err) => {
          console.error("Error loading cards for section:", err);
        });
      break;
    }

    

    default: {
      // This should never happen if Msg is exhaustive.
      const unhandled: never = message[0];
      throw new Error(`Unhandled message type "${unhandled}" in update()`);
    }
  }
}