# Regnemetoden Onboarding Flow

## Overview
This document describes the onboarding flow for new users in Regnemetoden, focusing on the initial weight setup and day zero/day one transitions.

## User Journey

### 1. Initial Setup
When a new user first enters the app:
1. Sign in with Google
2. Enter current weight and target weight
3. Choose when to weigh themselves:
   - "Jeg vil veje mig i aften" (I want to weigh myself tonight)
   - "Jeg vejede mig i går" (I weighed myself yesterday)

The default selection is based on time of day:
- Before 10:00: Default to "Jeg vejede mig i går"
- After 10:00: Default to "Jeg vil veje mig i aften"

### 2. Flow Based on Weighing Choice

#### A. "Jeg vil veje mig i aften" Flow
1. **Setup Form**
   - Enter estimated current weight
   - Enter target weight
   - System calculates recommended duration
   - Click "Start din rejse"

2. **Day Zero Guide**
   - Immediately shown the day zero guide
   - Shows the estimated weight entered
   - Options:
     - Enter actual weight when weighed
     - Go back to modify plan

3. **After Weight Entry**
   - Success message: "Din vægt er blevet gemt. Kom tilbage i morgen for at starte din rejse!"
   - Must wait until next day to start tracking
   - If the user navigates away from the app, and return later on day zero, they land back on this page.

4. **Next Day (Day One)**
   - Dashboard shows: "Morgenvægt, Indtast din vægt for at komme i gang"
   - Yesterday's weight is set as the starting point for target weight calculations
   - Can start tracking food and weight

#### B. "Jeg vejede mig i går" Flow
1. **Setup Form**
   - Enter actual weight from yesterday
   - Enter target weight
   - System calculates recommended duration
   - Click "Start din rejse"

2. **Immediate Dashboard Access**
   - Direct access to dashboard (already on Day One)
   - Yesterday's weight is set as the starting point for target weight calculations
   - Can immediately start tracking food and weight

## Date and State Logic

### Day Zero
Two possible scenarios:
1. **Tonight Weighing**
   - Occurs when user selects "Jeg vil veje mig i aften"
   - This is the current day where user will enter their first weight

2. **Yesterday Weighing**
   - When user selects "Jeg vejede mig i går"
   - Day zero is automatically set to yesterday
   - User starts immediately on day one

### Day One
Depends on weighing choice:
1. **For "Jeg vil veje mig i aften"**
   - Begins the calendar day after saving their weight
   - Dashboard shows empty morning weight prompt
   - Previous night's weight used for calculations

2. **For "Jeg vejede mig i går"**
   - Begins immediately after setup
   - Yesterday's weight used for calculations
   - Full dashboard access from start

## Implementation Details

### Key States
```typescript
interface WeightLossGoal {
  startWeight: number;
  targetWeight: number;
  numberOfDays: number;
  startDate: string;         // ISO date string
  weightingTime: 'tonight' | 'yesterday';
  isWeightSaved?: boolean;
}
```

### View Logic
```typescript
// Determine which view to show
if (weightingTime === 'tonight' && isCurrentDateDayZero) {
  showDayZeroGuide();
} else {
  showDashboard();
}
```

### Date Handling
- All dates stored as ISO strings (YYYY-MM-DD)
- Time components removed using `startOfDay`
- Date comparisons use millisecond timestamps
- Dev tools offset applied to "now" before any date logic

## Testing Scenarios

### 1. Evening Weigh-in
- Select "Jeg vil veje mig i aften"
- Complete setup
- Enter actual weight
- Verify:
  - Success message shows
  - Dashboard appears next day
  - Morning weight is empty
  - Target calculations use evening weight

### 2. Morning Weigh-in
- Select "Jeg vejede mig i går"
- Complete setup
- Verify:
  - Immediate dashboard access
  - Yesterday's weight used for calculations
  - Can log today's morning weight

### 3. Date Transitions
- Use dev tools to test:
  - Day zero to day one transition
  - Weight logging at different times
  - Date calculations for both flows
