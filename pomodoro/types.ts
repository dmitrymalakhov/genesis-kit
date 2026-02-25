export type Phase = "work" | "shortBreak" | "longBreak";

export type WidgetSize = "major" | "important" | "minor";

export interface PhaseCfg {
  readonly label: string;
  readonly duration: number;
  readonly color: string;
  readonly bg: string;
  readonly icon: string;
}

export interface PomodoroState {
  readonly phase: Phase;
  readonly cfg: PhaseCfg;
  readonly progress: number;
  readonly running: boolean;
  readonly cycle: number;
  readonly done: number;
  readonly mins: number;
  readonly mm: string;
  readonly ss: string;
  readonly go: (p: Phase) => void;
  readonly reset: () => void;
  readonly skip: () => void;
  readonly toggle: () => void;
}

export interface RingProps {
  readonly progress: number;
  readonly color: string;
  readonly size: number;
  readonly strokeWidth: number;
}

export interface CardProps {
  readonly $width: number;
  readonly $height: number;
}

export interface ColorProps {
  readonly $color: string;
}

export interface BgProps {
  readonly $bg: string;
}

export interface ActiveProps {
  readonly $active: boolean;
  readonly $color: string;
}

export interface DotProps {
  readonly $filled: boolean;
  readonly $current: boolean;
}

export interface MainBtnProps {
  readonly $color: string;
}

export interface TimeFontProps {
  readonly $size: number;
}

export interface PhaseLabelProps {
  readonly $color: string;
  readonly $size: number;
}

export interface BadgeProps {
  readonly $color: string;
  readonly $bg: string;
}

export interface StatValueProps {
  readonly $size: number;
}
