import { describe, it, expect } from 'vitest';
import { BUSINESS_TYPE_LABELS, THEME_COLORS, type BusinessType, type ThemeColor } from './business.model';

// If someone adds a new BusinessType/ThemeColor to the union but forgets to
// add its label/color entry, this fails loudly instead of showing "undefined"
// somewhere deep in the Wizard UI.

describe('BUSINESS_TYPE_LABELS', () => {
  const expectedTypes: BusinessType[] = [
    'moda', 'restaurante', 'padaria', 'sorvetes', 'farmacia', 'papelaria', 'eletronicos', 'outros',
  ];

  it('has a non-empty label for every business type', () => {
    for (const type of expectedTypes) {
      expect(BUSINESS_TYPE_LABELS[type], `missing label for "${type}"`).toBeTruthy();
    }
  });

  it('has no stray keys beyond the known business types', () => {
    expect(Object.keys(BUSINESS_TYPE_LABELS).sort()).toEqual([...expectedTypes].sort());
  });
});

describe('THEME_COLORS', () => {
  const expectedThemes: ThemeColor[] = ['azul', 'verde', 'preto', 'roxo', 'vermelho'];

  it('has valid hex primary/secondary colors for every theme', () => {
    for (const theme of expectedThemes) {
      expect(THEME_COLORS[theme].primary).toMatch(/^#[0-9a-f]{6}$/i);
      expect(THEME_COLORS[theme].secondary).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
