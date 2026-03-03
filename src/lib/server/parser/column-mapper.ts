export interface ColumnDef {
  dbField: string;
  aliases: string[];
  required: boolean;
}

export interface MapResult {
  mapped: Record<string, string>;   // dbField -> original header
  ignored: string[];                // headers sin match
  missing: string[];                // required fields sin match
  warnings: string[];               // optional fields sin match
}

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * Maps Excel headers to DB fields using exact match, then substring match,
 * then Levenshtein distance as fallback.
 */
export function mapColumns(
  headers: string[],
  columnDefs: ColumnDef[],
): MapResult {
  const mapped: Record<string, string> = {};
  const usedHeaders = new Set<number>();

  const normalizedHeaders = headers.map(normalize);

  // Pass 1: exact match on normalized text
  for (const def of columnDefs) {
    if (mapped[def.dbField]) continue;
    for (const alias of def.aliases) {
      const normAlias = normalize(alias);
      const idx = normalizedHeaders.findIndex(
        (h, i) => !usedHeaders.has(i) && h === normAlias,
      );
      if (idx !== -1) {
        mapped[def.dbField] = headers[idx];
        usedHeaders.add(idx);
        break;
      }
    }
  }

  // Pass 2: substring/contains match
  for (const def of columnDefs) {
    if (mapped[def.dbField]) continue;
    for (const alias of def.aliases) {
      const normAlias = normalize(alias);
      const idx = normalizedHeaders.findIndex(
        (h, i) => !usedHeaders.has(i) && (h.includes(normAlias) || normAlias.includes(h)),
      );
      if (idx !== -1) {
        mapped[def.dbField] = headers[idx];
        usedHeaders.add(idx);
        break;
      }
    }
  }

  // Pass 3: Levenshtein fallback (threshold based on string length)
  for (const def of columnDefs) {
    if (mapped[def.dbField]) continue;
    let bestIdx = -1;
    let bestDist = Infinity;
    for (const alias of def.aliases) {
      const normAlias = normalize(alias);
      const threshold = Math.max(3, Math.floor(normAlias.length * 0.35));
      for (let i = 0; i < normalizedHeaders.length; i++) {
        if (usedHeaders.has(i)) continue;
        const dist = levenshtein(normalizedHeaders[i], normAlias);
        if (dist < bestDist && dist <= threshold) {
          bestDist = dist;
          bestIdx = i;
        }
      }
    }
    if (bestIdx !== -1) {
      mapped[def.dbField] = headers[bestIdx];
      usedHeaders.add(bestIdx);
    }
  }

  const ignored = headers.filter((_, i) => !usedHeaders.has(i));

  const missing = columnDefs
    .filter((d) => d.required && !mapped[d.dbField])
    .map((d) => d.dbField);

  const warnings = columnDefs
    .filter((d) => !d.required && !mapped[d.dbField])
    .map((d) => `Columna opcional no encontrada: ${d.dbField}`);

  return { mapped, ignored, missing, warnings };
}

/**
 * Fuzzy match a sheet name against a list of known patterns.
 */
export function sheetNameMatches(sheetName: string, patterns: string[]): boolean {
  const norm = normalize(sheetName);
  return patterns.some((p) => norm.includes(normalize(p)));
}
