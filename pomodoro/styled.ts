import styled from "styled-components";
import type {
  CardProps,
  ColorProps,
  ActiveProps,
  DotProps,
  MainBtnProps,
  TimeFontProps,
  PhaseLabelProps,
  BadgeProps,
  StatValueProps,
} from "./types";

// ─── Card Shell ─────────────────────────────────────────

export const Card = styled.div<CardProps>((props) => ({
  width: props.$width,
  height: props.$height,
  borderRadius: 16,
  background: "#fff",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column" as const,
  overflow: "hidden",
  boxSizing: "border-box" as const,
  fontFamily:
    '"SB Sans Display", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}));

// ─── Header ─────────────────────────────────────────────

export const Header = styled.div({
  padding: "10px 14px 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexShrink: 0,
});

export const HeaderTitle = styled.span({
  fontWeight: 700,
  fontSize: 13,
  color: "#1A1A2E",
});

export const PhaseTabsWrap = styled.div({
  display: "flex",
  gap: 2,
  background: "#F4F2FA",
  borderRadius: 8,
  padding: 2,
});

export const PhaseTab = styled.button<ActiveProps>((props) => ({
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "3px 8px",
  borderRadius: 6,
  fontSize: 10,
  fontWeight: 600,
  background: props.$active ? "#fff" : "transparent",
  color: props.$active ? props.$color : "#B0ABBD",
  boxShadow: props.$active ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
  transition: "all 0.2s ease",
}));

export const PhaseTabWide = styled.button<ActiveProps>((props) => ({
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  flex: 1,
  padding: "7px 0",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  background: props.$active ? "#fff" : "transparent",
  color: props.$active ? props.$color : "#8A85A0",
  boxShadow: props.$active ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
  transition: "all 0.2s ease",
}));

export const PhaseTabsWideWrap = styled.div({
  display: "flex",
  gap: 4,
  background: "#F4F2FA",
  borderRadius: 10,
  padding: 3,
});

export const Badge = styled.span<BadgeProps>((props) => ({
  fontSize: 10,
  fontWeight: 600,
  color: props.$color,
  background: props.$bg,
  borderRadius: 8,
  padding: "2px 8px",
  lineHeight: "16px",
  transition: "all 0.3s",
}));

// ─── Timer Center ───────────────────────────────────────

export const TimerCenter = styled.div({
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
});

export const RingWrap = styled.div<{ $size: number }>((props) => ({
  position: "relative" as const,
  width: props.$size,
  height: props.$size,
}));

export const RingInner = styled.div({
  position: "absolute" as const,
  inset: 0,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
});

export const TimeDisplay = styled.span<TimeFontProps>((props) => ({
  fontSize: props.$size,
  fontWeight: 700,
  color: "#1A1A2E",
  fontVariantNumeric: "tabular-nums",
  lineHeight: 1,
  letterSpacing: "-0.02em",
}));

export const PhaseLabel = styled.span<PhaseLabelProps>((props) => ({
  fontSize: props.$size,
  color: props.$color,
  marginTop: 4,
  fontWeight: 600,
  transition: "color 0.3s",
}));

// ─── Cycle Dots ─────────────────────────────────────────

export const CycleRow = styled.div<{ $mt?: number }>((props) => ({
  display: "flex",
  gap: 5,
  alignItems: "center",
  marginTop: props.$mt ?? 10,
}));

export const CycleDot = styled.div<DotProps>((props) => ({
  width: 7,
  height: 7,
  borderRadius: "50%",
  transition: "all 0.3s",
  background: props.$filled ? "#7B61FF" : props.$current ? "#C4B5FD" : "#E8E5F0",
  transform: props.$current ? "scale(1.25)" : "scale(1)",
}));

export const CycleLabel = styled.span({
  fontSize: 9,
  color: "#8A85A0",
  marginLeft: 2,
});

// ─── Controls Footer ────────────────────────────────────

export const Footer = styled.div<{ $height?: number }>((props) => ({
  height: props.$height ?? 48,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  borderTop: "1px solid #F4F2FA",
}));

export const SecondaryBtn = styled.button<{ $size?: number }>((props) => ({
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: props.$size ?? 28,
  height: props.$size ?? 28,
  borderRadius: "50%",
  borderWidth: 1.5,
  borderStyle: "solid",
  borderColor: "#E8E5F0",
  background: "#fff",
  color: "#8A85A0",
  transition: "all 0.15s ease",
  "&:active": {
    transform: "scale(0.93)",
  },
  "&:hover": {
    borderColor: "#D0CCE0",
    background: "#FAFAFE",
  },
}));

export const MainBtn = styled.button<MainBtnProps & { $size?: number }>((props) => ({
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: props.$size ?? 44,
  height: props.$size ?? 44,
  borderRadius: "50%",
  background: props.$color,
  color: "#fff",
  boxShadow: `0 4px 14px ${props.$color}35`,
  transition: "all 0.2s ease",
  "&:active": {
    transform: "scale(0.93)",
  },
  "&:hover": {
    boxShadow: `0 6px 20px ${props.$color}50`,
  },
}));

// ─── Major-specific ─────────────────────────────────────

export const MajorHeader = styled.div({
  padding: "16px 20px 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexShrink: 0,
});

export const MajorTitle = styled.span({
  fontWeight: 700,
  fontSize: 16,
  color: "#1A1A2E",
});

export const MajorBody = styled.div({
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  padding: "0 20px",
  gap: 12,
});

export const StatsRow = styled.div({
  display: "flex",
  justifyContent: "space-around",
  width: "100%",
  padding: "14px 20px 16px",
  borderTop: "1px solid #F4F2FA",
});

export const StatBlock = styled.div({
  textAlign: "center" as const,
});

export const StatValue = styled.div<StatValueProps>((props) => ({
  fontSize: props.$size,
  fontWeight: 700,
  color: "#1A1A2E",
}));

export const StatLabel = styled.div({
  fontSize: 10,
  color: "#8A85A0",
  fontWeight: 500,
  marginTop: 2,
});

// ─── Important-specific ─────────────────────────────────

export const ImportantBody = styled.div({
  flex: 1,
  display: "flex",
  alignItems: "center",
  padding: "0 20px",
  gap: 24,
});

export const ImportantInfo = styled.div({
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
  gap: 10,
});

export const ImportantStatsGrid = styled.div({
  display: "flex",
  gap: 16,
});

export const ImportantStatItem = styled.div({
  display: "flex",
  flexDirection: "column" as const,
  gap: 1,
});

export const ImportantStatVal = styled.span({
  fontSize: 20,
  fontWeight: 700,
  color: "#1A1A2E",
});

export const ImportantStatLbl = styled.span({
  fontSize: 10,
  color: "#8A85A0",
  fontWeight: 500,
});
