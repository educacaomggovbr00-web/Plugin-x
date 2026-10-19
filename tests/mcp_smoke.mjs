// Read-only, unauthenticated health checks. Never sends Discord messages.
import assert from 'node:assert/strict';
const base = 'https://bushin-discord-direct.henrique-silva081106.workers.dev';
const mcp = base + '/mcp';
async function req(url, init={}) {
  const response = await fetch(url, {signal: AbortSignal.timeout(15000), ...init});
  const raw = await response.text();
  let body; try {body = JSON.parse(raw);} catch {throw Error('Non-JSON response HTTP '+response.status);}
  return {response,body};
}
const metadata=(await req(base+'/.well-known/oauth-authorization-server')).body;
assert.equal(metadata.issuer,base);
assert.equal(metadata.registration_endpoint,base+'/oauth/register');
assert.equal(metadata.authorization_endpoint,base+'/oauth/authorize');
assert.equal(metadata.token_endpoint,base+'/oauth/token');
assert.ok(metadata.code_challenge_methods_supported?.includes('S256'));
assert.ok(metadata.scopes_supported?.includes('identify'));
const resource=(await req(base+'/.well-known/oauth-protected-resource')).body;
assert.equal(resource.resource,mcp);
assert.ok(resource.authorization_servers?.includes(base));
async function call(id,method,params={}) {return req(mcp,{method:'POST',headers:{'content-type':'application/json','accept':'application/json, text/event-stream'},body:JSON.stringify({jsonrpc:'2.0',id,method,params})});}
const init=await call(1,'initialize',{protocolVersion:'2025-06-18',clientInfo:{name:'bushin-lab-smoke',version:'1'},capabilities:{}});
assert.equal(init.response.status,200);
assert.equal(init.body.result?.serverInfo?.name,'bushin-browser-discord-direct');
const list=await call(2,'tools/list');
assert.equal(list.response.status,200);
const tools=list.body.result?.tools??[];
for(const name of ['bushin_discord_whoami','bushin_discord_list_servers','bushin_session_status']) {
  const tool=tools.find(t=>t.name===name);
  assert.ok(tool,'Missing tool '+name);
  assert.equal(tool.annotations?.readOnlyHint,true);
}
const anonymous=await call(3,'tools/call',{name:'bushin_session_status',arguments:{}});
assert.equal(anonymous.response.status,401);
console.log('PASS: OAuth discovery, MCP initialize, tools/list, unauthenticated 401');
console.log('No personal OAuth, Android integration or Discord messages tested.');
