// 🍥 Diagnóstico MCP público: nunca envia tokens nem lê mensagens privadas.
// node scripts/check-connection.mjs [base-url]
let base = process.argv[2] || 'https://bushin-agent-lab.henrique-silva081106.workers.dev';
while (base.endsWith('/')) base = base.slice(0, -1);
const checks = [];
async function check(name, required, fn) {
  try {
    const detail = await fn();
    checks.push({name, required, ok: true, detail});
  } catch (error) {
    checks.push({name, required, ok: false, detail: String(error?.message || error)});
  }
}
async function req(path, init = {}) {
  const response = await fetch(base + path, {signal: AbortSignal.timeout(15000), ...init});
  const body = await response.json();
  return {status: response.status, body};
}
async function rpc(method, params = {}) {
  return req('/mcp', {
    method: 'POST',
    headers: {'content-type': 'application/json', accept: 'application/json'},
    body: JSON.stringify({jsonrpc: '2.0', id: 1, method, params})
  });
}
await check('Worker /health', true, async () => {
  const r = await req('/health');
  if (r.status !== 200 || r.body.status !== 'online') throw Error('Worker offline, HTTP ' + r.status);
  return r.body.service;
});
await check('MCP initialize', true, async () => {
  const r = await rpc('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: {name: 'bushin-diagnostic', version: '1.0.1'}
  });
  if (r.status !== 200 || !r.body.result?.serverInfo) throw Error('MCP initialize indisponível');
  return r.body.result.serverInfo.name;
});
await check('Ferramentas anunciadas', true, async () => {
  const r = await rpc('tools/list');
  const tools = r.body.result?.tools;
  if (!Array.isArray(tools) || tools.length === 0) throw Error('Sem ferramentas MCP');
  return tools.map(t => t.name).join(', ');
});
await check('Execução anônima bloqueada', true, async () => {
  const r = await rpc('tools/call', {name: 'bushin_cloud_browser_status', arguments: {}});
  if (r.status !== 401) throw Error('Esperado HTTP 401, recebido HTTP ' + r.status);
  return 'HTTP 401 correto';
});
await check('OAuth do app Bushin', false, async () => {
  const r = await req('/.well-known/oauth-authorization-server');
  if (r.status !== 200 || !r.body.authorization_endpoint || !r.body.token_endpoint)
    throw Error('ainda não configurado (HTTP ' + r.status + ')');
  return 'metadados OAuth presentes';
});
for (const c of checks)
  console.log((c.ok ? 'PASS' : c.required ? 'FALHOU' : 'PENDENTE') + ' | ' + c.name + ' | ' + c.detail);
console.log('Observação: MCP online não comprova conexão ao ChatGPT Android.');
if (checks.some(c => c.required && !c.ok)) process.exitCode = 1;
