/** Random helpers (from recognaizelite src/utils/random). */
export function randomNumbersArr(length: number, max: number, min = 0): number[] {
  const nums: number[] = [];
  for (let i = min; i <= max; i++) nums.push(i);
  nums.sort(() => 0.5 - Math.random());
  return nums.slice(0, length);
}
