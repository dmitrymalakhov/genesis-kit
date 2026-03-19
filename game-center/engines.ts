// ═══════════════════════════════════════════════════════════
// engines.ts — Игровая логика для всех 10 игр
// ═══════════════════════════════════════════════════════════

export const COLS8 = "abcdefgh";
export const COLS10 = "АБВГДЕЖЗИК";
export const inB = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

export const C = {
  bg: "#f3f4f6", card: "#fff", border: "#e8eaed",
  light: "#f0efe9", dark: "#7fad7a",
  sel: "rgba(33,150,83,0.45)", dot: "rgba(33,150,83,0.35)",
  capDot: "rgba(210,60,60,0.35)", last: "rgba(255,212,59,0.40)",
  checkBg: "radial-gradient(ellipse at center,rgba(210,40,40,0.65) 0%,rgba(210,40,40,0) 70%)",
  accent: "#21a038", purple: "#7b61ff",
  txt: "#1a1a1a", txt2: "#6b7280", muted: "#9ca3af",
  danger: "#d23c3c", white: "#fff",
  czW: "rgba(33,150,83,0.12)", czB: "rgba(123,97,255,0.12)",
  msNums: ["", "#2563eb", "#16a34a", "#dc2626", "#7c3aed", "#b91c1c", "#0891b2", "#1a1a1a", "#6b7280"],
  bsW1: "#e8f4fd", bsW2: "#bde0f5",
};

// ══════════════════════════════════════════════════════════
//  ШАХМАТЫ
// ══════════════════════════════════════════════════════════
export const PU = { K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙", k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" };
export const PV = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };
export const INIT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function parseFen(fen) {
  const p = fen.split(" "), rows = p[0].split("/");
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  for (let r = 0; r < 8; r++) {
    let c = 0;
    for (const ch of rows[r]) {
      if (/\d/.test(ch)) c += parseInt(ch);
      else { board[r][c] = ch; c++; }
    }
  }
  return { board, turn: p[1] || "w", castling: p[2] || "-", ep: p[3] || "-", half: +p[4] || 0, full: +p[5] || 1 };
}

export const isW = (p) => p && p === p.toUpperCase();
export const isOwn = (p, t) => (t === "w" ? isW(p) : (p && p === p.toLowerCase()));
export const isEn = (p, t) => p && !isOwn(p, t);
export const pos = (r, c) => `${COLS8[c]}${8 - r}`;

export function sqAtt(board, r, c, by) {
  const en = by === "w" ? "b" : "w";
  for (let rr = 0; rr < 8; rr++) for (let cc = 0; cc < 8; cc++) {
    const p = board[rr][cc]; if (!p || !isOwn(p, en)) continue;
    const t = p.toUpperCase(), dr = r - rr, dc = c - cc, ar = Math.abs(dr), ac = Math.abs(dc);
    if (t === "P") { const d = en === "w" ? -1 : 1; if (rr + d === r && ac === 1) return true; }
    if (t === "N" && ((ar === 2 && ac === 1) || (ar === 1 && ac === 2))) return true;
    if (t === "K" && ar <= 1 && ac <= 1) return true;
    if ((t === "B" || t === "Q") && ar === ac && ar > 0) {
      const sr = Math.sign(dr), sc = Math.sign(dc); let ok = true;
      for (let i = 1; i < ar; i++) if (board[rr + sr * i][cc + sc * i]) { ok = false; break; }
      if (ok) return true;
    }
    if ((t === "R" || t === "Q") && (dr === 0 || dc === 0) && ar + ac > 0) {
      const sr = Math.sign(dr), sc = Math.sign(dc), dist = Math.max(ar, ac); let ok = true;
      for (let i = 1; i < dist; i++) if (board[rr + sr * i][cc + sc * i]) { ok = false; break; }
      if (ok) return true;
    }
  }
  return false;
}

export function findKing(b, t) { const k = t === "w" ? "K" : "k"; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (b[r][c] === k) return [r, c]; return null; }
export function inChk(b, t) { const kp = findKing(b, t); return kp ? sqAtt(b, kp[0], kp[1], t) : false; }

export function chessPseudo(st, r, c) {
  const { board, turn, castling, ep } = st, piece = board[r][c];
  if (!piece || !isOwn(piece, turn)) return [];
  const mv = [], t = piece.toUpperCase(), dir = turn === "w" ? -1 : 1, sr = turn === "w" ? 6 : 1;
  const add = (nr, nc) => { if (!inB(nr, nc)) return false; if (!board[nr][nc]) { mv.push([nr, nc]); return true; } if (isEn(board[nr][nc], turn)) mv.push([nr, nc]); return false; };
  const slide = (dirs) => { for (const [dr, dc] of dirs) for (let i = 1; i < 8; i++) if (!add(r + dr * i, c + dc * i)) break; };
  if (t === "P") {
    const nr = r + dir;
    if (inB(nr, c) && !board[nr][c]) { mv.push([nr, c]); if (r === sr && !board[r + 2 * dir][c]) mv.push([r + 2 * dir, c]); }
    for (const dc of [-1, 1]) { const nc = c + dc; if (!inB(nr, nc)) continue; if (board[nr][nc] && isEn(board[nr][nc], turn)) mv.push([nr, nc]); if (ep === pos(nr, nc)) mv.push([nr, nc]); }
  }
  if (t === "N") for (const [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]) add(r + dr, c + dc);
  if (t === "B" || t === "Q") slide([[-1, -1], [-1, 1], [1, -1], [1, 1]]);
  if (t === "R" || t === "Q") slide([[-1, 0], [1, 0], [0, -1], [0, 1]]);
  if (t === "K") {
    for (const [dr, dc] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) add(r + dr, c + dc);
    const row = turn === "w" ? 7 : 0;
    if (r === row && c === 4) {
      const ks = turn === "w" ? "K" : "k", qs = turn === "w" ? "Q" : "q";
      if (castling.includes(ks) && !board[row][5] && !board[row][6] && board[row][7]?.toUpperCase() === "R" && isOwn(board[row][7], turn) && !sqAtt(board, row, 4, turn) && !sqAtt(board, row, 5, turn) && !sqAtt(board, row, 6, turn)) mv.push([row, 6]);
      if (castling.includes(qs) && !board[row][3] && !board[row][2] && !board[row][1] && board[row][0]?.toUpperCase() === "R" && isOwn(board[row][0], turn) && !sqAtt(board, row, 4, turn) && !sqAtt(board, row, 3, turn) && !sqAtt(board, row, 2, turn)) mv.push([row, 2]);
    }
  }
  return mv;
}

