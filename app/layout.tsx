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
    description: "אב־טיפוס אינטראקטיבי לאתר האישי של ד״ר ליאור נוי.",
    icons: { icon: "/favicon.svg" },
    openGraph: {
      title: "Dr. Lior Noy — Creative Interactions",
      description: "An interactive characterization prototype for Dr. Lior Noy’s personal website.",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1744, height: 909, alt: "Dr. Lior Noy — Creative Interactions" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Dr. Lior Noy — Creative Interactions",
      description: "An interactive characterization prototype.",
      images: [`${origin}/og.png`],
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
