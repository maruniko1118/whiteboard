// Material Web Components (Material Design 3)
import '@material/web/ripple/ripple.js';
import '@material/web/focus/md-focus-ring.js';
import '@material/web/elevation/elevation.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/iconbutton/filled-tonal-icon-button.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '@material/web/slider/slider.js';
import '@material/web/dialog/dialog.js';
import '@material/web/divider/divider.js';

// Material Color Utilities (2025 M3 Expressive Dynamic Scheme)
import {
  Hct,
  SchemeExpressive,
  SchemeTonalSpot,
  SchemeVibrant,
  argbFromHex,
  hexFromArgb
} from '@material/material-color-utilities';

// Motion (Spring physics & Expressive animations)
import { animate, spring, stagger } from 'motion';

/**
 * Generate Material Design 3 Expressive (2025 spec) CSS Variables from a seed hex color
 */
export function generateM3ExpressiveTokens(seedHex: string, isDark: boolean) {
  const sourceHct = Hct.fromInt(argbFromHex(seedHex));
  const scheme = new SchemeExpressive(sourceHct, isDark, 0.0, '2025', 'phone');

  return {
    '--md-sys-color-primary': hexFromArgb(scheme.primary),
    '--md-sys-color-primary-dim': hexFromArgb(scheme.primaryDim),
    '--md-sys-color-on-primary': hexFromArgb(scheme.onPrimary),
    '--md-sys-color-primary-container': hexFromArgb(scheme.primaryContainer),
    '--md-sys-color-on-primary-container': hexFromArgb(scheme.onPrimaryContainer),
    '--md-sys-color-inverse-primary': hexFromArgb(scheme.inversePrimary),

    '--md-sys-color-secondary': hexFromArgb(scheme.secondary),
    '--md-sys-color-secondary-dim': hexFromArgb(scheme.secondaryDim),
    '--md-sys-color-on-secondary': hexFromArgb(scheme.onSecondary),
    '--md-sys-color-secondary-container': hexFromArgb(scheme.secondaryContainer),
    '--md-sys-color-on-secondary-container': hexFromArgb(scheme.onSecondaryContainer),

    '--md-sys-color-tertiary': hexFromArgb(scheme.tertiary),
    '--md-sys-color-tertiary-dim': hexFromArgb(scheme.tertiaryDim),
    '--md-sys-color-on-tertiary': hexFromArgb(scheme.onTertiary),
    '--md-sys-color-tertiary-container': hexFromArgb(scheme.tertiaryContainer),
    '--md-sys-color-on-tertiary-container': hexFromArgb(scheme.onTertiaryContainer),

    '--md-sys-color-error': hexFromArgb(scheme.error),
    '--md-sys-color-on-error': hexFromArgb(scheme.onError),
    '--md-sys-color-error-container': hexFromArgb(scheme.errorContainer),
    '--md-sys-color-on-error-container': hexFromArgb(scheme.onErrorContainer),

    '--md-sys-color-background': hexFromArgb(scheme.background),
    '--md-sys-color-on-background': hexFromArgb(scheme.onBackground),
    '--md-sys-color-surface': hexFromArgb(scheme.surface),
    '--md-sys-color-surface-dim': hexFromArgb(scheme.surfaceDim),
    '--md-sys-color-surface-bright': hexFromArgb(scheme.surfaceBright),
    '--md-sys-color-surface-container-lowest': hexFromArgb(scheme.surfaceContainerLowest),
    '--md-sys-color-surface-container-low': hexFromArgb(scheme.surfaceContainerLow),
    '--md-sys-color-surface-container': hexFromArgb(scheme.surfaceContainer),
    '--md-sys-color-surface-container-high': hexFromArgb(scheme.surfaceContainerHigh),
    '--md-sys-color-surface-container-highest': hexFromArgb(scheme.surfaceContainerHighest),
    '--md-sys-color-on-surface': hexFromArgb(scheme.onSurface),
    '--md-sys-color-surface-variant': hexFromArgb(scheme.surfaceVariant),
    '--md-sys-color-on-surface-variant': hexFromArgb(scheme.onSurfaceVariant),

    '--md-sys-color-inverse-surface': hexFromArgb(scheme.inverseSurface),
    '--md-sys-color-inverse-on-surface': hexFromArgb(scheme.inverseOnSurface),
    '--md-sys-color-outline': hexFromArgb(scheme.outline),
    '--md-sys-color-outline-variant': hexFromArgb(scheme.outlineVariant),
    '--md-sys-color-shadow': hexFromArgb(scheme.shadow),
    '--md-sys-color-scrim': hexFromArgb(scheme.scrim),
    '--md-sys-color-surface-tint': hexFromArgb(scheme.surfaceTint),
  };
}

export {
  Hct,
  SchemeExpressive,
  SchemeTonalSpot,
  SchemeVibrant,
  argbFromHex,
  hexFromArgb,
  animate,
  spring,
  stagger
};
