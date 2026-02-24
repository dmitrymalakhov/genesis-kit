import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FC,
  type KeyboardEvent,
} from "react";
import {
  type StickyNoteProps,
  type ToolDef,
  COLORS,
  DEFAULT_STORAGE_KEY,
} from "./types";
import {
  Root,
  Header,
  HeaderLeft,
  HeaderTitle,
  HeaderRight,
  Toolbar,
  ToolSeparator,
  ToolButton,
  Divider,
  EditorArea,
  Footer,
  SaveIndicator,
  ColorWheel,
  NoteIconWrap,
  T,
} from "./styled";
import { IconNote, IconTrash } from "./icons";
import { TOOLS, isSep } from "./tools";
import { usePersistence, useFormatTracker } from "./hooks";

/* ── StickyNote ─────────────────────────────────────────────────────────── */

export const StickyNote: FC<StickyNoteProps> = ({
  size = "minor",
  storageKey = DEFAULT_STORAGE_KEY,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef<boolean>(false);
  const [charLen, setCharLen] = useState<number>(0);

  const {
    colorIdx,
    setColorIdx,
    saved,
    persist,
    loadHtml,
  } = usePersistence(storageKey);

  const { formats, syncFormats } = useFormatTracker();

  /* load saved HTML into contentEditable */
  useEffect(() => {
    if (editorRef.current && !loadedRef.current) {
      const html = loadHtml();
      editorRef.current.innerHTML = html;
      setCharLen(editorRef.current.textContent?.length || 0);
      loadedRef.current = true;
    }
  }, [loadHtml]);

  /* exec command helper */
  const exec = useCallback(
    (cmd: string, arg?: string) => {
      if (cmd === "hiliteColor") {
        try {
          const cur = document.queryCommandValue("hiliteColor");
          if (cur && cur !== "rgba(0, 0, 0, 0)" && cur !== "transparent") {
            document.execCommand("hiliteColor", false, "transparent");
            syncFormats();
            return;
          }
        } catch {
          /* noop */
        }
      }
      document.execCommand(cmd, false, arg || null);
      editorRef.current?.focus();
      syncFormats();
    },
    [syncFormats],
  );

  /* on content change */
  const handleInput = useCallback(() => {
    if (!loadedRef.current) return;
    const html = editorRef.current?.innerHTML || "";
    const len = editorRef.current?.textContent?.length || 0;
    setCharLen(len);
    persist(html, colorIdx);
    syncFormats();
  }, [colorIdx, persist, syncFormats]);

  /* keyboard shortcuts */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      (TOOLS.filter((t) => !isSep(t)) as ToolDef[]).forEach((t) => {
        if (t.key && e.ctrlKey && e.key.toLowerCase() === t.key) {
          e.preventDefault();
          exec(t.cmd, t.arg);
          handleInput();
        }
      });
      if (e.key === "Tab") {
        e.preventDefault();
        document.execCommand("insertText", false, "  ");
      }
    },
    [exec, handleInput],
  );

  /* color cycling */
  const cycleColor = useCallback(() => {
    const next = (colorIdx + 1) % COLORS.length;
    setColorIdx(next);
    persist(editorRef.current?.innerHTML || "", next);
  }, [colorIdx, setColorIdx, persist]);

  /* clear all content */
  const clearAll = useCallback(() => {
    if (editorRef.current) editorRef.current.innerHTML = "";
    setCharLen(0);
    persist("", colorIdx);
  }, [colorIdx, persist]);

  const color = COLORS[colorIdx];

  return (
    <Root $size={size} $bg={color.bg} $border={color.border}>
      {/* ── Header ──────────────────────────────────── */}
      <Header $size={size}>
        <HeaderLeft>
          <NoteIconWrap>{IconNote(size === "major" ? 17 : 15)}</NoteIconWrap>
          <HeaderTitle $size={size}>заметка</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <ToolButton
            onMouseDown={(e) => {
              e.preventDefault();
              cycleColor();
            }}
            title="Сменить цвет"
          >
            <ColorWheel />
          </ToolButton>
          <ToolButton
            $hoverBg={T.dangerBg}
            $hoverFg={T.danger}
            onMouseDown={(e) => {
              e.preventDefault();
              clearAll();
            }}
            title="Очистить"
          >
            <IconTrash />
          </ToolButton>
        </HeaderRight>
      </Header>

      {/* ── Toolbar ─────────────────────────────────── */}
      <Toolbar $size={size}>
        {TOOLS.map((item) =>
          isSep(item) ? (
            <ToolSeparator key={item.id} $border={color.border} />
          ) : (
            <ToolButton
              key={item.id}
              $active={formats.has(item.cmd)}
              onMouseDown={(e) => {
                e.preventDefault();
                exec(item.cmd, item.arg);
                handleInput();
              }}
              title={item.title}
            >
              {item.icon}
            </ToolButton>
          ),
        )}
      </Toolbar>

      {/* ── Divider ─────────────────────────────────── */}
      <Divider $size={size} $border={color.border} />

      {/* ── Editor ──────────────────────────────────── */}
      <EditorArea
        ref={editorRef}
        $size={size}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onMouseUp={syncFormats}
        onKeyUp={syncFormats}
        onFocus={syncFormats}
        data-placeholder="Запишите что-нибудь..."
      />

      {/* ── Footer ──────────────────────────────────── */}
      <Footer $size={size}>
        <span>{charLen > 0 ? charLen + " симв." : ""}</span>
        <SaveIndicator $visible={saved}>сохранено ✓</SaveIndicator>
      </Footer>
    </Root>
  );
};
