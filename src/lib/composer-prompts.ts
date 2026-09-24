export type ComposerCue = {
  id: string;
  words: string[];
  questions: string[];
};

export const COMPOSER_CUES: ComposerCue[] = [
  {
    id: "fear",
    words: ["afraid", "scared", "fear", "fearful", "anxious", "anxiety", "panic", "worry", "worried", "nervous"],
    questions: [
      "What is this fear trying to protect?",
      "What would feel even a little safer right now?",
      "If the worst did not happen, what would still be true?",
    ],
  },
  {
    id: "anger",
    words: ["angry", "anger", "furious", "resent", "resentful", "rage", "irritated", "frustrated"],
    questions: [
      "What is this anger asking you to protect?",
      "Where was a line crossed?",
      "If the anger quieted for a moment, what would be underneath?",
    ],
  },
  {
    id: "heavy",
    words: ["heavy", "weighed", "burden", "burdened", "weight"],
    questions: [
      "What are you carrying that may not all be yours?",
      "What would it mean to set one thing down?",
      "When did this heaviness first arrive?",
    ],
  },
  {
    id: "restless",
    words: ["restless", "restlessness", "agitated", "uneasy", "fidgety"],
    questions: [
      "What is the restlessness reaching for?",
      "If you sat still for one minute, what would you notice?",
      "Is this movement, or is it escape?",
    ],
  },
  {
    id: "lost",
    words: ["lost", "directionless", "confused", "adrift", "unsure"],
    questions: [
      "What used to feel like a path?",
      "If you did not have to know the whole way, what is the next honest step?",
      "Who are you measuring yourself against?",
    ],
  },
  {
    id: "overwhelmed",
    words: ["overwhelmed", "overwhelm", "swamped", "drowning"],
    questions: [
      "What is one thing that does not need to be solved today?",
      "Where does the overwhelm live in your body?",
      "What would 'enough for now' look like?",
    ],
  },
  {
    id: "lonely",
    words: ["lonely", "loneliness", "alone", "unseen", "isolated"],
    questions: [
      "What kind of closeness are you actually hungry for?",
      "When did you last feel met?",
      "What are you hoping someone else will notice?",
    ],
  },
  {
    id: "sad",
    words: ["sad", "sadness", "unhappy", "heartbroken"],
    questions: [
      "What does this sadness want you to know?",
      "Is there something here that has not been mourned yet?",
      "What would kindness toward this feeling look like?",
    ],
  },
  {
    id: "grief",
    words: ["grief", "grieving", "loss", "lost someone", "died", "death", "mourning", "miss"],
    questions: [
      "What in this loss still wants to be spoken?",
      "What are you not ready to put down?",
      "What would it mean to feel this without rushing toward acceptance?",
    ],
  },
  {
    id: "shame",
    words: ["shame", "ashamed", "embarrassed", "humiliated", "worthless"],
    questions: [
      "Whose eyes are you seeing yourself through?",
      "What would you say to a friend in this exact place?",
      "What part of you is asking not to be discarded?",
    ],
  },
  {
    id: "guilt",
    words: ["guilt", "guilty", "regret", "sorry", "blame"],
    questions: [
      "Is this guilt asking for repair, or for punishment?",
      "What would making amends look like, if it were possible?",
      "What are you holding that may belong to more than you?",
    ],
  },
  {
    id: "comparison",
    words: ["compare", "comparing", "comparison", "behind", "jealous", "jealousy", "envy", "inadequate"],
    questions: [
      "If no one were watching, what would still matter to you?",
      "Whose timeline are you living on?",
      "What would 'enough' look like if it were yours, not theirs?",
    ],
  },
  {
    id: "control",
    words: ["control", "outcome", "result", "uncertain", "uncertainty"],
    questions: [
      "What are you trying to control that may not be yours to control?",
      "Where has care become gripping?",
      "What would acting well look like without knowing the ending?",
    ],
  },
  {
    id: "purpose",
    words: ["purpose", "pointless", "meaning", "wasting", "direction", "aimless"],
    questions: [
      "What would you pursue if you stopped measuring your life against someone else's?",
      "When do you feel most like yourself?",
      "What is the smallest thing that still feels true?",
    ],
  },
  {
    id: "work",
    words: ["work", "job", "career", "boss", "office", "burnout", "burnt"],
    questions: [
      "What would today's work look like if it did not have to prove your worth?",
      "Where has duty become depletion?",
      "What part of this work still feels like yours?",
    ],
  },
  {
    id: "attachment",
    words: ["attached", "attachment", "cling", "clinging", "letting go", "release"],
    questions: [
      "What are you holding that is holding you back?",
      "Is this love, or is this gripping?",
      "What would remain if the outcome changed?",
    ],
  },
  {
    id: "relationships",
    words: ["partner", "relationship", "friend", "family", "breakup"],
    questions: [
      "What are you hoping this person will give you that you have not yet given yourself?",
      "What do you need that has not been said?",
      "Where do you feel unseen?",
    ],
  },
  {
    id: "discipline",
    words: ["discipline", "habit", "inconsistent", "procrastinate", "lazy", "routine", "streak"],
    questions: [
      "What is the smallest practice you could return to without making it a verdict?",
      "Who is the practice designed for — you, or an imagined version of you?",
      "What happens in you the moment you slip?",
    ],
  },
  {
    id: "calm",
    words: ["calm", "peaceful", "still", "quiet", "settled"],
    questions: [
      "What made room for this calm?",
      "What would you like to remember from this quiet?",
      "How can you stay near this without forcing it to last?",
    ],
  },
  {
    id: "grateful",
    words: ["grateful", "gratitude", "thankful"],
    questions: [
      "What was given, that you did not have to earn?",
      "Who or what are you quietly indebted to?",
      "What would you like to keep close from today?",
    ],
  },
  {
    id: "hopeful",
    words: ["hopeful", "hope", "optimistic"],
    questions: [
      "What is this hope pointing toward?",
      "What would you do if this hope were allowed to stay?",
      "What small evidence is it standing on?",
    ],
  },
  {
    id: "curious",
    words: ["curious", "wonder", "wondering"],
    questions: [
      "What are you actually trying to understand?",
      "What would you look at more closely if there were no hurry?",
      "Which question feels most alive?",
    ],
  },
  {
    id: "stuck",
    words: ["stuck", "stalled", "frozen", "paralyzed"],
    questions: [
      "What would movement look like if it did not have to be a leap?",
      "What are you waiting to feel before you begin?",
      "If this stuckness could speak, what would it say?",
    ],
  },
  {
    id: "tired",
    words: ["tired", "exhausted", "fatigue", "drained", "weary"],
    questions: [
      "What has been asking too much of you?",
      "What kind of rest would actually restore you?",
      "Where have you been proving you can keep going?",
    ],
  },
  {
    id: "numb",
    words: ["numb", "empty", "blank", "disconnected"],
    questions: [
      "When did the feeling first go quiet?",
      "What might the numbness be protecting you from?",
      "Is there one small sensation you can still name?",
    ],
  },
  {
    id: "stress",
    words: ["stress", "stressed", "pressure", "tense", "tension"],
    questions: [
      "What deadline or demand is living in your body?",
      "What can wait without the world ending?",
      "Where do you feel this first — jaw, chest, stomach?",
    ],
  },
];

