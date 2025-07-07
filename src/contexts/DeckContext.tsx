import React, { createContext, useContext, useState, useEffect } from "react";
import type { DeckContextType, Deck, Card } from "../types";
import { useAuth } from "./AuthContext";
import { toast } from "../hooks/use-toast";
import { decksService } from "@/services/decks";

const DeckContext = createContext<DeckContextType | undefined>(undefined);

export function DeckProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getUserDecks() {
      if (user) {
        setIsLoading(true);

        try {
          const decks = await decksService.getUserDecks();
          setDecks(decks);
        } catch (err) {
          toast({ title: "Erro ao buscar decks do usuário", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      } else {
        setDecks([]);
        setCurrentDeck(null);
      }
    }

    getUserDecks();
  }, [user]);

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

      const newDeck = await decksService.createDeck({ name, description });

      const updatedDecks = [...decks, newDeck];
      setDecks(updatedDecks);

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

  const deleteDeck = async (id: string) => {
    try {
      setIsLoading(true);

      await decksService.deleteDeck(id);

      const deckToDelete = decks.find((deck) => deck.id === id);

      setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== id));

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
      setIsLoading(true);

      const updatedDeck = await decksService.addCardToDeck({ card, deckId });

      setDecks((prevDecks) => prevDecks.map((deck) => (deck.id === deckId ? updatedDeck : deck)));

      toast({
        title: "Card added",
        description: `${quantity}x ${card.name} added to ${updatedDeck.name}`,
      });
    } catch (error) {
      toast({
        title: "Error adding card",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeCardFromDeck = async (deckId: string, cardId: string) => {
    try {
      setIsLoading(true);

      const updatedDeck = await decksService.removeCardFromDeck({ cardId, deckId });

      const cardToRemove = decks
        .find((deck) => deck.id === deckId)
        .cards.find((deckCard) => deckCard.card.id === cardId);

      setDecks((prevDecks) => prevDecks.map((deck) => (deck.id === deckId ? updatedDeck : deck)));

      toast({
        title: "Card removed",
        description: `${cardToRemove?.card.name} removed from ${updatedDeck.name}`,
      });
    } catch (error) {
      toast({
        title: "Error removing card",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value: DeckContextType = {
    decks,
    currentDeck,
    createDeck,
    deleteDeck,
    addCardToDeck,
    removeCardFromDeck,
    setCurrentDeck,
    isLoading,
  };

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
}

export function useDeck() {
  const context = useContext(DeckContext);
  if (context === undefined) {
    throw new Error("useDeck must be used within a DeckProvider");
  }
  return context;
}
