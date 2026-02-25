import type { Phase, PhaseCfg } from "./types";

export const PHASES: Record<Phase, PhaseCfg> = {
  work: {
    label: "Фокус",
    duration: 25 * 60,
    color: "#7B61FF",
    bg: "#F0ECFF",
    icon: "🎯",
  },
  shortBreak: {
    label: "Перерыв",
    duration: 5 * 60,
    color: "#00C48C",
    bg: "#E6FAF3",
    icon: "☕",
  },
  longBreak: {
    label: "Отдых",
    duration: 15 * 60,
    color: "#FF6B8A",
    bg: "#FFF0F3",
    icon: "🌿",
  },
};

export const TOTAL_CYCLES = 4;

export const PHASE_KEYS: Phase[] = ["work", "shortBreak", "longBreak"];
