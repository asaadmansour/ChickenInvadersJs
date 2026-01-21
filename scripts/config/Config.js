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
];
