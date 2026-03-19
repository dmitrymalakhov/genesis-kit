// ═══════════════════════════════════════════════════════════
// styled.ts — Стилизованные компоненты для игрового виджета «Пульс»
// styled-components, объектная нотация, template-строки запрещены
// ═══════════════════════════════════════════════════════════

import styled, { keyframes, css } from "styled-components";

// ── Палитра ──
export const COLORS = {
  bg: "#f3f4f6",
  card: "#fff",
  border: "#e8eaed",
  light: "#f0efe9",
  dark: "#7fad7a",
  sel: "rgba(33,150,83,0.45)",
  dot: "rgba(33,150,83,0.35)",
  capDot: "rgba(210,60,60,0.35)",
  last: "rgba(255,212,59,0.40)",
  checkBg: "radial-gradient(ellipse at center,rgba(210,40,40,0.65) 0%,rgba(210,40,40,0) 70%)",
  accent: "#21a038",
  purple: "#7b61ff",
  txt: "#1a1a1a",
  txt2: "#6b7280",
  muted: "#9ca3af",
  danger: "#d23c3c",
  white: "#fff",
  czW: "rgba(33,150,83,0.12)",
  czB: "rgba(123,97,255,0.12)",
  msNums: ["", "#2563eb", "#16a34a", "#dc2626", "#7c3aed", "#b91c1c", "#0891b2", "#1a1a1a", "#6b7280"],
  bsW1: "#e8f4fd",
  bsW2: "#bde0f5",
};

// ── Анимации ──
export const spinAnimation = keyframes({
  to: { transform: "rotate(360deg)" },
});

export const dropdownFadeIn = keyframes({
  from: { opacity: 0, transform: "translateY(-4px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

// ── Контейнер виджета ──
export const WidgetContainer = styled.div({
  fontFamily: "'SB Sans Text','SF Pro Display',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
  background: COLORS.card,
  borderRadius: 20,
  border: "1px solid " + COLORS.border,
  width: 600,
  height: 570,
  boxSizing: "border-box",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.04)",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  padding: "20px 24px",
});

// ── Хедер ──
export const Header = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 10,
  flexShrink: 0,
});

export const HeaderRight = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

export const Badge = styled.span({
  fontSize: 10,
  fontWeight: 600,
  background: "linear-gradient(135deg," + COLORS.accent + ",#17b336)",
  color: COLORS.white,
  borderRadius: 6,
  padding: "2px 8px",
  letterSpacing: "0.03em",
});

// ── Dropdown ──
export const DropdownWrapper = styled.div({
  position: "relative",
});

export const DropdownButton = styled.button<{ $open: boolean }>((props) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 14px",
  background: COLORS.white,
  border: "1.5px solid " + (props.$open ? COLORS.accent : COLORS.border),
  borderRadius: 12,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 700,
  color: COLORS.txt,
  transition: "all 0.15s",
}));

export const DropdownIcon = styled.span({
  fontSize: 18,
});

export const DropdownChevron = styled.svg<{ $open: boolean }>((props) => ({
  marginLeft: 4,
  transition: "transform 0.2s",
  transform: props.$open ? "rotate(180deg)" : "rotate(0)",
}));

export const DropdownMenu = styled.div({
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  zIndex: 200,
  background: COLORS.white,
  border: "1.5px solid " + COLORS.border,
  borderRadius: 14,
  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  padding: 6,
  minWidth: 210,
  animationName: dropdownFadeIn,
  animationDuration: "0.15s",
  animationTimingFunction: "ease",
});

export const DropdownItem = styled.button<{ $active: boolean }>((props) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  padding: "10px 12px",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  color: props.$active ? COLORS.accent : COLORS.txt,
  background: props.$active ? COLORS.accent + "10" : "transparent",
  transition: "background 0.12s",
  "&:hover": {
    background: props.$active ? COLORS.accent + "18" : COLORS.bg,
  },
}));

