# 🎮 Pac-Man Easter Egg

A fully playable Pac-Man game hidden within the OC.HiddenDashboard extension!

## How to Play

1. Enter the Konami code: **↑ ↑ ↓ ↓ ← →**
2. The Hidden Dashboard will appear
3. Click on **"Pac-Man"** in the sidebar
4. Click **"Start Game"** and use arrow keys to play!

## Game Features

### Classic Gameplay
- ✅ Authentic Pac-Man movement and controls
- ✅ 4 Ghosts with chase AI (Blinky, Pinky, Inky, Clyde)
- ✅ Power pellets to turn the tables on ghosts
- ✅ Score tracking with persistent high score
- ✅ 3 lives per game
- ✅ Classic maze layout with dots and walls

### Controls
- **Arrow Keys**: Move Pac-Man
- **P or Space**: Pause/Resume game
- **Start Game Button**: Begin a new game

### Scoring
- **Dot**: 10 points
- **Power Pellet**: 50 points
- **Ghost (during power mode)**: 200 points
- **Life Bonus (on win)**: 1000 points per life remaining

### Game States
- **Start Screen**: Instructions and start button
- **Playing**: Active gameplay
- **Paused**: Game frozen, press P/Space to continue
- **Game Over**: No lives remaining
- **Won**: All dots collected! Bonus points awarded

## Technical Details

### Implementation
- Canvas-based rendering for smooth graphics
- 60 FPS animation loop
- Tile-based collision detection
- Simple AI for ghost movement (chase when not powered, flee/random when powered)
- LocalStorage for high score persistence

### Features for Developers
- Clean TypeScript implementation
- Lit Element web component
- Fully typed game state
- Observable state management
- Responsive design

### Customization
The game can be easily modified:
- Change maze layout by editing `levelDesign` array
- Adjust difficulty by changing `moveSpeed` (lower = faster)
- Modify ghost colors and count
- Add power-up duration or new game mechanics

## Easter Egg Inception

This Pac-Man game is itself an example of the extensibility system! It demonstrates:
- How to create interactive content
- Canvas-based game rendering in Umbraco
- State management in Lit components
- Keyboard event handling
- LocalStorage integration

## Fun Facts

- The maze is 20x21 tiles
- Ghosts use different strategies based on power mode
- Power mode lasts 30 moves (about 4.5 seconds)
- High scores persist across browser sessions
- The mouth animation alternates every frame

## Why Pac-Man?

Pac-Man is the perfect hidden easter egg because:
- It's instantly recognizable
- It's fun and nostalgic
- It shows what's possible with the extension system
- It's a great stress reliever for developers!

---

**Now go get that high score! 🏆**

*Waka waka waka...*
