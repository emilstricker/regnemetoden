import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DailyGoalProps {
  targetWeight: number;
  consumedGrams: number;
  allowanceGrams: number;
  className?: string;
}

export function DailyGoal({ targetWeight, consumedGrams, allowanceGrams, className }: DailyGoalProps) {
  const progress = Math.min(100, (consumedGrams / allowanceGrams) * 100);
  const remainingGrams = allowanceGrams - consumedGrams;

  return (
    <motion.div 
      whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} 
      transition={{ duration: 0.2 }}
      className={cn("h-full", className)}
    >
      <Card className="h-full">
        <CardContent className="pt-6 h-full">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Dagens Mål
              </h2>
              <span className="text-lg font-medium text-muted-foreground">
                {targetWeight.toFixed(1)} kg
              </span>
            </div>
            
            <div className="mt-auto space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-5xl font-bold tabular-nums">
                    {remainingGrams}
                  </span>
                  <span className="text-sm ml-1 text-muted-foreground">gram tilbage</span>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  {consumedGrams} / {allowanceGrams}g spist
                </div>
              </div>

              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
