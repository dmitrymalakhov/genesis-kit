import { useState, useEffect, useRef, useCallback } from "react";
import type { DinoProps, GameState, GameStatus, Obstacle, Particle } from "./types";
import {
  SIZE_CONFIGS,
  PHYSICS,
  CAT,
  OBSTACLES,
  BIRD_OFFSETS,
  COLORS,
  getMinGap,
  getMaxGap,
  getAllowedObstacles,
} from "./constants";
import {
  drawCat,
  drawCactus,
  drawBird,
  drawCloud,
  drawGround,
  drawStars,
  drawMoon,
  drawParticles,
  drawScoreHUD,
  drawIdleScreen,
  drawGameOverScreen,
} from "./renderer";
import {
  Wrapper,
  Header,
  LogoWrap,
  LogoText,
  LogoAccent,
  Spacer,
  ScoreRow,
  ScoreValue,
  CanvasCard,
  Canvas,
  ControlsRow,
  ControlBadge,
  ControlKey,
  ContentStack,
} from "./styled";

// ── Helpers ─────────────────────────────────────────────────

const checkCollision = (
  cat: { x: number; y: number; w: number; h: number },
  obs: { x: number; y: number; w: number; h: number },
): boolean => {
  const pad = 8;
  return (
    cat.x + pad < obs.x + obs.w - 6 &&
    cat.x + cat.w - pad > obs.x + 6 &&
    cat.y + pad < obs.y + obs.h - 6 &&
    cat.y + cat.h - pad > obs.y + 6
  );
};

const spawnParticles = (particles: Particle[], x: number, y: number, count: number): void => {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: x + Math.random() * 30,
      y,
      vx: (Math.random() - 0.5) * 3,
      vy: -Math.random() * 2 - 0.5,
      life: 18 + Math.random() * 12,
      maxLife: 30,
      size: 2 + Math.random() * 3,
    });
  }
};

// ── Component ───────────────────────────────────────────────

