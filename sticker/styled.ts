import styled from "styled-components";
import { type WidgetSize } from "./types";

/* ── Theme tokens ───────────────────────────────────────────────────────── */

export const T = {
  accent: "#7B41F5",
  accentHover: "#6930DB",
  accentBg: "rgba(123,65,245,0.13)",
  accentBgLight: "rgba(123,65,245,0.07)",
  text: "#1A1A2E",
  textSecondary: "#6E6E82",
  textMuted: "#9E9EB0",
  danger: "#E5484D",
  dangerBg: "rgba(229,72,77,0.08)",
  radius: 14,
  radiusSm: 8,
  radiusXs: 6,
  font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  transition: "0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  shadow: "0 4px 16px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)",
  scrollThumb: "#D4C4FF",
} as const;

/* ── Size helpers ───────────────────────────────────────────────────────── */

const sizeWidth = (p: { $size: WidgetSize }): number =>
  ({ major: 600, important: 600, minor: 296 })[p.$size];

const sizeHeight = (p: { $size: WidgetSize }): number =>
  ({ major: 570, important: 280, minor: 280 })[p.$size];

const isCompact = (size: WidgetSize): boolean =>
  size === "minor" || size === "important";

/* ── Root container ─────────────────────────────────────────────────────── */

export const Root = styled.div<{
  $size: WidgetSize;
  $bg: string;
  $border: string;
}>((p) => ({
  width: sizeWidth(p),
  height: sizeHeight(p),
  fontFamily: T.font,
  borderRadius: T.radius,
  overflow: "hidden",
  border: "1.5px solid " + p.$border,
  background: p.$bg,
  boxShadow: T.shadow,
  display: "flex",
  flexDirection: "column" as const,
  transition: "background " + T.transition + ", border-color " + T.transition,
  boxSizing: "border-box" as const,
}));

/* ── Header ─────────────────────────────────────────────────────────────── */

export const Header = styled.div<{ $size: WidgetSize }>((p) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: isCompact(p.$size) ? "10px 12px 0" : "14px 16px 0",
  gap: 6,
  flexShrink: 0,
}));

export const HeaderLeft = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 7,
});

export const HeaderTitle = styled.span<{ $size: WidgetSize }>((p) => ({
  fontSize: isCompact(p.$size) ? 12 : 14,
  fontWeight: 700,
  color: T.text,
  letterSpacing: -0.2,
  userSelect: "none" as const,
}));

export const HeaderRight = styled.div({
  display: "flex",
  alignItems: "center",
  gap: 1,
});

/* ── Toolbar ────────────────────────────────────────────────────────────── */

export const Toolbar = styled.div<{ $size: WidgetSize }>((p) => ({
  display: "flex",
  alignItems: "center",
  gap: isCompact(p.$size) ? 1 : 2,
  padding: isCompact(p.$size) ? "7px 12px 5px" : "8px 16px 6px",
  flexWrap: "wrap" as const,
  flexShrink: 0,
}));

export const ToolSeparator = styled.div<{ $border: string }>((p) => ({
  width: 1,
  height: 16,
  background: p.$border,
  margin: "0 3px",
  opacity: 0.7,
  flexShrink: 0,
}));

/* ── Tool button ────────────────────────────────────────────────────────── */

export const ToolButton = styled.button<{
  $active?: boolean;
  $hoverBg?: string;
  $hoverFg?: string;
}>((p) => ({
  width: 26,
  height: 26,
  border: "none",
  borderRadius: T.radiusXs,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.15s",
  padding: 0,
  flexShrink: 0,
  background: p.$active ? T.accentBg : "transparent",
  color: p.$active ? T.accent : T.textSecondary,
  "&:hover": {
    background: p.$active
      ? T.accentBg
      : (p.$hoverBg || T.accentBgLight),
    color: p.$active
      ? T.accent
      : (p.$hoverFg || T.accent),
  },
}));

/* ── Divider ────────────────────────────────────────────────────────────── */

export const Divider = styled.div<{
  $size: WidgetSize;
  $border: string;
}>((p) => ({
  height: 1,
  background: p.$border,
  margin: isCompact(p.$size) ? "0 12px" : "0 16px",
  opacity: 0.5,
  flexShrink: 0,
}));

/* ── Editor area ────────────────────────────────────────────────────────── */

export const EditorArea = styled.div<{ $size: WidgetSize }>((p) => ({
  flex: 1,
  overflowY: "auto" as const,
  padding: isCompact(p.$size) ? "10px 14px" : "12px 18px",
  outline: "none",
  fontSize: isCompact(p.$size) ? 13 : 14,
  lineHeight: 1.65,
  fontFamily: "inherit",
  color: T.text,
  wordBreak: "break-word" as const,
  minHeight: 0,
  "&:empty::before": {
    content: "attr(data-placeholder)",
    color: T.textMuted,
    pointerEvents: "none" as const,
  },
  "& ul": {
    listStyleType: "disc !important" as string,
    margin: "4px 0",
    paddingLeft: 22,
    display: "block",
  },
  "& ol": {
    listStyleType: "decimal !important" as string,
    margin: "4px 0",
    paddingLeft: 22,
    display: "block",
  },
  "& li": {
    margin: "2px 0",
    display: "list-item !important" as string,
  },
  "& ul li": {
    listStyleType: "disc !important" as string,
  },
  "& ol li": {
    listStyleType: "decimal !important" as string,
  },
  "&::-webkit-scrollbar": {
    width: 4,
  },
  "&::-webkit-scrollbar-thumb": {
    background: T.scrollThumb,
    borderRadius: 4,
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
}));

/* ── Footer ─────────────────────────────────────────────────────────────── */

export const Footer = styled.div<{ $size: WidgetSize }>((p) => ({
  padding: isCompact(p.$size) ? "5px 14px 9px" : "6px 18px 11px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: 11,
  color: T.textMuted,
  flexShrink: 0,
  userSelect: "none" as const,
}));

export const SaveIndicator = styled.span<{ $visible: boolean }>((p) => ({
  opacity: p.$visible ? 1 : 0,
  transition: "opacity 0.3s",
  color: T.accent,
  fontWeight: 500,
}));

/* ── Color wheel dot ────────────────────────────────────────────────────── */

export const ColorWheel = styled.div({
  width: 13,
  height: 13,
  borderRadius: "50%",
  background:
    "conic-gradient(#F3EEFF, #EAFAF0, #FFF4E8, #EBF4FF, #FFF0F5, #fff, #F3EEFF)",
  border: "1.5px solid #D4C4FF",
});

/* ── Note icon ──────────────────────────────────────────────────────────── */

export const NoteIconWrap = styled.span({
  display: "flex",
  alignItems: "center",
  color: T.accent,
  flexShrink: 0,
});
