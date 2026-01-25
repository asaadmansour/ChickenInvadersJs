export const WAVE_CONFIGS = [
  // Wave 1
  {
    type: "chicken",
    title: "CHICKEN INVASION",
    rows: 2,
    cols: 12,
    spacingXRatio: 0.07, // ~100px on 1300px width screen
    spacingYRatio: 0.1, // ~80px on 800px height screen
    startYRatio: 0.06, // ~50px on 800px height screen
    eggsDropRate: 0.001,
  },
  // Wave 2
  {
    type: "rock",
    title: "METEOR SHOWER",
    count: 30,
    minSpawnInterval: 500,
    maxSpawnInterval: 1500,
    minSpeedFactor: 0.8, // 80% speed (Slow rocks)
    maxSpeedFactor: 1.5, // 150% speed (Fast rocks)
  },
  // Wave 3
  {
    type: "umbrellaChicken",
    title: "ARMORED CHICKENS",
    count: 35,
    eggsDropRate: 0.0015,

    minSpawnInterval: 600,
    maxSpawnInterval: 1200,
    minSpeedFactor: 0.8, // 80% speed (Slow umbrella chickens)
    maxSpeedFactor: 1.3, // 130% speed (Fast umbrella chickens)
  },
  // Wave 4 - Boss Fight
  {
    type: "boss",
    title: "THE FINAL BOSS",
  },
];