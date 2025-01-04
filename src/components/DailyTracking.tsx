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
import { EditWeight } from './EditWeight';
import { MorningWeight } from './MorningWeight';
import { DailyGoal } from './DailyGoal';
import { DailyDeficit } from './DailyDeficit';
import { FoodEntryList } from './FoodEntryList';

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
  const [isEditingWeight, setIsEditingWeight] = useState(!todayEntry?.weight);
  const [quickAddBuffer, setQuickAddBuffer] = useState<number[]>([]);
  const [quickAddTotal, setQuickAddTotal] = useState(0);
  const [manualInput, setManualInput] = useState("");

  const QUICK_ADD_TIMEOUT = 2000; // 2 seconds

  // Calculate days since start
  const startDate = new Date(userData.startDate || new Date().toISOString());
  const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const dailyWeightLoss = (userData.startWeight - userData.targetWeight) / userData.numberOfDays;
  const todayTargetWeight = userData.startWeight - (dailyWeightLoss * daysSinceStart);
  const totalConsumed = todayEntry?.foodEntries?.reduce((sum, entry) => sum + entry.amount, 0) || 0;
  const foodAllowanceGrams = todayEntry?.weight ? Math.round((todayTargetWeight - todayEntry.weight) * 1000) : 0;

  useEffect(() => {
    setIsEditingWeight(!todayEntry?.weight);
  }, [todayEntry?.weight]);

  useEffect(() => {
    if (todayEntry?.weight && todayTargetWeight) {
      setQuickAddTotal(0);
      setQuickAddBuffer([]);
    }
  }, [todayEntry?.weight, todayTargetWeight]);

  useEffect(() => {
    const total = quickAddBuffer.reduce((sum, num) => sum + num, 0);
    setQuickAddTotal(total);
  }, [quickAddBuffer]);

  const submitQuickAdd = useCallback(() => {
    if (quickAddTotal > 0) {
      onAddFoodEntry(quickAddTotal);
      setQuickAddBuffer([]);
      setQuickAddTotal(0);
    }
  }, [quickAddTotal, onAddFoodEntry]);

  useEffect(() => {
    const timer = setTimeout(() => {
      submitQuickAdd();
    }, QUICK_ADD_TIMEOUT);

    return () => clearTimeout(timer);
  }, [quickAddBuffer, submitQuickAdd]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!todayEntry?.weight) return; 
      if (event.target instanceof HTMLInputElement) return;
      
      switch (event.key) {
        case '1':
          handleQuickAdd(1);
          break;
        case '2':
          handleQuickAdd(5);
          break;
        case '3':
          handleQuickAdd(10);
          break;
        case '4':
          handleQuickAdd(50);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [todayEntry?.weight]);

  const handleQuickAdd = (amount: number) => {
    setQuickAddBuffer(prev => [...prev, amount]);
  };

  const manualValue = parseFloat(manualInput);

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6", className)}>
      <div className={cn(
        "space-y-6",
        todayEntry?.foodEntries && todayEntry.foodEntries.length > 0 
          ? "lg:col-span-2" 
          : "lg:col-span-3"
      )}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MorningWeight
            weight={todayEntry?.weight}
            onEditWeight={() => setIsEditingWeight(true)}
          />
          <DailyDeficit
            startWeight={userData.startWeight}
            targetWeight={userData.targetWeight}
            numberOfDays={userData.numberOfDays}
          />
        </div>

        {(!todayEntry?.weight || isEditingWeight) && (
          <EditWeight
            onSubmit={(weight) => {
              onAddWeightEntry(weight);
              setIsEditingWeight(false);
            }}
            onCancel={() => setIsEditingWeight(false)}
            initialWeight={todayEntry?.weight}
          />
        )}

        <DailyGoal
          targetWeight={todayTargetWeight}
          consumedGrams={totalConsumed}
          allowanceGrams={foodAllowanceGrams}
        />

        <motion.div 
          whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} 
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Label className="text-sm uppercase tracking-wide text-gray-500">Tilføj gram</Label>
                <div className="flex flex-col gap-4 md:flex-row">
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
                    className="flex items-center gap-2 md:flex-[2]"
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
                {quickAddTotal > 0 && (
                  <div className="text-center text-sm text-muted-foreground">
                    Buffer: {quickAddTotal}g
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {todayEntry?.foodEntries && todayEntry.foodEntries.length > 0 && (
        <AnimatePresence>
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            <FoodEntryList 
              entries={todayEntry.foodEntries} 
              onRemove={onRemoveFoodEntry}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
