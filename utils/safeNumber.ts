// utils/safeNumber.ts
export function safeNumber(val: any, fallback = 0): number {
  const n = Number(val);
  return isNaN(n) || !isFinite(n) ? fallback : n;
}
