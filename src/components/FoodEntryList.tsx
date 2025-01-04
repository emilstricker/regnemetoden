import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface FoodEntry {
  amount: number;
  time: string;
}

interface FoodEntryListProps {
  entries: FoodEntry[];
  onRemove: (index: number) => void;
  compact?: boolean;
  className?: string;
}

export function FoodEntryList({ entries, onRemove, compact, className }: FoodEntryListProps) {
  // Calculate dynamic height based on number of entries (for mobile)
  const headerHeight = 56; // Height of the header including margins
  const entryHeight = 72; // Height of a single entry
  const entryMargin = 8; // Margin between entries
  const totalEntryHeight = entries.length * (entryHeight + entryMargin);
  const maxMobileHeight = 400;
  const minHeight = 140; // Minimum height for the card
  
  const dynamicHeight = Math.max(
    minHeight,
    Math.min(headerHeight + totalEntryHeight, maxMobileHeight)
  );
  
  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <motion.div 
      whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} 
      transition={{ duration: 0.2 }}
      className={className}
      layout
    >
      <Card>
        <CardContent className={cn(
          "pt-6 flex flex-col",
          !compact && "h-[510px]"
        )}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Dagens Indtag
            </h2>
            <span className="text-4xl font-bold">
              {total}g
            </span>
          </div>

          <ScrollArea className={cn(
            "pr-4",
            "transition-[height] duration-300 ease-in-out",
            !compact && "h-[calc(100%-5rem)]",
            entries.length <= 4 && "lg:!h-auto"
          )} style={{ 
            height: compact ? `${dynamicHeight - headerHeight}px` : undefined 
          }}>
            <div className="space-y-2">
              <AnimatePresence mode="wait" initial={false}>
                {entries
                  .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                  .map((entry, index) => (
                    <motion.div
                      key={entry.time}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                    >
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
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
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
