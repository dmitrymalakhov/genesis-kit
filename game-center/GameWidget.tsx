// ═══════════════════════════════════════════════════════════
// GameWidget.tsx — Главный компонент игрового виджета «Пульс»
// React 18, styled-components (объектная нотация)
// ═══════════════════════════════════════════════════════════

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import type { GameId, GameMode, GameInfo, GameStatus } from "./types";
import {
  COLORS,
  WidgetContainer, Header, HeaderRight, Badge,
  DropdownWrapper, DropdownButton, DropdownIcon, DropdownChevron, DropdownMenu, DropdownItem, DropdownItemIcon, DropdownCheck,
  ContentArea, Btn, SpinnerSvg, SpinnerWrap,
  BoardModeRow, StatusText, TurnDot, BoardOuter, BoardRow, CapturedRow,
  PromoOverlay, PromoBox, PromoBtn, CornersLegend, LegendDot,
  MsTopRow, MsStats, MsGrid,
  BsLayout, BsStatsRow, BsGridWrapper, BsGridLabel, BsGridInner,
  RealtimeBoard, GameOverlay, OverlayTitle, OverlaySubtitle,
  P15Board, P15Tile,
  RvBoard, RvPiece, RvScoreRow,
  PkLegend, PkNextLevelBtn,
} from "./styled";
import {
  COLS8, COLS10, inB,
  PU, PV, INIT_FEN,
  parseFen, isW, isOwn, isEn, pos,
  findKing, inChk, chessLegal, chessDoMove, chessStatus, chessAI,
  CU, initCk, ckOwn, ckAllMoves, ckApply, ckStatus, ckTargets, ckAI,
  CHW, CHB, initCo, coMoves, coStatus, coApply, coAI,
  MS, initMs, msReveal, msFlag, placeMines,
  BSZ, BSH, initBs, bsShoot, bsAllSunk, bsAIShot,
  initP15, p15Click,
  SNK_SIZE, SNK_SPEEDS, initSnake, snakeTick, placeFood,
  TET_W, TET_H, initTetris, tetDrop, tetMove, tetRotateAction, tetHardDrop, tetValid,
  RV_SZ, initReversi, rvValidMoves, rvApply, rvDoMove, rvCount, rvAI, rvResolveTurn,
  PK_W, PK_H, PK_LEVELS, initPulsik, pkIsBlocked, pkGuardVision, pkTick, pkMove,
} from "./engines";




const GAMES = [
  { id: "chess", label: "Шахматы", icon: "♟" },
  { id: "checkers", label: "Шашки", icon: "⛂" },
  { id: "corners", label: "Уголки", icon: "◆" },
  { id: "minesweeper", label: "Сапёр", icon: "💣" },
  { id: "battleship", label: "Морской бой", icon: "🚢" },
  { id: "puzzle15", label: "Пятнашки", icon: "🔢" },
  { id: "snake", label: "Змейка", icon: "🐍" },
  { id: "tetris", label: "Тетрис", icon: "🧱" },
  { id: "reversi", label: "Реверси", icon: "⚫" },
  { id: "pulsik", label: "Пульсик", icon: "🐱" },
];
const BG_GAMES = new Set(["chess", "checkers", "corners"]);

