import { type FC } from "react";
import { usePomodoro } from "./hooks";
import { TimerRing, PlayIcon, PauseIcon, ResetIcon, SkipIcon } from "./components";
import { PHASES, TOTAL_CYCLES, PHASE_KEYS } from "./constants";
import {
  Card,
  Header,
  HeaderTitle,
  PhaseTabsWrap,
  PhaseTab,
  TimerCenter,
  RingWrap,
  RingInner,
  TimeDisplay,
  PhaseLabel,
  CycleRow,
  CycleDot,
  CycleLabel,
  Footer,
  SecondaryBtn,
  MainBtn,
} from "./styled";

export const PomodoroMinor: FC = () => {
  const p = usePomodoro();

  return (
    <Card $width={296} $height={280}>
      <Header>
        <HeaderTitle>помодоро</HeaderTitle>
        <PhaseTabsWrap>
          {PHASE_KEYS.map((k) => (
            <PhaseTab
              key={k}
              $active={k === p.phase}
              $color={PHASES[k].color}
              onClick={() => p.go(k)}
            >
              {PHASES[k].icon}
            </PhaseTab>
          ))}
        </PhaseTabsWrap>
      </Header>

      <TimerCenter>
        <RingWrap $size={140}>
          <TimerRing progress={p.progress} color={p.cfg.color} size={140} strokeWidth={6} />
          <RingInner>
            <TimeDisplay $size={36}>
              {p.mm}:{p.ss}
            </TimeDisplay>
            <PhaseLabel $color={p.cfg.color} $size={11}>
              {p.cfg.icon} {p.cfg.label}
            </PhaseLabel>
          </RingInner>
        </RingWrap>

        <CycleRow>
          {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
            <CycleDot
              key={i}
              $filled={i < p.cycle}
              $current={i === p.cycle && p.phase === "work"}
            />
          ))}
          <CycleLabel>{p.done} сессий</CycleLabel>
        </CycleRow>
      </TimerCenter>

      <Footer>
        <SecondaryBtn onClick={p.reset}>
          <ResetIcon />
        </SecondaryBtn>
        <MainBtn $color={p.cfg.color} onClick={p.toggle}>
          {p.running ? <PauseIcon /> : <PlayIcon />}
        </MainBtn>
        <SecondaryBtn onClick={p.skip}>
          <SkipIcon />
        </SecondaryBtn>
      </Footer>
    </Card>
  );
};
