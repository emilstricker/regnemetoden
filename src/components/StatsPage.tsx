import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, TimeSeriesScale, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Card, CardContent } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { format, addDays } from 'date-fns';

ChartJS.register(TimeSeriesScale, CategoryScale, LinearScale, PointElement, LineElement);

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: { x: string, y: number }[];
        borderColor: string;
        backgroundColor: string;
    }[];
}

const StatsPage: React.FC = () => {
    const { user } = useAuth();
    const [data, setData] = useState<ChartData>({
        labels: [],
        datasets: [
            {
                label: 'Morning Weights',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'Target Weights',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            // Fetch user data
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            let startWeight = 0;
            let targetWeight = 0;
            let numberOfDays = 0;
            let startDate: Date | null = null;
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log("Raw userData:", userData);
                
                // Access the nested weightLossGoal data
                const weightLossGoal = userData.weightLossGoal;
                startWeight = weightLossGoal.startWeight;
                targetWeight = weightLossGoal.targetWeight;
                numberOfDays = weightLossGoal.numberOfDays;
                
                // Parse the start date properly from weightLossGoal
                if (weightLossGoal.startDate) {
                    startDate = new Date(`${weightLossGoal.startDate}T00:00:00.000Z`);
                    console.log("Parsed startDate:", startDate?.toISOString());
                }
            
                // Calculate target weights
                const targetWeights: number[] = [];
                const labels: string[] = [];
            
                if (startDate) {
                    for (let day = 0; day <= numberOfDays; day++) {
                        const dailyDeficit = (startWeight - targetWeight) / numberOfDays;
                        const targetWeightForDay = startWeight - (dailyDeficit * day);
                        targetWeights.push(targetWeightForDay);
                        const currentDate = addDays(startDate, day);
                        labels.push(format(currentDate, 'yyyy-MM-dd'));
                    }
                }
            
                // Fetch morning weights
                const morningWeights: { date: string, weight: number }[] = [];
                const querySnapshot = await getDocs(collection(db, `users/${user.uid}/dayEntries`));
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    morningWeights.push({ 
                        date: new Date(data.date).toISOString().split('T')[0], 
                        weight: data.weight 
                    });
                });
            
                console.log("Morning weights before filtering:", morningWeights);
            
                const filteredMorningWeights = startDate ? morningWeights.filter(item => {
                    if (!startDate) return true;
                    const itemDate = new Date(item.date);
                    const itemDateUtc = new Date(Date.UTC(
                        itemDate.getUTCFullYear(),
                        itemDate.getUTCMonth(),
                        itemDate.getUTCDate()
                    ));
                    
                    const startDateUtc = new Date(Date.UTC(
                        startDate.getFullYear(),
                        startDate.getMonth(),
                        startDate.getDate()
                    ));
                    
                    const comparison = itemDateUtc >= startDateUtc;
                    console.log(`Comparing itemDate: ${itemDateUtc.toISOString()} to startDate: ${startDateUtc.toISOString()}: ${comparison}`);
                    return comparison;
                }) : morningWeights;
            
                console.log("Filtered Morning weights:", filteredMorningWeights);
            
                filteredMorningWeights.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
                const morningWeightData = filteredMorningWeights.map(item => ({
                    x: item.date,
                    y: item.weight
                }));
            
                const today = new Date();
                const targetWeightData = targetWeights.map((weight, index) => ({
                    x: labels[index],
                    y: weight
                })).filter(data => new Date(data.x) <= today); // Filter out future dates
            
                const filteredLabels = labels.filter(label => new Date(label) <= today);
            
                // Set data for the chart
                setData({
                    labels: filteredLabels,
                    datasets: [
                        { ...data.datasets[0], data: morningWeightData },
                        { ...data.datasets[1], data: targetWeightData },
                    ],
                });
            }
        }
        fetchData();
    }, [user]);

    const chartOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Weight'
                }
            }
        }
    };

    return (
        <Card>
            <CardContent>
                <h2>Weight Stats</h2>
                <Line data={data} options={chartOptions} />
            </CardContent>
        </Card>
    );
};

export default StatsPage;
