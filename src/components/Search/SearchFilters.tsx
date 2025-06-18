
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import type { SearchFilters } from '../../types';

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

const COLORS = [
  { id: 'W', name: 'White', symbol: '⚪' },
  { id: 'U', name: 'Blue', symbol: '🔵' },
  { id: 'B', name: 'Black', symbol: '⚫' },
  { id: 'R', name: 'Red', symbol: '🔴' },
  { id: 'G', name: 'Green', symbol: '🟢' },
];

const RARITIES = [
  { value: 'any', label: 'Any Rarity' },
  { value: 'common', label: 'Common' },
  { value: 'uncommon', label: 'Uncommon' },
  { value: 'rare', label: 'Rare' },
  { value: 'mythic', label: 'Mythic' },
];

const TYPES = [
  'Creature',
  'Instant',
  'Sorcery',
  'Artifact',
  'Enchantment',
  'Planeswalker',
  'Land',
];

export default function SearchFilters({ filters, onFiltersChange, onSearch, isLoading }: SearchFiltersProps) {
  const updateFilters = (updates: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const handleColorToggle = (colorId: string) => {
    const newColors = filters.colors.includes(colorId)
      ? filters.colors.filter(c => c !== colorId)
      : [...filters.colors, colorId];
    updateFilters({ colors: newColors });
  };

  const resetFilters = () => {
    onFiltersChange({
      name: '',
      colors: [],
      type: '',
      rarity: 'any',
      set: '',
      cmc: null,
      minCmc: null,
      maxCmc: null,
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Search Filters</h2>
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      {/* Card Name */}
      <div className="space-y-2">
        <Label htmlFor="card-name">Card Name</Label>
        <Input
          id="card-name"
          placeholder="Enter card name..."
          value={filters.name}
          onChange={(e) => updateFilters({ name: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <Label>Colors</Label>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((color) => (
            <div key={color.id} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color.id}`}
                checked={filters.colors.includes(color.id)}
                onCheckedChange={() => handleColorToggle(color.id)}
              />
              <Label 
                htmlFor={`color-${color.id}`}
                className="flex items-center space-x-1 cursor-pointer"
              >
                <span>{color.symbol}</span>
                <span>{color.name}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label htmlFor="card-type">Card Type</Label>
        <Select value={filters.type} onValueChange={(value) => updateFilters({ type: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select type..." />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="any">Any Type</SelectItem>
            {TYPES.map((type) => (
              <SelectItem key={type} value={type.toLowerCase()}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rarity */}
      <div className="space-y-2">
        <Label htmlFor="rarity">Rarity</Label>
        <Select value={filters.rarity} onValueChange={(value) => updateFilters({ rarity: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {RARITIES.map((rarity) => (
              <SelectItem key={rarity.value} value={rarity.value}>
                {rarity.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Set */}
      <div className="space-y-2">
        <Label htmlFor="set">Set Code</Label>
        <Input
          id="set"
          placeholder="e.g., DOM, GRN, RNA..."
          value={filters.set}
          onChange={(e) => updateFilters({ set: e.target.value })}
        />
      </div>

      {/* Mana Cost */}
      <div className="space-y-3">
        <Label>Mana Cost (CMC)</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="min-cmc" className="text-sm text-muted-foreground">Min</Label>
            <Input
              id="min-cmc"
              type="number"
              min="0"
              placeholder="0"
              value={filters.minCmc ?? ''}
              onChange={(e) => updateFilters({ 
                minCmc: e.target.value ? parseInt(e.target.value) : null 
              })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="max-cmc" className="text-sm text-muted-foreground">Max</Label>
            <Input
              id="max-cmc"
              type="number"
              min="0"
              placeholder="20"
              value={filters.maxCmc ?? ''}
              onChange={(e) => updateFilters({ 
                maxCmc: e.target.value ? parseInt(e.target.value) : null 
              })}
            />
          </div>
        </div>
      </div>

      {/* Search Button */}
      <Button 
        onClick={onSearch} 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? 'Searching...' : 'Search Cards'}
      </Button>
    </Card>
  );
}
