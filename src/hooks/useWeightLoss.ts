import { useState, useEffect, useCallback } from 'react';

export interface WeightLossGoal {
  startWeight: number;
  targetWeight: number;
  numberOfDays: number;
  startDate?: string;
}

export interface WeightEntry {
  date: string;
  weight: number;
  notes?: string;
  foodEntries?: Array<{
    amount: number;
    time: string;
  }>;
}

const STORAGE_KEY = 'weightLossData';

interface StoredData {
  goal: WeightLossGoal | null;
  entries: WeightEntry[];
}

export function useWeightLoss() {
  // Load initial data from localStorage
  const loadStoredData = (): StoredData => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      goal: null,
      entries: []
    };
  };

  const [weightLossGoal, setWeightLossGoal] = useState<WeightLossGoal | null>(() => loadStoredData().goal);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(() => loadStoredData().entries);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const data: StoredData = {
      goal: weightLossGoal,
      entries: weightEntries
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [weightLossGoal, weightEntries]);

  const setGoal = (goal: WeightLossGoal) => {
    const now = new Date();
    setWeightLossGoal({
      ...goal,
      startDate: now.toISOString()
    });
  };

  const addWeightEntry = useCallback((entry: { date: string; weight: number }) => {
    setWeightEntries(prev => {
      const existingIndex = prev.findIndex(e => e.date === entry.date);
      if (existingIndex >= 0) {
        const newEntries = [...prev];
        // Preserve existing food entries when updating weight
        const existingEntry = newEntries[existingIndex];
        newEntries[existingIndex] = {
          ...existingEntry,
          weight: entry.weight,
        };
        return newEntries.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      }
      return [...prev, { ...entry, foodEntries: [] }].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });
  }, []);

  const addFoodEntry = (date: string, amount: number, time: string) => {
    setWeightEntries(prev => {
      const existingIndex = prev.findIndex(e => e.date === date);
      if (existingIndex >= 0) {
        const newEntries = [...prev];
        const entry = newEntries[existingIndex];
        newEntries[existingIndex] = {
          ...entry,
          foodEntries: [...(entry.foodEntries || []), { amount, time }]
        };
        return newEntries;
      }
      return [...prev, {
        date,
        weight: 0, // This should be set when morning weight is added
        foodEntries: [{ amount, time }]
      }];
    });
  };

  const removeFoodEntry = (date: string, index: number) => {
    setWeightEntries(prev => {
      const existingIndex = prev.findIndex(e => e.date === date);
      if (existingIndex >= 0) {
        const newEntries = [...prev];
        const entry = newEntries[existingIndex];
        if (entry.foodEntries) {
          newEntries[existingIndex] = {
            ...entry,
            foodEntries: entry.foodEntries.filter((_, i) => i !== index)
          };
        }
        return newEntries;
      }
      return prev;
    });
  };

  const getEntryForDate = useCallback((date: string): WeightEntry | undefined => {
    return weightEntries.find(entry => entry.date === date);
  }, [weightEntries]);

  const calculateProgress = useCallback(() => {
    if (weightEntries.length === 0) return {
      totalLoss: 0,
      dailyAverage: 0,
      remainingWeight: weightLossGoal ? weightLossGoal.startWeight - weightLossGoal.targetWeight : 0,
      estimatedDaysRemaining: weightLossGoal ? weightLossGoal.numberOfDays : 0
    };

    const latestWeight = weightEntries[weightEntries.length - 1].weight;
    const totalLoss = weightLossGoal ? weightLossGoal.startWeight - latestWeight : 0;
    const firstEntry = weightEntries[0];
    const days = (new Date(weightEntries[weightEntries.length - 1].date).getTime() - new Date(firstEntry.date).getTime()) / (24 * 60 * 60 * 1000);
    const dailyAverage = days > 0 ? totalLoss / days : 0;
    const remainingWeight = latestWeight - (weightLossGoal ? weightLossGoal.targetWeight : 0);
    const estimatedDaysRemaining = dailyAverage > 0 ? remainingWeight / dailyAverage : 0;

    return {
      totalLoss,
      dailyAverage,
      remainingWeight,
      estimatedDaysRemaining
    };
  }, [weightEntries, weightLossGoal]);

  const getWeightTrend = useCallback(() => {
    return weightEntries.map(entry => ({
      x: new Date(entry.date),
      y: entry.weight
    }));
  }, [weightEntries]);

  const clearData = () => {
    setWeightLossGoal(null);
    setWeightEntries([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    weightLossGoal,
    weightEntries,
    setGoal,
    addWeightEntry,
    addFoodEntry,
    removeFoodEntry,
    getEntryForDate,
    calculateProgress,
    getWeightTrend,
    clearData
  };
}
