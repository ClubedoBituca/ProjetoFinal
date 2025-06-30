import { Card } from '../types';

export async function fetchCardInPortuguese(card: Card): Promise<Card> {
  try {
    const response = await fetch(`https://api.scryfall.com/cards/${card.set}/${card.collector_number}/pt`);
    const data = await response.json();

    if (data.lang !== 'pt') {
      return card; // sem versão traduzida
    }

    return {
      ...card,
      name: data.printed_name || card.name,
      oracle_text: data.printed_text || card.oracle_text,
      type_line: data.printed_type_line || card.type_line,
      image_uris: data.image_uris || card.image_uris,
      lang: 'pt',
    };
  } catch (err) {
    console.warn('Não foi possível traduzir a carta:', err);
    return card;
  }
}
