export default function NotFoundPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10 items-center justify-center mb-20">
      <div className="flex flex-col items-center justify-center mb-6 text-xl font-medium font-mono uppercase text-primary">
        404
      </div>
      <h1 className="text-4xl font-medium font-mono uppercase text-primary text-center mb-6">
        Page not found
      </h1>
      <pre className="mt-6 whitespace-pre font-mono text-3xl leading-5 text-primary text-center">
        {"/ᐠ  > ˕ < マ"}
      </pre>
    </main>
  );
}
