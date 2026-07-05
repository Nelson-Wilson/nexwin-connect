import { describe, it, expect } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('lowercases and joins words with hyphens', () => {
    expect(slugify('Loja da Bianca')).toBe('loja-da-bianca');
  });

  it('strips accents (Portuguese names)', () => {
    expect(slugify('Padaria São João')).toBe('padaria-sao-joao');
    expect(slugify('Açaí & Cia')).toBe('acai-cia');
  });

  it('removes special characters', () => {
    expect(slugify('Loja 100% Natural!')).toBe('loja-100-natural');
  });

  it('collapses multiple spaces/hyphens into one', () => {
    expect(slugify('Loja   da    Bianca')).toBe('loja-da-bianca');
    expect(slugify('Loja--da--Bianca')).toBe('loja-da-bianca');
  });

  it('trims leading/trailing hyphens', () => {
    expect(slugify('  -Loja da Bianca- ')).toBe('loja-da-bianca');
  });

  it('returns an empty string for input with no valid characters', () => {
    expect(slugify('%%%')).toBe('');
  });

  it('preserves numbers', () => {
    expect(slugify('Loja 2000')).toBe('loja-2000');
  });
});
