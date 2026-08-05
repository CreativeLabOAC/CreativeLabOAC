"use client";

import { MouseEvent as ReactMouseEvent, useEffect, useMemo, useState } from "react";

type Language = "he" | "en";
type Focus = "interaction" | "search" | "ai" | "theatre";
type Audience = "academic" | "public" | "organizations";
type Depth = "concise" | "detailed";

type Characterization = {
  focus: Focus;
  audience: Audience;
  depth: Depth;
};

const defaultCharacterization: Characterization = {
  focus: "interaction",
  audience: "public",
  depth: "detailed",
};

const researchItems = [
  {
    id: "interaction",
    index: "01",
    years: "2011—2024",
    titleHe: "אינטראקציות יצירתיות",
    titleEn: "Creative interactions",
    questionHe: "כיצד משהו חדש נוצר בין אנשים?",
    questionEn: "How does something new emerge between people?",
    textHe:
      "משחק המראה הפך אלתור גופני לפרדיגמה מדעית: שני אנשים יוצרים יחד תנועה מורכבת, מסונכרנת וחדשה — ללא מנהיג מוגדר. מחקרים נוספים בחנו togetherness, דינמיקה פיזיולוגית ויציאה מסנכרון.",
    textEn:
      "The Mirror Game turned bodily improvisation into a scientific paradigm: two people create complex, synchronized and novel movement without a designated leader. Related work studies togetherness, physiology and exits from synchrony.",
    terms: ["Joint action", "Synchrony", "Togetherness", "De-sync"],
    href: "https://doi.org/10.1073/pnas.1108155108",
  },
  {
    id: "search",
    index: "02",
    years: "2017—",
    titleHe: "חיפוש יצירתי",
    titleEn: "Creative search",
    questionHe: "איך אנשים נעים בתוך מרחב של אפשרויות?",
    questionEn: "How do people move through a space of possibilities?",
    textHe:
      "Creative Foraging ממפה את המעבר בין exploration — חיפוש אחר כיוונים חדשים — לבין exploitation — פיתוח של רעיון שכבר נמצא. העבודה חושפת אסטרטגיות חיפוש אישיות ומציעה לחשוב על יצירתיות כניווט בנוף משמעות.",
    textEn:
      "Creative Foraging maps the shift between exploration—seeking new directions—and exploitation—developing an idea already found. The work reveals individual search strategies and frames creativity as navigation through a meaning landscape.",
    terms: ["Exploration", "Exploitation", "Meaning landscape", "Discovery"],
    href: "https://doi.org/10.1371/journal.pone.0182133",
  },
  {
    id: "ai",
    index: "03",
    years: "2025—2026",
    titleHe: "יצירה משותפת עם AI",
    titleEn: "Human–AI co-creation",
    questionHe: "האם סוכן מלאכותי יכול להיות שותף ולא רק כלי?",
    questionEn: "Can an artificial agent become a partner rather than a tool?",
    textHe:
      "Playing Along בוחן סוכני AI במשחק האלתור “כן, ו…”. המחקר אינו שואל רק אם התוצאה יצירתית, אלא כיצד הקשבה, הפתעה, המשכיות וקפיצות סמנטיות משתנות כאשר אדם ומכונה יוצרים יחד.",
    textEn:
      "Playing Along studies AI agents in the improvisation game “Yes, and…”. It asks not only whether the result is creative, but how listening, surprise, continuation and semantic leaps change when humans and machines create together.",
    terms: ["Human–AI", "Yes, and…", "Improvisation", "Creative agents"],
    href: "https://idanvidra.github.io/playing_along_paper_site/",
  },
  {
    id: "theatre",
    index: "04",
    years: "SINCE 2011",
    titleHe: "הבמה כמעבדה",
    titleEn: "The stage as a laboratory",
    questionHe: "מה המדע יכול ללמוד מהידע של מאלתרים?",
    questionEn: "What can science learn from improvisers’ knowledge?",
    textHe:
      "מעבדת התיאטרון במכון ויצמן חיברה בין פיזיקה, מדעי המחשב ומדעי ההתנהגות לבין אימפרוביזציה ו־Playback Theatre. משחקי במה הפכו לכלי מחקר של יחד, קפיצות יצירתיות ופעולה דרמטית.",
    textEn:
      "The Weizmann Theatre Lab connected physics, computer science and behavioral science with improvisation and Playback Theatre. Stage games became research tools for togetherness, creative leaps and dramatic action.",
    terms: ["Theatre Lab", "Playback", "Improvisation", "Embodied knowledge"],
    href: "https://www.weizmann.ac.il/mcb/alon/theatre-lab",
  },
] as const;

