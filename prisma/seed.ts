import bcrypt from "bcryptjs";
import { db, prepareDatabase } from "../src/lib/db";

async function main() {
  await prepareDatabase();
  await db.sitSession.deleteMany();
  await db.weeklyReflection.deleteMany();
  await db.savedWisdom.deleteMany();
  await db.practiceSession.deleteMany();
  await db.sadhanaItem.deleteMany();
  await db.sadhana.deleteMany();
  await db.journalTheme.deleteMany();
  await db.journalEntry.deleteMany();
  await db.reflectionInsight.deleteMany();
  await db.reflectionMessage.deleteMany();
  await db.reflectionSession.deleteMany();
  await db.emotionalCheckin.deleteMany();
  await db.userThemeStat.deleteMany();
  await db.userPreference.deleteMany();
  await db.passwordReset.deleteMany();
  await db.user.deleteMany();
  await db.verseTheme.deleteMany();
  await db.commentary.deleteMany();
  await db.scriptureVerse.deleteMany();
  await db.scriptureChapter.deleteMany();
  await db.scripture.deleteMany();
  await db.wisdomSource.deleteMany();
  await db.wisdomConcept.deleteMany();
  await db.philosophicalTradition.deleteMany();
  await db.practice.deleteMany();
  await db.journalPrompt.deleteMany();
  await db.theme.deleteMany();

  const themeData = [
    ["purpose", "Purpose", "Questions of direction, calling, and a life that feels like one's own."],
    ["control", "Control", "The wish to secure outcomes and the strain that follows."],
    ["comparison", "Comparison", "Measuring a life against someone else's timeline."],
    ["fear", "Fear", "Anticipation of loss, failure, or inner collapse."],
    ["attachment", "Attachment", "Gripping what is loved, including identity and result."],
    ["relationships", "Relationships", "Closeness, distance, and the wish to be met."],
    ["work", "Work", "Labour, duty, ambition, and depletion."],
    ["discipline", "Discipline", "The gap between intention and return."],
    ["grief", "Grief", "Living with what is gone and still present."],
    ["anger", "Anger", "Heat at a crossed line, or at the self."],
    ["dharma", "Dharma", "Right orientation — a word with many classical senses."],
    ["karma", "Karma", "Action and its moral-psychological continuity."],
    ["moksha", "Moksha", "Freedom as understood across Indian traditions."],
    ["atman", "Atman", "Self — not simply personality."],
    ["brahman", "Brahman", "The absolute in Vedantic discourse."],
    ["desire", "Desire", "Kama, longing, and the movements of wanting."],
    ["suffering", "Suffering", "Duhkha and the analysis of dissatisfaction."],
    ["duty", "Duty", "Obligation, role, and the ethics of action."],
    ["self-knowledge", "Self-knowledge", "Atma-jnana and honest seeing."],
    ["equanimity", "Equanimity", "Samatva — evenness amid change."],
    ["devotion", "Devotion", "Bhakti as relationship, not performance."],
    ["action", "Action", "Karma as what one does, not merely what one believes."],
  ] as const;

  const themes = Object.fromEntries(
    await Promise.all(
      themeData.map(async ([slug, name, description]) => [
        slug,
        await db.theme.create({ data: { slug, name, description } }),
      ]),
    ),
  ) as Record<string, { id: string; slug: string; name: string }>;

  const gita = await db.wisdomSource.create({
    data: {
      slug: "bhagavad-gita",
      name: "Bhagavad Gita",
      category: "text",
      tradition: "Smriti · Mahabharata",
      period: "Classical Sanskrit epic context",
      sortOrder: 1,
      description:
        "A dialogue between Krishna and Arjuna on the Kurukshetra field, preserved as part of the Mahabharata. SVARUPA treats it as a philosophical and literary text with many commentarial lineages, not as a single official meaning.",
    },
  });
  const upanishads = await db.wisdomSource.create({
    data: {
      slug: "upanishads",
      name: "Upanishads",
      category: "text",
      tradition: "Shruti",
      period: "Late Vedic to early classical",
      sortOrder: 2,
      description:
        "A family of Sanskrit texts concerned with self, world, and knowledge. They are not one book with one voice. Verses here are cited individually, with translator and era.",
    },
  });
  const yogaSutras = await db.wisdomSource.create({
    data: {
      slug: "yoga-sutras",
      name: "Yoga Sutras of Patanjali",
      category: "text",
      tradition: "Classical Yoga",
      period: "Early centuries CE (dating remains discussed)",
      sortOrder: 3,
      description:
        "Aphorisms on yogic psychology and practice. Later readers, including Vivekananda and academic translators, disagree in places. We keep the aphorism, a public-domain translation, and separate interpretation.",
    },
  });
  await db.wisdomSource.createMany({
    data: [
      {
        slug: "vedas",
        name: "Vedas",
        category: "text",
        tradition: "Shruti",
        sortOrder: 0,
        description:
          "The oldest layer of Sanskrit sacred literature. SVARUPA does not present a complete Vedic corpus here. Where a verse appears, it is cited with translator and provenance.",
      },
      {
        slug: "ramayana",
        name: "Ramayana",
        category: "text",
        tradition: "Itihasa",
        sortOrder: 4,
        description:
          "The epic attributed to Valmiki, with many later tellings. Character, dharma, and devotion are read differently across regions and centuries.",
      },
      {
        slug: "mahabharata",
        name: "Mahabharata",
        category: "text",
        tradition: "Itihasa",
        sortOrder: 5,
        description:
          "A vast epic of kinship, war, and moral difficulty. The Bhagavad Gita is one of its philosophical centres, not the whole of the work.",
      },
      {
        slug: "vedanta",
        name: "Vedanta",
        category: "philosophy",
        sortOrder: 10,
        description:
          "A family of readings of the Upanishads, Brahma Sutras, and Gita. Advaita, Vishishtadvaita, and Dvaita are distinct, not interchangeable.",
      },
      {
        slug: "advaita-vedanta",
        name: "Advaita Vedanta",
        category: "philosophy",
        sortOrder: 11,
        description:
          "Non-dual Vedanta associated especially with Shankara's school: the self is not finally other than Brahman. This is one Vedantic position among others.",
      },
      {
        slug: "vishishtadvaita",
        name: "Vishishtadvaita",
        category: "philosophy",
        sortOrder: 12,
        description:
          "Qualified non-dualism associated with Ramanuja: unity without erasing the reality of souls and world in relation to Brahman.",
      },
      {
        slug: "dvaita",
        name: "Dvaita",
        category: "philosophy",
        sortOrder: 13,
        description:
          "Dualist Vedanta associated with Madhva: a real and lasting distinction between God, selves, and world.",
      },
      {
        slug: "sankhya",
        name: "Sankhya",
        category: "philosophy",
        sortOrder: 14,
        description:
          "A classical enumeration of principles distinguishing purusha (consciousness) and prakriti (nature). It informs the Gita's second chapter and Yoga.",
      },
      {
        slug: "yoga-philosophy",
        name: "Yoga",
        category: "philosophy",
        sortOrder: 15,
        description:
          "Both a darshana and a set of practices. Patanjali's text is one classical articulation, not the only yogic tradition.",
      },
      {
        slug: "bhakti",
        name: "Bhakti",
        category: "philosophy",
        sortOrder: 16,
        description:
          "Devotional traditions that centre love, relationship, and surrender. Bhakti is lived across many languages, castes, and theologies.",
      },
      {
        slug: "mimamsa",
        name: "Mimamsa",
        category: "philosophy",
        sortOrder: 17,
        description:
          "Purva Mimamsa: a school concerned with dharma and Vedic ritual interpretation. It is not a 'spiritual self-help' system.",
      },
      {
        slug: "nyaya",
        name: "Nyaya",
        category: "philosophy",
        sortOrder: 18,
        description:
          "A school of logic and epistemology. Knowing, for Nyaya, is a disciplined public activity, not a private vibe.",
      },
    ],
  });

  const gitaBook = await db.scripture.create({
    data: {
      slug: "bhagavad-gita",
      title: "Bhagavad Gita",
      sourceId: gita.id,
      description:
        "Eighteen chapters of dialogue. Chapter 2 (Sankhya Yoga) is often where Arjuna's despair meets a teaching on action, grief, and evenness.",
    },
  });
  const upanishadBook = await db.scripture.create({
    data: {
      slug: "upanishads",
      title: "Selected Upanishads",
      sourceId: upanishads.id,
      description:
        "Selected passages from Isha, Katha, Chandogya, and Brihadaranyaka, using public-domain translations. Each passage is a distinct text, not a mash-up.",
    },
  });
  const yogaBook = await db.scripture.create({
    data: {
      slug: "yoga-sutras",
      title: "Yoga Sutras",
      sourceId: yogaSutras.id,
      description:
        "Selected sutras with public-domain English. Later commentary is labelled separately from the aphorism.",
    },
  });
  const ramayanaBook = await db.scripture.create({
    data: {
      slug: "ramayana",
      title: "Valmiki Ramayana",
      sourceId: (await db.wisdomSource.findUnique({ where: { slug: "ramayana" } }))!.id,
      description:
        "Opening verse of the Balakanda, in a public-domain translation. A single verse is not the Ramayana.",
    },
  });

  const gita2 = await db.scriptureChapter.create({
    data: {
      scriptureId: gitaBook.id,
      number: 2,
      title: "Sankhya Yoga",
      subtitle: "The yoga of knowledge, and the turning of Arjuna's grief",
    },
  });
  const gita4 = await db.scriptureChapter.create({
    data: {
      scriptureId: gitaBook.id,
      number: 4,
      title: "Jnana Yoga",
      subtitle: "Knowledge, action, and the teaching of yoga",
    },
  });
  const gita6 = await db.scriptureChapter.create({
    data: {
      scriptureId: gitaBook.id,
      number: 6,
      title: "Dhyana Yoga",
      subtitle: "The yoga of meditation, and the self as friend or enemy",
    },
  });
  const isha = await db.scriptureChapter.create({
    data: {
      scriptureId: upanishadBook.id,
      number: 1,
      title: "Isha Upanishad",
      subtitle: "The Lord and the world's movement",
    },
  });
  const katha = await db.scriptureChapter.create({
    data: {
      scriptureId: upanishadBook.id,
      number: 3,
      title: "Katha Upanishad",
      subtitle: "The path said to be sharp as a razor",
    },
  });
  const chandogya = await db.scriptureChapter.create({
    data: {
      scriptureId: upanishadBook.id,
      number: 6,
      title: "Chandogya Upanishad",
      subtitle: "Uddalaka and Svetaketu",
    },
  });
  const brihad = await db.scriptureChapter.create({
    data: {
      scriptureId: upanishadBook.id,
      number: 8,
      title: "Brihadaranyaka Upanishad",
      subtitle: "A prayer from the ritual of the vital breath",
    },
  });
  const ys1 = await db.scriptureChapter.create({
    data: {
      scriptureId: yogaBook.id,
      number: 1,
      title: "Samadhi Pada",
      subtitle: "On concentration",
    },
  });
  const ys2 = await db.scriptureChapter.create({
    data: {
      scriptureId: yogaBook.id,
      number: 2,
      title: "Sadhana Pada",
      subtitle: "On practice",
    },
  });
  const ram1 = await db.scriptureChapter.create({
    data: {
      scriptureId: ramayanaBook.id,
      number: 1,
      title: "Balakanda",
      subtitle: "Valmiki asks Narada",
    },
  });

  const sivananda = "Swami Sivananda";
  const sivanandaBook = "The Bhagavad Gita, The Divine Life Society (public-domain reprint of Sivananda's translation).";
  const muller = "F. Max Müller";
  const mullerBook = "The Upanishads, Sacred Books of the East, Vol. 1, 1879 (public domain).";
  const vivekananda = "Swami Vivekananda";
  const woods = "James Haughton Woods";

  type VerseSeed = {
    chapterId: string;
    number: number;
    sanskrit: string;
    transliteration: string;
    translation: string;
    translator: string;
    context: string;
    citation: string;
    themeSlugs: string[];
    commentaries: { tradition: string; kind: string; author?: string; body: string; citation?: string }[];
  };

  const verses: VerseSeed[] = [
    {
      chapterId: gita2.id,
      number: 47,
      sanskrit:
        "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
      transliteration:
        "karmaṇy evādhikāras te mā phaleṣu kadācana |\nmā karma-phala-hetur bhūr mā te saṅgo ’stv akarmaṇi ||",
      translation:
        "Thy right is to work only, but never to its fruits; let not the fruit of action be thy motive, nor let thy attachment be to inaction.",
      translator: sivananda,
      citation: "Bhagavad Gita 2.47",
      context:
        "Spoken to Arjuna after he has refused to fight. Krishna is not offering career advice. In the dramatic setting, Arjuna must act in a war he dreads. The verse distinguishes adhikara (what is one's to do) from phala (the fruit). Later readers apply it to ordinary work; that application is interpretation, not the scene itself.",
      themeSlugs: ["karma", "attachment", "action", "equanimity", "control", "purpose"],
      commentaries: [
        {
          tradition: "Advaita Vedanta",
          kind: "traditional",
          author: "Shankara's line of reading (paraphrased from the Gita-bhashya's emphasis)",
          body: "Action belongs to the empirical self operating in the world of gunas. Clinging to results binds. The verse is not a licence for carelessness; it is a discipline of motive. SVARUPA paraphrases this emphasis rather than quoting a copyrighted English bhashya in full.",
          citation: "Traditional Advaita emphasis on nishkama karma in Gita 2.47",
        },
        {
          tradition: "Modern interpretation",
          kind: "modern",
          author: "SVARUPA editorial",
          body: "You can give yourself fully to an action without knowing exactly how the outcome will unfold. That is not indifference. It is a way of loosening the panic that the future must already be secured. This is a modern psychological reading, not what the battlefield scene literally says.",
        },
      ],
    },
    {
      chapterId: gita2.id,
      number: 14,
      sanskrit:
        "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः ।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ॥",
      transliteration:
        "mātrā-sparśās tu kaunteya śītoṣṇa-sukha-duḥkha-dāḥ |\nāgamāpāyino ’nityās tāṃs titikṣasva bhārata ||",
      translation:
        "The contacts of the senses with the objects, O son of Kunti, which cause heat and cold, pleasure and pain, have a beginning and an end; they are impermanent; endure them bravely, O Arjuna.",
      translator: sivananda,
      citation: "Bhagavad Gita 2.14",
      context:
        "Part of Krishna's early reply to Arjuna's collapse. The teaching is about the passing nature of sensory pairs — not a dismissal of grief. Titiksha (endurance) here is a yogic stance, later much discussed.",
      themeSlugs: ["equanimity", "suffering", "grief"],
      commentaries: [
        {
          tradition: "Sankhya-inflected Gita reading",
          kind: "traditional",
          body: "Pleasure and pain are contacts, not the self. The verse trains a witness-like endurance. It should not be used to shame sorrow.",
        },
        {
          tradition: "Modern interpretation",
          kind: "modern",
          author: "SVARUPA editorial",
          body: "Feelings arrive and recede. Endurance here is not numbness. It is the possibility of staying present while a wave is a wave.",
        },
      ],
    },
    {
      chapterId: gita2.id,
      number: 48,
      sanskrit:
        "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥",
      transliteration:
        "yoga-sthaḥ kuru karmāṇi saṅgaṃ tyaktvā dhanañjaya |\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṃ yoga ucyate ||",
      translation:
        "Perform action, O Dhananjaya, being steadfast in Yoga, abandoning attachment and balanced in success and failure. Evenness of mind is called Yoga.",
      translator: sivananda,
      citation: "Bhagavad Gita 2.48",
      context:
        "Immediately after 2.47. Yoga is defined here as samatva — evenness — not as posture. Success and failure are both included.",
      themeSlugs: ["equanimity", "action", "discipline", "work"],
      commentaries: [
        {
          tradition: "Karma Yoga",
          kind: "traditional",
          body: "Yoga is named as evenness amid opposite results. Action continues; the inner swinging is what is trained.",
        },
        {
          tradition: "Modern interpretation",
          kind: "modern",
          author: "SVARUPA editorial",
          body: "Skill is not only technique. It is the capacity to act without letting a single outcome become the meaning of the self.",
        },
      ],
    },
    {
      chapterId: gita2.id,
      number: 50,
      sanskrit:
        "बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते ।\nतस्माद्योगाय युज्यस्व योगः कर्मसु कौशलम् ॥",
      transliteration:
        "buddhi-yukto jahātīha ubhe sukṛta-duṣkṛte |\ntasmād yogāya yujyasva yogaḥ karmasu kauśalam ||",
      translation:
        "Endowed with the wisdom of evenness of mind, one casts off in this life both good and evil deeds; therefore, devote yourself to Yoga; Yoga is skill in action.",
      translator: sivananda,
      citation: "Bhagavad Gita 2.50",
      context:
        "The famous line yogaḥ karmasu kauśalam. In context it follows the teaching of buddhi-yoga, not a modern slogan about hustle.",
      themeSlugs: ["action", "dharma", "discipline"],
      commentaries: [
        {
          tradition: "Karma Yoga",
          kind: "traditional",
          body: "Kaushala (skill) is yoked to buddhi, not to cleverness for personal gain. The 'casting off' of good and evil deeds is a technical claim about binding action, and commentators disagree on its exact force.",
        },
        {
          tradition: "Modern interpretation",
          kind: "modern",
          author: "SVARUPA editorial",
          body: "A skilled life is not a decorated one. It is a life in which action is not constantly converting itself into self-image.",
        },
      ],
    },
    {
      chapterId: gita6.id,
      number: 5,
      sanskrit:
        "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥",
      transliteration:
        "uddhared ātmanātmānaṃ nātmānam avasādayet |\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ ||",
      translation:
        "Let a man lift himself by himself; let him not degrade himself; for the Self alone is the friend of the self, and the Self alone is the enemy of the self.",
      translator: sivananda,
      citation: "Bhagavad Gita 6.5",
      context:
        "From the chapter on meditation. The verse is easily misread as rugged individualism. In Sanskrit, atman can mean both the empirical self and the deeper Self; commentators play on that range.",
      themeSlugs: ["self-knowledge", "discipline", "purpose"],
      commentaries: [
        {
          tradition: "Yoga / Gita",
          kind: "traditional",
          body: "The mind trained becomes an ally; the untrained mind becomes an adversary. Uplift is inward work, not contempt for help from teachers or community.",
        },
        {
          tradition: "Modern interpretation",
          kind: "modern",
          author: "SVARUPA editorial",
          body: "You cannot outsource the last inch of your own attention. That is different from refusing care, friendship, or professional help.",
        },
      ],
    },
    {
      chapterId: gita4.id,
      number: 18,
      sanskrit:
        "कर्मण्यकर्म यः पश्येदकर्मणि च कर्म यः ।\nस बुद्धिमान्मनुष्येषु स युक्तः कृत्स्नकर्मकृत् ॥",
      transliteration:
        "karmaṇy akarma yaḥ paśyed akarmaṇi ca karma yaḥ |\nsa buddhimān manuṣyeṣu sa yuktaḥ kṛtsna-karma-kṛt ||",
      translation:
        "He who sees inaction in action, and action in inaction, he is wise among men; he is a yogi and performer of all actions.",
      translator: sivananda,
      citation: "Bhagavad Gita 4.18",
      context:
        "A deliberately paradoxical teaching about the nature of karma. It is not an instruction to freeze. Commentators use it to distinguish bodily movement from binding doership.",
      themeSlugs: ["action", "karma", "self-knowledge"],
      commentaries: [
        {
          tradition: "Vedanta",
          kind: "traditional",
          body: "Seeing akarma in karma is seeing that the Self, as such, is not the doer, even while the body-mind acts. Schools disagree on how literally to take that.",
        },
        {
          tradition: "Modern interpretation",
          kind: "modern",
          author: "SVARUPA editorial",
          body: "Busyness can be a form of hiding. Stillness can be a form of action. The verse asks for discernment, not a pose of holy inactivity.",
        },
      ],
    },
    {
      chapterId: isha.id,
      number: 1,
      sanskrit:
        "ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् ।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥",
      transliteration:
        "īśā vāsyam idaṃ sarvaṃ yat kiñca jagatyāṃ jagat |\ntena tyaktena bhuñjīthā mā gṛdhaḥ kasya svid dhanam ||",
      translation:
        "All this, whatsoever moves on the earth, is to be covered by the Lord. Protect (your Self) through that detachment. Do not covet anybody's wealth. (After Müller, with the opening as commonly parsed.)",
      translator: `${muller}; editorial clarification of a public-domain rendering`,
      citation: "Isha Upanishad 1",
      context:
        "The Isha Upanishad opens the White Yajurveda's short Upanishad. 'Covered by the Lord' and 'enjoy through renunciation' have generated centuries of reading. Müller's 1879 English is dated in diction; the Sanskrit is the source.",
      themeSlugs: ["brahman", "attachment", "desire", "dharma"],
      commentaries: [
        {
          tradition: "Advaita Vedanta",
          kind: "traditional",
          body: "Often read as a teaching that the world is to be seen as pervaded by the Lord / the real, and that grasping ('whose wealth?') is a confusion about possession.",
        },
        {
          tradition: "Modern interpretation",
          kind: "modern",
          author: "SVARUPA editorial",
          body: "Nothing you hold is held outside a larger belonging. That can quiet envy. It should not be used to excuse injustice about actual wealth.",
        },
      ],
    },
    {
      chapterId: katha.id,
      number: 14,
      sanskrit:
        "उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत ।\nक्षुरस्य धारा निशिता दुरत्यया दुर्गं पथस्तत् कवयो वदन्ति ॥",
      transliteration:
        "uttiṣṭhata jāgrata prāpya varān nibodhata |\nkṣurasya dhārā niśitā duratyayā durgaṃ pathas tat kavayo vadanti ||",
      translation:
        "Arise, awake, and having reached the great, learn. The wise say that path is sharp as a razor's edge, difficult to cross and hard to tread.",
      translator: muller,
      citation: "Katha Upanishad 1.3.14",
      context:
        "From Yama's teaching to Nachiketa. The razor image is about the subtlety of the path of knowledge, not a threat. Vivekananda later made 'Arise, awake' a public motto; that afterlife of the line is modern.",
      themeSlugs: ["self-knowledge", "discipline", "purpose"],
      commentaries: [
        {
          tradition: "Vedanta",
          kind: "traditional",
          body: "Knowledge of the self is not automatic. The verse pairs waking with approaching those who know (varān), which is a social and pedagogical claim, not only an inner pep talk.",
        },
        {
          tradition: "Modern interpretation",
          kind: "modern",
          author: "SVARUPA editorial",
          body: "Waking up is not the same as grinding harder. The razor is precision — attention fine enough to notice what you usually skip.",
        },
      ],
    },
    {
      chapterId: chandogya.id,
      number: 7,
      sanskrit:
        "स य एषोऽणिमैतदात्म्यमिदं सर्वं तत्सत्यं स आत्मा तत्त्वमसि श्वेतकेतो इति",
      transliteration:
        "sa ya eṣo ’ṇimaitadātmyam idaṃ sarvaṃ tat satyaṃ sa ātmā tattvamasi śvetaketo iti",
      translation:
        "Now that which is that subtle essence, in it all that exists has its self. It is the True. It is the Self, and thou, O Śvetaketu, art it.",
      translator: muller,
      citation: "Chandogya Upanishad 6.8.7",
      context:
        "One of nine repetitions of tat tvam asi in Chandogya 6, taught by Uddalaka Aruni to his son. Advaita takes it as a mahavakya of identity. Other Vedantic schools read the grammar and the metaphysics differently. Both are traditional.",
      themeSlugs: ["atman", "brahman", "self-knowledge"],
      commentaries: [
        {
          tradition: "Advaita Vedanta",
          kind: "traditional",
          body: "Classically heard as a statement of non-difference: the self of Śvetaketu is not other than that subtle truth. This is a school reading of the sentence.",
        },
        {
          tradition: "Vishishtadvaita / Dvaita caution",
          kind: "traditional",
          body: "Other Vedantins parse tat tvam asi so that the identity is qualified or analogical, preserving a real distinction between the Lord and the finite self. SVARUPA records the disagreement rather than settling it.",
        },
        {
          tradition: "Modern interpretation",
          kind: "modern",
          author: "SVARUPA editorial",
          body: "Whatever the metaphysics, the sentence interrupts a small, isolated story of 'me'. It does not cancel ethics, bodies, or the need for help.",
        },
      ],
    },
    {
      chapterId: brihad.id,
      number: 28,
      sanskrit: "असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ।",
      transliteration: "asato mā sad gamaya | tamaso mā jyotir gamaya | mṛtyor mā amṛtaṃ gamaya |",
      translation:
        "From the unreal lead me to the real. From darkness lead me to light. From death lead me to immortality.",
      translator: muller,
      citation: "Brihadaranyaka Upanishad 1.3.28",
      context:
        "A liturgical prayer within a larger chapter on the vital breath and the gods. It is widely known independently of that ritual setting. 'Unreal' (asat) in Vedantic reading is not 'fictional feelings'.",
      themeSlugs: ["moksha", "self-knowledge", "devotion"],
      commentaries: [
        {
          tradition: "Vedanta",
          kind: "traditional",
          body: "Often read as a movement from appearance to being, ignorance to knowledge, mortality to the deathless. It is a petition, which already implies relation.",
        },
        {
          tradition: "Modern interpretation",
          kind: "modern",
          author: "SVARUPA editorial",
          body: "A request to be led is not the same as self-conquest. Darkness here is a name for not-seeing, not a moral stain you must hide.",
        },
      ],
    },
    {
      chapterId: ys1.id,
      number: 2,
      sanskrit: "योगश्चित्तवृत्तिनिरोधः ॥",
      transliteration: "yogaś citta-vṛtti-nirodhaḥ",
      translation: "Yoga is the restraint of the modifications of the mind-stuff.",
      translator: vivekananda,
      citation: "Yoga Sutras 1.2",
      context:
        "The definition-sutra of Patanjali. Vivekananda's 1896 English ('mind-stuff') is interpretive. Later scholars debate nirodha: cessation, stilling, or governing.",
      themeSlugs: ["discipline", "self-knowledge", "equanimity"],
      commentaries: [
        {
          tradition: "Classical Yoga",
          kind: "traditional",
          body: "Citta's vrittis are the mind's turnings. Yoga is defined as their nirodha. What remains, for Patanjali, is the seer abiding in its own form (1.3) — a Yoga claim, not a Vedanta claim by default.",
        },
        {
          tradition: "Modern interpretation",
          kind: "modern",
          author: "SVARUPA editorial",
          body: "You are not identical with the next thought. Practice is less about emptying the mind by force and more about noticing that thoughts are movements.",
        },
      ],
    },
    {
      chapterId: ys1.id,
      number: 33,
      sanskrit:
        "मैत्रीकरुणामुदितोपेक्षाणां सुखदुःखपुण्यापुण्यविषयाणां भावनातश्चित्तप्रसादनम् ॥",
      transliteration:
        "maitrī-karuṇā-muditopekṣāṇāṃ sukha-duḥkha-puṇyāpuṇya-viṣayāṇāṃ bhāvanātaś citta-prasādanam",
      translation:
        "The mind becomes clear by cultivating friendliness toward the happy, compassion for the suffering, joy in the virtuous, and equanimity toward those who lack virtue. (After Woods, 1914, in contemporary English.)",
      translator: `${woods}, The Yoga System of Patanjali, 1914 (public domain), lightly modernized in diction only`,
      citation: "Yoga Sutras 1.33",
      context:
        "A practical instruction for serenity of citta, using four attitudes also known in Buddhist lists (the brahmaviharas). Yoga and Buddhist histories of this tetrad are related but not identical.",
      themeSlugs: ["relationships", "equanimity", "anger"],
      commentaries: [
        {
          tradition: "Classical Yoga",
          kind: "traditional",
          body: "These bhavanas are means for prasada (clarity, calm) of mind. They are attitudes toward others' conditions, not a personality rebrand.",
        },
        {
          tradition: "Modern interpretation",
          kind: "modern",
          author: "SVARUPA editorial",
          body: "Comparison often hardens into envy or contempt. This sutra offers another inner posture: friendliness, compassion, gladness, and a refusal to feed on others' faults.",
        },
      ],
    },
    {
      chapterId: ys2.id,
      number: 1,
      sanskrit: "तपःस्वाध्यायेश्वरप्रणिधानानि क्रियायोगः ॥",
      transliteration: "tapaḥ-svādhyāyeśvara-praṇidhānāni kriyā-yogaḥ",
      translation: "Kriya-yoga is tapas, self-study, and devotion to Ishvara.",
      translator: woods,
      citation: "Yoga Sutras 2.1",
      context:
        "Opens the sadhana pada. Kriya-yoga here is a triad, not the later trademarked breathing systems that borrowed the name. Ishvara-pranidhana is theologically thick; Yoga's Ishvara is not automatically the Krishna of the Gita.",
      themeSlugs: ["discipline", "devotion", "self-knowledge"],
      commentaries: [
        {
          tradition: "Classical Yoga",
          kind: "traditional",
          body: "Tapas (heat/austerity), svadhyaya (study, often of sacred sound), and Ishvara-pranidhana (placing oneself toward the Lord) are the yoga of action in this text.",
        },
        {
          tradition: "Modern interpretation",
          kind: "modern",
          author: "SVARUPA editorial",
          body: "A life of practice can be three simple returns: a little heat, a little honest study, a little placing of the will beyond the small stubborn 'I'.",
        },
      ],
    },
    {
      chapterId: ys2.id,
      number: 46,
      sanskrit: "स्थिरसुखमासनम् ॥",
      transliteration: "sthira-sukham āsanam",
      translation: "Posture is that which is steady and easy.",
      translator: woods,
      citation: "Yoga Sutras 2.46",
      context:
        "Asana in Patanjali is a seat stable enough for further practice, not a catalogue of modern studio poses. The two qualities are sthira (steady) and sukha (ease).",
      themeSlugs: ["discipline", "equanimity"],
      commentaries: [
        {
          tradition: "Classical Yoga",
          kind: "traditional",
          body: "The body is arranged so the mind can become still. Strain that destroys ease is not the asana Patanjali names.",
        },
        {
          tradition: "Modern interpretation",
          kind: "modern",
          author: "SVARUPA editorial",
          body: "A practice seat — including a chair — is enough if you can remain. Heroic discomfort is not the point.",
        },
      ],
    },
    {
      chapterId: ram1.id,
      number: 1,
      sanskrit:
        "तपःस्वाध्यायनिरतं तपस्वी वाग्विदां वरम् ।\nनारदं परिपप्रच्छ वाल्मीकिर्मुनिपुङ्गवम् ॥",
      transliteration:
        "tapaḥ-svādhyāya-nirataṃ tapasvī vāgvidāṃ varam |\nnāradaṃ paripapraccha vālmīkir munipuṅgavam ||",
      translation:
        "The ascetic Valmiki asked Narada, the best of sages and foremost of those skilled in speech, who was devoted to austerity and study.",
      translator:
        "Ralph T. H. Griffith, The Rámáyan of Válmíki, 1870–74 (public domain), diction lightly updated",
      citation: "Valmiki Ramayana 1.1.1",
      context:
        "The epic begins with a question, not a conquest. Valmiki asks who in the world still joins virtue and strength. The poem that follows is one famous answer, endlessly retold.",
      themeSlugs: ["dharma", "devotion", "discipline"],
      commentaries: [
        {
          tradition: "Itihasa",
          kind: "traditional",
          body: "The opening frames the Ramayana as inquiry into an ideal person. Later bhakti readings hear Rama as divine; other readings hear a dharma-epic about a prince. Both histories exist.",
        },
        {
          tradition: "Modern interpretation",
          kind: "modern",
          author: "SVARUPA editorial",
          body: "A long story starts with asking who is worth becoming. That question remains usable even if you never open the rest of the poem today.",
        },
      ],
    },
  ];

  for (const v of verses) {
    const created = await db.scriptureVerse.create({
      data: {
        chapterId: v.chapterId,
        number: v.number,
        sanskrit: v.sanskrit,
        transliteration: v.transliteration,
        translation: v.translation,
        translator: v.translator,
        context: v.context,
        citation: v.citation,
        provenance: "verified",
        published: true,
      },
    });
    for (const slug of v.themeSlugs) {
      if (themes[slug]) {
        await db.verseTheme.create({ data: { verseId: created.id, themeId: themes[slug].id } });
      }
    }
    for (const c of v.commentaries) {
      await db.commentary.create({
        data: {
          verseId: created.id,
          tradition: c.tradition,
          kind: c.kind,
          author: c.author,
          body: c.body,
          citation: c.citation,
        },
      });
    }
  }

  await db.philosophicalTradition.createMany({
    data: [
      {
        slug: "gita",
        name: "Gita",
        sortOrder: 1,
        summary:
          "The Gita holds several yogas together — knowledge, action, devotion, meditation — inside a dramatic crisis of duty.",
        viewOnSuffering:
          "Arjuna's collapse is taken seriously. Suffering is met with teaching, not mockery. Grief, fear, and moral confusion are the opening condition.",
        viewOnSelf:
          "The text speaks of the embodied one and of a self that is not slain when the body is slain. How literally to take that is a commentarial decision.",
        viewOnPractice:
          "Action without clinging to fruit, evenness, and later chapters' devotion and meditation — a braided path, not a single technique.",
      },
      {
        slug: "vedanta",
        name: "Vedanta",
        sortOrder: 2,
        summary:
          "Vedanta names several schools reading the Upanishads. They agree that liberation and knowledge of Brahman matter, and disagree about the world's status and the self's relation to God.",
        viewOnSuffering:
          "Suffering is often analysed as ignorance (avidya) and misidentification. That analysis is philosophical, not a clinical diagnosis, and it is not shared in identical form by every Vedantin.",
        viewOnSelf:
          "Atman and Brahman are the centre of the argument. Identity, qualified identity, or difference — depending on the school.",
        viewOnPractice:
          "Hearing, reflection, and contemplation (shravana, manana, nididhyasana) in many Advaita accounts; devotion and surrender in others.",
      },
      {
        slug: "yoga",
        name: "Yoga",
        sortOrder: 3,
        summary:
          "Classical Yoga maps the mind's movements and a path of stilling them. It is allied with Sankhya metaphysics more than with Advaita, despite modern blending.",
        viewOnSuffering:
          "The sutras analyse kleśas (afflictions) such as ignorance, I-am-ness, attachment, aversion, and clinging to life. These are yogic categories, not DSM labels.",
        viewOnSelf:
          "Purusha is the seer, distinct from prakriti. Liberation is kaivalya — a Yoga goal that is not identical with Vedantic moksha in every respect.",
        viewOnPractice:
          "Abhyasa and vairagya; the eight limbs; kriya-yoga. Practice is gradual and ordinary as much as it is extraordinary.",
      },
      {
        slug: "sankhya",
        name: "Sankhya",
        sortOrder: 4,
        summary:
          "Sankhya enumerates the principles of experience. Consciousness (purusha) is many, nature (prakriti) evolves the world of experience.",
        viewOnSuffering:
          "Suffering belongs to the play of prakriti. Discriminative knowledge (viveka) of seer and seen is the proposed freedom.",
        viewOnSelf:
          "The self is a conscious witness, not the mind. There are many purushas in classical Sankhya — unlike Advaita's one atman-brahman.",
        viewOnPractice:
          "Knowing is the practice. Later yoga supplies much of the method people now associate with Sankhya ideas.",
      },
      {
        slug: "bhakti",
        name: "Bhakti",
        sortOrder: 5,
        summary:
          "Bhakti centres love and relationship with the divine. It is not one church. It includes quiet remembrance and public song, philosophy and folk life.",
        viewOnSuffering:
          "Separation (viraha) can itself be a form of love. Suffering is not always a riddle to be dissolved; it can be offered, sung, or shared.",
        viewOnSelf:
          "The self is a lover, a servant, a child, a friend — depending on the bhava. This is a different grammar from 'you are That', though some saints hold both.",
        viewOnPractice:
          "Name, prayer, remembrance, service, and the company of others. Practice is relational.",
      },
    ],
  });

  const concepts: [string, string, string, string, string][] = [
    ["dharma", "Dharma", "dharma", "In classical usage dharma can mean order, duty, law, virtue, or the teaching that holds a life. It is not a synonym for 'passion' or 'brand'.", "When you ask what you should do, you may be asking a dharma question: what holds, what is fitting, what is yours. The answer is rarely a slogan."],
    ["karma", "Karma", "karma", "Karma means action, and in many Indian philosophies the moral-psychological continuity of action. It is not a cosmic vending machine for Western 'vibes'.", "What you repeat becomes a path. That is close enough to live with, and far from a complete theory of justice."],
    ["moksha", "Moksha", "moksha", "Moksha names liberation from binding cycles of ignorance and rebirth in many Hindu systems. Schools disagree on its nature.", "You can want freedom from a cramped story of yourself without pretending you have finished the history of Indian soteriology."],
    ["atman", "Atman", "atman", "Atman is the self. In Vedanta it is often the true self as distinct from the empirical personality. Translation as 'soul' is imperfect.", "There may be more to you than the current mood. That sentence is a doorway, not a metaphysics exam."],
    ["brahman", "Brahman", "brahman", "Brahman is the absolute in Vedantic discourse — reality in its fullest designation. It is not a mascot.", "A modern reader might hear: the real is larger than your private plot. Traditional readers would say much more, and not all the same thing."],
    ["attachment", "Attachment (raga)", "attachment", "Raga, in Yoga, is the afflictive clinging that follows pleasure. The Gita speaks of sanga — association, attachment — especially to the fruit of acts.", "Love and clinging are not identical. The work is telling them apart without becoming cold."],
    ["desire", "Desire (kama)", "desire", "Kama is a legitimate aim of life in classical purusharthas, and also a force that can bind. Indian thought is not simply anti-desire.", "Wanting is information. The question is whether a desire is yours, or a borrowed hunger."],
    ["suffering", "Suffering (duhkha)", "suffering", "Duhkha is analysed in Yoga, Buddhism, and other Indian systems as dissatisfaction woven into conditioned life. It is not 'you are broken'.", "Pain can be a teacher without being a punishment. If pain is clinical or dangerous, that is a medical matter, not a verse."],
    ["svadharma", "Svadharma", "purpose", "In the Gita, svadharma is one's own dharma — often linked to situation and role. It has been misused to freeze social hierarchy. That misuse is part of its history.", "A careful modern reading: the life you can actually inhabit, rather than the costume of someone else's success. History still has to be faced."],
    ["equanimity", "Equanimity (samatva)", "equanimity", "Gita 2.48 names evenness as yoga. It is a trained relationship to success and failure, not a flat personality.", "You can care completely and still refuse to let one outcome become your name."],
    ["viveka", "Viveka", "self-knowledge", "Discriminative seeing — between the enduring and the passing, seer and seen — in Vedanta and Sankhya.", "Not every feeling is a final truth. Viveka is slow looking, not contempt for feeling."],
    ["bhakti-concept", "Bhakti", "devotion", "Bhakti is loving participation in the divine. It can be philosophical (Ramanuja) and vernacular (the poet-saints) at once.", "Devotion is a way of relating, not a performance of piety for others to score."],
  ];

  for (const [slug, name, themeSlug, traditional, modern] of concepts) {
    await db.wisdomConcept.create({
      data: {
        slug,
        name,
        themeId: themes[themeSlug]?.id,
        traditionalPerspective: traditional,
        modernInterpretation: modern,
        published: true,
      },
    });
  }

  const practices = [
    {
      slug: "breath-awareness",
      title: "Breath awareness",
      category: "breath",
      durationMin: 3,
      sortOrder: 1,
      sitQuestion: "What is the quality of this breath, without improving it?",
      description: "Sit with the breath as it is. No shaping. A way of arriving.",
      guidance: "If the mind leaves, that is not failure. Return once.",
      steps: ["Find a seat that is steady and kind to the body.", "Let the mouth close if that is comfortable.", "Feel one breath without changing it.", "When thought carries you, return to sensation."],
    },
    {
      slug: "box-breathing",
      title: "Box breathing",
      category: "breath",
      durationMin: 4,
      sortOrder: 2,
      description: "Equal counts of inhale, hold, exhale, hold. A structured way to settle the nervous system.",
      guidance: "Keep counts modest. If holding the breath feels wrong, return to natural breathing.",
      steps: ["Inhale for four.", "Hold for four.", "Exhale for four.", "Hold for four.", "Continue for a few minutes, then let the breath be ordinary."],
    },
    {
      slug: "nadi-shodhana",
      title: "Nadi Shodhana",
      category: "breath",
      durationMin: 6,
      sortOrder: 3,
      description: "Alternate-nostril breathing as taught in many modern yoga lineages. Presented here as a calming practice, not as a medical treatment.",
      guidance: "Skip if you have significant nasal, cardiac, or respiratory concerns, or if it simply feels unkind today.",
      steps: ["Sit steadily.", "Use a light hand position if you know it; otherwise simply notice left and right nostrils.", "Breathe slowly, without strain.", "Stop if dizzy."],
    },
    {
      slug: "two-minute-reset",
      title: "2 minute reset",
      category: "meditation",
      durationMin: 2,
      sortOrder: 4,
      description: "A short return. Not an achievement.",
      guidance: "Two minutes is enough to be two minutes.",
      steps: ["Stop what you are doing.", "Feel your feet or the seat.", "Take three unhurried breaths.", "Name one thing that is here."],
    },
    {
      slug: "five-minute-awareness",
      title: "5 minute awareness",
      category: "meditation",
      durationMin: 5,
      sortOrder: 5,
      description: "Open attention to sound, body, and thought, without chasing.",
      guidance: "You are practicing noticing, not emptying.",
      steps: ["Sit.", "Let sound come.", "Let sensation come.", "When a story starts, label it 'thinking' and return."],
    },
    {
      slug: "ten-minute-meditation",
      title: "10 minute meditation",
      category: "meditation",
      durationMin: 10,
      sortOrder: 6,
      description: "A longer sitting. The extra minutes are for staying, not for becoming someone else.",
      guidance: "Restlessness is part of the sitting.",
      steps: ["Choose a seat.", "Set a gentle timer.", "Stay with breath or sound.", "When the timer ends, do not lunge back into the day."],
    },
    {
      slug: "self-inquiry",
      title: "Self-inquiry",
      category: "meditation",
      durationMin: 8,
      sortOrder: 7,
      sitQuestion: "To whom is this thought appearing?",
      description: "A reflective looking, inspired by Vedantic questioning, without claiming Ramana's method as a brand exercise.",
      guidance: "This is inquiry, not self-attack. If distress rises, stop and rest.",
      steps: ["Sit quietly.", "Let a thought or feeling be present.", "Ask, gently: to whom is this appearing?", "Do not force an answer. Stay with the looking."],
    },
    {
      slug: "witnessing-thoughts",
      title: "Witnessing thoughts",
      category: "meditation",
      durationMin: 7,
      sortOrder: 8,
      description: "Watch thoughts as movements, closer to Yoga's vritti language than to analysis.",
      guidance: "No need to believe or disbelieve each thought.",
      steps: ["Sit.", "Notice the next thought.", "See it arise and pass.", "Return to the simple knowing that it appeared."],
    },
    {
      slug: "morning-reflection",
      title: "Morning reflection",
      category: "reflection",
      durationMin: 5,
      sortOrder: 9,
      sitQuestion: "How am I arriving?",
      description: "A few minutes to meet the day before the day assigns you a role.",
      guidance: "One honest sentence is enough.",
      steps: ["Sit with a cup or with nothing.", "Ask: how am I arriving?", "Ask: what is mine to do today, without theatre?", "Write one line if you wish."],
    },
    {
      slug: "evening-reflection",
      title: "Evening reflection",
      category: "reflection",
      durationMin: 8,
      sortOrder: 10,
      description: "Looking back without prosecuting yourself.",
      guidance: "This is not a performance review.",
      steps: ["What happened.", "What I felt.", "What I noticed.", "What I want to remember."],
    },
    {
      slug: "gratitude",
      title: "Gratitude",
      category: "reflection",
      durationMin: 4,
      sortOrder: 11,
      description: "Naming what was given, without forcing cheerfulness.",
      guidance: "If grief is present, do not paste gratitude over it.",
      steps: ["Name three ordinary things that held you today.", "Let one of them be very small.", "Stop before it becomes a list for show."],
    },
    {
      slug: "karma-yoga-practice",
      title: "Karma Yoga practice",
      category: "action",
      durationMin: 15,
      sortOrder: 12,
      sitQuestion: "Can I do this next action without using it to prove I am enough?",
      description: "Choose one ordinary task and do it without using the result as self-worth.",
      guidance: "Washing a vessel is enough. You do not need a heroic errand.",
      steps: ["Pick one task.", "Do it with full attention.", "Notice the wish to be seen or finished.", "Complete it, then stop."],
    },
    {
      slug: "mindful-action",
      title: "Mindful action",
      category: "action",
      durationMin: 10,
      sortOrder: 13,
      description: "Bring one daily movement — walking, cooking, sending a message — back into the body.",
      guidance: "Slower is not morally better. Present is enough.",
      steps: ["Choose one action.", "Feel the beginning of it.", "Stay for the middle.", "Notice the end."],
    },
    {
      slug: "seva-reflection",
      title: "Seva reflection",
      category: "action",
      durationMin: 6,
      sortOrder: 14,
      description: "A reflection on help given and help received, without saintliness.",
      guidance: "Seva is not self-erasure. It is also not content.",
      steps: ["Where did I help without keeping score?", "Where did I refuse help out of pride?", "What small act is actually available?"],
    },
    {
      slug: "soham-mantra",
      title: "So'ham breath",
      category: "devotion",
      durationMin: 5,
      sortOrder: 15,
      description: "A simple pairing of breath and the so'ham remembrance used in several yogic and Vedantic settings. Not an initiation.",
      guidance: "If mantra feels wrong today, breathe without words.",
      steps: ["Inhale, silently 'so'.", "Exhale, silently 'ham'.", "Keep it soft.", "Let it dissolve into ordinary breath."],
    },
    {
      slug: "bhakti-contemplation",
      title: "Bhakti contemplation",
      category: "devotion",
      durationMin: 8,
      sortOrder: 16,
      description: "Sit with love, gratitude, or longing directed toward whatever you hold as larger than the private self.",
      guidance: "You do not need a correct theology to be sincere. You also do not need to pretend belief.",
      steps: ["Sit.", "Bring to mind a presence, a name, or simple light.", "Let feeling be as it is.", "End with one ordinary kindness."],
    },
  ];

  const practiceRecords = [];
  for (const p of practices) {
    practiceRecords.push(
      await db.practice.create({
        data: {
          ...p,
          steps: JSON.stringify(p.steps),
        },
      }),
    );
  }
  const practiceBySlug = Object.fromEntries(practiceRecords.map((p) => [p.slug, p]));

  const templates = [
    {
      name: "Morning stillness",
      timeOfDay: "morning",
      durationMin: 5,
      description: "Five quiet minutes before the day makes claims.",
      items: [
        { title: "2 min breathing", durationMin: 2, practice: "breath-awareness" },
        { title: "2 min silence", durationMin: 2, practice: "two-minute-reset" },
        { title: "1 min reflection", durationMin: 1, practice: "morning-reflection" },
      ],
    },
    {
      name: "Evening Sadhana",
      timeOfDay: "evening",
      durationMin: 10,
      description: "A gentle close: writing, gratitude, a short reading.",
      items: [
        { title: "Journal", durationMin: 5, practice: "evening-reflection" },
        { title: "Gratitude", durationMin: 3, practice: "gratitude" },
        { title: "Scripture reading", durationMin: 2, practice: "five-minute-awareness" },
      ],
    },
    {
      name: "Breath and inquiry",
      timeOfDay: "morning",
      durationMin: 8,
      description: "Settle the body, then look.",
      items: [
        { title: "Nadi Shodhana", durationMin: 4, practice: "nadi-shodhana" },
        { title: "Self-inquiry", durationMin: 4, practice: "self-inquiry" },
      ],
    },
    {
      name: "Karma Yoga day",
      timeOfDay: "custom",
      durationMin: 15,
      description: "One ordinary task, done without using it as proof.",
      items: [
        { title: "Mindful action", durationMin: 5, practice: "mindful-action" },
        { title: "Karma Yoga practice", durationMin: 10, practice: "karma-yoga-practice" },
      ],
    },
    {
      name: "Sunday reading",
      timeOfDay: "custom",
      durationMin: 15,
      description: "A slower hour for a verse and a sit.",
      items: [
        { title: "Sit", durationMin: 5, practice: "five-minute-awareness" },
        { title: "Read", durationMin: 7, practice: "ten-minute-meditation" },
        { title: "Write", durationMin: 3, practice: "evening-reflection" },
      ],
    },
  ];

  for (const t of templates) {
    const s = await db.sadhana.create({
      data: {
        name: t.name,
        timeOfDay: t.timeOfDay,
        durationMin: t.durationMin,
        isTemplate: true,
        status: "template",
        description: t.description,
      },
    });
    let order = 0;
    for (const item of t.items) {
      await db.sadhanaItem.create({
        data: {
          sadhanaId: s.id,
          order: order++,
          title: item.title,
          durationMin: item.durationMin,
          practiceId: practiceBySlug[item.practice]?.id,
        },
      });
    }
  }

  await db.journalPrompt.createMany({
    data: [
      { text: "What are you trying to control that may not be yours to control?", category: "control" },
      { text: "What would you pursue if you stopped measuring your life against someone else's timeline?", category: "comparison" },
      { text: "How are you arriving?", category: "checkin" },
      { text: "What feeling have you been unwilling to name?", category: "emotion" },
      { text: "Where did you act from fear today?", category: "fear" },
      { text: "What would today's work look like if it did not have to prove your worth?", category: "work" },
      { text: "What is the smallest practice you could return to without turning it into a verdict?", category: "discipline" },
      { text: "What in this loss still wants to be spoken?", category: "grief" },
      { text: "If no one were watching, what would still matter?", category: "purpose" },
      { text: "What is this anger asking you to protect?", category: "anger" },
      { text: "Where did clinging dress itself up as love?", category: "attachment" },
      { text: "What do you already know, and keep postponing?", category: "self-knowledge" },
    ],
  });

  const passwordHash = await bcrypt.hash("lookwithin", 12);
  const demo = await db.user.create({
    data: {
      email: "demo@svarupa.app",
      passwordHash,
      name: "Asha",
      role: "user",
      onboardingCompleted: true,
      emailVerified: new Date(),
    },
  });
  await db.user.create({
    data: {
      email: "admin@svarupa.app",
      passwordHash,
      name: "SVARUPA editor",
      role: "admin",
      onboardingCompleted: true,
      emailVerified: new Date(),
    },
  });

  await db.userPreference.create({
    data: {
      userId: demo.id,
      aiTone: "reflective",
      philosophyFamiliarity: "some",
      reasons: JSON.stringify(["understand", "clarity", "philosophy"]),
      exploreTopics: JSON.stringify(["Purpose", "Comparison", "Work", "Attachment"]),
      notificationsEnabled: true,
    },
  });

  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);

  await db.emotionalCheckin.createMany({
    data: [
      { userId: demo.id, emotion: "Restless", createdAt: daysAgo(0) },
      { userId: demo.id, emotion: "Hopeful", createdAt: daysAgo(1) },
      { userId: demo.id, emotion: "Overwhelmed", createdAt: daysAgo(3) },
      { userId: demo.id, emotion: "Curious", createdAt: daysAgo(5) },
      { userId: demo.id, emotion: "Lost", createdAt: daysAgo(12) },
    ],
  });

  const session1 = await db.reflectionSession.create({
    data: {
      userId: demo.id,
      title: "Wasting my life",
      status: "completed",
      excerpt: "I feel like I'm wasting my life.",
      state: JSON.stringify({
        stage: "practice",
        turn: 4,
        themes: ["purpose"],
        emotion: "Fear",
        trigger: "A sense that time is passing without meaning",
        concern: "That this life is being spent on the wrong things",
        tension: "Expectation vs. personal direction",
        sitQuestion: "What would you pursue if you stopped measuring your life against someone else's timeline?",
        verseSlug: "bhagavad-gita-2-47",
      }),
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
    },
  });
  await db.reflectionMessage.createMany({
    data: [
      {
        sessionId: session1.id,
        role: "user",
        content: "I feel like I'm wasting my life.",
        createdAt: daysAgo(2),
      },
      {
        sessionId: session1.id,
        role: "assistant",
        content: "Before we try to answer that, let's understand what “wasting your life” means to you.\n\nWhich feels closer?",
        chips: JSON.stringify([
          "I'm not progressing",
          "I'm not doing what I love",
          "I'm disappointing people",
          "I'm afraid time is running out",
          "I don't know",
        ]),
        createdAt: daysAgo(2),
      },
      {
        sessionId: session1.id,
        role: "user",
        content: "I'm afraid time is running out",
        createdAt: daysAgo(2),
      },
      {
        sessionId: session1.id,
        role: "assistant",
        kind: "insight",
        content:
          "That sentence often carries more than one feeling — grief for unused time, comparison with other people's pace, and a quiet fear that the right life is elsewhere.\n\nI won't treat this as a diagnosis. It is simply what seems to be coming into view.",
        createdAt: daysAgo(2),
      },
    ],
  });
  await db.reflectionInsight.create({
    data: {
      sessionId: session1.id,
      emotion: "Fear",
      trigger: "Comparison with others' pace",
      concern: "Fear that time is running out",
      theme: "Purpose",
      summary: "This may suggest a tension between expectation and personal direction.",
    },
  });

  const session2 = await db.reflectionSession.create({
    data: {
      userId: demo.id,
      title: "Everyone is moving ahead",
      status: "active",
      excerpt: "I feel like everyone is moving ahead while I'm stuck.",
      state: JSON.stringify({
        stage: "clarify",
        turn: 1,
        themes: ["comparison", "purpose"],
        emotion: "Uncertainty",
        trigger: "Comparison with others",
        concern: "Fear of falling behind",
      }),
      createdAt: daysAgo(0),
      updatedAt: daysAgo(0),
    },
  });
  await db.reflectionMessage.createMany({
    data: [
      {
        sessionId: session2.id,
        role: "user",
        content: "I feel like everyone is moving ahead while I'm stuck.",
      },
      {
        sessionId: session2.id,
        role: "assistant",
        content:
          "It sounds like this may be about more than progress itself. There may also be a feeling of comparison, or a fear that you're falling behind.\n\nWhich feels closer?",
        chips: JSON.stringify([
          "I'm afraid I'm falling behind",
          "I don't know what I actually want",
          "I know what I want but can't reach it",
          "I just feel lost",
        ]),
      },
    ],
  });

  const j1 = await db.journalEntry.create({
    data: {
      userId: demo.id,
      date: daysAgo(1),
      howIArrived: "Restless, a little ashamed of the restlessness.",
      whatHappened: "A colleague announced a role I thought I wanted.",
      whatIFelt: "Heat in the chest. Then a drop, as if I had been found out.",
      whatINoticed: "I started rewriting my whole year in my head.",
      whatIWantToRemember: "The envy arrived before the facts.",
      favorite: true,
      emotionTags: JSON.stringify(["Restless", "Lost"]),
      source: "journal",
    },
  });
  await db.journalTheme.create({ data: { journalId: j1.id, themeId: themes.comparison.id } });
  await db.journalTheme.create({ data: { journalId: j1.id, themeId: themes.work.id } });

  const j2 = await db.journalEntry.create({
    data: {
      userId: demo.id,
      date: daysAgo(6),
      howIArrived: "Tired.",
      whatHappened: "I stayed late to finish something no one asked me to polish.",
      whatIFelt: "Useful. Then empty.",
      whatINoticed: "The extra hour was for being seen, not for the work.",
      whatIWantToRemember: "Usefulness is not the same as being here.",
      emotionTags: JSON.stringify(["Overwhelmed"]),
      source: "journal",
    },
  });
  await db.journalTheme.create({ data: { journalId: j2.id, themeId: themes.control.id } });
  await db.journalTheme.create({ data: { journalId: j2.id, themeId: themes.work.id } });

  const j3 = await db.journalEntry.create({
    data: {
      userId: demo.id,
      date: daysAgo(20),
      howIArrived: "Soft.",
      whatHappened: "A walk after rain. Nothing notable.",
      whatIFelt: "Unimportant, in a good way.",
      whatINoticed: "I wasn't measuring the walk.",
      whatIWantToRemember: "Not everything has to become a lesson.",
      emotionTags: JSON.stringify(["Peaceful", "Grateful"]),
      source: "sit",
      sitQuestion: "If no one were watching, what would still matter?",
    },
  });
  await db.journalTheme.create({ data: { journalId: j3.id, themeId: themes.purpose.id } });

  const evening = await db.sadhana.create({
    data: {
      userId: demo.id,
      name: "Evening Sadhana",
      timeOfDay: "evening",
      durationMin: 10,
      status: "active",
      isTemplate: false,
      description: "Journal, gratitude, a short reading.",
    },
  });
  await db.sadhanaItem.createMany({
    data: [
      { sadhanaId: evening.id, order: 0, title: "Journal", durationMin: 5, practiceId: practiceBySlug["evening-reflection"].id },
      { sadhanaId: evening.id, order: 1, title: "Gratitude", durationMin: 3, practiceId: practiceBySlug.gratitude.id },
      { sadhanaId: evening.id, order: 2, title: "Scripture reading", durationMin: 2, practiceId: practiceBySlug["five-minute-awareness"].id },
    ],
  });

  await db.practiceSession.createMany({
    data: [
      { userId: demo.id, sadhanaId: evening.id, durationMin: 10, completedAt: daysAgo(1) },
      { userId: demo.id, practiceId: practiceBySlug["breath-awareness"].id, durationMin: 3, completedAt: daysAgo(0) },
      { userId: demo.id, practiceId: practiceBySlug["karma-yoga-practice"].id, durationMin: 15, completedAt: daysAgo(4) },
    ],
  });

  const gita247 = await db.scriptureVerse.findFirst({
    where: { citation: "Bhagavad Gita 2.47" },
  });
  if (gita247) {
    await db.savedWisdom.create({
      data: { userId: demo.id, verseId: gita247.id, note: "For the days when the result is screaming." },
    });
  }

  await db.weeklyReflection.create({
    data: {
      userId: demo.id,
      weekStart: daysAgo(7),
      summary: "You reflected most often on uncertainty, work and control.",
      whatChanged: "The language got more precise. 'Behind' became 'afraid of being unseen'.",
      whatRepeated: "Work as a place to prove worth. Comparison after other people's news.",
      whatSurprised: "A walk that did not need to become insight.",
      carryForward: "Do the next thing without using it as proof.",
    },
  });

  const stats: [string, number, string][] = [
    ["purpose", 10, "2026-09"],
    ["control", 8, "2026-09"],
    ["comparison", 6, "2026-09"],
    ["relationships", 5, "2026-09"],
    ["discipline", 4, "2026-09"],
    ["work", 7, "2026-08"],
    ["control", 9, "2026-08"],
    ["purpose", 4, "2026-08"],
    ["relationships", 8, "2026-07"],
    ["attachment", 5, "2026-07"],
  ];
  for (const [slug, count, monthKey] of stats) {
    await db.userThemeStat.create({
      data: {
        userId: demo.id,
        themeId: themes[slug].id,
        count,
        monthKey,
        lastSeen: now,
      },
    });
  }

  console.log("SVARUPA seed complete.");
  console.log("Demo: demo@svarupa.app / lookwithin");
  console.log("Admin: admin@svarupa.app / lookwithin");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
