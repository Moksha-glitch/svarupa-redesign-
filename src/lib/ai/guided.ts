import { crisisMessage, detectCrisis } from "./crisis";
import type { AIProvider, AITurnInput, AITurnResult, SessionState } from "./types";

type Pattern = {
  id: string;
  test: (text: string) => boolean;
  themes: string[];
  emotion: string;
  trigger: string;
  concern: string;
  tension: string;
  chips: string[];
  listen: string;
  reflect: string;
  sitQuestion: string;
  verseHint: string;
};

const PATTERNS: Pattern[] = [
  {
    id: "wasting-life",
    test: (t) =>
      /wasting (my|your)? ?life|life is slipping|not living|no purpose|pointless/.test(t),
    themes: ["purpose"],
    emotion: "Fear",
    trigger: "A sense that time is passing without meaning",
    concern: "That this life is being spent on the wrong things",
    tension: "Expectation vs. personal direction",
    chips: [
      "I'm not progressing",
      "I'm not doing what I love",
      "I'm disappointing people",
      "I'm afraid time is running out",
      "I don't know",
    ],
    listen:
      "Before we try to answer that, let's understand what “wasting your life” means to you.",
    reflect:
      "That sentence often carries more than one feeling — grief for unused time, comparison with other people's pace, and a quiet fear that the right life is elsewhere. Naming which of those is loudest can change what we do next.",
    sitQuestion:
      "What would you pursue if you stopped measuring your life against someone else's timeline?",
    verseHint: "bhagavad-gita-2-47",
  },
  {
    id: "behind",
    test: (t) =>
      /everyone (else )?(is )?moving|falling behind|stuck while|left behind|not catching up/.test(
        t,
      ),
    themes: ["comparison", "purpose"],
    emotion: "Uncertainty",
    trigger: "Comparison with others",
    concern: "Fear of falling behind",
    tension: "Outer pace vs. inner readiness",
    chips: [
      "I'm afraid I'm falling behind",
      "I don't know what I actually want",
      "I know what I want but can't reach it",
      "I just feel lost",
    ],
    listen:
      "It sounds like this may be about more than progress itself. There may also be a feeling of comparison, or a fear that you're falling behind.",
    reflect:
      "When everyone else's movement becomes the measure, your own life can start to feel like delay rather than a path. The ache is real. The story that you are late may not be the only one available.",
    sitQuestion:
      "What are you trying to control that may not be yours to control?",
    verseHint: "bhagavad-gita-2-47",
  },
  {
    id: "control",
    test: (t) => /can'?t control|out of my hands|if only they|outcome|anxious about (the )?result/.test(t),
    themes: ["control", "attachment"],
    emotion: "Restlessness",
    trigger: "Uncertainty about results",
    concern: "That effort will not be enough to secure the outcome",
    tension: "Effort vs. outcome",
    chips: [
      "I need the result to go a certain way",
      "I can't stop rehearsing what might happen",
      "I feel responsible for things I don't actually hold",
      "I don't know how to let this be",
    ],
    listen:
      "It sounds as if a lot of energy is going toward something you cannot fully steer. That can be exhausting.",
    reflect:
      "Indian philosophical traditions often distinguish the quality of one's action from attachment to its fruit. That is not a command to stop caring. It is an invitation to notice where care has become gripping.",
    sitQuestion:
      "What are you trying to control that may not be yours to control?",
    verseHint: "bhagavad-gita-2-47",
  },
  {
    id: "comparison",
    test: (t) => /compar|better than|not enough|everyone else|they have|i should be/.test(t),
    themes: ["comparison"],
    emotion: "Inadequacy",
    trigger: "Measuring yourself against others",
    concern: "That your life will look small beside someone else's",
    tension: "Self-respect vs. borrowed standards",
    chips: [
      "I feel behind other people",
      "I can't tell what I actually want",
      "I know my path but doubt it",
      "I feel ashamed of where I am",
    ],
    listen:
      "Comparison has a way of making a whole life feel like a ranking. What you're describing sounds tender, not small.",
    reflect:
      "A recurring idea in these traditions is svadharma — the work and way of being that belongs to you, which cannot be copied from another person's timeline.",
    sitQuestion:
      "If no one were watching, what would still matter to you?",
    verseHint: "bhagavad-gita-6-5",
  },
  {
    id: "relationships",
    test: (t) => /partner|relationship|friend|family|lonely|alone|they don'?t|breakup|left me/.test(t),
    themes: ["relationships", "attachment"],
    emotion: "Loneliness",
    trigger: "Distance or friction with someone who matters",
    concern: "That closeness is unsafe, unavailable, or being lost",
    tension: "Longing vs. self-protection",
    chips: [
      "I feel unseen",
      "I'm afraid of losing them",
      "I'm angry and don't know how to say it",
      "I don't know what I need from this",
    ],
    listen:
      "It sounds as if this isn't only about the other person. Something in you is asking to be met.",
    reflect:
      "Attachment, in these texts, is not the same as love. Love can stay; gripping often hurts. We can look at what you're holding without asking you to become cold.",
    sitQuestion:
      "What are you hoping this person will give you that you have not yet given yourself?",
    verseHint: "yoga-sutras-1-33",
  },
  {
    id: "work",
    test: (t) => /work|job|career|boss|office|burnt out|burnout|ambition/.test(t),
    themes: ["work", "duty"],
    emotion: "Weariness",
    trigger: "Pressure around work and usefulness",
    concern: "That your worth is being measured by output",
    tension: "Duty vs. depletion",
    chips: [
      "I feel used by the work",
      "I'm afraid of falling behind at work",
      "The work no longer feels like mine",
      "I don't know how to rest without guilt",
    ],
    listen:
      "Work can become the place where a person proves they deserve to exist. That's a heavy assignment for a job.",
    reflect:
      "Karma yoga is not a productivity method. It is a way of acting without letting the result become the only meaning of the action — including the result of being seen as successful.",
    sitQuestion:
      "What would today's work look like if it did not have to prove your worth?",
    verseHint: "bhagavad-gita-2-48",
  },
  {
    id: "fear",
    test: (t) => /afraid|scared|fear|anxi|panic|worry|worried/.test(t),
    themes: ["fear"],
    emotion: "Fear",
    trigger: "Uncertainty that feels larger than the moment",
    concern: "That something essential will be lost or fail",
    tension: "Safety vs. aliveness",
    chips: [
      "I'm afraid of a specific outcome",
      "The fear is vague but constant",
      "I feel it in my body more than in thoughts",
      "I don't want to feel this anymore",
    ],
    listen:
      "Fear often arrives as a protector. We don't have to argue with it first. We can ask what it thinks it is saving.",
    reflect:
      "Many of these teachings do not ask you to become fearless overnight. They ask you to notice the mind's movement without immediately obeying it.",
    sitQuestion:
      "If this fear were trying to protect something precious, what would that be?",
    verseHint: "yoga-sutras-1-2",
  },
  {
    id: "anger",
    test: (t) => /angry|anger|furious|resent|rage|irritated/.test(t),
    themes: ["anger"],
    emotion: "Anger",
    trigger: "A boundary crossed, or a need unmet",
    concern: "That the anger will either explode or be swallowed",
    tension: "Dignity vs. harm",
    chips: [
      "Someone crossed a line",
      "I'm angry at myself",
      "I don't feel allowed to be angry",
      "The anger is covering something else",
    ],
    listen:
      "Anger is often a form of information. It may be pointing to a line that matters to you.",
    reflect:
      "We can take anger seriously without letting it become the only voice in the room. Underneath, there is often grief, or a wish to be regarded.",
    sitQuestion:
      "What is this anger asking you to protect?",
    verseHint: "yoga-sutras-1-33",
  },
  {
    id: "grief",
    test: (t) => /grief|grieving|loss|died|death|gone|miss them|mourning/.test(t),
    themes: ["grief", "attachment"],
    emotion: "Grief",
    trigger: "A loss that still occupies the room",
    concern: "That feeling this fully will unmake you",
    tension: "Remembering vs. continuing",
    chips: [
      "I don't want to move on",
      "I feel guilty when I feel okay",
      "The world expects me to be done",
      "I don't know who I am without this",
    ],
    listen:
      "Grief doesn't need to be solved. It needs room. I'm here to go slowly with you.",
    reflect:
      "Nothing here will rush you toward acceptance. Some teachings speak of change as the nature of things; that is not the same as saying your loss should be smaller.",
    sitQuestion:
      "What in this loss still wants to be spoken, even if only to yourself?",
    verseHint: "bhagavad-gita-2-14",
  },
  {
    id: "discipline",
    test: (t) => /disciplin|habit|inconsistent|can'?t stick|procrast|lazy|routine/.test(t),
    themes: ["discipline"],
    emotion: "Frustration",
    trigger: "A gap between intention and follow-through",
    concern: "That you cannot trust yourself",
    tension: "Aspiration vs. capacity",
    chips: [
      "I start and don't continue",
      "I'm harsh with myself when I slip",
      "I want a smaller, truer practice",
      "I don't know why I resist",
    ],
    listen:
      "A broken streak is not a broken person. It may simply mean the practice was designed for an imagined version of you.",
    reflect:
      "Tapas, in the yoga tradition, is not self-punishment. It is a steady heat. Steadiness usually begins smaller than pride would like.",
    sitQuestion:
      "What is the smallest practice you could return to without turning it into a verdict on your character?",
    verseHint: "yoga-sutras-2-1",
  },
];

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function matchPattern(text: string) {
  const t = normalize(text);
  return PATTERNS.find((p) => p.test(t));
}

