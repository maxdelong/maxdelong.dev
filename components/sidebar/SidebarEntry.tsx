import Link from "next/link";
import type { AppEntry } from "@/lib/apps";

const ROW = "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] font-medium";

export function SidebarEntry({
  app,
  active = false,
  onNavigate,
}: Readonly<{
  app: AppEntry;
  active?: boolean;
  onNavigate?: () => void;
}>) {
  if (app.status === "available") {
    return (
      <Link
        href={`/${app.slug}`}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`${ROW} transition-colors ${
          active ? "bg-accent-soft text-accent" : "text-ink hover:bg-hover"
        }`}
      >
        <span aria-hidden className="w-4 text-center text-sm">
          {app.icon}
        </span>
        {app.name}
      </Link>
    );
  }

  return (
    <span aria-disabled="true" className={`${ROW} text-muted`}>
      <span aria-hidden className="w-4 text-center text-sm opacity-60">
        {app.icon}
      </span>
      {app.name}
      <span className="ml-auto rounded bg-hover px-1 py-px text-[10px] font-normal">soon</span>
    </span>
  );
}
