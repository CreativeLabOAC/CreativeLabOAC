import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "ד״ר ליאור נוי — אינטראקציות יצירתיות",
    description:
      "מחקר על תנועה משותפת, חיפוש יצירתי, אימפרוביזציה ואינטראקציות אדם–AI.",
    icons: { icon: "/favicon.svg" },
    openGraph: {
      title: "Dr. Lior Noy — Creative Interactions",
      description:
        "Researching how creativity emerges between people—and between humans and AI.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Dr. Lior Noy — Creative Interactions",
      description: "Researching creativity as an interaction.",
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
