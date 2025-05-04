export interface SleepStages {
  deepSleep: number;
  lightSleep: number;
  remSleep: number;
}

export const estimateSleepStages = (
  bedtime: string,
  waketime: string,
  sleepQuality: number,
  interruptions: number,
  fellAsleepQuickly: boolean,
  wokeUpRefreshed: boolean
): SleepStages => {
  // Calculate total sleep time in hours
  const totalSleep = (new Date(`1970-01-01T${waketime}`) - new Date(`1970-01-01T${bedtime}`)) / (1000 * 60 * 60);

  // Adjust for interruptions (10 minutes per interruption)
  let effectiveSleep = totalSleep - (interruptions * 10 / 60);

  // Adjust for sleep quality
  effectiveSleep = effectiveSleep * (sleepQuality / 100);

  // Calculate sleep stage percentages based on sleep quality factors
  const deepPercent = fellAsleepQuickly ? 0.2 : 0.15;
  const remPercent = wokeUpRefreshed ? 0.25 : 0.2;
  const lightPercent = 1 - (deepPercent + remPercent);

  // Calculate actual hours for each sleep stage
  const deepSleep = effectiveSleep * deepPercent;
  const lightSleep = effectiveSleep * lightPercent;
  const remSleep = effectiveSleep * remPercent;

  return {
    deepSleep: Number(deepSleep.toFixed(2)),
    lightSleep: Number(lightSleep.toFixed(2)),
    remSleep: Number(remSleep.toFixed(2)),
  };
};