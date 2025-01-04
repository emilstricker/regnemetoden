import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FoodEntryListProps {
  entries: { amount: number; time: string }[];
  onRemove: (index: number) => void;
}

export function FoodEntryList({ entries, onRemove }: FoodEntryListProps) {
  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <motion.div 
      whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} 
      transition={{ duration: 0.2 }}
      className="h-[454px]"
    >
      <Card className="h-full">
        <CardContent className="pt-6 h-full flex flex-col">
          <div className="space-y-2 flex-1 min-h-0">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Dagens Indtag
            </h2>
            <div className="flex justify-between items-center">
              <span className="text-4xl font-bold">
                {total}g
              </span>
            </div>
            <ScrollArea className="h-[334px] pr-4">
              <AnimatePresence mode="popLayout">
                {entries
                  .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                  .map((entry, index) => (
                    <motion.div
                      key={entry.time}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/50 shadow-sm cursor-pointer mb-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className={entry.amount > 0 ? "text-green-600" : "text-red-600"}>
                          {entry.amount > 0 ? "+" : "−"}{Math.abs(entry.amount)}g
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(entry.time), "HH:mm", { locale: da })}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(index)}
                        className="hover:text-red-600"
                      >
                        ×
                      </Button>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
