import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker,{checkServices,MCP} from '../cloudflare/bushin-connect-worker.mjs';

const url='https://bushin-connect-lab.example.test';
const mockedFetch=async (endpoint, options={})=>{
  if(endpoint===MCP) {
    assert.equal(options.method,'POST');
    assert.equal(options.headers.authorization,undefined);
    assert.equal(JSON.parse(options.body).method,'tools/list');
    return new Response(JSON.stringify({jsonrpc:'2.0',id:1,result:{tools:[
      {name:'bushin_discord_whoami'},{name:'bushin_discord_list_servers'},{name:'bushin_session_status'}
    ]}}),{headers:{'content-type':'application/json'}});
  }
  if(endpoint.includes('bushin-agent-lab') && endpoint.endsWith('/health'))return new Response(JSON.stringify({status:'online',service:'bushin-agent-lab'}));
  throw Error('Unexpected outgoing request: '+endpoint);
};
test('mobile hub serves a responsive page and refuses to claim an account connection',async()=>{
  const r=await worker.fetch(new Request(url+'/connect'));
  assert.equal(r.status,200);
  const html=await r.text();
  assert.match(html,/Conectar Discord/);
  assert.match(html,/Copiar URL do MCP/);
  assert.match(html,/não conecta sua conta ChatGPT automaticamente/);
  assert.match(html,/viewport/);
  assert.ok(r.headers.get('content-security-policy').includes("script-src 'self'"));
  assert.equal(r.headers.get('cache-control'),'no-store');
});
test('mobile hub client JS is served from same origin',async()=>{
  const r=await worker.fetch(new Request(url+'/app.js'));
  const js=await r.text();
  assert.equal(r.status,200);
  assert.match(js,/\/api\/status/);
  assert.match(r.headers.get('content-type'),/javascript/);
  assert.doesNotMatch(js,/token de usuário|password/);
});
test('real public status tests are read-only and do not claim OAuth user login',async()=>{
  const r=await worker.fetch(new Request(url+'/api/status'),mockedFetch);
  const d=await r.json();
  assert.equal(r.status,200);
  assert.equal(d.discord_mcp.ok,true);
  assert.equal(d.browser_lab.ok,true);
  assert.equal(d.chatgpt_app_connected,'NOT_VERIFIED');
  assert.equal(d.discord_personal_messages,'NOT_TESTED');
  assert.equal(d.scope,'PUBLIC_ENDPOINTS_ONLY');
});
test('failure of one backend is reported as failure, never success',async()=>{
  const d=await checkServices(async(endpoint,options)=>{
    if(endpoint===MCP)throw Error('down');
    return mockedFetch(endpoint,options);
  });
  assert.equal(d.discord_mcp.ok,false);
  assert.equal(d.browser_lab.ok,true);
});
test('only fixed public endpoints are called and arbitrary URL parameters ignored',async()=>{
  const calls=[];
  await worker.fetch(new Request(url+'/api/status?url=https://evil.example/login'),async(endpoint,opt)=>{
    calls.push(endpoint);
    return mockedFetch(endpoint,opt);
  });
  assert.equal(calls.length,2);
  assert.ok(calls.every(x=>x.startsWith('https://bushin-')));
});
test('write methods are blocked and unknown paths return 404',async()=>{
  assert.equal((await worker.fetch(new Request(url+'/api/status',{method:'POST'}))).status,405);
  assert.equal((await worker.fetch(new Request(url+'/unknown'))).status,404);
});

test('production accesses sibling Workers through service bindings',async()=>{
  let discord=0,agent=0;
  const env={
    DISCORD_WORKER:{fetch:async(url,opts)=>{discord++;return mockedFetch(url,opts);}},
    AGENT_WORKER:{fetch:async(url,opts)=>{agent++;return mockedFetch(url,opts);}}
  };
  const r=await worker.fetch(new Request(url+'/api/status'),env);
  const d=await r.json();
  assert.equal(d.discord_mcp.ok,true);
  assert.equal(d.browser_lab.ok,true);
  assert.equal(discord,1);
  assert.equal(agent,1);
});
