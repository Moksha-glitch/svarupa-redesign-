export const EMOTIONS = [
  "Heavy",
  "Restless",
  "Lost",
  "Overwhelmed",
  "Calm",
  "Hopeful",
  "Grateful",
  "Curious",
] as const;

export const ONBOARDING_REASONS = [
  { id: "understand", label: "Something in me wants to be understood" },
  { id: "difficult", label: "I'm in a difficult stretch" },
  { id: "clarity", label: "I want a quieter kind of clarity" },
  { id: "habits", label: "I keep starting things I cannot stay with" },
  { id: "philosophy", label: "I want to sit with Indian philosophy — not as a slogan" },
  { id: "practice", label: "I want a practice I can return to" },
  { id: "curious", label: "I'm not sure. That's all right." },
];

export const EXPLORE_TOPICS = [
  { id: "stress", label: "Stress that doesn't leave" },
  { id: "relationships", label: "Relationships" },
  { id: "work", label: "Work and worth" },
  { id: "purpose", label: "Purpose" },
  { id: "identity", label: "Who I am becoming" },
  { id: "fear", label: "Fear" },
  { id: "anger", label: "Anger" },
  { id: "comparison", label: "Comparison" },
  { id: "grief", label: "Grief" },
  { id: "attachment", label: "Attachment" },
  { id: "discipline", label: "Discipline" },
  { id: "spirituality", label: "A longing I don't have a name for" },
  { id: "other", label: "Something I can't name yet" },
];

export const FAMILIARITY = [
  {
    id: "new",
    label: "New to it",
    body: "Go slowly. Keep context close. Don't assume I know the Sanskrit.",
  },
  {
    id: "some",
    label: "I've read a little",
    body: "Don't over-explain, and don't assume fluency.",
  },
  {
    id: "regular",
    label: "I study this",
    body: "Stay close to the sources. Keep the schools distinct.",
  },
];

export const AI_TONES = [
  { id: "gentle", label: "Gentle", body: "Soft, unhurried. Leave room after a hard sentence." },
  { id: "direct", label: "Direct", body: "Clear and brief. Less ornament. Still kind." },
  { id: "reflective", label: "Reflective", body: "Mirror what I said, then ask me to look again." },
  { id: "philosophical", label: "Philosophical", body: "Bring the texts in sooner, with sources named." },
  { id: "balanced", label: "Balanced", body: "Warmth, clarity, and perspective in equal measure." },
];

export const NAV_DESKTOP = [
  { href: "/home", label: "Home" },
  { href: "/reflect", label: "Reflect" },
  { href: "/wisdom", label: "Wisdom" },
  { href: "/practice", label: "Practice" },
  { href: "/journal", label: "Journal" },
] as const;

export const NAV_ACCOUNT = [
  { href: "/me", label: "Profile" },
  { href: "/me/settings", label: "Settings" },
] as const;

export const NAV_MOBILE = [
  { href: "/home", label: "Home" },
  { href: "/reflect", label: "Reflect" },
  { href: "/wisdom", label: "Wisdom" },
  { href: "/practice", label: "Practice" },
  { href: "/me", label: "Me" },
] as const;

export const CRISIS_RESOURCES = {
  default: [
    {
      name: "International Association for Suicide Prevention",
      url: "https://www.iasp.info/suicidalthoughts/",
    },
    {
      name: "Find a Helpline",
      url: "https://findahelpline.com/",
    },
  ],
  US: [{ name: "988 Suicide & Crisis Lifeline", url: "https://988lifeline.org/" }],
  IN: [{ name: "iCall", url: "https://icallhelpline.org/" }],
  GB: [{ name: "Samaritans", url: "https://www.samaritans.org/" }],
};

export const DISCLAIMER =
  "SVARUPA is a reflection and wellbeing companion. It is not a licensed therapist, a diagnostic tool, or a substitute for professional care.";
