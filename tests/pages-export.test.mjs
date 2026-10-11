import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('static export includes lab identity, model entry points and portable assets',async()=>{
 const html=await readFile('out/index.html','utf8');
 const base=process.env.NEXT_PUBLIC_BASE_PATH??'/CreativeLabOAC';
 assert.match(html,/Creative Action Lab/);
 assert.match(html,/Mirror Game/);
 assert.match(html,/Creative Foraging/);
 assert.match(html,/href="#\/podcast"/);
 assert.ok(html.includes(`${base}/lior-noy.jpg`));
 assert.doesNotMatch(html,/href="#\/characterize"/);
 assert.ok(html.includes(`${base}/_next/`));
});
