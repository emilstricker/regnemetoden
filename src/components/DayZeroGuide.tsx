import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { saveDayEntry, updatePendingGoalWeightSaved } from '@/lib/firebase';
import { CheckCircle2 } from "lucide-react"
import { startOfDay } from 'date-fns';

interface DayZeroGuideProps {
  onBack: () => void;
  estimatedWeight: number;
  isWeightSaved?: boolean;
}

export function DayZeroGuide({ 
  onBack,
  estimatedWeight,
  isWeightSaved: initialWeightSaved = false
}: DayZeroGuideProps) {
  const [weight, setWeight] = useState(estimatedWeight.toString());
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWeightSaved, setIsWeightSaved] = useState(initialWeightSaved);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const weightValue = parseFloat(weight);
      if (isNaN(weightValue)) {
        setError('Indtast venligst en gyldig vægt');
        return;
      }

      if (weightValue < 30 || weightValue > 300) {
        setError('Vægt skal være mellem 30 og 300 kg');
        return;
      }

      if (!user) {
        setError('Du skal være logget ind for at gemme din vægt');
        return;
      }

      // Save the weight
      await saveDayEntry(user.uid, {
        date: startOfDay(new Date()).toISOString().split('T')[0],
        weight: weightValue,
        foodEntries: []
      });

      // Update the pending goal to mark weight as saved
      await updatePendingGoalWeightSaved(user.uid);

      setIsWeightSaved(true);
    } catch (error) {
      console.error('Error saving weight:', error);
      setError('Der skete en fejl. Prøv igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isWeightSaved) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl mx-auto space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Vægt gemt!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <p className="text-lg">
                Din vægt er blevet gemt. Kom tilbage i morgen for at starte din rejse!
              </p>
              <p className="text-muted-foreground">
                Du vil kunne se dit dashboard og tracke din fremgang fra i morgen af.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="w-full"
              >
                Gå tilbage og ret min plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Din første vejning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-lg">
              Du har valgt at starte din rejse i aften.
            </p>
            <p className="text-muted-foreground">
              Din estimerede startvægt er <span className="font-semibold">{estimatedWeight} kg</span>
            </p>
          </div>

          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Sådan gør du:</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Vej dig selv lige før sengetid</li>
                <li>Efter dit sidste måltid og toiletbesøg</li>
                <li>Brug den samme badevægt hver gang</li>
                <li>Vej dig på samme tidspunkt hver aften</li>
              </ul>
            </div>

            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Din faktiske vægt</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="F.eks. 85.5"
                    className="text-lg"
                    required
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <div className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Gemmer...</span>
                      </div>
                    ) : (
                      'Gem min vægt'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onBack}
                    className="w-full"
                  >
                    Gå tilbage og ret min plan
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
