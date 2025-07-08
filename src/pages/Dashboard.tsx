import { FileText, Grid2x2, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PATHS } from "@/routes/paths";
import { Deck, DeckCard } from "@/types";

import Header from "../components/Layout/Header";
import { useAuth } from "../contexts/AuthContext";
import { useDeck } from "../contexts/DeckContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { decks, createDeck, deleteDeck, isLoading } = useDeck();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckName.trim()) return;

    try {
      await createDeck(newDeckName.trim(), newDeckDescription.trim() || undefined);
      setNewDeckName('');
      setNewDeckDescription('');
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Erro ao criar o deck:', error);
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (window.confirm('Tem certeza que deseja apagar esse deck?')) {
      await deleteDeck(deckId);
    }
  };

  const getTotalCards = (deck: Deck) => {
    return deck.cards.reduce((total: number, deckCard: DeckCard) => total + deckCard.quantity, 0);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado!</h1>
          <p className="text-muted-foreground mb-6">Entre para contruir seus decks!</p>
          <Button asChild>
            <Link to={PATHS.LOGIN}>Entrar</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bem vindo de volta, {user.username}!
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus decks e coleção de Magic: The Gathering
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Grid2x2 className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{decks.length}</p>
                  <p className="text-sm text-muted-foreground">Todos os Decks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {decks.reduce((total, deck) => total + getTotalCards(deck), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Todas as Cartas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-magic-gradient rounded-full"></div>
                <div>
                  <p className="text-2xl font-bold">
                    {decks.filter(deck => getTotalCards(deck) >= 60).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Decks Completos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Decks Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Meus Decks</h2>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Novo Deck</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Deck</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateDeck} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deck-name">Nome do Deck</Label>
                  <Input
                    id="deck-name"
                    placeholder="Ex: Deck Reanimar..."
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deck-description">Descrição (opcional)</Label>
                  <Textarea
                    id="deck-description"
                    placeholder="Descreva a estratégia do seu deck..."
                    value={newDeckDescription}
                    onChange={(e) => setNewDeckDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={!newDeckName.trim()}>
                    Criar Deck
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Decks Grid */}
        {decks.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🃏</div>
              <h3 className="text-xl font-semibold mb-2">Nenhum Deck Salvo :(</h3>
              <p className="text-muted-foreground mb-6">
                Crie seu primeiro baralho para começar a construir sua coleção
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Novo Deck
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => (
              <Card key={deck.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{deck.name}</CardTitle>
                      {deck.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {deck.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDeck(deck.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Número de cartas:</span>
                      <span className="font-medium">{getTotalCards(deck)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cartas únicas:</span>
                      <span className="font-medium">{deck.cards.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span className={`font-medium ${
                        getTotalCards(deck) >= 60 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {getTotalCards(deck) >= 60 ? 'Completo' : 'Em progresso'}
                      </span>
                    </div>
                    
                    <div className="pt-3 space-y-2">
                      <Button 
                        asChild 
                        className="w-full"
                      >
                        <Link to={PATHS.DECK_DETAILS(deck.id)}>
                          Editar Deck
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