export const DropdownItemIcon = styled.span({
  fontSize: 18,
  width: 24,
  textAlign: "center",
});

export const DropdownCheck = styled.span({
  marginLeft: "auto",
  fontSize: 11,
  color: COLORS.accent,
});

// ── Контентная область ──
export const ContentArea = styled.div({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
});

// ── Кнопка ──
export const Btn = styled.button<{ $primary?: boolean }>((props) => ({
  padding: "5px 12px",
  borderRadius: 8,
  border: props.$primary ? "none" : "1px solid " + COLORS.border,
  background: props.$primary
    ? "linear-gradient(135deg," + COLORS.accent + ",#17b336)"
    : COLORS.white,
  color: props.$primary ? COLORS.white : COLORS.txt,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.15s",
  "&:hover": {
    background: props.$primary
      ? "linear-gradient(135deg,#1b8a2f,#15992d)"
      : COLORS.bg,
  },
}));

// ── Спиннер ──
export const SpinnerSvg = styled.svg({
  animationName: spinAnimation,
  animationDuration: "1s",
  animationTimingFunction: "linear",
  animationIterationCount: "infinite",
});

export const SpinnerWrap = styled.span({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  color: COLORS.accent,
  fontWeight: 500,
  fontSize: 13,
});

// ── Настольные игры (доска 8×8) ──
export const BoardModeRow = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 6,
});

export const StatusText = styled.span<{ $danger?: boolean; $accent?: boolean }>((props) => ({
  color: props.$accent ? COLORS.accent : props.$danger ? COLORS.danger : COLORS.txt2,
  fontWeight: props.$accent || props.$danger ? 700 : 500,
  fontSize: 13,
}));

export const TurnDot = styled.span<{ $white?: boolean; $accent?: boolean; $purple?: boolean }>((props) => ({
  width: 10,
  height: 10,
  borderRadius: "50%",
  background: props.$accent ? COLORS.accent : props.$purple ? COLORS.purple : props.$white ? "#fff" : "#1a1a1a",
  border: props.$accent || props.$purple ? "none" : "1.5px solid #999",
  display: "inline-block",
}));

export const BoardOuter = styled.div({
  borderRadius: 12,
  overflow: "hidden",
  border: "2px solid " + COLORS.border,
  lineHeight: 0,
  position: "relative",
  alignSelf: "center",
});

export const BoardRow = styled.div({
  display: "flex",
});

export const CapturedRow = styled.div({
  display: "flex",
  gap: 1,
  height: 20,
  fontSize: 15,
  opacity: 0.7,
  flexWrap: "wrap",
  overflow: "hidden",
});

// ── Промо-оверлей (шахматы) ──
export const PromoOverlay = styled.div({
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
  borderRadius: 12,
  backdropFilter: "blur(2px)",
});

export const PromoBox = styled.div({
  background: COLORS.white,
  borderRadius: 16,
  padding: "14px 10px",
  display: "flex",
  gap: 6,
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
});

export const PromoBtn = styled.button({
  width: 48,
  height: 48,
  borderRadius: 12,
  border: "1px solid " + COLORS.border,
  background: COLORS.white,
  fontSize: 28,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.12s",
  "&:hover": {
    background: COLORS.bg,
    transform: "scale(1.08)",
  },
});

// ── Уголки — легенда ──
export const CornersLegend = styled.div({
  marginTop: 6,
  display: "flex",
  gap: 16,
  fontSize: 11,
  color: COLORS.muted,
});

export const LegendDot = styled.span<{ $color: string }>((props) => ({
  width: 10,
  height: 10,
  borderRadius: 3,
  background: props.$color,
  display: "inline-block",
}));

// ── Сапёр ──
export const MsTopRow = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 8,
});

export const MsStats = styled.div({
  display: "flex",
  gap: 12,
  fontSize: 13,
  fontWeight: 600,
  color: COLORS.txt2,
});

