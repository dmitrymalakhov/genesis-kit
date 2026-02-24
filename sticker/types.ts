import { type ReactNode } from "react";

export type WidgetSize = "major" | "important" | "minor";

export type NoteColorId = "white" | "purple" | "green" | "orange" | "blue" | "pink";

export interface NoteColor {
  id: NoteColorId;
  bg: string;
  border: string;
  highlight: string;
}

export interface ToolDef {
  id: string;
  cmd: string;
  key?: string;
  arg?: string;
  icon: ReactNode;
  title: string;
}

export interface ToolSep {
  id: string;
  sep: true;
}

export type ToolItem = ToolDef | ToolSep;

export interface ToolBtnProps {
  children: ReactNode;
  onClick: () => void;
  title?: string;
  $active?: boolean;
  $hoverBg?: string;
  $hoverFg?: string;
}

export interface StickyNoteProps {
  size?: WidgetSize;
  storageKey?: string;
}

export interface PersistedData {
  html: string;
  colorIdx: number;
}

export interface SizeDimensions {
  width: number;
  height: number;
}

export const SIZE_MAP: Record<WidgetSize, SizeDimensions> = {
  major: { width: 600, height: 570 },
  important: { width: 600, height: 280 },
  minor: { width: 296, height: 280 },
};

export const COLORS: NoteColor[] = [
  { id: "white", bg: "#FFFFFF", border: "#E8E8EB", highlight: "#F0F0F3" },
  { id: "purple", bg: "#F3EEFF", border: "#D4C4FF", highlight: "#E8DCFF" },
  { id: "green", bg: "#EAFAF0", border: "#B8EDCB", highlight: "#D0F5DD" },
  { id: "orange", bg: "#FFF4E8", border: "#FFD9A8", highlight: "#FFE6C4" },
  { id: "blue", bg: "#EBF4FF", border: "#B3D4FF", highlight: "#CCE2FF" },
  { id: "pink", bg: "#FFF0F5", border: "#FFB8D4", highlight: "#FFD6E6" },
];

export const DEFAULT_STORAGE_KEY = "pulse-lab-sticky-note";

export const SAVE_DEBOUNCE_MS = 1500;

export const TRACKED_COMMANDS: string[] = [
  "bold",
  "italic",
  "underline",
  "strikeThrough",
  "insertUnorderedList",
  "insertOrderedList",
];
