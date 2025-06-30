
import type { Deck } from '@/types';

const CARD_WIDTH_MM = 63.5;
const CARD_HEIGHT_MM = 88;
const SPACING_MM = 1; // Reduzindo o espaçamento
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 2; // Reduzindo a margem

const CARD_SLEEVE_URL = 'https://m.media-amazon.com/images/I/61AGZ37D7eL._AC_SL1039_.jpg';

export const printDeck = (deck: Deck) => {
  // Calculate how many cards fit per page
  const availableWidth = A4_WIDTH_MM - (2 * MARGIN_MM);
  const availableHeight = A4_HEIGHT_MM - (2 * MARGIN_MM) - 15; // Reservando espaço para cabeçalho
  
  const cardsPerRow = Math.floor((availableWidth + SPACING_MM) / (CARD_WIDTH_MM + SPACING_MM));
  const rowsPerPage = Math.floor((availableHeight + SPACING_MM) / (CARD_HEIGHT_MM + SPACING_MM));
  const cardsPerPage = cardsPerRow * rowsPerPage;

  console.log(`Layout calculation:
    Available width: ${availableWidth}mm
    Available height: ${availableHeight}mm
    Cards per row: ${cardsPerRow}
    Rows per page: ${rowsPerPage}
    Cards per page: ${cardsPerPage}`);

  // Create expanded card list with quantities
  const expandedCards: Array<{ name: string; imageUrl: string; id: string }> = [];
  deck.cards.forEach(deckCard => {
    for (let i = 0; i < deckCard.quantity; i++) {
      expandedCards.push({
        name: deckCard.card.name,
        imageUrl: deckCard.card.image_uris?.normal || '/placeholder.svg',
        id: `${deckCard.card.id}_${i}`
      });
    }
  });

  const totalPages = Math.ceil(expandedCards.length / cardsPerPage);

  // Create print window
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita pop-ups para imprimir o deck.');
    return;
  }

  const printContent = generatePrintHTML(deck, expandedCards, cardsPerRow, rowsPerPage, cardsPerPage);
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  // Wait for images to load before printing
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 1000);
  };
};

const generatePrintHTML = (
  deck: Deck, 
  expandedCards: Array<{ name: string; imageUrl: string; id: string }>,
  cardsPerRow: number,
  rowsPerPage: number,
  cardsPerPage: number
) => {
  const totalPages = Math.ceil(expandedCards.length / cardsPerPage);
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Impressão do Deck - ${deck.name}</title>
      <style>
        @page {
          size: A4;
          margin: ${MARGIN_MM}mm;
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background: white;
        }
        
        .page {
          width: ${A4_WIDTH_MM - (2 * MARGIN_MM)}mm;
          height: ${A4_HEIGHT_MM - (2 * MARGIN_MM)}mm;
          page-break-after: always;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        
        .page:last-child {
          page-break-after: avoid;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 5mm;
          font-size: 10pt;
          font-weight: bold;
          height: 10mm;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .cards-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(${cardsPerRow}, ${CARD_WIDTH_MM}mm);
          grid-template-rows: repeat(${rowsPerPage}, ${CARD_HEIGHT_MM}mm);
          gap: ${SPACING_MM}mm;
          justify-content: center;
          align-content: center;
        }
        
        .card {
          width: ${CARD_WIDTH_MM}mm;
          height: ${CARD_HEIGHT_MM}mm;
          border: 1px solid #ddd;
          border-radius: 3mm;
          overflow: hidden;
          position: relative;
          background: white;
          box-shadow: 0 1mm 2mm rgba(0,0,0,0.1);
        }
        
        .card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        
        .card-back {
          background-color: #1a1a2e;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .card-back img {
          width: 85%;
          height: 85%;
          object-fit: contain;
        }
        
        .page-info {
          position: absolute;
          bottom: 2mm;
          right: 5mm;
          font-size: 8pt;
          color: #666;
        }
        
        @media print {
          .page-info {
            display: none;
          }
        }
      </style>
    </head>
    <body>
  `;

  // Generate front pages
  for (let page = 0; page < totalPages; page++) {
    const startIndex = page * cardsPerPage;
    const endIndex = Math.min(startIndex + cardsPerPage, expandedCards.length);
    const pageCards = expandedCards.slice(startIndex, endIndex);
    
    html += `
      <div class="page">
        <div class="page-header">${deck.name} - Frente (Página ${page + 1}/${totalPages})</div>
        <div class="cards-container">
          <div class="cards-grid">
    `;
    
    // Fill the grid with cards
    for (let i = 0; i < cardsPerPage; i++) {
      if (i < pageCards.length) {
        const card = pageCards[i];
        html += `
          <div class="card">
            <img src="${card.imageUrl}" alt="${card.name}" loading="eager" />
          </div>
        `;
      } else {
        html += `<div class="card" style="visibility: hidden;"></div>`;
      }
    }
    
    html += `
          </div>
        </div>
        <div class="page-info">Cartas: ${pageCards.length}/${cardsPerPage}</div>
      </div>
    `;
  }
  return html;
};