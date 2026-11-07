import Link from "next/link";
import { apps } from "@/lib/apps";
import { latestChanges } from "@/lib/docs";

const CARD =
  "group flex flex-col gap-1.5 rounded-xl border border-line bg-panel p-4 transition-all";

export default function HomePage() {
  const [featured, ...rest] = apps;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">maxdelong.dev</h1>
        <p className="mt-1 max-w-xl text-sm text-muted">
          Tools, games and experiments, built for fun by one person.
        </p>
      </header>

      <Link
        href={`/${featured.slug}`}
        className="group relative overflow-hidden rounded-xl border border-line bg-[linear-gradient(115deg,#2f6b4c,#4f9460_55%,#d9a441)] p-5 text-white transition-shadow hover:shadow-lg"
      >
        <span className="rounded-full bg-black/25 px-2 py-0.5 text-[11px] font-medium">
          Featured {featured.kind.toLowerCase()}
        </span>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">{featured.name}</h2>
        <p className="mt-1 max-w-md text-sm text-white/90">{featured.description}</p>
        <p className="mt-3 text-sm font-medium">
          Play now <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
        </p>
        <span
          aria-hidden
          className="absolute -right-2 -bottom-4 text-[6.5rem] leading-none opacity-90 transition-transform group-hover:-rotate-3 max-sm:text-7xl"
        >
          {featured.icon}
        </span>
      </Link>

      <section aria-label="More apps" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((app) => {
          const body = (
            <>
              <span className="flex items-center justify-between">
                <span aria-hidden className="text-lg">
                  {app.icon}
                </span>
                <span className="rounded bg-hover px-1.5 py-px text-[11px] text-muted">
                  {app.status === "available" ? app.kind : "Coming soon"}
                </span>
              </span>
              <span className="text-sm font-semibold text-ink">{app.name}</span>
              <span className="text-[13px] leading-snug text-muted">{app.description}</span>
            </>
          );
          return app.status === "available" ? (
            <Link key={app.slug} href={`/${app.slug}`} className={`${CARD} hover:-translate-y-0.5 hover:border-accent`}>
              {body}
            </Link>
          ) : (
            <div key={app.slug} className={`${CARD} border-dashed opacity-75`}>
              {body}
            </div>
          );
        })}
        <Link href="/docs" className={`${CARD} hover:-translate-y-0.5 hover:border-accent`}>
          <span className="flex items-center justify-between">
            <span aria-hidden className="text-lg">
              📖
            </span>
            <span className="rounded bg-hover px-1.5 py-px text-[11px] text-muted">
              Reference
            </span>
          </span>
          <span className="text-sm font-semibold text-ink">Docs</span>
          <span className="text-[13px] leading-snug text-muted">
            Field guide, changelog, to-do list and future ideas.
          </span>
        </Link>
      </section>

      <section className="rounded-xl border border-line bg-panel p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">What&apos;s new</h2>
          <Link href="/docs/changelog" className="text-xs text-muted hover:text-ink">
            Changelog →
          </Link>
        </div>
        <ul className="mt-2 flex flex-col gap-1 text-[13px] text-muted">
          {latestChanges(3).map((change) => (
            <li key={change} className="flex items-center gap-2">
              <span aria-hidden className="size-1 rounded-full bg-accent" />
              {change}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
