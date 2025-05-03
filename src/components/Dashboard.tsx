
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  Legend,
} from "recharts";
import { Moon, Sun, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SleepCircle } from "@/components/ui/sleep-circle";
import { SleepBar } from "@/components/ui/sleep-bar";

// Mock data for dashboard
const sleepData = {
  lastNight: {
    hours: 7.5,
    quality: 58,
    bedTime: "11:30 PM",
    wakeTime: "7:00 AM",
    deepSleep: 2.3,
    lightSleep: 3.7,
    remSleep: 1.5,
  },
  weeklyAverage: {
    hours: 7.2,
    quality: 80,
    trend: "up",
  },
  streak: 5,
};

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

const calculateAverages = (data) => {
  const sum = data.reduce(
    (acc, day) => ({
      hours: acc.hours + day.hours,
      quality: acc.quality + day.quality,
      deepSleep: acc.deepSleep + day.deepSleep,
      lightSleep: acc.lightSleep + day.lightSleep,
      remSleep: acc.remSleep + day.remSleep,
    }),
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

export const Dashboard: React.FC = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const [period, setPeriod] = useState<"week" | "month">("week");
  const data = period === "week" ? weeklyData : monthlyData;
  const averages = calculateAverages(data);
  
  const LineTooltip = ({ active, payload, label }: any) => {
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

  const BarTooltip: React.FC<TooltipProps<any, any>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background text-foreground border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name} : ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  

  return (
    
    <div className="pt-[64px] px-4 sm:px-6 md:px-12 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-3">Your Sleep Insights</h1>
          <p className="text-muted-foreground">{formattedDate}</p>
        </div>
        <Link to="/log">
          <Button className="bg-sleep-medium hover:bg-sleep-deep">
          Log Sleep → 
          </Button>
        </Link>
      </div>

      <Card className="sleep-card">
        <CardHeader className="pb-2 mb-4">
          <CardTitle>Last Night's Sleep</CardTitle>
          <CardDescription>
            {sleepData.lastNight.bedTime} - {sleepData.lastNight.wakeTime}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            <SleepCircle hours={sleepData.lastNight.hours} quality={sleepData.lastNight.quality} />

            {/* Sleep Cycle */}
            <div className="flex flex-col justify-center p-8 border border-slate-700 rounded-lg">
              <h4 className="text-xl font-bold mb-10">Sleep Cycle</h4>

              <div className="space-y-6 text-sm">
                <SleepBar
                  label="Deep Sleep"
                  value={sleepData.lastNight.deepSleep}
                  total={sleepData.lastNight.hours}
                  color="bg-[#892EFF]"
                />
                <SleepBar
                  label="Light Sleep"
                  value={sleepData.lastNight.lightSleep}
                  total={sleepData.lastNight.hours}
                  color="bg-[#84BAFD]"
                />
                <SleepBar
                  label="REM Sleep"
                  value={sleepData.lastNight.remSleep}
                  total={sleepData.lastNight.hours}
                  color="bg-[#C439FF]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-3 mt-10">Sleep Summary</h1>
          <p className="text-muted-foreground">View your sleep trends and patterns</p>
        </div>
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
                    <Tooltip content={<LineTooltip />} />
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
                    <Tooltip content={<BarTooltip />} />
                    <Legend />
                    <Bar dataKey="deepSleep" name="Deep Sleep" stackId="a" fill="#892EFF" />
                    <Bar dataKey="lightSleep" name="Light Sleep" stackId="a" fill="#84BAFD" />
                    <Bar dataKey="remSleep" name="REM Sleep" stackId="a" fill="#C439FF" />
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
                    <Tooltip content={<LineTooltip />} />
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
                    <Tooltip content={<BarTooltip />} />
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

      {/* Weekly Stats and Suggestions */}
      <div className="w-full mt-10">
        <Card className="sleep-card max-w-10xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Sleep Suggestions</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Personalized tips for better sleep
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 md:space-y-8 px-6 md:px-10 pb-10">
            <ul className="grid gap-6 md:grid-cols-3 md:gap-8">
              <li className="flex items-start">
                <div className="mr-4 mt-1 p-2 bg-sleep-light/20 rounded-full">
                  <Moon className="h-5 w-5 text-sleep-medium" />
                </div>
                <div>
                  <p className="text-base font-medium">Consistent sleep schedule</p>
                  <p className="text-sm text-muted-foreground">
                    Try to go to bed around 11:00 PM for optimal rest
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-4 mt-1 p-2 bg-sleep-light/20 rounded-full">
                  <Sun className="h-5 w-5 text-sleep-medium" />
                </div>
                <div>
                  <p className="text-base font-medium">Morning sunlight exposure</p>
                  <p className="text-sm text-muted-foreground">
                    Get 10–15 minutes of morning sun to regulate your body clock
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-4 mt-1 p-2 bg-sleep-light/20 rounded-full">
                  <Clock className="h-5 w-5 text-sleep-medium" />
                </div>
                <div>
                  <p className="text-base font-medium">Limit screen time before bed</p>
                  <p className="text-sm text-muted-foreground">
                    Avoid screens 1 hour before bedtime for better sleep quality
                  </p>
                </div>
              </li>
            </ul>
            <div className="flex justify-center">
              <Link to="/assessment">
                <Button variant="outline" className="max-w-4xl w-full bg-violet-700">
                  Take Sleep Assessment
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
