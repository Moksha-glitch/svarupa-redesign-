"use client";

import { useState } from "react";
import { saveCheckinAction } from "@/app/actions";
import { EmotionSelector } from "@/components/svarupa/EmotionSelector";
import { ReflectionComposer } from "@/components/svarupa/ReflectionComposer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function HomeReflect({ greeting }: { greeting: string }) {
  const [voiceNote, setVoiceNote] = useState(false);

  return (
    <section>
      <h1 className="text-display">{greeting}</h1>
      <p className="mt-4 text-body-lg">Take a moment before you begin.</p>
      <div className="mt-8">
        <ReflectionComposer
          secondary={
            <Button type="button" variant="ghost" onClick={() => setVoiceNote((v) => !v)}>
              Speak instead
            </Button>
          }
        />
        {voiceNote ? (
          <p className="mt-3 text-body-sm">
            Voice is ready in the architecture. For now, writing is the quieter way.
          </p>
        ) : null}
      </div>
      <p className="mt-3 text-body-sm">You don't have to explain it perfectly.</p>
    </section>
  );
}

export function HomeCheckin() {
  const [emotion, setEmotion] = useState<string>();
  const [custom, setCustom] = useState("");
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  return (
    <section>
      <h2 className="text-h2">How are you arriving today?</h2>
      <div className="mt-5">
        <EmotionSelector value={emotion} onChange={setEmotion} custom={custom} onCustom={setCustom} />
      </div>
      <Button
        className="mt-5"
        variant="secondary"
        disabled={!emotion && !custom}
        onClick={async () => {
          await saveCheckinAction(emotion || "Custom", custom);
          setSaved(true);
          toast("Noted");
        }}
      >
        {saved ? "Noted" : "Keep this"}
      </Button>
    </section>
  );
}
