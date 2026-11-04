import Link from "next/link";
import type { AppEntry } from "@/lib/apps";

export function SidebarEntry({ app, onNavigate }: { app: AppEntry; onNavigate?: () => void }) {
  if (app.status === "available") {
    return (
      <Link
        href={`/${app.slug}`}
        onClick={onNavigate}
        className="block rounded px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
      >
        {app.name}
      </Link>
    );
  }

  return (
    <span
      aria-disabled="true"
      className="flex items-center justify-between rounded px-3 py-2 text-sm font-medium text-gray-400"
    >
      {app.name}
      <span className="text-xs font-normal">coming soon</span>
    </span>
  );
}
