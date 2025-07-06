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
  mana_cost: string;
  cmc: number;
  type_line: string;
  oracle_text: string;
  power?: string;
  toughness?: string;
  colors: string[];
  color_identity: string[];
  set: string;
  set_name: string;
  collector_number: string;
  rarity: string;

  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
  };

  card_faces?: {
    name: string;
    mana_cost?: string;
    type_line?: string;
    oracle_text?: string;
    image_uris?: {
      small: string;
      normal: string;
      large: string;
      png: string;
    };
  }[];

  prices: {
    usd?: string;
    usd_foil?: string;
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
