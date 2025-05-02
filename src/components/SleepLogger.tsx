
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, BedDouble, AlarmClock } from "lucide-react";

export const SleepLogger: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepQuality, setSleepQuality] = useState(70);
  const [sleepInterruptions, setSleepInterruptions] = useState(1);
  const [fellAsleepQuickly, setFellAsleepQuickly] = useState(true);
  const [wokeRefreshed, setWokeRefreshed] = useState(true);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate sleep duration
    const bedDateTime = new Date(`${date}T${bedtime}`);
    const wakeDateTime = new Date(`${date}T${wakeTime}`);
    
    // Adjust if wake time is on the next day
    if (wakeDateTime <= bedDateTime) {
      wakeDateTime.setDate(wakeDateTime.getDate() + 1);
    }
    
    const durationMs = wakeDateTime.getTime() - bedDateTime.getTime();
    const durationHours = Math.round(durationMs / (1000 * 60 * 60) * 10) / 10;
    
    const sleepData = {
      date,
      bedtime,
      wakeTime,
      durationHours,
      sleepQuality,
      sleepInterruptions,
      fellAsleepQuickly,
      wokeRefreshed,
      notes,
    };
    
    console.log("Sleep data logged:", sleepData);
    
    toast({
      title: "Sleep successfully logged",
      description: `You slept for ${durationHours} hours with ${sleepQuality}% quality`,
    });
    
    // Reset form or redirect as needed
  };

  return (
    <div className="animate-fade-in max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Log Your Sleep</h1>
        <p className="text-muted-foreground">Track your sleep patterns for better insights</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card className="sleep-card">
          <CardHeader>
            <CardTitle>Sleep Details</CardTitle>
            <CardDescription>Enter information about your sleep last night</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Date selection */}
            <div className="space-y-2">
              <Label htmlFor="sleep-date">Date</Label>
              <Input
                id="sleep-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full"
              />
            </div>
            
            {/* Sleep times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedtime" className="flex items-center">
                  <BedDouble className="h-4 w-4 mr-2 text-sleep-medium" />
                  Bedtime
                </Label>
                <Input
                  id="bedtime"
                  type="time"
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wake-time" className="flex items-center">
                  <AlarmClock className="h-4 w-4 mr-2 text-sleep-medium" />
                  Wake Time
                </Label>
                <Input
                  id="wake-time"
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Sleep Quality */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Sleep Quality</Label>
                <span className="text-lg font-semibold">{sleepQuality}%</span>
              </div>
              <div className="py-4">
                <Slider
                  value={[sleepQuality]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setSleepQuality(value[0])}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Poor</span>
                  <span>Average</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
            
            {/* Sleep Interruptions */}
            <div className="space-y-2">
              <Label htmlFor="interruptions">Number of Interruptions</Label>
              <Input
                id="interruptions"
                type="number"
                value={sleepInterruptions}
                onChange={(e) => setSleepInterruptions(parseInt(e.target.value) || 0)}
                min="0"
                className="w-full"
              />
            </div>
            
            {/* Sleep Experience Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="fell-asleep" className="cursor-pointer">
                  <span className="flex items-center">
                    <Moon className="h-4 w-4 mr-2 text-sleep-medium" />
                    Fell asleep quickly
                  </span>
                </Label>
                <Switch
                  id="fell-asleep"
                  checked={fellAsleepQuickly}
                  onCheckedChange={setFellAsleepQuickly}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="woke-refreshed" className="cursor-pointer">
                  <span className="flex items-center">
                    <Sun className="h-4 w-4 mr-2 text-sleep-medium" />
                    Woke up feeling refreshed
                  </span>
                </Label>
                <Switch
                  id="woke-refreshed"
                  checked={wokeRefreshed}
                  onCheckedChange={setWokeRefreshed}
                />
              </div>
            </div>
            
            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (optional)</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nightmares, stress, meditation before bed, etc."
                className="w-full min-h-[100px] p-2 border rounded-md bg-background border-input"
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full bg-sleep-medium hover:bg-sleep-deep">
              Save Sleep Log
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default SleepLogger;
