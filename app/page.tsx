export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-bold tracking-tight">AfriMet</h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          Culturally-aware metabolic health platform for African and diaspora
          populations.
        </p>
        <p className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          Sprint 0 — Infrastructure foundation ready. Application features
          begin in Sprint 1.
        </p>
      </div>
    </main>
  );
}
