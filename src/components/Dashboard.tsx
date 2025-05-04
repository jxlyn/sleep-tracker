import React, { useState, useEffect } from "react";
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
import { sleepStorage, SleepEntry } from "@/lib/sleepStorage";

const calculateSleepDuration = (bedtime: string, wakeupTime: string) => {
  const bedDateTime = new Date(`2000-01-01T${bedtime}`);
  const wakeDateTime = new Date(`2000-01-01T${wakeupTime}`);

  if (wakeDateTime <= bedDateTime) {
    wakeDateTime.setDate(wakeDateTime.getDate() + 1);
  }

  const durationMs = wakeDateTime.getTime() - bedDateTime.getTime();
  return Math.round(durationMs / (1000 * 60 * 60) * 10) / 10;
};

interface BarTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const estimateSleepStages = (totalSleep: number, fellAsleepQuickly: boolean, wokeUpRefreshed: boolean) => {
  const deepPercent = fellAsleepQuickly ? 0.2 : 0.15;
  const remPercent = wokeUpRefreshed ? 0.25 : 0.2;

  const deepSleep = totalSleep * deepPercent;
  const remSleep = totalSleep * remPercent;
  const lightSleep = totalSleep - (deepSleep + remSleep);

  return {
    deepSleep: Number(deepSleep.toFixed(2)),
    lightSleep: Number(lightSleep.toFixed(2)),
    remSleep: Number(remSleep.toFixed(2)),
  };
};

