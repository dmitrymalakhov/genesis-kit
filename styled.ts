import styled from "styled-components";
import type { SizeConfig } from "./types";

export const Wrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'SF Pro Display', -apple-system, 'Segoe UI', system-ui, sans-serif",
  userSelect: "none",
  width: "100%",
  height: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
});

export const Header = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  paddingLeft: "4px",
  paddingRight: "4px",
  boxSizing: "border-box",
});

export const LogoWrap = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

export const LogoText = styled.span({
  fontWeight: 800,
  fontSize: "16px",
  color: "#1A1A1A",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
});

export const LogoAccent = styled.span({
  fontWeight: 400,
  fontSize: "16px",
  color: "#7B2FBE",
  fontStyle: "italic",
});

export const Spacer = styled.div({
  flex: 1,
});

export const ScoreRow = styled.div({
  display: "flex",
  gap: "12px",
  fontSize: "11px",
  color: "#A0A0A0",
});

export const ScoreValue = styled.strong<{ $accent?: boolean }>((props) => ({
  color: props.$accent ? "#7B2FBE" : "#1A1A1A",
}));

export const CanvasCard = styled.div<{ $sizeConfig: SizeConfig }>((props) => ({
  position: "relative",
  background: "#F0EDED",
  borderRadius: "12px",
  boxShadow: "0 2px 16px rgba(90,31,142,0.08), 0 0 0 1px rgba(90,31,142,0.06)",
  overflow: "hidden",
  width: props.$sizeConfig.width,
  maxWidth: "100%",
}));

export const Canvas = styled.canvas({
  display: "block",
  cursor: "pointer",
  maxWidth: "100%",
});

export const ControlsRow = styled.div({
  display: "flex",
  gap: "6px",
  flexWrap: "wrap",
  justifyContent: "center",
});

export const ControlBadge = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "5px",
  background: "#FFFFFF",
  borderRadius: "6px",
  padding: "4px 10px",
  fontSize: "11px",
  color: "#6B6B6B",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
});

export const ControlKey = styled.span({
  background: "#F0EDED",
  borderRadius: "3px",
  padding: "1px 5px",
  fontWeight: 600,
  fontSize: "10px",
  color: "#7B2FBE",
  border: "1px solid rgba(123,47,190,0.15)",
});

export const ContentStack = styled.div<{ $gap: number }>((props) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: props.$gap,
  width: "100%",
  padding: "8px",
  boxSizing: "border-box",
}));
