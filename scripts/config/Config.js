export const WAVE_CONFIGS = [
  // Wave 1
  {
    type: "chicken",
    rows: 2,
    cols: 13,
    spacingX: 100,
    spacingY: 80,
    startY: 50,
    eggsDropRate: 0.001,
  },
  // Wave 2
  {
    type: "rock",
    count: 40,
    minSpawnInterval: 500,
    maxSpawnInterval: 1500,
    minSpeedFactor: 0.8, // 80% speed (Slow rocks)
    maxSpeedFactor: 1.5, // 150% speed (Fast rocks)
  },
  // Wave 3
  {
    type: "umbrellaChicken",
    count: 35,
    eggsDropRate: 0.0015,

    minSpawnInterval: 600,
    maxSpawnInterval: 1200,
    minSpeedFactor: 0.8, // 80% speed (Slow umbrella chickens)
    maxSpeedFactor: 1.3, // 130% speed (Fast umbrella chickens)
  },
];