export function chessDoMove(st, fr, fc, tr, tc, promo) {
  const nb = st.board.map((r) => [...r]), piece = nb[fr][fc], t = piece.toUpperCase();
  let cast = st.castling, nep = "-", cap = nb[tr][tc], half = st.half + 1;
  if (t === "P" && pos(tr, tc) === st.ep) { nb[st.turn === "w" ? tr + 1 : tr - 1][tc] = null; cap = true; }
  nb[tr][tc] = piece; nb[fr][fc] = null;
  if (t === "P" && Math.abs(tr - fr) === 2) nep = pos((fr + tr) / 2, fc);
  if (t === "P" && (tr === 0 || tr === 7)) { const pp = promo || "Q"; nb[tr][tc] = st.turn === "w" ? pp : pp.toLowerCase(); }
  if (t === "K") {
    if (tc - fc === 2) { nb[fr][5] = nb[fr][7]; nb[fr][7] = null; }
    if (fc - tc === 2) { nb[fr][3] = nb[fr][0]; nb[fr][0] = null; }
    cast = cast.replace(st.turn === "w" ? /[KQ]/g : /[kq]/g, "");
  }
  if (t === "R") { if (fr === 7 && fc === 0) cast = cast.replace("Q", ""); if (fr === 7 && fc === 7) cast = cast.replace("K", ""); if (fr === 0 && fc === 0) cast = cast.replace("q", ""); if (fr === 0 && fc === 7) cast = cast.replace("k", ""); }
  if (!cast) cast = "-";
  if (t === "P" || cap) half = 0;
  return { board: nb, turn: st.turn === "w" ? "b" : "w", castling: cast, ep: nep, half, full: st.full + (st.turn === "b" ? 1 : 0) };
}

export function chessLegal(st, r, c) { return chessPseudo(st, r, c).filter(([tr, tc]) => !inChk(chessDoMove(st, r, c, tr, tc).board, st.turn)); }
export function chessHasMoves(st) { for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (st.board[r][c] && isOwn(st.board[r][c], st.turn) && chessLegal(st, r, c).length) return true; return false; }
export function chessStatus(st) { const ic = inChk(st.board, st.turn), hm = chessHasMoves(st); if (!hm && ic) return st.turn === "w" ? "checkmate_black" : "checkmate_white"; if (!hm) return "stalemate"; if (st.half >= 100) return "draw_50"; if (ic) return "check"; return "playing"; }
export function chessEval(st) { let s = 0; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const p = st.board[r][c]; if (!p) continue; const v = PV[p.toUpperCase()] || 0; const cb = (3.5 - Math.abs(c - 3.5)) * 3 + (3.5 - Math.abs(r - 3.5)) * 3; s += isW(p) ? v + cb : -(v + cb); } return s; }
export function chessMM(st, d, a, b, mx) { const s = chessStatus(st); if (s === "checkmate_white") return 1e5; if (s === "checkmate_black") return -1e5; if (s === "stalemate" || s === "draw_50") return 0; if (d === 0) return chessEval(st); if (mx) { let best = -Infinity; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { if (!st.board[r][c] || !isOwn(st.board[r][c], "w")) continue; for (const [tr, tc] of chessLegal(st, r, c)) { best = Math.max(best, chessMM(chessDoMove(st, r, c, tr, tc), d - 1, a, b, false)); a = Math.max(a, best); if (b <= a) return best; } } return best === -Infinity ? chessEval(st) : best; } else { let best = Infinity; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { if (!st.board[r][c] || !isOwn(st.board[r][c], "b")) continue; for (const [tr, tc] of chessLegal(st, r, c)) { best = Math.min(best, chessMM(chessDoMove(st, r, c, tr, tc), d - 1, a, b, true)); b = Math.min(b, best); if (b <= a) return best; } } return best === Infinity ? chessEval(st) : best; } }
export function chessAI(st) { let bs = Infinity, bm = null; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { if (!st.board[r][c] || !isOwn(st.board[r][c], "b")) continue; for (const [tr, tc] of chessLegal(st, r, c)) { const sc = chessMM(chessDoMove(st, r, c, tr, tc), 2, -Infinity, Infinity, true); if (sc < bs) { bs = sc; bm = { fr: r, fc: c, tr, tc }; } } } return bm; }

// ══════════════════════════════════════════════════════════
//  ШАШКИ (русские)
// ══════════════════════════════════════════════════════════
export const CU = { w: "⛀", W: "⛁", b: "⛂", B: "⛃" };
export function initCk() { const b = Array.from({ length: 8 }, () => Array(8).fill(null)); for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2 === 1) b[r][c] = "b"; for (let r = 5; r < 8; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2 === 1) b[r][c] = "w"; return { board: b, turn: "w" }; }
export function ckOwn(p, t) { return t === "w" ? (p === "w" || p === "W") : (p === "b" || p === "B"); }
export function ckKing(p) { return p === "W" || p === "B"; }

