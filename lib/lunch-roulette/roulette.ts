export const STARTER_PLACES = ["Tacos", "Burgers", "Sushi", "Sandwiches", "Leftovers"];

/** What each veto costs. The first is free, then these stack up until vetoes run out. */
export const VETO_PENALTIES: string[] = [
  "Order the first thing you see on the menu.",
  "You're buying the next coffee.",
  "No phone until the food is finished.",
  "Say something nice about the place you just rejected.",
  "Whoever you're eating with picks your drink.",
];

export const MAX_VETOES = VETO_PENALTIES.length + 1;

/** Picks a place. `previous` can't come up twice in a row unless it's the only one. */
export function pickPlace(places: string[], rng: () => number = Math.random, previous?: string): string {
  const options = places.filter((place) => place !== previous);
  const pool = options.length > 0 ? options : places;
  return pool[Math.floor(rng() * pool.length)];
}

/** Adds a place, ignoring blanks and anything already on the list. */
export function addPlace(places: string[], name: string): string[] {
  const trimmed = name.trim();
  const exists = places.some((place) => place.toLowerCase() === trimmed.toLowerCase());
  return trimmed && !exists ? [...places, trimmed] : places;
}

/** A veto only helps if vetoes remain and there's somewhere else to go. */
export function canVeto(vetoes: number, placeCount: number): boolean {
  return vetoes < MAX_VETOES && placeCount > 1;
}

export function penaltiesFor(vetoes: number): string[] {
  return VETO_PENALTIES.slice(0, Math.max(0, vetoes - 1));
}
