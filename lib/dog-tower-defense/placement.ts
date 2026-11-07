import { CANVAS_HEIGHT, CANVAS_WIDTH, PATH_WIDTH, POND, PORCH, distanceToPath } from "./paths";
import type { Dog, Point } from "./types";

export const DOG_RADIUS = 15;

/** Whether a dog can stand here: inside the yard, and clear of paths, the pond, the porch and other dogs. */
export function canPlaceAt(point: Point, dogs: Pick<Dog, "x" | "y">[]): boolean {
  const { x, y } = point;
  if (x < DOG_RADIUS || y < DOG_RADIUS) return false;
  if (x > CANVAS_WIDTH - DOG_RADIUS || y > CANVAS_HEIGHT - DOG_RADIUS) return false;

  if (distanceToPath(point) < PATH_WIDTH / 2 + DOG_RADIUS) return false;

  const pondX = (x - (POND.x + POND.width / 2)) / (POND.width / 2 + DOG_RADIUS);
  const pondY = (y - (POND.y + POND.height / 2)) / (POND.height / 2 + DOG_RADIUS);
  if (pondX * pondX + pondY * pondY < 1) return false;

  if (Math.hypot(x - PORCH.x, y - PORCH.y) < 24 + DOG_RADIUS) return false;

  return dogs.every((dog) => Math.hypot(dog.x - x, dog.y - y) >= DOG_RADIUS * 2);
}
