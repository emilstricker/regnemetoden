import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
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
  const [numberOfDays, setNumberOfDays] = useState<number>(initialValues?.numberOfDays || 30);
  const [weightingTime, setWeightingTime] = useState<'tonight' | 'yesterday'>('yesterday');

  // Auto-select based on time of day
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    setWeightingTime(hour >= 20 ? 'tonight' : 'yesterday');
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
        >
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="pb-4 space-y-4">
              <CardTitle className="text-3xl font-bold text-center">Opsætning</CardTitle>
              <p className="text-muted-foreground text-center">
                Indtast dine målsætninger for at komme i gang
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div 
                  className="space-y-6 rounded-lg bg-muted/50 p-6"
                  variants={inputVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="weightingTime" className="text-lg font-semibold">
                      Hvornår vil du veje dig?
                    </Label>
                    <RadioGroup 
                      value={weightingTime} 
                      onValueChange={(value: 'tonight' | 'yesterday') => setWeightingTime(value)}
                      className="pt-2 space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="tonight" id="tonight" />
                        <Label htmlFor="tonight" className="font-medium">
                          Jeg vil veje mig i aften før sengetid
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="yesterday" id="yesterday" />
                        <Label htmlFor="yesterday" className="font-medium">
                          Jeg vejede mig i går aftes
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-6 rounded-lg bg-muted/50 p-6"
                  variants={inputVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="startWeight" className="text-lg font-semibold">
                      {weightingTime === 'tonight' ? 'Din estimerede startvægt (kg)' : 'Din startvægt (kg)'}
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
                            <li>Brug den samme badevægt hver gang du vejer dig</li>
                          </>
                        ) : (
                          <>
                            <li>Indtast din vægt fra i går aftes</li>
                            <li>Hvis du ikke vejede dig i går, vælg "Jeg vejer mig i aften" i stedet</li>
                          </>
                        )}
                      </ul>
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
                </motion.div>

                <motion.div 
                  className="space-y-6 rounded-lg bg-muted/50 p-6"
                  variants={inputVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="targetWeight" className="text-lg font-semibold">Målvægt (kg)</Label>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Den vægt du ønsker at nå ned til
                      </div>
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
                </motion.div>

                <motion.div 
                  className="space-y-6 rounded-lg bg-muted/50 p-6"
                  variants={inputVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="numberOfDays" className="text-lg font-semibold">Varighed</Label>
                    <div className="space-y-6">
                      {minDays > 0 && maxDays > 0 && (
                        <>
                          <div className="space-y-4">
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
                          <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-baseline">
                              <span className="text-3xl font-bold">{numberOfDays} dage</span>
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
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="pt-4"
                >
                  <Button type="submit" className="w-full h-12 text-lg font-semibold">
                    Start din rejse
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
