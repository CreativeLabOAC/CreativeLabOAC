import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Hebrew profile shell and SPA navigation", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="he" dir="rtl">/);
  assert.match(html, /<title>ד״ר ליאור נוי — אינטראקציות יצירתיות<\/title>/);
  assert.match(html, /href="#\/about"/);
  assert.match(html, /href="#\/research"/);
  assert.match(html, /href="#\/publications"/);
  assert.match(html, /href="#\/profile"/);
  assert.match(html, /class="page-stage" tabindex="-1" aria-live="polite"/);
  assert.match(html, /lior-noy\.jpg/);
  assert.doesNotMatch(html, /role="dialog"/);
});

test("keeps routing, mobile navigation and Studio safeguards in source", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /addEventListener\("hashchange", syncRoute\)/);
  assert.match(page, /aria-current=\{page === target \? "page"/);
  assert.match(page, /studioOpen && <>/);
  assert.match(page, /event\.key === "Escape"/);
  assert.match(page, /setActiveResearch\("interaction"\)/);
  assert.match(page, /href=\{hrefFor\(previousPage\)\}/);
  assert.match(page, /document\.title =/);

  assert.match(css, /@media\(max-width:720px\)/);
  assert.match(css, /\.header nav\{position:fixed/);
  assert.match(css, /bottom:0/);
  assert.doesNotMatch(css, /\.header nav\{display:none\}/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
});
