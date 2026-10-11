"use client";

import { useEffect, useMemo, useState } from "react";

type Language = "he" | "en";
type Audience = "public" | "academic" | "organizations";
type Focus = "interaction" | "search" | "ai" | "theatre";
type Depth = "concise" | "detailed";

type Answers = {
  goal: string;
  audience: string;
  audienceOther: string;
  action: string;
  positioning: string;
  distinction: string;
  focus: string;
  focusOther: string;
  tone: string;
  toneOther: string;
  depth: string;
  depthOther: string;
  sections: string[];
  sectionOthers: string[];
  proof: string;
  language: string;
  languageOther: string;
  avoid: string;
  notes: string;
};

const emptyAnswers: Answers = {
  goal: "", audience: "", audienceOther: "", action: "", positioning: "", distinction: "", focus: "", focusOther: "",
  tone: "", toneOther: "", depth: "", depthOther: "", sections: [], sectionOthers: [], proof: "", language: "", languageOther: "", avoid: "", notes: "",
};

const content = {
  he: {
    kicker: "אפיון האתר",
    title: "לפני שבונים, מחליטים.",
    intro: "שאלון עבודה ממוקד לפגישה עם ד״ר ליאור נוי. התשובות נשמרות במכשיר הזה ומתגבשות למסמך החלטות שאפשר להעתיק או להוריד.",
    privacy: "נשמר מקומית בדפדפן · לא נשלח לשרת",
    sections: [
      { number: "01", title: "מטרה וקהל", subtitle: "מה האתר צריך להשיג — ועבור מי?" },
      { number: "02", title: "זהות וסיפור", subtitle: "איך ליאור רוצה להיות מובן וזכור?" },
      { number: "03", title: "תוכן וחוויה", subtitle: "מה נכנס לאתר, באיזה עומק ובאיזה טון?" },
      { number: "04", title: "גבולות והחלטות", subtitle: "מה חייב להופיע, ומה עדיין דורש אישור?" },
    ],
    questions: {
      goal: ["מהי ההצלחה המרכזית של האתר?", "מה תרצה שמבקר יבין, ירגיש או יעשה לאחר הביקור?"],
      audience: ["מי הקהל הראשון שהאתר צריך לשרת?", "אפשר לבחור קהל מוביל אחד; קהלים נוספים יישארו משניים."],
      action: ["מהי הפעולה החשובה ביותר למבקר?", "לדוגמה: ליצור קשר, להזמין הרצאה, לקרוא מחקר או להכיר את העשייה."],
      positioning: ["איך היית מציג את עצמך במשפט אחד?", "ניסוח ראשוני ולא מחייב לכותרת ולמסר המרכזי."],
      distinction: ["מה מייחד את העבודה שלך?", "איזה חיבור, שיטה או נקודת מבט לא נמצא אצל חוקרים אחרים?"],
      focus: ["איזה תחום צריך להוביל את הסיפור?", "הבחירה תשנה גם את הדגש בתצוגת האתר."],
      tone: ["איזו תחושה האתר צריך לשדר?", "בחר את הטון הקרוב ביותר; אפשר לדייק בהערות."],
      depth: ["כמה עומק תוכן נכון לגרסה הראשונה?", "תמציתי מתאים להיכרות מהירה; מפורט מאפשר בניית סמכות מקצועית."],
      sections: ["אילו אזורים חייבים להופיע באתר?", "אפשר לבחור כמה תשובות."],
      proof: ["אילו הוכחות מחזקות אמון?", "תפקידים, מוסדות, ציטוטים, מאמרים, הרצאות, לקוחות או פרויקטים."],
      language: ["מהי אסטרטגיית השפה?", "איזו שפה מובילה, והאם שתי הגרסאות צריכות להיות זהות?"],
      avoid: ["מה לא צריך להופיע או להישמע באתר?", "נושאים לא מאושרים, ניסוחים בעייתיים, פרטים אישיים או הבטחות שלא רוצים לנסח."],
      notes: ["מה עדיין פתוח?", "שאלות, הסתייגויות ורעיונות שצריך לחזור אליהם."],
    },
    options: {
      audience: [["public", "קהל רחב"], ["academic", "אקדמיה ומחקר"], ["organizations", "ארגונים ושותפים"]],
      focus: [["interaction", "אינטראקציות יצירתיות"], ["search", "חיפוש יצירתי"], ["ai", "אדם–AI"], ["theatre", "תיאטרון ואימפרוביזציה"]],
      tone: [["research", "מחקרי ומדויק"], ["human", "אנושי ונגיש"], ["bold", "חדשני ונועז"], ["hybrid", "מאוזן בין השלושה"]],
      depth: [["concise", "תמציתי"], ["detailed", "מפורט"]],
      language: [["he", "עברית מובילה"], ["en", "אנגלית מובילה"], ["equal", "שתי שפות במעמד שווה"]],
      sections: [["about", "אודות"], ["research", "תחומי מחקר"], ["publications", "פרסומים"], ["speaking", "הרצאות וסדנאות"], ["projects", "פרויקטים"], ["contact", "יצירת קשר"]],
    },
    placeholders: {
      goal: "למשל: ליצור תמונה מקצועית ברורה שמחברת בין מחקר, יצירתיות ויישום…",
      action: "הפעולה המרכזית שהמבקר צריך לבצע…",
      positioning: "אני חוקר / יוצר / מרצה ש…",
      distinction: "החיבור הייחודי בין…",
      proof: "רשימת עובדות, הישגים ומקורות שאפשר להציג…",
      avoid: "תוכן שדורש אישור או שלא נכון לפרסם…",
      notes: "נקודות להמשך הדיון…",
    },
    summary: "סיכום החלטות",
    progress: "הושלמו",
    empty: "התשובות יופיעו כאן תוך כדי מילוי.",
    copy: "העתקת הסיכום",
    copied: "הסיכום הועתק",
    download: "הורדת קובץ",
    reset: "איפוס השאלון",
    resetConfirm: "לאפס את כל התשובות שנשמרו במכשיר הזה?",
    other: "אחר",
    otherPlaceholder: "כתבו אפשרות אחרת…",
    addOtherArea: "אזור נוסף באתר",
    removeOther: "הסרה",
    saved: "נשמר אוטומטית",
    unanswered: "טרם נענה",
  },
  en: {
    kicker: "Website characterization",
    title: "Decide before designing.",
    intro: "A focused working questionnaire for a meeting with Dr. Lior Noy. Answers are saved on this device and compiled into a decision document that can be copied or downloaded.",
    privacy: "Stored locally in this browser · never sent to a server",
    sections: [
      { number: "01", title: "Purpose & audience", subtitle: "What should the site achieve, and for whom?" },
      { number: "02", title: "Identity & story", subtitle: "How should Lior be understood and remembered?" },
      { number: "03", title: "Content & experience", subtitle: "What belongs on the site, at what depth and tone?" },
      { number: "04", title: "Boundaries & decisions", subtitle: "What must appear, and what still needs approval?" },
    ],
    questions: {
      goal: ["What is the site’s primary measure of success?", "What should a visitor understand, feel or do after visiting?"],
      audience: ["Who is the first audience the site should serve?", "Choose one leading audience; others can remain secondary."],
      action: ["What is the most important visitor action?", "For example: make contact, book a talk, read research or understand the work."],
      positioning: ["How would you introduce yourself in one sentence?", "A first, non-binding draft for the headline and core message."],
      distinction: ["What makes your work distinctive?", "Which combination, method or point of view is uniquely yours?"],
      focus: ["Which field should lead the story?", "This choice also changes the emphasis in the site preview."],
      tone: ["What should the site feel like?", "Choose the closest tone and refine it in the notes."],
      depth: ["How much content depth is right for the first version?", "Concise supports quick orientation; detailed builds professional authority."],
      sections: ["Which areas must appear on the site?", "Select as many as needed."],
      proof: ["Which proof points create trust?", "Roles, institutions, citations, papers, talks, clients or projects."],
      language: ["What is the language strategy?", "Which language leads, and should both versions be identical?"],
      avoid: ["What should not appear or be implied?", "Unapproved topics, problematic wording, personal information or unwanted promises."],
      notes: ["What remains open?", "Questions, reservations and ideas to revisit."],
    },
    options: {
      audience: [["public", "General public"], ["academic", "Academia & research"], ["organizations", "Organizations & partners"]],
      focus: [["interaction", "Creative interactions"], ["search", "Creative search"], ["ai", "Human–AI"], ["theatre", "Theatre & improvisation"]],
      tone: [["research", "Rigorous & research-led"], ["human", "Human & accessible"], ["bold", "Innovative & bold"], ["hybrid", "Balanced"]],
      depth: [["concise", "Concise"], ["detailed", "Detailed"]],
      language: [["he", "Hebrew first"], ["en", "English first"], ["equal", "Equal bilingual presence"]],
      sections: [["about", "About"], ["research", "Research areas"], ["publications", "Publications"], ["speaking", "Talks & workshops"], ["projects", "Projects"], ["contact", "Contact"]],
    },
    placeholders: {
      goal: "For example: create a clear professional picture connecting research, creativity and application…",
      action: "The primary action a visitor should take…",
      positioning: "I am a researcher / creator / lecturer who…",
      distinction: "The distinctive connection between…",
      proof: "Facts, achievements and sources that can be shown…",
      avoid: "Content that needs approval or should not be published…",
      notes: "Points for the next discussion…",
    },
    summary: "Decision summary",
    progress: "completed",
    empty: "Answers will appear here as the questionnaire is completed.",
    copy: "Copy summary",
    copied: "Summary copied",
    download: "Download file",
    reset: "Reset questionnaire",
    resetConfirm: "Reset all answers saved on this device?",
    other: "Other",
    otherPlaceholder: "Enter another option…",
    addOtherArea: "Another site area",
    removeOther: "Remove",
    saved: "Saved automatically",
    unanswered: "Not answered",
  },
} as const;

