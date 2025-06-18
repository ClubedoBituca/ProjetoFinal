import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '../components/Layout/Header';
import CardGrid from '../components/Cards/CardGrid';
import SearchFilters from '../components/Search/SearchFilters';
import type { Card, SearchFilters as SearchFiltersType } from '../types';
import { scryfallApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useDeck } from '../contexts/DeckContext';
import { toast } from '../hooks/use-toast';
import { Search, Filter } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { decks, addCardToDeck } = useDeck();
  
  // Search state
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCards, setTotalCards] = useState(0);
  const [quickSearch, setQuickSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<SearchFiltersType>({
    name: '',
    colors: [],
    type: '',
    rarity: 'any',
    set: '',
    cmc: null,
    minCmc: null,
    maxCmc: null,
  });
  
  // Card modal state
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<string>('');

  // Load random cards on initial load
  useEffect(() => {
    performSearch();
  }, []);

  const performSearch = async (page = 1, resetResults = true) => {
    setIsLoading(true);
    try {
      const searchFilters = quickSearch.trim() 
        ? { ...filters, name: quickSearch }
        : filters;
      
      // Clean up filters - replace "any" with empty string for type
      const cleanFilters = {
        ...searchFilters,
        type: searchFilters.type === 'any' ? '' : searchFilters.type,
      };
      
      const result = await scryfallApi.searchCards(cleanFilters, page);
      
      if (resetResults) {
        setCards(result.data);
      } else {
        setCards(prev => [...prev, ...result.data]);
      }
      
      setHasMore(result.has_more);
      setTotalCards(result.total_cards);
      setCurrentPage(page);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Please try again with different filters",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSearch = () => {
    setCurrentPage(1);
    performSearch(1, true);
  };

  const handleFiltersSearch = () => {
    setCurrentPage(1);
    performSearch(1, true);
    setShowFilters(false);
  };

  const loadMore = () => {
    if (hasMore && !isLoading) {
      performSearch(currentPage + 1, false);
    }
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };

  const handleAddToDeck = (card: Card) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add cards to decks",
        variant: "destructive",
      });
      return;
    }

    if (decks.length === 0) {
      toast({
        title: "No decks available",
        description: "Please create a deck first",
        variant: "destructive",
      });
      return;
    }

    if (decks.length === 1) {
      addCardToDeck(decks[0].id, card);
    } else {
      setSelectedCard(card);
      setShowCardModal(true);
    }
  };

  const handleAddSelectedToDeck = () => {
    if (selectedCard && selectedDeckId) {
      addCardToDeck(selectedDeckId, selectedCard);
      setShowCardModal(false);
      setSelectedCard(null);
      setSelectedDeckId('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-magic-gradient bg-clip-text text-transparent mb-4">
            Magic: The Gathering Deck Builder
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Search, collect, and build the perfect deck
          </p>
          
          {/* Quick Search */}
          <div className="max-w-2xl mx-auto flex gap-2">
            <Input
              placeholder="Quick search for cards..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
              className="text-lg"
            />
            <Button onClick={handleQuickSearch} disabled={isLoading}>
              <Search className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(true)}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        {totalCards > 0 && (
          <div className="mb-6 text-center">
            <p className="text-muted-foreground">
              Found {totalCards.toLocaleString()} cards
              {hasMore && ` (showing ${cards.length})`}
            </p>
          </div>
        )}

        {/* Cards Grid */}
        <CardGrid
          cards={cards}
          onCardClick={handleCardClick}
          onAddToDeck={user ? handleAddToDeck : undefined}
          isLoading={isLoading && cards.length === 0}
        />

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-8">
            <Button 
              onClick={loadMore} 
              disabled={isLoading}
              variant="outline"
              size="lg"
            >
              {isLoading ? 'Loading...' : 'Load More Cards'}
            </Button>
          </div>
        )}

        {/* Search Filters Modal */}
        <Dialog open={showFilters} onOpenChange={setShowFilters}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Advanced Search</DialogTitle>
            </DialogHeader>
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={handleFiltersSearch}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>

        {/* Card Detail Modal */}
        <Dialog open={showCardModal} onOpenChange={setShowCardModal}>
          <DialogContent className="max-w-2xl">
            {selectedCard && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedCard.name}</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="aspect-[5/7] bg-muted rounded-lg overflow-hidden">
                    {selectedCard.image_uris?.large ? (
                      <img
                        src={selectedCard.image_uris.large}
                        alt={selectedCard.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🃏</div>
                          <p className="text-lg font-medium">{selectedCard.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Details</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Type:</strong> {selectedCard.type_line}</p>
                        <p><strong>Mana Cost:</strong> {selectedCard.mana_cost || 'None'}</p>
                        <p><strong>CMC:</strong> {selectedCard.cmc}</p>
                        <p><strong>Rarity:</strong> {selectedCard.rarity}</p>
                        <p><strong>Set:</strong> {selectedCard.set_name}</p>
                        {selectedCard.power && selectedCard.toughness && (
                          <p><strong>P/T:</strong> {selectedCard.power}/{selectedCard.toughness}</p>
                        )}
                        {selectedCard.prices?.usd && (
                          <p><strong>Price:</strong> ${selectedCard.prices.usd}</p>
                        )}
                      </div>
                    </div>
                    
                    {selectedCard.oracle_text && (
                      <div>
                        <h3 className="font-semibold mb-2">Oracle Text</h3>
                        <p className="text-sm whitespace-pre-line">
                          {selectedCard.oracle_text}
                        </p>
                      </div>
                    )}
                    
                    {user && decks.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">Add to Deck</h3>
                        <Select value={selectedDeckId} onValueChange={setSelectedDeckId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a deck..." />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            {decks.map((deck) => (
                              <SelectItem key={deck.id} value={deck.id}>
                                {deck.name} ({deck.cards.length} cards)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          onClick={handleAddSelectedToDeck}
                          disabled={!selectedDeckId}
                          className="w-full"
                        >
                          Add to Deck
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Index;
