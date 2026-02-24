import React from "react";
import { type ToolItem } from "./types";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrike,
  IconUl,
  IconOl,
  IconHighlight,
} from "./icons";

export const HIGHLIGHT_COLOR = "#E8DCFF";

export const TOOLS: ToolItem[] = [
  {
    id: "bold",
    cmd: "bold",
    key: "b",
    icon: <IconBold />,
    title: "Жирный (Ctrl+B)",
  },
  {
    id: "italic",
    cmd: "italic",
    key: "i",
    icon: <IconItalic />,
    title: "Курсив (Ctrl+I)",
  },
  {
    id: "underline",
    cmd: "underline",
    key: "u",
    icon: <IconUnderline />,
    title: "Подчёркнутый (Ctrl+U)",
  },
  {
    id: "strike",
    cmd: "strikeThrough",
    icon: <IconStrike />,
    title: "Зачёркнутый",
  },
  { id: "sep1", sep: true as const },
  {
    id: "ul",
    cmd: "insertUnorderedList",
    icon: <IconUl />,
    title: "Маркированный список",
  },
  {
    id: "ol",
    cmd: "insertOrderedList",
    icon: <IconOl />,
    title: "Нумерованный список",
  },
  { id: "sep2", sep: true as const },
  {
    id: "highlight",
    cmd: "hiliteColor",
    arg: HIGHLIGHT_COLOR,
    icon: <IconHighlight />,
    title: "Выделение цветом",
  },
];

export const isSep = (item: ToolItem): item is { id: string; sep: true } =>
  "sep" in item && item.sep === true;
