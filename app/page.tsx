"use client";

import {
  MouseEvent as ReactMouseEvent,
  PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Language = "he" | "en";
type Lens = "interaction" | "search" | "ai" | "stage";
type Audience = "academic" | "public" | "organizations";
type Energy = "precise" | "playful";

type StudioState = {
  lens: Lens;
  audience: Audience;
  energy: Energy;
};

const defaultStudio: StudioState = {
  lens: "interaction",
  audience: "public",
  energy: "playful",
};

const research = [
  {
    id: "interaction",
    number: "01",
    year: "2011—2024",
    titleHe: "תנועה משותפת",
    titleEn: "Joint motion",
    shortHe: "מתי שני אנשים הופכים לרגע למערכת אחת?",
    shortEn: "When do two people briefly become one system?",
    bodyHe:
      "משחק המראה הפך אלתור גופני לפרדיגמה מדעית. המחקר חושף סנכרון ללא מנהיג קבוע — וגם את תפקיד היציאה מסנכרון ביצירת שינוי.",
    bodyEn:
      "The Mirror Game turned bodily improvisation into a scientific paradigm, revealing leaderless synchrony—and how leaving synchrony can create change.",
    stat: "10ms",
    statLabelHe: "סדר הגודל של תיאום בין מאלתרים מומחים",
    statLabelEn: "coordination scale among expert improvisers",
    link: "https://doi.org/10.1073/pnas.1108155108",
  },
  {
    id: "search",
    number: "02",
    year: "2017—",
    titleHe: "חיפוש יצירתי",
    titleEn: "Creative search",
    shortHe: "איך אנחנו נעים במרחב של אפשרויות?",
    shortEn: "How do we move through a space of possibilities?",
    bodyHe:
      "Creative Foraging ממפה את המעבר בין חקירת כיוונים חדשים לבין פיתוח רעיון שכבר נמצא — ומראה שלכל אדם אסטרטגיית חיפוש אופיינית.",
    bodyEn:
      "Creative Foraging maps the shift between exploring new directions and developing an idea already found—and reveals distinct search strategies.",
    stat: "↗ ↘ ↗",
    statLabelHe: "explore / exploit / move on",
    statLabelEn: "explore / exploit / move on",
    link: "https://doi.org/10.1371/journal.pone.0182133",
  },
  {
    id: "ai",
    number: "03",
    year: "2025—2026",
    titleHe: "יצירה עם AI",
    titleEn: "Co-creating with AI",
    shortHe: "האם מכונה יכולה להיות שותפה — לא רק כלי?",
    shortEn: "Can a machine become a partner—not merely a tool?",
    bodyHe:
      "Playing Along בוחן סוכני AI במשחק האלתור “כן, ו…”. התוצאה אינה רק סיפור יצירתי; השאלה היא כיצד נראים הקשבה, הפתעה והמשך רעיון בין אדם למכונה.",
    bodyEn:
      "Playing Along studies AI agents in the “Yes, and…” game. Beyond the creative result, it asks what listening, surprise and continuation look like across human and machine.",
    stat: "YES, AND…",
    statLabelHe: "ממשק מחקרי ליצירה משותפת",
    statLabelEn: "a research interface for co-creation",
    link: "https://idanvidra.github.io/playing_along_paper_site/",
  },
  {
    id: "stage",
    number: "04",
    year: "SINCE 2011",
    titleHe: "הבמה כמעבדה",
    titleEn: "The stage as a lab",
    shortHe: "מה יכול המדע ללמוד מאימפרוביזציה?",
    shortEn: "What can science learn from improvisation?",
    bodyHe:
      "מעבדת התיאטרון במכון ויצמן חיברה בין פיזיקה, מדעי המחשב ומדעי ההתנהגות לבין הידע החי של שחקנים ומוזיקאים מאלתרים.",
    bodyEn:
      "The Weizmann Theatre Lab connected physics, computer science and behavioral science with the embodied knowledge of improvising actors and musicians.",
    stat: "STAGE ⇄ LAB",
    statLabelHe: "שתי שפות לאותה תופעה",
    statLabelEn: "two languages for one phenomenon",
    link: "https://www.weizmann.ac.il/mcb/alon/theatre-lab",
  },
] as const;

const copy = {
  he: {
    name: "ד״ר ליאור נוי",
    role: "חוקר אינטראקציות יצירתיות",
    nav: ["שאלה", "מחקר", "ניסויים", "אודות"],
    navTargets: ["question", "research", "experiments", "about"],
    prototype: "אב־טיפוס לשיחת אפיון · התוכן טרם אושר לפרסום",
    characterize: "פתחו את סטודיו האפיון",
    eyebrow: "CREATIVE INTERACTIONS · HUMAN / HUMAN–AI",
    hero: {
      interaction: ["יצירתיות", "מתרחשת", "בינינו."],
      search: ["רעיון חדש", "הוא מסלול,", "לא רגע."],
      ai: ["האם AI", "יכול לשחק", "איתנו?"],
      stage: ["כשהבמה", "הופכת", "למעבדה."],
    },
    body: {
      academic:
        "מחקר חישובי וניסויי של סנכרון, חיפוש, אלתור ויצירתיות קולקטיבית — בין בני אדם ובין אדם לסוכן מלאכותי.",
      public:
        "ד״ר ליאור נוי חוקר את הרגע החמקמק שבו שני אנשים — או אדם ומכונה — מפסיקים רק להגיב ומתחילים ליצור משהו חדש יחד.",
      organizations:
        "מחקר, הוראה וסדנאות על התנאים שמאפשרים לצוותים להקשיב, לחקור, לקחת סיכון וליצור יחד.",
    },
    explore: "גלו את המחקר",
    questionLabel: "השאלה שמניעה את העבודה",
    question:
      "האם אפשר לבנות תאוריה חישובית של אינטראקציות יצירתיות — מבלי לאבד את האנושיות שלהן?",
    axes: "ארבעה צירים. מחקר אחד.",
    axesBody:
      "מהתנועה הזעירה של יד ועד לקפיצה סמנטית בסיפור עם AI — כל פרויקט בוחן זווית אחרת של יצירה משותפת.",
    open: "פתחו",
    close: "סגרו",
    experimentLabel: "ניסוי חי",
    mirrorTitle: "נסו את משחק המראה",
    mirrorBody:
      "הזיזו את הסמן בתוך השדה. שתי נקודות נעות יחד, אבל אף אחת מהן אינה חייבת להוביל.",
    mirrorNote: "POINTER → MOTION → COORDINATION",
    selectedLabel: "מחקרים נבחרים",
    selectedTitle: "מרעיונות מופשטים לפרדיגמות שאפשר למדוד.",
    papers: [
      ["2011", "The Mirror Game", "PNAS", "תנועה מאולתרת משותפת ללא מנהיג מוגדר"],
      ["2017", "Creative Foraging", "PLOS ONE", "חיפוש וגילוי בתוך נוף של אפשרויות"],
      ["2024", "De-sync", "BMC Neuroscience", "הפרעה לסנכרון כמקום אפשרי לחידוש"],
      ["2025", "Playing Along", "ICCC", "סוכני AI כשותפים לסיפור מאולתר"],
    ],
    aiLabel: "מחקר עדכני · HUMAN–AI",
    aiTitle: "יצירתיות אינה פלט. היא מערכת יחסים.",
    aiBody:
      "ב־Playing Along, סיפורי אדם–AI לא הובחנו באופן אמין מסיפורי אדם–אדם במדדי novelty, value ו־surprise. אבל הדרך הייתה שונה: בני אדם קפצו רחוק יותר במשמעות, וה־AI הפתיע באופן אחר.",
    yes: "כן, ו…",
    yesLines: [
      "נקשיב למה שכבר נמצא בחדר.",
      "נוסיף משהו שלא היה יכול להיווצר לבד.",
      "נאפשר לרעיון לשנות כיוון.",
    ],
    theatreLabel: "THEATRE LAB · WEIZMANN INSTITUTE",
    theatreTitle: "מדע שנכנס לבמה. במה שנכנסת למדע.",
    theatreBody:
      "מאז 2011, מעבדת התיאטרון משתמשת במשחקי אלתור כדי לחקור togetherness, קפיצות יצירתיות ופעולה דרמטית. עבור ליאור, הקשבה, יצירתיות ושיתוף פעולה הם גם ערכים — וגם חומר למחקר.",
    profileLabel: "פרופיל",
    aboutTitle: "מדעי המחשב. פסיכולוגיה. תנועה. אימפרוביזציה.",
    aboutBody:
      "ד״ר ליאור נוי הוא סגן ראש בית הספר לטכנולוגיה ומדעים בקריה האקדמית אונו, בעל דוקטורט ממכון ויצמן וממייסדי מעבדת התיאטרון. הוא חוקר ומלמד יצירתיות, חדשנות ואינטראקציות אדם–AI, ומנחה תהליכים שבהם רעיונות הופכים לפעולה משותפת.",
    roles: [
      "סגן ראש בית הספר לטכנולוגיה ומדעים · אונו",
      "ממייסדי Theatre Lab · מכון ויצמן",
      "חוקר ומורה ל־Playback Theatre",
      "Consultant · HFP",
    ],
    metrics: [
      ["20+", "מאמרי כתב־עת מאומתים"],
      ["1,467", "ציטוטים ב־Google Scholar"],
      ["18", "h-index"],
      ["2011", "שנת הקמת Theatre Lab"],
    ],
    links: ["Google Scholar", "ORCID", "Theatre Lab", "צרו קשר"],
    footer: "אב־טיפוס אינטראקטיבי · אוגוסט 2026",
    studio: {
      title: "סטודיו האפיון",
      intro: "שנו שלוש החלטות וראו כיצד האתר משנה כיוון בזמן אמת.",
      lens: "מה מוביל את הסיפור?",
      audience: "למי מדברים קודם?",
      energy: "איזו אנרגיה יש למותג?",
      lensOptions: ["אינטראקציה", "חיפוש", "אדם–AI", "במה"],
      audienceOptions: ["ציבור רחב", "אקדמיה", "ארגונים"],
      energyOptions: ["מדויקת", "משחקית"],
      copy: "העתיקו החלטות",
      copied: "הועתק",
      reset: "איפוס",
      close: "סגירה",
      note: "הבחירות נשמרות במכשיר בלבד ואינן נשלחות.",
    },
  },
  en: {
    name: "Dr. Lior Noy",
    role: "Creative interactions researcher",
    nav: ["Question", "Research", "Experiments", "About"],
    navTargets: ["question", "research", "experiments", "about"],
    prototype: "Characterization prototype · content not yet approved",
    characterize: "Open characterization studio",
    eyebrow: "CREATIVE INTERACTIONS · HUMAN / HUMAN–AI",
    hero: {
      interaction: ["Creativity", "happens", "between us."],
      search: ["A new idea", "is a path,", "not a moment."],
      ai: ["Can AI", "play", "with us?"],
      stage: ["When stage", "becomes", "laboratory."],
    },
    body: {
      academic:
        "Computational and experimental research into synchrony, search, improvisation and collective creativity—between humans and across human–AI teams.",
      public:
        "Dr. Lior Noy studies the elusive moment when two people—or a person and a machine—stop merely responding and begin creating something new together.",
      organizations:
        "Research, teaching and workshops on the conditions that help teams listen, explore, take risks and create together.",
    },
    explore: "Explore the research",
    questionLabel: "The question driving the work",
    question:
      "Can we build a computational theory of creative interactions—without losing their humanity?",
    axes: "Four axes. One inquiry.",
    axesBody:
      "From the smallest hand movement to a semantic leap in a story with AI—each project tests a different angle of co-creation.",
    open: "Open",
    close: "Close",
    experimentLabel: "Live experiment",
    mirrorTitle: "Try the Mirror Game",
    mirrorBody:
      "Move the pointer inside the field. Two points move together, yet neither has to remain the leader.",
    mirrorNote: "POINTER → MOTION → COORDINATION",
    selectedLabel: "Selected research",
    selectedTitle: "From abstract ideas to paradigms we can measure.",
    papers: [
      ["2011", "The Mirror Game", "PNAS", "Joint improvised motion without a designated leader"],
      ["2017", "Creative Foraging", "PLOS ONE", "Search and discovery across a landscape of possibilities"],
      ["2024", "De-sync", "BMC Neuroscience", "Disrupted synchrony as a possible site of novelty"],
      ["2025", "Playing Along", "ICCC", "AI agents as partners in improvised storytelling"],
    ],
    aiLabel: "CURRENT WORK · HUMAN–AI",
    aiTitle: "Creativity is not an output. It is a relationship.",
    aiBody:
      "In Playing Along, human–AI stories were not reliably distinguished from human–human stories on novelty, value and surprise. But the process differed: humans made larger semantic leaps, while AI surprised in another way.",
    yes: "Yes, and…",
    yesLines: [
      "listen to what is already in the room.",
      "add something neither could create alone.",
      "let the idea change direction.",
    ],
    theatreLabel: "THEATRE LAB · WEIZMANN INSTITUTE",
    theatreTitle: "Science enters the stage. The stage enters science.",
    theatreBody:
      "Since 2011, the Theatre Lab has used improvisation games to study togetherness, creative leaps and dramatic action. For Lior, listening, creativity and cooperation are both values—and research material.",
    profileLabel: "Profile",
    aboutTitle: "Computer science. Psychology. Motion. Improvisation.",
    aboutBody:
      "Dr. Lior Noy is Deputy Head of the School of Science and Technology at Ono Academic College, holds a PhD from the Weizmann Institute and co-founded the Theatre Lab. He researches and teaches creativity, innovation and human–AI interaction.",
    roles: [
      "Deputy Head, School of Science & Technology · Ono",
      "Co-founder, Theatre Lab · Weizmann Institute",
      "Playback Theatre researcher and teacher",
      "Consultant · HFP",
    ],
    metrics: [
      ["20+", "verified journal papers"],
      ["1,467", "Google Scholar citations"],
      ["18", "h-index"],
      ["2011", "Theatre Lab founded"],
    ],
    links: ["Google Scholar", "ORCID", "Theatre Lab", "Contact"],
    footer: "Interactive prototype · August 2026",
    studio: {
      title: "Characterization studio",
      intro: "Change three decisions and watch the site shift direction in real time.",
      lens: "What leads the story?",
      audience: "Who do we address first?",
      energy: "What energy does the brand carry?",
      lensOptions: ["Interaction", "Search", "Human–AI", "Stage"],
      audienceOptions: ["General public", "Academia", "Organizations"],
      energyOptions: ["Precise", "Playful"],
      copy: "Copy decisions",
      copied: "Copied",
      reset: "Reset",
      close: "Close",
      note: "Choices stay on this device and are never submitted.",
    },
  },
} as const;

const paperLinks = [
  "https://doi.org/10.1073/pnas.1108155108",
  "https://doi.org/10.1371/journal.pone.0182133",
  "https://doi.org/10.1186/s12868-024-00874-z",
  "https://idanvidra.github.io/playing_along_paper_site/",
];

function CreativeField({ lens }: { lens: Lens }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.48, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0;
    let animation = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const palette: Record<Lens, string[]> = {
      interaction: ["#c6ff3d", "#f6f3ec", "#728cff"],
      search: ["#ff6b35", "#ffd86b", "#f6f3ec"],
      ai: ["#73e7ff", "#8e7dff", "#f6f3ec"],
      stage: ["#ff4f87", "#ffbb38", "#f6f3ec"],
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, rect.width * ratio);
      canvas.height = Math.max(1, rect.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const colors = palette[lens];
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      for (let i = 0; i < 28; i += 1) {
        const phase = frame * 0.006 + i * 0.61;
        const radius = 2 + (i % 4) * 1.25;
        const orbit = Math.min(width, height) * (0.17 + (i % 7) * 0.035);
        const targetX = pointer.current.active ? pointer.current.x * width : width * 0.54;
        const targetY = pointer.current.active ? pointer.current.y * height : height * 0.48;
        const x = targetX + Math.cos(phase * (1 + (i % 3) * 0.12)) * orbit;
        const y = targetY + Math.sin(phase * (0.86 + (i % 5) * 0.07)) * orbit * 0.62;

        context.beginPath();
        context.fillStyle = colors[i % colors.length];
        context.globalAlpha = 0.35 + (i % 5) * 0.1;
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();

        if (i > 0 && i % 2 === 0) {
          context.beginPath();
          context.strokeStyle = colors[(i + 1) % colors.length];
          context.globalAlpha = 0.12;
          context.moveTo(targetX, targetY);
          context.lineTo(x, y);
          context.stroke();
        }
      }

      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 1;
      frame += 1;
      if (!reduceMotion) animation = window.requestAnimationFrame(draw);
    };

    resize();
    if (reduceMotion) draw();
    else animation = window.requestAnimationFrame(draw);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animation);
    };
  }, [lens]);

  return (
    <canvas
      ref={canvasRef}
      className="creative-field"
      aria-hidden="true"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.current = {
          x: (event.clientX - rect.left) / rect.width,
          y: (event.clientY - rect.top) / rect.height,
          active: true,
        };
      }}
      onPointerLeave={() => {
        pointer.current.active = false;
      }}
    />
  );
}

