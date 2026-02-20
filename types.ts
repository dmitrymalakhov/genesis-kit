export type WidgetSize = "major" | "important" | "minor";

export interface SizeConfig {
  readonly width: number;
  readonly height: number;
  readonly canvasHeight: number;
  readonly showHeader: boolean;
  readonly showControls: boolean;
  readonly headerFontSize: number;
  readonly scoreFontSize: number;
  readonly groundY: number;
  readonly catScale: number;
}

export interface DinoProps {
  readonly size?: WidgetSize;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export interface Obstacle {
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CatState {
  x: number;
  y: number;
  vy: number;
  w: number;
  h: number;
  ducking: boolean;
  grounded: boolean;
}

export interface CloudState {
  x: number;
  y: number;
}

export interface GameState {
  cat: CatState;
  obstacles: Obstacle[];
  clouds: CloudState[];
  particles: Particle[];
  speed: number;
  score: number;
  distance: number;
  frame: number;
  groundOffset: number;
  distSinceLastObstacle: number;
  nightCycle: number;
  lastMilestone: number;
  flashTimer: number;
  keysDown: Set<string>;
}

export type GameStatus = "idle" | "running" | "over";
