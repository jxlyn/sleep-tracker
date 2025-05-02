
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Calendar } from "lucide-react";

// Mock data for the summary
const weeklyData = [
  { day: "Mon", hours: 7.2, quality: 82, deepSleep: 2.1, lightSleep: 3.5, remSleep: 1.6 },
  { day: "Tue", hours: 6.8, quality: 75, deepSleep: 1.8, lightSleep: 3.2, remSleep: 1.8 },
  { day: "Wed", hours: 7.5, quality: 85, deepSleep: 2.3, lightSleep: 3.7, remSleep: 1.5 },
  { day: "Thu", hours: 8.0, quality: 90, deepSleep: 2.5, lightSleep: 4.0, remSleep: 1.5 },
  { day: "Fri", hours: 6.5, quality: 70, deepSleep: 1.7, lightSleep: 3.3, remSleep: 1.5 },
  { day: "Sat", hours: 8.5, quality: 88, deepSleep: 2.7, lightSleep: 4.2, remSleep: 1.6 },
  { day: "Sun", hours: 7.8, quality: 85, deepSleep: 2.4, lightSleep: 3.8, remSleep: 1.6 },
];

const monthlyData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  return {
    day: day.toString(),
    hours: Math.round((Math.random() * 3 + 6) * 10) / 10,
    quality: Math.round(Math.random() * 30 + 65),
    deepSleep: Math.round((Math.random() * 1.5 + 1.5) * 10) / 10,
    lightSleep: Math.round((Math.random() * 1.5 + 3) * 10) / 10,
    remSleep: Math.round((Math.random() * 0.5 + 1.2) * 10) / 10,
  };
});

const calculateAverages = (data: any[]) => {
  const sum = data.reduce(
    (acc, day) => {
      return {
        hours: acc.hours + day.hours,
        quality: acc.quality + day.quality,
        deepSleep: acc.deepSleep + day.deepSleep,
        lightSleep: acc.lightSleep + day.lightSleep,
        remSleep: acc.remSleep + day.remSleep,
      };
    },
    { hours: 0, quality: 0, deepSleep: 0, lightSleep: 0, remSleep: 0 }
  );
  
  return {
    averageHours: Math.round((sum.hours / data.length) * 10) / 10,
    averageQuality: Math.round(sum.quality / data.length),
    averageDeepSleep: Math.round((sum.deepSleep / data.length) * 10) / 10,
    averageLightSleep: Math.round((sum.lightSleep / data.length) * 10) / 10,
    averageRemSleep: Math.round((sum.remSleep / data.length) * 10) / 10,
  };
};

export const SleepSummary: React.FC = () => {
  const [period, setPeriod] = useState<"week" | "month">("week");
  
  const data = period === "week" ? weeklyData : monthlyData;
  const averages = calculateAverages(data);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-sm text-muted-foreground">{`Sleep: ${payload[0].value} hours`}</p>
          <p className="text-sm text-muted-foreground">{`Quality: ${payload[1].value}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sleep Summary</h1>
          <p className="text-muted-foreground">View your sleep trends and patterns</p>
        </div>
        <Button variant="outline" className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Custom Date Range
        </Button>
      </div>
      
      <Tabs defaultValue="week" className="w-full" onValueChange={(value) => setPeriod(value as "week" | "month")}>
        <TabsList className="w-full max-w-xs mx-auto grid grid-cols-2 mb-6">
          <TabsTrigger value="week">Last 7 Days</TabsTrigger>
          <TabsTrigger value="month">Last 30 Days</TabsTrigger>
        </TabsList>
        
        <TabsContent value="week" className="space-y-6">
          {/* Sleep Overview Card */}
          <Card className="sleep-card">
            <CardHeader>
              <CardTitle>Weekly Sleep Overview</CardTitle>
              <CardDescription>Your sleep patterns for the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="hours" 
                      name="Sleep Hours" 
                      stroke="#8B5CF6" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="quality" 
                      name="Sleep Quality %" 
                      stroke="#5B21B6" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Sleep Averages */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="sleep-card">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Avg. Sleep Duration</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{averages.averageHours} hrs</div>
                <p className="text-xs text-muted-foreground">
                  {averages.averageHours >= 7 ? "Optimal" : "Below recommended"}
                </p>
              </CardContent>
            </Card>
            
            <Card className="sleep-card">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Avg. Sleep Quality</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{averages.averageQuality}%</div>
                <p className="text-xs text-muted-foreground">
                  {averages.averageQuality >= 80 ? "Excellent" : averages.averageQuality >= 70 ? "Good" : "Fair"}
                </p>
              </CardContent>
            </Card>
            
            <Card className="sleep-card">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Avg. Deep Sleep</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{averages.averageDeepSleep} hrs</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((averages.averageDeepSleep / averages.averageHours) * 100)}% of total sleep
                </p>
              </CardContent>
            </Card>
            
            <Card className="sleep-card">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Avg. REM Sleep</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{averages.averageRemSleep} hrs</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((averages.averageRemSleep / averages.averageHours) * 100)}% of total sleep
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Sleep Stages */}
          <Card className="sleep-card">
            <CardHeader>
              <CardTitle>Weekly Sleep Stages</CardTitle>
              <CardDescription>Breakdown of your sleep phases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="deepSleep" name="Deep Sleep" stackId="a" fill="#1E3A8A" />
                    <Bar dataKey="lightSleep" name="Light Sleep" stackId="a" fill="#8B5CF6" />
                    <Bar dataKey="remSleep" name="REM Sleep" stackId="a" fill="#C4B5FD" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="month" className="space-y-6">
          {/* Monthly Sleep Overview Card */}
          <Card className="sleep-card">
            <CardHeader>
              <CardTitle>Monthly Sleep Overview</CardTitle>
              <CardDescription>Your sleep patterns for the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="hours" 
                      name="Sleep Hours" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="quality" 
                      name="Sleep Quality %" 
                      stroke="#5B21B6" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Sleep Averages */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="sleep-card">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Avg. Sleep Duration</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{averages.averageHours} hrs</div>
                <p className="text-xs text-muted-foreground">
                  {averages.averageHours >= 7 ? "Optimal" : "Below recommended"}
                </p>
              </CardContent>
            </Card>
            
            <Card className="sleep-card">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Avg. Sleep Quality</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{averages.averageQuality}%</div>
                <p className="text-xs text-muted-foreground">
                  {averages.averageQuality >= 80 ? "Excellent" : averages.averageQuality >= 70 ? "Good" : "Fair"}
                </p>
              </CardContent>
            </Card>
            
            <Card className="sleep-card">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Avg. Deep Sleep</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{averages.averageDeepSleep} hrs</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((averages.averageDeepSleep / averages.averageHours) * 100)}% of total sleep
                </p>
              </CardContent>
            </Card>
            
            <Card className="sleep-card">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Avg. REM Sleep</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{averages.averageRemSleep} hrs</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((averages.averageRemSleep / averages.averageHours) * 100)}% of total sleep
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Sleep Stages */}
          <Card className="sleep-card">
            <CardHeader>
              <CardTitle>Monthly Sleep Stages</CardTitle>
              <CardDescription>Breakdown of your sleep phases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData.slice(-7)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="deepSleep" name="Deep Sleep" stackId="a" fill="#1E3A8A" />
                    <Bar dataKey="lightSleep" name="Light Sleep" stackId="a" fill="#8B5CF6" />
                    <Bar dataKey="remSleep" name="REM Sleep" stackId="a" fill="#C4B5FD" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SleepSummary;
