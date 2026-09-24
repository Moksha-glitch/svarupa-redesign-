export type ComposerSuggestion = {
  key: string;
  word: string;
  questions: string[];
};

type CueWord = {
  word: string;
  /** Noun phrase that fits the cue's question templates. */
  phrase: string;
};

type ComposerCue = {
  id: string;
  words: CueWord[];
  templates: string[];
};

const COMPOSER_CUES: ComposerCue[] = [
  {
    id: "fear",
    words: [
      { word: "afraid", phrase: "being afraid" },
      { word: "scared", phrase: "being scared" },
      { word: "fear", phrase: "this fear" },
      { word: "fearful", phrase: "feeling fearful" },
      { word: "anxious", phrase: "feeling anxious" },
      { word: "anxiety", phrase: "this anxiety" },
      { word: "panic", phrase: "this panic" },
      { word: "worry", phrase: "this worry" },
      { word: "worried", phrase: "feeling worried" },
      { word: "nervous", phrase: "feeling nervous" },
    ],
    templates: [
      "What is {phrase} trying to protect?",
      "What would feel even a little safer while {phrase} is here?",
      "If {phrase} were not the whole story, what would still be true?",
    ],
  },
  {
    id: "anger",
    words: [
      { word: "angry", phrase: "feeling angry" },
      { word: "anger", phrase: "this anger" },
      { word: "furious", phrase: "feeling furious" },
      { word: "resent", phrase: "this resentment" },
      { word: "resentful", phrase: "feeling resentful" },
      { word: "rage", phrase: "this rage" },
      { word: "irritated", phrase: "feeling irritated" },
      { word: "frustrated", phrase: "feeling frustrated" },
    ],
    templates: [
      "What is {phrase} asking you to protect?",
      "Where was a line crossed that {phrase} is pointing toward?",
      "If {phrase} quieted for a moment, what would be underneath?",
    ],
  },
  {
    id: "heavy",
    words: [
      { word: "heavy", phrase: "this heaviness" },
      { word: "weighed", phrase: "being weighed down" },
      { word: "burden", phrase: "this burden" },
      { word: "burdened", phrase: "feeling burdened" },
      { word: "weight", phrase: "this weight" },
    ],
    templates: [
      "What in {phrase} may not be yours to carry?",
      "What would it mean to set one thing down from {phrase}?",
      "When did {phrase} first arrive?",
    ],
  },
  {
    id: "restless",
    words: [
      { word: "restless", phrase: "feeling restless" },
      { word: "restlessness", phrase: "this restlessness" },
      { word: "agitated", phrase: "feeling agitated" },
      { word: "uneasy", phrase: "feeling uneasy" },
      { word: "fidgety", phrase: "feeling fidgety" },
    ],
    templates: [
      "What is {phrase} reaching for?",
      "If you sat still for one minute with {phrase}, what would you notice?",
      "Is {phrase} movement, or is it escape?",
    ],
  },
  {
    id: "lost",
    words: [
      { word: "lost", phrase: "feeling lost" },
      { word: "directionless", phrase: "feeling directionless" },
      { word: "confused", phrase: "feeling confused" },
      { word: "adrift", phrase: "feeling adrift" },
      { word: "unsure", phrase: "feeling unsure" },
    ],
    templates: [
      "What used to feel like a path, before {phrase}?",
      "If {phrase} did not have to be solved all at once, what is the next honest step?",
      "Who are you measuring yourself against while {phrase} is loud?",
    ],
  },
  {
    id: "overwhelmed",
    words: [
      { word: "overwhelmed", phrase: "feeling overwhelmed" },
      { word: "overwhelm", phrase: "this overwhelm" },
      { word: "swamped", phrase: "feeling swamped" },
      { word: "drowning", phrase: "feeling like you are drowning" },
      { word: "too much", phrase: "feeling like too much" },
    ],
    templates: [
      "What is one thing inside {phrase} that does not need to be solved today?",
      "Where does {phrase} live in your body?",
      "What would “enough for now” look like beside {phrase}?",
    ],
  },
  {
    id: "lonely",
    words: [
      { word: "lonely", phrase: "feeling lonely" },
      { word: "loneliness", phrase: "this loneliness" },
      { word: "alone", phrase: "being alone" },
      { word: "unseen", phrase: "feeling unseen" },
      { word: "isolated", phrase: "feeling isolated" },
    ],
    templates: [
      "What kind of closeness is {phrase} actually hungry for?",
      "When did you last feel met, before {phrase} took over?",
      "What are you hoping someone else will notice in {phrase}?",
    ],
  },
  {
    id: "sad",
    words: [
      { word: "sad", phrase: "feeling sad" },
      { word: "sadness", phrase: "this sadness" },
      { word: "unhappy", phrase: "feeling unhappy" },
      { word: "heartbroken", phrase: "feeling heartbroken" },
    ],
    templates: [
      "What does {phrase} want you to know?",
      "Is there something in {phrase} that has not been mourned yet?",
      "What would kindness toward {phrase} look like?",
    ],
  },
  {
    id: "grief",
    words: [
      { word: "grief", phrase: "this grief" },
      { word: "grieving", phrase: "your grieving" },
      { word: "loss", phrase: "this loss" },
      { word: "lost someone", phrase: "losing someone" },
      { word: "died", phrase: "this death" },
      { word: "death", phrase: "this death" },
      { word: "mourning", phrase: "this mourning" },
      { word: "miss", phrase: "missing them" },
    ],
    templates: [
      "What in {phrase} still wants to be spoken?",
      "What are you not ready to put down from {phrase}?",
      "What would it mean to stay with {phrase} without rushing toward acceptance?",
    ],
  },
  {
    id: "shame",
    words: [
      { word: "shame", phrase: "this shame" },
      { word: "ashamed", phrase: "feeling ashamed" },
      { word: "embarrassed", phrase: "feeling embarrassed" },
      { word: "humiliated", phrase: "feeling humiliated" },
      { word: "worthless", phrase: "feeling worthless" },
    ],
    templates: [
      "Whose eyes are you seeing yourself through in {phrase}?",
      "What would you say to a friend sitting with {phrase}?",
      "What part of you, in {phrase}, is asking not to be discarded?",
    ],
  },
  {
    id: "guilt",
    words: [
      { word: "guilt", phrase: "this guilt" },
      { word: "guilty", phrase: "feeling guilty" },
      { word: "regret", phrase: "this regret" },
      { word: "sorry", phrase: "feeling sorry" },
      { word: "blame", phrase: "this blame" },
    ],
    templates: [
      "Is {phrase} asking for repair, or for punishment?",
      "What would making amends look like, if {phrase} allowed it?",
      "What are you holding in {phrase} that may belong to more than you?",
    ],
  },
  {
    id: "comparison",
    words: [
      { word: "compare", phrase: "comparing yourself" },
      { word: "comparing", phrase: "this comparing" },
      { word: "comparison", phrase: "this comparison" },
      { word: "behind", phrase: "feeling behind" },
      { word: "falling behind", phrase: "falling behind" },
      { word: "left behind", phrase: "being left behind" },
      { word: "jealous", phrase: "feeling jealous" },
      { word: "jealousy", phrase: "this jealousy" },
      { word: "envy", phrase: "this envy" },
      { word: "inadequate", phrase: "feeling inadequate" },
    ],
    templates: [
      "If {phrase} were not the measure, what would still matter to you?",
      "Whose timeline is feeding {phrase}?",
      "What would “enough” look like if it were yours, and not {phrase}?",
    ],
  },
  {
    id: "control",
    words: [
      { word: "control", phrase: "this need for control" },
      { word: "outcome", phrase: "this outcome" },
      { word: "result", phrase: "this result" },
      { word: "uncertain", phrase: "feeling uncertain" },
      { word: "uncertainty", phrase: "this uncertainty" },
    ],
    templates: [
      "What is {phrase} trying to hold that may not be yours to hold?",
      "Where has {phrase} turned care into gripping?",
      "What would acting well look like if {phrase} did not need an ending?",
    ],
  },
  {
    id: "purpose",
    words: [
      { word: "purpose", phrase: "this search for purpose" },
      { word: "pointless", phrase: "feeling pointless" },
      { word: "meaning", phrase: "this question of meaning" },
      { word: "wasting", phrase: "this sense of wasting" },
      { word: "wasting my life", phrase: "wasting your life" },
      { word: "wasting life", phrase: "wasting life" },
      { word: "direction", phrase: "this search for direction" },
      { word: "aimless", phrase: "feeling aimless" },
    ],
    templates: [
      "What would you pursue if {phrase} stopped measuring your life against someone else's?",
      "When do you feel most like yourself, apart from {phrase}?",
      "What is the smallest thing that still feels true inside {phrase}?",
    ],
  },
  {
    id: "work",
    words: [
      { word: "work", phrase: "this work" },
      { word: "job", phrase: "this job" },
      { word: "career", phrase: "this career" },
      { word: "boss", phrase: "your boss" },
      { word: "office", phrase: "this office" },
      { word: "burnout", phrase: "this burnout" },
      { word: "burnt", phrase: "feeling burnt out" },
    ],
    templates: [
      "What would today look like if {phrase} did not have to prove your worth?",
      "Where has {phrase} turned duty into depletion?",
      "What part of the work still feels like yours, under {phrase}?",
    ],
  },
  {
    id: "attachment",
    words: [
      { word: "attached", phrase: "being attached" },
      { word: "attachment", phrase: "this attachment" },
      { word: "cling", phrase: "this clinging" },
      { word: "clinging", phrase: "this clinging" },
      { word: "letting go", phrase: "letting go" },
      { word: "release", phrase: "this wish to release" },
    ],
    templates: [
      "What is {phrase} holding that is also holding you?",
      "Is {phrase} love, or is it gripping?",
      "What would remain if {phrase} changed?",
    ],
  },
  {
    id: "relationships",
    words: [
      { word: "partner", phrase: "your partner" },
      { word: "relationship", phrase: "this relationship" },
      { word: "friend", phrase: "this friendship" },
      { word: "family", phrase: "your family" },
      { word: "breakup", phrase: "this breakup" },
    ],
    templates: [
      "What are you hoping will come from {phrase} that you have not yet given yourself?",
      "What do you need from {phrase} that has not been said?",
      "Where do you feel unseen inside {phrase}?",
    ],
  },
  {
    id: "discipline",
    words: [
      { word: "discipline", phrase: "this discipline" },
      { word: "habit", phrase: "this habit" },
      { word: "inconsistent", phrase: "feeling inconsistent" },
      { word: "procrastinate", phrase: "this procrastination" },
      { word: "lazy", phrase: "feeling lazy" },
      { word: "routine", phrase: "this routine" },
      { word: "streak", phrase: "this streak" },
    ],
    templates: [
      "What is the smallest return you could make without letting {phrase} become a verdict?",
      "Who is {phrase} for — you, or an imagined version of you?",
      "What happens in you the moment {phrase} slips?",
    ],
  },
  {
    id: "calm",
    words: [
      { word: "calm", phrase: "this calm" },
      { word: "peaceful", phrase: "feeling peaceful" },
      { word: "still", phrase: "this stillness" },
      { word: "quiet", phrase: "this quiet" },
      { word: "settled", phrase: "feeling settled" },
    ],
    templates: [
      "What made room for {phrase}?",
      "What would you like to remember from {phrase}?",
      "How can you stay near {phrase} without forcing it to last?",
    ],
  },
  {
    id: "grateful",
    words: [
      { word: "grateful", phrase: "feeling grateful" },
      { word: "gratitude", phrase: "this gratitude" },
      { word: "thankful", phrase: "feeling thankful" },
    ],
    templates: [
      "What was given in {phrase} that you did not have to earn?",
      "Who or what are you quietly indebted to, inside {phrase}?",
      "What would you like to keep close from {phrase}?",
    ],
  },
  {
    id: "hopeful",
    words: [
      { word: "hopeful", phrase: "feeling hopeful" },
      { word: "hope", phrase: "this hope" },
      { word: "optimistic", phrase: "feeling optimistic" },
    ],
    templates: [
      "What is {phrase} pointing toward?",
      "What would you do if {phrase} were allowed to stay?",
      "What small evidence is {phrase} standing on?",
    ],
  },
  {
    id: "curious",
    words: [
      { word: "curious", phrase: "feeling curious" },
      { word: "wonder", phrase: "this wonder" },
      { word: "wondering", phrase: "this wondering" },
    ],
    templates: [
      "What is {phrase} actually trying to understand?",
      "What would {phrase} look at more closely if there were no hurry?",
      "Which part of {phrase} feels most alive?",
    ],
  },
  {
    id: "stuck",
    words: [
      { word: "stuck", phrase: "feeling stuck" },
      { word: "stalled", phrase: "feeling stalled" },
      { word: "frozen", phrase: "feeling frozen" },
      { word: "paralyzed", phrase: "feeling paralyzed" },
    ],
    templates: [
      "What would movement look like if {phrase} did not have to become a leap?",
      "What is {phrase} waiting to feel before you begin?",
      "If {phrase} could speak, what would it say?",
    ],
  },
  {
    id: "tired",
    words: [
      { word: "tired", phrase: "feeling tired" },
      { word: "exhausted", phrase: "feeling exhausted" },
      { word: "fatigue", phrase: "this fatigue" },
      { word: "drained", phrase: "feeling drained" },
      { word: "weary", phrase: "feeling weary" },
    ],
    templates: [
      "What has been asking too much, underneath {phrase}?",
      "What kind of rest would actually meet {phrase}?",
      "Where have you been proving you can keep going, through {phrase}?",
    ],
  },
  {
    id: "numb",
    words: [
      { word: "numb", phrase: "this numbness" },
      { word: "empty", phrase: "this emptiness" },
      { word: "blank", phrase: "this blankness" },
      { word: "disconnected", phrase: "feeling disconnected" },
    ],
    templates: [
      "When did things first go quiet around {phrase}?",
      "What might {phrase} be protecting you from?",
      "Is there one small sensation you can still name beside {phrase}?",
    ],
  },
  {
    id: "stress",
    words: [
      { word: "stress", phrase: "this stress" },
      { word: "stressed", phrase: "feeling stressed" },
      { word: "pressure", phrase: "this pressure" },
      { word: "tense", phrase: "feeling tense" },
      { word: "tension", phrase: "this tension" },
    ],
    templates: [
      "What demand is living inside {phrase}?",
      "What can wait, even with {phrase} here, without the world ending?",
      "Where does {phrase} show up first — jaw, chest, or stomach?",
    ],
  },
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function lastPhraseIndex(hay: string, phrase: string) {
  const pattern = new RegExp(
    `(?:^|[^a-z'])${escapeRegExp(phrase)}(?=[^a-z']|$)`,
    "gi",
  );
  let last = -1;
  for (const match of hay.matchAll(pattern)) {
    if (match.index != null) last = match.index;
  }
  return last;
}

/** Suggested questions after a related word has been completed (space or punctuation). */
export function suggestionsAfterCompletedWord(text: string): ComposerSuggestion | null {
  if (!text.trim()) return null;
  const stillTyping = /[a-z']$/i.test(text);
  const hay = (stillTyping ? text.slice(0, -1) : text).toLowerCase();

  let best: { index: number; length: number; cue: ComposerCue; entry: CueWord } | null = null;
  for (const cue of COMPOSER_CUES) {
    for (const entry of cue.words) {
      const index = lastPhraseIndex(hay, entry.word);
      if (index < 0) continue;
      const length = entry.word.length;
      if (
        !best ||
        index > best.index ||
        (index === best.index && length > best.length)
      ) {
        best = { index, length, cue, entry };
      }
    }
  }
  if (!best) return null;

  return {
    key: `${best.cue.id}:${best.entry.word}`,
    word: best.entry.word,
    questions: best.cue.templates.map((template) =>
      template.replaceAll("{phrase}", best.entry.phrase),
    ),
  };
}
