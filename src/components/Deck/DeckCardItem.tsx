import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCardImage } from "@/services/getCardImage";

import ConfirmDeleteDialog from "../ConfirmDeleteDialog";

import type { DeckCard } from "@/types";
interface DeckCardItemProps {
  deckCard: DeckCard;
  onRemove: () => Promise<void>;
}

export default function DeckCardItem({ deckCard, onRemove }: DeckCardItemProps) {
  const { card, quantity } = deckCard;

  return (
    <Card className="magic-card group hover:scale-105 transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={getCardImage(card) || "/placeholder.svg"}
            alt={card.name}
            className="w-full h-auto rounded-t-lg"
            loading="lazy"
          />
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground" variant="default">
            {quantity}x
          </Badge>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{card.name}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{card.type_line}</p>

          {/* Mana Cost */}
          {card.mana_cost && (
            <div className="flex flex-wrap gap-1 mb-3">
              {card.mana_cost
                .replace(/[{}]/g, " ")
                .split(" ")
                .filter(Boolean)
                .map((symbol, index) => (
                  <span
                    key={index}
                    className="mana-symbol text-xs"
                    style={{
                      backgroundColor:
                        symbol === "W"
                          ? "#FFFBD5"
                          : symbol === "U"
                          ? "#0E68AB"
                          : symbol === "B"
                          ? "#150B00"
                          : symbol === "R"
                          ? "#D3202A"
                          : symbol === "G"
                          ? "#00733E"
                          : "#9E9E9E",
                      color: symbol === "W" ? "#000" : "#FFF",
                    }}
                  >
                    {symbol}
                  </span>
                ))}
            </div>
          )}

          {/* Price */}
          {card.prices?.usd && <p className="text-xs text-green-600 font-medium mb-3">${card.prices.usd}</p>}

          <ConfirmDeleteDialog
            actionText="Remover"
            onConfirm={onRemove}
            title="Remover carta"
            description="Tem certeza que deseja remover essa carta? Esta ação não poderá ser desfeita."
          >
            <Button
              variant="destructive"
              size="sm"
              className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Remover
            </Button>
          </ConfirmDeleteDialog>
        </div>
      </CardContent>
    </Card>
  );
}
