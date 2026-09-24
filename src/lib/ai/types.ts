export type ChatRole = "user" | "assistant" | "system";

export type ConversationStage =
  | "listen"
  | "clarify"
  | "insight"
  | "wisdom"
  | "practice"
  | "close";

export type SessionState = {
  stage: ConversationStage;
  turn: number;
  themes: string[];
  emotion?: string;
  trigger?: string;
  concern?: string;
  tension?: string;
  selectedChip?: string;
  verseSlug?: string;
  sitQuestion?: string;
  crisis?: boolean;
  lastQuestion?: string;
};

export type RetrievedVerse = {
  id: string;
  slug: string;
  citation: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  translator: string;
  context: string;
  tradition?: string;
  provenance: string;
  themes: string[];
};

export type RetrievedConcept = {
  slug: string;
  name: string;
  traditionalPerspective: string;
  modernInterpretation: string;
};

export type AIMessage = {
  role: ChatRole;
  content: string;
};

export type AITurnInput = {
  messages: AIMessage[];
  userMessage: string;
  state: SessionState;
  tone: string;
  familiarity: string;
  retrieved: {
    verses: RetrievedVerse[];
    concepts: RetrievedConcept[];
    practices: { title: string; slug: string; description: string }[];
  };
  userContext: {
    name?: string | null;
    recurringThemes: string[];
    reasons: string[];
  };
};

export type AITurnResult = {
  content: string;
  chips?: string[];
  kind: "text" | "insight" | "wisdom" | "practice" | "sit" | "crisis";
  state: SessionState;
  insight?: {
    emotion?: string;
    trigger?: string;
    concern?: string;
    theme?: string;
    summary?: string;
  };
  verseSlug?: string;
  sitQuestion?: string;
  sources?: { label: string; citation: string }[];
};

export interface AIProvider {
  id: string;
  complete(input: AITurnInput): Promise<AITurnResult>;
  askText(input: {
    question: string;
    verse: RetrievedVerse;
    commentaries: { tradition: string; kind: string; author?: string | null; body: string }[];
    tone: string;
  }): Promise<{ content: string; sources: { label: string; citation: string }[] }>;
}
