import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SidebarEntry } from "@/components/sidebar/SidebarEntry";
import type { AppEntry } from "@/lib/apps";

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
    const app: AppEntry = {
      slug: "dog-tower-defense",
      name: "Dog Tower Defense",
      status: "available",
    };

    render(<SidebarEntry app={app} />);

    const link = screen.getByRole("link", { name: "Dog Tower Defense" });
    expect(link).toHaveAttribute("href", "/dog-tower-defense");
  });

  it("renders a coming-soon app as non-clickable", () => {
    const app: AppEntry = {
      slug: "dota-tracker",
      name: "Dota Tracker",
      status: "coming-soon",
    };

    render(<SidebarEntry app={app} />);

    expect(screen.queryByRole("link", { name: "Dota Tracker" })).toBeNull();
    expect(screen.getByText("Dota Tracker")).toHaveAttribute(
      "aria-disabled",
      "true"
    );
    expect(screen.getByText("coming soon")).toBeInTheDocument();
  });
});

describe("registry extensibility", () => {
  it("adding a new entry does not change how existing entries render", () => {
    const before: AppEntry[] = [
      { slug: "dota-tracker", name: "Dota Tracker", status: "coming-soon" },
      { slug: "spotify-tracker", name: "Spotify Tracker", status: "coming-soon" },
    ];
    const { unmount } = renderRegistry(before);
    const beforeDota = screen.getByText("Dota Tracker").outerHTML;
    const beforeSpotify = screen.getByText("Spotify Tracker").outerHTML;
    unmount();

    const after: AppEntry[] = [
      ...before,
      { slug: "dog-tower-defense", name: "Dog Tower Defense", status: "available" },
    ];
    renderRegistry(after);

    expect(screen.getByText("Dota Tracker").outerHTML).toBe(beforeDota);
    expect(screen.getByText("Spotify Tracker").outerHTML).toBe(beforeSpotify);
    expect(
      screen.getByRole("link", { name: "Dog Tower Defense" })
    ).toHaveAttribute("href", "/dog-tower-defense");
  });
});
