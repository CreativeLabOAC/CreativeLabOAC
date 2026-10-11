// Add approved URLs here. Missing resources render as text, never broken links.
export const resources: { cv: string | null; scholar: string | null; email: string | null; podcast: string | null } = {
  cv: null, scholar: null, email: null, podcast: null,
};
type Bilingual = { en: string; he: string };
export const events: { date: string; title: Bilingual; description: Bilingual; url?: string }[] = [];
export const episodes: { title: Bilingual; description: Bilingual; url: string }[] = [];
export const papers = [
  {year: "2018", title: "Creative exploration as a scale-invariant search on a meaning landscape", he: "חיפוש יצירתי כחיפוש אינווריאנטי לקנה מידה בנוף משמעות", authors: "Yuval Hart, Hagar Goldberg, Ella Striem-Amit, Avraham E. Mayo, Lior Noy & Uri Alon", venue: "Nature Communications", doi: "10.1038/s41467-018-07715-8"},
  {year: "2017", title: "Creative foraging: An experimental paradigm for studying exploration and discovery", he: "חיפוש יצירתי: פרדיגמה ניסויית לחקר חיפוש וגילוי", authors: "Yuval Hart, Avraham E. Mayo, Ruth Mayo, Liron Rozenkrantz, Avichai Tendler, Uri Alon & Lior Noy", venue: "PLOS ONE", doi: "10.1371/journal.pone.0182133"},
  {year: "2011", title: "The mirror game as a paradigm for studying the dynamics of two people improvising motion together", he: "משחק המראה כפרדיגמה לחקר הדינמיקה של שני אנשים המאלתרים תנועה יחד", authors: "Lior Noy, Erez Dekel & Uri Alon", venue: "PNAS", doi: "10.1073/pnas.1108155108"},
];
export const researchTerms = {
  interaction: ["אימפרוביזציה משותפת", "משחק המראה", "סנכרון", "יחדיו"],
  search: ["חיפוש יצירתי", "חקירה", "גילוי", "נופי משמעות"],
  ai: ["אינטראקציית אדם–סוכן", "סיפור משותף", "יצירה משותפת", "מודלים חישוביים"],
};
export const personNames: Record<string,string> = {"Maor Rosenberg":"מאור רוזנברג", "Daniel Khanoukov":"דניאל חנוקוב", "Idan Vidra":"עידן וידרה", "Gal Kimron":"גל קמרון", "Arik Shamir":"אריק שמיר", "Mario Mikulincer":"מריו מיקולינסר", "Jason Friedman":"ג׳ייסון פרידמן", "Kristian Tylén":"קריסטיאן טילן", "Robrecht van der Wel":"רוברכט ואן דר ול", "Jacob Sherson":"יעקב שרסון"};
export const institutions: Record<string,string> = {"Reichman University":"אוניברסיטת רייכמן", "Tel Aviv University":"אוניברסיטת תל אביב", "Aarhus University":"אוניברסיטת אורהוס", "Rutgers University":"אוניברסיטת ראטגרס"};
export const labels = {
 en: {
  move: "MOVE", listen: "Listen", create: "CREATE", cv: "Curriculum vitae", comingSoon: "Link will be added", readResearch: "Read the research", permalink: "Project link", discussProject: "Discuss this project", more: "Details",
  mirror: "Mirror Game", mirrorIntro: "How two people coordinate and improvise movement together.", foraging: "Creative Foraging", foragingIntro: "An experimental window into exploration and discovery.", meetLab: "Meet the lab", joinIntro: "People, research interests and opportunities for collaboration.",
  podcastIntro: "In Motion connects the lab’s interest in movement, listening and interaction with a space for conversation and further exploration.", selectedEpisodes: "Selected episodes", episodesPending: "Listening links and selected episodes will be added here.",
  contactPaths: [["Research collaboration", "Introduce your research question, methods and the connection you see to creative joint action."], ["Join the lab", "Students and prospective research collaborators: share your background, interests and the question you would like to explore. Enquiries do not imply an open position."], ["Talks & workshops", "For academic talks and workshops, describe your audience, topic and proposed format."]],
  email: "Send an email", emailPending: "Email address will be added", eventsTitle: "Talks, workshops & events", noEvents: "Upcoming events will appear here when dates are confirmed.",
 },
 he: {
  move: "תנועה", listen: "להאזנה", create: "יצירה", cv: "קורות חיים", comingSoon: "הקישור יתווסף בהמשך", readResearch: "לקריאת המחקר", permalink: "קישור לפרויקט", discussProject: "לשיחה על הפרויקט", more: "פרטים",
  mirror: "משחק המראה", mirrorIntro: "כיצד שני אנשים מתאמים ומאלתרים תנועה יחד.", foraging: "חיפוש יצירתי", foragingIntro: "חלון ניסויי לתהליכי חיפוש וגילוי.", meetLab: "היכרות עם המעבדה", joinIntro: "אנשים, תחומי עניין ואפשרויות לשיתוף פעולה.",
  podcastIntro: "פודקאסט בתנועה מחבר את עניינה של המעבדה בתנועה, הקשבה ואינטראקציה למרחב של שיחה והעמקה.", selectedEpisodes: "פרקים נבחרים", episodesPending: "קישורי האזנה ופרקים נבחרים יתווספו כאן בהמשך.",
  contactPaths: [["שיתוף פעולה מחקרי", "הציגו את שאלת המחקר, השיטות והחיבור שאתם רואים לפעולה יצירתית משותפת."], ["הצטרפות למעבדה", "סטודנטים ושותפים פוטנציאליים למחקר: שתפו ברקע שלכם, בתחומי העניין ובשאלה שתרצו לחקור. פנייה אינה מעידה על משרה פתוחה."], ["הרצאות וסדנאות", "לפנייה בנושא הרצאות וסדנאות אקדמיות, תארו את הקהל, הנושא והמתכונת המבוקשת."]],
  email: "שליחת אימייל", emailPending: "כתובת האימייל תתווסף בהמשך", eventsTitle: "הרצאות, סדנאות ואירועים", noEvents: "אירועים קרובים יוצגו כאן לאחר אישור המועדים.",
 },
} as const;
