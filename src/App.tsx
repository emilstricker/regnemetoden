import { useState, useEffect } from 'react';
import { SetupForm } from './components/SetupForm';
import { DailyTracking } from './components/DailyTracking';
import { format, addDays, startOfDay } from 'date-fns';
import { da } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import './styles/globals.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  WeightLossGoal, 
  DayEntry,
  saveWeightLossGoal,
  saveDayEntry,
  signOutUser,
  onWeightLossGoalChange,
  onDayEntriesChange
} from './lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from './lib/firebase';
import { Auth } from './components/Auth';
import { useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';

const isDevelopment = process.env.NODE_ENV === 'development';

function App() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [weightLossGoal, setWeightLossGoal] = useState<WeightLossGoal | null>(null);
  const [dayEntries, setDayEntries] = useState<DayEntry[]>([]);
  const [dateOffset, setDateOffset] = useState(0);
  const [isDevHeaderExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const unsubscribeGoal = onWeightLossGoalChange(user.uid, (goal) => {
      setWeightLossGoal(goal);
      setIsLoading(false);
    });

    const unsubscribeEntries = onDayEntriesChange(user.uid, (entries) => {
      setDayEntries(entries);
      setIsLoading(false);
    });

    return () => {
      unsubscribeGoal();
      unsubscribeEntries();
    };
  }, [user]);

  const currentDate = addDays(new Date(), dateOffset);
  const currentDayStart = startOfDay(currentDate).toISOString();
  const currentDayEntry = dayEntries.find(entry => 
    startOfDay(new Date(entry.date)).toISOString() === currentDayStart
  );

  const handleWeightUpdate = async (weight: number) => {
    if (!user) return;

    try {
      const newEntry: DayEntry = {
        ...(currentDayEntry || { foodEntries: [], date: currentDayStart }),
        weight,
        date: currentDayStart
      };
      
      await saveDayEntry(user.uid, newEntry);
    } catch (error) {
      console.error('Error saving weight:', error);
    }
  };

  const handleFoodEntry = async (amount: number) => {
    if (!user) return;

    try {
      const newEntry: DayEntry = {
        ...(currentDayEntry || { foodEntries: [], date: currentDayStart }),
        foodEntries: [
          ...(currentDayEntry?.foodEntries || []),
          { amount, time: new Date().toISOString() }
        ],
        date: currentDayStart
      };

      await saveDayEntry(user.uid, newEntry);
    } catch (error) {
      console.error('Error saving food entry:', error);
    }
  };

  const handleGoalUpdate = async (goal: Omit<WeightLossGoal, 'startDate'>) => {
    if (!user) return;

    try {
      const goalWithDate: WeightLossGoal = {
        ...goal,
        startDate: new Date().toISOString()
      };
      
      await saveWeightLossGoal(user.uid, goalWithDate);
    } catch (error) {
      console.error('Error saving weight loss goal:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setWeightLossGoal(null);
      setDayEntries([]);
      setDateOffset(0);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleRemoveFood = async (index: number) => {
    if (!user || !currentDayEntry) return;

    try {
      const newFoodEntries = [...currentDayEntry.foodEntries];
      newFoodEntries.splice(index, 1);

      const newEntry: DayEntry = {
        ...currentDayEntry,
        foodEntries: newFoodEntries,
        date: currentDayStart
      };

      await saveDayEntry(user.uid, newEntry);
    } catch (error) {
      console.error('Error removing food entry:', error);
    }
  };

  const handleResetPlan = async () => {
    if (!user) return;

    try {
      // Clear the weight loss goal
      await setDoc(doc(db, 'users', user.uid), { 
        weightLossGoal: null,
        updatedAt: Timestamp.now()
      }, { merge: true });

      // Delete all day entries
      const dayEntriesRef = collection(db, 'users', user.uid, 'dayEntries');
      const snapshot = await getDocs(dayEntriesRef);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      // Reset local state
      setWeightLossGoal(null);
      setDayEntries([]);
    } catch (error) {
      console.error('Error resetting plan:', error);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[url('/src/styles/background.jpg')] bg-cover bg-center bg-fixed font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[url('/src/styles/background.jpg')] bg-cover bg-center bg-fixed font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center p-4">
          <Auth />
        </div>
      </div>
    );
  }

  if (!weightLossGoal) {
    return (
      <div className="min-h-screen bg-[url('/src/styles/background.jpg')] bg-cover bg-center bg-fixed font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center p-4">
          <SetupForm onSubmit={handleGoalUpdate} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/src/styles/background.jpg')] bg-cover bg-center bg-fixed font-sans antialiased">
      <Header onResetPlan={handleResetPlan} />
      <main className="container mx-auto p-4 space-y-4">
        {isDevelopment && isDevHeaderExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          >
            <div className="container flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDateOffset(prev => prev - 1)}
                  disabled={dateOffset <= 1}
                >
                  ←
                </Button>
                <span className="text-sm">
                  {format(currentDate, 'EEEE d. MMMM', { locale: da })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDateOffset(prev => prev + 1)}
                >
                  →
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDateOffset(0)}
                  disabled={dateOffset === 0}
                >
                  I dag
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                >
                  Log ud
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <DailyTracking
              userData={weightLossGoal}
              todayEntry={currentDayEntry || { foodEntries: [], date: currentDayStart }}
              onAddWeightEntry={handleWeightUpdate}
              onAddFoodEntry={handleFoodEntry}
              onRemoveFoodEntry={handleRemoveFood}
              currentDate={currentDate}
              className="order-1 lg:order-none"
            />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
