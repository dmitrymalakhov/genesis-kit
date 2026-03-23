export type CalcMode = 'basic' | 'engineer';

export type CalcKeyVariant = 'num' | 'op' | 'eq' | 'fn' | 'clear';

export interface CalcKey {
  label: string;
  variant: CalcKeyVariant;
  span?: number;
  action: () => void;
}

export interface CalcState {
  display: string;
  expression: string;
  waitingForOperand: boolean;
  hasError: boolean;
  mode: CalcMode;
}

export type CalcAction =
  | { type: 'INPUT_NUM'; payload: string }
  | { type: 'INPUT_OP'; payload: string }
  | { type: 'EQUALS' }
  | { type: 'APPLY_FN'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'BACKSPACE' }
  | { type: 'SET_MODE'; payload: CalcMode };

export interface KeyButtonProps {
  $variant: CalcKeyVariant;
  $span?: number;
}

export interface ModeBtnProps {
  $active: boolean;
}
