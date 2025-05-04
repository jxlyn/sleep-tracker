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

  React.useEffect(() => {
    const savedPreferences = userStorage.getPreferences();
    setPreferences(savedPreferences);
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
    const csvContent = sleepStorage.exportToCSV();
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

  const handleImportData = async () => {
    if (!importFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import.",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await importFile.text();
      const result = sleepStorage.importFromCSV(text);

      toast({
        title: result.success ? "Import successful" : "Import failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });

      if (result.success) {
        setImportFile(null);
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: "An error occurred while importing the file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="sleep-card">
        <CardHeader>
          <CardTitle className="text-3xl">Profile Settings</CardTitle>
          <CardDescription className="text-xl">Manage your account preferences and sleep data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 text-lg">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">User Preferences</h3>
            <div className="space-y-4">
              <Label htmlFor="name" className="text-xl font-semibold">Name</Label>
              <Input
                id="name"
                className="text-3xl h-16"
                value={preferences?.name || ''}
                onChange={(e) => setPreferences({ ...preferences!, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="dailySleepGoal" className="text-xl font-semibold">Daily Sleep Goal (hours)</Label>
              <Input
                id="dailySleepGoal"
                type="number"
                className="text-3xl h-16"
                value={preferences?.dailySleepGoal || 8}
                onChange={(e) => setPreferences({ ...preferences!, dailySleepGoal: parseInt(e.target.value) })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="preferredBedtime" className="text-xl font-semibold">Preferred Bedtime</Label>
              <Input
                id="preferredBedtime"
                type="time"
                className="text-3xl h-16"
                value={preferences?.preferredBedtime || '22:30'}
                onChange={(e) => setPreferences({ ...preferences!, preferredBedtime: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="flex justify-end">
              {isEditing ? (
                <Button onClick={handleSavePreferences} className="bg-sleep-medium hover:bg-sleep-deep text-lg h-12 px-8">
                  Save Changes
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="text-lg h-12 px-8">
                  Edit Preferences
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t">
            <h3 className="text-2xl font-bold">Data Management</h3>
            <div className="space-y-6">
              <div className="flex flex-col space-y-4">
                <Label className="text-xl font-semibold">Export Sleep Data</Label>
                <Button onClick={handleExportData} variant="outline" className="w-full text-lg h-12">
                  Export to CSV
                </Button>
              </div>
              <div className="flex flex-col space-y-4">
                <Label className="text-xl font-semibold">Import Sleep Data</Label>
                <div className="flex space-x-2">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    className="flex-1 text-lg h-12"
                  />
                  <Button
                    onClick={handleImportData}
                    variant="outline"
                    disabled={!importFile}
                    className="text-lg h-12"
                  >
                    Import
                  </Button>
                </div>
                <p className="text-base text-muted-foreground">
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
