import { useState, useEffect } from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import { da } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import './styles/globals.css';
import { motion } from 'framer-motion';
import { LoadingSpinner } from './components/LoadingSpinner';
import { 
  WeightLossGoal, 
  DayEntry,
  saveWeightLossGoal,
  saveDayEntry,
  signOutUser,
  onWeightLossGoalChange,
  onDayEntriesChange,
  savePendingGoal
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
import { SetupForm } from './components/SetupForm';
import { DailyTracking } from './components/DailyTracking';
import { getCurrentDate, getCurrentDayStart, setCurrentDate } from './lib/date';

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
      if (user) {
        setIsLoading(false);
      }
    });

    const unsubscribeEntries = onDayEntriesChange(user.uid, (entries) => {
      setDayEntries(entries);
      if (user) {
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeGoal();
      unsubscribeEntries();
    };
  }, [user]);

  useEffect(() => {
    if (isDevelopment && dateOffset !== 0) {
      const newDate = addDays(new Date('2025-01-05T19:07:53+01:00'), dateOffset);
      setCurrentDate(newDate);
    }
  }, [dateOffset]);

  // Get or create today's entry
  const currentDayStart = getCurrentDayStart();
  const currentDayEntry = dayEntries.find(entry => 
    startOfDay(new Date(entry.date)).toISOString() === currentDayStart
  ) || {
    date: currentDayStart,
    weight: undefined,
    foodEntries: []
  };

  const handleAddDayEntry = async (weight: number) => {
    if (!user) return;

    try {
      await saveDayEntry(user.uid, {
        ...currentDayEntry,
        weight,
        date: currentDayStart,
        foodEntries: currentDayEntry.foodEntries || []
      });
    } catch (error) {
      console.error('Error saving day entry:', error);
    }
  };

  const handleAddFoodEntry = async (amount: number) => {
    if (!user) return;

    try {
      const updatedEntry = {
        ...currentDayEntry,
        date: currentDayStart,
        weight: currentDayEntry.weight,
        foodEntries: [
          ...(currentDayEntry.foodEntries || []),
          { amount, time: new Date().toISOString() }
        ]
      };
      
      await saveDayEntry(user.uid, updatedEntry);
    } catch (error) {
      console.error('Error adding food entry:', error);
    }
  };

  const handleRemoveFoodEntry = async (index: number) => {
    if (!user) return;

    try {
      const updatedEntry = {
        ...currentDayEntry,
        date: currentDayStart,
        weight: currentDayEntry.weight,
        foodEntries: currentDayEntry.foodEntries.filter((_, i) => i !== index)
      };
      
      await saveDayEntry(user.uid, updatedEntry);
    } catch (error) {
      console.error('Error removing food entry:', error);
    }
  };

  const handleSetupSubmit = async (data: {
    startWeight: number;
    targetWeight: number;
    numberOfDays: number;
    startDate: string;
    weightingTime: 'tonight' | 'yesterday';
  }) => {
    if (!user) return;

    try {
      if (data.weightingTime === 'tonight') {
        await savePendingGoal(user.uid, {
          startWeight: 0,
          targetWeight: data.targetWeight,
          numberOfDays: data.numberOfDays,
          startDate: data.startDate,
          weightingTime: data.weightingTime,
          isWeightSaved: false
        });
      } else {
        await saveWeightLossGoal(user.uid, {
          startWeight: data.startWeight,
          targetWeight: data.targetWeight,
          numberOfDays: data.numberOfDays,
          startDate: data.startDate
        });
      }
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleResetPlan = async () => {
    if (!user) return;

    try {
      // Clear the weight loss goal
      await setDoc(doc(db, 'users', user.uid), { 
        weightLossGoal: null,
        pendingGoal: null,
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

  // Show loading spinner while initializing
  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If not logged in, show login form
  if (!user) {
    return <Auth />;
  }

  // Show setup form if no goal exists
  if (!weightLossGoal) {
    return (
      <div className="min-h-screen bg-[url('/src/styles/background.jpg')] bg-cover bg-center bg-fixed font-sans antialiased">
        <Header 
          onResetPlan={handleResetPlan} 
          onSignOut={handleSignOut} 
        />
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
          <SetupForm onSubmit={handleSetupSubmit} />
        </div>
      </div>
    );
  }

  // Show dashboard
  return (
    <div className="min-h-screen bg-[url('/src/styles/background.jpg')] bg-cover bg-center bg-fixed font-sans antialiased">
      <Header 
        onResetPlan={handleResetPlan} 
        onSignOut={handleSignOut} 
      />
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
                  {format(getCurrentDate(), 'EEEE d. MMMM', { locale: da })}
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
              </div>
            </div>
          </motion.div>
        )}

        <DailyTracking
          userData={weightLossGoal}
          todayEntry={currentDayEntry}
          onAddWeightEntry={handleAddDayEntry}
          onAddFoodEntry={handleAddFoodEntry}
          onRemoveFoodEntry={handleRemoveFoodEntry}
          currentDate={getCurrentDate()}
        />
      </main>
    </div>
  );
}

export default App;