function Choice<T extends string>({
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
    <div className="choice-row">
      {values.map((item, index) => (
        <button
          key={item}
          type="button"
          aria-pressed={value === item}
          className={value === item ? "is-active" : ""}
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
  const [studio, setStudio] = useState<StudioState>(defaultStudio);
  const [studioOpen, setStudioOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeResearch, setActiveResearch] = useState<Lens>("interaction");
  const [activeSection, setActiveSection] = useState("top");
  const [mirror, setMirror] = useState({ x: 28, y: 52 });
  const mirrorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("lior-noy-studio-v2");
      if (saved) setStudio({ ...defaultStudio, ...JSON.parse(saved) });
    } catch {
      // Local storage is optional.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    try {
      window.localStorage.setItem("lior-noy-studio-v2", JSON.stringify(studio));
    } catch {
      // Local storage is optional.
    }
  }, [studio]);

  useEffect(() => {
    const sections = ["top", "question", "research", "experiments", "about"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -65%", threshold: [0.05, 0.25, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const t = copy[language];
  const rtl = language === "he";
  const headline = t.hero[studio.lens];
  const currentResearch = research.find((item) => item.id === activeResearch) ?? research[0];

  const updateStudio = <K extends keyof StudioState>(key: K, value: StudioState[K]) => {
    setStudio((current) => ({ ...current, [key]: value }));
    if (key === "lens") setActiveResearch(value as Lens);
  };

  const navigate = (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  const moveMirror = (event: PointerEvent<HTMLDivElement>) => {
    const rect = mirrorRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMirror({
      x: Math.max(8, Math.min(47, ((event.clientX - rect.left) / rect.width) * 50)),
      y: Math.max(14, Math.min(86, ((event.clientY - rect.top) / rect.height) * 100)),
    });
  };

  const decisionSummary = useMemo(() => {
    const lensIndex = ["interaction", "search", "ai", "stage"].indexOf(studio.lens);
    const audienceIndex = ["public", "academic", "organizations"].indexOf(studio.audience);
    const energyIndex = ["precise", "playful"].indexOf(studio.energy);
    return [
      `${t.studio.lens} ${t.studio.lensOptions[lensIndex]}`,
      `${t.studio.audience} ${t.studio.audienceOptions[audienceIndex]}`,
      `${t.studio.energy} ${t.studio.energyOptions[energyIndex]}`,
    ].join("\n");
  }, [studio, t]);

  const copyDecisions = async () => {
    await navigator.clipboard.writeText(decisionSummary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main
      className="site"
      dir={rtl ? "rtl" : "ltr"}
      data-lens={studio.lens}
      data-energy={studio.energy}
    >
      <div className="prototype-bar">
        <span>{t.prototype}</span>
        <span>REACT × VITE × ONE PAGE</span>
      </div>

      <header className="site-header">
        <a href="#top" className="identity" onClick={(event) => navigate(event, "top")}>
          <span className="identity-mark" aria-hidden="true">LN</span>
          <span><b>{t.name}</b><small>{t.role}</small></span>
        </a>

        <nav aria-label={rtl ? "ניווט ראשי" : "Main navigation"}>
          {t.nav.map((label, index) => {
            const id = t.navTargets[index];
            return (
              <a
                key={id}
                href={`#${id}`}
                className={activeSection === id ? "is-current" : ""}
                onClick={(event) => navigate(event, id)}
              >
                <span>0{index + 1}</span>{label}
              </a>
            );
          })}
        </nav>

        <div className="header-tools">
          <button
            type="button"
            className="language-button"
            onClick={() => setLanguage((current) => (current === "he" ? "en" : "he"))}
            aria-label={rtl ? "Switch to English" : "מעבר לעברית"}
          >
            {rtl ? "EN" : "עב"}
          </button>
          <button type="button" className="studio-trigger" onClick={() => setStudioOpen(true)}>
            <i aria-hidden="true" /> {t.characterize}
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <CreativeField lens={studio.lens} />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-kicker">{t.eyebrow}</div>
        <div className="hero-count">01 / 06</div>
        <h1>
          <span>{headline[0]}</span>
          <span>{headline[1]}</span>
          <span className="accent-line">{headline[2]}</span>
        </h1>
        <div className="hero-info">
          <p>{t.body[studio.audience]}</p>
          <a href="#research" onClick={(event) => navigate(event, "research")}>
            {t.explore}<span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="hero-portrait">
          <div className="portrait-image">
            <img src="/lior-noy.jpg" alt={t.name} />
            <span className="portrait-halftone" aria-hidden="true" />
          </div>
          <span>PHOTO · ONO ACADEMIC COLLEGE</span>
        </div>
        <div className="live-indicator"><i /> LIVE SYSTEM</div>
      </section>

      <section className="big-question" id="question">
        <div className="section-code">Q / 001</div>
        <p>{t.questionLabel}</p>
        <h2>{t.question}</h2>
        <div className="question-orbit" aria-hidden="true">
          <span>HUMAN</span><i /><span>OTHER</span>
        </div>
      </section>

      <section className="research-section" id="research">
        <div className="section-heading">
          <div><span className="section-code">MAP / 04</span><h2>{t.axes}</h2></div>
          <p>{t.axesBody}</p>
        </div>

        <div className="research-map">
          <div className="research-tabs" role="tablist" aria-label={t.axes}>
            {research.map((item) => {
              const title = rtl ? item.titleHe : item.titleEn;
              const short = rtl ? item.shortHe : item.shortEn;
              const active = activeResearch === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={active ? "is-active" : ""}
                  onClick={() => {
                    setActiveResearch(item.id);
                    setStudio((current) => ({ ...current, lens: item.id }));
                  }}
                >
                  <span className="tab-number">{item.number}</span>
                  <span className="tab-copy"><b>{title}</b><small>{short}</small></span>
                  <span className="tab-action">{active ? t.close : t.open} ↗</span>
                </button>
              );
            })}
          </div>

          <article className="research-detail" key={currentResearch.id}>
            <div className="detail-top">
              <span>{currentResearch.year}</span>
              <span>ACTIVE AXIS · {currentResearch.number}</span>
            </div>
            <h3>{rtl ? currentResearch.titleHe : currentResearch.titleEn}</h3>
            <p>{rtl ? currentResearch.bodyHe : currentResearch.bodyEn}</p>
            <div className="research-stat">
              <strong>{currentResearch.stat}</strong>
              <span>{rtl ? currentResearch.statLabelHe : currentResearch.statLabelEn}</span>
            </div>
            <a href={currentResearch.link} target="_blank" rel="noreferrer">
              {rtl ? "למקור המחקרי" : "View research source"} <span>↗</span>
            </a>
          </article>
        </div>
      </section>

      <section className="mirror-lab" id="experiments">
        <div className="mirror-copy">
          <span className="section-code">{t.experimentLabel} · 01</span>
          <h2>{t.mirrorTitle}</h2>
          <p>{t.mirrorBody}</p>
          <small>{t.mirrorNote}</small>
        </div>
        <div
          className="mirror-field"
          ref={mirrorRef}
          onPointerMove={moveMirror}
          onPointerLeave={() => setMirror({ x: 28, y: 52 })}
          aria-label={t.mirrorTitle}
        >
          <div className="mirror-midline" />
          <div className="mirror-trace trace-a" style={{ left: `${mirror.x}%`, top: `${mirror.y}%` }} />
          <div className="mirror-trace trace-b" style={{ left: `${100 - mirror.x}%`, top: `${mirror.y}%` }} />
          <span className="mirror-person person-a">A</span>
          <span className="mirror-person person-b">B</span>
          <div className="mirror-readout">
            <span>SYNC</span>
            <strong>{Math.round(100 - Math.abs(mirror.y - 50) * 0.8)}%</strong>
          </div>
        </div>
      </section>

      <section className="papers-section">
        <div className="section-heading">
          <div><span className="section-code">{t.selectedLabel}</span><h2>{t.selectedTitle}</h2></div>
        </div>
        <div className="paper-list">
          {t.papers.map(([year, title, venue, description], index) => (
            <a href={paperLinks[index]} target="_blank" rel="noreferrer" className="paper-row" key={title}>
              <span className="paper-year">{year}</span>
              <h3>{title}</h3>
              <span className="paper-venue">{venue}</span>
              <p>{description}</p>
              <span className="paper-arrow">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="ai-section">
        <div className="ai-copy">
          <span className="section-code">{t.aiLabel}</span>
          <h2>{t.aiTitle}</h2>
          <p>{t.aiBody}</p>
          <a href="https://idanvidra.github.io/playing_along_paper_site/" target="_blank" rel="noreferrer">
            PLAYING ALONG · ICCC 2025 ↗
          </a>
        </div>
        <div className="yes-and" aria-label={t.yes}>
          <div className="yes-core"><span>{t.yes}</span></div>
          {t.yesLines.map((line, index) => (
            <div className={`yes-line line-${index + 1}`} key={line}>
              <span>0{index + 1}</span><p>{line}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="theatre-section">
        <div className="stage-light light-one" aria-hidden="true" />
        <div className="stage-light light-two" aria-hidden="true" />
        <div className="theatre-index">04</div>
        <div className="theatre-copy">
          <span className="section-code">{t.theatreLabel}</span>
          <h2>{t.theatreTitle}</h2>
          <p>{t.theatreBody}</p>
          <a href="https://www.weizmann.ac.il/mcb/alon/theatre-lab" target="_blank" rel="noreferrer">
            THEATRE LAB ↗
          </a>
        </div>
        <div className="stage-floor" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      </section>

      <section className="about-section" id="about">
        <div className="about-intro">
          <span className="section-code">{t.profileLabel}</span>
          <h2>{t.aboutTitle}</h2>
          <p>{t.aboutBody}</p>
        </div>
        <div className="profile-card">
          <div className="profile-photo"><img src="/lior-noy.jpg" alt={t.name} /></div>
          <div className="role-list">
            {t.roles.map((role, index) => <div key={role}><span>0{index + 1}</span><p>{role}</p></div>)}
          </div>
        </div>
        <div className="metrics-grid">
          {t.metrics.map(([value, label]) => (
            <div key={label}><strong>{value}</strong><span>{label}</span></div>
          ))}
        </div>
      </section>

      <footer>
        <div className="footer-title"><span>{t.name}</span><strong>CREATIVE<br />INTERACTIONS</strong></div>
        <div className="footer-links">
          {[
            "https://scholar.google.com/citations?user=-w05QJkAAAAJ&hl=en",
            "https://orcid.org/0000-0001-8505-3889",
            "https://www.weizmann.ac.il/mcb/alon/theatre-lab",
            "mailto:lior.noy.1@gmail.com",
          ].map((href, index) => (
            <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" key={href}>
              {t.links[index]} <span>↗</span>
            </a>
          ))}
        </div>
        <div className="footer-bottom"><span>{t.footer}</span><button onClick={() => setStudioOpen(true)}>{t.characterize} ↗</button></div>
      </footer>

      <div className={studioOpen ? "studio-backdrop is-open" : "studio-backdrop"} onClick={() => setStudioOpen(false)} />
      <aside className={studioOpen ? "studio-panel is-open" : "studio-panel"} aria-hidden={!studioOpen}>
        <div className="studio-header">
          <div><span>LIVE / CHARACTERIZATION</span><h2>{t.studio.title}</h2></div>
          <button type="button" onClick={() => setStudioOpen(false)} aria-label={t.studio.close}>×</button>
        </div>
        <p className="studio-intro">{t.studio.intro}</p>
        <div className="studio-question">
          <span>01</span><h3>{t.studio.lens}</h3>
          <Choice
            values={["interaction", "search", "ai", "stage"] as const}
            labels={t.studio.lensOptions}
            value={studio.lens}
            onChange={(value) => updateStudio("lens", value)}
          />
        </div>
        <div className="studio-question">
          <span>02</span><h3>{t.studio.audience}</h3>
          <Choice
            values={["public", "academic", "organizations"] as const}
            labels={t.studio.audienceOptions}
            value={studio.audience}
            onChange={(value) => updateStudio("audience", value)}
          />
        </div>
        <div className="studio-question">
          <span>03</span><h3>{t.studio.energy}</h3>
          <Choice
            values={["precise", "playful"] as const}
            labels={t.studio.energyOptions}
            value={studio.energy}
            onChange={(value) => updateStudio("energy", value)}
          />
        </div>
        <div className="studio-actions">
          <button type="button" className="copy-decisions" onClick={copyDecisions}>{copied ? t.studio.copied : t.studio.copy}</button>
          <button type="button" onClick={() => setStudio(defaultStudio)}>{t.studio.reset}</button>
        </div>
        <small className="studio-note">{t.studio.note}</small>
      </aside>
    </main>
  );
}
