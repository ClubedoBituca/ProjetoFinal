
import axios from 'axios';
import type { Card, SearchFilters } from '../types';

const SCRYFALL_API_BASE = 'https://api.scryfall.com';

// Create axios instance
const api = axios.create({
  baseURL: SCRYFALL_API_BASE,
  timeout: 10000,
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log('Making request to:', config.url);
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

export const scryfallApi = {
  // Search cards with advanced filters
  searchCards: async (filters: SearchFilters, page = 1): Promise<{ data: Card[]; has_more: boolean; total_cards: number }> => {
    const searchQuery = buildSearchQuery(filters);
    
    try {
      const response = await api.get('/cards/search', {
        params: {
          q: searchQuery,
          page,
          format: 'json',
          order: 'name',
        },
      });
      
      return {
        data: response.data.data || [],
        has_more: response.data.has_more || false,
        total_cards: response.data.total_cards || 0,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { data: [], has_more: false, total_cards: 0 };
      }
      throw error;
    }
  },

  // Get card by ID
  getCard: async (id: string): Promise<Card> => {
    const response = await api.get(`/cards/${id}`);
    return response.data;
  },

  // Get random card
  getRandomCard: async (): Promise<Card> => {
    const response = await api.get('/cards/random');
    return response.data;
  },

  // Get sets
  getSets: async (): Promise<any[]> => {
    const response = await api.get('/sets');
    return response.data.data;
  },

  // Get card by name (exact match)
  getCardByName: async (name: string): Promise<Card> => {
    const response = await api.get('/cards/named', {
      params: { exact: name },
    });
    return response.data;
  },

  // Autocomplete card names
  autocomplete: async (query: string): Promise<string[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      const response = await api.get('/cards/autocomplete', {
        params: { q: query },
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Autocomplete error:', error);
      return [];
    }
  },
};

// Build search query string from filters
function buildSearchQuery(filters: SearchFilters): string {
  const queries: string[] = [];

  // Name search
  if (filters.name.trim()) {
    queries.push(`name:"${filters.name.trim()}"`);
  }

  // Colors
  if (filters.colors.length > 0) {
    const colorQuery = filters.colors.join('');
    queries.push(`colors:${colorQuery}`);
  }

  // Type
  if (filters.type.trim()) {
    queries.push(`type:"${filters.type.trim()}"`);
  }

  // Rarity
  if (filters.rarity && filters.rarity !== 'any') {
    queries.push(`rarity:${filters.rarity}`);
  }

  // Set
  if (filters.set.trim()) {
    queries.push(`set:"${filters.set.trim()}"`);
  }

  // CMC (Converted Mana Cost)
  if (filters.cmc !== null) {
    queries.push(`cmc:${filters.cmc}`);
  } else if (filters.minCmc !== null || filters.maxCmc !== null) {
    if (filters.minCmc !== null && filters.maxCmc !== null) {
      queries.push(`cmc>=${filters.minCmc} cmc<=${filters.maxCmc}`);
    } else if (filters.minCmc !== null) {
      queries.push(`cmc>=${filters.minCmc}`);
    } else if (filters.maxCmc !== null) {
      queries.push(`cmc<=${filters.maxCmc}`);
    }
  }

  return queries.length > 0 ? queries.join(' ') : '*';
}

export default api;
