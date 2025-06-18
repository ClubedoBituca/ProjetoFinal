
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { DeckContextType, Deck, Card } from '../types';
import { useAuth } from './AuthContext';
import { toast } from '../hooks/use-toast';

const DeckContext = createContext<DeckContextType | undefined>(undefined);

const DECKS_STORAGE_KEY = 'mtg_app_decks';

export function DeckProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load decks from localStorage
  useEffect(() => {
    if (user) {
      const storedDecks = localStorage.getItem(DECKS_STORAGE_KEY);
      if (storedDecks) {
        try {
          const allDecks = JSON.parse(storedDecks);
          const userDecks = allDecks.filter((deck: Deck) => deck.userId === user.id);
          setDecks(userDecks);
        } catch (error) {
          console.error('Error loading decks:', error);
        }
      }
    } else {
      setDecks([]);
      setCurrentDeck(null);
    }
  }, [user]);

  // Save decks to localStorage
  const saveDecks = (newDecks: Deck[]) => {
    try {
      const storedDecks = localStorage.getItem(DECKS_STORAGE_KEY);
      const allDecks = storedDecks ? JSON.parse(storedDecks) : [];
      
      // Remove current user's decks and add updated ones
      const otherUserDecks = allDecks.filter((deck: Deck) => deck.userId !== user?.id);
      const updatedAllDecks = [...otherUserDecks, ...newDecks];
      
      localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(updatedAllDecks));
    } catch (error) {
      console.error('Error saving decks:', error);
    }
  };

  const createDeck = async (name: string, description?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create decks",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const newDeck: Deck = {
        id: `deck_${Date.now()}`,
        name,
        description,
        cards: [],
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedDecks = [...decks, newDeck];
      setDecks(updatedDecks);
      saveDecks(updatedDecks);

      toast({
        title: "Deck created",
        description: `"${name}" has been created successfully`,
      });
    } catch (error) {
      toast({
        title: "Error creating deck",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateDeck = async (updatedDeck: Deck) => {
    try {
      setIsLoading(true);
      
      updatedDeck.updatedAt = new Date().toISOString();
      
      const updatedDecks = decks.map(deck => 
        deck.id === updatedDeck.id ? updatedDeck : deck
      );
      
      setDecks(updatedDecks);
      saveDecks(updatedDecks);
      
      if (currentDeck?.id === updatedDeck.id) {
        setCurrentDeck(updatedDeck);
      }

      toast({
        title: "Deck updated",
        description: `"${updatedDeck.name}" has been updated`,
      });
    } catch (error) {
      toast({
        title: "Error updating deck",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDeck = async (id: string) => {
    try {
      setIsLoading(true);
      
      const deckToDelete = decks.find(deck => deck.id === id);
      const updatedDecks = decks.filter(deck => deck.id !== id);
      
      setDecks(updatedDecks);
      saveDecks(updatedDecks);
      
      if (currentDeck?.id === id) {
        setCurrentDeck(null);
      }

      toast({
        title: "Deck deleted",
        description: `"${deckToDelete?.name}" has been deleted`,
      });
    } catch (error) {
      toast({
        title: "Error deleting deck",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCardToDeck = async (deckId: string, card: Card, quantity = 1) => {
    try {
      const deck = decks.find(d => d.id === deckId);
      if (!deck) return;

      const existingCardIndex = deck.cards.findIndex(dc => dc.card.id === card.id);
      
      if (existingCardIndex >= 0) {
        // Update existing card quantity
        deck.cards[existingCardIndex].quantity += quantity;
      } else {
        // Add new card
        deck.cards.push({ card, quantity });
      }

      await updateDeck(deck);
      
      toast({
        title: "Card added",
        description: `${quantity}x ${card.name} added to ${deck.name}`,
      });
    } catch (error) {
      toast({
        title: "Error adding card",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const removeCardFromDeck = async (deckId: string, cardId: string) => {
    try {
      const deck = decks.find(d => d.id === deckId);
      if (!deck) return;

      const cardToRemove = deck.cards.find(dc => dc.card.id === cardId);
      deck.cards = deck.cards.filter(dc => dc.card.id !== cardId);

      await updateDeck(deck);
      
      toast({
        title: "Card removed",
        description: `${cardToRemove?.card.name} removed from ${deck.name}`,
      });
    } catch (error) {
      toast({
        title: "Error removing card",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const value: DeckContextType = {
    decks,
    currentDeck,
    createDeck,
    updateDeck,
    deleteDeck,
    addCardToDeck,
    removeCardFromDeck,
    setCurrentDeck,
    isLoading,
  };

  return (
    <DeckContext.Provider value={value}>
      {children}
    </DeckContext.Provider>
  );
}

export function useDeck() {
  const context = useContext(DeckContext);
  if (context === undefined) {
    throw new Error('useDeck must be used within a DeckProvider');
  }
  return context;
}
