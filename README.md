# 🐔 Chicken Invaders JS

A modern web-based remake of the classic Chicken Invaders game, built with vanilla JavaScript and HTML5 Canvas. Battle waves of intergalactic chickens hell-bent on revenge against humanity for our oppression of Earth chickens!

## 🎮 About The Game

**Chicken Invaders JS** is a vertical scrolling shooter where you pilot a spacecraft defending Earth from an army of vengeful space chickens. The game features:

- **4 Progressive Waves** with increasing difficulty
- **Multiple Enemy Types**: Regular chickens, armored umbrella chickens, meteor rocks, and a massive boss chicken
- **Power-ups**: Collect fried chicken for points
- **Dynamic Soundtrack**: Immersive audio effects and background music
- **Responsive Design**: Scales perfectly across different screen sizes
- **Global Leaderboard**: Firebase

-integrated scoreboard to compete with players worldwide

### How to Play

- **Move**: Arrow Keys or WASD
- **Shoot**: Spacebar
- **Pause**: P or ESC
- **Objective**: Survive all waves, collect power-ups, avoid enemy fire, and achieve the highest score!

---

## 🏗️ Architecture Overview

The game follows a **modular, object-oriented architecture** with clear separation of concerns. The codebase is organized into logical layers:

```
scripts/
├── core/           # Core game engine and systems
├── entities/       # Game objects (Player, Enemies, Projectiles)
├── config/         # Configuration and constants
├── services/       # External services (Firebase)
├── utils/          # Utility functions and helpers
└── pages/          # Page-specific scripts
```

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Game Loop                          │
│              (requestAnimationFrame)                    │
└────────────┬────────────────────────────────────────────┘
             │
             ├──► InputHandler ──► Player Actions
             │
             ├──► GameState ──► Centralized State Management
             │
             ├──► WaveController ──► Enemy Spawning Logic
             │
             ├──► CollisionDetector ──► Physics & Interactions
             │
             ├──► CanvasManager ──► Rendering System
             │
             └──► AudioManager ──► Sound System
```

---

## 🎨 Design Patterns Implemented

### 1. **Singleton Pattern**

**Used in**: `CanvasManager`, `AudioManager`, `GameState`

Ensures only one instance exists for critical game systems that need global access.

```javascript
// AudioManager.js
export class AudioManager {
  static instance;
  
  static getInstance() {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }
}
```

**Why**: These managers need to be accessed from multiple places but should maintain a single source of truth. For example, canvas dimensions or audio state shouldn't have conflicting instances.

### 2. **Abstract Base Class Pattern**

**Used in**: `GameObject` (base class for all game entities)

Defines a common interface and shared functionality for all game objects while enforcing implementation of critical methods.

```javascript
// GameObject.js
export class GameObject {
  constructor(x, y, moveSpeed) {
    if (new.target === GameObject) {
      throw new Error("GameObject is abstract and cannot be instantiated directly");
    }
    this.x = x;
    this.y = y;
    this.isActive = true;
  }
  
  // Abstract getters - must be overridden
  get width() {
    throw new Error("width getter must be implemented by subclass");
  }
  
  // Shared methods
  getBounds() { /* ... */ }
  clampToBounds() { /* ... */ }
}
```

**Why**: All entities (Player, Chicken, Bullet, etc.) share common properties (position, active state) and behaviors (collision bounds, deactivation) but have unique dimensions and movement patterns.

### 3. **Factory Pattern**

**Used in**: `WaveController` for spawning entities

Encapsulates the complex logic of creating different entity types and wave configurations.

```javascript
// WaveController.js
createWave(gameState) {
  const waveConfig = WAVE_CONFIGS[gameState.currentWave - 1];
  
  switch (waveConfig.type) {
    case "chickens":
      this.spawnChickens(gameState, waveConfig);
      break;
    case "rocks":
      this.spawnRocksOverTime(gameState, waveConfig);
      break;
    case "boss":
      this.spawnBoss(gameState, waveConfig);
      break;
  }
}
```

**Why**: Wave creation involves complex logic with different enemy types, spawn patterns, and configurations. The factory centralizes this complexity.

### 4. **Observer Pattern (Event-Driven)**

**Used in**: Input handling and UI updates

The `InputHandler` observes keyboard events and notifies the game of actions, while `HUDManager` observes game state changes.

```javascript
// InputHandler.js
bindKey(key, callback) {
  this.keyBindings[key] = callback;
}

