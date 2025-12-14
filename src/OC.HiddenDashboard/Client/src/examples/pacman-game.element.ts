import {
  LitElement,
  css,
  html,
  customElement,
  state,
  query,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";

interface Position {
  x: number;
  y: number;
}

interface Ghost {
  position: Position;
  direction: Position;
  color: string;
  name: string;
}

@customElement("oc-pacman-game")
export class PacmanGameElement extends UmbElementMixin(LitElement) {
  @query("#gameCanvas")
  private canvas!: HTMLCanvasElement;

  @state()
  private _score = 0;

  @state()
  private _lives = 3;

  @state()
  private _gameState: "start" | "playing" | "paused" | "gameover" | "won" = "start";

  @state()
  private _highScore = 0;

  private ctx!: CanvasRenderingContext2D;
  private pacman: Position = { x: 1, y: 1 };
  private direction: Position = { x: 0, y: 0 };
  private nextDirection: Position = { x: 0, y: 0 };
  private ghosts: Ghost[] = [];
  private maze: number[][] = [];
  private tileSize = 20;
  private animationId?: number;
  private lastMoveTime = 0;
  private moveSpeed = 150; // milliseconds per move
  private mouthOpen = true;
  private powerMode = false;
  private powerModeTimer = 0;

  // Maze layout: 0 = empty, 1 = wall, 2 = dot, 3 = power pellet
  private levelDesign = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 3, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 3, 1],
    [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  override connectedCallback() {
    super.connectedCallback();
    this._loadHighScore();
  }

  override firstUpdated() {
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = this.levelDesign[0].length * this.tileSize;
    this.canvas.height = this.levelDesign.length * this.tileSize;
    this._initGame();
  }

  private _loadHighScore() {
    const saved = localStorage.getItem("oc-pacman-highscore");
    if (saved) {
      this._highScore = parseInt(saved, 10);
    }
  }

  private _saveHighScore() {
    if (this._score > this._highScore) {
      this._highScore = this._score;
      localStorage.setItem("oc-pacman-highscore", this._highScore.toString());
    }
  }

  private _initGame() {
    // Copy maze
    this.maze = this.levelDesign.map((row) => [...row]);

    // Reset Pacman position
    this.pacman = { x: 1, y: 1 };
    this.direction = { x: 0, y: 0 };
    this.nextDirection = { x: 0, y: 0 };

    // Initialize ghosts
    this.ghosts = [
      { position: { x: 9, y: 9 }, direction: { x: 1, y: 0 }, color: "#FF0000", name: "Blinky" },
      { position: { x: 10, y: 9 }, direction: { x: -1, y: 0 }, color: "#FFB8FF", name: "Pinky" },
      { position: { x: 9, y: 10 }, direction: { x: 0, y: -1 }, color: "#00FFFF", name: "Inky" },
      { position: { x: 10, y: 10 }, direction: { x: 0, y: 1 }, color: "#FFB851", name: "Clyde" },
    ];

    this.powerMode = false;
    this.powerModeTimer = 0;

    this._draw();
  }

  private _startGame() {
    this._gameState = "playing";
    this._score = 0;
    this._lives = 3;
    this._initGame();
    this._gameLoop();
    this._setupKeyboardControls();
  }

  private _setupKeyboardControls() {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (this._gameState !== "playing") return;

      switch (e.key) {
        case "ArrowUp":
          this.nextDirection = { x: 0, y: -1 };
          e.preventDefault();
          break;
        case "ArrowDown":
          this.nextDirection = { x: 0, y: 1 };
          e.preventDefault();
          break;
        case "ArrowLeft":
          this.nextDirection = { x: -1, y: 0 };
          e.preventDefault();
          break;
        case "ArrowRight":
          this.nextDirection = { x: 1, y: 0 };
          e.preventDefault();
          break;
        case " ":
        case "p":
          this._togglePause();
          e.preventDefault();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    this.addController({
      hostConnected: () => {},
      hostDisconnected: () => {
        document.removeEventListener("keydown", handleKeyPress);
      },
    } as any);
  }

  private _togglePause() {
    if (this._gameState === "playing") {
      this._gameState = "paused";
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    } else if (this._gameState === "paused") {
      this._gameState = "playing";
      this._gameLoop();
    }
  }

  private _gameLoop() {
    const now = Date.now();

    if (now - this.lastMoveTime > this.moveSpeed) {
      this._update();
      this.lastMoveTime = now;
    }

    this._draw();

    if (this._gameState === "playing") {
      this.animationId = requestAnimationFrame(() => this._gameLoop());
    }
  }

  private _update() {
    // Try to change direction
    const nextX = this.pacman.x + this.nextDirection.x;
    const nextY = this.pacman.y + this.nextDirection.y;

    if (this._canMoveTo(nextX, nextY)) {
      this.direction = { ...this.nextDirection };
    }

    // Move Pacman
    const newX = this.pacman.x + this.direction.x;
    const newY = this.pacman.y + this.direction.y;

    if (this._canMoveTo(newX, newY)) {
      this.pacman.x = newX;
      this.pacman.y = newY;

      // Check for dots
      const tile = this.maze[newY][newX];
      if (tile === 2) {
        this.maze[newY][newX] = 0;
        this._score += 10;
        this._checkWin();
      } else if (tile === 3) {
        this.maze[newY][newX] = 0;
        this._score += 50;
        this._activatePowerMode();
        this._checkWin();
      }
    }

    // Update power mode timer
    if (this.powerMode) {
      this.powerModeTimer--;
      if (this.powerModeTimer <= 0) {
        this.powerMode = false;
      }
    }

    // Move ghosts
    this._moveGhosts();

    // Check collisions
    this._checkGhostCollisions();

    // Toggle mouth animation
    this.mouthOpen = !this.mouthOpen;
  }

  private _canMoveTo(x: number, y: number): boolean {
    if (y < 0 || y >= this.maze.length || x < 0 || x >= this.maze[0].length) {
      return false;
    }
    return this.maze[y][x] !== 1;
  }

  private _activatePowerMode() {
    this.powerMode = true;
    this.powerModeTimer = 30; // 30 moves ~= 4.5 seconds
  }

  private _moveGhosts() {
    this.ghosts.forEach((ghost) => {
      const possibleDirections: Position[] = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ].filter((dir) => {
        const newX = ghost.position.x + dir.x;
        const newY = ghost.position.y + dir.y;
        return this._canMoveTo(newX, newY);
      });

      if (possibleDirections.length > 0) {
        // Simple AI: random movement, but prefer moving toward Pacman if not in power mode
        let chosenDir: Position;
        
        if (!this.powerMode && Math.random() > 0.3) {
          // Chase Pacman
          const dx = this.pacman.x - ghost.position.x;
          const dy = this.pacman.y - ghost.position.y;
          
          const preferredDirs = possibleDirections.sort((a, b) => {
            const distA = Math.abs(dx - a.x) + Math.abs(dy - a.y);
            const distB = Math.abs(dx - b.x) + Math.abs(dy - b.y);
            return distA - distB;
          });
          
          chosenDir = preferredDirs[0];
        } else {
          // Random movement or flee
          chosenDir = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        }

        ghost.position.x += chosenDir.x;
        ghost.position.y += chosenDir.y;
        ghost.direction = chosenDir;
      }
    });
  }

  private _checkGhostCollisions() {
    this.ghosts.forEach((ghost, index) => {
      if (ghost.position.x === this.pacman.x && ghost.position.y === this.pacman.y) {
        if (this.powerMode) {
          // Eat ghost
          this._score += 200;
          ghost.position = { x: 9 + (index % 2), y: 9 + Math.floor(index / 2) };
        } else {
          // Lose life
          this._loseLife();
        }
      }
    });
  }

  private _loseLife() {
    this._lives--;
    if (this._lives <= 0) {
      this._gameOver();
    } else {
      // Reset positions
      this.pacman = { x: 1, y: 1 };
      this.direction = { x: 0, y: 0 };
      this.nextDirection = { x: 0, y: 0 };
      this.ghosts.forEach((ghost, index) => {
        ghost.position = { x: 9 + (index % 2), y: 9 + Math.floor(index / 2) };
      });
    }
  }

  private _checkWin() {
    const hasDotsLeft = this.maze.some((row) => row.some((tile) => tile === 2 || tile === 3));
    if (!hasDotsLeft) {
      this._win();
    }
  }

  private _gameOver() {
    this._gameState = "gameover";
    this._saveHighScore();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private _win() {
    this._gameState = "won";
    this._score += this._lives * 1000;
    this._saveHighScore();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private _draw() {
    // Clear canvas
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw maze
    for (let y = 0; y < this.maze.length; y++) {
      for (let x = 0; x < this.maze[y].length; x++) {
        const tile = this.maze[y][x];

        if (tile === 1) {
          // Wall
          this.ctx.fillStyle = "#0000FF";
          this.ctx.fillRect(
            x * this.tileSize,
            y * this.tileSize,
            this.tileSize,
            this.tileSize
          );
        } else if (tile === 2) {
          // Dot
          this.ctx.fillStyle = "#FFB897";
          this.ctx.beginPath();
          this.ctx.arc(
            x * this.tileSize + this.tileSize / 2,
            y * this.tileSize + this.tileSize / 2,
            2,
            0,
            Math.PI * 2
          );
          this.ctx.fill();
        } else if (tile === 3) {
          // Power pellet
          this.ctx.fillStyle = "#FFB897";
          this.ctx.beginPath();
          this.ctx.arc(
            x * this.tileSize + this.tileSize / 2,
            y * this.tileSize + this.tileSize / 2,
            4,
            0,
            Math.PI * 2
          );
          this.ctx.fill();
        }
      }
    }

    // Draw ghosts
    this.ghosts.forEach((ghost) => {
      this.ctx.fillStyle = this.powerMode ? "#0000FF" : ghost.color;
      this.ctx.beginPath();
      this.ctx.arc(
        ghost.position.x * this.tileSize + this.tileSize / 2,
        ghost.position.y * this.tileSize + this.tileSize / 2,
        this.tileSize / 2 - 2,
        0,
        Math.PI * 2
      );
      this.ctx.fill();

      // Eyes
      if (!this.powerMode) {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.beginPath();
        this.ctx.arc(
          ghost.position.x * this.tileSize + this.tileSize / 2 - 3,
          ghost.position.y * this.tileSize + this.tileSize / 2 - 2,
          2,
          0,
          Math.PI * 2
        );
        this.ctx.arc(
          ghost.position.x * this.tileSize + this.tileSize / 2 + 3,
          ghost.position.y * this.tileSize + this.tileSize / 2 - 2,
          2,
          0,
          Math.PI * 2
        );
        this.ctx.fill();
      }
    });

    // Draw Pacman
    this.ctx.fillStyle = "#FFFF00";
    this.ctx.beginPath();

    const mouthAngle = this.mouthOpen ? 0.2 : 0;
    let startAngle = mouthAngle;
    let endAngle = Math.PI * 2 - mouthAngle;

    // Rotate based on direction
    if (this.direction.x === 1) {
      // Right (default)
    } else if (this.direction.x === -1) {
      // Left
      startAngle = Math.PI + mouthAngle;
      endAngle = Math.PI - mouthAngle;
    } else if (this.direction.y === -1) {
      // Up
      startAngle = Math.PI * 1.5 + mouthAngle;
      endAngle = Math.PI * 1.5 - mouthAngle;
    } else if (this.direction.y === 1) {
      // Down
      startAngle = Math.PI * 0.5 + mouthAngle;
      endAngle = Math.PI * 0.5 - mouthAngle;
    }

    this.ctx.arc(
      this.pacman.x * this.tileSize + this.tileSize / 2,
      this.pacman.y * this.tileSize + this.tileSize / 2,
      this.tileSize / 2 - 2,
      startAngle,
      endAngle
    );
    this.ctx.lineTo(
      this.pacman.x * this.tileSize + this.tileSize / 2,
      this.pacman.y * this.tileSize + this.tileSize / 2
    );
    this.ctx.fill();
  }

  render() {
    return html`
      <div class="game-container">
        <div class="game-header">
          <h2>🎮 PAC-MAN</h2>
          <div class="stats">
            <div class="stat">
              <span class="label">Score:</span>
              <span class="value">${this._score}</span>
            </div>
            <div class="stat">
              <span class="label">High Score:</span>
              <span class="value">${this._highScore}</span>
            </div>
            <div class="stat">
              <span class="label">Lives:</span>
              <span class="value">${"🔴".repeat(this._lives)}</span>
            </div>
          </div>
        </div>

        ${this._gameState === "start"
          ? html`
              <div class="start-screen">
                <h3>Ready to Play?</h3>
                <p>Use arrow keys to move Pac-Man</p>
                <p>Eat all the dots and avoid the ghosts!</p>
                <p>Power pellets let you eat ghosts for bonus points</p>
                <uui-button
                  look="primary"
                  label="Start Game"
                  @click="${this._startGame}"
                >
                  Start Game
                </uui-button>
              </div>
            `
          : ""}

        <div class="canvas-container">
          <canvas id="gameCanvas"></canvas>
          
          ${this._gameState === "paused"
            ? html`
                <div class="overlay">
                  <h3>PAUSED</h3>
                  <p>Press P or Space to resume</p>
                </div>
              `
            : ""}
          
          ${this._gameState === "gameover"
            ? html`
                <div class="overlay">
                  <h3>GAME OVER</h3>
                  <p>Final Score: ${this._score}</p>
                  ${this._score === this._highScore
                    ? html`<p class="highlight">🏆 NEW HIGH SCORE! 🏆</p>`
                    : ""}
                  <uui-button
                    look="primary"
                    label="Play Again"
                    @click="${this._startGame}"
                  >
                    Play Again
                  </uui-button>
                </div>
              `
            : ""}
          
          ${this._gameState === "won"
            ? html`
                <div class="overlay">
                  <h3>🎉 YOU WIN! 🎉</h3>
                  <p>Final Score: ${this._score}</p>
                  ${this._score === this._highScore
                    ? html`<p class="highlight">🏆 NEW HIGH SCORE! 🏆</p>`
                    : ""}
                  <uui-button
                    look="primary"
                    label="Play Again"
                    @click="${this._startGame}"
                  >
                    Play Again
                  </uui-button>
                </div>
              `
            : ""}
        </div>

        <div class="controls-info">
          <p><strong>Controls:</strong> Arrow Keys to move | P or Space to pause</p>
        </div>
      </div>
    `;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: var(--uui-size-space-4);
      }

      .game-container {
        max-width: 600px;
        margin: 0 auto;
      }

      .game-header {
        text-align: center;
        margin-bottom: var(--uui-size-space-4);
      }

      h2 {
        margin: 0 0 var(--uui-size-space-3) 0;
        color: #FFFF00;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        font-size: 2em;
      }

      .stats {
        display: flex;
        justify-content: space-around;
        gap: var(--uui-size-space-4);
        background: var(--uui-color-surface-alt);
        padding: var(--uui-size-space-3);
        border-radius: var(--uui-border-radius);
      }

      .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .label {
        font-size: 0.9em;
        color: var(--uui-color-text-alt);
      }

      .value {
        font-size: 1.2em;
        font-weight: bold;
        color: var(--uui-color-text);
      }

      .start-screen {
        text-align: center;
        padding: var(--uui-size-space-6);
        background: var(--uui-color-surface-alt);
        border-radius: var(--uui-border-radius);
        margin-bottom: var(--uui-size-space-4);
      }

      .start-screen h3 {
        margin-top: 0;
      }

      .start-screen p {
        margin: var(--uui-size-space-2) 0;
      }

      .canvas-container {
        position: relative;
        display: inline-block;
        border: 4px solid #0000FF;
        border-radius: var(--uui-border-radius);
        background: #000000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      }

      canvas {
        display: block;
        image-rendering: pixelated;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
        padding: var(--uui-size-space-4);
      }

      .overlay h3 {
        font-size: 2em;
        margin: 0 0 var(--uui-size-space-3) 0;
        color: #FFFF00;
      }

      .overlay p {
        margin: var(--uui-size-space-2) 0;
      }

      .highlight {
        color: #FFD700;
        font-size: 1.2em;
        font-weight: bold;
        animation: pulse 1s infinite;
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      .controls-info {
        text-align: center;
        margin-top: var(--uui-size-space-3);
        padding: var(--uui-size-space-2);
        background: var(--uui-color-surface-alt);
        border-radius: var(--uui-border-radius);
        font-size: 0.9em;
      }

      .controls-info p {
        margin: 0;
      }
    `,
  ];
}

export default PacmanGameElement;

declare global {
  interface HTMLElementTagNameMap {
    "oc-pacman-game": PacmanGameElement;
  }
}