export function ckCaptures(board, r, c, turn) {
  const p = board[r][c]; if (!p || !ckOwn(p, turn)) return [];
  const king = ckKing(p), chains = [];
  function dfs(bd, cr, cc, chain) {
    let found = false;
    for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
      if (king) {
        for (let dist = 1; dist < 8; dist++) {
          const mr = cr + dr * dist, mc = cc + dc * dist;
          if (!inB(mr, mc)) break;
          if (bd[mr][mc] && ckOwn(bd[mr][mc], turn)) break;
          if (bd[mr][mc] && !ckOwn(bd[mr][mc], turn)) {
            for (let ld = 1; ld < 8; ld++) {
              const lr = mr + dr * ld, lc = mc + dc * ld;
              if (!inB(lr, lc) || bd[lr][lc]) break;
              const nb = bd.map((x) => [...x]); nb[cr][cc] = null; nb[mr][mc] = null; nb[lr][lc] = p;
              found = true; dfs(nb, lr, lc, [...chain, [lr, lc, mr, mc]]);
            }
            break;
          }
        }
      } else {
        const mr = cr + dr, mc = cc + dc, lr = cr + dr * 2, lc = cc + dc * 2;
        if (!inB(lr, lc)) continue;
        if (bd[mr][mc] && !ckOwn(bd[mr][mc], turn) && !bd[lr][lc]) {
          const nb = bd.map((x) => [...x]); nb[cr][cc] = null; nb[mr][mc] = null;
          let np = p; if ((turn === "w" && lr === 0) || (turn === "b" && lr === 7)) np = p.toUpperCase();
          nb[lr][lc] = np; found = true; dfs(nb, lr, lc, [...chain, [lr, lc, mr, mc]]);
        }
      }
    }
    if (!found && chain.length > 0) chains.push(chain);
  }
  dfs(board, r, c, []); return chains;
}

export function ckSimple(board, r, c, turn) {
  const p = board[r][c]; if (!p || !ckOwn(p, turn)) return [];
  const king = ckKing(p), mv = [];
  const dirs = king ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : (turn === "w" ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]]);
  for (const [dr, dc] of dirs) {
    if (king) { for (let i = 1; i < 8; i++) { const nr = r + dr * i, nc = c + dc * i; if (!inB(nr, nc) || board[nr][nc]) break; mv.push([nr, nc]); } }
    else { const nr = r + dr, nc = c + dc; if (inB(nr, nc) && !board[nr][nc]) mv.push([nr, nc]); }
  }
  return mv;
}

export function ckAllMoves(st) {
  const { board, turn } = st; let allCaps = [];
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (board[r][c] && ckOwn(board[r][c], turn)) for (const chain of ckCaptures(board, r, c, turn)) allCaps.push({ fr: r, fc: c, chain });
  if (allCaps.length > 0) { const mx = Math.max(...allCaps.map((x) => x.chain.length)); return { type: "capture", moves: allCaps.filter((x) => x.chain.length === mx) }; }
  let simple = [];
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (board[r][c] && ckOwn(board[r][c], turn)) for (const [nr, nc] of ckSimple(board, r, c, turn)) simple.push({ fr: r, fc: c, tr: nr, tc: nc });
  return { type: "simple", moves: simple };
}

export function ckApply(st, fr, fc, tr, tc, caps) {
  const nb = st.board.map((x) => [...x]), p = nb[fr][fc]; nb[fr][fc] = null;
  if (caps) for (const [, , cr, cc] of caps) nb[cr][cc] = null;
  let np = p; if (st.turn === "w" && tr === 0 && p === "w") np = "W"; if (st.turn === "b" && tr === 7 && p === "b") np = "B";
  nb[tr][tc] = np; return { board: nb, turn: st.turn === "w" ? "b" : "w" };
}

export function ckStatus(st) { return ckAllMoves(st).moves.length === 0 ? (st.turn === "w" ? "win_black" : "win_white") : "playing"; }
export function ckTargets(st, r, c) { const all = ckAllMoves(st); if (all.type === "capture") return all.moves.filter((m) => m.fr === r && m.fc === c).map((m) => { const l = m.chain[m.chain.length - 1]; return { tr: l[0], tc: l[1], chain: m.chain }; }); return all.moves.filter((m) => m.fr === r && m.fc === c).map((m) => ({ tr: m.tr, tc: m.tc, chain: null })); }
export function ckEval(board) { let s = 0; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const p = board[r][c]; if (!p) continue; if (p === "w") s += 10 + (7 - r); if (p === "W") s += 30; if (p === "b") s -= (10 - r); if (p === "B") s -= 30; } return s; }
export function ckAI(st) { const all = ckAllMoves(st); if (!all.moves.length) return null; let best = null, bs = Infinity; if (all.type === "capture") { for (const m of all.moves) { const l = m.chain[m.chain.length - 1], ns = ckApply(st, m.fr, m.fc, l[0], l[1], m.chain), sc = ckEval(ns.board); if (sc < bs) { bs = sc; best = { fr: m.fr, fc: m.fc, tr: l[0], tc: l[1], chain: m.chain }; } } } else { for (const m of all.moves) { const ns = ckApply(st, m.fr, m.fc, m.tr, m.tc, null), sc = ckEval(ns.board); if (sc < bs) { bs = sc; best = { fr: m.fr, fc: m.fc, tr: m.tr, tc: m.tc, chain: null }; } } } return best; }

// ══════════════════════════════════════════════════════════
//  УГОЛКИ
// ══════════════════════════════════════════════════════════
export const CHW = [], CHB = [];
for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { CHW.push([r, c]); CHB.push([7 - r, 7 - c]); }
export function initCo() { const b = Array.from({ length: 8 }, () => Array(8).fill(null)); for (const [r, c] of CHW) b[r][c] = "w"; for (const [r, c] of CHB) b[r][c] = "b"; return { board: b, turn: "w" }; }
export function coMoves(board, r, c) {
  const mv = [];
  for (const [dr, dc] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) { const nr = r + dr, nc = c + dc; if (inB(nr, nc) && !board[nr][nc]) mv.push([nr, nc]); }
  const vis = new Set([`${r},${c}`]), q = [[r, c]];
  while (q.length) { const [cr, cc] = q.shift(); for (const [dr, dc] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) { const mr = cr + dr, mc = cc + dc, lr = cr + dr * 2, lc = cc + dc * 2; if (inB(lr, lc) && board[mr][mc] && !board[lr][lc] && !vis.has(`${lr},${lc}`)) { vis.add(`${lr},${lc}`); mv.push([lr, lc]); q.push([lr, lc]); } } }
  return mv;
}
export function coStatus(st) { let wW = true, bW = true; for (const [r, c] of CHB) if (st.board[r][c] !== "w") { wW = false; break; } for (const [r, c] of CHW) if (st.board[r][c] !== "b") { bW = false; break; } if (wW) return "win_white"; if (bW) return "win_black"; return "playing"; }
export function coApply(st, fr, fc, tr, tc) { const nb = st.board.map((x) => [...x]); nb[tr][tc] = nb[fr][fc]; nb[fr][fc] = null; return { board: nb, turn: st.turn === "w" ? "b" : "w" }; }
export function coAI(st) { let best = null, bs = Infinity; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { if (st.board[r][c] !== "b") continue; for (const [tr, tc] of coMoves(st.board, r, c)) { const nb = st.board.map((x) => [...x]); nb[tr][tc] = nb[r][c]; nb[r][c] = null; let td = 0; const bks = []; for (let rr = 0; rr < 8; rr++) for (let cc = 0; cc < 8; cc++) if (nb[rr][cc] === "b") bks.push([rr, cc]); const used = new Set(); for (const [br, bc] of bks) { let minD = Infinity, minI = 0; for (let i = 0; i < CHW.length; i++) { if (used.has(i)) continue; const d = Math.abs(br - CHW[i][0]) + Math.abs(bc - CHW[i][1]); if (d < minD) { minD = d; minI = i; } } used.add(minI); td += minD; } if (td < bs) { bs = td; best = { fr: r, fc: c, tr, tc }; } } } return best; }

