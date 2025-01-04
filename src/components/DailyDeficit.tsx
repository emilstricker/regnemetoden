import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface DailyDeficitProps {
  startWeight: number;
  targetWeight: number;
  numberOfDays: number;
}

export function DailyDeficit({ startWeight, targetWeight, numberOfDays }: DailyDeficitProps) {
  // Convert kg to grams (multiply by 1000) and round to nearest whole number
  const dailyDeficitGrams = Math.round((startWeight - targetWeight) * 1000 / numberOfDays);

  return (
    <motion.div 
      whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} 
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Dagligt vægttab
            </h2>
            <div className="flex justify-between items-center">
              <span className="text-4xl font-bold text-primary tabular-nums">
                {dailyDeficitGrams}g
              </span>
              <span className="text-sm text-muted-foreground">
                per dag
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