function ChoiceGroup({ name, value, options, otherLabel, otherPlaceholder, otherValue, onChange, onOtherChange }: {
  name: string; value: string; options: readonly (readonly [string, string])[]; otherLabel: string; otherPlaceholder: string;
  otherValue: string; onChange: (value: string) => void; onOtherChange: (value: string) => void;
}) {
  return <div className="choice-wrap"><div className="choice-grid">{[...options, ["other", otherLabel] as const].map(([optionValue, label]) => (
    <label className={value === optionValue ? "selected" : ""} key={optionValue}>
      <input type="radio" name={name} value={optionValue} checked={value === optionValue} onChange={() => onChange(optionValue)} />
      <span>{label}</span><i aria-hidden="true" />
    </label>
  ))}</div>{value === "other" && <input className="other-choice-input" value={otherValue} autoFocus placeholder={otherPlaceholder} aria-label={`${otherLabel} — ${name}`} onChange={(event) => onOtherChange(event.target.value)} />}</div>;
}

function TextQuestion({ id, title, help, placeholder, value, multiline = false, onChange }: {
  id: string; title: string; help: string; placeholder: string; value: string; multiline?: boolean; onChange: (value: string) => void;
}) {
  return <div className="form-question">
    <label htmlFor={`question-${id}`}><strong>{title}</strong><span>{help}</span></label>
    {multiline
      ? <textarea id={`question-${id}`} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      : <input id={`question-${id}`} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />}
  </div>;
}

