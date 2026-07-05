/**
 * Conversão de nomes de campos entre o TypeScript (camelCase, usado em
 * todos os modelos e componentes) e as colunas do Postgres/Supabase
 * (snake_case, convenção padrão do Postgres).
 *
 * A conversão é feita apenas no primeiro nível de cada objeto — campos
 * JSON aninhados (ex.: `nutritionalInfo`) são guardados tal como estão
 * numa coluna jsonb, já que o Postgres não impõe convenção aos conteúdos
 * de um jsonb.
 */

export function camelToSnake(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function snakeToCamel(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_match, letter: string) => letter.toUpperCase());
}

/** Converte um objeto camelCase (modelo TS) numa linha snake_case (Supabase). */
export function toRow<T extends Record<string, any>>(obj: T): Record<string, any> {
  const row: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue; // omitido: deixa o Postgres aplicar o default/manter o valor atual
    row[camelToSnake(key)] = value;
  }
  return row;
}

/** Converte uma linha snake_case (Supabase) num objeto camelCase (modelo TS). */
export function fromRow<T = Record<string, any>>(row: Record<string, any> | null | undefined): T | null {
  if (!row) return null;
  const obj: Record<string, any> = {};
  for (const [key, value] of Object.entries(row)) {
    obj[snakeToCamel(key)] = value;
  }
  return obj as T;
}

export function fromRows<T = Record<string, any>>(rows: Record<string, any>[] | null | undefined): T[] {
  return (rows ?? []).map((row) => fromRow<T>(row)!);
}
