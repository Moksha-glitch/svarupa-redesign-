"use client";

import { useState } from "react";
import { completeOnboardingAction, saveCheckinAction } from "@/app/actions";
import { AI_TONES, EXPLORE_TOPICS, FAMILIARITY, ONBOARDING_REASONS } from "@/lib/constants";
import { EmotionSelector } from "@/components/svarupa/EmotionSelector";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LAST_STEP = 5;

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [emotion, setEmotion] = useState<string>();
  const [custom, setCustom] = useState("");
  const [reasons, setReasons] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [familiarity, setFamiliarity] = useState("new");
  const [tone, setTone] = useState("balanced");
  const [pending, setPending] = useState(false);

  function toggle(list: string[], value: string, set: (v: string[]) => void) {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  async function finish() {
    setPending(true);
    if (emotion || custom.trim()) {
      await saveCheckinAction(emotion || "Custom", custom.trim() || undefined);
    }
    await completeOnboardingAction({ reasons, topics, familiarity, tone });
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      {step > 0 ? (
        <p className="text-caption mb-6">
          {step} of {LAST_STEP}
        </p>
      ) : null}

      {step === 0 ? (
        <div className="animate-fade-up">
          <p className="text-caption">Welcome to SVARUPA.</p>
          <h1 className="mt-6 text-h1">You don't have to have everything figured out.</h1>
          <p className="mt-4 text-body-lg">A few quiet questions, then you can begin.</p>
          <Button className="mt-10" onClick={() => setStep(1)}>
            Begin
          </Button>
        </div>
      ) : null}

      {step === 1 ? (
        <Step
          title="How are you arriving?"
          body="Nothing here is a diagnosis. Name what is present."
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
          nextLabel="Continue"
        >
          <EmotionSelector value={emotion} onChange={setEmotion} custom={custom} onCustom={setCustom} />
        </Step>
      ) : null}

      {step === 2 ? (
        <Step
          title="What feels most true right now?"
          body="You can choose more than one."
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
          nextDisabled={!reasons.length}
        >
          <div className="flex flex-col gap-2">
            {ONBOARDING_REASONS.map((r) => (
              <Choice
                key={r.id}
                pressed={reasons.includes(r.id)}
                onClick={() => toggle(reasons, r.id, setReasons)}
              >
                {r.label}
              </Choice>
            ))}
          </div>
        </Step>
      ) : null}

      {step === 3 ? (
        <Step
          title="What keeps returning?"
          body="These are places we can begin. Not a list of problems."
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
          nextDisabled={!topics.length}
        >
          <div className="flex flex-wrap gap-2">
            {EXPLORE_TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={topics.includes(t.id)}
                onClick={() => toggle(topics, t.id, setTopics)}
                className={cn(
                  "min-h-11 rounded-full border px-4 py-2 text-sm",
                  topics.includes(t.id)
                    ? "border-charcoal bg-charcoal font-medium text-ivory"
                    : "border-border",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Step>
      ) : null}

      {step === 4 ? (
        <Step
          title="How should the texts meet you?"
          body="Different traditions will stay distinct. This only sets the pace."
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
        >
          <div className="space-y-3">
            {FAMILIARITY.map((f) => (
              <Choice
                key={f.id}
                pressed={familiarity === f.id}
                onClick={() => setFamiliarity(f.id)}
              >
                <p className="font-medium">{f.label}</p>
                <p className="mt-1 text-body-sm">{f.body}</p>
              </Choice>
            ))}
          </div>
        </Step>
      ) : null}

      {step === 5 ? (
        <Step
          title="How should SVARUPA speak with you?"
          body="You can change this later."
          onBack={() => setStep(4)}
          onNext={() => void finish()}
          nextLabel={pending ? "Entering…" : "Enter SVARUPA"}
          nextDisabled={pending}
        >
          <div className="space-y-3">
            {AI_TONES.map((t) => (
              <Choice key={t.id} pressed={tone === t.id} onClick={() => setTone(t.id)}>
                <p className="font-medium">{t.label}</p>
                <p className="mt-1 text-body-sm">{t.body}</p>
              </Choice>
            ))}
          </div>
        </Step>
      ) : null}
    </div>
  );
}

function Step({
  title,
  body,
  children,
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="animate-fade-up">
      <h1 className="text-h1">{title}</h1>
      <p className="mt-3 text-body">{body}</p>
      <div className="mt-8">{children}</div>
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
        </Button>
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}

function Choice({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "min-h-12 w-full rounded-2xl border px-4 py-3 text-left",
        pressed ? "border-charcoal bg-stone font-medium" : "border-border bg-surface",
      )}
    >
      {children}
    </button>
  );
}