processInput() {
  Object.entries(this.activeKeys).forEach(([key, isActive]) => {
    if (isActive && this.keyBindings[key]) {
      this.keyBindings[key]();
    }
  });
}
```

**Why**: Decouples input detection from game actions, making controls flexible and easy to rebind.

### 5. **State Pattern**

**Used in**: `GameState` for managing game status

The game has distinct states (playing, paused, gameover, complete) with different behaviors.

```javascript
// GameState.js
export class GameState {
  constructor() {
    this.status = "playing"; // playing | paused | gameover | complete
    this.isPaused = false;
    this.isCountdownActive = false;
    this.isWaveIntroActive = false;
  }
  
  pause() { this.isPaused = true; }
  resume() { this.isPaused = false; }
}
```

**Why**: Different game states require different update logic. For example, the game loop doesn't run when paused or during wave transitions.

### 6. **Strategy Pattern**

**Used in**: Different chicken movement patterns

Each chicken type implements its own movement strategy while sharing a common interface.

```javascript
// Chicken.js - Sinusoidal movement
move(gameTime) {
  this.x += this.moveSpeed * this.direction;
  this.y += Math.sin(gameTime * this.TIME_INCREMENT) * this.VERTICAL_RANGE;
  this.bounceHorizontally();
}

// BossChicken.js - Linear movement
move() {
  this.x += this.moveSpeed * this.direction;
  this.bounceHorizontally();
}
```

**Why**: Different enemy types need unique movement behaviors while maintaining polymorphism.

### 7. **Module Pattern**

**Used Throughout**: ES6 modules for encapsulation

Each file exports specific functionality and imports only what it needs.

```javascript
// Clean, modular imports
import { CanvasManager } from "./CanvasManager.js";
import { Player } from "../entities/Player.js";
import { WAVE_CONFIGS } from "../config/Config.js";
```

**Why**: Prevents global namespace pollution, enables tree-shaking, and makes dependencies explicit.

---

## 🎯 HTML5 Canvas Implementation

### Canvas Rendering System

The `CanvasManager` handles all canvas operations with a **layer-based rendering approach**:

```javascript
// CanvasManager.js
render(gameState) {
  this.clear();
  
  // Layer 1: Background
  this.drawBackground();
  
  // Layer 2: Effects
  gameState.deathEffects.forEach(effect => this.drawAnimatedSprite(effect));
  
  // Layer 3: Collectibles
  gameState.friedChickens.forEach(fc => this.drawSprite(fc));
  
  // Layer 4: Projectiles
  gameState.bullets.forEach(bullet => this.drawSprite(bullet));
  gameState.eggs.forEach(egg => this.drawSprite(egg));
  
  // Layer 5: Entities
  gameState.chickens.forEach(chicken => this.drawAnimatedSprite(chicken));
  gameState.rocks.forEach(rock => this.drawSprite(rock));
  
  // Layer 6: Player (always on top)
  this.drawSprite(gameState.player);
}
```

### Responsive Canvas

The canvas scales dynamically using a **resize observer**:

```javascript
setupAutoResize() {
  const resizeObserver = new ResizeObserver(() => {
    this.adjustCanvasResolution();
    this.onResizeAction?.(); // Notify game to reposition entities
  });
  
  resizeObserver.observe(this.canvas.parentElement);
}
```

### Sprite Animation

Animated sprites (chickens, boss, death effects) use **spritesheet-based frame animation**:

```javascript
drawAnimatedSprite(entity) {
  const sx = (entity.currentFrame % entity.COLS) * entity.FRAME_WIDTH;
  const sy = Math.floor(entity.currentFrame / entity.COLS) * entity.FRAME_HEIGHT;
  
  this.ctx.drawImage(
    entity.image,
    sx, sy,                          // Source position in spritesheet
    entity.FRAME_WIDTH, entity.FRAME_HEIGHT,
    entity.x, entity.y,              // Destination on canvas
    entity.width, entity.height
  );
  
  entity.updateFrame?.(); // Advance to next frame
}
```

### Collision Detection

Axis-Aligned Bounding Box (AABB) collision:

```javascript
// CollisionDetector.js
isColliding(entityA, entityB) {
  const boundsA = entityA.getBounds();
  const boundsB = entityB.getBounds();
  
  return (
    boundsA.x < boundsB.x + boundsB.width &&
    boundsA.x + boundsA.width > boundsB.x &&
    boundsA.y < boundsB.y + boundsB.height &&
    boundsA.y + boundsA.height > boundsB.y
  );
}
```

---

## 🎮 Game Flow

### 1. **Initialization**
```
User loads game.html
  ↓
