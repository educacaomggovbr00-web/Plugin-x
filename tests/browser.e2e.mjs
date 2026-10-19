import assert from 'node:assert/strict';
import {createBrowserEngine} from '../src/server.mjs';
const browser=createBrowserEngine();
try{
  const open=await browser.open('https://example.com/');
  assert.match(open.title,/Example Domain/);
  const content=await browser.read();
  assert.match(content.text,/Example Domain/);
  const screenshot=await browser.screenshot();
  assert.ok(Buffer.from(screenshot,'base64').length>1000);
  console.log('PASS real Chromium: open, read, screenshot');
}finally{await browser.close();}
