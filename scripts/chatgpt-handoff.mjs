// 🍥 Prepare the real Discord MCP connector handoff for ChatGPT.
// Public-only checks: never register OAuth clients, access accounts or request secrets.
import assert from 'node:assert/strict';
import {mkdir, writeFile, appendFile} from 'node:fs/promises';

const server = 'https://bushin-discord-direct.henrique-silva081106.workers.dev';
const endpoint = server + '/mcp';
const expectedTools = ['bushin_discord_whoami', 'bushin_discord_list_servers', 'bushin_session_status'];
const output = 'bushin-output';

async function getJSON(url, options = {}) {
  assert.ok(url.startsWith(server + '/'), 'URL must stay within the fixed Bushin server');
  const response = await fetch(url, {redirect: 'error', signal: AbortSignal.timeout(20000), ...options});
  let data;
  try { data = await response.json(); } catch { throw Error(url + ': invalid JSON HTTP ' + response.status); }
  return {status: response.status, data};
}
async function rpc(id, method, params = {}) {
  return getJSON(endpoint, {
    method: 'POST',
    headers: {'content-type': 'application/json', 'accept': 'application/json'},
    body: JSON.stringify({jsonrpc: '2.0', id, method, params})
  });
}

const oauth = await getJSON(server + '/.well-known/oauth-authorization-server');
assert.equal(oauth.status, 200, 'OAuth discovery HTTP');
assert.equal(oauth.data.issuer, server);
assert.equal(oauth.data.authorization_endpoint, server + '/oauth/authorize');
assert.equal(oauth.data.token_endpoint, server + '/oauth/token');
assert.equal(oauth.data.registration_endpoint, server + '/oauth/register');
assert.ok(oauth.data.code_challenge_methods_supported?.includes('S256'), 'PKCE S256 required');

const resource = await getJSON(server + '/.well-known/oauth-protected-resource');
assert.equal(resource.status, 200, 'Protected resource discovery HTTP');
assert.equal(resource.data.resource, endpoint);
assert.ok(resource.data.authorization_servers?.includes(server), 'OAuth issuer mismatch');

const initialize = await rpc(1, 'initialize', {
  protocolVersion: '2025-06-18',
  capabilities: {},
  clientInfo: {name: 'bushin-chatgpt-handoff', version: '1.0.0'}
});
assert.equal(initialize.status, 200);
assert.equal(initialize.data.result?.serverInfo?.name, 'bushin-browser-discord-direct');

const listed = await rpc(2, 'tools/list');
assert.equal(listed.status, 200);
const tools = listed.data.result?.tools;
assert.ok(Array.isArray(tools) && tools.length > 0, 'MCP tool catalog missing');
for (const toolName of expectedTools) {
  const tool = tools.find(t => t.name === toolName);
  assert.ok(tool, 'Missing required tool: ' + toolName);
  assert.equal(tool.annotations?.readOnlyHint, true, 'Unexpected write-capable tool: ' + toolName);
  assert.equal(tool.inputSchema?.type, 'object', 'Invalid input schema: ' + toolName);
}

const unauthorized = await rpc(3, 'tools/call', {name: 'bushin_session_status', arguments: {}});
assert.equal(unauthorized.status, 401, 'Anonymous tool calls MUST be blocked');

const report = {
  name: 'Bushin Discord (MCP)',
  server_url: endpoint,
  auth_type: 'oauth2',
  authorization_server: server,
  discovery: {
    oauth_authorization_server: server + '/.well-known/oauth-authorization-server',
    oauth_protected_resource: server + '/.well-known/oauth-protected-resource'
  },
  verification: {
    mcp_initialize: 'pass',
    mcp_tool_catalog: 'pass',
    oauth_pkce_s256: 'pass',
    oauth_client_registration_advertised: 'pass',
    anonymous_calls_blocked: 'pass',
    chatgpt_account_connected: 'NOT_TESTED',
    personal_discord_messages: 'NOT_SUPPORTED_BY_CURRENT_OAUTH_SCOPES'
  },
  read_only_tools: expectedTools,
  note: 'Workflow validates public server metadata only. User must add and authorize the MCP server in ChatGPT, where available.'
};
const md = [
  '## 🍥 Bushin MCP → ChatGPT: conexão preparada',
  '',
  '| Verificação | Resultado |',
  '|---|---|',
  '| Servidor MCP remoto | ✅ Respondeu |',
  '| OAuth 2 + PKCE S256 | ✅ Metadados válidos |',
  '| Catálogo de ferramentas | ✅ 3 ferramentas de leitura encontradas |',
  '| Proteção contra chamadas anônimas | ✅ HTTP 401 |',
  '| Conta ChatGPT conectada | ⚠️ Não verificada pelo GitHub Actions |',
  '| Mensagens da conta pessoal no Discord | ⚠️ Fora do escopo OAuth atual |',
  '',
  '**Nome sugerido:** Bushin Discord (MCP)',
  '',
  '**URL do MCP:** ' + endpoint,
  '',
  '**Autenticação:** OAuth 2.0 (descoberta automática, PKCE S256).',
  '',
  '**Ferramentas confirmadas:** ' + expectedTools.join(', '),
  '',
  'Na interface do ChatGPT, onde conectores MCP personalizados forem permitidos, adicione essa URL em Plugins → + → Add custom MCP server e autorize a conexão.',
  'O GitHub Actions não tem permissão para instalar o app na conta do ChatGPT. A documentação atual restringe a criação/uso de conectores MCP personalizados à versão web.',
  'Esse teste não utiliza nem solicita token da conta pessoal Discord.',
  ''
].join('\n');

await mkdir(output, {recursive: true});
await writeFile(output + '/connection.json', JSON.stringify(report, null, 2) + '\n', 'utf8');
await writeFile(output + '/README.md', md + '\n', 'utf8');
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, md + '\n');
console.log('PASS: OAuth PKCE, MCP initialize, tools/list, HTTP 401');
console.log('MCP: ' + endpoint);
console.log('Tools: ' + expectedTools.join(', '));
console.log('PENDENTE: autorização/instalação real no ChatGPT, não executável via CI.');