const publications = [
  {
    year: "2025",
    title: "Playing Along – Building AI Agents for Co-Creation of Improvised Stories",
    venue: "ICCC",
    summaryHe: "סוכני AI משתתפים עם בני אדם ביצירה משותפת של סיפורים מאולתרים.",
    summaryEn: "AI agents join humans in the co-creation of improvised stories.",
    href: "https://idanvidra.github.io/playing_along_paper_site/",
  },
  {
    year: "2024",
    title: "De-sync: The Role of Disruption of Synchronization in Creative Interactions",
    venue: "BMC Neuroscience",
    summaryHe: "מאמר תאורטי על האופן שבו הפרעה לסנכרון עשויה לאפשר שינוי, חידוש ואינדיבידואליות.",
    summaryEn: "A theoretical account of how disrupted synchrony may enable change, novelty and individuality.",
    href: "https://doi.org/10.1186/s12868-024-00874-z",
  },
  {
    year: "2018",
    title: "Creative Exploration as a Scale-Invariant Search on a Meaning Landscape",
    venue: "Nature Communications",
    summaryHe: "חיפוש יצירתי מתואר כניווט בעל מבנה עקבי בנוף של משמעות.",
    summaryEn: "Creative exploration is described as structured navigation through a landscape of meaning.",
    href: "https://doi.org/10.1038/s41467-018-07715-8",
  },
  {
    year: "2017",
    title: "Creative Foraging: An Experimental Paradigm for Studying Exploration and Discovery",
    venue: "PLOS ONE",
    summaryHe: "פרדיגמה משחקית־מחקרית למדידת המעבר בין חיפוש כיוונים חדשים לבין פיתוח רעיונות.",
    summaryEn: "An experimental paradigm for measuring shifts between exploring directions and developing ideas.",
    href: "https://doi.org/10.1371/journal.pone.0182133",
  },
  {
    year: "2015",
    title: "Being in the Zone: Physiological Markers of Togetherness in Joint Improvisation",
    venue: "Frontiers",
    summaryHe: "קשרים בין תחושת יחד באלתור, קצב לב, סנכרון פיזיולוגי ועוצמת תנועה.",
    summaryEn: "Links between felt togetherness, heart rate, physiological synchrony and movement intensity.",
    href: "https://doi.org/10.3389/fnhum.2015.00187",
  },
  {
    year: "2011",
    title: "The Mirror Game as a Paradigm for Studying the Dynamics of Two People Improvising Motion Together",
    venue: "PNAS",
    summaryHe: "המאמר שהציג את משחק המראה כפרדיגמה כמותית לחקר אלתור משותף.",
    summaryEn: "The paper establishing the Mirror Game as a quantitative paradigm for joint improvisation.",
    href: "https://doi.org/10.1073/pnas.1108155108",
  },
] as const;

