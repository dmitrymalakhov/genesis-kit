// ═══════════════════════════════════════════════════════════
// types.ts — Типы для игрового виджета «Пульс»
// ═══════════════════════════════════════════════════════════

export type GameId =
  | "chess"
  | "checkers"
  | "corners"
  | "minesweeper"
  | "battleship"
  | "puzzle15"
  | "snake"
  | "tetris"
  | "reversi"
  | "pulsik";

export type GameMode = "ai" | "pvp";

export interface GameInfo {
  id: GameId;
  label: string;
  icon: string;
}

// ── Шахматы ──
export type ChessPiece = string | null;
export type ChessBoard = ChessPiece[][];
export type ChessTurn = "w" | "b";

export interface ChessState {
  board: ChessBoard;
  turn: ChessTurn;
  castling: string;
  ep: string;
  half: number;
  full: number;
}

// ── Шашки ──
export type CheckerPiece = "w" | "W" | "b" | "B" | null;
export type CheckerBoard = CheckerPiece[][];

export interface CheckerState {
  board: CheckerBoard;
  turn: "w" | "b";
}

export interface CheckerCapture {
  fr: number;
  fc: number;
  tr: number;
  tc: number;
  chain: number[][] | null;
}

// ── Уголки ──
export type CornerPiece = "w" | "b" | null;

export interface CornerState {
  board: CornerPiece[][];
  turn: "w" | "b";
}

// ── Сапёр ──
export type MsDifficulty = "easy" | "medium" | "hard";

export interface MinesweeperState {
  rows: number;
  cols: number;
  mines: number;
  diff: MsDifficulty;
  grid: number[][];
  revealed: boolean[][];
  flagged: boolean[][];
  started: boolean;
  gameOver: boolean;
  won: boolean;
  minesLeft: number;
}

// ── Морской бой ──
export interface BsShip {
  cells: number[][];
  sunk: boolean;
}

export interface BattleshipState {
  pGrid: number[][];
  pShips: BsShip[];
  eGrid: number[][];
  eShips: BsShip[];
  eView: number[][];
  turn: "player" | "enemy";
  gameOver: boolean;
  winner: "player" | "enemy" | null;
  aiHits: number[][];
  msg: string;
}

// ── Пятнашки ──
export interface Puzzle15State {
  tiles: number[];
  size: number;
  moves: number;
  won: boolean;
}

// ── Змейка ──
export type SnakeSpeed = "easy" | "medium" | "hard";

export interface SnakeState {
  snake: number[][];
  dir: number[];
  nextDir: number[];
  food: number[];
  score: number;
  gameOver: boolean;
  running: boolean;
  speed: SnakeSpeed;
  best: number;
}

// ── Тетрис ──
export interface TetrisPiece {
  cells: number[][];
  color: string;
  key: string;
}

export interface TetrisState {
  board: (string | null)[][];
  piece: TetrisPiece;
  next: TetrisPiece;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  running: boolean;
}

// ── Реверси ──
export type ReversiPiece = "b" | "w" | null;

export interface ReversiState {
  board: ReversiPiece[][];
  turn: "b" | "w";
  gameOver: boolean;
  passed: boolean;
}

// ── Пульсик ──
export interface PulsikGuard {
  path: number[][];
  dir: number;
  viewDist: number;
  pathIdx: number;
  pos: number[];
}

export interface PulsikLevel {
  map: string[];
  player: number[];
  stars: number[][];
  guards: Array<{
    path: number[][];
    dir: number;
    viewDist: number;
  }>;
}

export interface PulsikState {
  map: number[][];
  player: number[];
  stars: number[][];
  guards: PulsikGuard[];
  collected: number;
  total: number;
  gameOver: boolean;
  won: boolean;
  running: boolean;
  level: number;
  tick: number;
}

// ── Общие статусы ──
export type GameStatus =
  | "playing"
  | "check"
  | "checkmate_white"
  | "checkmate_black"
  | "stalemate"
  | "draw_50"
  | "win_white"
  | "win_black"
  | "ms_won"
  | "ms_lost"
  | "bs_won"
  | "bs_lost"
  | "p15_won"
  | "snk_over"
  | "tet_over"
  | "rv_black"
  | "rv_white"
  | "rv_draw"
  | "pk_won"
  | "pk_caught";

// ── Палитра ──
export interface ColorPalette {
  bg: string;
  card: string;
  border: string;
  light: string;
  dark: string;
  sel: string;
  dot: string;
  capDot: string;
  last: string;
  checkBg: string;
  accent: string;
  purple: string;
  txt: string;
  txt2: string;
  muted: string;
  danger: string;
  white: string;
  czW: string;
  czB: string;
  msNums: string[];
  bsW1: string;
  bsW2: string;
}
