import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import type { WeightLossGoal } from '../hooks/useWeightLoss';

interface ProgressSectionProps {
  userData: WeightLossGoal;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({ userData }) => {
  const totalWeightToLose = userData.startWeight - userData.targetWeight;
  const currentProgress = 0; // TODO: Calculate from weight entries
  const progressPercentage = (currentProgress / totalWeightToLose) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Din Fremgang</CardTitle>
          <CardDescription>
            Du er på vej mod dit mål på {userData.targetWeight}kg
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Start: {userData.startWeight}kg</span>
                <span>Mål: {userData.targetWeight}kg</span>
              </div>
              <Progress value={progressPercentage} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">Total vægt at tabe</div>
                <div className="text-2xl font-bold">{totalWeightToLose.toFixed(1)}kg</div>
              </div>
              
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">Tabt indtil nu</div>
                <div className="text-2xl font-bold">{currentProgress.toFixed(1)}kg</div>
              </div>
              
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">Antal dage tilbage</div>
                <div className="text-2xl font-bold">{userData.numberOfDays}</div>
              </div>
              
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">Dagligt mål</div>
                <div className="text-2xl font-bold">
                  {((userData.startWeight - userData.targetWeight) / userData.numberOfDays).toFixed(2)}kg
                </div>
              </div>
              
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">Fremgang</div>
                <div className="text-2xl font-bold">{progressPercentage.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vægthistorik</CardTitle>
          <CardDescription>
            Din vægtudvikling over tid
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* TODO: Add weight history chart */}
          <div className="h-[200px] flex items-center justify-center border rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">
              Vægthistorik kommer snart...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
