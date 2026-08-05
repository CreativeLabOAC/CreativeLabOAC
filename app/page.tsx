"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CharacterizationWorkspace from "./CharacterizationWorkspace";

type Language = "he" | "en";
type Page = "home" | "about" | "research" | "publications" | "profile" | "characterize";
type Focus = "interaction" | "search" | "ai" | "theatre";
type Audience = "public" | "academic" | "organizations";
type Depth = "concise" | "detailed";

type Characterization = { focus: Focus; audience: Audience; depth: Depth };

const defaultCharacterization: Characterization = {
  focus: "interaction",
  audience: "public",
  depth: "detailed",
};

const routes: Page[] = ["home", "about", "research", "publications", "profile", "characterize"];

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
      "משחק המראה הפך אלתור גופני לפרדיגמה מדעית. שני אנשים יוצרים יחד תנועה מורכבת, מסונכרנת וחדשה ללא מנהיג מוגדר. עבודות המשך בחנו togetherness, דינמיקה פיזיולוגית ויציאה מסנכרון.",
    textEn:
      "The Mirror Game turned bodily improvisation into a scientific paradigm. Two people create complex, synchronized and novel movement without a designated leader. Later work studied togetherness, physiology and exits from synchrony.",
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
      "Creative Foraging ממפה את המעבר בין exploration — חיפוש כיוונים חדשים — לבין exploitation — פיתוח רעיון שכבר נמצא. המחקר חושף אסטרטגיות חיפוש אישיות ומתאר יצירתיות כניווט בנוף משמעות.",
    textEn:
      "Creative Foraging maps the shift between exploration—seeking new directions—and exploitation—developing an idea already found. It reveals individual search strategies and frames creativity as navigation through a meaning landscape.",
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
      "Playing Along בוחן סוכני AI במשחק האלתור “כן, ו…”. המחקר שואל כיצד הקשבה, הפתעה, המשכיות וקפיצות סמנטיות משתנות כאשר אדם ומכונה יוצרים יחד.",
    textEn:
      "Playing Along studies AI agents in the improvisation game “Yes, and…”. It asks how listening, surprise, continuation and semantic leaps change when humans and machines create together.",
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
      "The Weizmann Theatre Lab connected physics, computer science and behavioral science with improvisation and Playback Theatre. Stage games became tools for studying togetherness, creative leaps and dramatic action.",
    terms: ["Theatre Lab", "Playback", "Improvisation", "Embodied knowledge"],
    href: "https://www.weizmann.ac.il/mcb/alon/theatre-lab",
  },
] as const;

const publications = [
  ["2025", "Playing Along – Building AI Agents for Co-Creation of Improvised Stories", "ICCC", "https://idanvidra.github.io/playing_along_paper_site/"],
  ["2024", "De-sync: The Role of Disruption of Synchronization in Creative Interactions", "BMC Neuroscience", "https://doi.org/10.1186/s12868-024-00874-z"],
  ["2018", "Creative Exploration as a Scale-Invariant Search on a Meaning Landscape", "Nature Communications", "https://doi.org/10.1038/s41467-018-07715-8"],
  ["2017", "Creative Foraging: An Experimental Paradigm for Studying Exploration and Discovery", "PLOS ONE", "https://doi.org/10.1371/journal.pone.0182133"],
  ["2015", "Being in the Zone: Physiological Markers of Togetherness in Joint Improvisation", "Frontiers", "https://doi.org/10.3389/fnhum.2015.00187"],
  ["2011", "The Mirror Game as a Paradigm for Studying the Dynamics of Two People Improvising Motion Together", "PNAS", "https://doi.org/10.1073/pnas.1108155108"],
] as const;

