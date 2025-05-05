import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { userStorage, UserPreferences } from '@/lib/userStorage';
import { sleepStorage } from '@/lib/sleepStorage';

export const ProfilePage: React.FC = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  React.useEffect(() => {
    const savedPreferences = userStorage.getPreferences();
    setPreferences(savedPreferences);

    // Get user ID from localStorage or your auth system
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

  return (
    <div className="w-full max-w-2xl mx-auto py-2 px-2 sm:py-8 sm:px-4">
      <Card className="sleep-card w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl">Profile Settings</CardTitle>
          <CardDescription className="text-sm sm:text-base">Manage your account preferences and sleep data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-8 text-sm">
          <div className="space-y-3 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold">User Preferences</h3>
            <div className="space-y-1 sm:space-y-4">
              <Label htmlFor="name" className="text-sm sm:text-base font-semibold">Name</Label>
              <Input
                id="name"
                className="text-sm sm:text-lg h-8 sm:h-10 w-full"
                value={preferences?.name || ''}
                onChange={(e) => setPreferences({ ...preferences!, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-1 sm:space-y-4">
              <Label htmlFor="dailySleepGoal" className="text-sm sm:text-base font-semibold">Daily Sleep Goal (hours)</Label>
              <Input
                id="dailySleepGoal"
                type="number"
                className="text-sm sm:text-lg h-8 sm:h-10 w-full"
                value={preferences?.dailySleepGoal || 8}
                onChange={(e) => setPreferences({ ...preferences!, dailySleepGoal: parseInt(e.target.value) })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-1 sm:space-y-4">
              <Label htmlFor="preferredBedtime" className="text-sm sm:text-base font-semibold">Preferred Bedtime</Label>
              <Input
                id="preferredBedtime"
                type="time"
                className="text-sm sm:text-lg h-8 sm:h-10 w-full"
                value={preferences?.preferredBedtime || '22:30'}
                onChange={(e) => setPreferences({ ...preferences!, preferredBedtime: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="flex justify-end pt-2">
              {isEditing ? (
                <Button onClick={handleSavePreferences} className="bg-sleep-medium hover:bg-sleep-deep text-sm h-8 px-4 sm:px-6 w-full sm:w-auto">
                  Save Changes
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="text-sm h-8 px-4 sm:px-6 w-full sm:w-auto">
                  Edit Preferences
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3 sm:space-y-6 pt-4 sm:pt-8 border-t">
            <h3 className="text-base sm:text-lg font-bold">Data Management</h3>
            <div className="space-y-3 sm:space-y-6">
              <div className="flex flex-col space-y-1 sm:space-y-4">
                <Label className="text-sm sm:text-base font-semibold">Export Sleep Data</Label>
                <Button onClick={handleExportData} variant="outline" className="w-full text-sm h-8">
                  Export to CSV
                </Button>
              </div>
              <div className="flex flex-col space-y-1 sm:space-y-4">
                <Label className="text-sm sm:text-base font-semibold">Import Sleep Data</Label>
                <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleImportData}
                    className="flex-1 text-sm h-8"
                  />
                  <Button
                    variant="outline"
                    disabled={!importFile}
                    className="text-sm h-8"
                  >
                    Import
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Import a CSV file containing your sleep data. The file should match the format of exported data.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