const text = {
  he: {
    name: "ד״ר ליאור נוי",
    role: "חוקר, מרצה ואיש אימפרוביזציה",
    nav: [
      ["אודות", "about"],
      ["מחקר", "research"],
      ["פרסומים", "publications"],
      ["פרופיל", "profile"],
    ],
    notice: "אב־טיפוס לשיחת אפיון · התוכן טרם אושר לפרסום",
    intro: {
      academic:
        "ד״ר ליאור נוי חוקר אינטראקציות יצירתיות באמצעות כלים ממדעי המחשב, פסיכולוגיה קוגניטיבית, חקר התנועה ואמנויות הבמה.",
      public:
        "ד״ר ליאור נוי חוקר את הרגע שבו אנשים — או אדם ומכונה — מפסיקים רק להגיב זה לזה ומתחילים ליצור משהו חדש יחד.",
      organizations:
        "מחקר, הוראה וסדנאות על התנאים שמאפשרים לאנשים ולצוותים להקשיב, לחפש, לאלתר וליצור יחד.",
    },
    bio:
      "הוא סגן ראש בית הספר לטכנולוגיה ומדעים בקריה האקדמית אונו, בעל דוקטורט במדעי המחשב ממכון ויצמן וממייסדי מעבדת התיאטרון. עבודתו נעה בין תנועה וסנכרון, חיפוש יצירתי, יצירתיות קולקטיבית ואינטראקציות אדם–AI.",
    questions: "שאלת המחקר",
    mainQuestion: "האם אפשר לבנות תאוריה חישובית של אינטראקציות יצירתיות?",
    researchTitle: "תחומי מחקר",
    researchIntro:
      "ארבעה צירים מחברים את המחקרים לכדי שאלה אחת: כיצד יצירתיות מתפתחת כתהליך משותף.",
    source: "למקור",
    selected: "פרסומים נבחרים",
    selectedIntro:
      "רשימה מצומצמת של עבודות מפתח. לחיצה על פרסום פותחת תקציר קצר וקישור למקור.",
    current: "מחקר עדכני",
    currentTitle: "יצירתיות אינה רק תוצאה. היא מערכת יחסים.",
    currentBody:
      "במחקרי אדם–AI השאלה המרכזית אינה רק אם המערכת יכולה לייצר תוצר יצירתי. המחקר בוחן אם היא מסוגלת להשתתף בתהליך: להקשיב, להפתיע, להמשיך רעיון ולשנות את מסלול החיפוש המשותף.",
    theatre: "Theatre Lab",
    theatreTitle: "חיבור בין הידע של המעבדה לידע של הבמה.",
    theatreBody:
      "מאז 2011 מעבדת התיאטרון במכון ויצמן משתמשת באימפרוביזציה כמרחב מחקר. עבור ליאור, הקשבה, יצירתיות ושיתוף פעולה הם גם ערכים מקצועיים וגם תופעות שאפשר לחקור.",
    profile: "פרופיל אקדמי ומקצועי",
    positions: [
      ["היום", "סגן ראש בית הספר לטכנולוגיה ומדעים", "הקריה האקדמית אונו"],
      ["מ־2011", "ממייסדי מעבדת התיאטרון", "מכון ויצמן למדע"],
      ["2009—2010", "עמית פוסט־דוקטורט", "Harvard Medical School"],
      ["2009", "Ph.D. במדעי המחשב", "מכון ויצמן למדע"],
      ["מתמשך", "מבצע ומורה", "Playback Theatre"],
    ],
    facts: [
      ["20+", "מאמרי כתב־עת מאומתים"],
      ["1,467", "ציטוטים ב־Google Scholar"],
      ["18", "h-index"],
      ["4", "תחומי מחקר מחוברים"],
    ],
    links: ["Google Scholar", "ORCID", "Theatre Lab", "יצירת קשר"],
    footer: "פרוטוטייפ · אוגוסט 2026",
    characterize: "מצב אפיון",
    studio: {
      title: "החלטות לאפיון",
      intro: "הבחירות משנות את הדגש ואת עומק התוכן, מבלי לשנות את השפה החזותית.",
      focus: "מה מוביל את הסיפור?",
      audience: "למי האתר מדבר קודם?",
      depth: "כמה מידע להציג?",
      focusOptions: ["אינטראקציה", "חיפוש", "אדם–AI", "תיאטרון"],
      audienceOptions: ["ציבור רחב", "אקדמיה", "ארגונים"],
      depthOptions: ["תמציתי", "מפורט"],
      copy: "העתקת החלטות",
      copied: "הועתק",
      reset: "איפוס",
      close: "סגירה",
    },
  },
  en: {
    name: "Dr. Lior Noy",
    role: "Researcher, lecturer and improviser",
    nav: [
      ["About", "about"],
      ["Research", "research"],
      ["Publications", "publications"],
      ["Profile", "profile"],
    ],
    notice: "Characterization prototype · content not yet approved",
    intro: {
      academic:
        "Dr. Lior Noy studies creative interactions using methods from computer science, cognitive psychology, movement research and the performing arts.",
      public:
        "Dr. Lior Noy studies the moment when people—or a person and a machine—stop merely responding and begin creating something new together.",
      organizations:
        "Research, teaching and workshops on the conditions that help people and teams listen, search, improvise and create together.",
    },
    bio:
      "He is Deputy Head of the School of Science and Technology at Ono Academic College, holds a PhD in computer science from the Weizmann Institute and co-founded the Theatre Lab. His work spans movement and synchrony, creative search, collective creativity and human–AI interaction.",
    questions: "Research question",
    mainQuestion: "Can we build a computational theory of creative interactions?",
    researchTitle: "Research areas",
    researchIntro:
      "Four axes connect the work into one inquiry: how creativity develops as a shared process.",
    source: "Source",
    selected: "Selected publications",
    selectedIntro:
      "A concise selection of key work. Select a publication to read a short summary and visit the source.",
    current: "Current research",
    currentTitle: "Creativity is not only an output. It is a relationship.",
    currentBody:
      "In human–AI work, the central question is not merely whether a system can produce a creative result. The research asks whether it can participate in a process: listen, surprise, continue an idea and redirect a shared search.",
    theatre: "Theatre Lab",
    theatreTitle: "Connecting the knowledge of the laboratory with the knowledge of the stage.",
    theatreBody:
      "Since 2011, the Weizmann Theatre Lab has used improvisation as a research space. For Lior, listening, creativity and cooperation are both professional values and phenomena that can be studied.",
    profile: "Academic and professional profile",
    positions: [
      ["Today", "Deputy Head, School of Science and Technology", "Ono Academic College"],
      ["Since 2011", "Co-founder, Theatre Lab", "Weizmann Institute of Science"],
      ["2009—2010", "Postdoctoral fellow", "Harvard Medical School"],
      ["2009", "PhD in Computer Science", "Weizmann Institute of Science"],
      ["Ongoing", "Performer and teacher", "Playback Theatre"],
    ],
    facts: [
      ["20+", "verified journal articles"],
      ["1,467", "Google Scholar citations"],
      ["18", "h-index"],
      ["4", "connected research areas"],
    ],
    links: ["Google Scholar", "ORCID", "Theatre Lab", "Contact"],
    footer: "Prototype · August 2026",
    characterize: "Characterize",
    studio: {
      title: "Characterization decisions",
      intro: "Choices change emphasis and content depth while preserving the visual language.",
      focus: "What leads the story?",
      audience: "Who does the site address first?",
      depth: "How much information should it show?",
      focusOptions: ["Interaction", "Search", "Human–AI", "Theatre"],
      audienceOptions: ["General public", "Academia", "Organizations"],
      depthOptions: ["Concise", "Detailed"],
      copy: "Copy decisions",
      copied: "Copied",
      reset: "Reset",
      close: "Close",
    },
  },
} as const;

