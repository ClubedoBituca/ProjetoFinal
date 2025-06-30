
import React from 'react';
import type { Card } from '../../types';
import CardItem from './CardItem';

interface CardGridProps {
  cards: Card[];
  onCardClick: (card: Card) => void;
  onAddToDeck?: (card: Card) => void;
  isLoading?: boolean;
}

export default function CardGrid({ cards, onCardClick, onAddToDeck, isLoading }: CardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="magic-card animate-pulse">
            <div className="aspect-[5/7] bg-muted rounded-lg"></div>
            <div className="p-3 space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🃏</div>
        <h3 className="text-xl font-semibold mb-2">Nenhuma Carta Encontrada!</h3>
        <p className="text-muted-foreground">Tente ajustar seus filtros!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          onClick={() => onCardClick(card)}
          onAddToDeck={onAddToDeck ? () => onAddToDeck(card) : undefined}
        />
      ))}
    </div>
  );
}
