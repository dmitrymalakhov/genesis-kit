import styled, { css, keyframes } from 'styled-components';
import type { KeyButtonProps, ModeBtnProps } from './types';

// ─── Keyframes ────────────────────────────────────────────────────────────────

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(4px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const popIn = keyframes({
  '0%': { transform: 'scale(0.94)', opacity: 0 },
  '60%': { transform: 'scale(1.02)' },
  '100%': { transform: 'scale(1)', opacity: 1 },
});

const flash = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.45 },
});

// ─── Animation helpers ────────────────────────────────────────────────────────

const animations = {
  fadeIn: css`
    animation: ${fadeIn} 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  `,
  popIn: css`
    animation: ${popIn} 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `,
  flash: css`
    animation: ${flash} 0.4s ease forwards;
  `,
};

// ─── Design tokens ────────────────────────────────────────────────────────────

const tokens = {
  accent: '#7B61FF',
  accentHover: '#6A50EF',
  accentLight: '#EDE9FF',
  accentLightHover: '#E0D9FF',
  danger: '#E05252',
  dangerLight: '#FFF0F0',
  dangerLightHover: '#FFE4E4',
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  font: "'SB Sans Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

// ─── Widget shell ─────────────────────────────────────────────────────────────

export const WidgetContainer = styled('div')(
  {
    width: '296px',
    height: '280px',
    background: '#ffffff',
    borderRadius: tokens.radius.xl,
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: tokens.font,
    userSelect: 'none',
    boxSizing: 'border-box',
    position: 'relative',
  },
  animations.fadeIn,
);

// ─── Header ───────────────────────────────────────────────────────────────────

export const Header = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '9px 12px 7px',
  borderBottom: '1px solid #F0F0F4',
  flexShrink: 0,
});

export const Title = styled('span')({
  fontSize: '10px',
  fontWeight: 600,
  color: '#8B8B9E',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
});

export const ModeToggle = styled('div')({
  display: 'flex',
  background: '#F4F4F8',
  borderRadius: tokens.radius.md,
  padding: '2px',
  gap: '2px',
});

export const ModeButton = styled('button')<ModeBtnProps>(
  {
    fontSize: '10px',
    fontWeight: 600,
    padding: '3px 9px',
    borderRadius: tokens.radius.sm,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    lineHeight: 1.4,
    letterSpacing: '0.02em',
    outline: 'none',
  },
  ({ $active }) =>
    $active
      ? {
          background: tokens.accent,
          color: '#ffffff',
          boxShadow: '0 1px 5px rgba(123,97,255,0.35)',
        }
      : {
          background: 'transparent',
          color: '#8B8B9E',
        },
);

// ─── Display ──────────────────────────────────────────────────────────────────

export const Display = styled('div')({
  background: '#FAFAFA',
  padding: '7px 13px 5px',
  borderBottom: '1px solid #F0F0F4',
  minHeight: '52px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  flexShrink: 0,
});

export const Expression = styled('div')({
  fontSize: '10px',
  color: '#B0B0C0',
  minHeight: '14px',
  textAlign: 'right',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '268px',
  lineHeight: 1.3,
});

export const DisplayValue = styled('div')<{ $error: boolean }>(
  {
    textAlign: 'right',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '268px',
    lineHeight: 1.1,
    transition: 'color 0.15s ease',
  },
  ({ $error }) =>
    $error
      ? {
          fontSize: '13px',
          fontWeight: 500,
          color: tokens.danger,
        }
      : {
          fontSize: '24px',
          fontWeight: 300,
          color: '#1A1A2E',
          letterSpacing: '-0.02em',
        },
);

// ─── Key grid ─────────────────────────────────────────────────────────────────

export const KeyGrid = styled('div')<{ $cols: number }>(
  {
    flex: 1,
    display: 'grid',
    padding: '5px 7px 7px',
    gap: '3px',
    gridTemplateRows: 'repeat(4, 1fr)',
  },
  ({ $cols }) => ({
    gridTemplateColumns: `repeat(${$cols}, 1fr)`,
  }),
);

// ─── Key button ───────────────────────────────────────────────────────────────

const keyBase = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: tokens.radius.md,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 0.1s ease, transform 0.08s ease',
  outline: 'none',
  padding: 0,
  '&:active': {
    transform: 'scale(0.89)',
  },
};

const keyVariantStyles: Record<string, object> = {
  num: {
    background: '#F4F4F8',
    color: '#1A1A2E',
    fontSize: '13px',
    fontWeight: 500,
    '&:hover': { background: '#EBEBF2' },
  },
  op: {
    background: '#EDE9FF',
    color: tokens.accent,
    fontSize: '14px',
    fontWeight: 600,
    '&:hover': { background: '#E0D9FF' },
  },
  eq: {
    background: tokens.accent,
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 700,
    boxShadow: '0 2px 8px rgba(123,97,255,0.3)',
    '&:hover': { background: tokens.accentHover },
  },
  fn: {
    background: '#F0F0F4',
    color: '#55556E',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.01em',
    '&:hover': { background: '#E8E8EF' },
  },
  clear: {
    background: '#FFF0F0',
    color: tokens.danger,
    fontSize: '12px',
    fontWeight: 700,
    '&:hover': { background: '#FFE4E4' },
  },
};

export const KeyButton = styled('button')<KeyButtonProps>(
  keyBase,
  ({ $variant, $span }) => ({
    ...keyVariantStyles[$variant],
    ...($span && $span > 1 ? { gridColumn: `span ${$span}` } : {}),
  }),
  animations.popIn,
);
