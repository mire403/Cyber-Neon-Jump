export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Player {
  pos: Vector2;
  vel: Vector2;
  width: number;
  height: number;
  color: string;
  isGrounded: boolean;
  canDoubleJump: boolean;
  jumpCount: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'NORMAL' | 'BOOST' | 'TRAP';
  passed: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface GameConfig {
  gravity: number;
  jumpForce: number;
  speed: number;
  maxSpeed: number;
}