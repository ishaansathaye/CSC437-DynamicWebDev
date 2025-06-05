export interface Card {
  cardName:   string;
  icon:       string;
  description: string;
  section:    string;
  sets?:       number;
  reps?:       number;
  equipment?:  string;
  targets?:    string;
}