import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { MorningWeight } from './MorningWeight';
import { DailyGoal } from './DailyGoal';
import { DailyDeficit } from './DailyDeficit';
import { FoodEntryList } from './FoodEntryList';
import { TipDisplay } from './TipDisplay';
import { WeightInput } from './WeightInput';

interface DailyTrackingProps {
  userData: {
    startWeight: number;
    targetWeight: number;
    numberOfDays: number;
    startDate: string;
  };
  todayEntry?: {
    weight?: number;
    date?: string;
    foodEntries: { amount: number; time: string }[];
  };
  onAddWeightEntry: (weight: number) => void;
  onAddFoodEntry: (amount: number) => void;
  onRemoveFoodEntry: (index: number) => void;
  className?: string;
  currentDate: Date;
}

export function DailyTracking({ 
  userData, 
  todayEntry, 
  onAddWeightEntry,
  onAddFoodEntry,
  onRemoveFoodEntry,
  className,
  currentDate
}: DailyTrackingProps) {
  const [quickAddBuffer, setQuickAddBuffer] = useState<number[]>([]);
  const [quickAddTotal, setQuickAddTotal] = useState(0);
  const [manualInput, setManualInput] = useState("");
  const manualValue = parseFloat(manualInput);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (quickAddBuffer.length > 0) {
        const total = quickAddBuffer.reduce((a, b) => a + b, 0);
        onAddFoodEntry(total);
        setQuickAddBuffer([]);
        setQuickAddTotal(0);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [quickAddBuffer, onAddFoodEntry]);

  const handleQuickAdd = useCallback((amount: number) => {
    setQuickAddBuffer(prev => [...prev, amount]);
    setQuickAddTotal(prev => prev + amount);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      
      const amount = {
        '1': 1,
        '2': 5,
        '3': 10,
        '4': 50
      }[e.key];

      if (amount) {
        handleQuickAdd(amount);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleQuickAdd]);

  // Calculate daily target weight and food allowance
  const daysSinceStart = Math.floor(
    (currentDate.getTime() - new Date(userData.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalWeightLoss = userData.startWeight - userData.targetWeight;
  const dailyWeightLoss = totalWeightLoss / userData.numberOfDays;
  const todayTargetWeight = userData.startWeight - (dailyWeightLoss * daysSinceStart);
  
  // Calculate food allowance based on weight difference (1kg = 1000g)
  const weightDifference = todayEntry?.weight ? todayTargetWeight - todayEntry.weight : 0;
  const foodAllowanceGrams = Math.max(0, Math.round(weightDifference * 1000));
  const totalConsumed = todayEntry?.foodEntries.reduce((sum, entry) => sum + entry.amount, 0) || 0;

  if (!todayEntry?.weight) {
    return (
      <div className={cn("min-h-[80vh] flex items-center justify-center p-6", className)}>
        <WeightInput onSubmit={onAddWeightEntry} />
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-6 gap-6", className)}>
      <motion.div 
        className={cn(
          "space-y-6 col-span-4",
          !todayEntry?.foodEntries?.length ? "col-start-2" : "col-start-1"
        )}
        layout
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <TipDisplay />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:auto-rows-fr">
          <DailyGoal
            targetWeight={todayTargetWeight}
            consumedGrams={totalConsumed}
            allowanceGrams={foodAllowanceGrams}
            className="order-1 md:order-none"
          />

          <motion.div 
            whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} 
            transition={{ duration: 0.2 }}
            className="h-full order-2 md:order-none"
          >
            <Card className="h-full">
              <CardContent className="pt-6 h-full flex flex-col">
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm uppercase tracking-wide text-gray-500">Tilføj gram</Label>
                    {quickAddTotal > 0 && (
                      <span className="text-sm text-muted-foreground">
                        Buffer: {quickAddTotal}g
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <TooltipProvider>
                      {[
                        { key: '1', amount: 1 },
                        { key: '2', amount: 5 },
                        { key: '3', amount: 10 },
                        { key: '4', amount: 50 }
                      ].map(({ key, amount }) => (
                        <Tooltip key={key}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => handleQuickAdd(amount)}
                              className="h-12 text-base font-medium bg-white/50 hover:bg-blue-50/50 hover:text-blue-600 transition-all"
                            >
                              +{amount}g
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Tryk <span className="font-mono bg-gray-100 px-1 rounded">{key}</span> på tastaturet</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const value = parseFloat(manualInput);
                      if (!isNaN(value)) {
                        onAddFoodEntry(value);
                        setManualInput("");
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      name="amount"
                      type="number"
                      placeholder="±gram"
                      value={manualInput}
                      className="flex-1 h-12 text-base font-medium bg-white/50"
                      onChange={(e) => setManualInput(e.target.value)}
                    />
                    <Button 
                      type="submit"
                      className={cn(
                        "h-12 w-12 p-0 text-2xl",
                        manualValue > 0 && "bg-green-500 hover:bg-green-600",
                        manualValue < 0 && "bg-red-500 hover:bg-red-600"
                      )}
                      disabled={isNaN(manualValue) || manualValue === 0}
                    >
                      {manualValue < 0 ? '−' : '+'}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="block lg:hidden order-3">
          {todayEntry?.foodEntries && todayEntry.foodEntries.length > 0 && (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              >
                <FoodEntryList
                  entries={todayEntry.foodEntries}
                  onRemove={onRemoveFoodEntry}
                  compact
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 order-4 md:order-none">
          <MorningWeight
            weight={todayEntry?.weight}
            onEditWeight={() => {
              const newWeight = window.prompt("Indtast ny vægt (kg)", todayEntry?.weight?.toString() || "");
              if (newWeight !== null) {
                const weight = parseFloat(newWeight);
                if (!isNaN(weight)) {
                  onAddWeightEntry(weight);
                }
              }
            }}
          />
          <DailyDeficit
            startWeight={userData.startWeight}
            targetWeight={userData.targetWeight}
            numberOfDays={userData.numberOfDays}
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {todayEntry?.foodEntries && todayEntry.foodEntries.length > 0 && (
          <motion.div 
            className="col-span-2 hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            <div className="sticky top-6">
              <FoodEntryList
                entries={todayEntry.foodEntries}
                onRemove={onRemoveFoodEntry}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
