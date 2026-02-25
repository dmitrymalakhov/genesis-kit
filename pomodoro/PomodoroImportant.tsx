import { type FC } from "react";
import { usePomodoro } from "./hooks";
import { TimerRing, PlayIcon, PauseIcon, ResetIcon, SkipIcon } from "./components";
import { PHASES, TOTAL_CYCLES, PHASE_KEYS } from "./constants";
import {
  Card,
  RingWrap,
  RingInner,
  TimeDisplay,
  PhaseLabel,
  CycleRow,
  CycleDot,
  CycleLabel,
  PhaseTabsWideWrap,
  PhaseTabWide,
  SecondaryBtn,
  MainBtn,
  ImportantBody,
  ImportantInfo,
  ImportantStatsGrid,
  ImportantStatItem,
  ImportantStatVal,
  ImportantStatLbl,
} from "./styled";

export const PomodoroImportant: FC = () => {
  const p = usePomodoro();

  return (
    <Card $width={600} $height={280}>
      <ImportantBody>
        {/* Left: large ring */}
        <RingWrap $size={180}>
          <TimerRing progress={p.progress} color={p.cfg.color} size={180} strokeWidth={7} />
          <RingInner>
            <TimeDisplay $size={46}>
              {p.mm}:{p.ss}
            </TimeDisplay>
            <PhaseLabel $color={p.cfg.color} $size={13}>
              {p.cfg.icon} {p.cfg.label}
            </PhaseLabel>
          </RingInner>
        </RingWrap>

        {/* Right: controls & info */}
        <ImportantInfo>
          {/* Phase tabs */}
          <PhaseTabsWideWrap>
            {PHASE_KEYS.map((k) => (
              <PhaseTabWide
                key={k}
                $active={k === p.phase}
                $color={PHASES[k].color}
                onClick={() => p.go(k)}
              >
                {PHASES[k].icon} {PHASES[k].label}
              </PhaseTabWide>
            ))}
          </PhaseTabsWideWrap>

          {/* Stats */}
          <ImportantStatsGrid>
            <ImportantStatItem>
              <ImportantStatVal>{p.done}</ImportantStatVal>
              <ImportantStatLbl>сессий</ImportantStatLbl>
            </ImportantStatItem>
            <ImportantStatItem>
              <ImportantStatVal>{p.mins}</ImportantStatVal>
              <ImportantStatLbl>минут</ImportantStatLbl>
            </ImportantStatItem>
            <ImportantStatItem>
              <ImportantStatVal>
                {p.done > 0 ? Math.round(p.mins / p.done) : 0}
              </ImportantStatVal>
              <ImportantStatLbl>ср. фокус</ImportantStatLbl>
            </ImportantStatItem>
          </ImportantStatsGrid>

          {/* Cycle dots */}
          <CycleRow $mt={0}>
            {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
              <CycleDot
                key={i}
                $filled={i < p.cycle}
                $current={i === p.cycle && p.phase === "work"}
              />
            ))}
            <CycleLabel>цикл {p.cycle}/{TOTAL_CYCLES}</CycleLabel>
          </CycleRow>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SecondaryBtn $size={32} onClick={p.reset}>
              <ResetIcon />
            </SecondaryBtn>
            <MainBtn $color={p.cfg.color} $size={48} onClick={p.toggle}>
              {p.running ? <PauseIcon /> : <PlayIcon />}
            </MainBtn>
            <SecondaryBtn $size={32} onClick={p.skip}>
              <SkipIcon />
            </SecondaryBtn>
          </div>
        </ImportantInfo>
      </ImportantBody>
    </Card>
  );
};