// ══════════════════════════════════════════════════════════
//  САПЁР
// ══════════════════════════════════════════════════════════
export const MS = { easy: { rows: 9, cols: 9, mines: 10 }, medium: { rows: 12, cols: 12, mines: 30 }, hard: { rows: 16, cols: 16, mines: 50 } };
export function initMs(diff = "easy") { const { rows, cols, mines } = MS[diff]; return { rows, cols, mines, diff, grid: Array.from({ length: rows }, () => Array(cols).fill(0)), revealed: Array.from({ length: rows }, () => Array(cols).fill(false)), flagged: Array.from({ length: rows }, () => Array(cols).fill(false)), started: false, gameOver: false, won: false, minesLeft: mines }; }

export function placeMines(st, safeR, safeC) {
  const { rows, cols, mines } = st;
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  let placed = 0;
  while (placed < mines) { const r = Math.floor(Math.random() * rows), c = Math.floor(Math.random() * cols); if (grid[r][c] === -1 || (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1)) continue; grid[r][c] = -1; placed++; }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { if (grid[r][c] === -1) continue; let cnt = 0; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const nr = r + dr, nc = c + dc; if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === -1) cnt++; } grid[r][c] = cnt; }
  return grid;
}

export function msReveal(st, r, c) {
  if (st.revealed[r][c] || st.flagged[r][c] || st.gameOver) return st;
  const revealed = st.revealed.map((x) => [...x]);
  const grid = st.started ? st.grid : placeMines(st, r, c);
  revealed[r][c] = true;
  if (grid[r][c] === -1) { for (let rr = 0; rr < st.rows; rr++) for (let cc = 0; cc < st.cols; cc++) if (grid[rr][cc] === -1) revealed[rr][cc] = true; return { ...st, grid, revealed, gameOver: true, won: false, started: true }; }
  if (grid[r][c] === 0) { const q = [[r, c]]; while (q.length) { const [cr, cc] = q.shift(); for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const nr = cr + dr, nc = cc + dc; if (nr >= 0 && nr < st.rows && nc >= 0 && nc < st.cols && !revealed[nr][nc] && !st.flagged[nr][nc]) { revealed[nr][nc] = true; if (grid[nr][nc] === 0) q.push([nr, nc]); } } } }
  let tot = 0; for (let rr = 0; rr < st.rows; rr++) for (let cc = 0; cc < st.cols; cc++) if (revealed[rr][cc]) tot++;
  const won = tot === st.rows * st.cols - st.mines;
  return { ...st, grid, revealed, started: true, won, gameOver: won };
}

export function msFlag(st, r, c) { if (st.revealed[r][c] || st.gameOver) return st; const f = st.flagged.map((x) => [...x]); f[r][c] = !f[r][c]; return { ...st, flagged: f, minesLeft: st.minesLeft + (f[r][c] ? -1 : 1) }; }

// ══════════════════════════════════════════════════════════
//  МОРСКОЙ БОЙ
// ══════════════════════════════════════════════════════════
export const BSZ = 10, BSH = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
export function bsEmpty() { return Array.from({ length: BSZ }, () => Array(BSZ).fill(0)); }

export function bsCanPlace(grid, r, c, len, h) {
  for (let i = 0; i < len; i++) { const cr = h ? r : r + i, cc = h ? c + i : c; if (cr < 0 || cr >= BSZ || cc < 0 || cc >= BSZ) return false; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const nr = cr + dr, nc = cc + dc; if (nr >= 0 && nr < BSZ && nc >= 0 && nc < BSZ && grid[nr][nc] === 1) return false; } } return true;
}

export function bsPlaceAll() {
  const grid = bsEmpty(), ships = [];
  for (const len of BSH) { let placed = false, att = 0; while (!placed && att < 1000) { att++; const h = Math.random() < 0.5, r = Math.floor(Math.random() * BSZ), c = Math.floor(Math.random() * BSZ); if (bsCanPlace(grid, r, c, len, h)) { const cells = []; for (let i = 0; i < len; i++) { const cr = h ? r : r + i, cc = h ? c + i : c; grid[cr][cc] = 1; cells.push([cr, cc]); } ships.push({ cells, sunk: false }); placed = true; } } }
  return { grid, ships };
}

