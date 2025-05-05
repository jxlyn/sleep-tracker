import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { userStorage, UserPreferences } from '@/lib/userStorage';
import { sleepStorage } from '@/lib/sleepStorage';
import { UserCog } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  React.useEffect(() => {
    const savedPreferences = userStorage.getPreferences();
    setPreferences(savedPreferences);

    // Get user ID from localStorage
    const storedUserId = localStorage.getItem('user-id');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSavePreferences = () => {
    if (preferences) {
      userStorage.savePreferences(preferences);
      setIsEditing(false);
      toast({
        title: "Preferences saved",
        description: "Your preferences have been updated successfully.",
      });
    }
  };

  const handleExportData = () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to export data.",
        variant: "destructive",
      });
      return;
    }

    const csvContent = sleepStorage.exportToCSV(userId);
    if (!csvContent) {
      toast({
        title: "No data to export",
        description: "You don't have any sleep data to export.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sleep-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Data exported",
      description: "Your sleep data has been exported successfully.",
    });
  };

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please sign in to import data.",
        variant: "destructive",
      });
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvContent = event.target?.result as string;
      if (!csvContent) return;

      const result = sleepStorage.importFromCSV(csvContent, userId);
      if (result.success) {
        toast({
          title: "Data imported",
          description: result.message,
        });
      } else {
      toast({
        title: "Import failed",
          description: result.message,
        variant: "destructive",
      });
    }
    };
    reader.readAsText(file);
  };

  // Add logic to get user email and member since (example: from preferences or localStorage)
  const userEmail = localStorage.getItem('userEmail') || 'your@email.com';
  // Get real registration date
  const registered = localStorage.getItem('user-registered');
  let memberSince = 'Unknown';
  if (registered) {
    const date = new Date(registered);
    memberSince = date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }

  return (
    <>
      <div className="max-w-md mx-auto flex flex-col items-center py-6">
        <div className="rounded-full bg-sleep-darkBlue/30 p-3 mb-2">
          <UserCog className="w-14 h-14 text-sleep-medium" />
        </div>
        <div className="text-2xl font-bold">{preferences?.name || "Your Name"}</div>
        <div className="text-base text-muted-foreground">{userEmail}</div>
        <div className="text-sm text-muted-foreground">Member since {memberSince}</div>
      </div>
      <div className="w-full max-w-4xl mx-auto py-1 px-2 sm:py-8 sm:px-4">
        <Card className="sleep-card w-full">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm sm:text-lg">Profile Settings</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Manage your account preferences and sleep data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-8 text-xs">
            <div className="space-y-2 sm:space-y-6 max-w-md mx-auto">
              <h3 className="text-sm sm:text-base font-bold mt-6">User Preferences</h3>
              <div className="space-y-1 sm:space-y-4">
                <Label htmlFor="name" className="text-xs sm:text-sm font-semibold">Name</Label>
                <Input
                  id="name"
                  className="text-xs sm:text-sm h-7 sm:h-8 w-full"
                  value={preferences?.name || ''}
                  onChange={(e) => setPreferences({ ...preferences!, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-1 sm:space-y-4">
                <Label htmlFor="dailySleepGoal" className="text-xs sm:text-sm font-semibold">Daily Sleep Goal (hours)</Label>
                <select
                  id="dailySleepGoal"
                  value={preferences?.dailySleepGoal || 8}
                  onChange={e => setPreferences({ ...preferences!, dailySleepGoal: parseInt(e.target.value) })}
                  disabled={!isEditing}
                  className="text-xs sm:text-sm h-7 sm:h-8 w-full rounded-md border border-input bg-background px-2 py-1"
                >
                  {Array.from({ length: 25 }, (_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                  <option key={24} value={24}>24</option>
                </select>
              </div>
              <div className="space-y-1 sm:space-y-4">
                <Label htmlFor="preferredBedtime" className="text-xs sm:text-sm font-semibold">Preferred Bedtime</Label>
                <Input
                  id="preferredBedtime"
                  type="time"
                  className="text-xs sm:text-sm h-7 sm:h-8 w-full"
                  value={preferences?.preferredBedtime || '22:30'}
                  onChange={(e) => setPreferences({ ...preferences!, preferredBedtime: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex justify-end pt-1">
                {isEditing ? (
                  <Button onClick={handleSavePreferences} className="bg-sleep-medium hover:bg-sleep-deep text-xs h-7 px-3 sm:px-4 w-full sm:w-auto">
                    Save Changes
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="text-xs h-7 px-3 sm:px-4 w-full sm:w-auto">
                    Edit Preferences
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2 sm:space-y-6 pt-3 sm:pt-8 border-t max-w-md mx-auto">
              <h3 className="text-sm sm:text-base font-bold">Data Management</h3>
              <div className="space-y-2 sm:space-y-6">
                <div className="flex flex-col space-y-1 sm:space-y-4">
                  <Label className="text-xs sm:text-sm font-semibold">Export Sleep Data</Label>
                  <Button onClick={handleExportData} variant="outline" className="w-full text-xs h-7">
                    Export to CSV
                  </Button>
                </div>
                <div className="flex flex-col space-y-1 sm:space-y-4">
                  <Label className="text-xs sm:text-sm font-semibold">Import Sleep Data</Label>
                  <div className="flex flex-col sm:flex-row gap-1 sm:space-x-2">
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleImportData}
                      className="flex-1 text-xs h-9"
                    />
                    <Button
                      variant="outline"
                      disabled={!importFile}
                      className="text-xs h-7"
                    >
                      Import
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Import a CSV file containing your sleep data. The file should match the format of exported data.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProfilePage;
