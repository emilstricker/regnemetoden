import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion } from 'framer-motion';
import { Slider } from "@/components/ui/slider";
import { format, addDays } from 'date-fns';
import { da } from 'date-fns/locale';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"

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
  const [numberOfDays, setNumberOfDays] = useState<number>(initialValues?.numberOfDays || 30);
  const [weightingTime, setWeightingTime] = useState<'tonight' | 'yesterday'>('yesterday');

  // Calculate weight-based values
  const startWeightNum = parseFloat(startWeight);
  const targetWeightNum = parseFloat(targetWeight);
  const weightDiff = startWeightNum - targetWeightNum;
  
  // Calculate min and max days
  // Max weight loss per day is 300g (0.3kg)
  // Min weight loss per day is 50g (0.05kg)
  const minDays = weightDiff > 0 ? Math.ceil(weightDiff / 0.3) : 0; // 300g per day max
  const maxDays = weightDiff > 0 ? Math.ceil(weightDiff / 0.05) : 0; // 50g per day min
  
  // Calculate daily loss in grams
  const dailyLoss = weightDiff > 0 ? (weightDiff / numberOfDays) : 0;

  // Calculate end date
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = addDays(startDate, numberOfDays);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weightingTime === 'tonight') {
      onSubmit({
        startWeight: 0,
        targetWeight: 0,
        numberOfDays: 0,
        startDate: startDate.toISOString().split('T')[0],
        weightingTime
      });
      return;
    }

    const startWeightNum = parseFloat(startWeight);
    const targetWeightNum = parseFloat(targetWeight);

    if (isNaN(startWeightNum) || isNaN(targetWeightNum)) {
      return;
    }

    onSubmit({
      startWeight: startWeightNum,
      targetWeight: targetWeightNum,
      numberOfDays,
      startDate: startDate.toISOString().split('T')[0],
      weightingTime
    });
  };

  const handleDaysChange = (value: number[]) => {
    setNumberOfDays(value[0]);
  };

  const inputVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
  };

  // Auto-select based on time of day
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    setWeightingTime(hour >= 10 ? 'tonight' : 'yesterday');
  }, []);

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
                  Vejede du dig i går aftes?
                </Label>
                <RadioGroup 
                  value={weightingTime} 
                  onValueChange={(value: 'tonight' | 'yesterday') => {
                    console.log('Weighting time changed to:', value);
                    setWeightingTime(value);
                  }}
                  className="pt-2 space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="yesterday" id="yes" />
                    <Label htmlFor="yes" className="font-medium cursor-pointer">
                      Ja, jeg vejede mig i går aftes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="tonight" id="no" />
                    <Label htmlFor="no" className="font-medium cursor-pointer">
                      Nej, jeg har ikke vejet mig endnu
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </motion.div>

            {weightingTime === 'tonight' ? (
              <motion.div
                variants={inputVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                      Vej dig i aften og kom tilbage i morgen
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      For at komme i gang skal du:
                    </p>
                    <ul className="text-muted-foreground list-disc list-inside space-y-2">
                      <li>Veje dig selv i aften lige før sengetid</li>
                      <li>Kom tilbage i morgen og indtast din vægt</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <>
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
                        Din startvægt
                      </Label>
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                          Din vægt fra i går aftes:
                        </div>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-2 ml-2">
                          <li>Indtast din vægt fra i går aftes</li>
                          <li>Hvis du ikke vejede dig i går, vælg "Nej" ovenfor</li>
                        </ul>
                        <div className="pt-2">
                          <div className="text-sm font-medium mb-2">Vægt i kg</div>
                          <Input
                            type="number"
                            id="startWeight"
                            step="0.1"
                            value={startWeight}
                            onChange={(e) => setStartWeight(e.target.value)}
                            className="text-lg"
                            required
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
                      <Label htmlFor="targetWeight" className="text-xl font-semibold">
                        Din målvægt
                      </Label>
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                          Hvad er din ønskede vægt?
                        </div>
                        <div className="pt-2">
                          <div className="text-sm font-medium mb-2">Vægt i kg</div>
                          <Input
                            type="number"
                            id="targetWeight"
                            step="0.1"
                            value={targetWeight}
                            onChange={(e) => setTargetWeight(e.target.value)}
                            className="text-lg"
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
                    <Label htmlFor="numberOfDays" className="text-xl font-semibold">
                      Varighed
                    </Label>
                    <div className="space-y-6">
                      {minDays > 0 && maxDays > 0 && (
                        <>
                          <div className="space-y-6">
                            <div className="flex justify-between text-sm text-muted-foreground font-medium">
                              <span>Hurtigt ({(300).toFixed(0)}g/dag)</span>
                              <span>Langsomt ({(50).toFixed(0)}g/dag)</span>
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

                {startWeight && targetWeight && parseFloat(startWeight) > parseFloat(targetWeight) && numberOfDays > 0 && (
                  <motion.div 
                    className="rounded-lg border bg-card text-card-foreground p-8"
                    variants={inputVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold">Start din rejse</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Er du klar til at starte din vægttabsrejse?
                          </p>
                        </div>
                        <Button type="submit" size="lg">
                          Start
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