export function bsShoot(grid, ships, r, c) {
  if (grid[r][c] >= 2) return { grid, ships, result: "already" };
  const ng = grid.map((x) => [...x]), ns = ships.map((s) => ({ ...s, cells: [...s.cells] }));
  if (ng[r][c] === 1) {
    ng[r][c] = 3;
    for (const ship of ns) { if (ship.sunk) continue; if (ship.cells.some(([sr, sc]) => sr === r && sc === c)) { if (ship.cells.every(([sr, sc]) => ng[sr][sc] === 3)) { ship.sunk = true; for (const [sr, sc] of ship.cells) { ng[sr][sc] = 4; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const nr = sr + dr, nc = sc + dc; if (nr >= 0 && nr < BSZ && nc >= 0 && nc < BSZ && ng[nr][nc] === 0) ng[nr][nc] = 2; } } return { grid: ng, ships: ns, result: "sunk" }; } return { grid: ng, ships: ns, result: "hit" }; } }
    return { grid: ng, ships: ns, result: "hit" };
  }
  ng[r][c] = 2; return { grid: ng, ships: ns, result: "miss" };
}

export function bsAllSunk(ships) { return ships.every((s) => s.sunk); }

export function bsAIShot(grid, hits) {
  if (hits.length > 0) {
    const cands = [];
    for (const [hr, hc] of hits) for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { const nr = hr + dr, nc = hc + dc; if (nr >= 0 && nr < BSZ && nc >= 0 && nc < BSZ && grid[nr][nc] === 0) cands.push([nr, nc]); }
    if (hits.length >= 2) {
      const [r1, c1] = hits[0], [r2, c2] = hits[1];
      if (r1 === r2) { const sorted = hits.map(([, cc]) => cc).sort((a, b) => a - b); const lc = []; if (sorted[0] - 1 >= 0 && grid[r1][sorted[0] - 1] === 0) lc.push([r1, sorted[0] - 1]); if (sorted[sorted.length - 1] + 1 < BSZ && grid[r1][sorted[sorted.length - 1] + 1] === 0) lc.push([r1, sorted[sorted.length - 1] + 1]); if (lc.length) return lc[Math.floor(Math.random() * lc.length)]; }
      else if (c1 === c2) { const sorted = hits.map(([rr]) => rr).sort((a, b) => a - b); const lc = []; if (sorted[0] - 1 >= 0 && grid[sorted[0] - 1][c1] === 0) lc.push([sorted[0] - 1, c1]); if (sorted[sorted.length - 1] + 1 < BSZ && grid[sorted[sorted.length - 1] + 1][c1] === 0) lc.push([sorted[sorted.length - 1] + 1, c1]); if (lc.length) return lc[Math.floor(Math.random() * lc.length)]; }
    }
    if (cands.length) return cands[Math.floor(Math.random() * cands.length)];
  }
  const opts = []; for (let r = 0; r < BSZ; r++) for (let c = 0; c < BSZ; c++) if (grid[r][c] === 0 && (r + c) % 2 === 0) opts.push([r, c]);
  if (!opts.length) for (let r = 0; r < BSZ; r++) for (let c = 0; c < BSZ; c++) if (grid[r][c] === 0) opts.push([r, c]);
  return opts.length ? opts[Math.floor(Math.random() * opts.length)] : null;
}

export function initBs() { const p = bsPlaceAll(), e = bsPlaceAll(); return { pGrid: p.grid, pShips: p.ships, eGrid: e.grid, eShips: e.ships, eView: bsEmpty(), turn: "player", gameOver: false, winner: null, aiHits: [], msg: "Ваш ход — стреляйте" }; }

// ══════════════════════════════════════════════════════════
//  6. ПЯТНАШКИ
// ══════════════════════════════════════════════════════════
export function initP15(size = 4) {
  // Create solved state then shuffle with valid moves
  const tiles = [];
  for (let i = 1; i < size * size; i++) tiles.push(i);
  tiles.push(0); // 0 = empty

  // Shuffle by making random valid moves (guarantees solvability)
  let empty = size * size - 1; // index of empty tile
  const total = size * size;
  for (let i = 0; i < 500; i++) {
    const eR = Math.floor(empty / size), eC = empty % size;
    const dirs = [];
    if (eR > 0) dirs.push(-size);
    if (eR < size - 1) dirs.push(size);
    if (eC > 0) dirs.push(-1);
    if (eC < size - 1) dirs.push(1);
    const d = dirs[Math.floor(Math.random() * dirs.length)];
    const swapIdx = empty + d;
    tiles[empty] = tiles[swapIdx];
    tiles[swapIdx] = 0;
    empty = swapIdx;
  }

  return { tiles: [...tiles], size, moves: 0, won: false };
}

export function p15Click(st, idx) {
  if (st.won) return st;
  const { tiles, size } = st;
  const emptyIdx = tiles.indexOf(0);
  const eR = Math.floor(emptyIdx / size), eC = emptyIdx % size;
  const tR = Math.floor(idx / size), tC = idx % size;
  // Must be adjacent (not diagonal)
  if (Math.abs(eR - tR) + Math.abs(eC - tC) !== 1) return st;

  const newTiles = [...tiles];
  newTiles[emptyIdx] = newTiles[idx];
  newTiles[idx] = 0;

  // Check win: 1,2,3,...,15,0
  let won = true;
  for (let i = 0; i < newTiles.length - 1; i++) {
    if (newTiles[i] !== i + 1) { won = false; break; }
  }

  return { ...st, tiles: newTiles, moves: st.moves + 1, won };
}

// ══════════════════════════════════════════════════════════
//  7. ЗМЕЙКА
// ══════════════════════════════════════════════════════════
export const SNK_SIZE = 20; // grid cells
export const SNK_SPEEDS = { easy: 150, medium: 100, hard: 60 };

export function initSnake(speed = "medium") {
  const mid = Math.floor(SNK_SIZE / 2);
  return {
    snake: [[mid, mid], [mid, mid - 1], [mid, mid - 2]],
    dir: [0, 1], // [dr, dc]
    nextDir: [0, 1],
    food: placeFood([[mid, mid], [mid, mid - 1], [mid, mid - 2]]),
    score: 0,
    gameOver: false,
    running: false,
    speed,
    best: 0,
  };
}

export function placeFood(snake) {
  let r, c;
  do {
    r = Math.floor(Math.random() * SNK_SIZE);
    c = Math.floor(Math.random() * SNK_SIZE);
  } while (snake.some(([sr, sc]) => sr === r && sc === c));
  return [r, c];
}

