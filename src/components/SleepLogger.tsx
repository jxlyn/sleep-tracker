import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, BedDouble, AlarmClock } from "lucide-react";
import { sleepStorage, SleepEntry } from "@/lib/sleepStorage";
import { estimateSleepStages } from "@/lib/sleepCalculations";
import { useNavigate } from "react-router-dom";

export const SleepLogger: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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

    // Calculate sleep stages
    const sleepStages = estimateSleepStages(
      bedtime,
      wakeTime,
      sleepQuality,
      sleepInterruptions,
      fellAsleepQuickly,
      wokeRefreshed
    );

    // Create sleep entry
    const sleepEntry: Omit<SleepEntry, 'id'> = {
      date,
      bedtime,
      waketime: wakeTime,
      sleepQuality,
      interruptions: sleepInterruptions,
      fellAsleepQuickly,
      wokeUpRefreshed: wokeRefreshed,
      notes,
      sleepStages
    };

    // Save to storage
    sleepStorage.saveEntry(sleepEntry);

    // Show success message
    toast({
      title: "Sleep logged successfully",
      description: "Your sleep data has been recorded.",
    });

    // Wait 1 second, then navigate
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-2 sm:py-8 sm:px-4">
        <Card className="sleep-card w-full">
          <CardHeader>
          <CardTitle>Log Your Sleep</CardTitle>
          <CardDescription>Record your sleep details for better insights</CardDescription>
          </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Bedtime and Wake Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
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
            <div className="space-y-2 sm:space-y-4">
              <div className="flex justify-between items-center">
                <Label>Sleep Quality</Label>
                <span className="text-lg font-semibold">{sleepQuality}%</span>
              </div>
              <div className="py-2 sm:py-4">
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
            <div className="space-y-2 sm:space-y-4">
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
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes about your sleep..."
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-sleep-medium hover:bg-sleep-deep">
              Save Sleep Log
            </Button>
          </CardFooter>
        </form>
        </Card>
    </div>
  );
};

export default SleepLogger;
