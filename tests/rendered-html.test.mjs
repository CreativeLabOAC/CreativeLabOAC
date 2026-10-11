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
  assert.match(html, /Creative Action Lab/);
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

