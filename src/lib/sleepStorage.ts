import { v4 as uuidv4 } from 'uuid';
import { SleepStages, estimateSleepStages } from './sleepCalculations';

export interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  waketime: string;
  sleepQuality: number;
  interruptions: number;
  fellAsleepQuickly: boolean;
  wokeUpRefreshed: boolean;
  notes?: string;
  sleepStages?: SleepStages;
}

const STORAGE_KEY = 'sleep-tracker-entries';

const calculateSleepDuration = (bedtime: string, waketime: string) => {
  const bedDateTime = new Date(`2000-01-01T${bedtime}`);
  const wakeDateTime = new Date(`2000-01-01T${waketime}`);
  if (wakeDateTime <= bedDateTime) {
    wakeDateTime.setDate(wakeDateTime.getDate() + 1);
  }
  const durationMs = wakeDateTime.getTime() - bedDateTime.getTime();
  return Math.round(durationMs / (1000 * 60 * 60) * 100) / 100;
};

const estimateSleepStagesFixed = (totalSleep: number, fellAsleepQuickly: boolean, wokeUpRefreshed: boolean) => {
  const deepPercent = fellAsleepQuickly ? 0.2 : 0.15;
  const remPercent = wokeUpRefreshed ? 0.25 : 0.2;
  const deepSleep = totalSleep * deepPercent;
  const remSleep = totalSleep * remPercent;
  const lightSleep = totalSleep - (deepSleep + remSleep);
  return {
    deepSleep: Math.max(0, Number(deepSleep.toFixed(2))),
    lightSleep: Math.max(0, Number(lightSleep.toFixed(2))),
    remSleep: Math.max(0, Number(remSleep.toFixed(2))),
  };
};

export const sleepStorage = {
  // Save a new sleep entry
  saveEntry: (entry: Omit<SleepEntry, 'id'>) => {
    const entries = sleepStorage.getAllEntries();

    // Check if there's an existing entry with the same date, bedtime, and waketime
    const existingEntryIndex = entries.findIndex(
      e => e.date === entry.date &&
           e.bedtime === entry.bedtime &&
           e.waketime === entry.waketime
    );

    const newEntry = { ...entry, id: uuidv4() };

    if (existingEntryIndex !== -1) {
      // Update existing entry
      entries[existingEntryIndex] = newEntry;
    } else {
      // Add new entry
      entries.push(newEntry);
    }

    // Sort entries by date and time
    entries.sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;

      // If same date, sort by bedtime
      const bedtimeCompare = a.bedtime.localeCompare(b.bedtime);
      if (bedtimeCompare !== 0) return bedtimeCompare;

      // If same bedtime, sort by waketime
      return a.waketime.localeCompare(b.waketime);
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return newEntry;
  },

  // Get all sleep entries
  getAllEntries: (): SleepEntry[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Get entries for a specific date range
  getEntriesByDateRange: (startDate: string, endDate: string): SleepEntry[] => {
    const entries = sleepStorage.getAllEntries();
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
    });
  },

  // Update an existing entry
  updateEntry: (id: string, updatedEntry: Partial<SleepEntry>) => {
    const entries = sleepStorage.getAllEntries();
    const index = entries.findIndex(entry => entry.id === id);
    if (index !== -1) {
      entries[index] = { ...entries[index], ...updatedEntry };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      return entries[index];
    }
    return null;
  },

  // Delete an entry
  deleteEntry: (id: string) => {
    const entries = sleepStorage.getAllEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
  },

  // Export sleep entries to CSV
  exportToCSV: (): string => {
    const entries = sleepStorage.getAllEntries();
    if (entries.length === 0) return '';

    // CSV header
    const headers = [
      'Date',
      'Bedtime',
      'Waketime',
      'Sleep Quality',
      'Interruptions',
      'Fell Asleep Quickly',
      'Woke Up Refreshed',
      'Notes',
      'Deep Sleep',
      'Light Sleep',
      'REM Sleep'
    ];

    // Convert entries to CSV rows
    const rows = entries.map(entry => {
      // Calculate total sleep
      const totalSleep = calculateSleepDuration(entry.bedtime, entry.waketime);
      // Use fixed sleep stage calculation
      const sleepStages = estimateSleepStagesFixed(totalSleep, entry.fellAsleepQuickly, entry.wokeUpRefreshed);
      return [
        entry.date,
        entry.bedtime,
        entry.waketime,
        entry.sleepQuality,
        entry.interruptions,
        entry.fellAsleepQuickly ? 'Yes' : 'No',
        entry.wokeUpRefreshed ? 'Yes' : 'No',
        entry.notes || '',
        sleepStages.deepSleep,
        sleepStages.lightSleep,
        sleepStages.remSleep
      ];
    });

    // Combine header and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  },

  // Import sleep entries from CSV
  importFromCSV: (csvContent: string): { success: boolean; message: string } => {
    try {
      const lines = csvContent.split('\n');
      if (lines.length < 2) {
        return { success: false, message: 'CSV file is empty or invalid' };
      }

      const headers = lines[0].split(',');
      const entries: Omit<SleepEntry, 'id'>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length < 8) continue;

        // Find indexes for sleep stages if present
        const deepSleepIdx = headers.indexOf('Deep Sleep');
        const lightSleepIdx = headers.indexOf('Light Sleep');
        const remSleepIdx = headers.indexOf('REM Sleep');

        const sleepStages = (deepSleepIdx !== -1 && lightSleepIdx !== -1 && remSleepIdx !== -1)
          ? {
              deepSleep: parseFloat(values[deepSleepIdx]) || 0,
              lightSleep: parseFloat(values[lightSleepIdx]) || 0,
              remSleep: parseFloat(values[remSleepIdx]) || 0
            }
          : undefined;

        const entry: Omit<SleepEntry, 'id'> = {
          date: values[0],
          bedtime: values[1],
          waketime: values[2],
          sleepQuality: parseInt(values[3]) || 0,
          interruptions: parseInt(values[4]) || 0,
          fellAsleepQuickly: values[5].toLowerCase() === 'yes',
          wokeUpRefreshed: values[6].toLowerCase() === 'yes',
          notes: values[7] || undefined,
          sleepStages
        };

        entries.push(entry);
      }

      // Save all imported entries
      entries.forEach(entry => sleepStorage.saveEntry(entry));

      return {
        success: true,
        message: `Successfully imported ${entries.length} sleep entries`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error importing CSV file. Please check the format.'
      };
    }
  }
};