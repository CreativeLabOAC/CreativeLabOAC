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

test("server-renders the English research shell and SPA navigation", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="en" dir="ltr">/);
  assert.match(html, /<title>Dr\. Lior Noy — Creative Action Lab<\/title>/);
  assert.match(html, /href="#\/about"/);
  assert.match(html, /href="#\/"/);
  assert.match(html, /href="#\/research"/);
  assert.match(html, /href="#\/publications"/);
  assert.match(html, /href="#\/projects"/);
  assert.match(html, /href="#\/lab"/);
  assert.match(html, /href="#\/contact"/);
  assert.match(html, /class="page-stage" tabindex="-1" aria-live="polite"/);
  assert.match(html, /class="route-progress"/);
  assert.match(html, /class="interaction-axis"/);
  assert.match(html, /lior-noy\.jpg/);
  assert.doesNotMatch(html, /role="dialog"/);
});

test("keeps routing, mobile navigation and characterization workspace safeguards in source", async () => {
  const [page, workspace, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/CharacterizationWorkspace.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /addEventListener\("hashchange", syncRoute\)/);
  assert.match(page, /aria-current=\{page === target \? "page"/);
  assert.match(page, /"characterize"/);
  assert.match(page, /<CharacterizationWorkspace/);
  assert.match(page, /href=\{hrefFor\(previousPage\)\}/);
  assert.match(page, /document\.title =/);
  assert.match(page, /aria-controls="research-panel"/);
  assert.match(page, /Senior Lecturer/);
  assert.match(page, /\["Paz", "Member bio pending"/);
  assert.match(page, /\["Rani", "Member bio pending"/);
  assert.match(page, /\["Prie", "Member bio pending"/);
  assert.doesNotMatch(page, /Deputy Head/);
  assert.doesNotMatch(page, /mailto:/);

  assert.match(workspace, /localStorage\.setItem/);
  assert.match(workspace, /navigator\.clipboard\.writeText/);
  assert.match(workspace, /URL\.createObjectURL/);
  assert.match(workspace, /lior-noy-site-characterization\.txt/);
  assert.match(workspace, /type="radio"/);
  assert.match(workspace, /type="checkbox"/);
  assert.match(workspace, /other-choice-input/);
  assert.match(workspace, /sectionOthers/);
  assert.match(workspace, /updateOtherSection/);

  assert.match(css, /@media\(max-width:720px\)/);
  assert.match(css, /\.header nav\{position:fixed/);
  assert.match(css, /width:100%/);
  assert.match(css, /justify-self:stretch/);
  assert.match(css, /bottom:0/);
  assert.doesNotMatch(css, /\.header nav\{display:none\}/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
});
