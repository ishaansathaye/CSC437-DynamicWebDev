// src/update.ts
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Card } from "server/models";

/**
 * Fetch the details of one card given its section and name.
 * Returns a Promise that resolves to an object { card: Card }.
 */
function loadCardDetail(
  payload: { section: string; cardName: string },
  user: Auth.User
): Promise<{ card: Card }> {
  const { section, cardName } = payload;
  const encodedName = encodeURIComponent(cardName);

  return fetch(`/api/cards/${encodeURIComponent(section)}/${encodedName}`, {
    headers: Auth.headers(user),
  })
    .then((res: Response) => {
      if (res.status === 200) return res.json();
      throw new Error(`Failed to load card "${cardName}", status ${res.status}`);
    })
    .then((json: unknown) => {
      // We expect json to be exactly one Card object
      return { card: json as Card };
    });
}

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "card/select": {
      // message[1] is { section: string; cardName: string }
      loadCardDetail(message[1], user)
        .then(({ card }) => {
            apply((model) => {
            const newModel = {
                ...model,
                selectedCard: card,
            };
            return newModel;
            });
        })
        .catch((err) => {
          console.error("Error loading card detail:", err);
          // If the fetch fails, clear out selectedCard
          apply((model) => ({
            ...model,
            selectedCard: undefined,
          }));
        });
      break;
    }

    default: {
      // If we ever get here, it means an unknown Msg arrived
      const unhandled: string = (message as any)[0];
      throw new Error(`Unhandled message type "${unhandled}" in update()`);
    }
  }
}