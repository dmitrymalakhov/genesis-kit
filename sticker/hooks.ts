import { useState, useEffect, useRef, useCallback } from "react";
import {
  type PersistedData,
  TRACKED_COMMANDS,
  DEFAULT_STORAGE_KEY,
  SAVE_DEBOUNCE_MS,
} from "./types";

/* ── usePersistence ─────────────────────────────────────────────────────── */

interface PersistenceResult {
  colorIdx: number;
  setColorIdx: (idx: number) => void;
  saved: boolean;
  persist: (html: string, ci: number) => void;
  loadHtml: () => string;
}

export const usePersistence = (storageKey: string): PersistenceResult => {
  const key = storageKey || DEFAULT_STORAGE_KEY;
  const [colorIdx, setColorIdx] = useState<number>(1);
  const [saved, setSaved] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialRef = useRef<PersistedData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const data: PersistedData = JSON.parse(raw);
        initialRef.current = data;
        setColorIdx(data.colorIdx ?? 1);
      }
    } catch {
      /* noop */
    }
  }, [key]);

  const loadHtml = useCallback((): string => {
    return initialRef.current?.html || "";
  }, []);

  const persist = useCallback(
    (html: string, ci: number) => {
      try {
        const data: PersistedData = { html, colorIdx: ci };
        localStorage.setItem(key, JSON.stringify(data));
      } catch {
        /* noop */
      }
      setSaved(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setSaved(false), SAVE_DEBOUNCE_MS);
    },
    [key],
  );

  return { colorIdx, setColorIdx, saved, persist, loadHtml };
};

/* ── useFormatTracker ───────────────────────────────────────────────────── */

interface FormatTrackerResult {
  formats: Set<string>;
  syncFormats: () => void;
}

export const useFormatTracker = (): FormatTrackerResult => {
  const [formats, setFormats] = useState<Set<string>>(new Set());

  const syncFormats = useCallback(() => {
    const s = new Set<string>();
    TRACKED_COMMANDS.forEach((cmd) => {
      try {
        if (document.queryCommandState(cmd)) {
          s.add(cmd);
        }
      } catch {
        /* noop */
      }
    });
    try {
      const hl = document.queryCommandValue("hiliteColor");
      if (hl && hl !== "rgba(0, 0, 0, 0)" && hl !== "transparent") {
        s.add("hiliteColor");
      }
    } catch {
      /* noop */
    }
    setFormats(s);
  }, []);

  return { formats, syncFormats };
};