export function snakeTick(st) {
  if (st.gameOver || !st.running) return st;
  const dir = st.nextDir;
  const [hr, hc] = st.snake[0];
  const nr = hr + dir[0], nc = hc + dir[1];

  // Wall collision
  if (nr < 0 || nr >= SNK_SIZE || nc < 0 || nc >= SNK_SIZE)
    return { ...st, gameOver: true, running: false, best: Math.max(st.best, st.score) };

  // Self collision
  if (st.snake.some(([sr, sc]) => sr === nr && sc === nc))
    return { ...st, gameOver: true, running: false, best: Math.max(st.best, st.score) };

  const newSnake = [[nr, nc], ...st.snake];
  let food = st.food, score = st.score;

  if (nr === st.food[0] && nc === st.food[1]) {
    score++;
    food = placeFood(newSnake);
  } else {
    newSnake.pop();
  }

  return { ...st, snake: newSnake, dir, nextDir: dir, food, score };
}

// ══════════════════════════════════════════════════════════
//  8. ТЕТРИС
// ══════════════════════════════════════════════════════════
export const TET_W = 10, TET_H = 20;
export const TET_SHAPES = {
  I: { cells: [[0,0],[0,1],[0,2],[0,3]], color: "#00bcd4" },
  O: { cells: [[0,0],[0,1],[1,0],[1,1]], color: "#ffc107" },
  T: { cells: [[0,0],[0,1],[0,2],[1,1]], color: "#9c27b0" },
  S: { cells: [[0,1],[0,2],[1,0],[1,1]], color: "#4caf50" },
  Z: { cells: [[0,0],[0,1],[1,1],[1,2]], color: "#f44336" },
  L: { cells: [[0,0],[0,1],[0,2],[1,0]], color: "#ff9800" },
  J: { cells: [[0,0],[0,1],[0,2],[1,2]], color: "#2196f3" },
};
export const TET_KEYS = Object.keys(TET_SHAPES);

export function tetRandPiece() {
  const key = TET_KEYS[Math.floor(Math.random() * TET_KEYS.length)];
  const shape = TET_SHAPES[key];
  const col = Math.floor((TET_W - 3) / 2);
  return { cells: shape.cells.map(([r, c]) => [r, c + col]), color: shape.color, key };
}

export function initTetris() {
  return {
    board: Array.from({ length: TET_H }, () => Array(TET_W).fill(null)),
    piece: tetRandPiece(),
    next: tetRandPiece(),
    score: 0,
    lines: 0,
    level: 1,
    gameOver: false,
    running: false,
  };
}

export function tetRotate(cells) {
  // Rotate 90° CW around bounding box center
  const minR = Math.min(...cells.map(([r]) => r));
  const maxR = Math.max(...cells.map(([r]) => r));
  const minC = Math.min(...cells.map(([, c]) => c));
  const maxC = Math.max(...cells.map(([, c]) => c));
  const cr = (minR + maxR) / 2, cc = (minC + maxC) / 2;
  return cells.map(([r, c]) => {
    const nr = Math.round(cr + (c - cc));
    const nc = Math.round(cc - (r - cr));
    return [nr, nc];
  });
}

export function tetValid(board, cells) {
  return cells.every(([r, c]) => r >= 0 && r < TET_H && c >= 0 && c < TET_W && (!board[r] || !board[r][c]));
}

export function tetPlace(board, cells, color) {
  const nb = board.map((r) => [...r]);
  for (const [r, c] of cells) if (r >= 0 && r < TET_H) nb[r][c] = color;
  return nb;
}

export function tetClearLines(board) {
  const kept = board.filter((row) => row.some((c) => !c));
  const cleared = TET_H - kept.length;
  while (kept.length < TET_H) kept.unshift(Array(TET_W).fill(null));
  return { board: kept, cleared };
}

export function tetDrop(st) {
  if (st.gameOver || !st.running) return st;
  const moved = st.piece.cells.map(([r, c]) => [r + 1, c]);
  if (tetValid(st.board, moved)) return { ...st, piece: { ...st.piece, cells: moved } };

  // Lock piece
  let nb = tetPlace(st.board, st.piece.cells, st.piece.color);
  const { board: cleared, cleared: lc } = tetClearLines(nb);
  const pts = [0, 100, 300, 500, 800][lc] || 0;
  const newLines = st.lines + lc;
  const newLevel = Math.floor(newLines / 10) + 1;

  // Spawn next
  const next = tetRandPiece();
  if (!tetValid(cleared, st.next.cells)) {
    return { ...st, board: cleared, piece: st.next, next, score: st.score + pts, lines: newLines, level: newLevel, gameOver: true, running: false };
  }
  return { ...st, board: cleared, piece: st.next, next, score: st.score + pts, lines: newLines, level: newLevel };
}

export function tetMove(st, dc) {
  if (st.gameOver || !st.running) return st;
  const moved = st.piece.cells.map(([r, c]) => [r, c + dc]);
  if (tetValid(st.board, moved)) return { ...st, piece: { ...st.piece, cells: moved } };
  return st;
}

export function tetRotateAction(st) {
  if (st.gameOver || !st.running) return st;
  const rotated = tetRotate(st.piece.cells);
  if (tetValid(st.board, rotated)) return { ...st, piece: { ...st.piece, cells: rotated } };
  // Wall kick: try shifting left/right
  for (const dx of [-1, 1, -2, 2]) {
    const kicked = rotated.map(([r, c]) => [r, c + dx]);
    if (tetValid(st.board, kicked)) return { ...st, piece: { ...st.piece, cells: kicked } };
  }
  return st;
}

export function tetHardDrop(st) {
  if (st.gameOver || !st.running) return st;
  let cells = st.piece.cells;
  while (true) {
    const moved = cells.map(([r, c]) => [r + 1, c]);
    if (!tetValid(st.board, moved)) break;
    cells = moved;
  }
  return tetDrop({ ...st, piece: { ...st.piece, cells } });
}

// ══════════════════════════════════════════════════════════
//  9. РЕВЕРСИ (ОТЕЛЛО)
// ══════════════════════════════════════════════════════════
export const RV_SZ = 8;

