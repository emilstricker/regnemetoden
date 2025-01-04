import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { motion } from 'framer-motion';

interface SetupFormProps {
  onSubmit: (goal: {
    startWeight: number;
    targetWeight: number;
    numberOfDays: number;
    startDate: string;
  }) => void;
}

export const SetupForm = ({ onSubmit }: SetupFormProps) => {
  const [startWeight, setStartWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('30');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startWeightFloat = parseFloat(startWeight);
    const targetWeightFloat = parseFloat(targetWeight);
    const numberOfDaysInt = parseInt(numberOfDays);

    if (isNaN(startWeightFloat) || isNaN(targetWeightFloat) || isNaN(numberOfDaysInt)) {
      return;
    }

    if (numberOfDaysInt < 1) {
      alert('Antal dage skal være mindst 1');
      return;
    }

    if (targetWeightFloat >= startWeightFloat) {
      alert('Målvægt skal være mindre end startvægt');
      return;
    }

    onSubmit({
      startWeight: startWeightFloat,
      targetWeight: targetWeightFloat,
      numberOfDays: numberOfDaysInt,
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  const weightToLose = parseFloat(startWeight) - parseFloat(targetWeight);
  const dailyGoal = weightToLose / parseInt(numberOfDays || '1');

  const inputVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Opsætning</CardTitle>
        <p className="text-sm text-muted-foreground">
          Indtast dine målsætninger for at komme i gang
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            className="space-y-2"
            variants={inputVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Label htmlFor="startWeight">Startvægt (kg)</Label>
            <div className="text-sm text-muted-foreground mb-2">
              Vej dig selv om aftenen efter dit sidste måltid
            </div>
            <Input
              type="number"
              id="startWeight"
              step="0.1"
              required
              value={startWeight}
              onChange={(e) => setStartWeight(e.target.value)}
              placeholder="F.eks. 80.5"
              className="transition-all duration-200 focus:scale-[1.02]"
            />
          </motion.div>

          <div className="space-y-2">
            <Label htmlFor="targetWeight">Målvægt (kg)</Label>
            <Input
              type="number"
              id="targetWeight"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="text-2xl"
              required
            />
            {parseFloat(targetWeight) >= parseFloat(startWeight || '0') && (
              <p className="text-sm text-destructive">Målvægt skal være mindre end startvægt</p>
            )}
          </div>

          <motion.div 
            className="space-y-2"
            variants={inputVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Label htmlFor="numberOfDays">Antal dage</Label>
            <Input
              type="number"
              id="numberOfDays"
              required
              min="1"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(e.target.value)}
              placeholder="F.eks. 30"
              className="transition-all duration-200 focus:scale-[1.02]"
            />
            {weightToLose > 0 && parseInt(numberOfDays) > 0 && (
              <motion.p 
                className="text-sm text-muted-foreground mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Dette betyder et dagligt vægttab på {(dailyGoal * 1000).toFixed(0)}g, eller {(dailyGoal * 7).toFixed(2)}kg om ugen
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Button 
              type="submit" 
              className="w-full transition-all duration-200 hover:scale-[1.02]"
            >
              Start vægttab
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
};
