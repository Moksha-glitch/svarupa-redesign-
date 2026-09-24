import { SvarupaLogo } from "@/components/svarupa/SvarupaLogo";
import { SignupForm } from "@/components/svarupa/SignupForm";

export default function SignupPage() {
  return (
    <main className="paper-grain mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <SvarupaLogo />
      <h1 className="mt-12 text-h1">Begin your journey</h1>
      <p className="mt-3 text-muted">A private space. Nothing here is a feed.</p>
      <div className="mt-8">
        <SignupForm />
      </div>
    </main>
  );
}
