
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card as CardType } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { getCardImage } from '../../services/getCardImage';


interface CardItemProps {
  card: CardType;
  onClick: () => void;
  onAddToDeck?: () => void;
  quantity?: number;
}

export default function CardItem({ card, onClick, onAddToDeck, quantity }: CardItemProps) {
  const { user } = useAuth();

  const formatManaCost = (manaCost: string) => {
    if (!manaCost) return null;
    
    // Convert mana symbols to readable format
    return manaCost
      .replace(/{W}/g, '⚪')
      .replace(/{U}/g, '🔵')
      .replace(/{B}/g, '⚫')
      .replace(/{R}/g, '🔴')
      .replace(/{G}/g, '🟢')
      .replace(/{([0-9]+)}/g, '$1')
      .replace(/{([XYZC])}/g, '$1');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'text-slate-600';
      case 'uncommon': return 'text-slate-400';
      case 'rare': return 'text-yellow-600';
      case 'mythic': return 'text-orange-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="magic-card group cursor-pointer transition-all duration-300 hover:scale-105">
      {/* Card Image */}
      <div 
        className="aspect-[5/7] bg-muted rounded-lg overflow-hidden relative"
        onClick={onClick}
      >
        {(() => {
          const image = getCardImage(card);
          return image ? (
            <img
              src={image}
              alt={card.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/20">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">🃏</div>
                <p className="text-sm font-medium">{card.name}</p>
              </div>
            </div>
          );
        })()}
        
        {/* Quantity badge */}
        {quantity && quantity > 1 && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {quantity}
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
            {card.name}
          </h3>
          {card.mana_cost && (
            <span className="text-xs font-mono ml-2 flex-shrink-0">
              {formatManaCost(card.mana_cost)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate">{card.type_line}</span>
          <span className={`font-medium capitalize ${getRarityColor(card.rarity)}`}>
            {card.rarity}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{card.set_name}</span>
          {card.prices?.usd && (
            <span className="font-medium text-green-600">
              ${card.prices.usd}
            </span>
          )}
        </div>

        {/* Add to Deck Button */}
        {user && onAddToDeck && (
          <Button
            size="sm"
            className="w-full mt-2"
            onClick={(e) => {
              e.stopPropagation();
              onAddToDeck();
            }}
          >
            Add to Deck
          </Button>
        )}
      </div>
    </div>
  );
}
