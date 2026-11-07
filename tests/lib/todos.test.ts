import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { apps } from "@/lib/apps";

describe("app to-do lists", () => {
  const available = apps.filter((app) => app.status === "available");

  it("every available app keeps a to-do list next to its code", () => {
    for (const app of available) {
      expect(existsSync(`lib/${app.slug}/todos.ts`), app.slug).toBe(true);
      expect(app.todos.length, app.slug).toBeGreaterThan(0);
    }
  });

  it("has no duplicate cards within an app", () => {
    for (const app of apps) {
      const titles = app.todos.map((todo) => todo.title);
      expect(new Set(titles).size, app.slug).toBe(titles.length);
    }
  });
});
