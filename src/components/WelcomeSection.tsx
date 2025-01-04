import React from 'react';
import { Button } from './ui/button';

interface WelcomeSectionProps {
  onStart: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onStart }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="space-y-6">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Velkommen til din vægt tracker! 🎯
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center p-6 bg-muted rounded-lg">
            <span className="text-4xl mb-4">📊</span>
            <p className="text-center text-sm text-muted-foreground">
              Sætte realistiske vægttabsmål
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-muted rounded-lg">
            <span className="text-4xl mb-4">⚖️</span>
            <p className="text-center text-sm text-muted-foreground">
              Tracke din daglige vægt
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-muted rounded-lg">
            <span className="text-4xl mb-4">📈</span>
            <p className="text-center text-sm text-muted-foreground">
              Se din fremgang over tid
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={onStart}
            size="lg"
            className="w-full md:w-auto"
          >
            Start din rejse
          </Button>
        </div>
      </div>
    </div>
  );
};