const processSleepData = (entries: SleepEntry[]) => {
  if (entries.length === 0) {
    return {
      lastNight: null,
      weeklyData: [],
      monthlyData: [],
      averages: {
        averageHours: 0,
        averageQuality: 0,
      }
    };
  }

  // Sort entries by date (oldest to newest)
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get last night's sleep (date before today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastNightEntry = sortedEntries.find(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === yesterday.getTime();
  });

  // Process weekly data
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyEntries = sortedEntries.filter(entry =>
    new Date(entry.date) >= oneWeekAgo
  );

  // Combine multiple entries for the same date
  const combinedWeeklyEntries = weeklyEntries.reduce((acc: Record<string, {
    date: string;
    totalHours: number;
    totalQuality: number;
    count: number;
    fellAsleepQuickly: boolean;
    wokeUpRefreshed: boolean;
  }>, entry) => {
    const date = entry.date;
    const hours = calculateSleepDuration(entry.bedtime, entry.waketime);

    if (!acc[date]) {
      acc[date] = {
        date,
        totalHours: hours,
        totalQuality: entry.sleepQuality || 0,
        count: 1,
        fellAsleepQuickly: entry.fellAsleepQuickly || false,
        wokeUpRefreshed: entry.wokeUpRefreshed || false
      };
    } else {
      acc[date].totalHours += hours;
      acc[date].totalQuality += entry.sleepQuality || 0;
      acc[date].count += 1;
      // Use the latest values for fellAsleepQuickly and wokeUpRefreshed
      acc[date].fellAsleepQuickly = entry.fellAsleepQuickly || false;
      acc[date].wokeUpRefreshed = entry.wokeUpRefreshed || false;
    }

    return acc;
  }, {});

  const weeklyData = Object.values(combinedWeeklyEntries).map(entry => {
    const sleepStages = estimateSleepStages(
      entry.totalHours,
      entry.fellAsleepQuickly,
      entry.wokeUpRefreshed
    );
    return {
      day: new Date(entry.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
      hours: entry.totalHours,
      quality: Math.round(entry.totalQuality / entry.count),
      deepSleep: sleepStages.deepSleep,
      lightSleep: sleepStages.lightSleep,
      remSleep: sleepStages.remSleep,
    };
  });

  // Process monthly data
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const monthlyEntries = sortedEntries.filter(entry =>
    new Date(entry.date) >= oneMonthAgo
  );

  // Combine multiple entries for the same date
  const combinedMonthlyEntries = monthlyEntries.reduce((acc: Record<string, {
    date: string;
    totalHours: number;
    totalQuality: number;
    count: number;
    fellAsleepQuickly: boolean;
    wokeUpRefreshed: boolean;
  }>, entry) => {
    const date = entry.date;
    const hours = calculateSleepDuration(entry.bedtime, entry.waketime);

    if (!acc[date]) {
      acc[date] = {
        date,
        totalHours: hours,
        totalQuality: entry.sleepQuality || 0,
        count: 1,
        fellAsleepQuickly: entry.fellAsleepQuickly || false,
        wokeUpRefreshed: entry.wokeUpRefreshed || false
      };
    } else {
      acc[date].totalHours += hours;
      acc[date].totalQuality += entry.sleepQuality || 0;
      acc[date].count += 1;
      // Use the latest values for fellAsleepQuickly and wokeUpRefreshed
      acc[date].fellAsleepQuickly = entry.fellAsleepQuickly || false;
      acc[date].wokeUpRefreshed = entry.wokeUpRefreshed || false;
    }

    return acc;
  }, {});

  const monthlyData = Object.values(combinedMonthlyEntries).map(entry => {
    const sleepStages = estimateSleepStages(
      entry.totalHours,
      entry.fellAsleepQuickly,
      entry.wokeUpRefreshed
    );
    return {
      day: new Date(entry.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
      hours: entry.totalHours,
      quality: Math.round(entry.totalQuality / entry.count),
      deepSleep: sleepStages.deepSleep,
      lightSleep: sleepStages.lightSleep,
      remSleep: sleepStages.remSleep,
  };
});

  // Calculate averages
  const calculateAverages = (data: typeof weeklyData) => {
    if (data.length === 0) return { averageHours: 0, averageQuality: 0, averageDeep: 0, averageREM: 0, deepPercent: 0, remPercent: 0 };

  const sum = data.reduce(
    (acc, day) => ({
        hours: acc.hours + (day.hours || 0),
        quality: acc.quality + (day.quality || 0),
        deep: acc.deep + (day.deepSleep || 0),
        rem: acc.rem + (day.remSleep || 0),
      }),
      { hours: 0, quality: 0, deep: 0, rem: 0 }
    );
    const averageHours = Math.round((sum.hours / data.length) * 10) / 10;
    const averageQuality = Math.round(sum.quality / data.length);
    const averageDeep = Math.round((sum.deep / data.length) * 10) / 10;
    const averageREM = Math.round((sum.rem / data.length) * 10) / 10;
    const deepPercent = averageHours ? Math.round((averageDeep / averageHours) * 100) : 0;
    const remPercent = averageHours ? Math.round((averageREM / averageHours) * 100) : 0;
    return { averageHours, averageQuality, averageDeep, averageREM, deepPercent, remPercent };
  };

  return {
    lastNight: lastNightEntry ? {
      hours: calculateSleepDuration(lastNightEntry.bedtime, lastNightEntry.waketime),
      quality: lastNightEntry.sleepQuality || 0,
      bedTime: lastNightEntry.bedtime,
      wakeTime: lastNightEntry.waketime,
      ...estimateSleepStages(
        calculateSleepDuration(lastNightEntry.bedtime, lastNightEntry.waketime),
        lastNightEntry.fellAsleepQuickly || false,
        lastNightEntry.wokeUpRefreshed || false
      ),
    } : null,
    weeklyData,
    monthlyData,
    averages: calculateAverages(weeklyData),
  };
};

interface LineTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
  }>;
  label?: string;
}