export function initReversi() {
  const b = Array.from({ length: RV_SZ }, () => Array(RV_SZ).fill(null));
  b[3][3] = "w"; b[3][4] = "b"; b[4][3] = "b"; b[4][4] = "w";
  return { board: b, turn: "b", gameOver: false, passed: false };
}

export function rvFlips(board, r, c, color) {
  if (board[r][c]) return [];
  const opp = color === "b" ? "w" : "b";
  const allFlips = [];
  for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
    const line = [];
    let cr = r + dr, cc = c + dc;
    while (cr >= 0 && cr < RV_SZ && cc >= 0 && cc < RV_SZ && board[cr][cc] === opp) {
      line.push([cr, cc]); cr += dr; cc += dc;
    }
    if (line.length > 0 && cr >= 0 && cr < RV_SZ && cc >= 0 && cc < RV_SZ && board[cr][cc] === color) {
      allFlips.push(...line);
    }
  }
  return allFlips;
}

export function rvValidMoves(board, color) {
  const moves = [];
  for (let r = 0; r < RV_SZ; r++) for (let c = 0; c < RV_SZ; c++) {
    if (rvFlips(board, r, c, color).length > 0) moves.push([r, c]);
  }
  return moves;
}

export function rvApply(board, r, c, color) {
  const flips = rvFlips(board, r, c, color);
  if (flips.length === 0) return null;
  const nb = board.map((x) => [...x]);
  nb[r][c] = color;
  for (const [fr, fc] of flips) nb[fr][fc] = color;
  return nb;
}

export function rvCount(board) {
  let b = 0, w = 0;
  for (let r = 0; r < RV_SZ; r++) for (let c = 0; c < RV_SZ; c++) {
    if (board[r][c] === "b") b++; else if (board[r][c] === "w") w++;
  }
  return { b, w };
}

export function rvDoMove(st, r, c) {
  const nb = rvApply(st.board, r, c, st.turn);
  if (!nb) return st;
  const nextTurn = st.turn === "b" ? "w" : "b";
  const nextMoves = rvValidMoves(nb, nextTurn);
  if (nextMoves.length > 0) return { board: nb, turn: nextTurn, gameOver: false, passed: false };
  // Next player has no moves — check if current can play
  const curMoves = rvValidMoves(nb, st.turn);
  if (curMoves.length > 0) return { board: nb, turn: st.turn, gameOver: false, passed: true };
  // Neither can play — game over
  return { board: nb, turn: nextTurn, gameOver: true, passed: false };
}

// Reversi AI — positional weights + mobility
export const RV_WEIGHTS = [
  [120,-20,20, 5, 5,20,-20,120],
  [-20,-40,-5,-5,-5,-5,-40,-20],
  [ 20, -5,15, 3, 3,15, -5, 20],
  [  5, -5, 3, 3, 3, 3, -5,  5],
  [  5, -5, 3, 3, 3, 3, -5,  5],
  [ 20, -5,15, 3, 3,15, -5, 20],
  [-20,-40,-5,-5,-5,-5,-40,-20],
  [120,-20,20, 5, 5,20,-20,120],
];

export function rvEval(board, aiColor) {
  const opp = aiColor === "b" ? "w" : "b";
  let score = 0;
  for (let r = 0; r < RV_SZ; r++) for (let c = 0; c < RV_SZ; c++) {
    if (board[r][c] === aiColor) score += RV_WEIGHTS[r][c];
    else if (board[r][c] === opp) score -= RV_WEIGHTS[r][c];
  }
  // Mobility bonus
  score += rvValidMoves(board, aiColor).length * 5;
  score -= rvValidMoves(board, opp).length * 5;
  return score;
}

export function rvAI(st) {
  const moves = rvValidMoves(st.board, st.turn);
  if (moves.length === 0) return null;
  let best = null, bestScore = -Infinity;
  for (const [r, c] of moves) {
    const nb = rvApply(st.board, r, c, st.turn);
    // 2-ply: evaluate opponent's best response
    const oppMoves = rvValidMoves(nb, st.turn === "b" ? "w" : "b");
    let worstReply = Infinity;
    if (oppMoves.length === 0) {
      worstReply = rvEval(nb, st.turn);
    } else {
      for (const [or, oc] of oppMoves) {
        const nb2 = rvApply(nb, or, oc, st.turn === "b" ? "w" : "b");
        const ev = rvEval(nb2, st.turn);
        if (ev < worstReply) worstReply = ev;
      }
    }
    if (worstReply > bestScore) { bestScore = worstReply; best = [r, c]; }
  }
  return best;
}

