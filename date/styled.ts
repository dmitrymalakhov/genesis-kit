import styled from "styled-components";
import type { WeekDayProps } from "./types";

export const Widget = styled.div({
  fontFamily: "'SB Sans Text', 'Manrope', 'Nunito', -apple-system, sans-serif",
  position: "relative",
  overflow: "hidden",
  userSelect: "none",
  width: "296px",
  height: "280px",
  background: "#ffffff",
  borderRadius: "20px",
  padding: "20px 20px 16px",
  boxSizing: "border-box",
  boxShadow: "0 2px 16px rgba(123,97,255,0.10), 0 1px 4px rgba(0,0,0,0.06)",
  display: "flex",
  flexDirection: "column",
});

export const AccentBar = styled.div({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "3px",
  background: "linear-gradient(90deg, #7B61FF 0%, #9B8AFF 60%, #B8A9FF 100%)",
  borderRadius: "20px 20px 0 0",
});

export const DateRow = styled.div({
  display: "flex",
  alignItems: "flex-end",
  gap: "8px",
  marginBottom: "2px",
});

export const DayNumber = styled.span({
  fontSize: "52px",
  fontWeight: 800,
  color: "#1A1A2E",
  lineHeight: 1,
  letterSpacing: "-2px",
});

export const DateRightCol = styled.div({
  display: "flex",
  flexDirection: "column",
  paddingBottom: "7px",
  gap: "2px",
});

export const MonthText = styled.span({
  fontSize: "18px",
  fontWeight: 700,
  color: "#1A1A2E",
  lineHeight: 1.2,
});

export const YearText = styled.span({
  fontSize: "12px",
  fontWeight: 500,
  color: "#9B9BB4",
});

export const DayName = styled.div({
  fontSize: "13px",
  fontWeight: 600,
  color: "#7B61FF",
  letterSpacing: "0.01em",
  marginBottom: "12px",
});

export const Divider = styled.div({
  height: "1px",
  background: "linear-gradient(90deg, #F0EDFF 0%, transparent 100%)",
  marginBottom: "12px",
});

export const WeekRow = styled.div({
  display: "flex",
  justifyContent: "space-between",
  gap: "3px",
  flex: 1,
});

export const WeekDay = styled.div<WeekDayProps>(({ $isToday, $isPast, $isWeekend }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  flex: 1,
  padding: "5px 2px",
  borderRadius: "10px",
  background: $isToday ? "#7B61FF" : "transparent",
  cursor: "default",
}));

export const WeekDayLabel = styled.span<WeekDayProps>(({ $isToday, $isWeekend }) => ({
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: $isToday ? "rgba(255,255,255,0.7)" : $isWeekend ? "#C4B8FF" : "#BBBBD0",
}));

export const WeekDayNum = styled.span<WeekDayProps>(({ $isToday, $isPast, $isWeekend }) => ({
  fontSize: "14px",
  fontWeight: $isToday ? 800 : 600,
  color: $isToday ? "#ffffff" : $isPast ? "#CBCBE0" : $isWeekend ? "#9B8AFF" : "#1A1A2E",
}));

export const TimeRow = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "5px",
  marginTop: "10px",
});

export const TimeDot = styled.div({
  width: "5px",
  height: "5px",
  borderRadius: "50%",
  background: "#7B61FF",
  opacity: 0.4,
});

export const TimeText = styled.span({
  fontSize: "11px",
  fontWeight: 600,
  color: "#9B9BB4",
  letterSpacing: "0.06em",
  fontVariantNumeric: "tabular-nums",
});
