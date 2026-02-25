import { useState, useEffect, useRef, useCallback } from "react";
import type { Phase, PomodoroState } from "./types";
import { PHASES, TOTAL_CYCLES } from "./constants";

export const useChime = (): (() => void) => {
  const ctx = useRef<AudioContext | null>(null);

  const play = useCallback(() => {
    try {
      if (!ctx.current) {
        const AudioCtx =
          window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctx.current = new AudioCtx();
      }
      const x = ctx.current;
      const osc = x.createOscillator();
      const gain = x.createGain();
      osc.connect(gain);
      gain.connect(x.destination);
      osc.type = "sine";
      const t = x.currentTime;
      osc.frequency.setValueAtTime(659, t);
      osc.frequency.setValueAtTime(784, t + 0.12);
      osc.frequency.setValueAtTime(988, t + 0.24);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
      osc.start(t);
      osc.stop(t + 0.5);
    } catch {
      /* Web Audio not available */
    }
  }, []);

  return play;
};

export const usePomodoro = (): PomodoroState => {
  const [phase, setPhase] = useState<Phase>("work");
  const [timeLeft, setTimeLeft] = useState<number>(PHASES.work.duration);
  const [running, setRunning] = useState<boolean>(false);
  const [cycle, setCycle] = useState<number>(0);
  const [done, setDone] = useState<number>(0);
  const [mins, setMins] = useState<number>(0);
  const chime = useChime();

  const cfg = PHASES[phase];
  const progress = 1 - timeLeft / cfg.duration;

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [running]);

  const switchTo = useCallback((p: Phase) => {
    setPhase(p);
    setTimeLeft(PHASES[p].duration);
    setRunning(false);
  }, []);

  useEffect(() => {
    if (timeLeft !== 0 || !running) return;
    setRunning(false);
    chime();

    if (phase === "work") {
      const nc = cycle + 1;
      setDone((d) => d + 1);
      setMins((m) => m + Math.round(PHASES.work.duration / 60));
      if (nc >= TOTAL_CYCLES) {
        setCycle(0);
        switchTo("longBreak");
      } else {
        setCycle(nc);
        switchTo("shortBreak");
      }
    } else {
      switchTo("work");
    }
  }, [timeLeft, running, phase, cycle, chime, switchTo]);

  const reset = useCallback(() => {
    setRunning(false);
    setTimeLeft(cfg.duration);
  }, [cfg.duration]);

  const skip = useCallback(() => {
    setRunning(false);
    if (phase === "work") {
      const nc = cycle + 1;
      if (nc >= TOTAL_CYCLES) {
        setCycle(0);
        switchTo("longBreak");
      } else {
        setCycle(nc);
        switchTo("shortBreak");
      }
    } else {
      switchTo("work");
    }
  }, [phase, cycle, switchTo]);

  const toggle = useCallback(() => {
    if (timeLeft === 0) {
      setTimeLeft(cfg.duration);
    }
    setRunning((r) => !r);
  }, [timeLeft, cfg.duration]);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  return {
    phase,
    cfg,
    progress,
    running,
    cycle,
    done,
    mins,
    mm,
    ss,
    go: switchTo,
    reset,
    skip,
    toggle,
  };
};
