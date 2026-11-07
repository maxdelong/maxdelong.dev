"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { apps } from "@/lib/apps";
import { SidebarEntry } from "./SidebarEntry";

function Logo() {
  return (
    <span
      aria-hidden
      className="flex size-6 items-center justify-center rounded-md bg-accent text-[11px] font-bold tracking-tight text-on-accent"
    >
      md
    </span>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-line bg-panel/90 px-4 backdrop-blur md:hidden">
        <Link href="/" onClick={close} className="flex items-center gap-2 text-sm font-semibold">
          <Logo />
          maxdelong.dev
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="sidebar-nav"
          className="rounded-md border border-line px-2.5 py-1 text-xs font-medium hover:bg-hover"
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <aside
        id="sidebar-nav"
        className={`fixed inset-x-0 top-12 z-10 border-b border-line bg-panel p-3 shadow-lg md:sticky md:top-0 md:flex md:h-screen md:w-52 md:shrink-0 md:flex-col md:border-r md:border-b-0 md:shadow-none ${
          open ? "flex flex-col" : "hidden"
        }`}
      >
        <Link
          href="/"
          onClick={close}
          className="mb-4 hidden items-center gap-2 px-2 pt-1 text-sm font-semibold md:flex"
        >
          <Logo />
          maxdelong.dev
        </Link>

        <nav aria-label="Main" className="flex flex-col gap-0.5">
          <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted">
            Apps
          </div>
          {apps.map((app) => (
            <SidebarEntry
              key={app.slug}
              app={app}
              active={isActive(`/${app.slug}`)}
              onNavigate={close}
            />
          ))}

          <div className="px-2 pt-4 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted">
            Site
          </div>
          <Link
            href="/docs"
            onClick={close}
            aria-current={isActive("/docs") ? "page" : undefined}
            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors ${
              isActive("/docs") ? "bg-accent-soft text-accent" : "text-ink hover:bg-hover"
            }`}
          >
            <span aria-hidden className="w-4 text-center text-sm">
              📖
            </span>
            Docs
          </Link>
        </nav>

        <a
          href="https://github.com/maxdelong/maxdelong.dev"
          className="mt-4 px-2 text-xs text-muted hover:text-ink md:mt-auto md:pb-1"
        >
          Source on GitHub ↗
        </a>
      </aside>
    </>
  );
}