export const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [sleepData, setSleepData] = useState(processSleepData([]));
  const [entries, setEntries] = useState<SleepEntry[]>([]);

  useEffect(() => {
    const currentEntries = sleepStorage.getAllEntries();
    setEntries(currentEntries);
    setSleepData(processSleepData(currentEntries));
  }, []);

  // Add an event listener for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const currentEntries = sleepStorage.getAllEntries();
      setEntries(currentEntries);
      setSleepData(processSleepData(currentEntries));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const data = period === "week" ? sleepData.weeklyData : sleepData.monthlyData;

  const LineTooltip = ({ active, payload, label }: LineTooltipProps) => {
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

  const BarTooltip: React.FC<BarTooltipProps> = ({ active, payload, label }) => {
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

      {sleepData.lastNight ? (
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
                    total={sleepData.lastNight.hours || 1}
                  color="bg-[#892EFF]"
                />
                <SleepBar
                  label="Light Sleep"
                  value={sleepData.lastNight.lightSleep}
                    total={sleepData.lastNight.hours || 1}
                  color="bg-[#84BAFD]"
                />
                <SleepBar
                  label="REM Sleep"
                  value={sleepData.lastNight.remSleep}
                    total={sleepData.lastNight.hours || 1}
                  color="bg-[#C439FF]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      ) : (
        <Card className="sleep-card">
          <CardHeader>
            <CardTitle>No Sleep Data Available</CardTitle>
            <CardDescription>Log your first sleep entry to see your insights for last night's sleep</CardDescription>
          </CardHeader>
        </Card>
      )}

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
          {data.length > 0 ? (
            <>
          <Card className="sleep-card">
            <CardHeader>
              <CardTitle>Weekly Sleep Overview</CardTitle>
              <CardDescription>Your sleep patterns for the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="day"
                          tick={{ fontSize: 12 }}
                          interval={0}
                        />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<LineTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="hours"
                      name="Sleep Hours"
                          stroke="#892EFF"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="quality"
                      name="Sleep Quality %"
                          stroke="#00CFFF"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

              {/* Weekly Sleep Stages Bar Graph */}
          <Card className="sleep-card">
            <CardHeader>
              <CardTitle>Weekly Sleep Stages</CardTitle>
              <CardDescription>Breakdown of your sleep phases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-lg">
                <Card className="sleep-card">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Avg. Sleep Duration</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-3xl font-bold">{sleepData.averages.averageHours} hrs</div>
                    <div className="text-base text-muted-foreground">Optimal</div>
                  </CardContent>
                </Card>
                <Card className="sleep-card">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Avg. Sleep Quality</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-3xl font-bold">{sleepData.averages.averageQuality}%</div>
                    <div className="text-base text-muted-foreground">Excellent</div>
                  </CardContent>
                </Card>
                <Card className="sleep-card">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Avg. Deep Sleep</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-3xl font-bold">{sleepData.averages.averageDeep} hrs</div>
                    <div className="text-base text-muted-foreground">{sleepData.averages.deepPercent}% of total sleep</div>
                  </CardContent>
                </Card>
                <Card className="sleep-card">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Avg. REM Sleep</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-3xl font-bold">{sleepData.averages.averageREM} hrs</div>
                    <div className="text-base text-muted-foreground">{sleepData.averages.remPercent}% of total sleep</div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card className="sleep-card">
              <CardHeader>
                <CardTitle>No Data Available</CardTitle>
                <CardDescription>Log your sleep to see your weekly patterns</CardDescription>
              </CardHeader>
            </Card>
          )}
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
                  <LineChart data={sleepData.monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-lg">
            <Card className="sleep-card">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Avg. Sleep Duration</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">{sleepData.averages.averageHours} hrs</div>
                <div className="text-base text-muted-foreground">Optimal</div>
              </CardContent>
            </Card>
            <Card className="sleep-card">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Avg. Sleep Quality</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">{sleepData.averages.averageQuality}%</div>
                <div className="text-base text-muted-foreground">Excellent</div>
              </CardContent>
            </Card>
            <Card className="sleep-card">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Avg. Deep Sleep</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">{sleepData.averages.averageDeep} hrs</div>
                <div className="text-base text-muted-foreground">{sleepData.averages.deepPercent}% of total sleep</div>
              </CardContent>
            </Card>
            <Card className="sleep-card">
              <CardHeader className="p-4">
                <CardTitle className="text-base">Avg. REM Sleep</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">{sleepData.averages.averageREM} hrs</div>
                <div className="text-base text-muted-foreground">{sleepData.averages.remPercent}% of total sleep</div>
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
                  <BarChart data={sleepData.monthlyData.slice(-7)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
