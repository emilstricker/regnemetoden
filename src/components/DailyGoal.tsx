import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface DailyGoalProps {
  targetWeight: number;
  consumedGrams: number;
  allowanceGrams: number;
}

export function DailyGoal({ targetWeight, consumedGrams, allowanceGrams }: DailyGoalProps) {
  const progress = Math.min(100, (consumedGrams / allowanceGrams) * 100);
  const remainingGrams = allowanceGrams - consumedGrams;

  return (
    <motion.div 
      whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} 
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Dagens Mål
                </h2>
                <span className="text-4xl font-bold">
                  {targetWeight.toFixed(1)} kg
                </span>
              </div>
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-center text-sm text-muted-foreground">
                  <span>
                    {consumedGrams} / {allowanceGrams}g spist.{' '}
                    <span className="text-muted-foreground/80">{remainingGrams}g tilbage</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