const INDEX = new Map<string, ComposerCue>();
for (const cue of COMPOSER_CUES) {
  for (const word of cue.words) {
    INDEX.set(word, cue);
  }
}

const PHRASES: [string, string][] = [
  ["too much", "overwhelmed"],
  ["falling behind", "comparison"],
  ["letting go", "attachment"],
  ["left behind", "comparison"],
  ["wasting my life", "purpose"],
  ["wasting life", "purpose"],
];

function tokens(text: string) {
  return text.toLowerCase().match(/[a-z']+/g) ?? [];
}

/** Returns a cue only after a related word has been completed (space or punctuation). */
export function cueAfterCompletedWord(text: string): ComposerCue | null {
  if (!text.trim()) return null;
  const stillTyping = /[a-z']$/i.test(text);
  const hay = stillTyping ? text.slice(0, -1).toLowerCase() : text.toLowerCase();
  for (const [phrase, cueId] of PHRASES) {
    if (hay.includes(phrase)) {
      return COMPOSER_CUES.find((cue) => cue.id === cueId) ?? null;
    }
  }
  const words = tokens(text);
  const completed = stillTyping ? words.slice(0, -1) : words;
  for (let i = completed.length - 1; i >= 0; i--) {
    const hit = INDEX.get(completed[i]);
    if (hit) return hit;
  }
  return null;
}