// ══════════════════════════════════════════════════════════
//  10. ПУЛЬСИК В ОФИСЕ (stealth)
// ══════════════════════════════════════════════════════════
export const PK_W = 16, PK_H = 14;
// 0=floor, 1=wall, 2=desk, 3=plant
export const PK_LEVELS = [
  { // Level 1 — simple
    map: [
      "1111111111111111",
      "1000000000000001",
      "1000220000220001",
      "1000220000220001",
      "1000000000000001",
      "1000001111000001",
      "1000001001000001",
      "1000001001000001",
      "1000001111000001",
      "1000000000000001",
      "1000330000330001",
      "1000330000330001",
      "1000000000000001",
      "1111111111111111",
    ],
    player: [1, 1],
    stars: [[1, 14], [6, 4], [7, 11], [12, 7], [12, 14]],
    guards: [
      { path: [[3, 7], [3, 8], [3, 9], [3, 10], [3, 9], [3, 8]], dir: 0, viewDist: 3 },
      { path: [[10, 5], [10, 6], [10, 7], [10, 8], [10, 9], [10, 10], [10, 9], [10, 8], [10, 7], [10, 6]], dir: 0, viewDist: 3 },
    ],
  },
  { // Level 2 — harder
    map: [
      "1111111111111111",
      "1000000100000001",
      "1022000100002201",
      "1022000000002201",
      "1000000100000001",
      "1111000100011111",
      "1000000000000001",
      "1000011111100001",
      "1000000000000001",
      "1111100001111001",
      "1000000000000001",
      "1022000000002201",
      "1000000000000001",
      "1111111111111111",
    ],
    player: [1, 1],
    stars: [[1, 14], [4, 8], [6, 2], [6, 13], [10, 7], [12, 14]],
    guards: [
      { path: [[2, 5], [3, 5], [4, 5], [3, 5]], dir: 0, viewDist: 3 },
      { path: [[8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8], [8, 9], [8, 10], [8, 11], [8, 12], [8, 11], [8, 10], [8, 9], [8, 8], [8, 7], [8, 6], [8, 5], [8, 4]], dir: 0, viewDist: 4 },
      { path: [[11, 6], [11, 7], [11, 8], [11, 9], [11, 8], [11, 7]], dir: 0, viewDist: 3 },
    ],
  },
  { // Level 3 — expert
    map: [
      "1111111111111111",
      "1000001000100001",
      "1022001000100001",
      "1000001000000001",
      "1000000000011111",
      "1111100000000001",
      "1000000011000001",
      "1000000011000001",
      "1000000000001111",
      "1111000000000001",
      "1000001100000001",
      "1000001100022001",
      "1000000000000001",
      "1111111111111111",
    ],
    player: [12, 1],
    stars: [[1, 14], [1, 8], [5, 14], [8, 2], [12, 14], [6, 6], [10, 10]],
    guards: [
      { path: [[2, 4], [3, 4], [4, 4], [3, 4]], dir: 0, viewDist: 3 },
      { path: [[6, 3], [6, 4], [6, 5], [7, 5], [7, 4], [7, 3]], dir: 0, viewDist: 4 },
      { path: [[5, 9], [5, 10], [5, 11], [5, 12], [5, 13], [5, 12], [5, 11], [5, 10]], dir: 0, viewDist: 3 },
      { path: [[10, 4], [10, 5], [11, 5], [12, 5], [12, 6], [12, 7], [11, 7], [10, 7], [10, 6], [10, 5]], dir: 0, viewDist: 4 },
    ],
  },
];

export function initPulsik(levelIdx = 0) {
  const lvl = PK_LEVELS[Math.min(levelIdx, PK_LEVELS.length - 1)];
  const map = lvl.map.map((row) => row.split("").map(Number));
  return {
    map,
    player: [...lvl.player],
    stars: lvl.stars.map((s) => [...s]),
    guards: lvl.guards.map((g) => ({ ...g, pathIdx: 0, pos: [...g.path[0]] })),
    collected: 0,
    total: lvl.stars.length,
    gameOver: false,
    won: false,
    running: false,
    level: levelIdx,
    tick: 0,
  };
}

export function pkIsBlocked(map, r, c) {
  return r < 0 || r >= PK_H || c < 0 || c >= PK_W || map[r][c] === 1 || map[r][c] === 2;
}

export function pkGuardVision(map, guard) {
  // Guard looks in direction of movement
  const { pos, path, pathIdx, viewDist } = guard;
  const [gr, gc] = pos;
  const nextIdx = (pathIdx + 1) % path.length;
  const [nr, nc] = path[nextIdx];
  const dr = Math.sign(nr - gr), dc = Math.sign(nc - gc);
  // If standing still, look in last direction
  const lookDr = dr || 0, lookDc = dc || (gr === nr ? 1 : 0);

  const visible = [];
  for (let i = 1; i <= viewDist; i++) {
    const vr = gr + lookDr * i, vc = gc + lookDc * i;
    if (vr < 0 || vr >= PK_H || vc < 0 || vc >= PK_W) break;
    if (map[vr][vc] === 1 || map[vr][vc] === 2) break;
    visible.push([vr, vc]);
  }
  // Also see 1 cell to sides of vision line (peripheral)
  if (visible.length > 0) {
    for (const [vr, vc] of [...visible]) {
      for (const [pr, pc] of [[vr + lookDc, vc + lookDr], [vr - lookDc, vc - lookDr]]) {
        if (pr >= 0 && pr < PK_H && pc >= 0 && pc < PK_W && map[pr][pc] !== 1 && map[pr][pc] !== 2) {
          if (!visible.some(([a, b]) => a === pr && b === pc)) visible.push([pr, pc]);
        }
      }
    }
  }
  return visible;
}

export function pkTick(st) {
  if (st.gameOver || !st.running) return st;
  // Move guards
  const guards = st.guards.map((g) => {
    let nextIdx = (g.pathIdx + 1) % g.path.length;
    const [nr, nc] = g.path[nextIdx];
    return { ...g, pos: [nr, nc], pathIdx: nextIdx };
  });

  // Check if player is seen
  for (const g of guards) {
    const vision = pkGuardVision(st.map, g);
    if (vision.some(([vr, vc]) => vr === st.player[0] && vc === st.player[1])) {
      return { ...st, guards, gameOver: true, won: false, tick: st.tick + 1 };
    }
    // Direct collision
    if (g.pos[0] === st.player[0] && g.pos[1] === st.player[1]) {
      return { ...st, guards, gameOver: true, won: false, tick: st.tick + 1 };
    }
  }

  return { ...st, guards, tick: st.tick + 1 };
}

export function pkMove(st, dr, dc) {
  if (st.gameOver || !st.running) return st;
  const nr = st.player[0] + dr, nc = st.player[1] + dc;
  if (pkIsBlocked(st.map, nr, nc)) return st;

  let stars = st.stars, collected = st.collected, won = false;
  const starIdx = stars.findIndex(([sr, sc]) => sr === nr && sc === nc);
  if (starIdx >= 0) {
    stars = stars.filter((_, i) => i !== starIdx);
    collected++;
    if (stars.length === 0) won = true;
  }

  // Check guard collision at new pos
  for (const g of st.guards) {
    if (g.pos[0] === nr && g.pos[1] === nc) return { ...st, gameOver: true, won: false };
    const vision = pkGuardVision(st.map, g);
    if (vision.some(([vr, vc]) => vr === nr && vc === nc)) return { ...st, player: [nr, nc], stars, collected, gameOver: true, won: false };
  }

  return { ...st, player: [nr, nc], stars, collected, won, gameOver: won };
}
