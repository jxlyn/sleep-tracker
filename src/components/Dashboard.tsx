
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Moon, Sun, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock data for dashboard
const sleepData = {
  lastNight: {
    hours: 7.5,
    quality: 85,
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

export const Dashboard: React.FC = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sleep Dashboard</h1>
          <p className="text-muted-foreground">{formattedDate}</p>
        </div>
        <Link to="/log">
          <Button className="bg-sleep-medium hover:bg-sleep-deep">
            <Moon className="mr-2 h-4 w-4" />
            Log Sleep
          </Button>
        </Link>
      </div>

      {/* Sleep Summary Card */}
      <Card className="sleep-card">
        <CardHeader className="pb-2">
          <CardTitle>Last Night's Sleep</CardTitle>
          <CardDescription>
            {sleepData.lastNight.bedTime} - {sleepData.lastNight.wakeTime}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sleep Duration */}
            <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
              <Clock className="h-8 w-8 text-sleep-medium mb-2" />
              <h3 className="text-2xl font-bold">{sleepData.lastNight.hours}h</h3>
              <p className="text-sm text-muted-foreground">Total Sleep</p>
            </div>

            {/* Sleep Quality */}
            <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
              <div className="relative w-16 h-16 mb-2">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle 
                    cx="18" 
                    cy="18" 
                    r="16" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeDasharray="100" 
                    strokeDashoffset="0" 
                    className="text-muted" 
                  />
                  <circle 
                    cx="18" 
                    cy="18" 
                    r="16" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeDasharray="100" 
                    strokeDashoffset={100 - sleepData.lastNight.quality} 
                    className="text-sleep-medium" 
                    transform="rotate(-90 18 18)" 
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
                  {sleepData.lastNight.quality}%
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Sleep Quality</p>
            </div>

            {/* Sleep Cycle */}
            <div className="flex flex-col justify-center p-4 bg-secondary rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Sleep Cycle</h4>
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Deep Sleep</span>
                    <span>{sleepData.lastNight.deepSleep}h</span>
                  </div>
                  <div className="relative w-full">
                    <Progress value={sleepData.lastNight.deepSleep / sleepData.lastNight.hours * 100} className="h-2 bg-muted" />
                    <div className="absolute inset-0 bg-sleep-darkBlue rounded-full" style={{ width: `${sleepData.lastNight.deepSleep / sleepData.lastNight.hours * 100}%`, height: "100%" }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Light Sleep</span>
                    <span>{sleepData.lastNight.lightSleep}h</span>
                  </div>
                  <div className="relative w-full">
                    <Progress value={sleepData.lastNight.lightSleep / sleepData.lastNight.hours * 100} className="h-2 bg-muted" />
                    <div className="absolute inset-0 bg-sleep-medium rounded-full" style={{ width: `${sleepData.lastNight.lightSleep / sleepData.lastNight.hours * 100}%`, height: "100%" }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>REM Sleep</span>
                    <span>{sleepData.lastNight.remSleep}h</span>
                  </div>
                  <div className="relative w-full">
                    <Progress value={sleepData.lastNight.remSleep / sleepData.lastNight.hours * 100} className="h-2 bg-muted" />
                    <div className="absolute inset-0 bg-sleep-light rounded-full" style={{ width: `${sleepData.lastNight.remSleep / sleepData.lastNight.hours * 100}%`, height: "100%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Stats and Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Stats */}
        <Card className="sleep-card">
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
            <CardDescription>Your sleep trends this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Average Sleep</p>
                <p className="text-2xl font-bold">{sleepData.weeklyAverage.hours}h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Quality</p>
                <p className="text-2xl font-bold">{sleepData.weeklyAverage.quality}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sleep Streak</p>
                <p className="text-2xl font-bold">{sleepData.streak} days</p>
              </div>
            </div>
            <div className="h-36 flex items-end justify-between space-x-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                // Mock data for the sleep hours each day (random values between 5-9)
                const hours = Math.round((Math.random() * 4 + 5) * 10) / 10;
                const heightPercentage = (hours / 12) * 100;
                
                return (
                  <div key={day} className="flex flex-col items-center">
                    <div 
                      className={`w-8 rounded-t-md ${
                        i === 4 ? 'bg-sleep-medium' : 'bg-secondary'
                      }`} 
                      style={{ height: `${heightPercentage}%` }}
                    ></div>
                    <span className="text-xs mt-2">{day}</span>
                    <span className="text-xs text-muted-foreground">{hours}h</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sleep Tips */}
        <Card className="sleep-card">
          <CardHeader>
            <CardTitle>Sleep Suggestions</CardTitle>
            <CardDescription>Personalized tips for better sleep</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="mr-3 mt-1 p-1.5 bg-sleep-light/20 rounded-full">
                  <Moon className="h-4 w-4 text-sleep-medium" />
                </div>
                <div>
                  <p className="text-sm font-medium">Consistent sleep schedule</p>
                  <p className="text-xs text-muted-foreground">Try to go to bed around 11:00 PM for optimal rest</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 p-1.5 bg-sleep-light/20 rounded-full">
                  <Sun className="h-4 w-4 text-sleep-medium" />
                </div>
                <div>
                  <p className="text-sm font-medium">Morning sunlight exposure</p>
                  <p className="text-xs text-muted-foreground">Get 10-15 minutes of morning sun to regulate your body clock</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1 p-1.5 bg-sleep-light/20 rounded-full">
                  <Clock className="h-4 w-4 text-sleep-medium" />
                </div>
                <div>
                  <p className="text-sm font-medium">Limit screen time before bed</p>
                  <p className="text-xs text-muted-foreground">Avoid screens 1 hour before bedtime for better sleep quality</p>
                </div>
              </li>
            </ul>
            <Link to="/assessment" className="block mt-4">
              <Button variant="outline" className="w-full">
                Take Sleep Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
