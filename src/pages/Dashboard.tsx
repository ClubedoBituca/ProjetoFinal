
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Header from '../components/Layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { useDeck } from '../contexts/DeckContext';
import { Plus, Grid2x2, FileText, Trash2 } from 'lucide-react';

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
      console.error('Error creating deck:', error);
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      await deleteDeck(deckId);
    }
  };

  const getTotalCards = (deck: any) => {
    return deck.cards.reduce((total: number, deckCard: any) => total + deckCard.quantity, 0);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">Please log in to access your dashboard.</p>
          <Button asChild>
            <Link to="/login">Login</Link>
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
            Welcome back, {user.username}!
          </h1>
          <p className="text-muted-foreground">
            Manage your Magic: The Gathering decks and collection
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
                  <p className="text-sm text-muted-foreground">Total Decks</p>
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
                  <p className="text-sm text-muted-foreground">Total Cards</p>
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
                  <p className="text-sm text-muted-foreground">Complete Decks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Decks Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">My Decks</h2>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Deck</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Deck</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateDeck} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deck-name">Deck Name</Label>
                  <Input
                    id="deck-name"
                    placeholder="Enter deck name..."
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deck-description">Description (optional)</Label>
                  <Textarea
                    id="deck-description"
                    placeholder="Describe your deck strategy..."
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
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!newDeckName.trim()}>
                    Create Deck
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
              <h3 className="text-xl font-semibold mb-2">No decks yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first deck to start building your collection
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Deck
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
                      <span>Total Cards:</span>
                      <span className="font-medium">{getTotalCards(deck)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Unique Cards:</span>
                      <span className="font-medium">{deck.cards.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span className={`font-medium ${
                        getTotalCards(deck) >= 60 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {getTotalCards(deck) >= 60 ? 'Complete' : 'In Progress'}
                      </span>
                    </div>
                    
                    <div className="pt-3 space-y-2">
                      <Button 
                        asChild 
                        className="w-full"
                      >
                        <Link to={`/deck/${deck.id}`}>
                          View & Edit Deck
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
