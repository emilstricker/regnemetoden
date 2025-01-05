import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion } from 'framer-motion';
import { Slider } from "@/components/ui/slider";
import { format, addDays } from 'date-fns';
import { da } from 'date-fns/locale';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SetupFormProps {
  onSubmit: (data: {
    startWeight: number;
    targetWeight: number;
    numberOfDays: number;
    startDate: string;
    weightingTime: 'tonight' | 'yesterday';
  }) => void;
  initialValues?: {
    startWeight: number;
    targetWeight: number;
    numberOfDays: number;
  };
}

const MAX_DAILY_LOSS = 0.3; // 300g per day
const MIN_DAILY_LOSS = 0.05; // 50g per day

export function SetupForm({ onSubmit, initialValues }: SetupFormProps) {
  const [startWeight, setStartWeight] = useState(initialValues?.startWeight.toString() || '');
  const [targetWeight, setTargetWeight] = useState(initialValues?.targetWeight.toString() || '');
  const [numberOfDays, setNumberOfDays] = useState<number>(initialValues?.numberOfDays || 0);
  const [weightingTime, setWeightingTime] = useState<'tonight' | 'yesterday'>('yesterday');

  // Calculate default number of days when weights change
  useEffect(() => {
    const weightToLose = parseFloat(startWeight) - parseFloat(targetWeight);
    if (!isNaN(weightToLose) && weightToLose > 0) {
      // Target 100g per day (0.1 kg)
      const targetDailyLoss = 0.1;
      const calculatedDays = Math.round(weightToLose / targetDailyLoss);
      
      // Ensure it's within min/max bounds
      const minDays = Math.ceil(weightToLose / MAX_DAILY_LOSS);
      const maxDays = Math.floor(weightToLose / MIN_DAILY_LOSS);
      
      const boundedDays = Math.min(Math.max(calculatedDays, minDays), maxDays);
      setNumberOfDays(boundedDays);
    }
  }, [startWeight, targetWeight]);

  // Auto-select based on time of day
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    setWeightingTime(hour >= 10 ? 'tonight' : 'yesterday');
  }, []);

  const { minDays, maxDays, dailyLoss } = useMemo(() => {
    const weightToLose = parseFloat(startWeight) - parseFloat(targetWeight);
    if (isNaN(weightToLose) || weightToLose <= 0) {
      return { minDays: 0, maxDays: 0, dailyLoss: 0 };
    }

    const minDays = Math.ceil(weightToLose / MAX_DAILY_LOSS);
    const maxDays = Math.floor(weightToLose / MIN_DAILY_LOSS);
    const dailyLoss = weightToLose / numberOfDays;

    return { minDays, maxDays, dailyLoss };
  }, [startWeight, targetWeight, numberOfDays]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startWeightFloat = parseFloat(startWeight);
    const targetWeightFloat = parseFloat(targetWeight);

    if (isNaN(startWeightFloat) || isNaN(targetWeightFloat)) {
      return;
    }

    if (targetWeightFloat >= startWeightFloat) {
      alert('Målvægt skal være mindre end startvægt');
      return;
    }

    // If weighing tonight, start date is today
    // If using yesterday's weight, start date is yesterday
    const startDate = new Date();
    if (weightingTime === 'yesterday') {
      startDate.setDate(startDate.getDate() - 1);
    }

    onSubmit({
      startWeight: startWeightFloat,
      targetWeight: targetWeightFloat,
      numberOfDays,
      startDate: startDate.toISOString().split('T')[0],
      weightingTime
    });
  };

  const handleDaysChange = (value: number[]) => {
    setNumberOfDays(value[0]);
  };

  const endDate = useMemo(() => {
    const startDate = new Date();
    if (weightingTime === 'yesterday') {
      startDate.setDate(startDate.getDate() - 1);
    }
    return addDays(startDate, numberOfDays);
  }, [numberOfDays, weightingTime]);

  const inputVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Opsætning</h1>
            <p className="text-lg text-muted-foreground">
              Indtast dine målsætninger for at komme i gang
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div 
              className="rounded-lg border bg-card text-card-foreground p-8"
              variants={inputVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="space-y-4">
                <Label htmlFor="weightingTime" className="text-xl font-semibold">
                  Hvornår vil du veje dig?
                </Label>
                <RadioGroup 
                  value={weightingTime} 
                  onValueChange={(value: 'tonight' | 'yesterday') => setWeightingTime(value)}
                  className="pt-2 space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="tonight" id="tonight" />
                    <Label htmlFor="tonight" className="font-medium cursor-pointer">
                      Jeg vil veje mig i aften før sengetid
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="yesterday" id="yesterday" />
                    <Label htmlFor="yesterday" className="font-medium cursor-pointer">
                      Jeg vejede mig i går aftes
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                className="rounded-lg border bg-card text-card-foreground p-8"
                variants={inputVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="space-y-4">
                  <Label htmlFor="startWeight" className="text-xl font-semibold">
                    {weightingTime === 'tonight' ? 'Din estimerede startvægt' : 'Din startvægt'}
                  </Label>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      {weightingTime === 'tonight' 
                        ? 'Du kan opdatere dette med din præcise vægt senere' 
                        : 'Din vægt fra i går aftes:'
                      }
                    </div>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-2 ml-2">
                      {weightingTime === 'tonight' ? (
                        <>
                          <li>Vej dig selv lige før sengetid</li>
                          <li>Efter dit sidste måltid og toiletbesøg</li>
                          <li>Brug den samme badevægt hver gang</li>
                        </>
                      ) : (
                        <>
                          <li>Indtast din vægt fra i går aftes</li>
                          <li>Hvis du ikke vejede dig i går, vælg "Jeg vejer mig i aften"</li>
                        </>
                      )}
                    </ul>
                    <div className="pt-2">
                      <div className="text-sm font-medium mb-2">Vægt i kg</div>
                      <Input
                        type="number"
                        id="startWeight"
                        step="0.1"
                        placeholder="F.eks. 85.5"
                        value={startWeight}
                        onChange={(e) => setStartWeight(e.target.value)}
                        className="transition-all duration-200 focus:scale-[1.02] text-lg"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="rounded-lg border bg-card text-card-foreground p-8"
                variants={inputVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="space-y-4">
                  <Label htmlFor="targetWeight" className="text-xl font-semibold">Din målvægt</Label>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Den vægt du ønsker at nå ned til
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Vælg en realistisk målvægt:
                    </div>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-2 ml-2">
                      <li>Ikke for lav - du kan altid sætte et nyt mål senere</li>
                      <li>Tænk på det som et delmål i din rejse</li>
                    </ul>
                    <div className="pt-2">
                      <div className="text-sm font-medium mb-2">Vægt i kg</div>
                      <Input
                        type="number"
                        id="targetWeight"
                        step="0.1"
                        value={targetWeight}
                        onChange={(e) => setTargetWeight(e.target.value)}
                        placeholder="F.eks. 75.0"
                        className="transition-all duration-200 focus:scale-[1.02] text-lg"
                        required
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              className="rounded-lg border bg-card text-card-foreground p-8"
              variants={inputVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="space-y-4">
                <Label htmlFor="numberOfDays" className="text-xl font-semibold">Varighed</Label>
                <div className="space-y-6">
                  {minDays > 0 && maxDays > 0 && (
                    <>
                      <div className="space-y-6">
                        <div className="flex justify-between text-sm text-muted-foreground font-medium">
                          <span>Hurtigst muligt ({minDays} dage)</span>
                          <span>Langsomt ({maxDays} dage)</span>
                        </div>
                        <Slider
                          id="numberOfDays"
                          min={minDays}
                          max={maxDays}
                          step={1}
                          value={[numberOfDays]}
                          onValueChange={handleDaysChange}
                          className="w-full"
                        />
                      </div>
                      <div className="pt-4 space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-4xl font-bold">{numberOfDays} dage</span>
                          <span className="text-sm text-muted-foreground">
                            Slut dato: {format(endDate, 'd. MMMM yyyy', { locale: da })}
                          </span>
                        </div>
                        {dailyLoss > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Dette betyder et dagligt vægttab på <span className="font-medium">{(dailyLoss * 1000).toFixed(0)}g</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {(minDays === 0 || maxDays === 0) && (
                    <div className="text-sm text-muted-foreground italic">
                      Indtast start- og målvægt for at se mulige varigheder
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={inputVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.3, delay: 0.5 }}
              className="pt-4"
            >
              <Button type="submit" className="w-full text-lg py-6 font-semibold">
                Start din rejse
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