export function GameWidget() {
  const [game, setGame] = useState("chess");
  const [mode, setMode] = useState("ai");
  const [chSt, setChSt] = useState(() => parseFen(INIT_FEN));
  const [ckSt, setCkSt] = useState(() => initCk());
  const [coSt, setCoSt] = useState(() => initCo());
  const [msSt, setMsSt] = useState(() => initMs());
  const [bsSt, setBsSt] = useState(() => initBs());
  const [p15, setP15] = useState(() => initP15());
  const [snk, setSnk] = useState(() => initSnake());
  const snkRef = useRef(null); // interval ref
  const snkBoardRef = useRef(null); // for focus
  const [tet, setTet] = useState(() => initTetris());
  const tetRef = useRef(null);
  const tetBoardRef = useRef(null);
  const [rvSt, setRvSt] = useState(() => initReversi());
  const [pkSt, setPkSt] = useState(() => initPulsik());
  const pkRef = useRef(null);
  const pkBoardRef = useRef(null);
  const [sel, setSel] = useState(null);
  const [legal, setLegal] = useState([]);
  const [lastMv, setLastMv] = useState(null);
  const [mvLog, setMvLog] = useState([]);
  const [capt, setCapt] = useState({ w: [], b: [] });
  const [promo, setPromo] = useState(null);
  const [think, setThink] = useState(false);
  const [msTime, setMsTime] = useState(0);
  const thRef = useRef(false);
  const tmRef = useRef(null);

  const isBG = BG_GAMES.has(game);
  const bgSt = game === "chess" ? chSt : game === "checkers" ? ckSt : coSt;
  const turn = isBG ? bgSt.turn : "w";

  // MS timer
  useEffect(() => {
    if (game === "minesweeper" && msSt.started && !msSt.gameOver) {
      tmRef.current = setInterval(() => setMsTime((t) => t + 1), 1000);
      return () => clearInterval(tmRef.current);
    }
    clearInterval(tmRef.current);
  }, [game, msSt.started, msSt.gameOver]);

  const status = useMemo(() => {
    if (game === "chess") return chessStatus(chSt);
    if (game === "checkers") return ckStatus(ckSt);
    if (game === "corners") return coStatus(coSt);
    if (game === "minesweeper") return msSt.gameOver ? (msSt.won ? "ms_won" : "ms_lost") : "playing";
    if (game === "battleship") return bsSt.gameOver ? (bsSt.winner === "player" ? "bs_won" : "bs_lost") : "playing";
    if (game === "puzzle15") return p15.won ? "p15_won" : "playing";
    if (game === "snake") return snk.gameOver ? "snk_over" : "playing";
    if (game === "tetris") return tet.gameOver ? "tet_over" : "playing";
    if (game === "reversi") {
      if (rvSt.gameOver) { const cnt = rvCount(rvSt.board); return cnt.b > cnt.w ? "rv_black" : cnt.w > cnt.b ? "rv_white" : "rv_draw"; }
      return "playing";
    }
    if (game === "pulsik") return pkSt.gameOver ? (pkSt.won ? "pk_won" : "pk_caught") : "playing";
    return "playing";
  }, [game, chSt, ckSt, coSt, msSt, bsSt, p15, snk, tet, rvSt, pkSt]);

  const isOver = !["playing", "check"].includes(status);

  const sText = useMemo(() => {
    if (think) return "AI думает...";
    const L = { playing: isBG ? (turn === "w" ? "Ваш ход" : "Ход чёрных") : "", check: "Шах!", checkmate_white: "Мат — белые!", checkmate_black: "Мат — чёрные!", stalemate: "Пат", draw_50: "Ничья", win_white: "Белые победили!", win_black: "Чёрные победили!", ms_won: "🎉 Победа!", ms_lost: "💥 Взрыв!", bs_won: "🎉 Вы победили!", bs_lost: "AI победил!", p15_won: "🎉 Собрано!", snk_over: "💀 Игра окончена!", tet_over: "💀 Игра окончена!", rv_black: "⚫ Чёрные победили!", rv_white: "⚪ Белые победили!", rv_draw: "Ничья!", pk_won: "🎉 Все звёзды собраны!", pk_caught: "👔 Босс поймал!" };
    if (game === "minesweeper" && !msSt.started) return "Кликните по клетке";
    if (game === "battleship" && !bsSt.gameOver) return bsSt.msg;
    return L[status] || "";
  }, [status, turn, think, game, isBG, msSt, bsSt]);

  const resetC = () => { setSel(null); setLegal([]); setLastMv(null); setMvLog([]); setCapt({ w: [], b: [] }); setPromo(null); setThink(false); thRef.current = false; };

  const reset = useCallback(() => {
    if (game === "chess") setChSt(parseFen(INIT_FEN));
    else if (game === "checkers") setCkSt(initCk());
    else if (game === "corners") setCoSt(initCo());
    else if (game === "minesweeper") { setMsSt(initMs(msSt.diff)); setMsTime(0); }
    else if (game === "battleship") setBsSt(initBs());
    else if (game === "puzzle15") setP15(initP15(p15.size));
    else if (game === "snake") { clearInterval(snkRef.current); setSnk((prev) => initSnake(prev.speed)); }
    else if (game === "tetris") { clearInterval(tetRef.current); setTet(initTetris()); }
    else if (game === "reversi") setRvSt(initReversi());
    else if (game === "pulsik") { clearInterval(pkRef.current); setPkSt(initPulsik(pkSt.level)); }
    resetC();
  }, [game, msSt.diff, p15.size]);

  const switchG = useCallback((g) => { setGame(g); resetC(); }, []);

  // Board AI
  useEffect(() => {
    if (!isBG || mode !== "ai" || turn !== "b" || isOver || thRef.current) return;
    thRef.current = true; setThink(true);
    const t = setTimeout(() => {
      if (game === "chess") {
        const mv = chessAI(chSt);
        if (mv) { const p = chSt.board[mv.fr][mv.fc], tgt = chSt.board[mv.tr][mv.tc]; setChSt(chessDoMove(chSt, mv.fr, mv.fc, mv.tr, mv.tc)); setLastMv([mv.fr, mv.fc, mv.tr, mv.tc]); setMvLog((pr) => [...pr, `${p.toUpperCase() !== "P" ? PU[p] : ""}${tgt ? "×" : ""}${pos(mv.tr, mv.tc)}`]); if (tgt) setCapt((pr) => ({ ...pr, w: [...pr.w, tgt] })); }
      } else if (game === "checkers") {
        const mv = ckAI(ckSt); if (mv) { setCkSt(ckApply(ckSt, mv.fr, mv.fc, mv.tr, mv.tc, mv.chain)); setLastMv([mv.fr, mv.fc, mv.tr, mv.tc]); setMvLog((pr) => [...pr, mv.chain ? `${pos(mv.fr, mv.fc)}×${pos(mv.tr, mv.tc)}` : `${pos(mv.fr, mv.fc)}-${pos(mv.tr, mv.tc)}`]); }
      } else {
        const mv = coAI(coSt); if (mv) { setCoSt(coApply(coSt, mv.fr, mv.fc, mv.tr, mv.tc)); setLastMv([mv.fr, mv.fc, mv.tr, mv.tc]); setMvLog((pr) => [...pr, `${pos(mv.fr, mv.fc)}→${pos(mv.tr, mv.tc)}`]); }
      }
      setThink(false); thRef.current = false;
    }, 400);
    return () => clearTimeout(t);
  }, [game, mode, turn, isOver, chSt, ckSt, coSt, isBG]);

  // BS AI
  useEffect(() => {
    if (game !== "battleship" || bsSt.turn !== "enemy" || bsSt.gameOver) return;
    const t = setTimeout(() => {
      const pv = bsSt.pGrid.map((r) => r.map((v) => (v === 1 ? 0 : v)));
      const shot = bsAIShot(pv, bsSt.aiHits); if (!shot) return;
      const [sr, sc] = shot;
      const { grid, ships, result } = bsShoot(bsSt.pGrid, bsSt.pShips, sr, sc);
      let nah = [...bsSt.aiHits], msg = "";
      if (result === "hit") { nah.push([sr, sc]); msg = `AI: ${COLS10[sc]}${sr + 1} — попал!`; }
      else if (result === "sunk") { const ss = ships.find((s) => s.sunk && s.cells.some(([r2, c2]) => r2 === sr && c2 === sc)); if (ss) nah = nah.filter(([hr, hc]) => !ss.cells.some(([r2, c2]) => r2 === hr && c2 === hc)); msg = `AI: ${COLS10[sc]}${sr + 1} — потоплен!`; }
      else { msg = `AI: ${COLS10[sc]}${sr + 1} — мимо`; }
      const as = bsAllSunk(ships);
      setBsSt((prev) => ({ ...prev, pGrid: grid, pShips: ships, turn: (result === "hit" || result === "sunk") && !as ? "enemy" : "player", gameOver: as, winner: as ? "enemy" : null, aiHits: nah, msg: as ? "AI победил!" : (result === "miss" ? "Ваш ход" : msg) }));
    }, 600);
    return () => clearTimeout(t);
  }, [game, bsSt]);

  // Snake game loop
  useEffect(() => {
    if (game !== "snake") { clearInterval(snkRef.current); return; }
    if (snk.running && !snk.gameOver) {
      snkRef.current = setInterval(() => {
        setSnk((prev) => snakeTick(prev));
      }, SNK_SPEEDS[snk.speed]);
      return () => clearInterval(snkRef.current);
    }
    clearInterval(snkRef.current);
  }, [game, snk.running, snk.gameOver, snk.speed]);

  // Stop snake when switching away
  useEffect(() => {
    if (game !== "snake") { clearInterval(snkRef.current); setSnk((prev) => ({ ...prev, running: false })); }
  }, [game]);

  // Tetris game loop
  useEffect(() => {
    if (game !== "tetris") { clearInterval(tetRef.current); return; }
    if (tet.running && !tet.gameOver) {
      const speed = Math.max(80, 500 - (tet.level - 1) * 40);
      tetRef.current = setInterval(() => {
        setTet((prev) => tetDrop(prev));
      }, speed);
      return () => clearInterval(tetRef.current);
    }
    clearInterval(tetRef.current);
  }, [game, tet.running, tet.gameOver, tet.level]);

  // Stop tetris when switching away
  useEffect(() => {
    if (game !== "tetris") { clearInterval(tetRef.current); setTet((prev) => ({ ...prev, running: false })); }
  }, [game]);

  // Reversi AI (white)
  useEffect(() => {
    if (game !== "reversi" || rvSt.turn !== "w" || rvSt.gameOver || mode !== "ai") return;
    const t = setTimeout(() => {
      const mv = rvAI(rvSt);
      if (mv) {
        setRvSt((prev) => rvDoMove(prev, mv[0], mv[1]));
        return;
      }
      setRvSt((prev) => ({ ...prev, ...rvResolveTurn(prev.board, prev.turn) }));
    }, 400);
    return () => clearTimeout(t);
  }, [game, rvSt, mode]);

  // Pulsik guard patrol loop
  useEffect(() => {
    if (game !== "pulsik") { clearInterval(pkRef.current); return; }
    if (pkSt.running && !pkSt.gameOver) {
      pkRef.current = setInterval(() => {
        setPkSt((prev) => pkTick(prev));
      }, 500);
      return () => clearInterval(pkRef.current);
    }
    clearInterval(pkRef.current);
  }, [game, pkSt.running, pkSt.gameOver]);

  useEffect(() => {
    if (game !== "pulsik") { clearInterval(pkRef.current); setPkSt((prev) => ({ ...prev, running: false })); }
  }, [game]);

  const execCh = useCallback((fr, fc, tr, tc, pr) => {
    const p = chSt.board[fr][fc], tgt = chSt.board[tr][tc];
    setChSt(chessDoMove(chSt, fr, fc, tr, tc, pr)); setSel(null); setLegal([]); setLastMv([fr, fc, tr, tc]);
    setMvLog((prev) => [...prev, `${p.toUpperCase() !== "P" ? PU[p] : ""}${tgt ? "×" : ""}${pos(tr, tc)}${pr ? "=" + pr : ""}`]);
    if (tgt) setCapt((prev) => ({ ...prev, [isW(p) ? "w" : "b"]: [...prev[isW(p) ? "w" : "b"], tgt] }));
  }, [chSt]);

  const handleBG = useCallback((r, c_) => {
    if (isOver || think || (mode === "ai" && turn === "b")) return;
    const piece = bgSt.board[r][c_];
    if (game === "chess") {
      if (sel) { const [sr, sc] = sel; if (legal.some(([lr, lc]) => lr === r && lc === c_)) { const mp = chSt.board[sr][sc]; if (mp?.toUpperCase() === "P" && (r === 0 || r === 7)) { setPromo({ fr: sr, fc: sc, tr: r, tc: c_ }); return; } execCh(sr, sc, r, c_); } else if (piece && isOwn(piece, chSt.turn)) { setSel([r, c_]); setLegal(chessLegal(chSt, r, c_)); } else { setSel(null); setLegal([]); } }
      else if (piece && isOwn(piece, chSt.turn)) { setSel([r, c_]); setLegal(chessLegal(chSt, r, c_)); }
    } else if (game === "checkers") {
      const own = piece && ckOwn(piece, ckSt.turn);
      if (sel) { const [sr, sc] = sel; const tgts = ckTargets(ckSt, sr, sc); const tgt = tgts.find((t) => t.tr === r && t.tc === c_); if (tgt) { setCkSt(ckApply(ckSt, sr, sc, tgt.tr, tgt.tc, tgt.chain)); setSel(null); setLegal([]); setLastMv([sr, sc, tgt.tr, tgt.tc]); setMvLog((p) => [...p, tgt.chain ? `${pos(sr, sc)}×${pos(tgt.tr, tgt.tc)}` : `${pos(sr, sc)}-${pos(tgt.tr, tgt.tc)}`]); } else if (own) { setSel([r, c_]); setLegal(ckTargets(ckSt, r, c_).map((t) => [t.tr, t.tc])); } else { setSel(null); setLegal([]); } }
      else if (own) { const t = ckTargets(ckSt, r, c_); if (t.length) { setSel([r, c_]); setLegal(t.map((x) => [x.tr, x.tc])); } }
    } else {
      const own = piece && ((coSt.turn === "w" && piece === "w") || (coSt.turn === "b" && piece === "b"));
      if (sel) { const [sr, sc] = sel; if (legal.some(([lr, lc]) => lr === r && lc === c_)) { setCoSt(coApply(coSt, sr, sc, r, c_)); setSel(null); setLegal([]); setLastMv([sr, sc, r, c_]); setMvLog((p) => [...p, `${pos(sr, sc)}→${pos(r, c_)}`]); } else if (own) { setSel([r, c_]); setLegal(coMoves(coSt.board, r, c_)); } else { setSel(null); setLegal([]); } }
      else if (own) { const mv = coMoves(coSt.board, r, c_); if (mv.length) { setSel([r, c_]); setLegal(mv); } }
    }
  }, [game, sel, legal, bgSt, chSt, ckSt, coSt, isOver, think, mode, turn, execCh]);

  const handlePromo = useCallback((type) => { if (!promo) return; setPromo(null); execCh(promo.fr, promo.fc, promo.tr, promo.tc, type); }, [promo, execCh]);

  const bsClick = useCallback((r, c) => {
    if (bsSt.gameOver || bsSt.turn !== "player" || bsSt.eView[r][c] !== 0) return;
    const { grid, ships, result } = bsShoot(bsSt.eGrid, bsSt.eShips, r, c);
    const nv = bsSt.eView.map((x) => [...x]);
    if (result === "miss") nv[r][c] = 2;
    else if (result === "hit") nv[r][c] = 3;
    else if (result === "sunk") { for (let rr = 0; rr < BSZ; rr++) for (let cc = 0; cc < BSZ; cc++) { if (grid[rr][cc] === 4) nv[rr][cc] = 4; else if (grid[rr][cc] === 2 && nv[rr][cc] === 0) nv[rr][cc] = 2; } }
    const as = bsAllSunk(ships);
    setBsSt((prev) => ({ ...prev, eGrid: grid, eShips: ships, eView: nv, turn: result === "miss" ? "enemy" : "player", gameOver: as, winner: as ? "player" : null, msg: as ? "Вы победили!" : (result === "miss" ? "Мимо" : result === "hit" ? "Попал!" : "Потоплен!") }));
  }, [bsSt]);

  const kingPos = game === "chess" ? findKing(chSt.board, chSt.turn) : null;
  const chkNow = game === "chess" && ["check", "checkmate_white", "checkmate_black"].includes(status);
  const isCorZ = (r, c) => { if (game !== "corners") return null; for (const [wr, wc] of CHW) if (wr === r && wc === c) return "w"; for (const [br, bc] of CHB) if (br === r && bc === c) return "b"; return null; };
  const rPiece = (p) => { if (!p) return null; if (game === "chess") return PU[p]; if (game === "checkers") return CU[p]; return "●"; };
  const pColor = (p) => { if (!p) return ""; if (game === "chess") return ""; if (game === "checkers") return (p === "w" || p === "W") ? "#f5f0e8" : "#2d2926"; return p === "w" ? COLORS.accent : COLORS.purple; };
  const mvDisp = useMemo(() => { const o = []; for (let i = 0; i < mvLog.length; i += 2) o.push(`${Math.floor(i / 2) + 1}. ${mvLog[i]}${mvLog[i + 1] ? " " + mvLog[i + 1] : ""}`); return o.join("  "); }, [mvLog]);

  // ── Helpers using styled components ──
  const CELL = 49;

  const Spinner = () => (
    <SpinnerWrap>
      <SpinnerSvg width="14" height="14" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke={COLORS.accent} strokeWidth="2.5" strokeDasharray="30 70" />
      </SpinnerSvg>
      AI думает...
    </SpinnerWrap>
  );
  const renderBG = () => (
    <>
      {/* Mode + Status in one row */}
      <BoardModeRow>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Btn $primary={mode === "ai"} onClick={() => { setMode("ai"); reset(); }}>vs AI</Btn>
          <Btn $primary={mode === "pvp"} onClick={() => { setMode("pvp"); reset(); }}>2 игрока</Btn>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: COLORS.txt2 }}>
          <TurnDot $accent={game === "corners" && turn === "w"} $purple={game === "corners" && turn === "b"} $white={game !== "corners" && turn === "w"} />
          <StatusText $accent={isOver} $danger={status === "check"}>{think ? <Spinner /> : sText}</StatusText>
        </div>
      </BoardModeRow>

      {/* Captured top (chess) */}
      {game === "chess" && <CapturedRow>{[...capt.w].sort((a, b) => (PV[b.toUpperCase()] || 0) - (PV[a.toUpperCase()] || 0)).map((p, i) => <span key={i}>{PU[p]}</span>)}</CapturedRow>}

      {/* Board */}
      <BoardOuter>
        {bgSt.board.map((row, r) => (
          <div key={r} style={{ display: "flex" }}>
            {row.map((piece, c) => {
              const light = (r + c) % 2 === 0;
              const isSel = sel?.[0] === r && sel?.[1] === c;
              const isLast = lastMv && ((lastMv[0] === r && lastMv[1] === c) || (lastMv[2] === r && lastMv[3] === c));
              const isChk = chkNow && kingPos?.[0] === r && kingPos?.[1] === c;
              const isLeg = legal.some(([lr, lc]) => lr === r && lc === c);
              const isCap = isLeg && piece;
              const zone = isCorZ(r, c);
              let bg = light ? COLORS.light : COLORS.dark;
              if (isChk) bg = COLORS.checkBg; else if (isSel) bg = COLORS.sel; else if (isLast) bg = COLORS.last;
              const zOv = zone && !isSel && !isLast ? (zone === "w" ? COLORS.czW : COLORS.czB) : null;

              return (
                <div key={c} onClick={() => handleBG(r, c)} style={{ width: CELL, height: CELL, position: "relative", background: bg, cursor: "pointer", transition: "background 0.15s", flexShrink: 0 }}>
                  {zOv && <div style={{ position: "absolute", inset: 0, background: zOv, pointerEvents: "none" }} />}
                  {c === 0 && <span style={{ position: "absolute", top: 1, left: 2, fontSize: 8, fontWeight: 700, color: light ? COLORS.dark : COLORS.light, pointerEvents: "none", zIndex: 2 }}>{8 - r}</span>}
                  {r === 7 && <span style={{ position: "absolute", bottom: 0, right: 2, fontSize: 8, fontWeight: 700, color: light ? COLORS.dark : COLORS.light, pointerEvents: "none", zIndex: 2 }}>{COLS8[c]}</span>}
                  {isLeg && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: isCap ? "80%" : "28%", height: isCap ? "80%" : "28%", borderRadius: "50%", background: isCap ? "transparent" : COLORS.dot, border: isCap ? `4px solid ${COLORS.capDot}` : "none", pointerEvents: "none", boxSizing: "border-box" }} />}
                  {piece && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: game === "corners" ? 24 : 32, userSelect: "none", pointerEvents: "none", lineHeight: 1, color: pColor(piece), filter: game === "chess" ? "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" : game === "checkers" ? "drop-shadow(0 2px 3px rgba(0,0,0,0.35))" : `drop-shadow(0 2px 4px ${piece === "w" ? "rgba(33,160,56,0.5)" : "rgba(123,97,255,0.5)"})` }}>{rPiece(piece)}</div>}
                </div>
              );
            })}
          </div>
        ))}
        {promo && (
          <PromoOverlay>
            <PromoBox>
              {["Q", "R", "B", "N"].map((t) => (
                <PromoBtn key={t} onClick={() => handlePromo(t)}>{PU[chSt.turn === "w" ? t : t.toLowerCase()]}</PromoBtn>
              ))}
            </PromoBox>
          </PromoOverlay>
        )}
      </BoardOuter>

      {/* Captured bottom (chess) */}
      {game === "chess" && <CapturedRow>{[...capt.b].sort((a, b) => (PV[b.toUpperCase()] || 0) - (PV[a.toUpperCase()] || 0)).map((p, i) => <span key={i}>{PU[p]}</span>)}</CapturedRow>}

      {/* Corners legend */}
      {game === "corners" && (
        <CornersLegend>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><LegendDot $color={COLORS.czW} />Старт белых</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><LegendDot $color={COLORS.czB} />Старт чёрных</span>
        </CornersLegend>
      )}
    </>
  );

  // ── MINESWEEPER RENDER ──
  const renderMs = () => {
    const { rows, cols, grid, revealed, flagged, gameOver, won, minesLeft } = msSt;
    const maxH = Math.floor(380 / rows);
    const maxW = Math.floor(548 / cols);
    const cs = Math.min(maxH, maxW, 42);
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[["easy", "Лёгкий"], ["medium", "Средний"], ["hard", "Сложный"]].map(([d, l]) => (
              <Btn key={d} $primary={msSt.diff === d} onClick={() => { setMsSt(initMs(d)); setMsTime(0); }}>{l}</Btn>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, fontSize: 13, fontWeight: 600, color: COLORS.txt2 }}>
            <span>💣 {minesLeft}</span>
            <span>⏱ {Math.floor(msTime / 60)}:{String(msTime % 60).padStart(2, "0")}</span>
          </div>
        </div>
        <MsGrid>
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} style={{ display: "flex" }}>
              {Array.from({ length: cols }).map((_, c) => {
                const isRev = revealed[r][c], isFl = flagged[r][c], val = grid[r][c], isMine = val === -1;
                let content = "", color = COLORS.txt, bg = "#e2e5e9";
                if (isRev) { bg = isMine ? COLORS.danger : "#f8f9fa"; if (isMine) content = "💣"; else if (val > 0) { content = String(val); color = COLORS.msNums[val]; } }
                else if (isFl) content = "🚩";
                return (
                  <div key={c} onClick={() => { if (!msSt.gameOver) setMsSt((prev) => msReveal(prev, r, c)); }} onContextMenu={(e) => { e.preventDefault(); if (!msSt.gameOver) setMsSt((prev) => msFlag(prev, r, c)); }} style={{ width: cs, height: cs, display: "flex", alignItems: "center", justifyContent: "center", background: bg, border: `0.5px solid ${COLORS.border}`, cursor: gameOver ? "default" : "pointer", fontSize: isMine || isFl ? cs * 0.5 : cs * 0.48, fontWeight: 800, color, userSelect: "none", boxShadow: !isRev && !gameOver ? "inset 1px 1px 0 rgba(255,255,255,0.5),inset -1px -1px 0 rgba(0,0,0,0.08)" : "none" }}>
                    {content}
                  </div>
                );
              })}
            </div>
          ))}
        </MsGrid>
        {gameOver && <div style={{ marginTop: 8, textAlign: "center", fontSize: 14, fontWeight: 700, color: won ? COLORS.accent : COLORS.danger }}>{won ? "🎉 Все мины найдены!" : "💥 Мина!"}</div>}
        <div style={{ marginTop: 6, fontSize: 11, color: COLORS.muted }}>ЛКМ — открыть · ПКМ — флажок</div>
      </div>
    );
  };

  // ── BATTLESHIP RENDER ──
  const renderBsGrid = (gridData, onClick, isEn, label) => {
    const cs = 24;
    return (
      <div style={{ display: "inline-block" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.txt2, marginBottom: 4, textAlign: "center" }}>{label}</div>
        <div style={{ borderRadius: 8, overflow: "hidden", border: `1.5px solid ${COLORS.border}`, display: "inline-block" }}>
          <div style={{ display: "flex" }}>
            <div style={{ width: cs * 0.7, height: cs * 0.7 }} />
            {Array.from({ length: BSZ }).map((_, c) => <div key={c} style={{ width: cs, height: cs * 0.7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: COLORS.muted }}>{COLS10[c]}</div>)}
          </div>
          {Array.from({ length: BSZ }).map((_, r) => (
            <div key={r} style={{ display: "flex" }}>
              <div style={{ width: cs * 0.7, height: cs, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: COLORS.muted }}>{r + 1}</div>
              {Array.from({ length: BSZ }).map((_, c) => {
                const val = gridData[r][c];
                let bg = (r + c) % 2 === 0 ? COLORS.bsW1 : COLORS.bsW2, content = "", cursor = "default", clr = COLORS.muted;
                if (isEn) {
                  if (val === 0) cursor = bsSt.turn === "player" && !bsSt.gameOver ? "crosshair" : "default";
                  else if (val === 2) { bg = "#dfe4ea"; content = "•"; }
                  else if (val === 3) { bg = COLORS.danger; content = "✕"; clr = COLORS.white; }
                  else if (val === 4) { bg = "#1a1a1a"; content = "✕"; clr = COLORS.white; }
                } else {
                  if (val === 1) bg = COLORS.accent;
                  else if (val === 2) { bg = "#dfe4ea"; content = "•"; }
                  else if (val === 3) { bg = COLORS.danger; content = "✕"; clr = COLORS.white; }
                  else if (val === 4) { bg = "#1a1a1a"; content = "✕"; clr = COLORS.white; }
                }
                return <div key={c} onClick={() => onClick?.(r, c)} style={{ width: cs, height: cs, display: "flex", alignItems: "center", justifyContent: "center", background: bg, border: `0.5px solid ${COLORS.border}`, cursor, fontSize: 11, fontWeight: 800, userSelect: "none", color: clr }}>{content}</div>;
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBs = () => {
    const pA = bsSt.pShips.filter((s) => !s.sunk).length, eS = bsSt.eShips.filter((s) => s.sunk).length;
    return (
      <div>
        <BsStatsRow>
          <span>Ваши: {pA}/{bsSt.pShips.length}</span>
          <span>Потоплено: {eS}/{BSH.length}</span>
        </BsStatsRow>
        <BsLayout>
          {renderBsGrid(bsSt.pGrid, null, false, "Ваше поле")}
          {renderBsGrid(bsSt.eView, bsClick, true, "Противник")}
        </BsLayout>
        <div style={{ marginTop: 8, textAlign: "center", fontSize: 13, fontWeight: bsSt.gameOver ? 700 : 500, color: bsSt.gameOver ? (bsSt.winner === "player" ? COLORS.accent : COLORS.danger) : COLORS.txt2 }}>
          {bsSt.turn === "enemy" && !bsSt.gameOver ? <Spinner /> : sText}
        </div>
      </div>
    );
  };

  // ── PUZZLE 15 RENDER ──
  const P15_COLORS = {
    1: "#21a038", 2: "#2ba842", 3: "#35b04c", 4: "#3fb856",
    5: "#7b61ff", 6: "#8a73ff", 7: "#9985ff", 8: "#a897ff",
    9: "#f59e0b", 10: "#f7ab22", 11: "#f9b839", 12: "#fbc550",
    13: "#ef4444", 14: "#f15656", 15: "#f36868",
  };

  const renderP15 = () => {
    const { tiles, size, moves, won } = p15;
    const cs = Math.min(100, Math.floor(440 / size));
    const gap = 6;
    const boardW = cs * size + gap * (size - 1);

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Size selector + moves */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: boardW, marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[3, 4, 5].map((s) => (
              <Btn key={s} $primary={p15.size === s} onClick={() => setP15(initP15(s))}>{s}×{s}</Btn>
            ))}
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.txt2 }}>
            ходов: {moves}
          </span>
        </div>

        {/* Board */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, ${cs}px)`,
          gap,
          padding: 10,
          background: COLORS.bg,
          borderRadius: 14,
          border: `2px solid ${COLORS.border}`,
        }}>
          {tiles.map((tile, idx) => {
            if (tile === 0) return <div key={idx} style={{ width: cs, height: cs }} />;
            const isCorrect = tile === idx + 1;
            const color = P15_COLORS[tile] || COLORS.accent;
            return (
              <div
                key={idx}
                onClick={() => setP15((prev) => p15Click(prev, idx))}
                style={{
                  width: cs, height: cs, borderRadius: 10,
                  background: won ? COLORS.accent : color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: cs * 0.38, fontWeight: 800, color: COLORS.white,
                  cursor: won ? "default" : "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
                  transition: "all 0.12s ease",
                  opacity: isCorrect && !won ? 1 : 0.92,
                  userSelect: "none",
                }}
              >
                {tile}
              </div>
            );
          })}
        </div>

        {/* Status */}
        <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: won ? COLORS.accent : COLORS.txt2, textAlign: "center" }}>
          {won ? `🎉 Собрано за ${moves} ходов!` : "Соберите числа по порядку"}
        </div>
      </div>
    );
  };

  // ── SNAKE RENDER ──
  const renderSnake = () => {
    const cellPx = Math.floor(440 / SNK_SIZE);
    const boardPx = cellPx * SNK_SIZE;
    const headSet = new Set();
    const bodySet = new Set();
    if (snk.snake.length > 0) {
      headSet.add(`${snk.snake[0][0]},${snk.snake[0][1]}`);
      for (let i = 1; i < snk.snake.length; i++) bodySet.add(`${snk.snake[i][0]},${snk.snake[i][1]}`);
    }
    const foodKey = `${snk.food[0]},${snk.food[1]}`;

    const handleKey = (e) => {
      if (snk.gameOver) return;
      const map = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1], w: [-1, 0], s: [1, 0], a: [0, -1], d: [0, 1] };
      const nd = map[e.key];
      if (!nd) return;
      e.preventDefault();
      // Prevent reversing
      setSnk((prev) => {
        if (prev.dir[0] + nd[0] === 0 && prev.dir[1] + nd[1] === 0) return prev;
        if (!prev.running) return { ...prev, nextDir: nd, running: true };
        return { ...prev, nextDir: nd };
      });
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Speed + Score */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: boardPx, marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[["easy", "Медл."], ["medium", "Средн."], ["hard", "Быстр."]].map(([s, l]) => (
              <Btn key={s} $primary={snk.speed === s} onClick={() => { clearInterval(snkRef.current); setSnk(initSnake(s)); }}>{l}</Btn>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, fontSize: 13, fontWeight: 700, color: COLORS.txt2 }}>
            <span>🍎 {snk.score}</span>
            {snk.best > 0 && <span style={{ color: COLORS.muted }}>рек: {snk.best}</span>}
          </div>
        </div>

        {/* Board */}
        <div
          ref={snkBoardRef}
          tabIndex={0}
          onKeyDown={handleKey}
          style={{
            width: boardPx, height: boardPx,
            background: "#1a2332",
            borderRadius: 12,
            border: `2px solid ${COLORS.border}`,
            position: "relative",
            outline: "none",
            overflow: "hidden",
            cursor: "default",
          }}
          onClick={() => {
            snkBoardRef.current?.focus();
            if (snk.gameOver) return;
            if (!snk.running) setSnk((prev) => ({ ...prev, running: true }));
          }}
        >
          {/* Grid lines subtle */}
          {Array.from({ length: SNK_SIZE }).map((_, r) =>
            Array.from({ length: SNK_SIZE }).map((_, c) => {
              const key = `${r},${c}`;
              const isHead = headSet.has(key);
              const isBody = bodySet.has(key);
              const isFood = key === foodKey;

              if (!isHead && !isBody && !isFood) return null;

              return (
                <div key={key} style={{
                  position: "absolute",
                  left: c * cellPx + 1,
                  top: r * cellPx + 1,
                  width: cellPx - 2,
                  height: cellPx - 2,
                  borderRadius: isHead ? 5 : isFood ? "50%" : 3,
                  background: isFood ? "#ef4444" : isHead ? COLORS.accent : "#3cb853",
                  boxShadow: isFood ? "0 0 8px rgba(239,68,68,0.6)" : isHead ? `0 0 6px ${COLORS.accent}80` : "none",
                  transition: "none",
                }} />
              );
            })
          )}

          {/* Overlay messages */}
          {!snk.running && !snk.gameOver && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", borderRadius: 10 }}>
              <div style={{ color: COLORS.white, fontSize: 16, fontWeight: 700 }}>Нажмите чтобы начать</div>
              <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>← ↑ → ↓ или WASD</div>
            </div>
          )}
          {snk.gameOver && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", borderRadius: 10 }}>
              <div style={{ color: COLORS.danger, fontSize: 18, fontWeight: 800 }}>Игра окончена!</div>
              <div style={{ color: COLORS.white, fontSize: 14, marginTop: 4 }}>Счёт: {snk.score}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── TETRIS RENDER ──
  const renderTetris = () => {
    const cellPx = Math.floor(440 / TET_H);
    const bW = cellPx * TET_W, bH = cellPx * TET_H;
    const nextCellPx = 14;

    // Merge board + current piece for display
    const display = tet.board.map((r) => [...r]);
    // Ghost piece (preview drop position)
    let ghostCells = tet.piece.cells;
    while (true) {
      const moved = ghostCells.map(([r, c]) => [r + 1, c]);
      if (!tetValid(tet.board, moved)) break;
      ghostCells = moved;
    }

    const handleKey = (e) => {
      if (tet.gameOver) return;
      e.preventDefault();
      if (!tet.running) { setTet((prev) => ({ ...prev, running: true })); return; }
      if (e.key === "ArrowLeft" || e.key === "a") setTet((prev) => tetMove(prev, -1));
      else if (e.key === "ArrowRight" || e.key === "d") setTet((prev) => tetMove(prev, 1));
      else if (e.key === "ArrowDown" || e.key === "s") setTet((prev) => tetDrop(prev));
      else if (e.key === "ArrowUp" || e.key === "w") setTet((prev) => tetRotateAction(prev));
      else if (e.key === " ") setTet((prev) => tetHardDrop(prev));
    };

    // Build ghost set and piece set
    const ghostSet = new Set(ghostCells.map(([r, c]) => `${r},${c}`));
    const pieceSet = new Map();
    for (const [r, c] of tet.piece.cells) pieceSet.set(`${r},${c}`, tet.piece.color);

    return (
      <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "flex-start" }}>
        {/* Board */}
        <div
          ref={tetBoardRef}
          tabIndex={0}
          onKeyDown={handleKey}
          onClick={() => { tetBoardRef.current?.focus(); if (!tet.running && !tet.gameOver) setTet((prev) => ({ ...prev, running: true })); }}
          style={{
            width: bW, height: bH,
            background: "#0f172a", borderRadius: 10, border: `2px solid ${COLORS.border}`,
            position: "relative", outline: "none", overflow: "hidden",
            display: "grid", gridTemplateColumns: `repeat(${TET_W}, ${cellPx}px)`, gridTemplateRows: `repeat(${TET_H}, ${cellPx}px)`,
          }}
        >
          {Array.from({ length: TET_H }).map((_, r) =>
            Array.from({ length: TET_W }).map((_, c) => {
              const key = `${r},${c}`;
              const boardColor = display[r][c];
              const pieceColor = pieceSet.get(key);
              const isGhost = !pieceColor && ghostSet.has(key) && !boardColor;
              const color = pieceColor || boardColor;

              return (
                <div key={key} style={{
                  width: cellPx, height: cellPx,
                  background: color ? color : isGhost ? "rgba(255,255,255,0.08)" : (r + c) % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                  border: color ? "1px solid rgba(255,255,255,0.15)" : "none",
                  boxSizing: "border-box",
                  borderRadius: color ? 2 : 0,
                  opacity: isGhost ? 0.3 : 1,
                }} />
              );
            })
          )}

          {/* Overlays */}
          {!tet.running && !tet.gameOver && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", borderRadius: 8, zIndex: 10 }}>
              <div style={{ color: COLORS.white, fontSize: 15, fontWeight: 700 }}>Нажмите чтобы начать</div>
              <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 4 }}>← → вращение ↑ пробел — сброс</div>
            </div>
          )}
          {tet.gameOver && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", borderRadius: 8, zIndex: 10 }}>
              <div style={{ color: COLORS.danger, fontSize: 17, fontWeight: 800 }}>Игра окончена!</div>
              <div style={{ color: COLORS.white, fontSize: 13, marginTop: 4 }}>Счёт: {tet.score}</div>
            </div>
          )}
        </div>

        {/* Side panel: next + stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 90 }}>
          {/* Next piece preview */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.txt2, marginBottom: 4 }}>Следующая</div>
            <div style={{ width: nextCellPx * 4 + 8, height: nextCellPx * 4 + 8, background: "#0f172a", borderRadius: 8, border: `1px solid ${COLORS.border}`, padding: 4, display: "grid", gridTemplateColumns: `repeat(4, ${nextCellPx}px)`, gridTemplateRows: `repeat(4, ${nextCellPx}px)` }}>
              {Array.from({ length: 16 }).map((_, i) => {
                const r = Math.floor(i / 4), c = i % 4;
                const isNext = tet.next.cells.some(([nr, nc]) => {
                  const minR = Math.min(...tet.next.cells.map(([rr]) => rr));
                  const minC = Math.min(...tet.next.cells.map(([, cc]) => cc));
                  return nr - minR === r && nc - minC === c;
                });
                return <div key={i} style={{ width: nextCellPx, height: nextCellPx, background: isNext ? tet.next.color : "transparent", borderRadius: isNext ? 2 : 0, border: isNext ? "1px solid rgba(255,255,255,0.15)" : "none", boxSizing: "border-box" }} />;
              })}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[["Счёт", tet.score], ["Линии", tet.lines], ["Уровень", tet.level]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase" }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.txt }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── REVERSI RENDER ──
  const renderReversi = () => {
    const cs = 49;
    const cnt = rvCount(rvSt.board);
    const validMoves = rvSt.turn === "b" || mode === "pvp" ? rvValidMoves(rvSt.board, rvSt.turn) : [];
    const validSet = new Set(validMoves.map(([r, c]) => `${r},${c}`));
    const isAiTurn = mode === "ai" && rvSt.turn === "w" && !rvSt.gameOver;

    return (
      <>
        {/* Mode + Score */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Btn $primary={mode === "ai"} onClick={() => { setMode("ai"); setRvSt(initReversi()); }}>vs AI</Btn>
            <Btn $primary={mode === "pvp"} onClick={() => { setMode("pvp"); setRvSt(initReversi()); }}>2 игрока</Btn>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, fontWeight: 700 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#1a1a1a", display: "inline-block" }} />
              {cnt.b}
            </span>
            <span style={{ color: COLORS.muted }}>:</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {cnt.w}
              <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", border: "1.5px solid #ccc", display: "inline-block" }} />
            </span>
          </div>
        </div>

        {/* Board */}
        <div style={{ borderRadius: 12, overflow: "hidden", border: `2px solid ${COLORS.border}`, lineHeight: 0, display: "inline-block", background: "#2d7d46" }}>
          {Array.from({ length: RV_SZ }).map((_, r) => (
            <div key={r} style={{ display: "flex" }}>
              {Array.from({ length: RV_SZ }).map((_, c) => {
                const piece = rvSt.board[r][c];
                const isValid = validSet.has(`${r},${c}`);
                return (
                  <div key={c} onClick={() => {
                    if (rvSt.gameOver || isAiTurn) return;
                    if (mode === "ai" && rvSt.turn !== "b") return;
                    if (isValid) setRvSt((prev) => rvDoMove(prev, r, c));
                  }} style={{
                    width: cs, height: cs, position: "relative",
                    background: (r + c) % 2 === 0 ? "#2d7d46" : "#267a3f",
                    border: "0.5px solid rgba(0,0,0,0.15)",
                    cursor: isValid ? "pointer" : "default",
                  }}>
                    {/* Valid move hint */}
                    {isValid && !piece && (
                      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
                    )}
                    {/* Piece */}
                    {piece && (
                      <div style={{
                        position: "absolute", top: 4, left: 4, right: 4, bottom: 4,
                        borderRadius: "50%",
                        background: piece === "b"
                          ? "radial-gradient(circle at 35% 35%, #444, #111)"
                          : "radial-gradient(circle at 35% 35%, #fff, #ccc)",
                        boxShadow: piece === "b"
                          ? "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)"
                          : "0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)",
                        transition: "all 0.2s ease",
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Status */}
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500, color: COLORS.txt2 }}>
          {rvSt.gameOver ? (
            <span style={{ fontWeight: 700, color: COLORS.accent }}>{sText}</span>
          ) : isAiTurn ? (
            <Spinner />
          ) : rvSt.passed ? (
            <span style={{ color: COLORS.danger, fontWeight: 600 }}>Пас! Нет доступных ходов</span>
          ) : (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: rvSt.turn === "b" ? "#1a1a1a" : "#fff", border: "1.5px solid #999" }} />
              {rvSt.turn === "b" ? "Ход чёрных" : "Ход белых"}
            </span>
          )}
        </div>
      </>
    );
  };

  // ── PULSIK RENDER ──
  const renderPulsik = () => {
    const cs = Math.min(Math.floor(548 / PK_W), Math.floor(420 / PK_H));
    const bW = cs * PK_W, bH = cs * PK_H;

    // Build vision set for all guards
    const visionSet = new Set();
    for (const g of pkSt.guards) {
      for (const [vr, vc] of pkGuardVision(pkSt.map, g)) visionSet.add(`${vr},${vc}`);
    }
    const starSet = new Set(pkSt.stars.map(([r, c]) => `${r},${c}`));
    const guardSet = new Map();
    for (const g of pkSt.guards) guardSet.set(`${g.pos[0]},${g.pos[1]}`, g);

    const TILE_COLORS = { 0: "#f5f0e8", 1: "#94a3b8", 2: "#a78b6e", 3: "#4ade80" };

    const handleKey = (e) => {
      if (pkSt.gameOver) return;
      const map = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1], w: [-1, 0], s: [1, 0], a: [0, -1], d: [0, 1] };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      setPkSt((prev) => {
        if (!prev.running) return pkMove({ ...prev, running: true }, d[0], d[1]);
        return pkMove(prev, d[0], d[1]);
      });
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Level + Score */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: bW, marginBottom: 6 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {PK_LEVELS.map((_, i) => (
              <Btn key={i} $primary={pkSt.level === i} onClick={() => { clearInterval(pkRef.current); setPkSt(initPulsik(i)); }}>Ур.{i + 1}</Btn>
            ))}
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.txt2 }}>
            ⭐ {pkSt.collected}/{pkSt.total}
          </span>
        </div>

        {/* Board */}
        <div
          ref={pkBoardRef}
          tabIndex={0}
          onKeyDown={handleKey}
          onClick={() => { pkBoardRef.current?.focus(); if (!pkSt.running && !pkSt.gameOver) setPkSt((prev) => ({ ...prev, running: true })); }}
          style={{ width: bW, height: bH, borderRadius: 10, border: `2px solid ${COLORS.border}`, position: "relative", outline: "none", overflow: "hidden", background: "#f5f0e8" }}
        >
          {/* Tiles */}
          {pkSt.map.map((row, r) => row.map((tile, c) => {
            const key = `${r},${c}`;
            const isVision = visionSet.has(key);
            const isStar = starSet.has(key);
            const isPlayer = pkSt.player[0] === r && pkSt.player[1] === c;
            const guard = guardSet.get(key);

            return (
              <div key={key} style={{
                position: "absolute", left: c * cs, top: r * cs, width: cs, height: cs,
                background: TILE_COLORS[tile] || TILE_COLORS[0],
                borderRight: "0.5px solid rgba(0,0,0,0.05)",
                borderBottom: "0.5px solid rgba(0,0,0,0.05)",
              }}>
                {/* Vision cone overlay */}
                {isVision && tile === 0 && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(239,68,68,0.12)", pointerEvents: "none" }} />
                )}
                {/* Star */}
                {isStar && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: cs * 0.55, pointerEvents: "none" }}>⭐</div>
                )}
                {/* Guard (boss) */}
                {guard && (
                  <div style={{ position: "absolute", inset: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: cs * 0.6, pointerEvents: "none", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}>👔</div>
                )}
                {/* Player (Pulsik cat) */}
                {isPlayer && (
                  <div style={{ position: "absolute", inset: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: cs * 0.65, pointerEvents: "none", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.3))", zIndex: 5 }}>🐱</div>
                )}
                {/* Wall/desk decoration */}
                {tile === 2 && (
                  <div style={{ position: "absolute", inset: 2, borderRadius: 3, background: "linear-gradient(135deg, #c9a87c, #a78b6e)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)" }} />
                )}
                {tile === 3 && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: cs * 0.5, pointerEvents: "none" }}>🌿</div>
                )}
              </div>
            );
          }))}

          {/* Overlays */}
          {!pkSt.running && !pkSt.gameOver && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", borderRadius: 8, zIndex: 10 }}>
              <div style={{ color: COLORS.white, fontSize: 15, fontWeight: 700 }}>🐱 Пульсик в офисе</div>
              <div style={{ color: "#ddd", fontSize: 12, marginTop: 4 }}>Собери ⭐ не попадись 👔</div>
              <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 6 }}>← ↑ → ↓ или WASD</div>
            </div>
          )}
          {pkSt.gameOver && !pkSt.won && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", borderRadius: 8, zIndex: 10 }}>
              <div style={{ fontSize: 32 }}>👔</div>
              <div style={{ color: COLORS.danger, fontSize: 16, fontWeight: 800, marginTop: 4 }}>Босс поймал!</div>
              <div style={{ color: "#ccc", fontSize: 12, marginTop: 2 }}>⭐ {pkSt.collected}/{pkSt.total}</div>
            </div>
          )}
          {pkSt.won && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", borderRadius: 8, zIndex: 10 }}>
              <div style={{ fontSize: 32 }}>🎉</div>
              <div style={{ color: COLORS.accent, fontSize: 16, fontWeight: 800, marginTop: 4 }}>Все звёзды собраны!</div>
              {pkSt.level < PK_LEVELS.length - 1 && (
                <button onClick={() => { clearInterval(pkRef.current); setPkSt(initPulsik(pkSt.level + 1)); }} style={{ marginTop: 8, padding: "6px 16px", borderRadius: 8, border: "none", background: COLORS.accent, color: COLORS.white, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Уровень {pkSt.level + 2} →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{ marginTop: 6, display: "flex", gap: 14, fontSize: 11, color: COLORS.muted, flexWrap: "wrap" }}>
          <span>🐱 Пульсик</span>
          <span>👔 Босс</span>
          <span>⭐ Звезда</span>
          <span style={{ color: "#ef444440" }}>■</span><span style={{ marginLeft: -10 }}> Поле зрения</span>
        </div>
      </div>
    );
  };

  // ── Dropdown state ──
  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const curGame = GAMES.find((g) => g.id === game);

  // ══════════════════════════════════════════════════════════
  //  MAIN
  // ══════════════════════════════════════════════════════════
  return (
    <WidgetContainer>
      {/* Header: dropdown + badge + reset */}
      <Header>
        <DropdownWrapper ref={ddRef}>
          <DropdownButton $open={ddOpen} onClick={() => setDdOpen((p) => !p)}>
            <DropdownIcon>{curGame.icon}</DropdownIcon>
            <span>{curGame.label}</span>
            <DropdownChevron $open={ddOpen} width="12" height="12" viewBox="0 0 12 12">
              <path d="M2.5 4.5L6 8L9.5 4.5" fill="none" stroke={COLORS.txt2} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </DropdownChevron>
          </DropdownButton>
          {ddOpen && (
            <DropdownMenu>
              {GAMES.map((g) => (
                <DropdownItem key={g.id} $active={game === g.id} onClick={() => { switchG(g.id); setDdOpen(false); }}>
                  <DropdownItemIcon>{g.icon}</DropdownItemIcon>
                  <span>{g.label}</span>
                  {game === g.id && <DropdownCheck>✓</DropdownCheck>}
                </DropdownItem>
              ))}
            </DropdownMenu>
          )}
        </DropdownWrapper>
        <HeaderRight>
          <Badge>ПУЛЬС</Badge>
          <Btn onClick={reset}>↺ заново</Btn>
        </HeaderRight>
      </Header>

      {/* Content area */}
      <ContentArea>
        {isBG && renderBG()}
        {game === "minesweeper" && renderMs()}
        {game === "battleship" && renderBs()}
        {game === "puzzle15" && renderP15()}
        {game === "snake" && renderSnake()}
        {game === "tetris" && renderTetris()}
        {game === "reversi" && renderReversi()}
        {game === "pulsik" && renderPulsik()}
      </ContentArea>
    </WidgetContainer>
  );
}
