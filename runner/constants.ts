import type { SizeConfig, WidgetSize } from "./types";

// ── Size presets ────────────────────────────────────────────

export const SIZE_CONFIGS: Record<WidgetSize, SizeConfig> = {
  major: {
    width: 600,
    height: 570,
    canvasHeight: 480,
    showHeader: true,
    showControls: true,
    headerFontSize: 16,
    scoreFontSize: 14,
    groundY: 400,
    catScale: 1.0,
  },
  important: {
    width: 600,
    height: 280,
    canvasHeight: 220,
    showHeader: true,
    showControls: true,
    headerFontSize: 14,
    scoreFontSize: 12,
    groundY: 185,
    catScale: 0.9,
  },
  minor: {
    width: 296,
    height: 280,
    canvasHeight: 230,
    showHeader: true,
    showControls: false,
    headerFontSize: 12,
    scoreFontSize: 11,
    groundY: 195,
    catScale: 0.8,
  },
};

// ── Game physics ────────────────────────────────────────────

export const PHYSICS = {
  GRAVITY: 0.55,
  JUMP_FORCE: -11.5,
  INITIAL_SPEED: 4.5,
  MAX_SPEED: 13,
  SPEED_INCREMENT: 0.0008,
  CLOUD_SPEED_FACTOR: 0.3,
  SCORE_MILESTONE: 100,
  GRACE_DISTANCE: 130,
} as const;

// ── Cat dimensions (base, before scaling) ───────────────────

export const CAT = {
  X: 50,
  WIDTH: 44,
  HEIGHT: 44,
  DUCK_HEIGHT: 28,
  DUCK_WIDTH: 56,
} as const;

// ── Obstacle dimensions (base) ─────────────────────────────

export const OBSTACLES = {
  CACTUS_SMALL_W: 18,
  CACTUS_SMALL_H: 34,
  CACTUS_LARGE_W: 26,
  CACTUS_LARGE_H: 48,
  CACTUS_GROUP_W: 50,
  CACTUS_GROUP_H: 34,
  BIRD_W: 42,
  BIRD_H: 28,
} as const;

// Bird heights are relative offsets from groundY
export const BIRD_OFFSETS = [-35, -62, -100] as const;

// ── Colors ──────────────────────────────────────────────────

export const COLORS = {
  purple: "#7B2FBE",
  purpleLight: "#9B59D0",
  purpleDark: "#5A1F8E",
  bg: "#F0EDED",
  cardBg: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#6B6B6B",
  textMuted: "#A0A0A0",
  green: "#21A038",
  groundColor: "#8B7BA3",
  obstacleColor: "#5A1F8E",
  obstacleMid: "#7B2FBE",
  cloudColor: "#DDD6E5",
  catBody: "#7B2FBE",
  catBelly: "#C9A8E8",
  catDark: "#5A1F8E",
  catNose: "#FF8FAB",
  catEye: "#FFFFFF",
  catPupil: "#1A1A1A",
  catInnerEar: "#FF8FAB",
} as const;

// ── Difficulty scaling ─────────────────────────────────────

export const getMinGap = (speed: number, score: number): number => {
  const jumpDist = (Math.abs(PHYSICS.JUMP_FORCE) * 2 / PHYSICS.GRAVITY) * speed * 0.52;
  const reactionBuf = speed * 8;

  let mult: number;
  if (score < 50) mult = 2.4;
  else if (score < 150) mult = 1.9;
  else if (score < 300) mult = 1.5;
  else if (score < 500) mult = 1.2;
  else if (score < 800) mult = 1.05;
  else mult = 0.92;

  return (jumpDist + reactionBuf) * mult;
};

export const getMaxGap = (minGap: number, score: number): number => {
  if (score < 100) return minGap + 220;
  if (score < 300) return minGap + 160;
  if (score < 600) return minGap + 110;
  return minGap + 70;
};

export const getAllowedObstacles = (score: number): string[] => {
  if (score < 30) return ["cactus_small"];
  if (score < 80) return ["cactus_small", "cactus_small", "cactus_large"];
  if (score < 200) return ["cactus_small", "cactus_large", "cactus_group"];
  if (score < 400) return ["cactus_small", "cactus_large", "cactus_group", "bird"];
  return ["cactus_small", "cactus_large", "cactus_group", "bird", "bird"];
};
