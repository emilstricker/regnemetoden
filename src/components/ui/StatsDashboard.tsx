"use client"

import { useState, useEffect } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { Award, Calendar, Scale, Target, TrendingDown, Utensils } from 'lucide-react'
import { TimeSeriesScale } from 'chart.js';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Sample data - replace with actual data fetching logic
const fetchData = async () => {
  try {
    const response = await fetch('https://example.com/api/data'); // Replace with actual API endpoint
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error('Failed to fetch data');
  }
}

const consistencyData = [
  { name: "På mål", value: 60, color: "hsl(var(--success))" },
  { name: "Over mål", value: 25, color: "hsl(var(--warning))" },
  { name: "Under mål", value: 15, color: "hsl(var(--destructive))" },
]

const achievements = [
  {
    title: "Første uge gennemført!",
    description: "Du har tracket din vægt i 7 dage i træk",
    icon: Calendar,
  },
  {
    title: "1 kg tabt!",
    description: "Du har nået dit første vægttabsmål",
    icon: Scale,
  },
  {
    title: "Perfekt dag!",
    description: "Du ramte præcis dit daglige mål",
    icon: Target,
  },
]

export default function StatsDashboard() {
  const [dailyData, setDailyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData()
        setDailyData(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to load data")
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  const totalDays = dailyData.length
  const avgAllotted = dailyData.length > 0
    ? Math.round(dailyData.reduce((acc, day) => acc + (day.allotted || 0), 0) / totalDays)
    : 0
  const avgConsumed = dailyData.length > 0
    ? Math.round(dailyData.reduce((acc, day) => acc + (day.consumed || 0), 0) / totalDays)
    : 0
  const totalWeightLoss = dailyData.length > 1
    ? (dailyData[0].weight || 0) - (dailyData[dailyData.length - 1].weight || 0)
    : 0

  const cumulativeData = dailyData.map((day, index, array) => ({
    date: day.date,
    cumulative: array
      .slice(0, index + 1)
      .reduce((acc, d) => acc + ((d.allotted || 0) - (d.consumed || 0)), 0),
  }))

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Statistik Dashboard</h1>
        <Badge variant="secondary" className="text-sm">
          Sidste {totalDays} dage
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dage tracket</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDays} dage</div>
            <Progress value={100} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gns. tildelt</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAllotted}g</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dagligt gennemsnit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gns. indtaget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConsumed}g</div>
            <p className="text-xs text-muted-foreground mt-1">
              {avgConsumed < avgAllotted ? "Under" : "Over"} gennemsnit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Samlet vægttab</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeightLoss.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground mt-1">
              Siden start
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dagligt indtag vs. tildelt</CardTitle>
            <CardDescription>Sammenligning af tildelte og indtagne gram</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="allotted" fill="hsl(var(--primary))" name="Tildelt" />
                <Bar dataKey="consumed" fill="hsl(var(--muted))" name="Indtaget" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vægtudvikling</CardTitle>
            <CardDescription>Din vægt sammenlignet med målvægt</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" name="Vægt" />
                <Line type="monotone" dataKey="targetWeight" stroke="hsl(var(--muted))" strokeDasharray="5 5" name="Målvægt" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kumulativt over/underskud</CardTitle>
            <CardDescription>Samlet difference mellem tildelt og indtaget</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="cumulative" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" name="Kumulativ" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Målopfyldelse</CardTitle>
            <CardDescription>Fordeling af dage ift. målsætning</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={consistencyData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {consistencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Milepæle</CardTitle>
          <CardDescription>Dine seneste præstationer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {achievements.map((achievement, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <achievement.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-sm">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Handlingsforslag</CardTitle>
          <CardDescription>Baseret på dine seneste resultater</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Du har været konsistent 80% af tiden denne uge!</p>
                <p className="text-sm text-muted-foreground">
                  Fortsæt det gode arbejde og fokuser på at holde samme niveau.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Utensils className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Prøv mindre portioner i weekenden</p>
                <p className="text-sm text-muted-foreground">
                  Data viser at du typisk spiser mere i weekenden.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
