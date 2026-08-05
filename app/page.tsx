"use client";

import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";

type Language = "he" | "en";
type Emphasis = "research" | "ai" | "theatre";
type Tone = "clear" | "experimental";
type Density = "brief" | "rich";
type Audience = "academic" | "public" | "organizations";
type Goal = "collaboration" | "talk" | "explore";

type Config = {
  language: Language;
  emphasis: Emphasis;
  tone: Tone;
  density: Density;
  audience: Audience;
  goal: Goal;
};

const defaultConfig: Config = {
  language: "he",
  emphasis: "research",
  tone: "experimental",
  density: "rich",
  audience: "academic",
  goal: "collaboration",
};

const copy = {
  he: {
    prototype: "אב־טיפוס לשיחת אפיון · התוכן טרם אושר לפרסום",
    name: "ד״ר ליאור נוי",
    nav: ["מחקר", "פרויקטים", "תיאטרון", "אודות"],
    characterize: "מצב אפיון",
    intro: "חוקר אינטראקציות יצירתיות",
    hero: {
      research: ["איך יצירתיות", "נוצרת בינינו?"],
      ai: ["מה קורה כשאדם", "ו־AI יוצרים יחד?"],
      theatre: ["בין מדע", "לאימפרוביזציה"],
    },
    heroBody: {
      academic: "ליאור נוי חוקר כיצד תנועה, סנכרון, חיפוש ואלתור הופכים פעולה משותפת ליצירה חדשה.",
      public: "ליאור נוי משתמש במשחקים, תנועה ואימפרוביזציה כדי להבין איך רעיונות חדשים נוצרים בין אנשים — ובין אדם למכונה.",
      organizations: "מחקר, הוראה וסדנאות על התנאים שמאפשרים לאנשים לחשוב, להקשיב וליצור יחד.",
    },
    cta: {
      collaboration: "הצעה לשיתוף פעולה",
      talk: "הזמנת הרצאה או סדנה",
      explore: "למחקרים הנבחרים",
    },
    scroll: "גלו את החיבורים",
    thesisLabel: "שאלת המחקר",
    thesis: "האם אפשר לבנות תאוריה חישובית של אינטראקציות יצירתיות?",
    thesisBody: "העבודה נעה בין מדעי המחשב, פסיכולוגיה קוגניטיבית, מדעי המוח, תנועה ואמנויות הבמה — ומפתחת דרכים למדוד את מה שמתרחש כשאנשים ממציאים משהו יחד.",
    threeLenses: "שלוש עדשות על יצירה משותפת",
    lenses: [
      ["01", "סנכרון", "כיצד שני אנשים מתאמים תנועה בלי מנהיג מוגדר — ומתי דווקא היציאה מסנכרון פותחת אפשרות לחידוש."],
      ["02", "חיפוש", "כיצד אנחנו נעים בין חקירה של אפשרויות חדשות לבין מיצוי של רעיון שכבר מצאנו."],
      ["03", "שותף מלאכותי", "כיצד סוכן AI יכול להשתתף באלתור, לא רק להגיב — ומה משתנה בתהליך היצירתי האנושי."],
    ],
    mirrorHint: "הזיזו את הסמן. שתי נקודות, תנועה אחת — בלי מוביל קבוע.",
    selected: "עבודות נבחרות",
    works: [
      ["The Mirror Game", "2011", "פרדיגמה כמותית לחקר אלתור משותף. שני אנשים יוצרים תנועה מורכבת ומסונכרנת ללא מנהיג מוגדר.", "תנועה · יחד"],
      ["Creative Foraging", "2017", "משחק מחקרי החושף כיצד אנשים עוברים בין חיפוש כיוונים חדשים לבין פיתוח רעיונות קיימים.", "חיפוש · יצירתיות"],
      ["Playing Along", "2025", "סוכני AI משתתפים במשחק Yes, and… וביצירה משותפת של סיפורים מאולתרים עם בני אדם.", "אדם · AI"],
    ],
    aiKicker: "מחקר עדכני",
    aiTitle: "יצירתיות אינה פלט. היא מערכת יחסים.",
    aiBody: "המחקרים העדכניים בוחנים לא רק אם AI יכול לייצר תוצאה יצירתית, אלא אם הוא יכול להיות שותף: להקשיב, להפתיע, להמשיך רעיון ולשנות את מסלול החיפוש המשותף.",
    aiTags: ["Human–AI Co‑creation", "Yes, and…", "Creative Foraging", "Playful Interaction"],
    theatreKicker: "THEATRE LAB · מאז 2011",
    theatreTitle: "הבמה כמעבדה. המעבדה כבמה.",
    theatreBody: "ליאור הוא ממייסדי מעבדת התיאטרון במכון ויצמן, שחיברה בין כלים מפיזיקה ומדעי המחשב לבין ידע מעשי מאימפרוביזציה ו־Playback Theatre. משחקי במה הפכו לפרדיגמות מדעיות לחקר togetherness, פעולה דרמטית ויצירתיות.",
    quote: "הקשבה, יצירתיות ושיתוף פעולה אינם רק ערכים. הם גם חומר למחקר.",
    aboutKicker: "אודות",
    aboutTitle: "חוקר, מרצה ואיש אימפרוביזציה.",
    aboutBody: "ד״ר ליאור נוי הוא סגן ראש בית הספר לטכנולוגיה ומדעים בקריה האקדמית אונו. הוא בעל דוקטורט במדעי המחשב ממכון ויצמן ורקע בפסיכולוגיה קוגניטיבית, מדעי המוח החישוביים ורובוטיקה. מחקריו עוסקים באינטראקציות יצירתיות בין אנשים ובין בני אדם לסוכנים מלאכותיים.",
    roles: ["סגן ראש בית הספר לטכנולוגיה ומדעים, אונו", "ממייסדי Theatre Lab, מכון ויצמן", "חוקר ומורה ל־Playback Theatre"],
    linksTitle: "להמשך חקירה",
    publications: "פרסומים",
    scholar: "Google Scholar",
    orcid: "ORCID",
    contact: "יצירת קשר",
    footer: "פרוטוטייפ לשיחה · אוגוסט 2026",
    panel: {
      title: "בואו נאפיין דרך המוצר",
      body: "שנו את הבחירות יחד עם ליאור וראו כיצד הסיפור, הדגש והקצב של האתר משתנים.",
      close: "סגירה",
      reset: "איפוס",
      copy: "העתקת סיכום",
      copied: "הסיכום הועתק",
      questions: ["מה מוביל את הסיפור?", "למי מדברים קודם?", "איך האתר צריך להרגיש?", "כמה תוכן להציג?", "מה הפעולה המרכזית?"],
      options: {
        emphasis: ["המחקר", "אדם–AI", "תיאטרון"],
        audience: ["אקדמיה", "ציבור רחב", "ארגונים"],
        tone: ["בהיר וישיר", "ניסיוני"],
        density: ["תמציתי", "עשיר"],
        goal: ["שיתוף פעולה", "הרצאה/סדנה", "קריאת מחקרים"],
      },
      note: "הבחירות נשמרות רק במכשיר הזה ומשמשות לשיחה — לא כטופס שנשלח.",
    },
  },
  en: {
    prototype: "Characterization prototype · content not yet approved for publication",
    name: "Dr. Lior Noy",
    nav: ["Research", "Projects", "Theatre", "About"],
    characterize: "Characterize",
    intro: "Researching creative interactions",
    hero: {
      research: ["How does creativity", "emerge between us?"],
      ai: ["What happens when humans", "and AI create together?"],
      theatre: ["Between science", "and improvisation"],
    },
    heroBody: {
      academic: "Lior Noy studies how movement, synchrony, search and improvisation turn joint action into something new.",
      public: "Lior Noy uses games, movement and improvisation to understand how new ideas emerge between people — and between human and machine.",
      organizations: "Research, teaching and workshops on the conditions that help people think, listen and create together.",
    },
    cta: {
      collaboration: "Propose a collaboration",
      talk: "Invite a talk or workshop",
      explore: "Explore selected research",
    },
    scroll: "Explore the connections",
    thesisLabel: "Research question",
    thesis: "Can we build a computational theory of creative interactions?",
    thesisBody: "The work moves between computer science, cognitive psychology, neuroscience, movement and performance — developing ways to measure what happens when people invent something together.",
    threeLenses: "Three lenses on co-creation",
    lenses: [
      ["01", "Synchrony", "How two people coordinate movement without a designated leader — and when leaving synchrony creates room for novelty."],
      ["02", "Search", "How we alternate between exploring new possibilities and developing an idea we have already found."],
      ["03", "Artificial partner", "How an AI agent can join improvisation rather than merely respond — and how this changes human creative search."],
    ],
    mirrorHint: "Move the pointer. Two points, one motion — without a fixed leader.",
    selected: "Selected work",
    works: [
      ["The Mirror Game", "2011", "A quantitative paradigm for joint improvisation. Two people create complex synchronized motion without a designated leader.", "Motion · Togetherness"],
      ["Creative Foraging", "2017", "An experimental game revealing how people alternate between searching for new directions and developing existing ideas.", "Search · Creativity"],
      ["Playing Along", "2025", "AI agents join the Yes, and… game to co-create improvised stories with human partners.", "Human · AI"],
    ],
    aiKicker: "Current research",
    aiTitle: "Creativity is not an output. It is a relationship.",
    aiBody: "Current work asks not only whether AI can produce a creative result, but whether it can become a partner: listen, surprise, continue an idea and redirect a shared search.",
    aiTags: ["Human–AI Co‑creation", "Yes, and…", "Creative Foraging", "Playful Interaction"],
    theatreKicker: "THEATRE LAB · SINCE 2011",
    theatreTitle: "The stage as a lab. The lab as a stage.",
    theatreBody: "Lior co-founded the Theatre Lab at the Weizmann Institute, combining tools from physics and computer science with practical knowledge from improvisation and Playback Theatre. Theatre games became scientific paradigms for studying togetherness, dramatic action and creativity.",
    quote: "Listening, creativity and cooperation are not only values. They are also material for research.",
    aboutKicker: "About",
    aboutTitle: "Researcher, lecturer and improviser.",
    aboutBody: "Dr. Lior Noy is Deputy Head of the School of Science and Technology at Ono Academic College. He holds a PhD in computer science from the Weizmann Institute and has a background in cognitive psychology, computational neuroscience and robotics. His work explores creative interactions between people and with artificial agents.",
    roles: ["Deputy Head, School of Science and Technology, Ono", "Co-founder, Theatre Lab, Weizmann Institute", "Playback Theatre practitioner and teacher"],
    linksTitle: "Continue exploring",
    publications: "Publications",
    scholar: "Google Scholar",
    orcid: "ORCID",
    contact: "Contact",
    footer: "Conversation prototype · August 2026",
    panel: {
      title: "Characterize through the product",
      body: "Change these choices with Lior and watch the site’s story, emphasis and rhythm respond.",
      close: "Close",
      reset: "Reset",
      copy: "Copy summary",
      copied: "Summary copied",
      questions: ["What leads the story?", "Who do we speak to first?", "How should it feel?", "How much should we show?", "What is the main action?"],
      options: {
        emphasis: ["Research", "Human–AI", "Theatre"],
        audience: ["Academia", "General public", "Organizations"],
        tone: ["Clear & direct", "Experimental"],
        density: ["Concise", "Rich"],
        goal: ["Collaboration", "Talk/workshop", "Read research"],
      },
      note: "Choices stay on this device and support the conversation — nothing is submitted.",
    },
  },
} as const;

