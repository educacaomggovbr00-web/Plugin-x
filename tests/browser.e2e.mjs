import assert from 'node:assert/strict';
import {createBrowserEngine} from '../src/server.mjs';
const browser=createBrowserEngine();
try {
  const opened=await browser.open('https://example.com/');
  assert.equal(new URL(opened.url).hostname,'example.com');
  assert.ok(opened.title.length>0,'Page title missing');
  const content=await browser.read();
  assert.ok(content.text.length>20,'Visible text was not extracted');
  assert.equal(new URL(content.url).hostname,'example.com');
  const screenshot=await browser.screenshot();
  assert.ok(Buffer.from(screenshot,'base64').length>1000,'Screenshot too small');
  console.log('PASS real Chromium: open, read, screenshot');
} finally {await browser.close();}
