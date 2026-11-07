const MINUTES_PER_DAY = 24 * 60;

export interface Step {
  name: string;
  minutes: number;
}

export interface PlannedStep extends Step {
  /** Minutes after midnight when this step starts. */
  start: number;
  /** 0 for the arrival day, -1 for the day before, and so on. */
  dayOffset: number;
}

/** Reads a time input's value, like "07:30", as minutes after midnight. */
export function parseClock(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const minutes = Number(match[1]) * 60 + Number(match[2]);
  return minutes < MINUTES_PER_DAY ? minutes : null;
}

export function formatClock(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const period = hours < 12 ? "AM" : "PM";
  return `${hours % 12 || 12}:${String(minutes % 60).padStart(2, "0")} ${period}`;
}

/** Works out when each step starts, keeping the steps in the order they happen. */
export function planBackward(arrival: number, steps: Step[]): PlannedStep[] {
  let cursor = arrival;
  const planned: PlannedStep[] = [];
  for (let index = steps.length - 1; index >= 0; index--) {
    cursor -= steps[index].minutes;
    planned[index] = {
      ...steps[index],
      start: ((cursor % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY,
      dayOffset: Math.floor(cursor / MINUTES_PER_DAY),
    };
  }
  return planned;
}

export function dayLabel(dayOffset: number): string {
  if (dayOffset === 0) return "";
  return dayOffset === -1 ? "the day before" : `${-dayOffset} days before`;
}
