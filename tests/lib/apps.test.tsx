import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SidebarEntry } from "@/components/sidebar/SidebarEntry";
import type { AppEntry } from "@/lib/apps";

const available: AppEntry = {
  slug: "dog-tower-defense",
  name: "Dog Tower Defense",
  status: "available",
  icon: "🐕",
  description: "A game.",
  kind: "Game",
  todos: [],
};

const comingSoon: AppEntry = {
  slug: "spotify-tracker",
  name: "Spotify Tracker",
  status: "coming-soon",
  icon: "🎧",
  description: "Not built yet.",
  kind: "Tool",
  todos: [],
};

function renderRegistry(registry: AppEntry[]) {
  return render(
    <>
      {registry.map((app) => (
        <SidebarEntry key={app.slug} app={app} />
      ))}
    </>
  );
}

describe("SidebarEntry rendering by registry status", () => {
  it("renders an available app as a clickable link", () => {
    render(<SidebarEntry app={available} />);

    const link = screen.getByRole("link", { name: /Dog Tower Defense/ });
    expect(link).toHaveAttribute("href", "/dog-tower-defense");
  });

  it("marks the current app as the active page", () => {
    render(<SidebarEntry app={available} active />);

    expect(screen.getByRole("link")).toHaveAttribute("aria-current", "page");
  });

  it("renders a coming-soon app as non-clickable", () => {
    render(<SidebarEntry app={comingSoon} />);

    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("Spotify Tracker")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByText("soon")).toBeInTheDocument();
  });
});

describe("registry extensibility", () => {
  it("adding a new entry does not change how existing entries render", () => {
    const { unmount } = renderRegistry([comingSoon]);
    const before = screen.getByText("Spotify Tracker").outerHTML;
    unmount();

    renderRegistry([comingSoon, available]);

    expect(screen.getByText("Spotify Tracker").outerHTML).toBe(before);
    expect(screen.getByRole("link", { name: /Dog Tower Defense/ })).toHaveAttribute(
      "href",
      "/dog-tower-defense"
    );
  });
});
