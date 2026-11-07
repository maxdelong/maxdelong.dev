export function PageHeader({
  title,
  description,
}: Readonly<{ title: string; description?: string }>) {
  return (
    <header className="mb-4">
      <h1 className="text-xl font-semibold tracking-tight text-ink">{title}</h1>
      {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
    </header>
  );
}