const workLinks = [
  "https://doi.org/10.1073/pnas.1108155108",
  "https://doi.org/10.1371/journal.pone.0182133",
  "https://idanvidra.github.io/playing_along_paper_site/",
];

function OptionGroup<T extends string>({
  values,
  labels,
  value,
  onChange,
}: {
  values: readonly T[];
  labels: readonly string[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="option-group">
      {values.map((item, index) => (
        <button
          type="button"
          className={value === item ? "is-selected" : ""}
          aria-pressed={value === item}
          key={item}
          onClick={() => onChange(item)}
        >
          {labels[index]}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [panelOpen, setPanelOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mirror, setMirror] = useState({ x: 34, y: 50 });
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lior-noy-prototype-config");
      if (saved) setConfig({ ...defaultConfig, ...JSON.parse(saved) });
    } catch {
      // The prototype remains fully usable without local storage.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = config.language;
    document.documentElement.dir = config.language === "he" ? "rtl" : "ltr";
    try {
      localStorage.setItem("lior-noy-prototype-config", JSON.stringify(config));
    } catch {
      // Local persistence is a convenience, not a requirement.
    }
  }, [config]);

  const t = copy[config.language];
  const isRtl = config.language === "he";
  const headline = t.hero[config.emphasis];
  const rich = config.density === "rich";

  const update = <K extends keyof Config>(key: K, value: Config[K]) =>
    setConfig((current) => ({ ...current, [key]: value }));

  const summary = useMemo(() => {
    const p = t.panel.options;
    const find = <T extends string>(values: readonly T[], labels: readonly string[], value: T) =>
      labels[values.indexOf(value)];
    return [
      `${t.panel.questions[0]} ${find(["research", "ai", "theatre"], p.emphasis, config.emphasis)}`,
      `${t.panel.questions[1]} ${find(["academic", "public", "organizations"], p.audience, config.audience)}`,
      `${t.panel.questions[2]} ${find(["clear", "experimental"], p.tone, config.tone)}`,
      `${t.panel.questions[3]} ${find(["brief", "rich"], p.density, config.density)}`,
      `${t.panel.questions[4]} ${find(["collaboration", "talk", "explore"], p.goal, config.goal)}`,
    ].join("\n");
  }, [config, t]);

  const copySummary = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleMirror = (event: PointerEvent<HTMLDivElement>) => {
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMirror({
      x: Math.max(8, Math.min(46, ((event.clientX - rect.left) / rect.width) * 50)),
      y: Math.max(12, Math.min(88, ((event.clientY - rect.top) / rect.height) * 100)),
    });
  };

  return (
    <main
      className="site-shell"
      data-emphasis={config.emphasis}
      data-tone={config.tone}
      data-density={config.density}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="prototype-strip">{t.prototype}</div>

      <header className="topbar">
        <a className="wordmark" href="#top" aria-label={t.name}>
          <span className="wordmark-dot" />
          {t.name}
        </a>
        <nav aria-label={isRtl ? "ניווט ראשי" : "Main navigation"}>
          {t.nav.map((item, index) => (
            <a key={item} href={["#research", "#projects", "#theatre", "#about"][index]}>
              {item}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className="language-toggle"
            onClick={() => update("language", config.language === "he" ? "en" : "he")}
            aria-label={isRtl ? "Switch to English" : "מעבר לעברית"}
          >
            {isRtl ? "EN" : "עב"}
          </button>
          <button type="button" className="characterize-button" onClick={() => setPanelOpen(true)}>
            <span /> {t.characterize}
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-index" aria-hidden="true">01 — 07</div>
        <div className="hero-copy">
          <p className="eyebrow">{t.intro}</p>
          <h1>
            <span>{headline[0]}</span>
            <span className="outlined">{headline[1]}</span>
          </h1>
          <div className="hero-bottom">
            <p>{t.heroBody[config.audience]}</p>
            <a className="arrow-link" href={config.goal === "explore" ? "#projects" : "#contact"}>
              {t.cta[config.goal]} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="portrait-wrap">
          <div className="portrait-frame">
            <img src="/lior-noy.jpg" alt={t.name} />
            <div className="portrait-scan" aria-hidden="true" />
          </div>
          <span className="portrait-credit">PHOTO · ONO ACADEMIC COLLEGE</span>
        </div>
        <a className="scroll-cue" href="#research">{t.scroll} ↓</a>
      </section>

      <section className="thesis section-pad" id="research">
        <div className="section-marker"><span>02</span><span>{t.thesisLabel}</span></div>
        <div className="thesis-content">
          <h2>{t.thesis}</h2>
          {rich && <p>{t.thesisBody}</p>}
        </div>
      </section>

      <section className="lenses section-pad">
        <div className="section-title-row">
          <h2>{t.threeLenses}</h2>
          <span className="tiny-label">RESEARCH AXES / 03</span>
        </div>
        <div className="lens-grid">
          {t.lenses.map(([number, title, body]) => (
            <article className="lens-card" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              {rich && <p>{body}</p>}
              <div className="lens-line" aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="mirror-section" aria-label={isRtl ? "הדגמה אינטראקטיבית של משחק המראה" : "Interactive mirror game demonstration"}>
        <div
          className="mirror-field"
          ref={fieldRef}
          onPointerMove={handleMirror}
          onPointerLeave={() => setMirror({ x: 34, y: 50 })}
        >
          <div className="mirror-axis" />
          <div className="trace trace-left" />
          <div className="trace trace-right" />
          <div className="mirror-dot dot-a" style={{ left: `${mirror.x}%`, top: `${mirror.y}%` }} />
          <div className="mirror-dot dot-b" style={{ left: `${100 - mirror.x}%`, top: `${mirror.y}%` }} />
          <span className="player-label player-a">A</span>
          <span className="player-label player-b">B</span>
          <p>{t.mirrorHint}</p>
        </div>
      </section>

      <section className="works section-pad" id="projects">
        <div className="section-marker"><span>03</span><span>{t.selected}</span></div>
        <div className="work-list">
          {t.works.map(([title, year, body, tag], index) => (
            <a className="work-item" href={workLinks[index]} target="_blank" rel="noreferrer" key={title}>
              <span className="work-number">0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                {rich && <p>{body}</p>}
              </div>
              <div className="work-meta"><span>{tag}</span><strong>{year}</strong></div>
              <span className="work-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="ai-feature section-pad">
        <div className="ai-orbit" aria-hidden="true">
          <span className="orbit-human">H</span>
          <span className="orbit-ai">AI</span>
          <i />
        </div>
        <div className="feature-copy">
          <p className="eyebrow">{t.aiKicker}</p>
          <h2>{t.aiTitle}</h2>
          <p>{t.aiBody}</p>
          <div className="tag-row">
            {t.aiTags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </section>

      <section className="theatre section-pad" id="theatre">
        <div className="theatre-number" aria-hidden="true">2011</div>
        <div className="theatre-copy">
          <p className="eyebrow">{t.theatreKicker}</p>
          <h2>{t.theatreTitle}</h2>
          <p>{t.theatreBody}</p>
        </div>
        <blockquote>{t.quote}</blockquote>
      </section>

      <section className="about section-pad" id="about">
        <div className="about-photo"><img src="/lior-noy.jpg" alt="" /></div>
        <div className="about-copy">
          <p className="eyebrow">{t.aboutKicker}</p>
          <h2>{t.aboutTitle}</h2>
          <p>{t.aboutBody}</p>
          <ul>{t.roles.map((role) => <li key={role}>{role}</li>)}</ul>
        </div>
      </section>

      <section className="links-section section-pad" id="contact">
        <p className="eyebrow">{t.linksTitle}</p>
        <div className="big-links">
          <a href="https://scholar.google.com/citations?user=-w05QJkAAAAJ&hl=en" target="_blank" rel="noreferrer">{t.scholar}<span>↗</span></a>
          <a href="https://orcid.org/0000-0001-8505-3889" target="_blank" rel="noreferrer">{t.orcid}<span>↗</span></a>
          <a href="mailto:lior.noy.1@gmail.com">{t.contact}<span>↗</span></a>
        </div>
      </section>

      <footer><span>{t.name}</span><span>{t.footer}</span><button type="button" onClick={() => setPanelOpen(true)}>{t.characterize} +</button></footer>

      <button
        className="floating-characterize"
        type="button"
        onClick={() => setPanelOpen(true)}
        aria-label={t.characterize}
      >
        <span>?</span><b>{t.characterize}</b>
      </button>

      <div className={`panel-backdrop ${panelOpen ? "is-open" : ""}`} onClick={() => setPanelOpen(false)} />
      <aside className={`characterization-panel ${panelOpen ? "is-open" : ""}`} aria-hidden={!panelOpen}>
        <div className="panel-head">
          <div><span className="panel-step">PROTOTYPE / DECISIONS</span><h2>{t.panel.title}</h2></div>
          <button type="button" onClick={() => setPanelOpen(false)} aria-label={t.panel.close}>×</button>
        </div>
        <p className="panel-intro">{t.panel.body}</p>

        <div className="question-block">
          <h3><span>01</span>{t.panel.questions[0]}</h3>
          <OptionGroup values={["research", "ai", "theatre"]} labels={t.panel.options.emphasis} value={config.emphasis} onChange={(v) => update("emphasis", v)} />
        </div>
        <div className="question-block">
          <h3><span>02</span>{t.panel.questions[1]}</h3>
          <OptionGroup values={["academic", "public", "organizations"]} labels={t.panel.options.audience} value={config.audience} onChange={(v) => update("audience", v)} />
        </div>
        <div className="question-block">
          <h3><span>03</span>{t.panel.questions[2]}</h3>
          <OptionGroup values={["clear", "experimental"]} labels={t.panel.options.tone} value={config.tone} onChange={(v) => update("tone", v)} />
        </div>
        <div className="question-block">
          <h3><span>04</span>{t.panel.questions[3]}</h3>
          <OptionGroup values={["brief", "rich"]} labels={t.panel.options.density} value={config.density} onChange={(v) => update("density", v)} />
        </div>
        <div className="question-block">
          <h3><span>05</span>{t.panel.questions[4]}</h3>
          <OptionGroup values={["collaboration", "talk", "explore"]} labels={t.panel.options.goal} value={config.goal} onChange={(v) => update("goal", v)} />
        </div>

        <div className="panel-summary">
          <pre>{summary}</pre>
          <div>
            <button type="button" className="reset-button" onClick={() => setConfig({ ...defaultConfig, language: config.language })}>{t.panel.reset}</button>
            <button type="button" className="copy-button" onClick={copySummary}>{copied ? t.panel.copied : t.panel.copy}</button>
          </div>
        </div>
        <p className="privacy-note">{t.panel.note}</p>
      </aside>
    </main>
  );
}