export const MsGrid = styled.div({
  borderRadius: 10,
  overflow: "hidden",
  border: "2px solid " + COLORS.border,
  display: "inline-block",
});

// ── Морской бой ──
export const BsLayout = styled.div({
  display: "flex",
  gap: 10,
  justifyContent: "center",
  flexWrap: "wrap",
});

export const BsStatsRow = styled.div({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 8,
  fontSize: 12,
  fontWeight: 600,
  color: COLORS.txt2,
});

export const BsGridWrapper = styled.div({
  display: "inline-block",
});

export const BsGridLabel = styled.div({
  fontSize: 11,
  fontWeight: 700,
  color: COLORS.txt2,
  marginBottom: 4,
  textAlign: "center",
});

export const BsGridInner = styled.div({
  borderRadius: 8,
  overflow: "hidden",
  border: "1.5px solid " + COLORS.border,
  display: "inline-block",
});

// ── Змейка / Тетрис — общие ──
export const RealtimeBoard = styled.div<{ $w: number; $h: number; $bg?: string }>((props) => ({
  width: props.$w,
  height: props.$h,
  background: props.$bg || "#1a2332",
  borderRadius: 12,
  border: "2px solid " + COLORS.border,
  position: "relative",
  outline: "none",
  overflow: "hidden",
}));

export const GameOverlay = styled.div<{ $bg?: string }>((props) => ({
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: props.$bg || "rgba(0,0,0,0.5)",
  borderRadius: 10,
  zIndex: 10,
}));

export const OverlayTitle = styled.div<{ $color?: string }>((props) => ({
  color: props.$color || COLORS.white,
  fontSize: 16,
  fontWeight: 700,
}));

export const OverlaySubtitle = styled.div({
  color: COLORS.muted,
  fontSize: 12,
  marginTop: 4,
});

// ── Пятнашки ──
export const P15Board = styled.div<{ $size: number; $cellSize: number; $gap: number }>((props) => ({
  display: "grid",
  gridTemplateColumns: "repeat(" + props.$size + ", " + props.$cellSize + "px)",
  gap: props.$gap,
  padding: 10,
  background: COLORS.bg,
  borderRadius: 14,
  border: "2px solid " + COLORS.border,
}));

export const P15Tile = styled.div<{ $color: string; $size: number; $won: boolean }>((props) => ({
  width: props.$size,
  height: props.$size,
  borderRadius: 10,
  background: props.$won ? COLORS.accent : props.$color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: props.$size * 0.38,
  fontWeight: 800,
  color: COLORS.white,
  cursor: props.$won ? "default" : "pointer",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
  transition: "all 0.12s ease",
  userSelect: "none",
}));

// ── Реверси ──
export const RvBoard = styled.div({
  borderRadius: 12,
  overflow: "hidden",
  border: "2px solid " + COLORS.border,
  lineHeight: 0,
  display: "inline-block",
  background: "#2d7d46",
});

export const RvPiece = styled.div<{ $black: boolean }>((props) => ({
  position: "absolute",
  top: 4,
  left: 4,
  right: 4,
  bottom: 4,
  borderRadius: "50%",
  background: props.$black
    ? "radial-gradient(circle at 35% 35%, #444, #111)"
    : "radial-gradient(circle at 35% 35%, #fff, #ccc)",
  boxShadow: props.$black
    ? "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)"
    : "0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)",
  transition: "all 0.2s ease",
}));

export const RvScoreRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 12,
  fontSize: 14,
  fontWeight: 700,
});

// ── Пульсик ──
export const PkLegend = styled.div({
  marginTop: 6,
  display: "flex",
  gap: 14,
  fontSize: 11,
  color: COLORS.muted,
  flexWrap: "wrap",
});

export const PkNextLevelBtn = styled.button({
  marginTop: 8,
  padding: "6px 16px",
  borderRadius: 8,
  border: "none",
  background: COLORS.accent,
  color: COLORS.white,
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  "&:hover": {
    background: "#1b8a2f",
  },
});
