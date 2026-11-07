import Link from "next/link";

export function ComingSoonPlaceholder({
  appName,
  icon,
}: Readonly<{ appName: string; icon: string }>) {
  return (
    <div className="flex max-w-md flex-col items-start gap-2 rounded-xl border border-dashed border-line bg-panel p-6">
      <span aria-hidden className="text-2xl">
        {icon}
      </span>
      <h1 className="text-lg font-semibold tracking-tight text-ink">{appName}</h1>
      <p className="text-sm text-muted">
        {appName} is coming soon. It isn&apos;t built yet.
      </p>
      <Link href="/docs/ideas" className="text-sm font-medium text-accent hover:underline">
        See what else might get built →
      </Link>
    </div>
  );
}