function pickVerse(input: AITurnInput, hint?: string) {
  if (hint) {
    const hinted = input.retrieved.verses.find((v) => v.slug === hint);
    if (hinted) return hinted;
  }
  return input.retrieved.verses[0];
}

function tonePrefix(tone: string) {
  if (tone === "direct") return "";
  if (tone === "gentle") return "";
  return "";
}

function nextStage(state: SessionState): SessionState["stage"] {
  switch (state.stage) {
    case "listen":
      return "clarify";
    case "clarify":
      return "insight";
    case "insight":
      return "wisdom";
    case "wisdom":
      return "practice";
    default:
      return "close";
  }
}

export class GuidedProvider implements AIProvider {
  id = "guided";

  async complete(input: AITurnInput): Promise<AITurnResult> {
    const text = input.userMessage;
    if (detectCrisis(text)) {
      const crisis = crisisMessage();
      return {
        content: crisis.content,
        chips: crisis.chips,
        kind: "crisis",
        state: { ...input.state, crisis: true, stage: "listen", turn: input.state.turn + 1 },
      };
    }

    const pattern = matchPattern(text) ?? matchPattern(input.state.selectedChip || "");
    const state: SessionState = {
      ...input.state,
      turn: input.state.turn + 1,
    };

    if (input.state.stage === "listen" || input.state.turn === 0) {
      const chosen = pattern ?? {
        themes: input.userContext.recurringThemes.slice(0, 1).length
          ? input.userContext.recurringThemes.slice(0, 1)
          : ["purpose"],
        emotion: "Uncertainty",
        trigger: "Something unnamed that is taking up space",
        concern: "That this feeling will stay without being understood",
        tension: "Wanting clarity vs. not wanting to look directly",
        chips: [
          "I feel behind",
          "I feel overwhelmed",
          "I don't know what I want",
          "I'm tired of repeating this",
          "I don't know",
        ],
        listen:
          "You don't have to explain it perfectly. Let me stay with what you actually said, not what it should sound like.",
        reflect:
          "There is something here that wants naming. I may be wrong, so I will ask rather than assume.",
        sitQuestion: "What feels most true in this, even if it is unfinished?",
        verseHint: input.retrieved.verses[0]?.slug,
      };

      const chips = "chips" in chosen ? chosen.chips : [
        "I feel behind",
        "I feel overwhelmed",
        "I don't know what I want",
        "I'm tired of repeating this",
      ];

      state.stage = "clarify";
      state.themes = chosen.themes;
      state.emotion = chosen.emotion;
      state.trigger = chosen.trigger;
      state.concern = chosen.concern;
      state.tension = chosen.tension;
      state.sitQuestion = chosen.sitQuestion;
      state.lastQuestion = "Which feels closer?";

      const listen = "listen" in chosen ? chosen.listen : "I'm with you.";
      return {
        content: `${tonePrefix(input.tone)}${listen}\n\nWhich feels closer?`,
        chips,
        kind: "text",
        state,
      };
    }

    if (state.stage === "clarify") {
      state.selectedChip = text;
      state.stage = "insight";
      const theme = state.themes[0] ?? "purpose";
      const summary = `This may suggest a pattern around ${theme}, colored by ${state.emotion?.toLowerCase() ?? "unease"}. Not a conclusion — a working name for what keeps returning.`;
      return {
        content: `${pattern?.reflect ?? "Thank you. That helps locate where this sits."}\n\nI won't treat this as a diagnosis. It is simply what seems to be coming into view.`,
        kind: "insight",
        state,
        insight: {
          emotion: state.emotion,
          trigger: state.trigger,
          concern: state.concern,
          theme: theme[0]?.toUpperCase() + theme.slice(1),
          summary,
        },
      };
    }

    if (state.stage === "insight") {
      state.stage = "wisdom";
      const verse = pickVerse(input, pattern?.verseHint);
      state.verseSlug = verse?.slug;
      const concept = input.retrieved.concepts[0];
      const wisdomBody = verse
        ? `Indian philosophical traditions often distinguish between the quality of one's action and attachment to its outcome. That does not mean your feeling is invalid. It offers another way of looking.\n\nA verse that is often brought to this terrain:\n\n“${verse.translation}”\n\n${verse.citation}\nTranslation: ${verse.translator}\n\nThis is a translation, not the original. The original language and context remain available if you want to sit with them.`
        : concept
          ? `${concept.traditionalPerspective}\n\nA modern reading, offered as interpretation rather than decree:\n\n${concept.modernInterpretation}`
          : "There is a long conversation in these traditions about action, timing, and what belongs to you. We can open a text when you're ready — I will not invent a verse to make a point.";

      return {
        content: `A different way of looking at this.\n\n${wisdomBody}`,
        chips: ["Read the verse", "Understand the teaching", "Explore interpretations", "Sit with this"],
        kind: "wisdom",
        state,
        verseSlug: verse?.slug,
        sources: verse
          ? [{ label: "Original text + translation", citation: `${verse.citation} · ${verse.translator}` }]
          : undefined,
      };
    }

    if (state.stage === "wisdom") {
      const lowered = normalize(text);
      if (lowered.includes("sit")) {
        state.stage = "practice";
        return {
          content: `Sit with this.\n\n**${state.sitQuestion ?? "What feels most true right now?"}**\n\nYou don't need to answer yet. Let the question be in the room.`,
          chips: ["1 min", "3 min", "5 min", "10 min", "Write instead"],
          kind: "sit",
          state,
          sitQuestion: state.sitQuestion,
        };
      }
      state.stage = "practice";
      const practice = input.retrieved.practices[0];
      return {
        content: `If this understanding is going to live anywhere, it will be in something small.\n\n${
          practice
            ? `You might try **${practice.title}** — ${practice.description}`
            : "You might write a few sentences, or sit with one question for three minutes."
        }\n\nNothing here needs to become a streak.`,
        chips: ["Sit with this", "Write in the journal", "Try a short practice", "Come back later"],
        kind: "practice",
        state,
        sitQuestion: state.sitQuestion,
      };
    }

    state.stage = nextStage(state);
    return {
      content:
        "We can stay here, or we can stop. Understanding does not have to be finished to be useful.\n\nWhat would you like to do with this?",
      chips: ["Sit with this", "Write in the journal", "Continue", "That's enough for now"],
      kind: "text",
      state,
      sitQuestion: state.sitQuestion,
    };
  }

