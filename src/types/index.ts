export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface Card {
  id: string;
  name: string;
  lang?: string; // 👈 adicione essa linha
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

export interface Deck {
  id: string;
  name: string;
  description?: string;
  cards: DeckCard[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeckCard {
  card: Card;
  quantity: number;
}

export interface SearchFilters {
  name: string;
  colors: string[];
  type: string;
  rarity: string;
  set: string;
  cmc: number | null;
  minCmc: number | null;
  maxCmc: number | null;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export interface DeckContextType {
  decks: Deck[];
  currentDeck: Deck | null;
  createDeck: (name: string, description?: string) => Promise<void>;
  deleteDeck: (id: string) => Promise<void>;
  addCardToDeck: (deckId: string, card: Card, quantity?: number) => Promise<void>;
  removeCardFromDeck: (deckId: string, cardId: string) => Promise<void>;
  setCurrentDeck: (deck: Deck | null) => void;
  isLoading: boolean;
}