export default function CharacterizationWorkspace({ language, onStrategyChange }: {
  language: Language;
  onStrategyChange: (key: "audience" | "focus" | "depth", value: Audience | Focus | Depth) => void;
}) {
  const t = content[language];
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem("lior-noy-characterization-v1");
        if (saved) setAnswers({ ...emptyAnswers, ...JSON.parse(saved) });
      } catch { /* Local storage is optional. */ }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem("lior-noy-characterization-v1", JSON.stringify(answers)); } catch { /* Keep the form usable without storage. */ }
  }, [answers, ready]);

  const update = (key: keyof Answers, value: string | string[]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    if (key === "audience" && ["public", "academic", "organizations"].includes(value as string)) onStrategyChange(key, value as Audience);
    if (key === "focus" && ["interaction", "search", "ai", "theatre"].includes(value as string)) onStrategyChange(key, value as Focus);
    if (key === "depth" && ["concise", "detailed"].includes(value as string)) onStrategyChange(key, value as Depth);
  };
  const toggleSection = (value: string) => update("sections", answers.sections.includes(value) ? answers.sections.filter((item) => item !== value) : [...answers.sections, value]);
  const updateOtherSection = (index: number, value: string) => {
    const next = [...answers.sectionOthers];
    if (index === next.length) {
      if (value.trim()) next.push(value);
    } else {
      if (value.trim()) next[index] = value;
      else next.splice(index, 1);
    }
    update("sectionOthers", next);
  };
  const removeOtherSection = (index: number) => update("sectionOthers", answers.sectionOthers.filter((_, itemIndex) => itemIndex !== index));

  const requiredKeys: (keyof Answers)[] = ["goal", "audience", "action", "positioning", "distinction", "focus", "tone", "depth", "sections", "proof", "language", "avoid"];
  const otherValueFor = (key: keyof Answers) => String(answers[`${key}Other` as keyof Answers] ?? "");
  const completed = requiredKeys.filter((key) => {
    if (key === "sections") return answers.sections.length > 0 || answers.sectionOthers.some((item) => item.trim());
    const value = answers[key];
    if (typeof value !== "string") return value.length > 0;
    return ["audience", "focus", "tone", "depth", "language"].includes(key) && value === "other" ? Boolean(otherValueFor(key).trim()) : Boolean(value.trim());
  }).length;
  const percentage = Math.round((completed / requiredKeys.length) * 100);

  const labels = useMemo(() => ({
    goal: t.questions.goal[0], audience: t.questions.audience[0], action: t.questions.action[0], positioning: t.questions.positioning[0],
    distinction: t.questions.distinction[0], focus: t.questions.focus[0], tone: t.questions.tone[0], depth: t.questions.depth[0],
    sections: t.questions.sections[0], proof: t.questions.proof[0], language: t.questions.language[0], avoid: t.questions.avoid[0], notes: t.questions.notes[0],
  }), [t]);
  const optionSets = t.options as Record<string, readonly (readonly [string, string])[]>;
  const optionLabel = (key: string, value: string) => value === "other" ? (answers[`${key}Other` as keyof Answers] as string || t.other) : optionSets[key]?.find(([id]) => id === value)?.[1] ?? value;
  const summaryLines = (Object.keys(labels) as (keyof typeof labels)[]).map((key) => {
    const raw = answers[key];
    const value = key === "sections"
      ? [...answers.sections.map((item) => optionLabel("sections", item)), ...answers.sectionOthers.filter((item) => item.trim())].join(", ")
      : Array.isArray(raw) ? raw.join(", ") : (["audience", "focus", "tone", "depth", "language"].includes(key) ? optionLabel(key, raw) : raw);
    return `${labels[key]}\n${value || t.unanswered}`;
  });
  const summary = `${t.title}\n${"=".repeat(t.title.length)}\n\n${summaryLines.join("\n\n")}`;

  const copySummary = async () => {
    try { await navigator.clipboard.writeText(summary); setCopied(true); window.setTimeout(() => setCopied(false), 1600); } catch { setCopied(false); }
  };
  const downloadSummary = () => {
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "lior-noy-site-characterization.txt"; link.click();
    URL.revokeObjectURL(url);
  };
  const reset = () => {
    if (!window.confirm(t.resetConfirm)) return;
    setAnswers(emptyAnswers);
    try { window.localStorage.removeItem("lior-noy-characterization-v1"); } catch { /* Optional. */ }
  };

  return <section className="screen characterization-screen">
    <div className="characterization-hero">
      <div className="page-kicker"><span>05</span><p>{t.kicker}</p></div>
      <div className="characterization-title"><h1>{t.title}</h1><p>{t.intro}</p><small>{t.privacy}</small></div>
    </div>

    <div className="characterization-layout">
      <form className="characterization-form" onSubmit={(event) => event.preventDefault()}>
        <fieldset><legend><span>{t.sections[0].number}</span><b>{t.sections[0].title}</b><small>{t.sections[0].subtitle}</small></legend>
          <TextQuestion id="goal" title={t.questions.goal[0]} help={t.questions.goal[1]} placeholder={t.placeholders.goal} value={answers.goal} multiline onChange={(value) => update("goal", value)} />
          <div className="form-question"><div className="question-label"><strong>{t.questions.audience[0]}</strong><span>{t.questions.audience[1]}</span></div><ChoiceGroup name="audience" value={answers.audience} options={t.options.audience} otherLabel={t.other} otherPlaceholder={t.otherPlaceholder} otherValue={answers.audienceOther} onChange={(value) => update("audience", value)} onOtherChange={(value) => update("audienceOther", value)} /></div>
          <TextQuestion id="action" title={t.questions.action[0]} help={t.questions.action[1]} placeholder={t.placeholders.action} value={answers.action} onChange={(value) => update("action", value)} />
        </fieldset>

        <fieldset><legend><span>{t.sections[1].number}</span><b>{t.sections[1].title}</b><small>{t.sections[1].subtitle}</small></legend>
          <TextQuestion id="positioning" title={t.questions.positioning[0]} help={t.questions.positioning[1]} placeholder={t.placeholders.positioning} value={answers.positioning} multiline onChange={(value) => update("positioning", value)} />
          <TextQuestion id="distinction" title={t.questions.distinction[0]} help={t.questions.distinction[1]} placeholder={t.placeholders.distinction} value={answers.distinction} multiline onChange={(value) => update("distinction", value)} />
          <div className="form-question"><div className="question-label"><strong>{t.questions.focus[0]}</strong><span>{t.questions.focus[1]}</span></div><ChoiceGroup name="focus" value={answers.focus} options={t.options.focus} otherLabel={t.other} otherPlaceholder={t.otherPlaceholder} otherValue={answers.focusOther} onChange={(value) => update("focus", value)} onOtherChange={(value) => update("focusOther", value)} /></div>
        </fieldset>

        <fieldset><legend><span>{t.sections[2].number}</span><b>{t.sections[2].title}</b><small>{t.sections[2].subtitle}</small></legend>
          <div className="form-question"><div className="question-label"><strong>{t.questions.tone[0]}</strong><span>{t.questions.tone[1]}</span></div><ChoiceGroup name="tone" value={answers.tone} options={t.options.tone} otherLabel={t.other} otherPlaceholder={t.otherPlaceholder} otherValue={answers.toneOther} onChange={(value) => update("tone", value)} onOtherChange={(value) => update("toneOther", value)} /></div>
          <div className="form-question"><div className="question-label"><strong>{t.questions.depth[0]}</strong><span>{t.questions.depth[1]}</span></div><ChoiceGroup name="depth" value={answers.depth} options={t.options.depth} otherLabel={t.other} otherPlaceholder={t.otherPlaceholder} otherValue={answers.depthOther} onChange={(value) => update("depth", value)} onOtherChange={(value) => update("depthOther", value)} /></div>
          <div className="form-question"><div className="question-label"><strong>{t.questions.sections[0]}</strong><span>{t.questions.sections[1]}</span></div><div className="choice-grid checkbox-grid">{t.options.sections.map(([value, label]) => <label className={answers.sections.includes(value) ? "selected" : ""} key={value}><input type="checkbox" checked={answers.sections.includes(value)} onChange={() => toggleSection(value)} /><span>{label}</span><i aria-hidden="true" /></label>)}</div><div className="other-sections">{[...answers.sectionOthers, ""].map((value, index) => <div className="other-section-row" key={index}><label htmlFor={`other-section-${index}`}>{t.addOtherArea} {index + 1}</label><input id={`other-section-${index}`} value={value} placeholder={t.otherPlaceholder} onChange={(event) => updateOtherSection(index, event.target.value)} />{index < answers.sectionOthers.length && <button type="button" onClick={() => removeOtherSection(index)} aria-label={`${t.removeOther} ${index + 1}`}>×</button>}</div>)}</div></div>
        </fieldset>

        <fieldset><legend><span>{t.sections[3].number}</span><b>{t.sections[3].title}</b><small>{t.sections[3].subtitle}</small></legend>
          <TextQuestion id="proof" title={t.questions.proof[0]} help={t.questions.proof[1]} placeholder={t.placeholders.proof} value={answers.proof} multiline onChange={(value) => update("proof", value)} />
          <div className="form-question"><div className="question-label"><strong>{t.questions.language[0]}</strong><span>{t.questions.language[1]}</span></div><ChoiceGroup name="language" value={answers.language} options={t.options.language} otherLabel={t.other} otherPlaceholder={t.otherPlaceholder} otherValue={answers.languageOther} onChange={(value) => update("language", value)} onOtherChange={(value) => update("languageOther", value)} /></div>
          <TextQuestion id="avoid" title={t.questions.avoid[0]} help={t.questions.avoid[1]} placeholder={t.placeholders.avoid} value={answers.avoid} multiline onChange={(value) => update("avoid", value)} />
          <TextQuestion id="notes" title={t.questions.notes[0]} help={t.questions.notes[1]} placeholder={t.placeholders.notes} value={answers.notes} multiline onChange={(value) => update("notes", value)} />
        </fieldset>
      </form>

      <aside className="characterization-summary">
        <div className="summary-head"><span>OUTPUT / 01</span><small>{ready ? t.saved : "…"}</small><h2>{t.summary}</h2></div>
        <div className="completion"><div><strong>{percentage}%</strong><span>{completed} / {requiredKeys.length} {t.progress}</span></div><i><b style={{ width: `${percentage}%` }} /></i></div>
        <div className="summary-preview">{completed === 0 && !answers.notes ? <p>{t.empty}</p> : summaryLines.map((line, index) => {
          const [label, ...valueParts] = line.split("\n");
          const value = valueParts.join("\n");
          if (value === t.unanswered) return null;
          return <div key={label}><span>{String(index + 1).padStart(2, "0")}</span><b>{label}</b><p>{value}</p></div>;
        })}</div>
        <div className="summary-actions"><button type="button" onClick={copySummary}>{copied ? t.copied : t.copy}</button><button type="button" onClick={downloadSummary}>{t.download}</button><button type="button" className="reset-button" onClick={reset}>{t.reset}</button></div>
      </aside>
    </div>
  </section>;
}
