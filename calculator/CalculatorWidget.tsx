import { useReducer, useCallback, useMemo } from 'react';
import type { FC } from 'react';
import type { CalcState, CalcAction, CalcMode, CalcKey } from './types';
import {
  WidgetContainer,
  Header,
  Title,
  ModeToggle,
  ModeButton,
  Display,
  Expression,
  DisplayValue,
  KeyGrid,
  KeyButton,
} from './styled';

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: CalcState = {
  display: '0',
  expression: '',
  waitingForOperand: false,
  hasError: false,
  mode: 'basic',
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

const calcReducer = (state: CalcState, action: CalcAction): CalcState => {
  switch (action.type) {

    case 'SET_MODE':
      return { ...initialState, mode: action.payload };

    case 'CLEAR':
      return { ...initialState, mode: state.mode };

    case 'INPUT_NUM': {
      if (state.hasError) return { ...initialState, mode: state.mode };
      const n = action.payload;
      if (state.waitingForOperand) {
        return {
          ...state,
          display: n === '.' ? '0.' : n,
          waitingForOperand: false,
        };
      }
      if (n === '.' && state.display.includes('.')) return state;
      const next =
        state.display === '0' && n !== '.'
          ? n
          : state.display + n;
      return { ...state, display: next };
    }

    case 'INPUT_OP': {
      if (state.hasError) return state;
      return {
        ...state,
        expression: state.display + ' ' + action.payload,
        waitingForOperand: true,
      };
    }

    case 'EQUALS': {
      if (!state.expression) return state;
      const parts = state.expression.trim().split(' ');
      const left = parseFloat(parts[0]);
      const op = parts[1];
      const right = parseFloat(state.display);
      let result: number;
      try {
        switch (op) {
          case '+': result = left + right; break;
          case '−': result = left - right; break;
          case '×': result = left * right; break;
          case '÷':
            if (right === 0) throw new Error('division by zero');
            result = left / right;
            break;
          case '%': result = left % right; break;
          case '^': result = Math.pow(left, right); break;
          default: return state;
        }
        return {
          ...state,
          display: parseFloat(result.toPrecision(10)).toString(),
          expression: `${state.expression} ${state.display} =`,
          waitingForOperand: true,
        };
      } catch {
        return { ...state, display: 'Ошибка', hasError: true };
      }
    }

    case 'APPLY_FN': {
      if (state.hasError) return state;
      const x = parseFloat(state.display);
      const f = action.payload;
      if (f === 'π') return { ...state, display: Math.PI.toPrecision(9), waitingForOperand: true };
      if (f === 'e')  return { ...state, display: Math.E.toPrecision(9),  waitingForOperand: true };
      let r: number;
      try {
        switch (f) {
          case 'sin': r = Math.sin((x * Math.PI) / 180); break;
          case 'cos': r = Math.cos((x * Math.PI) / 180); break;
          case 'tan': r = Math.tan((x * Math.PI) / 180); break;
          case 'log': r = Math.log10(x); break;
          case 'ln':  r = Math.log(x); break;
          case '√':   r = Math.sqrt(x); break;
          case 'x²':  r = x * x; break;
          case '1/x':
            if (x === 0) throw new Error('division by zero');
            r = 1 / x;
            break;
          default: return state;
        }
        return {
          ...state,
          display: parseFloat(r.toPrecision(10)).toString(),
          expression: `${f}(${state.display}) =`,
          waitingForOperand: true,
        };
      } catch {
        return { ...state, display: 'Ошибка', hasError: true };
      }
    }

    case 'TOGGLE_SIGN': {
      if (state.hasError) return state;
      return {
        ...state,
        display: state.display.startsWith('-')
          ? state.display.slice(1)
          : '-' + state.display,
      };
    }

    case 'BACKSPACE': {
      if (state.hasError) return { ...initialState, mode: state.mode };
      return {
        ...state,
        display: state.display.length > 1 ? state.display.slice(0, -1) : '0',
      };
    }

    default:
      return state;
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

export const CalculatorWidget: FC = () => {
  const [state, dispatch] = useReducer(calcReducer, initialState);

  const setMode = useCallback((m: CalcMode) => {
    dispatch({ type: 'SET_MODE', payload: m });
  }, []);

  const handleNum = useCallback((n: string) => {
    dispatch({ type: 'INPUT_NUM', payload: n });
  }, []);

  const handleOp = useCallback((o: string) => {
    dispatch({ type: 'INPUT_OP', payload: o });
  }, []);

  const handleFn = useCallback((f: string) => {
    dispatch({ type: 'APPLY_FN', payload: f });
  }, []);

  const basicKeys = useMemo((): CalcKey[] => [
    { label: 'AC',  variant: 'clear', action: () => dispatch({ type: 'CLEAR' }) },
    { label: '+/−', variant: 'fn',    action: () => dispatch({ type: 'TOGGLE_SIGN' }) },
    { label: '⌫',   variant: 'fn',    action: () => dispatch({ type: 'BACKSPACE' }) },
    { label: '÷',   variant: 'op',    action: () => handleOp('÷') },

    { label: '7', variant: 'num', action: () => handleNum('7') },
    { label: '8', variant: 'num', action: () => handleNum('8') },
    { label: '9', variant: 'num', action: () => handleNum('9') },
    { label: '×', variant: 'op',  action: () => handleOp('×') },

    { label: '4', variant: 'num', action: () => handleNum('4') },
    { label: '5', variant: 'num', action: () => handleNum('5') },
    { label: '6', variant: 'num', action: () => handleNum('6') },
    { label: '−', variant: 'op',  action: () => handleOp('−') },

    { label: '1', variant: 'num', action: () => handleNum('1') },
    { label: '2', variant: 'num', action: () => handleNum('2') },
    { label: '3', variant: 'num', action: () => handleNum('3') },
    { label: '+', variant: 'op',  action: () => handleOp('+') },

    { label: '0', variant: 'num', span: 2, action: () => handleNum('0') },
    { label: '.', variant: 'num', action: () => handleNum('.') },
    { label: '=', variant: 'eq',  action: () => dispatch({ type: 'EQUALS' }) },
  ], [handleNum, handleOp]);

  const engineerKeys = useMemo((): CalcKey[] => [
    { label: 'AC',  variant: 'clear', action: () => dispatch({ type: 'CLEAR' }) },
    { label: 'sin', variant: 'fn',    action: () => handleFn('sin') },
    { label: 'cos', variant: 'fn',    action: () => handleFn('cos') },
    { label: 'tan', variant: 'fn',    action: () => handleFn('tan') },
    { label: '÷',   variant: 'op',    action: () => handleOp('÷') },

    { label: '7',   variant: 'num', action: () => handleNum('7') },
    { label: '8',   variant: 'num', action: () => handleNum('8') },
    { label: '9',   variant: 'num', action: () => handleNum('9') },
    { label: 'log', variant: 'fn',  action: () => handleFn('log') },
    { label: '×',   variant: 'op',  action: () => handleOp('×') },

    { label: '4',   variant: 'num', action: () => handleNum('4') },
    { label: '5',   variant: 'num', action: () => handleNum('5') },
    { label: '6',   variant: 'num', action: () => handleNum('6') },
    { label: '√',   variant: 'fn',  action: () => handleFn('√') },
    { label: '−',   variant: 'op',  action: () => handleOp('−') },

    { label: '1',   variant: 'num', action: () => handleNum('1') },
    { label: '2',   variant: 'num', action: () => handleNum('2') },
    { label: '3',   variant: 'num', action: () => handleNum('3') },
    { label: 'x²',  variant: 'fn',  action: () => handleFn('x²') },
    { label: '+',   variant: 'op',  action: () => handleOp('+') },

    { label: 'π',   variant: 'fn',  action: () => handleFn('π') },
    { label: '0',   variant: 'num', action: () => handleNum('0') },
    { label: '.',   variant: 'num', action: () => handleNum('.') },
    { label: '^',   variant: 'fn',  action: () => handleOp('^') },
    { label: '=',   variant: 'eq',  action: () => dispatch({ type: 'EQUALS' }) },
  ], [handleNum, handleOp, handleFn]);

  const keys = state.mode === 'basic' ? basicKeys : engineerKeys;
  const cols  = state.mode === 'basic' ? 4 : 5;

  return (
    <WidgetContainer>
      <Header>
        <Title>Калькулятор</Title>
        <ModeToggle>
          <ModeButton
            $active={state.mode === 'basic'}
            onClick={() => setMode('basic')}
          >
            Простой
          </ModeButton>
          <ModeButton
            $active={state.mode === 'engineer'}
            onClick={() => setMode('engineer')}
          >
            Инж.
          </ModeButton>
        </ModeToggle>
      </Header>

      <Display>
        <Expression>{state.expression}</Expression>
        <DisplayValue $error={state.hasError}>
          {state.display}
        </DisplayValue>
      </Display>

      <KeyGrid $cols={cols}>
        {keys.map((key, idx) => (
          <KeyButton
            key={`${state.mode}-${idx}`}
            $variant={key.variant}
            $span={key.span}
            onClick={key.action}
            aria-label={key.label}
          >
            {key.label}
          </KeyButton>
        ))}
      </KeyGrid>
    </WidgetContainer>
  );
};
