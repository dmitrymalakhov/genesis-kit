import { COLORS, OBSTACLES } from "./constants";
import type { SizeConfig, Particle } from "./types";

const CL = COLORS;

// ── Cat "Пульсик" ───────────────────────────────────────────

export const drawCat = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  isDucking: boolean,
  isJumping: boolean,
  sc: SizeConfig,
  catW: number,
  catH: number,
  catDuckW: number,
  catDuckH: number,
): void => {
  const s = sc.catScale;
  ctx.save();

  if (isDucking) {
    const w = catDuckW;
    const h = catDuckH;
    const dy = sc.groundY - h;

    ctx.fillStyle = CL.catBody;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, dy + h / 2 + 2 * s, w / 2 - 2 * s, h / 2 - 4 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = CL.catBelly;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, dy + h / 2 + 5 * s, w / 2 - 8 * s, h / 2 - 8 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = CL.catBody;
    ctx.beginPath();
    ctx.ellipse(x + w - 12 * s, dy + 6 * s, 14 * s, 11 * s, -0.15, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + w - 20 * s, dy - 2 * s);
    ctx.lineTo(x + w - 14 * s, dy - 10 * s);
    ctx.lineTo(x + w - 10 * s, dy);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + w - 8 * s, dy - 3 * s);
    ctx.lineTo(x + w - 3 * s, dy - 11 * s);
    ctx.lineTo(x + w, dy + 1 * s);
    ctx.fill();

    ctx.fillStyle = CL.catInnerEar;
    ctx.beginPath();
    ctx.moveTo(x + w - 18 * s, dy);
    ctx.lineTo(x + w - 14 * s, dy - 7 * s);
    ctx.lineTo(x + w - 11 * s, dy + 1 * s);
    ctx.fill();

    ctx.fillStyle = CL.catPupil;
    ctx.fillRect(x + w - 14 * s, dy + 4 * s, 6 * s, 2 * s);
    ctx.fillRect(x + w - 5 * s, dy + 3 * s, 5 * s, 2 * s);

    ctx.fillStyle = CL.catNose;
    ctx.beginPath();
    ctx.ellipse(x + w - 2 * s, dy + 8 * s, 2 * s, 1.5 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = CL.catBody;
    ctx.lineWidth = 4 * s;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x + 4 * s, dy + h / 2);
    ctx.quadraticCurveTo(x - 10 * s, dy - 6 * s, x + 2 * s, dy - 4 * s);
    ctx.stroke();

    ctx.fillStyle = CL.catDark;
    if (frame % 2 === 0) {
      ctx.fillRect(x + 14 * s, dy + h - 6 * s, 5 * s, 6 * s);
      ctx.fillRect(x + 32 * s, dy + h - 3 * s, 5 * s, 3 * s);
    } else {
      ctx.fillRect(x + 14 * s, dy + h - 3 * s, 5 * s, 3 * s);
      ctx.fillRect(x + 32 * s, dy + h - 6 * s, 5 * s, 6 * s);
    }
  } else {
    const w = catW;
    const h = catH;
    const dy = y;

    if (isJumping) {
      ctx.translate(x + w / 2, dy + h / 2);
      ctx.rotate(-0.12);
      ctx.translate(-(x + w / 2), -(dy + h / 2));
    }

    ctx.strokeStyle = CL.catBody;
    ctx.lineWidth = 4 * s;
    ctx.lineCap = "round";
    const tailWave = Math.sin(frame * 0.4) * 6 * s;
    ctx.beginPath();
    ctx.moveTo(x - 2 * s, dy + 18 * s);
    ctx.quadraticCurveTo(x - 14 * s, dy + 6 * s + tailWave, x - 10 * s, dy - 2 * s + tailWave);
    ctx.stroke();

    ctx.fillStyle = CL.catBody;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, dy + h / 2 + 4 * s, w / 2 - 2 * s, h / 2 - 6 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = CL.catBelly;
    ctx.beginPath();
    ctx.ellipse(x + w / 2 + 2 * s, dy + h / 2 + 6 * s, 10 * s, 8 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = CL.catBody;
    ctx.beginPath();
    ctx.arc(x + w / 2 + 6 * s, dy + 6 * s, 16 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 12 * s, dy - 4 * s);
    ctx.lineTo(x + 18 * s, dy - 16 * s);
    ctx.lineTo(x + 24 * s, dy - 2 * s);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 26 * s, dy - 6 * s);
    ctx.lineTo(x + 34 * s, dy - 17 * s);
    ctx.lineTo(x + 38 * s, dy - 2 * s);
    ctx.fill();

    ctx.fillStyle = CL.catInnerEar;
    ctx.beginPath();
    ctx.moveTo(x + 15 * s, dy - 2 * s);
    ctx.lineTo(x + 18 * s, dy - 12 * s);
    ctx.lineTo(x + 22 * s, dy - 1 * s);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 28 * s, dy - 4 * s);
    ctx.lineTo(x + 34 * s, dy - 13 * s);
    ctx.lineTo(x + 36 * s, dy - 2 * s);
    ctx.fill();

    ctx.fillStyle = CL.catEye;
    ctx.beginPath();
    ctx.ellipse(x + 22 * s, dy + 4 * s, 5 * s, 5.5 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 34 * s, dy + 3 * s, 4.5 * s, 5 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = CL.catPupil;
    ctx.beginPath();
    ctx.ellipse(x + 23 * s, dy + 4 * s, 2.5 * s, 3.5 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 35 * s, dy + 3 * s, 2.2 * s, 3.2 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x + 21 * s, dy + 2 * s, 1.2 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 33 * s, dy + 1 * s, 1.1 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = CL.catNose;
    ctx.beginPath();
    ctx.moveTo(x + 28 * s, dy + 10 * s);
    ctx.lineTo(x + 26 * s, dy + 13 * s);
    ctx.lineTo(x + 30 * s, dy + 13 * s);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = CL.catDark;
    ctx.lineWidth = 1.2 * s;
    ctx.beginPath();
    ctx.moveTo(x + 28 * s, dy + 13 * s);
    ctx.lineTo(x + 25 * s, dy + 16 * s);
    ctx.moveTo(x + 28 * s, dy + 13 * s);
    ctx.lineTo(x + 31 * s, dy + 16 * s);
    ctx.stroke();

    ctx.strokeStyle = CL.catDark;
    ctx.lineWidth = 0.8 * s;
    ctx.beginPath();
    ctx.moveTo(x + 14 * s, dy + 10 * s);
    ctx.lineTo(x + 6 * s, dy + 8 * s);
    ctx.moveTo(x + 14 * s, dy + 13 * s);
    ctx.lineTo(x + 5 * s, dy + 14 * s);
    ctx.moveTo(x + 38 * s, dy + 9 * s);
    ctx.lineTo(x + 48 * s, dy + 7 * s);
    ctx.moveTo(x + 38 * s, dy + 12 * s);
    ctx.lineTo(x + 48 * s, dy + 13 * s);
    ctx.stroke();

    ctx.fillStyle = CL.catDark;
    const legY = dy + h - 8 * s;
    if (isJumping) {
      ctx.fillRect(x + 8 * s, legY + 2 * s, 5 * s, 6 * s);
      ctx.fillRect(x + 18 * s, legY + 2 * s, 5 * s, 6 * s);
      ctx.fillRect(x + 26 * s, legY + 3 * s, 5 * s, 5 * s);
      ctx.fillRect(x + 34 * s, legY + 3 * s, 5 * s, 5 * s);
    } else if (frame % 2 === 0) {
      ctx.fillRect(x + 26 * s, legY - 2 * s, 5 * s, 10 * s);
      ctx.fillRect(x + 34 * s, legY + 2 * s, 5 * s, 6 * s);
      ctx.fillRect(x + 8 * s, legY + 2 * s, 5 * s, 6 * s);
      ctx.fillRect(x + 16 * s, legY - 2 * s, 5 * s, 10 * s);
    } else {
      ctx.fillRect(x + 26 * s, legY + 2 * s, 5 * s, 6 * s);
      ctx.fillRect(x + 34 * s, legY - 2 * s, 5 * s, 10 * s);
      ctx.fillRect(x + 8 * s, legY - 2 * s, 5 * s, 10 * s);
      ctx.fillRect(x + 16 * s, legY + 2 * s, 5 * s, 6 * s);
    }

    if (!isJumping) {
      ctx.fillStyle = CL.catBelly;
      for (const px of [x + 10.5 * s, x + 18.5 * s, x + 28.5 * s, x + 36.5 * s]) {
        ctx.beginPath();
        ctx.arc(px, legY + 8 * s, 2.5 * s, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.restore();
};

// ── Obstacles ───────────────────────────────────────────────

export const drawCactus = (
  ctx: CanvasRenderingContext2D,
  x: number,
  type: string,
  groundY: number,
): void => {
  ctx.fillStyle = CL.obstacleColor;

  if (type === "small") {
    const h = OBSTACLES.CACTUS_SMALL_H;
    const w = OBSTACLES.CACTUS_SMALL_W;
    const y = groundY - h;
    ctx.beginPath(); ctx.roundRect(x + 5, y, w - 10, h, 4); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x - 1, y + 8, w + 2, 10, 3); ctx.fill();
    ctx.fillStyle = CL.obstacleMid;
    ctx.beginPath(); ctx.roundRect(x + 1, y + 6, 5, 14, 2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x + w - 6, y + 10, 5, 12, 2); ctx.fill();
  } else if (type === "large") {
    const h = OBSTACLES.CACTUS_LARGE_H;
    const w = OBSTACLES.CACTUS_LARGE_W;
    const y = groundY - h;
    ctx.beginPath(); ctx.roundRect(x + 7, y, w - 14, h, 5); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x - 1, y + 12, w + 2, 14, 4); ctx.fill();
    ctx.fillStyle = CL.obstacleMid;
    ctx.beginPath(); ctx.roundRect(x + 1, y + 8, 6, 22, 3); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x + w - 7, y + 14, 6, 18, 3); ctx.fill();
  } else if (type === "group") {
    const h = OBSTACLES.CACTUS_GROUP_H;
    const y = groundY - h;
    for (let i = 0; i < 3; i++) {
      const cx = x + i * 16;
      const extra = i === 1 ? 8 : 0;
      ctx.fillStyle = CL.obstacleColor;
      ctx.beginPath(); ctx.roundRect(cx + 3, y - extra, 12, h + extra, 4); ctx.fill();
      ctx.fillStyle = CL.obstacleMid;
      ctx.beginPath(); ctx.roundRect(cx, y + 6 - extra, 18, 8, 3); ctx.fill();
    }
  }
};

export const drawBird = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
): void => {
  ctx.fillStyle = CL.obstacleColor;
  ctx.beginPath(); ctx.ellipse(x + 20, y + 14, 14, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 36, y + 11, 7, 6, -0.2, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = CL.green;
  ctx.beginPath(); ctx.moveTo(x + 42, y + 9); ctx.lineTo(x + 48, y + 12); ctx.lineTo(x + 42, y + 14); ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(x + 38, y + 10, 2, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = CL.obstacleMid;
  ctx.beginPath(); ctx.moveTo(x + 6, y + 10); ctx.lineTo(x - 2, y + 6); ctx.lineTo(x - 2, y + 18); ctx.closePath(); ctx.fill();

  if (frame % 2 === 0) {
    ctx.beginPath(); ctx.moveTo(x + 14, y + 8); ctx.lineTo(x + 22, y - 4); ctx.lineTo(x + 28, y + 8); ctx.closePath(); ctx.fill();
  } else {
    ctx.beginPath(); ctx.moveTo(x + 14, y + 20); ctx.lineTo(x + 22, y + 30); ctx.lineTo(x + 28, y + 20); ctx.closePath(); ctx.fill();
  }
};

// ── Environment ─────────────────────────────────────────────

export const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number): void => {
  ctx.fillStyle = CL.cloudColor;
  ctx.beginPath();
  ctx.ellipse(x, y, 22, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 20, y - 3, 16, 9, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 16, y + 1, 14, 7, 0, 0, Math.PI * 2);
  ctx.fill();
};

export const drawGround = (
  ctx: CanvasRenderingContext2D,
  offset: number,
  width: number,
  groundY: number,
): void => {
  ctx.fillStyle = CL.groundColor;
  ctx.fillRect(0, groundY, width, 2);
  ctx.fillStyle = CL.cloudColor;
  for (let i = 0; i < width + 20; i += 4) {
    const px = (i + offset * 1.3) % (width + 40) - 20;
    if (Math.sin(i * 0.7) > 0.2) ctx.fillRect(px, groundY + 5 + (i % 5), 2, 1);
    if (Math.cos(i * 1.1) > 0.4) ctx.fillRect(px, groundY + 10 + (i % 3), 1, 1);
  }
};

export const drawStars = (
  ctx: CanvasRenderingContext2D,
  width: number,
  nightAlpha: number,
): void => {
  if (nightAlpha <= 0) return;
  ctx.fillStyle = `rgba(200,185,220,${nightAlpha * 0.8})`;
  const stars = [
    [50, 30], [150, 55], [280, 20], [400, 45], [520, 25],
    [620, 60], [700, 15], [130, 70], [350, 65], [580, 50],
    [80, 65], [220, 40], [460, 30], [680, 55],
  ];
  for (const [sx, sy] of stars) {
    const s = 1 + Math.sin(sx * 0.1) * 0.5;
    ctx.beginPath();
    ctx.arc(sx % width, sy, s, 0, Math.PI * 2);
    ctx.fill();
  }
};

export const drawMoon = (
  ctx: CanvasRenderingContext2D,
  nightAlpha: number,
  moonX: number,
): void => {
  if (nightAlpha <= 0) return;
  ctx.globalAlpha = nightAlpha;

  const grd = ctx.createRadialGradient(moonX, 40, 10, moonX, 40, 30);
  grd.addColorStop(0, "rgba(200,185,220,0.3)");
  grd.addColorStop(1, "rgba(200,185,220,0)");
  ctx.fillStyle = grd;
  ctx.beginPath(); ctx.arc(moonX, 40, 30, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = "#EDE5F5";
  ctx.beginPath(); ctx.arc(moonX, 40, 14, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = nightAlpha > 0.5 ? "#2A1A42" : CL.bg;
  ctx.beginPath(); ctx.arc(moonX + 8, 36, 11, 0, Math.PI * 2); ctx.fill();

  ctx.globalAlpha = 1;
};

export const drawParticles = (
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
): void => {
  for (const p of particles) {
    const alpha = p.life / p.maxLife;
    ctx.fillStyle = `rgba(123,47,190,${alpha * 0.5})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  }
};

// ── HUD ─────────────────────────────────────────────────────

export const drawScoreHUD = (
  ctx: CanvasRenderingContext2D,
  score: number,
  highScore: number,
  flashTimer: number,
  nightAlpha: number,
  width: number,
  fontSize: number,
): void => {
  ctx.textAlign = "right";
  const scoreFlash = flashTimer > 0 && flashTimer % 6 < 3;

  if (highScore > 0) {
    ctx.fillStyle = nightAlpha > 0.3 ? "#8B7BA3" : CL.textMuted;
    ctx.font = `bold ${fontSize - 2}px 'SF Pro Display', -apple-system, sans-serif`;
    ctx.fillText("HI " + String(highScore).padStart(5, "0"), width - 60, 20);
  }

  if (!scoreFlash) {
    ctx.fillStyle = nightAlpha > 0.3 ? "#C9B8DB" : CL.textSecondary;
    ctx.font = `bold ${fontSize}px 'SF Pro Display', -apple-system, sans-serif`;
    ctx.fillText(String(score).padStart(5, "0"), width - 12, 20);
  }
};

// ── Idle / Game Over overlays ───────────────────────────────

export const drawIdleScreen = (
  ctx: CanvasRenderingContext2D,
  width: number,
  sc: SizeConfig,
  catW: number,
  catH: number,
  catX: number,
): void => {
  ctx.fillStyle = CL.bg;
  ctx.fillRect(0, 0, width, sc.canvasHeight);

  const topGrd = ctx.createLinearGradient(0, 0, 0, 60);
  topGrd.addColorStop(0, "rgba(123,47,190,0.04)");
  topGrd.addColorStop(1, "rgba(123,47,190,0)");
  ctx.fillStyle = topGrd;
  ctx.fillRect(0, 0, width, 60);

  drawGround(ctx, 0, width, sc.groundY);
  drawCloud(ctx, width * 0.3, 35);
  drawCloud(ctx, width * 0.7, 50);
  drawCat(ctx, catX, sc.groundY - catH, 0, false, false, sc, catW, catH, 0, 0);

  ctx.fillStyle = CL.text;
  ctx.font = `bold ${sc.headerFontSize}px 'SF Pro Display', -apple-system, sans-serif`;
  ctx.textAlign = "center";

  const textY = Math.min(sc.groundY - catH - 30, sc.canvasHeight * 0.35);
  ctx.fillText("ПУЛЬСИК БЕЖИТ!", width / 2, textY);

  ctx.fillStyle = CL.textSecondary;
  ctx.font = `${sc.headerFontSize - 2}px 'SF Pro Display', -apple-system, sans-serif`;
  ctx.fillText(sc.width < 300 ? "TAP TO START" : "нажми SPACE или коснись экрана", width / 2, textY + 22);
};

export const drawGameOverScreen = (
  ctx: CanvasRenderingContext2D,
  width: number,
  sc: SizeConfig,
  score: number,
): void => {
  ctx.fillStyle = "rgba(240,237,237,0.6)";
  ctx.fillRect(0, 0, width, sc.canvasHeight);

  const isSmall = sc.width < 300;
  const cardW = isSmall ? 220 : 260;
  const cardH = isSmall ? 100 : 120;
  const cardX = (width - cardW) / 2;
  const cardY = Math.max(20, (sc.canvasHeight - cardH) / 2 - 20);

  ctx.fillStyle = CL.cardBg;
  ctx.shadowColor = "rgba(90,31,142,0.12)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 4;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 14);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  ctx.fillStyle = CL.text;
  ctx.font = `bold ${isSmall ? 14 : 16}px 'SF Pro Display', -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("ПУЛЬСИК УСТАЛ", width / 2, cardY + (isSmall ? 28 : 32));

  ctx.fillStyle = CL.purple;
  ctx.font = `bold ${isSmall ? 22 : 26}px 'SF Pro Display', -apple-system, sans-serif`;
  ctx.fillText(String(score).padStart(5, "0"), width / 2, cardY + (isSmall ? 58 : 66));

  ctx.fillStyle = CL.textMuted;
  ctx.font = `${isSmall ? 10 : 11}px 'SF Pro Display', -apple-system, sans-serif`;
  ctx.fillText(
    isSmall ? "TAP TO RESTART" : "нажми SPACE для перезапуска",
    width / 2,
    cardY + (isSmall ? 82 : 98),
  );
};
