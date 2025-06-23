import { Card } from '@/types';

export function getCardImage(card: Card): string | null {
  if (card.image_uris?.normal) {
    return card.image_uris.normal;
  }

  if (card.card_faces && card.card_faces.length > 0) {
    return card.card_faces[0].image_uris?.normal || null;
  }

  return null;
}
