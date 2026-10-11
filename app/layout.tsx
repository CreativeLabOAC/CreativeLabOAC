import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const isGitHubPages = process.env.GITHUB_PAGES === "true";
  const requestHeaders = isGitHubPages ? new Headers() : await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = isGitHubPages ? "https://creativelaboac.github.io/CreativeLabOAC/" : `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Dr. Lior Noy — Creative Action Lab",
    description:
      "Creative joint action through behavioral experiments, computational models and improvisation.",
    icons: { icon: isGitHubPages ? "/CreativeLabOAC/favicon.svg" : "/favicon.svg" },
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