function OptionRow<T extends string>({
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
    <div className="option-row">
      {values.map((item, index) => (
        <button
          type="button"
          key={item}
          className={value === item ? "selected" : ""}
          aria-pressed={value === item}
          onClick={() => onChange(item)}
        >
          {labels[index]}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("he");
  const [characterization, setCharacterization] =
    useState<Characterization>(defaultCharacterization);
  const [studioOpen, setStudioOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeResearch, setActiveResearch] = useState<Focus>("interaction");
  const [openPublication, setOpenPublication] = useState<number | null>(0);

  const t = text[language];
  const rtl = language === "he";
  const detailed = characterization.depth === "detailed";
  const selectedResearch =
    researchItems.find((item) => item.id === activeResearch) ?? researchItems[0];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [language, rtl]);

  const update = <K extends keyof Characterization>(
    key: K,
    value: Characterization[K],
  ) => {
    setCharacterization((current) => ({ ...current, [key]: value }));
    if (key === "focus") setActiveResearch(value as Focus);
  };

  const navigate = (event: ReactMouseEvent<HTMLAnchorElement>, target: string) => {
    event.preventDefault();
    const section = document.getElementById(target);
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${target}`);
  };

  const summary = useMemo(() => {
    const focusIndex = ["interaction", "search", "ai", "theatre"].indexOf(
      characterization.focus,
    );
    const audienceIndex = ["public", "academic", "organizations"].indexOf(
      characterization.audience,
    );
    const depthIndex = ["concise", "detailed"].indexOf(characterization.depth);
    return [
      `${t.studio.focus} ${t.studio.focusOptions[focusIndex]}`,
      `${t.studio.audience} ${t.studio.audienceOptions[audienceIndex]}`,
      `${t.studio.depth} ${t.studio.depthOptions[depthIndex]}`,
    ].join("\n");
  }, [characterization, t]);

  const copySummary = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="site" dir={rtl ? "rtl" : "ltr"}>
      <header className="header">
        <a
          href="#top"
          className="back-mark"
          aria-label={t.name}
          onClick={(event) => navigate(event, "top")}
        >
          <span className="mark-square" />
          <span className="mark-arrow">←</span>
        </a>
        <nav aria-label={rtl ? "ניווט ראשי" : "Main navigation"}>
          {t.nav.map(([label, target], index) => (
            <a href={`#${target}`} onClick={(event) => navigate(event, target)} key={target}>
              <span className="nav-symbol" aria-hidden="true">
                {index === 0 ? "□" : index === 1 ? "○" : index === 2 ? "↗" : "＋"}
              </span>
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" onClick={() => setLanguage(language === "he" ? "en" : "he")}>
            {rtl ? "EN" : "עב"}
          </button>
          <button type="button" onClick={() => setStudioOpen(true)}>{t.characterize}</button>
        </div>
      </header>

      <div className="notice">{t.notice}</div>

      <section className="hero" id="top">
        <div className="portrait">
          <img src="/lior-noy.jpg" alt={t.name} />
        </div>
        <div className="identity-block">
          <h1>{t.name}</h1>
          <p>{t.role}</p>
        </div>
        <div className="hero-copy" id="about">
          <p className="lead">{t.intro[characterization.audience]}</p>
          {detailed && <p>{t.bio}</p>}
        </div>
        <aside className="hero-index">
          <span>LIOR NOY</span>
          <span>CREATIVE INTERACTIONS</span>
          <span>ONO ACADEMIC COLLEGE</span>
          <span>2026</span>
        </aside>
      </section>

      <section className="question-section">
        <div className="section-label"><span>01</span><p>{t.questions}</p></div>
        <h2>{t.mainQuestion}</h2>
      </section>

      <section className="research-section" id="research">
        <div className="section-intro">
          <div className="section-label"><span>02</span><p>{t.researchTitle}</p></div>
          <p>{t.researchIntro}</p>
        </div>

        <div className="research-layout">
          <div className="research-list" role="tablist">
            {researchItems.map((item) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeResearch === item.id}
                className={activeResearch === item.id ? "active" : ""}
                key={item.id}
                onClick={() => {
                  setActiveResearch(item.id);
                  setCharacterization((current) => ({ ...current, focus: item.id }));
                }}
              >
                <span>{item.index}</span>
                <b>{rtl ? item.titleHe : item.titleEn}</b>
                <i>{activeResearch === item.id ? "—" : "+"}</i>
              </button>
            ))}
          </div>

          <article className="research-detail" key={selectedResearch.id}>
            <div className="detail-meta">
              <span>{selectedResearch.index}</span>
              <span>{selectedResearch.years}</span>
            </div>
            <h3>{rtl ? selectedResearch.questionHe : selectedResearch.questionEn}</h3>
            <p>{rtl ? selectedResearch.textHe : selectedResearch.textEn}</p>
            <ul>
              {selectedResearch.terms.map((term) => <li key={term}>{term}</li>)}
            </ul>
            <a href={selectedResearch.href} target="_blank" rel="noreferrer">
              {t.source} ↗
            </a>
          </article>
        </div>
      </section>

      <section className="publications-section" id="publications">
        <div className="section-intro">
          <div className="section-label"><span>03</span><p>{t.selected}</p></div>
          <p>{t.selectedIntro}</p>
        </div>
        <div className="publication-list">
          {publications.map((publication, index) => {
            const open = openPublication === index;
            return (
              <article className={open ? "publication open" : "publication"} key={publication.title}>
                <button type="button" onClick={() => setOpenPublication(open ? null : index)}>
                  <span className="pub-year">{publication.year}</span>
                  <span className="pub-title">{publication.title}</span>
                  <span className="pub-venue">{publication.venue}</span>
                  <span className="pub-toggle">{open ? "—" : "+"}</span>
                </button>
                <div className="publication-content" aria-hidden={!open}>
                  <p>{rtl ? publication.summaryHe : publication.summaryEn}</p>
                  <a href={publication.href} target="_blank" rel="noreferrer">{t.source} ↗</a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="current-section">
        <div className="section-label"><span>04</span><p>{t.current}</p></div>
        <div className="current-copy">
          <h2>{t.currentTitle}</h2>
          <p>{t.currentBody}</p>
          <a href="https://idanvidra.github.io/playing_along_paper_site/" target="_blank" rel="noreferrer">
            Playing Along · ICCC 2025 ↗
          </a>
        </div>
        <div className="notation" aria-hidden="true">
          <span>H</span><i /><span>AI</span>
          <small>listen / add / redirect</small>
        </div>
      </section>

      <section className="theatre-section">
        <div className="section-label"><span>05</span><p>{t.theatre}</p></div>
        <div className="theatre-copy">
          <h2>{t.theatreTitle}</h2>
          <p>{t.theatreBody}</p>
          <a href="https://www.weizmann.ac.il/mcb/alon/theatre-lab" target="_blank" rel="noreferrer">
            Theatre Lab, Weizmann Institute ↗
          </a>
        </div>
        <div className="theatre-words" aria-hidden="true">
          <span>LISTEN</span>
          <span>CREATE</span>
          <span>COOPERATE</span>
        </div>
      </section>

      <section className="profile-section" id="profile">
        <div className="section-intro">
          <div className="section-label"><span>06</span><p>{t.profile}</p></div>
        </div>
        <div className="profile-grid">
          <div className="timeline">
            {t.positions.map(([period, position, institution]) => (
              <div className="timeline-row" key={`${period}-${position}`}>
                <span>{period}</span><p>{position}</p><small>{institution}</small>
              </div>
            ))}
          </div>
          <div className="profile-image">
            <img src="/lior-noy.jpg" alt={t.name} />
          </div>
        </div>
        <div className="facts">
          {t.facts.map(([value, label]) => (
            <div key={label}><strong>{value}</strong><span>{label}</span></div>
          ))}
        </div>
      </section>

      <footer>
        <div className="footer-name">{t.name}</div>
        <div className="footer-links">
          {[
            "https://scholar.google.com/citations?user=-w05QJkAAAAJ&hl=en",
            "https://orcid.org/0000-0001-8505-3889",
            "https://www.weizmann.ac.il/mcb/alon/theatre-lab",
            "mailto:lior.noy.1@gmail.com",
          ].map((href, index) => (
            <a href={href} key={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              {t.links[index]} <span>↗</span>
            </a>
          ))}
        </div>
        <div className="footer-meta"><span>{t.footer}</span><button onClick={() => setStudioOpen(true)}>{t.characterize}</button></div>
      </footer>

      <div className={studioOpen ? "studio-overlay open" : "studio-overlay"} onClick={() => setStudioOpen(false)} />
      <aside className={studioOpen ? "studio open" : "studio"} aria-hidden={!studioOpen}>
        <div className="studio-head">
          <div><span>CHARACTERIZATION / 03</span><h2>{t.studio.title}</h2></div>
          <button onClick={() => setStudioOpen(false)} aria-label={t.studio.close}>×</button>
        </div>
        <p className="studio-intro">{t.studio.intro}</p>
        <div className="studio-question">
          <span>01</span><h3>{t.studio.focus}</h3>
          <OptionRow
            values={["interaction", "search", "ai", "theatre"] as const}
            labels={t.studio.focusOptions}
            value={characterization.focus}
            onChange={(value) => update("focus", value)}
          />
        </div>
        <div className="studio-question">
          <span>02</span><h3>{t.studio.audience}</h3>
          <OptionRow
            values={["public", "academic", "organizations"] as const}
            labels={t.studio.audienceOptions}
            value={characterization.audience}
            onChange={(value) => update("audience", value)}
          />
        </div>
        <div className="studio-question">
          <span>03</span><h3>{t.studio.depth}</h3>
          <OptionRow
            values={["concise", "detailed"] as const}
            labels={t.studio.depthOptions}
            value={characterization.depth}
            onChange={(value) => update("depth", value)}
          />
        </div>
        <div className="studio-actions">
          <button onClick={copySummary}>{copied ? t.studio.copied : t.studio.copy}</button>
          <button onClick={() => setCharacterization(defaultCharacterization)}>{t.studio.reset}</button>
        </div>
      </aside>
    </main>
  );
}
