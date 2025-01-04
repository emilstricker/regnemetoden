import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface GramLoggerProps {
  onSubmit: (amount: number) => void;
  className?: string;
}

export function GramLogger({ onSubmit, className }: GramLoggerProps) {
  const [foodAmount, setFoodAmount] = useState<string>('');

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodAmount) return;

    const amount = parseInt(foodAmount);
    if (isNaN(amount)) return;

    onSubmit(amount);
    setFoodAmount('');
  };

  const handleQuickAdd = (amount: number) => {
    onSubmit(amount);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Tilføj gram</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Add Section */}
        <div className="space-y-4">
          <Label className="text-sm uppercase tracking-wide text-gray-500">Hurtig tilføj</Label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { key: '1', amount: 1 },
              { key: '2', amount: 5 },
              { key: '3', amount: 10 },
              { key: '4', amount: 50 }
            ].map(({ key, amount }) => (
              <Button
                key={key}
                variant="outline"
                onClick={() => handleQuickAdd(amount)}
                className="h-12 text-lg font-medium bg-white/50 hover:bg-blue-50/50 hover:text-blue-600 transition-all"
              >
                +{amount}g
              </Button>
            ))}
          </div>
        </div>

        {/* Manual Add Section */}
        <div className="space-y-4">
          <Label className="text-sm uppercase tracking-wide text-gray-500">Manuel tilføj</Label>
          <form onSubmit={handleAddFood} className="flex gap-2">
            <Input
              type="number"
              value={foodAmount}
              onChange={(e) => setFoodAmount(e.target.value)}
              placeholder="Indtast gram..."
              className="flex-1 bg-white/50"
            />
            <Button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Tilføj
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
