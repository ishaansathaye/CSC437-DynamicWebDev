// app/src/messages.ts

export type Msg =
  | ["cards/load-section", { section: string }]
  | ["card/select", { section: string; cardName: string }]
  | ["card/update", {
      section: string;
      cardName: string;
      sets: number;
      reps: number;
      onSuccess?: () => void;
      onFailure?: (err: Error) => void;
    }];