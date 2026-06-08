/** Format milliseconds as m:ss.s (e.g. 18400 -> "0:18.4", 65200 -> "1:05.2"). */
export function formatTime(ms: number): string {
  const totalSec = Math.max(0, ms) / 1000;
  const m = Math.floor(totalSec / 60);
  const s = totalSec - m * 60;
  return `${m}:${s.toFixed(1).padStart(4, "0")}`;
}
