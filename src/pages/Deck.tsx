import React from 'react';
import { useParams } from 'react-router-dom';
import { useDeck } from '@/contexts/DeckContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeckCardItem from '@/components/Deck/DeckCardItem';
import DeckStats from '@/components/Deck/DeckStats';

export default function DeckPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { decks, removeCardFromDeck } = useDeck();

  const deck = decks.find(d => d.id === deckId);

  if (!deck) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Deck não encontrado</CardTitle>
            <CardDescription>O deck que você está procurando não existe.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRemoveCard = (cardId: string) => {
    removeCardFromDeck(deck.id, cardId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-magic-gradient bg-clip-text text-transparent">
              {deck.name}
            </h1>
            {deck.description && (
              <p className="text-muted-foreground mt-1">{deck.description}</p>
            )}
          </div>
        </div>

        {/* Deck Statistics */}
        <DeckStats deck={deck} />

        {/* Cards Grid */}
        {deck.cards.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4 opacity-20">🃏</div>
              <CardTitle className="mb-2">Deck vazio</CardTitle>
              <CardDescription className="mb-4">
                Este deck ainda não possui cartas. Adicione algumas cartas para começar!
              </CardDescription>
              <Button onClick={() => navigate('/')}>
                Buscar Cartas
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span>Cartas do Deck</span>
              <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">
                {deck.cards.reduce((total, card) => total + card.quantity, 0)}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {deck.cards.map((deckCard) => (
                <DeckCardItem
                  key={deckCard.card.id}
                  deckCard={deckCard}
                  onRemove={() => handleRemoveCard(deckCard.card.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
