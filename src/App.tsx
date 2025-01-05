import { useState, useEffect } from 'react';
import { SetupForm } from './components/SetupForm';
import { DailyTracking } from './components/DailyTracking';
import { format, addDays, startOfDay } from 'date-fns';
import { da } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import './styles/globals.css';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from './components/LoadingSpinner';
import { DayZeroGuide } from './components/DayZeroGuide';
import { 
  WeightLossGoal, 
  DayEntry,
  saveWeightLossGoal,
  saveDayEntry,
  signOutUser,
  onWeightLossGoalChange,
  onDayEntriesChange,
  savePendingGoal,
  onPendingGoalChange,
  clearUserSetupData
} from './lib/firebase';
import { collection, doc, getDocs, setDoc, writeBatch, Timestamp, } from 'firebase/firestore';
import { db } from './lib/firebase';
import { Auth } from './components/Auth';
import { useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';

const isDevelopment = process.env.NODE_ENV === 'development';

function App() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [weightLossGoal, setWeightLossGoal] = useState<WeightLossGoal | null>(null);
  const [pendingGoal, setPendingGoal] = useState<WeightLossGoal | null>(null);
  const [dayEntries, setDayEntries] = useState<DayEntry[]>([]);
  const [dateOffset, setDateOffset] = useState(0);
  const [isDevHeaderExpanded] = useState(true);
  const [isDataInitialized, setIsDataInitialized] = useState(false);
  const [showDayZeroGuide, setShowDayZeroGuide] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsDataInitialized(true);
      return;
    }

    let goalLoaded = false;
    let entriesLoaded = false;
    let pendingLoaded = false;

    const unsubscribeGoal = onWeightLossGoalChange(user.uid, (goal) => {
      setWeightLossGoal(goal);
      goalLoaded = true;
      if (goalLoaded && entriesLoaded && pendingLoaded) {
        setIsDataInitialized(true);
      }
    });

    const unsubscribeEntries = onDayEntriesChange(user.uid, (entries) => {
      setDayEntries(entries);
      entriesLoaded = true;
      if (goalLoaded && entriesLoaded && pendingLoaded) {
        setIsDataInitialized(true);
      }
    });

    const unsubscribePending = onPendingGoalChange(user.uid, (pending) => {
      setPendingGoal(pending);
      pendingLoaded = true;
      if (goalLoaded && entriesLoaded && pendingLoaded) {
        setIsDataInitialized(true);
      }
    });

    return () => {
      unsubscribeGoal();
      unsubscribeEntries();
      unsubscribePending();
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

  const handleSetupSubmit = async (data: {
    startWeight: number;
    targetWeight: number;
    numberOfDays: number;
    startDate: string;
    weightingTime: 'tonight' | 'yesterday';
  }) => {
    if (!user) return;

    try {
      const goal: WeightLossGoal = {
        startWeight: data.startWeight,
        targetWeight: data.targetWeight,
        numberOfDays: data.numberOfDays,
        startDate: data.startDate,
        weightingTime: data.weightingTime
      };

      if (data.weightingTime === 'tonight') {
        await savePendingGoal(user.uid, goal);
      } else {
        await saveWeightLossGoal(user.uid, goal);
      }
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleDayZeroComplete = async () => {
    if (!user || !pendingGoal) return;
    try {
      // Save the goal but don't clear the pending goal yet
      // The user needs to come back tomorrow to start
      await saveWeightLossGoal(user.uid, pendingGoal);
    } catch (error) {
      console.error('Error saving goal after day zero:', error);
    }
  };

  const handleDayZeroBack = async () => {
    if (!user) return;
    try {
      // Clear all setup data when going back
      await clearUserSetupData(user.uid);
    } catch (error) {
      console.error('Error clearing setup data:', error);
    }
  };

  const handleDayZeroUpdatePlan = async (actualWeight: number) => {
    if (!pendingGoal) return;
    setPendingGoal({
      ...pendingGoal,
      startWeight: actualWeight
    });
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

  if (!isDataInitialized || isAuthLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Auth />
      </div>
    );
  }

  // Show day zero guide if there's a pending goal
  if (pendingGoal?.weightingTime === 'tonight') {
    return (
      <div className="min-h-screen bg-[url('/src/styles/background.jpg')] bg-cover bg-center bg-fixed font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center p-4">
          <DayZeroGuide 
            onComplete={handleDayZeroComplete}
            onBack={handleDayZeroBack}
            estimatedWeight={pendingGoal.startWeight}
            isWeightSaved={pendingGoal.isWeightSaved}
          />
        </div>
      </div>
    );
  }

  if (!weightLossGoal) {
    return (
      <div className="min-h-screen bg-[url('/src/styles/background.jpg')] bg-cover bg-center bg-fixed font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center p-4">
          <SetupForm onSubmit={handleSetupSubmit} />
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
