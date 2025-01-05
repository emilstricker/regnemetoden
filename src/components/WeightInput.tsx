import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WeightInputProps {
  onSubmit: (weight: number) => void;
  className?: string;
}

export function WeightInput({ onSubmit, className }: WeightInputProps) {
  const [weight, setWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(weight);
    if (!isNaN(value)) {
      onSubmit(value);
      setWeight('');
    }
  };

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn("w-full max-w-[240px]", className)}
    >
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="text-4xl h-20 text-center font-medium"
              placeholder="0.0"
              autoFocus
            />
            <Button 
              type="submit" 
              size="lg"
              className="w-full h-12 text-lg"
              disabled={!weight || isNaN(parseFloat(weight))}
            >
              Gem vægt
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
