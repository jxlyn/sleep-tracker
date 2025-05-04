export interface UserPreferences {
  name: string;
  dailySleepGoal: number;
  preferredBedtime: string;
}

const STORAGE_KEY = 'sleep-tracker-user';

export const userStorage = {
  // Save user preferences
  savePreferences: (preferences: UserPreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  },

  // Get user preferences
  getPreferences: (): UserPreferences | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Update user preferences
  updatePreferences: (updatedPreferences: Partial<UserPreferences>) => {
    const currentPreferences = userStorage.getPreferences();
    if (currentPreferences) {
      const newPreferences = { ...currentPreferences, ...updatedPreferences };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      return newPreferences;
    }
    return null;
  }
};