"use client";

import Link from "next/link";
import { useState } from "react";
import { apps } from "@/lib/apps";
import { SidebarEntry } from "./SidebarEntry";

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="sidebar-nav"
        className="fixed top-4 left-4 z-20 rounded border border-gray-300 bg-white px-3 py-2 text-sm font-medium md:hidden"
      >
        {open ? "Close" : "Menu"}
      </button>

      <aside
        id="sidebar-nav"
        className={`fixed inset-y-0 left-0 z-10 w-56 border-r border-gray-200 bg-white p-4 pt-16 md:static md:block md:pt-4 ${
          open ? "block" : "hidden"
        }`}
      >
        <Link href="/" className="mb-4 block text-lg font-semibold text-gray-900">
          maxdelong.dev
        </Link>
        <nav className="flex flex-col gap-1">
          {apps.map((app) => (
            <SidebarEntry key={app.slug} app={app} />
          ))}
        </nav>
      </aside>
    </>
  );
}
