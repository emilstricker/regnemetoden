import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { saveDayEntry } from '@/lib/firebase';
import { CheckCircle2 } from "lucide-react"

interface DayZeroGuideProps {
  onComplete: () => void;
  onUpdatePlan: (weight: number) => void;
  estimatedWeight: number;
}

export function DayZeroGuide({ 
  onComplete, 
  onUpdatePlan,
  estimatedWeight
}: DayZeroGuideProps) {
  const [weight, setWeight] = useState(estimatedWeight.toString());
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWeightSubmitted, setIsWeightSubmitted] = useState(false);
  const [submittedWeight, setSubmittedWeight] = useState<number | null>(null);
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

      // Save the initial weight entry
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();

      await saveDayEntry(user.uid, {
        date: startOfToday,
        weight: weightValue,
        foodEntries: []
      });

      setSubmittedWeight(weightValue);
      setIsWeightSubmitted(true);
    } catch (err) {
      console.error('Error saving weight:', err);
      setError('Der opstod en fejl ved gemning af din vægt');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isWeightSubmitted && submittedWeight !== null) {
    const weightDifference = Math.abs(submittedWeight - estimatedWeight);
    const shouldSuggestUpdate = weightDifference > 0.5;

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
                <CardTitle className="text-3xl font-bold text-center">
                  <div className="flex justify-center mb-4">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  </div>
                  Tak for din vægt!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <p className="text-xl font-medium">
                      Din vægt er blevet gemt: {submittedWeight} kg
                    </p>
                    {shouldSuggestUpdate ? (
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          Din faktiske vægt er {weightDifference > 0 ? 'højere' : 'lavere'} end estimeret.
                          Vil du opdatere din plan med den nye vægt?
                        </p>
                        <div className="flex justify-center gap-4">
                          <Button 
                            variant="outline"
                            onClick={() => onComplete()}
                          >
                            Nej tak, fortsæt med nuværende plan
                          </Button>
                          <Button
                            onClick={() => onUpdatePlan(submittedWeight)}
                          >
                            Ja, opdater min plan
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          Vi ses i morgen tidlig, hvor du skal veje dig igen før morgenmad.
                          <br /><br />
                          Du kan lukke denne side nu.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

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
              <CardTitle className="text-3xl font-bold text-center">Din Plan for I Dag</CardTitle>
              <p className="text-muted-foreground text-center">
                Her er hvad du skal gøre i dag (Dag 0)
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Din estimerede vægt</Label>
                    <div className="text-2xl font-semibold">{estimatedWeight} kg</div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Din faktiske vægt</Label>
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

                    <div className="space-y-2">
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
                    </div>
                  </form>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Tips til nøjagtig vejning:</h2>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Vej dig selv lige før sengetid</li>
                      <li>Efter dit sidste måltid og toiletbesøg</li>
                      <li>Brug den samme badevægt hver gang du vejer dig</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