export const Dino = ({ size = "important" }: DinoProps) => {
  const sc = SIZE_CONFIGS[size];
  const catScale = sc.catScale;

  // Scaled cat dimensions
  const catW = Math.round(CAT.WIDTH * catScale);
  const catH = Math.round(CAT.HEIGHT * catScale);
  const catDuckW = Math.round(CAT.DUCK_WIDTH * catScale);
  const catDuckH = Math.round(CAT.DUCK_HEIGHT * catScale);
  const catX = Math.round(CAT.X * catScale);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [displayScore, setDisplayScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle");

  const initGame = useCallback((): void => {
    gameStateRef.current = {
      cat: {
        x: catX,
        y: sc.groundY - catH,
        vy: 0,
        w: catW,
        h: catH,
        ducking: false,
        grounded: true,
      },
      obstacles: [],
      particles: [],
      clouds: [
        { x: sc.width * 0.15, y: 25 },
        { x: sc.width * 0.45, y: 50 },
        { x: sc.width * 0.75, y: 18 },
        { x: sc.width * 0.9, y: 42 },
      ],
      speed: PHYSICS.INITIAL_SPEED,
      score: 0,
      distance: 0,
      frame: 0,
      groundOffset: 0,
      distSinceLastObstacle: 0,
      nightCycle: 0,
      lastMilestone: 0,
      flashTimer: 0,
      keysDown: new Set(),
    };
  }, [catX, catW, catH, sc.groundY, sc.width]);

  const spawnObstacle = useCallback(
    (gs: GameState, width: number): void => {
      const allowed = getAllowedObstacles(gs.score);
      const type = allowed[Math.floor(Math.random() * allowed.length)];

      let obs: Obstacle;
      switch (type) {
        case "cactus_small":
          obs = {
            type,
            x: width + 20,
            y: sc.groundY - OBSTACLES.CACTUS_SMALL_H,
            w: OBSTACLES.CACTUS_SMALL_W,
            h: OBSTACLES.CACTUS_SMALL_H,
          };
          break;
        case "cactus_large":
          obs = {
            type,
            x: width + 20,
            y: sc.groundY - OBSTACLES.CACTUS_LARGE_H,
            w: OBSTACLES.CACTUS_LARGE_W,
            h: OBSTACLES.CACTUS_LARGE_H,
          };
          break;
        case "cactus_group":
          obs = {
            type,
            x: width + 20,
            y: sc.groundY - OBSTACLES.CACTUS_GROUP_H,
            w: OBSTACLES.CACTUS_GROUP_W,
            h: OBSTACLES.CACTUS_GROUP_H,
          };
          break;
        default: {
          const lastObs = gs.obstacles[gs.obstacles.length - 1];
          let birdIdx: number;
          if (lastObs && lastObs.type !== "bird" && gs.score < 500) {
            birdIdx = Math.random() > 0.5 ? 0 : 2;
          } else {
            birdIdx = Math.floor(Math.random() * BIRD_OFFSETS.length);
          }
          const birdY = sc.groundY + BIRD_OFFSETS[birdIdx];
          obs = {
            type: "bird",
            x: width + 20,
            y: birdY,
            w: OBSTACLES.BIRD_W,
            h: OBSTACLES.BIRD_H,
          };
          break;
        }
      }

      gs.obstacles.push(obs);
      gs.distSinceLastObstacle = 0;
    },
    [sc.groundY],
  );

  const startGame = useCallback((): void => {
    initGame();
    setGameStatus("running");
    setDisplayScore(0);
  }, [initGame]);

  const restartGame = useCallback((): void => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    startGame();
  }, [startGame]);

  // ── Input ─────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (["Space", "ArrowUp", "ArrowDown"].includes(e.code)) e.preventDefault();
      if (gameStatus === "idle" && (e.code === "Space" || e.code === "ArrowUp")) {
        startGame();
        return;
      }
      if (gameStatus === "over" && (e.code === "Space" || e.code === "Enter")) {
        restartGame();
        return;
      }
      gameStateRef.current?.keysDown.add(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent): void => {
      gameStateRef.current?.keysDown.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameStatus, startGame, restartGame]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>): void => {
      e.preventDefault();
      if (gameStatus === "idle") { startGame(); return; }
      if (gameStatus === "over") { restartGame(); return; }
      if (gameStateRef.current) {
        const touchY = e.touches[0].clientY;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect && touchY > rect.top + rect.height * 0.6) {
          gameStateRef.current.keysDown.add("ArrowDown");
        } else {
          gameStateRef.current.keysDown.add("Space");
        }
      }
    },
    [gameStatus, startGame, restartGame],
  );

  const handleTouchEnd = useCallback((): void => {
    if (gameStateRef.current) {
      gameStateRef.current.keysDown.delete("Space");
      gameStateRef.current.keysDown.delete("ArrowDown");
    }
  }, []);

  const handleCanvasClick = useCallback((): void => {
    if (gameStatus === "idle") startGame();
    else if (gameStatus === "over") restartGame();
  }, [gameStatus, startGame, restartGame]);

  // ── Game Loop ─────────────────────────────────

  useEffect(() => {
    if (gameStatus !== "running") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = sc.width;
    let lastTime = performance.now();

    const loop = (now: number): void => {
      const dt = Math.min((now - lastTime) / 16.67, 2);
      lastTime = now;
      const gs = gameStateRef.current;
      if (!gs) return;

      gs.frame++;
      const animFrame = Math.floor(gs.frame / 6);
      const keys = gs.keysDown;
      const wantJump = keys.has("Space") || keys.has("ArrowUp");
      const wantDuck = keys.has("ArrowDown");

      // Cat physics
      const cat = gs.cat;
      if (wantJump && cat.grounded && !wantDuck) {
        cat.vy = PHYSICS.JUMP_FORCE;
        cat.grounded = false;
      }
      if (wantDuck && !cat.grounded) {
        cat.vy += PHYSICS.GRAVITY * 1.5 * dt;
      }

      cat.ducking = wantDuck && cat.grounded;
      if (cat.ducking) {
        cat.h = catDuckH;
        cat.w = catDuckW;
        cat.y = sc.groundY - catDuckH;
      } else {
        cat.w = catW;
        cat.h = catH;
      }

      if (!cat.grounded) {
        cat.vy += PHYSICS.GRAVITY * dt;
        cat.y += cat.vy * dt;
        if (cat.y >= sc.groundY - cat.h) {
          cat.y = sc.groundY - cat.h;
          cat.vy = 0;
          cat.grounded = true;
          spawnParticles(gs.particles, cat.x, sc.groundY, 4);
        }
      }

      // Speed & score
      gs.speed = Math.min(PHYSICS.MAX_SPEED, gs.speed + PHYSICS.SPEED_INCREMENT * dt);
      const moved = gs.speed * dt;
      gs.distance += moved;
      gs.score = Math.floor(gs.distance / 10);
      gs.groundOffset = (gs.groundOffset + moved) % (width + 40);
      gs.distSinceLastObstacle += moved;

      // Milestones
      const milestone = Math.floor(gs.score / PHYSICS.SCORE_MILESTONE) * PHYSICS.SCORE_MILESTONE;
      if (milestone > gs.lastMilestone && milestone > 0) {
        gs.lastMilestone = milestone;
        gs.flashTimer = 30;
      }
      if (gs.flashTimer > 0) gs.flashTimer--;

      // Night cycle
      gs.nightCycle = (gs.nightCycle + 0.0003 * dt) % 1;
      const nightAlpha =
        gs.nightCycle > 0.5 ? Math.sin((gs.nightCycle - 0.5) * Math.PI * 2) * 0.7 : 0;

      // Obstacle spawning
      const minGap = getMinGap(gs.speed, gs.score);
      const maxGap = getMaxGap(minGap, gs.score);
      const neededGap = minGap + Math.random() * (maxGap - minGap);

      if (gs.distance > PHYSICS.GRACE_DISTANCE && gs.distSinceLastObstacle >= neededGap) {
        spawnObstacle(gs, width);
      }

      for (const obs of gs.obstacles) obs.x -= moved;
      gs.obstacles = gs.obstacles.filter((o) => o.x > -60);

      // Clouds
      for (const cloud of gs.clouds) {
        cloud.x -= gs.speed * PHYSICS.CLOUD_SPEED_FACTOR * dt;
        if (cloud.x < -40) {
          cloud.x = width + 40 + Math.random() * 100;
          cloud.y = 15 + Math.random() * 55;
        }
      }

      // Particles
      gs.particles = gs.particles.filter((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.15 * dt;
        p.life -= dt;
        return p.life > 0;
      });

      // Collision
      const catBox = { x: cat.x, y: cat.y, w: cat.w, h: cat.h };
      for (const obs of gs.obstacles) {
        if (checkCollision(catBox, obs)) {
          setGameStatus("over");
          setHighScore((prev) => Math.max(prev, gs.score));
          return;
        }
      }

      setDisplayScore(gs.score);

      // ═══════ RENDER ═══════
      const bgBase =
        nightAlpha > 0
          ? `rgb(${Math.round(240 - nightAlpha * 200)},${Math.round(237 - nightAlpha * 210)},${Math.round(237 - nightAlpha * 190)})`
          : COLORS.bg;
      ctx.fillStyle = bgBase;
      ctx.fillRect(0, 0, width, sc.canvasHeight);

      if (nightAlpha <= 0) {
        const topGrd = ctx.createLinearGradient(0, 0, 0, 60);
        topGrd.addColorStop(0, "rgba(123,47,190,0.04)");
        topGrd.addColorStop(1, "rgba(123,47,190,0)");
        ctx.fillStyle = topGrd;
        ctx.fillRect(0, 0, width, 60);
      }

      drawStars(ctx, width, nightAlpha);
      drawMoon(ctx, nightAlpha, width - 80);
      for (const cloud of gs.clouds) drawCloud(ctx, cloud.x, cloud.y);
      drawGround(ctx, gs.groundOffset, width, sc.groundY);

      for (const obs of gs.obstacles) {
        if (obs.type === "bird") drawBird(ctx, obs.x, obs.y, animFrame);
        else drawCactus(ctx, obs.x, obs.type.replace("cactus_", ""), sc.groundY);
      }

      drawParticles(ctx, gs.particles);
      drawCat(ctx, cat.x, cat.y, animFrame, cat.ducking, !cat.grounded, sc, catW, catH, catDuckW, catDuckH);
      drawScoreHUD(ctx, gs.score, highScore, gs.flashTimer, nightAlpha, width, sc.scoreFontSize);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameStatus, sc, highScore, spawnObstacle, catW, catH, catDuckW, catDuckH]);

  // ── Static screens ────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (gameStatus === "idle") {
      drawIdleScreen(ctx, sc.width, sc, catW, catH, catX);
    }

    if (gameStatus === "over") {
      drawGameOverScreen(ctx, sc.width, sc, displayScore);
    }
  }, [gameStatus, sc, displayScore, catW, catH, catX]);

  // ── Render ────────────────────────────────────

  const scoreStr = String(displayScore).padStart(5, "0");
  const hiStr = String(highScore).padStart(5, "0");

  const contentGap = size === "major" ? 12 : 6;

  return (
    <Wrapper>
      <ContentStack $gap={contentGap}>
        {sc.showHeader && (
          <Header>
            <LogoWrap>
              <LogoText>пульс</LogoText>
              <LogoAccent>dino</LogoAccent>
            </LogoWrap>
            <Spacer />
            <ScoreRow>
              {highScore > 0 && (
                <span>
                  HI: <ScoreValue $accent>{hiStr}</ScoreValue>
                </span>
              )}
              <span>
                <ScoreValue>{scoreStr}</ScoreValue>
              </span>
            </ScoreRow>
          </Header>
        )}

        <CanvasCard $sizeConfig={sc}>
          <Canvas
            ref={canvasRef}
            width={sc.width}
            height={sc.canvasHeight}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleCanvasClick}
          />
        </CanvasCard>

        {sc.showControls && (
          <ControlsRow>
            <ControlBadge>
              <ControlKey>↑ / SPACE</ControlKey>
              <span>прыжок</span>
            </ControlBadge>
            <ControlBadge>
              <ControlKey>↓</ControlKey>
              <span>пригнуться</span>
            </ControlBadge>
          </ControlsRow>
        )}
      </ContentStack>
    </Wrapper>
  );
};
