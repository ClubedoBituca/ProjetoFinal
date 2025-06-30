
import React from 'react';
import { useParams } from 'react-router-dom';
import { useDeck } from '@/contexts/DeckContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trash2, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeckCardItem from '@/components/Deck/DeckCardItem';
import DeckStats from '@/components/Deck/DeckStats';
import { printDeck } from '@/utils/printUtils';

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

  const handlePrintDeck = () => {
    if (deck.cards.length === 0) {
      alert('O deck está vazio. Adicione cartas antes de imprimir.');
      return;
    }
    printDeck(deck);
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
        {deck.cards.length > 0 && (
          <Button 
            onClick={handlePrintDeck}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir Deck
          </Button>
        )}
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
          {/* Printing Instructions */}
          <Card className="mb-6 bg-muted/30 border-muted shadow-sm">
            <CardHeader>
              <CardTitle>Instruções de Impressão</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>Use papel <strong>couché fosco 180g ou 230g</strong>.</li>
                <li>Configure a impressora para <strong>modo retrato</strong>, <strong>escala 100%</strong> e <strong>margens padrão</strong>.</li>
                <li>Após a impressão, recorte nas bordas e coloque as cartas em <strong>sleeves protetores</strong>.</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span>Cartas do Deck</span>
              <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">
                {deck.cards.reduce((total, card) => total + card.quantity, 0)}
              </span>
            </h2>
          </div>

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
);}