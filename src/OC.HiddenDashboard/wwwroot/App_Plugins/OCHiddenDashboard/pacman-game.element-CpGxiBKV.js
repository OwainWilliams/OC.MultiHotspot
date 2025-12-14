import { LitElement as u, html as h, css as g, query as v, state as l, customElement as x } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as y } from "@umbraco-cms/backoffice/element-api";
var f = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, c = (t, i, s, e) => {
  for (var a = e > 1 ? void 0 : e ? _(i, s) : i, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (a = (e ? r(i, s, a) : r(a)) || a);
  return e && a && f(i, s, a), a;
};
let o = class extends y(u) {
  constructor() {
    super(...arguments), this._score = 0, this._lives = 3, this._gameState = "start", this._highScore = 0, this.pacman = { x: 1, y: 1 }, this.direction = { x: 0, y: 0 }, this.nextDirection = { x: 0, y: 0 }, this.ghosts = [], this.maze = [], this.tileSize = 20, this.lastMoveTime = 0, this.moveSpeed = 150, this.mouthOpen = !0, this.powerMode = !1, this.powerModeTimer = 0, this.levelDesign = [
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
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
  }
  connectedCallback() {
    super.connectedCallback(), this._loadHighScore();
  }
  firstUpdated() {
    this.ctx = this.canvas.getContext("2d"), this.canvas.width = this.levelDesign[0].length * this.tileSize, this.canvas.height = this.levelDesign.length * this.tileSize, this._initGame();
  }
  _loadHighScore() {
    const t = localStorage.getItem("oc-pacman-highscore");
    t && (this._highScore = parseInt(t, 10));
  }
  _saveHighScore() {
    this._score > this._highScore && (this._highScore = this._score, localStorage.setItem("oc-pacman-highscore", this._highScore.toString()));
  }
  _initGame() {
    this.maze = this.levelDesign.map((t) => [...t]), this.pacman = { x: 1, y: 1 }, this.direction = { x: 0, y: 0 }, this.nextDirection = { x: 0, y: 0 }, this.ghosts = [
      { position: { x: 9, y: 9 }, direction: { x: 1, y: 0 }, color: "#FF0000", name: "Blinky" },
      { position: { x: 10, y: 9 }, direction: { x: -1, y: 0 }, color: "#FFB8FF", name: "Pinky" },
      { position: { x: 9, y: 10 }, direction: { x: 0, y: -1 }, color: "#00FFFF", name: "Inky" },
      { position: { x: 10, y: 10 }, direction: { x: 0, y: 1 }, color: "#FFB851", name: "Clyde" }
    ], this.powerMode = !1, this.powerModeTimer = 0, this._draw();
  }
  _startGame() {
    this._gameState = "playing", this._score = 0, this._lives = 3, this._initGame(), this._gameLoop(), this._setupKeyboardControls();
  }
  _setupKeyboardControls() {
    const t = (i) => {
      if (this._gameState === "playing")
        switch (i.key) {
          case "ArrowUp":
            this.nextDirection = { x: 0, y: -1 }, i.preventDefault();
            break;
          case "ArrowDown":
            this.nextDirection = { x: 0, y: 1 }, i.preventDefault();
            break;
          case "ArrowLeft":
            this.nextDirection = { x: -1, y: 0 }, i.preventDefault();
            break;
          case "ArrowRight":
            this.nextDirection = { x: 1, y: 0 }, i.preventDefault();
            break;
          case " ":
          case "p":
            this._togglePause(), i.preventDefault();
            break;
        }
    };
    document.addEventListener("keydown", t), this.addController({
      hostConnected: () => {
      },
      hostDisconnected: () => {
        document.removeEventListener("keydown", t);
      }
    });
  }
  _togglePause() {
    this._gameState === "playing" ? (this._gameState = "paused", this.animationId && cancelAnimationFrame(this.animationId)) : this._gameState === "paused" && (this._gameState = "playing", this._gameLoop());
  }
  _gameLoop() {
    const t = Date.now();
    t - this.lastMoveTime > this.moveSpeed && (this._update(), this.lastMoveTime = t), this._draw(), this._gameState === "playing" && (this.animationId = requestAnimationFrame(() => this._gameLoop()));
  }
  _update() {
    const t = this.pacman.x + this.nextDirection.x, i = this.pacman.y + this.nextDirection.y;
    this._canMoveTo(t, i) && (this.direction = { ...this.nextDirection });
    const s = this.pacman.x + this.direction.x, e = this.pacman.y + this.direction.y;
    if (this._canMoveTo(s, e)) {
      this.pacman.x = s, this.pacman.y = e;
      const a = this.maze[e][s];
      a === 2 ? (this.maze[e][s] = 0, this._score += 10, this._checkWin()) : a === 3 && (this.maze[e][s] = 0, this._score += 50, this._activatePowerMode(), this._checkWin());
    }
    this.powerMode && (this.powerModeTimer--, this.powerModeTimer <= 0 && (this.powerMode = !1)), this._moveGhosts(), this._checkGhostCollisions(), this.mouthOpen = !this.mouthOpen;
  }
  _canMoveTo(t, i) {
    return i < 0 || i >= this.maze.length || t < 0 || t >= this.maze[0].length ? !1 : this.maze[i][t] !== 1;
  }
  _activatePowerMode() {
    this.powerMode = !0, this.powerModeTimer = 30;
  }
  _moveGhosts() {
    this.ghosts.forEach((t) => {
      const i = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 }
      ].filter((s) => {
        const e = t.position.x + s.x, a = t.position.y + s.y;
        return this._canMoveTo(e, a);
      });
      if (i.length > 0) {
        let s;
        if (!this.powerMode && Math.random() > 0.3) {
          const e = this.pacman.x - t.position.x, a = this.pacman.y - t.position.y;
          s = i.sort((r, p) => {
            const m = Math.abs(e - r.x) + Math.abs(a - r.y), d = Math.abs(e - p.x) + Math.abs(a - p.y);
            return m - d;
          })[0];
        } else
          s = i[Math.floor(Math.random() * i.length)];
        t.position.x += s.x, t.position.y += s.y, t.direction = s;
      }
    });
  }
  _checkGhostCollisions() {
    this.ghosts.forEach((t, i) => {
      t.position.x === this.pacman.x && t.position.y === this.pacman.y && (this.powerMode ? (this._score += 200, t.position = { x: 9 + i % 2, y: 9 + Math.floor(i / 2) }) : this._loseLife());
    });
  }
  _loseLife() {
    this._lives--, this._lives <= 0 ? this._gameOver() : (this.pacman = { x: 1, y: 1 }, this.direction = { x: 0, y: 0 }, this.nextDirection = { x: 0, y: 0 }, this.ghosts.forEach((t, i) => {
      t.position = { x: 9 + i % 2, y: 9 + Math.floor(i / 2) };
    }));
  }
  _checkWin() {
    this.maze.some((i) => i.some((s) => s === 2 || s === 3)) || this._win();
  }
  _gameOver() {
    this._gameState = "gameover", this._saveHighScore(), this.animationId && cancelAnimationFrame(this.animationId);
  }
  _win() {
    this._gameState = "won", this._score += this._lives * 1e3, this._saveHighScore(), this.animationId && cancelAnimationFrame(this.animationId);
  }
  _draw() {
    this.ctx.fillStyle = "#000000", this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (let e = 0; e < this.maze.length; e++)
      for (let a = 0; a < this.maze[e].length; a++) {
        const n = this.maze[e][a];
        n === 1 ? (this.ctx.fillStyle = "#0000FF", this.ctx.fillRect(
          a * this.tileSize,
          e * this.tileSize,
          this.tileSize,
          this.tileSize
        )) : n === 2 ? (this.ctx.fillStyle = "#FFB897", this.ctx.beginPath(), this.ctx.arc(
          a * this.tileSize + this.tileSize / 2,
          e * this.tileSize + this.tileSize / 2,
          2,
          0,
          Math.PI * 2
        ), this.ctx.fill()) : n === 3 && (this.ctx.fillStyle = "#FFB897", this.ctx.beginPath(), this.ctx.arc(
          a * this.tileSize + this.tileSize / 2,
          e * this.tileSize + this.tileSize / 2,
          4,
          0,
          Math.PI * 2
        ), this.ctx.fill());
      }
    this.ghosts.forEach((e) => {
      this.ctx.fillStyle = this.powerMode ? "#0000FF" : e.color, this.ctx.beginPath(), this.ctx.arc(
        e.position.x * this.tileSize + this.tileSize / 2,
        e.position.y * this.tileSize + this.tileSize / 2,
        this.tileSize / 2 - 2,
        0,
        Math.PI * 2
      ), this.ctx.fill(), this.powerMode || (this.ctx.fillStyle = "#FFFFFF", this.ctx.beginPath(), this.ctx.arc(
        e.position.x * this.tileSize + this.tileSize / 2 - 3,
        e.position.y * this.tileSize + this.tileSize / 2 - 2,
        2,
        0,
        Math.PI * 2
      ), this.ctx.arc(
        e.position.x * this.tileSize + this.tileSize / 2 + 3,
        e.position.y * this.tileSize + this.tileSize / 2 - 2,
        2,
        0,
        Math.PI * 2
      ), this.ctx.fill());
    }), this.ctx.fillStyle = "#FFFF00", this.ctx.beginPath();
    const t = this.mouthOpen ? 0.2 : 0;
    let i = t, s = Math.PI * 2 - t;
    this.direction.x === 1 || (this.direction.x === -1 ? (i = Math.PI + t, s = Math.PI - t) : this.direction.y === -1 ? (i = Math.PI * 1.5 + t, s = Math.PI * 1.5 - t) : this.direction.y === 1 && (i = Math.PI * 0.5 + t, s = Math.PI * 0.5 - t)), this.ctx.arc(
      this.pacman.x * this.tileSize + this.tileSize / 2,
      this.pacman.y * this.tileSize + this.tileSize / 2,
      this.tileSize / 2 - 2,
      i,
      s
    ), this.ctx.lineTo(
      this.pacman.x * this.tileSize + this.tileSize / 2,
      this.pacman.y * this.tileSize + this.tileSize / 2
    ), this.ctx.fill();
  }
  render() {
    return h`
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

        ${this._gameState === "start" ? h`
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
            ` : ""}

        <div class="canvas-container">
          <canvas id="gameCanvas"></canvas>
          
          ${this._gameState === "paused" ? h`
                <div class="overlay">
                  <h3>PAUSED</h3>
                  <p>Press P or Space to resume</p>
                </div>
              ` : ""}
          
          ${this._gameState === "gameover" ? h`
                <div class="overlay">
                  <h3>GAME OVER</h3>
                  <p>Final Score: ${this._score}</p>
                  ${this._score === this._highScore ? h`<p class="highlight">🏆 NEW HIGH SCORE! 🏆</p>` : ""}
                  <uui-button
                    look="primary"
                    label="Play Again"
                    @click="${this._startGame}"
                  >
                    Play Again
                  </uui-button>
                </div>
              ` : ""}
          
          ${this._gameState === "won" ? h`
                <div class="overlay">
                  <h3>🎉 YOU WIN! 🎉</h3>
                  <p>Final Score: ${this._score}</p>
                  ${this._score === this._highScore ? h`<p class="highlight">🏆 NEW HIGH SCORE! 🏆</p>` : ""}
                  <uui-button
                    look="primary"
                    label="Play Again"
                    @click="${this._startGame}"
                  >
                    Play Again
                  </uui-button>
                </div>
              ` : ""}
        </div>

        <div class="controls-info">
          <p><strong>Controls:</strong> Arrow Keys to move | P or Space to pause</p>
        </div>
      </div>
    `;
  }
};
o.styles = [
  g`
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
    `
];
c([
  v("#gameCanvas")
], o.prototype, "canvas", 2);
c([
  l()
], o.prototype, "_score", 2);
c([
  l()
], o.prototype, "_lives", 2);
c([
  l()
], o.prototype, "_gameState", 2);
c([
  l()
], o.prototype, "_highScore", 2);
o = c([
  x("oc-pacman-game")
], o);
const b = o;
export {
  o as PacmanGameElement,
  b as default
};
//# sourceMappingURL=pacman-game.element-CpGxiBKV.js.map
