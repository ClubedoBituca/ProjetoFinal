import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Deck } from '@/types';

interface DeckStatsProps {
  deck: Deck;
}

export default function DeckStats({ deck }: DeckStatsProps) {
  const totalCards = deck.cards.reduce((total, card) => total + card.quantity, 0);
  const uniqueCards = deck.cards.length;
  const averageCMC = deck.cards.length > 0 
    ? (deck.cards.reduce((total, card) => total + (card.card.cmc * card.quantity), 0) / totalCards).toFixed(1)
    : 0;

  // Calculate color distribution
  const colorCounts = deck.cards.reduce((acc, deckCard) => {
    deckCard.card.colors.forEach(color => {
      acc[color] = (acc[color] || 0) + deckCard.quantity;
    });
    return acc;
  }, {} as Record<string, number>);

  // Calculate total deck value
  const totalValue = deck.cards.reduce((total, deckCard) => {
    const price = parseFloat(deckCard.card.prices?.usd || '0');
    return total + (price * deckCard.quantity);
  }, 0);

  const colorNames = {
    W: 'Branco',
    U: 'Azul',
    B: 'Preto',
    R: 'Vermelho',
    G: 'Verde'
  };

  const colorStyles = {
    W: 'bg-magic-white text-black',
    U: 'bg-magic-blue text-white',
    B: 'bg-magic-black text-white',
    R: 'bg-magic-red text-white',
    G: 'bg-magic-green text-white'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total de Cartas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCards}</div>
          <p className="text-xs text-muted-foreground">
            {uniqueCards} únicas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">CMC Médio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageCMC}</div>
          <p className="text-xs text-muted-foreground">
            Custo convertido
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Valor Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            ${totalValue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Valor estimado
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Cores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {Object.entries(colorCounts).map(([color, count]) => (
              <Badge
                key={color}
                className={`text-xs ${colorStyles[color as keyof typeof colorStyles]}`}
                variant="secondary"
              >
                {colorNames[color as keyof typeof colorNames]} ({count})
              </Badge>
            ))}
            {Object.keys(colorCounts).length === 0 && (
              <span className="text-xs text-muted-foreground">Incolor</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}