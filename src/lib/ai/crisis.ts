const CRISIS_PATTERNS = [
  /suicid/i,
  /kill myself/i,
  /killing myself/i,
  /end my life/i,
  /ending my life/i,
  /want to die/i,
  /wanna die/i,
  /don't want to (be alive|live)/i,
  /dont want to (be alive|live)/i,
  /self[- ]harm/i,
  /hurt myself/i,
  /cut myself/i,
  /cutting myself/i,
  /no reason to live/i,
  /better off dead/i,
];

export function detectCrisis(text: string) {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text));
}

export function crisisMessage() {
  return {
    content: `I'm glad you said this here. What you're carrying sounds heavy, and you don't have to hold it alone.

SVARUPA can sit with difficult feelings, but it is not the right support if you are in danger or thinking about harming yourself. Please reach a person who can help right now.

If you may be in immediate danger, contact local emergency services.

You can also talk with:
- A trusted person nearby
- [Find a Helpline](https://findahelpline.com/) — local numbers by country
- [IASP resources](https://www.iasp.info/suicidalthoughts/)

If you are in the US, call or text 988. In India, you can reach iCall. In the UK, Samaritans are available at 116 123.

If you'd like, we can slow down together after you have reached someone. You matter more than this conversation.`,
    chips: ["I want to keep talking slowly", "I'll reach out to someone"],
  };
}