const copy = {
  he: {
    name: "ד״ר ליאור נוי",
    role: "חוקר, מרצה ואיש אימפרוביזציה",
    nav: {
      home: "ראשי",
      about: "אודות",
      research: "מחקר",
      publications: "פרסומים",
      profile: "פרופיל",
    },
    notice: "אב־טיפוס לשיחת אפיון · התוכן טרם אושר לפרסום",
    characterize: "מצב אפיון",
    homeLead: {
      public: "חוקר את הרגע שבו אנשים — או אדם ומכונה — מפסיקים רק להגיב זה לזה ומתחילים ליצור משהו חדש יחד.",
      academic: "חוקר אינטראקציות יצירתיות באמצעות כלים ממדעי המחשב, פסיכולוגיה קוגניטיבית, חקר התנועה ואמנויות הבמה.",
      organizations: "מחקר, הוראה וסדנאות על התנאים שמאפשרים לאנשים ולצוותים להקשיב, לחפש, לאלתר וליצור יחד.",
    },
    homeBody: "סגן ראש בית הספר לטכנולוגיה ומדעים בקריה האקדמית אונו, בעל דוקטורט במדעי המחשב ממכון ויצמן וממייסדי מעבדת התיאטרון.",
    enter: "היכרות עם ליאור",
    aboutKicker: "אודות",
    aboutTitle: "מדעי המחשב, פסיכולוגיה, תנועה ואימפרוביזציה.",
    aboutBody:
      "עבודתו של ד״ר ליאור נוי נעה בין דיסציפלינות שבדרך כלל אינן נפגשות. הוא משתמש בתנועה, משחקים דיגיטליים ואימפרוביזציה כדי להפוך רגעים אנושיים מורכבים למשהו שאפשר להתבונן בו, למדוד ולחקור.",
    aboutBody2:
      "ליאור הוא סגן ראש בית הספר לטכנולוגיה ומדעים בקריה האקדמית אונו. הוא בעל דוקטורט במדעי המחשב ממכון ויצמן, היה עמית פוסט־דוקטורט ב־Harvard Medical School, וממייסדי מעבדת התיאטרון במכון ויצמן.",
    question: "האם אפשר לבנות תאוריה חישובית של אינטראקציות יצירתיות?",
    values: [
      ["הקשבה", "היכולת לזהות את מה שכבר מתרחש באינטראקציה."],
      ["יצירתיות", "תנועה בין חיפוש אפשרויות לבין פיתוח רעיון."],
      ["שיתוף פעולה", "יצירת תנאים שבהם החדש יכול להיווצר בין אנשים."],
    ],
    theatreTitle: "הבמה כמרחב מחקר",
    theatreBody:
      "מאז 2011, מעבדת התיאטרון במכון ויצמן משתמשת באימפרוביזציה כדי לחקור togetherness, קפיצות יצירתיות ופעולה דרמטית.",
    researchKicker: "מחקר",
    researchTitle: "ארבעה צירים. שאלה אחת.",
    researchIntro: "בחרו ציר כדי לעבור בין תחומי המחקר המרכזיים.",
    source: "למקור",
    currentTitle: "יצירתיות אינה רק תוצאה. היא מערכת יחסים.",
    currentBody:
      "במחקרי אדם–AI השאלה אינה רק אם מערכת יכולה לייצר תוצר יצירתי. המחקר בוחן אם היא מסוגלת להשתתף בתהליך: להקשיב, להפתיע, להמשיך רעיון ולשנות מסלול.",
    publicationsKicker: "פרסומים",
    publicationsTitle: "עבודות נבחרות",
    publicationsIntro: "בחירה מצומצמת של מאמרים ופרויקטים מרכזיים לאורך מסלול המחקר.",
    read: "קריאה",
    profileKicker: "פרופיל",
    profileTitle: "מסלול אקדמי ומקצועי",
    positions: [
      ["היום", "סגן ראש בית הספר לטכנולוגיה ומדעים", "הקריה האקדמית אונו"],
      ["מ־2011", "ממייסדי מעבדת התיאטרון", "מכון ויצמן למדע"],
      ["2009—2010", "עמית פוסט־דוקטורט", "Harvard Medical School"],
      ["2009", "Ph.D. במדעי המחשב", "מכון ויצמן למדע"],
      ["מתמשך", "מבצע ומורה", "Playback Theatre"],
    ],
    facts: [["20+", "מאמרי כתב־עת מאומתים"], ["1,467", "ציטוטים ב־Google Scholar"], ["18", "h-index"], ["4", "תחומי מחקר מחוברים"]],
    links: ["Google Scholar", "ORCID", "Theatre Lab", "יצירת קשר"],
    back: "חזרה",
    next: "העמוד הבא",
    studio: {
      title: "החלטות לאפיון",
      intro: "הבחירות משנות את הדגש ואת עומק התוכן.",
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
    nav: { home: "Home", about: "About", research: "Research", publications: "Publications", profile: "Profile" },
    notice: "Characterization prototype · content not yet approved",
    characterize: "Characterize",
    homeLead: {
      public: "Studies the moment when people—or a person and a machine—stop merely responding and begin creating something new together.",
      academic: "Studies creative interactions using methods from computer science, cognitive psychology, movement research and the performing arts.",
      organizations: "Research, teaching and workshops on the conditions that help people and teams listen, search, improvise and create together.",
    },
    homeBody: "Deputy Head of the School of Science and Technology at Ono Academic College, with a PhD in computer science from the Weizmann Institute and co-founder of the Theatre Lab.",
    enter: "Meet Lior",
    aboutKicker: "About",
    aboutTitle: "Computer science, psychology, movement and improvisation.",
    aboutBody:
      "Dr. Lior Noy’s work moves between disciplines that rarely meet. He uses movement, digital games and improvisation to turn complex human moments into phenomena that can be observed, measured and studied.",
    aboutBody2:
      "Lior is Deputy Head of the School of Science and Technology at Ono Academic College. He holds a PhD in computer science from the Weizmann Institute, was a postdoctoral fellow at Harvard Medical School and co-founded the Weizmann Theatre Lab.",
    question: "Can we build a computational theory of creative interactions?",
    values: [
      ["Listening", "The capacity to recognize what is already happening in an interaction."],
      ["Creativity", "Movement between searching possibilities and developing an idea."],
      ["Cooperation", "Creating conditions in which novelty can emerge between people."],
    ],
    theatreTitle: "The stage as a research space",
    theatreBody:
      "Since 2011, the Weizmann Theatre Lab has used improvisation to study togetherness, creative leaps and dramatic action.",
    researchKicker: "Research",
    researchTitle: "Four axes. One inquiry.",
    researchIntro: "Select an axis to move between the central research areas.",
    source: "Source",
    currentTitle: "Creativity is not only an output. It is a relationship.",
    currentBody:
      "In human–AI work, the question is not merely whether a system can produce a creative result. The research asks whether it can participate in the process: listen, surprise, continue an idea and change direction.",
    publicationsKicker: "Publications",
    publicationsTitle: "Selected work",
    publicationsIntro: "A concise selection of central papers and projects across the research trajectory.",
    read: "Read",
    profileKicker: "Profile",
    profileTitle: "Academic and professional path",
    positions: [
      ["Today", "Deputy Head, School of Science and Technology", "Ono Academic College"],
      ["Since 2011", "Co-founder, Theatre Lab", "Weizmann Institute of Science"],
      ["2009—2010", "Postdoctoral fellow", "Harvard Medical School"],
      ["2009", "PhD in Computer Science", "Weizmann Institute of Science"],
      ["Ongoing", "Performer and teacher", "Playback Theatre"],
    ],
    facts: [["20+", "verified journal articles"], ["1,467", "Google Scholar citations"], ["18", "h-index"], ["4", "connected research areas"]],
    links: ["Google Scholar", "ORCID", "Theatre Lab", "Contact"],
    back: "Back",
    next: "Next page",
    studio: {
      title: "Characterization decisions",
      intro: "Choices change emphasis and content depth.",
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

export default function Home() {
  const [language, setLanguage] = useState<Language>("he");
  const [page, setPage] = useState<Page>("home");
  const [characterization, setCharacterization] = useState(defaultCharacterization);
  const [activeResearch, setActiveResearch] = useState<Focus>("interaction");
  const stageRef = useRef<HTMLDivElement>(null);
  const t = copy[language];
  const rtl = language === "he";
  const detailed = characterization.depth === "detailed";
  const currentResearch = researchItems.find((item) => item.id === activeResearch) ?? researchItems[0];

  useEffect(() => {
    const syncRoute = () => {
      const candidate = window.location.hash.replace(/^#\/?/, "") as Page;
      const validPage = routes.includes(candidate) ? candidate : "home";
      if (window.location.hash && !routes.includes(candidate)) {
        window.history.replaceState(null, "", "#/");
      }
      setPage(validPage);
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    syncRoute();
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [language, rtl]);

  useEffect(() => {
    const pageLabel = page === "home"
      ? (rtl ? "אינטראקציות יצירתיות" : "Creative Interactions")
      : page === "characterize" ? t.characterize : t.nav[page as keyof typeof t.nav];
    document.title = `${pageLabel} — ${t.name}`;
    const frame = window.requestAnimationFrame(() => stageRef.current?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, [page, rtl, t]);

  const hrefFor = (target: Page) => target === "home" ? "#/" : `#/${target}`;

  const pageOrder: Page[] = ["home", "about", "research", "publications", "profile", "characterize"];
  const nextPage = pageOrder[Math.min(pageOrder.indexOf(page) + 1, pageOrder.length - 1)];
  const previousPage = pageOrder[Math.max(pageOrder.indexOf(page) - 1, 0)];
  const pageIndex = pageOrder.indexOf(page);
  const routeLabel = page === "home" ? (rtl ? "פתיחה" : "Home") : page === "characterize" ? t.characterize : t.nav[page as keyof typeof t.nav];

  return (
    <main className="site" data-page={page} dir={rtl ? "rtl" : "ltr"}>
      <header className="header">
        <nav aria-label={rtl ? "ניווט ראשי" : "Main navigation"}>
          {(["home", "about", "research", "publications", "profile"] as Page[]).map((target, index) => (
            <a href={hrefFor(target)} className={page === target ? "active" : ""} aria-current={page === target ? "page" : undefined} key={target}>
              <span className="nav-symbol">{index === 0 ? "⌂" : index === 1 ? "□" : index === 2 ? "○" : index === 3 ? "↗" : "＋"}</span>
              <span>{t.nav[target as keyof typeof t.nav]}</span>
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="language-toggle" aria-label={rtl ? "Switch to English" : "מעבר לעברית"} onClick={() => setLanguage(language === "he" ? "en" : "he")}>{rtl ? "EN" : "עב"}</button>
          <a className={page === "characterize" ? "studio-trigger active" : "studio-trigger"} aria-current={page === "characterize" ? "page" : undefined} href={hrefFor("characterize")}>{t.characterize}<span aria-hidden="true">+</span></a>
        </div>
      </header>
      <div className="notice">
        <span>{t.notice}</span>
        <div className="route-progress" aria-label={`${routeLabel}, ${pageIndex + 1} / ${pageOrder.length}`}>
          <span>{String(pageIndex + 1).padStart(2, "0")} / 06</span>
          <i aria-hidden="true"><b style={{ width: `${((pageIndex + 1) / pageOrder.length) * 100}%` }} /></i>
          <span>{routeLabel}</span>
        </div>
      </div>

      <div className="page-stage" key={page} ref={stageRef} tabIndex={-1} aria-live="polite">
        {page === "home" && (
          <section className="screen home-screen">
            <div className="portrait"><Image src="/lior-noy.jpg" alt={t.name} fill sizes="(max-width: 720px) 30vw, 220px" priority /></div>
            <div className="identity-block"><h1>{t.name}</h1><p>{t.role}</p></div>
            <div className="home-copy">
              <p className="lead">{t.homeLead[characterization.audience]}</p>
              {detailed && <p>{t.homeBody}</p>}
              <a href={hrefFor("about")} className="text-link">{t.enter} ↗</a>
            </div>
            <aside className="folio"><span>LIOR NOY</span><span>CREATIVE INTERACTIONS</span><span>ONO ACADEMIC COLLEGE</span><span>2026</span></aside>
            <div className="interaction-axis" aria-hidden="true"><span>PEOPLE</span><i /><span>IDEAS</span><i /><span>AI</span></div>
          </section>
        )}

        {page === "about" && (
          <section className="screen content-screen about-screen">
            <div className="page-kicker"><span>01</span><p>{t.aboutKicker}</p></div>
            <div className="page-title"><h1>{t.aboutTitle}</h1><p>{t.aboutBody}</p>{detailed && <p>{t.aboutBody2}</p>}</div>
            <blockquote>{t.question}</blockquote>
            <div className="value-list">{t.values.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{body}</p></article>)}</div>
            <div className="theatre-note"><span>THEATRE LAB · SINCE 2011</span><h2>{t.theatreTitle}</h2><p>{t.theatreBody}</p><a href="https://www.weizmann.ac.il/mcb/alon/theatre-lab" target="_blank" rel="noreferrer">{t.source} ↗</a></div>
          </section>
        )}

        {page === "research" && (
          <section className="screen content-screen research-screen">
            <div className="page-kicker"><span>02</span><p>{t.researchKicker}</p></div>
            <div className="page-title"><h1>{t.researchTitle}</h1><p>{t.researchIntro}</p></div>
            <div className="research-browser">
              <div className="research-list" role="tablist">
                {researchItems.map((item) => <button type="button" role="tab" aria-controls="research-panel" aria-selected={activeResearch === item.id} className={activeResearch === item.id ? "active" : ""} key={item.id} onClick={() => { setActiveResearch(item.id); setCharacterization((current) => ({ ...current, focus: item.id })); }}>
                  <span>{item.index}</span><b>{rtl ? item.titleHe : item.titleEn}</b><i>{activeResearch === item.id ? "—" : "+"}</i>
                </button>)}
              </div>
              <article className="research-detail" id="research-panel" role="tabpanel" key={currentResearch.id}>
                <div className="detail-meta"><span>{currentResearch.index}</span><span>{currentResearch.years}</span></div>
                <h2>{rtl ? currentResearch.questionHe : currentResearch.questionEn}</h2>
                <p>{rtl ? currentResearch.textHe : currentResearch.textEn}</p>
                <ul>{currentResearch.terms.map((term) => <li key={term}>{term}</li>)}</ul>
                <a href={currentResearch.href} target="_blank" rel="noreferrer">{t.source} ↗</a>
              </article>
            </div>
            <div className="current-note"><span>HUMAN — AI</span><h2>{t.currentTitle}</h2><p>{t.currentBody}</p></div>
          </section>
        )}

        {page === "publications" && (
          <section className="screen content-screen publications-screen">
            <div className="page-kicker"><span>03</span><p>{t.publicationsKicker}</p></div>
            <div className="page-title"><h1>{t.publicationsTitle}</h1><p>{t.publicationsIntro}</p></div>
            <div className="publication-list">
              {publications.map(([year, title, venue, href], index) => <a href={href} target="_blank" rel="noreferrer" className="publication" key={title}>
                <span>{year}</span><h2>{title}</h2><small>{venue}</small><i>{t.read} ↗</i><em>0{index + 1}</em>
              </a>)}
            </div>
          </section>
        )}

        {page === "profile" && (
          <section className="screen content-screen profile-screen">
            <div className="page-kicker"><span>04</span><p>{t.profileKicker}</p></div>
            <div className="page-title"><h1>{t.profileTitle}</h1></div>
            <div className="profile-layout">
              <div className="timeline">{t.positions.map(([period, position, institution]) => <div key={`${period}-${position}`}><span>{period}</span><p>{position}</p><small>{institution}</small></div>)}</div>
              <div className="profile-photo"><Image src="/lior-noy.jpg" alt={t.name} fill sizes="(max-width: 720px) 150px, 220px" /></div>
            </div>
            <div className="facts">{t.facts.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
            <div className="external-links">{[
              ["https://scholar.google.com/citations?user=-w05QJkAAAAJ&hl=en", t.links[0]],
              ["https://orcid.org/0000-0001-8505-3889", t.links[1]],
              ["https://www.weizmann.ac.il/mcb/alon/theatre-lab", t.links[2]],
              ["mailto:lior.noy.1@gmail.com", t.links[3]],
            ].map(([href, label]) => <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" key={href}>{label}<span>↗</span></a>)}</div>
          </section>
        )}

        {page === "characterize" && (
          <CharacterizationWorkspace language={language} onStrategyChange={(key, value) => {
            setCharacterization((current) => ({ ...current, [key]: value } as Characterization));
            if (key === "focus") setActiveResearch(value as Focus);
          }} />
        )}
      </div>

      <footer className="page-footer">
        {page === "home" ? <span aria-hidden="true" /> : <a href={hrefFor(previousPage)}>← {t.back}</a>}
        <span>{t.name} · 2026</span>
        {page !== "characterize" ? <a className="footer-next" href={hrefFor(nextPage)}>{page === "profile" ? t.characterize : t.next} <span>↗</span></a> : <a href={hrefFor("home")}>{rtl ? "חזרה לתצוגת האתר" : "Back to site preview"} ↗</a>}
      </footer>
    </main>
  );
}
