import { type FC } from "react";
import type { RingProps } from "./types";

export const TimerRing: FC<RingProps> = ({ progress, color, size, strokeWidth }) => {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - progress);

  return (
    <svg
      width={size}
      height={size}
      style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}
    >
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#F0EDF5" strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.3s" }}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth + 4}
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        opacity={0.1}
        style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.3s" }}
      />
    </svg>
  );
};

export const PlayIcon: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5.14v14.72a1 1 0 001.5.86l11.24-7.36a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" />
  </svg>
);

export const PauseIcon: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

export const ResetIcon: FC = () => (
  <svg
    width="11" height="11" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export const SkipIcon: FC = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 4.14v15.72a1 1 0 001.5.86l10-7.86a1 1 0 000-1.72l-10-7.86A1 1 0 005 4.14z" />
    <rect x="18" y="4" width="2.5" height="16" rx="1" />
  </svg>
);
