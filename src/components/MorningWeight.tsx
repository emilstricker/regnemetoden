import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface MorningWeightProps {
  weight?: number;
  onEditWeight: () => void;
}

export function MorningWeight({ weight, onEditWeight }: MorningWeightProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} 
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Morgenvægt
            </h2>
            <div className="flex justify-between items-center">
              <span className="text-4xl font-bold">
                {weight ? `${weight.toFixed(1)} kg` : '-- kg'}
              </span>
              <Button 
                variant="ghost" 
                className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                onClick={onEditWeight}
              >
                Ret vægt
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
