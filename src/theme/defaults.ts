import type { ThemeDefaults } from '@/core';

/** The template's own accent and surfaces; the store's branding overrides the accent. */
export const themeDefaults: ThemeDefaults = {
  brand: '#E5601A',
  brand2: '#2A2C2F',
  surface: '#E6E5E0',
  // Raised cards are the least favorable reading surface in dark mode.
  darkSurface: '#30343A',
  displayFont: '"Schibsted Grotesk", "Noto Sans", -apple-system, "Segoe UI", Roboto, sans-serif',
  bundledFonts: ['Schibsted Grotesk'],
  displayFallback: '-apple-system, "Segoe UI", Roboto, sans-serif',
};
