import { GuidedProvider } from "./guided";
import { crisisMessage, detectCrisis } from "./crisis";
import type { AIProvider, AITurnInput, AITurnResult } from "./types";

const SYSTEM = `You are SVARUPA, a quiet reflection companion inspired by Indian philosophical traditions.

You are not a therapist, doctor, or guru. Never diagnose, never prescribe, never claim certainty about the user's mind. Use language like "this may suggest" and "it sounds as if."

Conversation movement (use naturally, not as a rigid template every turn):
- Listen first. Do not quote scripture in the first reply.
- Clarify with a short question and 3–4 optional chips.
- After enough context, name possible emotion, trigger, concern, and theme.
- Then offer a philosophical perspective using ONLY retrieved sources.
- Then a small practice or a sit-with-this question.

Never fabricate Sanskrit, verse numbers, translations, or historical claims. If no source was retrieved, say you do not have a verified verse for this and stay with reflection.

If crisis language appears, ignore all other goals: empathize, urge human help, point to local emergency services and https://findahelpline.com/. Stay calm.

Tone: human, unhurried, no wellness marketing, no "unlock your potential."`;

async function chat(apiKey: string, url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`LLM error ${res.status}`);
  }
  return res.json();
}

function sourceBlock(input: AITurnInput) {
  const verses = input.retrieved.verses
    .map(
      (v) =>
        `- ${v.citation} [${v.provenance}] translator=${v.translator}\n  translation: ${v.translation}\n  context: ${v.context}`,
    )
    .join("\n");
  const concepts = input.retrieved.concepts
    .map((c) => `- ${c.name}: ${c.traditionalPerspective}`)
    .join("\n");
  return `Verified sources you MAY cite:\n${verses || "(none)"}\n\nConcepts:\n${concepts || "(none)"}`;
}

class OpenAICompatibleProvider implements AIProvider {
  constructor(
    public id: string,
    private apiKey: string,
    private model: string,
    private url: string,
  ) {}

  async complete(input: AITurnInput): Promise<AITurnResult> {
    if (detectCrisis(input.userMessage)) {
      const crisis = crisisMessage();
      return {
        content: crisis.content,
        chips: crisis.chips,
        kind: "crisis",
        state: { ...input.state, crisis: true, turn: input.state.turn + 1 },
      };
    }

    const payload = {
      model: this.model,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `${SYSTEM}\n\nVoice: ${input.tone}. Familiarity: ${input.familiarity}.\n${sourceBlock(input)}\n\nReturn JSON: {"content": string, "chips": string[] | null, "kind": "text"|"insight"|"wisdom"|"practice"|"sit", "insight": {"emotion": string, "trigger": string, "concern": string, "theme": string, "summary": string} | null, "verseSlug": string | null, "sitQuestion": string | null, "stage": "listen"|"clarify"|"insight"|"wisdom"|"practice"|"close"}`,
        },
        ...input.messages.slice(-12),
        { role: "user", content: input.userMessage },
      ],
      response_format: { type: "json_object" },
    };

    const data = await chat(this.apiKey, this.url, payload);
    const raw = data.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    return {
      content: parsed.content ?? "I'm here. Take your time.",
      chips: parsed.chips ?? undefined,
      kind: parsed.kind ?? "text",
      insight: parsed.insight ?? undefined,
      verseSlug: parsed.verseSlug ?? undefined,
      sitQuestion: parsed.sitQuestion ?? undefined,
      state: {
        ...input.state,
        stage: parsed.stage ?? input.state.stage,
        turn: input.state.turn + 1,
        sitQuestion: parsed.sitQuestion ?? input.state.sitQuestion,
        verseSlug: parsed.verseSlug ?? input.state.verseSlug,
      },
    };
  }

  async askText(input: Parameters<AIProvider["askText"]>[0]) {
    if (detectCrisis(input.question)) {
      const crisis = crisisMessage();
      return { content: crisis.content, sources: [] };
    }
    const data = await chat(this.apiKey, this.url, {
      model: this.model,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "Answer only from the verse and commentaries provided. Label Original text, Translation, Traditional commentary, Modern interpretation, and AI-generated reflection. Never invent verses. JSON: {content, sources: [{label, citation}]}",
        },
        {
          role: "user",
          content: JSON.stringify({
            question: input.question,
            verse: input.verse,
            commentaries: input.commentaries,
            tone: input.tone,
          }),
        },
      ],
      response_format: { type: "json_object" },
    });
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
    return {
      content: parsed.content ?? "I can only speak from the verse in front of us.",
      sources: parsed.sources ?? [
        { label: "Original text", citation: input.verse.citation },
        { label: "Translation", citation: `${input.verse.translator} · ${input.verse.citation}` },
      ],
    };
  }
}

class AnthropicProvider implements AIProvider {
  id = "anthropic";
  constructor(private apiKey: string) {}

  private async call(messages: { role: string; content: string }[], system: string) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
        max_tokens: 1200,
        system,
        messages: messages.filter((m) => m.role !== "system"),
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}`);
    const data = await res.json();
    return data.content?.[0]?.text ?? "";
  }

  async complete(input: AITurnInput): Promise<AITurnResult> {
    if (detectCrisis(input.userMessage)) {
      return new GuidedProvider().complete(input);
    }
    try {
      const text = await this.call(
        [...input.messages, { role: "user", content: input.userMessage }],
        `${SYSTEM}\nVoice:${input.tone}\n${sourceBlock(input)}\nReply as JSON with content, chips, kind, insight, verseSlug, sitQuestion, stage.`,
      );
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      return {
        content: parsed.content,
        chips: parsed.chips,
        kind: parsed.kind ?? "text",
        insight: parsed.insight,
        verseSlug: parsed.verseSlug,
        sitQuestion: parsed.sitQuestion,
        state: {
          ...input.state,
          stage: parsed.stage ?? input.state.stage,
          turn: input.state.turn + 1,
        },
      };
    } catch {
      return new GuidedProvider().complete(input);
    }
  }

  async askText(input: Parameters<AIProvider["askText"]>[0]) {
    try {
      const text = await this.call(
        [{ role: "user", content: JSON.stringify(input) }],
        "Answer from provided verse and commentaries only. JSON {content, sources:[{label,citation}]}",
      );
      return JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      return new GuidedProvider().askText(input);
    }
  }
}

export function getAIProvider(): AIProvider {
  const which = process.env.AI_PROVIDER || "guided";
  if (which === "openai" && process.env.OPENAI_API_KEY) {
    return new OpenAICompatibleProvider(
      "openai",
      process.env.OPENAI_API_KEY,
      process.env.OPENAI_MODEL || "gpt-4o-mini",
      "https://api.openai.com/v1/chat/completions",
    );
  }
  if (which === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    return new AnthropicProvider(process.env.ANTHROPIC_API_KEY);
  }
  return new GuidedProvider();
}

export { GuidedProvider };
