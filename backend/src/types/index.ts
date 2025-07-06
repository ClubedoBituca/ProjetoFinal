export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  createdAt: string;
}

export interface Card {
  id: string;
  name: string;
  mana_cost?: string | null;
  cmc: number;
  type_line: string;
  oracle_text?: string | null;
  power?: string | null;
  toughness?: string | null;
  colors?: string[] | null;
  color_identity?: string[] | null;
  set: string;
  set_name: string;
  collector_number: string;
  rarity: string;

  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
  } | null;

  card_faces?:
    | {
        name: string;
        mana_cost?: string | null;
        type_line?: string | null;
        oracle_text?: string | null;
        image_uris?: {
          small: string;
          normal: string;
          large: string;
          png: string;
        } | null;
      }[]
    | null;

  prices: {
    usd?: string | null;
    usd_foil?: string | null;
  };
}

export interface DeckCard {
  card: Card;
  quantity: number;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  cards: DeckCard[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}
