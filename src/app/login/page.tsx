import { SvarupaLogo } from "@/components/svarupa/SvarupaLogo";
import { LoginForm } from "@/components/svarupa/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="paper-grain mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <SvarupaLogo />
      <h1 className="mt-12 text-h1">Enter quietly.</h1>
      <p className="mt-3 text-muted">You don't have to have everything figured out.</p>
      {params.error === "google" ? (
        <p className="mt-4 text-sm text-terracotta" role="alert">
          Google sign-in wasn't available. You can use email, or the sample journey.
        </p>
      ) : null}
      <div className="mt-8">
        <LoginForm next={params.next} />
      </div>
    </main>
  );
}
