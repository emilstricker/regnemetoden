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
      whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} 
      transition={{ duration: 0.2 }}
      className={cn("max-w-xl mx-auto", className)}
    >
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Morgenvægt
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Indtast din vægt for at komme i gang
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex gap-3">
                <Input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="text-3xl h-16 text-center font-medium"
                  placeholder="0.0"
                  autoFocus
                />
                <Button 
                  type="submit" 
                  size="lg"
                  className="h-16 px-8"
                  disabled={!weight || isNaN(parseFloat(weight))}
                >
                  Gem
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
