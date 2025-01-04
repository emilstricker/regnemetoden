import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getRandomTip } from '@/data/tips';
import { LightbulbIcon, ArrowRightIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TipDisplayProps {
  language?: 'en' | 'da';
  category?: string;
}

export const TipDisplay = ({ language = 'da', category }: TipDisplayProps) => {
  const [tip, setTip] = useState(getRandomTip(language, category));

  // Change tip every 24 hours
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      setTip(getRandomTip(language, category));
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, [language, category]);

  const handleNextTip = () => {
    setTip(getRandomTip(language, category));
  };

  if (!tip) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tip.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
        transition={{ duration: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <LightbulbIcon className="h-4 w-4" />
              Dagens tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{tip.title}</h3>
              <p className="text-muted-foreground">{tip.description}</p>
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextTip}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Næste tip
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
