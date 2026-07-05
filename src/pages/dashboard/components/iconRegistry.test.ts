import { describe, it, expect } from 'vitest';
import { getCategoryIcon, CATEGORY_ICONS, CATEGORY_ICON_NAMES, CATEGORY_COLORS } from './iconRegistry';

describe('getCategoryIcon', () => {
  it('returns the matching icon for a known name', () => {
    expect(getCategoryIcon('Shirt')).toBe(CATEGORY_ICONS.Shirt);
  });

  it('falls back to Tag for an unknown icon name', () => {
    expect(getCategoryIcon('NotARealIcon')).toBe(CATEGORY_ICONS.Tag);
  });

  it('falls back to Tag when no name is provided', () => {
    expect(getCategoryIcon(undefined)).toBe(CATEGORY_ICONS.Tag);
  });
});

describe('icon registry integrity', () => {
  it('every name in CATEGORY_ICON_NAMES resolves to a real icon component', () => {
    for (const name of CATEGORY_ICON_NAMES) {
      expect(CATEGORY_ICONS[name]).toBeDefined();
    }
  });

  it('has at least one color option', () => {
    expect(CATEGORY_COLORS.length).toBeGreaterThan(0);
  });
});
