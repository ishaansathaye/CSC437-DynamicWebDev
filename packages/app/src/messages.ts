// messages.ts
export type Msg =
  | ["card/select",        { section: string; cardName: string }];