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
    title: "Dr. Lior Noy — Creative Action Lab",
    description:
      "Creative joint action through behavioral experiments, computational models and improvisation.",
    icons: { icon: "/favicon.svg" },
    openGraph: {
      title: "Dr. Lior Noy — Creative Action Lab",
      description:
        "Studying creative joint action through behavioral experiments, computational models and improvisation.",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Dr. Lior Noy — Creative Action Lab",
      description: "A computational science of creative collaboration.",
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
