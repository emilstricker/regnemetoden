export interface Tip {
    title: string;
    description: string;
    category: 'fasting' | 'keto' | 'general' | 'low-gram' | 'high-gram' | 'morning' | 
               'evening' | 'social' | 'tracking' | 'progress' | 'adjustment' | 'motivation' |
               'quick-add' | 'subtraction';
    language: 'en' | 'da';
}

export const tips: Tip[] = [
    // Quick-add tips
    {
        category: 'quick-add',
        title: 'Hurtig tilføjelse med tastatur',
        description: 'Brug taltasterne 1-4 for hurtig tilføjelse: 1 for +1g, 2 for +5g, 3 for +10g, og 4 for +50g.',
        language: 'da'
    },
    {
        category: 'quick-add',
        title: 'Kombinér hurtige tilføjelser',
        description: 'Kombinér hurtige tilføjelser for præcise mængder. F.eks. 50g + 50g + 10g = 110g på få sekunder.',
        language: 'da'
    },
    {
        category: 'quick-add',
        title: 'Keyboard Shortcuts',
        description: 'Use number keys 1-4 for quick additions: 1 for +1g, 2 for +5g, 3 for +10g, and 4 for +50g.',
        language: 'en'
    },
    {
        category: 'quick-add',
        title: 'Combine Quick Adds',
        description: 'Combine quick adds for precise amounts. For example, 50g + 50g + 10g = 110g in seconds.',
        language: 'en'
    },

    // Subtraction tips
    {
        category: 'subtraction',
        title: 'Fratræk tallerkenvægt',
        description: 'Husk at fratrække tallerkenvægten ved at bruge negative værdier, f.eks. -100g for en tom tallerken.',
        language: 'da'
    },
    {
        category: 'subtraction',
        title: 'Håndtering af rester',
        description: 'Indtast negative gram for at fratrække madrester, der ikke blev spist.',
        language: 'da'
    },
    {
        category: 'subtraction',
        title: 'Plate Weight Subtraction',
        description: 'Remember to subtract plate weights using negative values, e.g., -100g for an empty plate.',
        language: 'en'
    },
    {
        category: 'subtraction',
        title: 'Leftover Management',
        description: 'Enter negative grams to subtract any food that wasn\'t eaten.',
        language: 'en'
    },

    // Danish translations of general tips
    {
        category: 'general',
        title: 'Hold dig hydreret',
        description: 'Nogle gange kan tørst forveksles med sult. Prøv at drikke vand først, når du føler dig sulten mellem måltider.',
        language: 'da'
    },
    {
        category: 'general',
        title: 'Portionskontrol',
        description: 'Brug mindre tallerkener for at få portioner til at se større ud og føles mere tilfredsstillende.',
        language: 'da'
    },
    {
        category: 'general',
        title: 'Mindful spisning',
        description: 'Spis langsomt og uden distraktioner - det hjælper dig med at føle dig mere mæt med mindre mad.',
        language: 'da'
    },
    {
        category: 'general',
        title: 'Stay Hydrated',
        description: 'Sometimes thirst can be mistaken for hunger. Try drinking water first when you feel hungry between meals.',
        language: 'en'
    },
    {
        category: 'general',
        title: 'Portion Control',
        description: 'Use smaller plates to make portions look bigger and feel more satisfying.',
        language: 'en'
    },
    {
        category: 'general',
        title: 'Mindful Eating',
        description: 'Eat slowly and without distractions - it helps you feel fuller with less food.',
        language: 'en'
    },
    {
        category: 'general',
        title: 'Hunger Scale',
        description: 'Rate your hunger on a scale of 1-10 before eating - aim to eat at 7, stop at 3.',
        language: 'en'
    },
    {
        category: 'general',
        title: 'Kitchen Setup',
        description: 'Keep your food scale visible and accessible - it encourages consistent tracking.',
        language: 'en'
    },
    {
        category: 'general',
        title: 'Weekly Prep',
        description: 'Pre-portion snacks into gram-specific containers for grab-and-go convenience.',
        language: 'en'
    },

    // Danish translations of tracking tips
    {
        category: 'tracking',
        title: 'Hurtig logging',
        description: 'Log gram med det samme efter spisning - venter du til senere, bliver trackingen mindre præcis.',
        language: 'da'
    },
    {
        category: 'tracking',
        title: 'Gram estimering',
        description: 'Når præcis vejning ikke er mulig, rund op for at være på den sikre side.',
        language: 'da'
    },
    {
        category: 'tracking',
        title: 'Ugentlig gennemgang',
        description: 'Tjek dine ugentlige gram-mønstre for at identificere, hvad der virker bedst for dig.',
        language: 'da'
    },
    {
        category: 'tracking',
        title: 'Quick Logging',
        description: 'Log grams immediately after eating - waiting until later leads to less accurate tracking.',
        language: 'en'
    },
    {
        category: 'tracking',
        title: 'Gram Estimation',
        description: 'When exact weighing isn\'t possible, round up slightly to stay on the safe side.',
        language: 'en'
    },
    {
        category: 'tracking',
        title: 'Weekly Review',
        description: 'Check your weekly gram patterns to identify what works best for you.',
        language: 'en'
    },
    {
        category: 'tracking',
        title: 'Photo Logging',
        description: 'Take photos of your meals alongside gram weights to build better estimation skills.',
        language: 'en'
    },
    {
        category: 'tracking',
        title: 'Morning Routine Optimization',
        description: 'Create a morning checklist: 1) Weigh yourself 2) Enter weight in app 3) Review gram allowance 4) Plan meals accordingly.',
        language: 'en'
    },
    {
        category: 'tracking',
        title: 'Gram Banking',
        description: 'If you know you\'ll have a higher-gram meal later, intentionally eat lighter earlier in the day to stay within your allowance.',
        language: 'en'
    },
    {
        category: 'tracking',
        title: 'Digital Scale Accuracy',
        description: 'Calibrate your food scale weekly and your body weight scale monthly for the most accurate tracking.',
        language: 'en'
    },
    {
        category: 'tracking',
        title: 'Rapid Logging',
        description: 'Use the quick-add buttons for common portions to make tracking faster and increase consistency.',
        language: 'en'
    },

    // Danish translations of morning tips
    {
        category: 'morning',
        title: 'Morgen vejnings-rutine',
        description: 'Vej dig altid først på dagen efter toiletbesøg, før du spiser eller drikker noget.',
        language: 'da'
    },
    {
        category: 'morning',
        title: 'Start stærkt',
        description: 'Start dagen med proteinrig mad - det hjælper med at kontrollere sult gennem dagen.',
        language: 'da'
    },
    {
        category: 'morning',
        title: 'Morgen gram-planlægning',
        description: 'Gennemgå din gram-tilladelse først på dagen og planlæg dine måltider derefter.',
        language: 'da'
    },
    {
        category: 'morning',
        title: 'Morning Weigh-In Routine',
        description: 'Always weigh yourself first thing after using the bathroom, before eating or drinking anything.',
        language: 'en'
    },
    {
        category: 'morning',
        title: 'Start Strong',
        description: 'Begin your day with protein-rich foods - they help control hunger throughout the day.',
        language: 'en'
    },
    {
        category: 'morning',
        title: 'Morning Gram Planning',
        description: 'Review your gram allowance first thing and plan your meals accordingly.',
        language: 'en'
    },
    {
        category: 'morning',
        title: 'Scale Accuracy',
        description: 'Keep your scale on a hard, flat surface and stand in the same spot each morning for consistent readings.',
        language: 'en'
    },

    // Danish translations of evening tips
    {
        category: 'evening',
        title: 'Aften gram-buffer',
        description: 'Prøv at gemme 20% af dine daglige gram til aftensnacks, hvis du har tendens til at blive sulten om aftenen.',
        language: 'da'
    },
    {
        category: 'evening',
        title: 'Sengetids-strategi',
        description: 'Hvis du er sulten før sengetid, prøv en lille protein-snack som hytteost i stedet for kulhydrat-tunge valg.',
        language: 'da'
    },
    {
        category: 'evening',
        title: 'Evening Gram Buffer',
        description: 'Try to leave 20% of your daily grams for evening snacks if you tend to get hungry at night.',
        language: 'en'
    },
    {
        category: 'evening',
        title: 'Pre-Bed Strategy',
        description: 'If hungry before bed, try a small protein snack like cottage cheese instead of carb-heavy options.',
        language: 'en'
    },
    {
        category: 'evening',
        title: 'Tomorrow Planning',
        description: 'Check your remaining grams and plan tomorrow\'s meals before going to bed.',
        language: 'en'
    },

    // Social tips
    {
        category: 'social',
        title: 'Sociale arrangementer',
        description: 'Planlæg dit gram-budget før sociale arrangementer. Det giver dig frihed til at nyde måltidet uden stress.',
        language: 'da'
    },
    {
        category: 'social',
        title: 'Social Events',
        description: 'Plan your gram budget before social events. This gives you the freedom to enjoy the meal without stress.',
        language: 'en'
    },

    // Progress tips
    {
        category: 'progress',
        title: 'Fremskridt over tid',
        description: 'Fokuser på dine langsigtede fremskridt. Små daglige sejre fører til store resultater over tid.',
        language: 'da'
    },
    {
        category: 'progress',
        title: 'Progress Over Time',
        description: 'Focus on your long-term progress. Small daily wins lead to big results over time.',
        language: 'en'
    },
    {
        category: 'progress',
        title: 'Daily Goal Focus',
        description: 'Compare your morning weight only to today\'s goal weight, not future targets. This keeps you focused on immediate, achievable progress.',
        language: 'en'
    },

    // Adjustment tips
    {
        category: 'adjustment',
        title: 'Juster dit mål',
        description: 'Det er okay at justere dit mål undervejs. Lyt til din krop og tilpas din plan efter behov.',
        language: 'da'
    },
    {
        category: 'adjustment',
        title: 'Adjust Your Goal',
        description: 'It\'s okay to adjust your goal along the way. Listen to your body and adapt your plan as needed.',
        language: 'en'
    },

    // Motivation tips
    {
        category: 'motivation',
        title: 'Fejr dine sejre',
        description: 'Husk at fejre dine små sejre undervejs. Hver gram tæller i den rigtige retning!',
        language: 'da'
    },
    {
        category: 'motivation',
        title: 'Celebrate Victories',
        description: 'Remember to celebrate your small victories along the way. Every gram counts in the right direction!',
        language: 'en'
    },
    {
        category: 'motivation',
        title: 'Data-Driven Decisions',
        description: 'Let your weight trend guide your choices rather than emotional eating patterns. Your morning weight provides clear direction for the day.',
        language: 'en'
    },
    {
        category: 'motivation',
        title: 'Progress Perspective',
        description: 'Think of your gram allowance as a daily budget - staying within it naturally leads to your goal weight.',
        language: 'en'
    },
    {
        category: 'motivation',
        title: 'Milestone Celebrations',
        description: 'Celebrate every 5 pounds lost with non-food rewards like new workout clothes or a massage.',
        language: 'en'
    },
    {
        category: 'motivation',
        title: 'Trend Tracking',
        description: 'Focus on your 7-day weight average rather than daily fluctuations. This provides a clearer picture of your progress.',
        language: 'en'
    }
];

// Helper function to get tips by language and category
export function getTipsByLanguage(language: 'en' | 'da', category?: string): Tip[] {
    return tips.filter(tip => {
        const languageMatch = tip.language === language;
        const categoryMatch = !category || tip.category === category;
        return languageMatch && categoryMatch;
    });
}

// Helper function to get a random tip
export function getRandomTip(language: 'en' | 'da', category?: string): Tip | null {
    const filteredTips = getTipsByLanguage(language, category);
    return filteredTips.length > 0 ? filteredTips[Math.floor(Math.random() * filteredTips.length)] : null;
}