  async askText(input: {
    question: string;
    verse: AITurnInput["retrieved"]["verses"][number];
    commentaries: { tradition: string; kind: string; author?: string | null; body: string }[];
    tone: string;
  }) {
    if (detectCrisis(input.question)) {
      const crisis = crisisMessage();
      return { content: crisis.content, sources: [] };
    }

    const q = normalize(input.question);
    const traditional = input.commentaries.find((c) => c.kind === "traditional");
    const modern = input.commentaries.find((c) => c.kind === "modern");
    const parts: string[] = [];

    parts.push(
      `You asked this in the presence of **${input.verse.citation}**. I will stay with this verse and the commentaries attached to it, rather than inventing a line the text does not contain.`,
    );

    if (/why does|why did|krishna|mean in context|context/.test(q)) {
      parts.push(`**Context**\n${input.verse.context}`);
    }

    parts.push(
      `**Translation** (${input.verse.translator})\n“${input.verse.translation}”\n\nThis is a translation of the Sanskrit, not a substitute for it.`,
    );

    if (/advaita|vedanta/.test(q) || !traditional) {
      if (traditional) {
        parts.push(
          `**Traditional perspective**${traditional.author ? ` · ${traditional.author}` : ""} (${traditional.tradition})\n${traditional.body}`,
        );
      }
    } else if (traditional) {
      parts.push(
        `**Traditional perspective**${traditional.author ? ` · ${traditional.author}` : ""} (${traditional.tradition})\n${traditional.body}`,
      );
    }

    if (modern) {
      parts.push(
        `**Modern interpretation**${modern.author ? ` · ${modern.author}` : ""}\n${modern.body}`,
      );
    }

    if (/attachment|clinging|phala|fruit|outcome/.test(q)) {
      parts.push(
        "**In relation to attachment**\nThis teaching is often read as a discipline of relationship to results — not as indifference to harm, and not as a reason to abandon care. Attachment here names a gripping that makes the inner life swing with every success and failure.",
      );
    }

    parts.push(
      "**AI-generated reflection**\nI can help you think with this verse. I cannot add a new verse, a hidden meaning the commentators never held, or a medical claim. If a reading here feels strained, trust the source over me.",
    );

    const sources = [
      { label: "Original text", citation: input.verse.citation },
      { label: "Translation", citation: `${input.verse.translator} · ${input.verse.citation}` },
      ...input.commentaries.map((c) => ({
        label: c.kind === "traditional" ? "Traditional commentary" : "Modern interpretation",
        citation: `${c.tradition}${c.author ? ` · ${c.author}` : ""}${c.kind ? ` · ${c.kind}` : ""}`,
      })),
    ];

    return { content: parts.join("\n\n"), sources };
  }
}
