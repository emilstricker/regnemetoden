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
        title: 'Vej dig selv dagligt',
        description: 'Sørg for at veje dig hver morgen på samme tidspunkt. Det giver dig den mest konsistente data til at følge din fremgang.',
        language: 'da'
    },
    {
        category: 'general',
        title: 'Spis i balance',
        description: 'Planlæg dine måltider i overensstemmelse med dit daglige madbudget. Undgå at overspise, selvom du føler dig sulten.',
        language: 'da'
    },
    {
        category: 'general',
        title: 'Hold dig hydreret',
        description: 'Drik masser af vand i løbet af dagen. Det hjælper med at regulere appetitten og støtter vægttabsprocessen.',
        language: 'da'
    },
    {
        category: 'general',
        title: 'Undgå ekstreme underskud',
        description: 'Et drastisk lavt kalorieindtag kan føre til træthed og muskeltab. Hold dit madbudget realistisk.',
        language: 'da'
    },
    {
        category: 'general',
        title: 'Bevæg dig dagligt',
        description: 'Selv små mængder motion, som en gåtur, kan booste dit vægttab og forbedre dit generelle velvære.',
        language: 'da'
    },
    {
        category: 'general',
        title: 'Overvåg din søvn',
        description: 'Dårlig søvn kan påvirke dine vægttabsmål. Prioritér 7-8 timers søvn hver nat.',
        language: 'da'
    },
    {
        category: 'general',
        title: 'Juster efter behov',
        description: 'Hvis du rammer et plateau, eller vægten ikke falder som forventet, revurder dit daglige madbudget og justér forsigtigt.',
        language: 'da'
    },
    {
        category: 'general',
        title: 'Fejr små sejre',
        description: 'Sæt små mål og beløn dig selv for at nå dem – uden at det påvirker din fremgang negativt.',
        language: 'da'
    },
    {
        category: 'general',
        title: 'Følg metoden konsekvent',
        description: 'Det vigtigste er at være konsistent. Små, daglige skridt fører til store resultater over tid.',
        language: 'da'
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

    // Social tips
    {
        category: 'social',
        title: 'Sociale arrangementer',
        description: 'Planlæg dit gram-budget før sociale arrangementer. Det giver dig frihed til at nyde måltidet uden stress.',
        language: 'da'
    },

    // Progress tips
    {
        category: 'progress',
        title: 'Fremskridt over tid',
        description: 'Fokuser på dine langsigtede fremskridt. Små daglige sejre fører til store resultater over tid.',
        language: 'da'
    },

    // Adjustment tips
    {
        category: 'adjustment',
        title: 'Juster dit mål',
        description: 'Det er okay at justere dit mål undervejs. Lyt til din krop og tilpas din plan efter behov.',
        language: 'da'
    },

    // Motivation tips
    {
        category: 'motivation',
        title: 'Fejr dine sejre',
        description: 'Husk at fejre dine små sejre undervejs. Hver gram tæller i den rigtige retning!',
        language: 'da'
    },
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