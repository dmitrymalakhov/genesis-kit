import { type FC } from "react";
import { usePomodoro } from "./hooks";
import { TimerRing, PlayIcon, PauseIcon, ResetIcon, SkipIcon } from "./components";
import { PHASES, TOTAL_CYCLES, PHASE_KEYS } from "./constants";
import {
  Card,
  MajorHeader,
  MajorTitle,
  Badge,
  MajorBody,
  PhaseTabsWideWrap,
  PhaseTabWide,
  RingWrap,
  RingInner,
  TimeDisplay,
  PhaseLabel,
  CycleRow,
  CycleDot,
  CycleLabel,
  SecondaryBtn,
  MainBtn,
  StatsRow,
  StatBlock,
  StatValue,
  StatLabel,
} from "./styled";

export const PomodoroMajor: FC = () => {
  const p = usePomodoro();

  return (
    <Card $width={600} $height={570}>
      {/* Header */}
      <MajorHeader>
        <MajorTitle>помодоро-таймер</MajorTitle>
        <Badge $color={p.cfg.color} $bg={p.cfg.bg}>
          {p.cfg.icon} {p.cfg.label}
        </Badge>
      </MajorHeader>

      <MajorBody>
        {/* Phase tabs */}
        <PhaseTabsWideWrap style={{ width: "100%", maxWidth: 360 }}>
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

        {/* Large timer ring */}
        <RingWrap $size={260}>
          <TimerRing progress={p.progress} color={p.cfg.color} size={260} strokeWidth={8} />
          <RingInner>
            <TimeDisplay $size={64}>
              {p.mm}:{p.ss}
            </TimeDisplay>
            <PhaseLabel $color={p.cfg.color} $size={16}>
              {p.cfg.icon} {p.cfg.label}
            </PhaseLabel>
          </RingInner>
        </RingWrap>

        {/* Cycle dots */}
        <CycleRow $mt={4}>
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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <SecondaryBtn $size={38} onClick={p.reset}>
            <ResetIcon />
          </SecondaryBtn>
          <MainBtn $color={p.cfg.color} $size={60} onClick={p.toggle}>
            {p.running ? <PauseIcon /> : <PlayIcon />}
          </MainBtn>
          <SecondaryBtn $size={38} onClick={p.skip}>
            <SkipIcon />
          </SecondaryBtn>
        </div>
      </MajorBody>

      {/* Stats footer */}
      <StatsRow>
        <StatBlock>
          <StatValue $size={24}>{p.done}</StatValue>
          <StatLabel>сессий</StatLabel>
        </StatBlock>
        <StatBlock>
          <StatValue $size={24}>{p.mins}</StatValue>
          <StatLabel>минут фокуса</StatLabel>
        </StatBlock>
        <StatBlock>
          <StatValue $size={24}>
            {p.done > 0 ? Math.round(p.mins / p.done) : 0}
          </StatValue>
          <StatLabel>ср. фокус</StatLabel>
        </StatBlock>
      </StatsRow>
    </Card>
  );
};
