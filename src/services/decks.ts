import { API_URL } from "@/constants/api";
import { Deck } from "@/types";
import { apiFetch } from "@/utils/apiFetch";

interface CreateDeckParams {
  name: string;
  description?: string;
}

export const decksService = {
  getUserDecks: async (): Promise<Deck[]> => {
    const res = await apiFetch(`${API_URL}/decks`, {
      method: "GET",
    });

    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.erro || "Erro ao buscar decks do usuário");
    }

    const decks: Deck[] = await res.json();

    return decks;
  },
  createDeck: async ({ name, description }: CreateDeckParams): Promise<Deck> => {
    const res = await apiFetch(`${API_URL}/decks`, {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });

    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.erro || "Erro ao criar deck");
    }

    const newDeck: Deck = await res.json();

    return newDeck;
  },
  deleteDeck: async (id: string): Promise<void> => {
    const res = await apiFetch(`${API_URL}/decks/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.erro || "Erro ao deletar deck");
    }
  },
};
