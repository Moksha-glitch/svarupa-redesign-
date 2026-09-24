import { SvarupaLogo } from "@/components/svarupa/SvarupaLogo";
import { OnboardingFlow } from "@/components/svarupa/OnboardingFlow";

export default function OnboardingPage() {
  return (
    <main className="paper-grain min-h-dvh">
      <div className="px-6 pt-8">
        <SvarupaLogo href="/onboarding" />
      </div>
      <OnboardingFlow />
    </main>
  );
}
