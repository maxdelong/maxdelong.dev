export function ComingSoonPlaceholder({ appName }: { appName: string }) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900">{appName}</h1>
      <p className="mt-4 text-gray-600">
        {appName} is coming soon — it isn&apos;t built yet.
      </p>
    </div>
  );
}
