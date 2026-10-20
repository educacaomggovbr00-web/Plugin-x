// 🍥 Smoke externo do portal móvel realmente hospedado no Cloudflare.
// Não envia credenciais, nem realiza login em contas.
import assert from 'node:assert/strict';
const base='https://bushin-connect-lab.henrique-silva081106.workers.dev';
const get=async path=>{
  const response=await fetch(base+path,{redirect:'manual',signal:AbortSignal.timeout(18000)});
  assert.equal(response.status,200,path+' must respond HTTP 200');
  return response;
};
const health=await (await get('/health')).json();
assert.equal(health.service,'bushin-connect-hub');
assert.equal(health.status,'online');
console.log('PASS | Portal Cloudflare /health online');

const page=await (await get('/')).text();
assert.match(page,/Conectar Discord/);
assert.match(page,/Abrir ChatGPT/);
assert.match(page,/bushin-discord-direct.*\/mcp/);
assert.match(page,/NÃO|não conecta sua conta ChatGPT automaticamente/i);
console.log('PASS | Página mobile com links e aviso de autorização');

const state=await (await get('/api/status')).json();
assert.equal(state.scope,'PUBLIC_ENDPOINTS_ONLY');
assert.equal(state.chatgpt_app_connected,'NOT_VERIFIED');
assert.equal(state.discord_personal_messages,'NOT_TESTED');
assert.equal(state.discord_mcp.ok,true,'Discord MCP public catalog unavailable');
assert.equal(state.browser_lab.ok,true,'Browser lab /health unavailable');
console.log('PASS | MCP Discord e navegador acessíveis via Cloudflare Service Bindings');
console.log('LIMITE | OAuth da conta no ChatGPT Android NÃO comprovado; DM pessoal NÃO testada.');