Game constructor initializes managers (Singleton instances)
  ↓
GameState loads saved data (if paused) or creates new game
  ↓
setupControls() binds keyboard inputs
  ↓
init() creates Wave 1
```

### 2. **Game Loop** (60 FPS via requestAnimationFrame)
```
gameLoop() {
  → Process Input (InputHandler)
  → Update Positions (All entities move)
  → Spawn Enemies (WaveController checks timers)
  → Drop Projectiles (Random egg spawning)
  → Check Collisions (All vs All)
  → Remove Inactive Entities (Cleanup)
  → Check Wave Completion (Advance to next wave)
  → Render Frame (CanvasManager draws everything)
  → Schedule Next Frame (requestAnimationFrame)
}
```

### 3. **Wave Progression**
```
Wave 1: Regular Chickens → Spawn all at once
Wave 2: Meteor Rocks → Timed spawning
Wave 3: Umbrella Chickens → Timed spawning (2 lives each)
Wave 4: Boss Battle → Single boss chicken (15 lives)
  ↓
All waves complete → Victory screen
Lives reach 0 → Game Over screen
```

### 4. **State Transitions**
```
Playing → (ESC/P) → Paused → (Resume) → Playing
Playing → (Lives = 0) → Game Over
Playing → (Wave 4 complete) → Victory
```

---

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Rendering**: HTML5 Canvas API
- **Build Tool**: Vite (for development and production builds)
- **Backend**: Firebase Firestore (Leaderboard)
- **Deployment**: Netlify
- **Audio**: Web Audio API

---

## 📦 Getting Started

### Prerequisites

- **Node.js** v16+ and npm
- A Firebase project (for scoreboard feature)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/asaadmansour/ChickenInvadersJs.git
   cd ChickenInvadersJs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Get your Firebase credentials from [Firebase Console](https://console.firebase.google.com/) → Project Settings → Your apps → SDK setup and configuration
   
   Update `.env` with your values:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   The game will open at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   ```
   
   Output will be in the `dist/` folder.

### Deployment

#### Deploy to Netlify (Recommended)

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com) and click "Add new site"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variables in Netlify dashboard (Site settings → Environment variables)
6. Deploy!

#### Deploy to Vercel/Firebase Hosting

Same build process works for other platforms. Just ensure:
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables configured

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the game:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 Project Structure

```
ChickenInvadersJs/
├── assets/                 # Game assets
│   ├── audio/             # Sound effects and music
│   └── images/            # Sprites and backgrounds
├── css/                   # Stylesheets
├── pages/                 # HTML pages
│   ├── game.html         # Main game page
│   ├── gameover.html     # Win/Lose screen
│   └── scoreboard.html   # Global leaderboard
├── scripts/
│   ├── config/           # Game constants and configurations
│   ├── core/             # Game engine
│   │   ├── Game.js              # Main game class
│   │   ├── CanvasManager.js     # Canvas rendering
│   │   ├── InputHandler.js      # Keyboard input
│   │   ├── GameState.js         # State management
│   │   ├── WaveController.js    # Wave/spawn logic
│   │   ├── CollisionDetector.js # Physics
│   │   └── AudioManager.js      # Sound system
│   ├── entities/         # Game objects
│   │   ├── GameObject.js        # Abstract base class
│   │   ├── Player.js
│   │   ├── Chicken.js
│   │   ├── BossChicken.js
│   │   └── ...
│   ├── services/         # External services
│   └── utils/            # Helper functions
├── .env.example          # Environment variables template
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies

```

---

## 🙏 Acknowledgments

- Original Chicken Invaders game by InterAction studios
- Built as a learning project demonstrating modern JavaScript architecture
- Firebase for backend services
- Vite for blazing-fast development experience

---

**Made with ❤️ by [Asaad Mansour - Ahmed Wael - Adelrahman Ibrahim - Alaa Abdallah - Mohamed Sameh - Mohamed Nagy](https://github.com/asaadmansour)**

🎮 **Play Now**: [https://chickeninvadersjs.netlify.app](https://chickeninvadersjs.netlify.app)
