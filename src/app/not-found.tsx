import Link from "next/link";

export default function NotFound() {
  return (
    <main className="paper-grain mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6">
      <p className="text-xs tracking-[0.2em] text-copper uppercase">SVARUPA</p>
      <h1 className="mt-4 text-h1">This page isn't here.</h1>
      <p className="mt-3 text-muted">You can return to a quieter place.</p>
      <Link href="/" className="mt-8 text-charcoal-soft underline-offset-4 hover:underline">
        Look within
      </Link>
    </main>
  );
}
