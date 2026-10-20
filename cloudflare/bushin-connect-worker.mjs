// 🍥 Bushin Plugin-x: central de conexões mobile pública, sem credenciais.
// Deploy em Worker PRÓPRIO. Não modifica o Worker Discord ou o MCP de laboratório.
const DISCORD = 'https://bushin-discord-direct.henrique-silva081106.workers.dev';
const AGENT = 'https://bushin-agent-lab.henrique-silva081106.workers.dev';
const MCP = DISCORD + '/mcp';

const BASE_HEADERS = {
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
  'x-frame-options': 'DENY',
  'content-security-policy': "default-src 'none'; connect-src 'self'; script-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
};
const json = (body, status = 200) => new Response(JSON.stringify(body), {status, headers: {...BASE_HEADERS, 'content-type':'application/json; charset=utf-8'}});
const PAGE = [
  '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1">',
  '<title>🍥 Bushin — Conectar e testar</title>',
  '<style>',
  ':root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#0e1722;color:#f4f6fa;font:16px/1.55 system-ui,-apple-system,sans-serif}',
  'main{max-width:600px;margin:auto;padding:24px 16px 52px}h1{font-size:1.8rem;margin:0 0 12px}h2{font-size:1.15rem;margin:0 0 8px}',
  '.card{background:#192739;border:1px solid #33485d;border-radius:15px;padding:18px;margin:14px 0}',
  'p{margin:8px 0 14px}.muted,small{color:#bdcbd9}.button{display:block;background:#8ee2c2;color:#12201a;text-align:center;text-decoration:none;font-weight:700;padding:13px;border-radius:10px;border:0;width:100%;font:inherit;cursor:pointer}',
  '.secondary{background:#ceddf1;color:#17283b}.status{font-weight:600}code{display:block;overflow-wrap:anywhere;padding:12px;background:#0c1420;border-radius:8px;font-size:.81rem}',
  'a{color:inherit}a.button{color:#12201a}a.button.secondary{color:#17283b}',
  '</style></head><body><main>',
  '<h1>🍥 Bushin — conectar e testar</h1>',
  '<p>Seu laboratório <b>Plugin-x</b>, direto no celular. Autorizações separadas, sem pedir senha nem token nesta página.</p>',
  '<section class="card"><h2>1. Discord</h2>',
  '<p>Abra o portal Bushin e autorize o Discord via OAuth na tela oficial.</p>',
  '<a class="button" href="https://bushin-discord-direct.henrique-silva081106.workers.dev/mobile" rel="noreferrer">Conectar Discord</a>',
  '<p><small>Login de identidade não libera ler ou enviar suas mensagens pessoais.</small></p></section>',
  '<section class="card"><h2>2. ChatGPT</h2>',
  '<p>O ChatGPT deve instalar/autenticar o App MCP pela própria interface, onde disponível. URL para cadastrar:</p>',
  '<code id="mcp-url">https://bushin-discord-direct.henrique-silva081106.workers.dev/mcp</code>',
  '<p><button type="button" class="button secondary" id="copy-mcp">Copiar URL do MCP</button></p>',
  '<a class="button secondary" href="https://chatgpt.com/" rel="noreferrer">Abrir ChatGPT</a>',
  '<p><small>Esta página não conecta sua conta ChatGPT automaticamente. A execução de ferramentas no Android ainda precisa de confirmação.</small></p></section>',
  '<section class="card"><h2>3. Testes reais de disponibilidade</h2>',
  '<p>Testamos a resposta pública dos servidores — nunca acessamos suas contas.</p>',
  '<p class="status" id="test-discord" aria-live="polite">Discord MCP: aguardando teste</p>',
  '<p class="status" id="test-agent" aria-live="polite">Navegador: aguardando teste</p>',
  '<p class="muted" id="test-note">Nenhuma conexão pessoal é comprovada por estes testes.</p>',
  '<button class="button secondary" type="button" id="run-tests">Testar servidores agora</button>',
  '</section>',
  '<section class="card"><h2>4. GitHub Actions</h2>',
  '<a class="button secondary" href="https://github.com/educacaomggovbr00-web/Plugin-x/actions/workflows/bushin.yml" rel="noreferrer">Abrir workflow Plugin-x</a>',
  '<p><small>Actions testa o código. Você não precisa fazer login num Linux.</small></p></section>',
  '<script src="/app.js" defer></script></main></body></html>'
].join('\n');

const client = [
  "'use strict';",
  "const set=(id,text)=>{document.getElementById(id).textContent=text;};",
  "document.getElementById('copy-mcp').addEventListener('click',async()=>{const url=document.getElementById('mcp-url').textContent;try{await navigator.clipboard.writeText(url);set('copy-mcp','URL copiada ✓');}catch{set('copy-mcp','Selecione e copie a URL acima');}});",
  "document.getElementById('run-tests').addEventListener('click',async()=>{set('test-discord','Discord MCP: verificando…');set('test-agent','Navegador: verificando…');set('test-note','Verificando apenas endpoints públicos…');try{const r=await fetch('/api/status',{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const d=await r.json();set('test-discord','Discord MCP: '+(d.discord_mcp.ok?'ONLINE ✓':'FALHOU — '+d.discord_mcp.reason));set('test-agent','Navegador: '+(d.browser_lab.ok?'ONLINE ✓':'FALHOU — '+d.browser_lab.reason));set('test-note','Conta Discord autenticada no ChatGPT: NÃO VERIFICADA. Envio/leitura de mensagens: NÃO TESTADO.');}catch(e){set('test-note','Não foi possível testar agora. '+String(e.message).slice(0,100));}});"
].join('\n');

async function checkServices(fetcher = fetch) {
  const request = (url,init = {}) => fetcher(url, {redirect:'error',signal:AbortSignal.timeout(6500),...init});
  const [discord,browser] = await Promise.allSettled([
    (async () => {
      const r = await request(MCP, {method:'POST',headers:{'content-type':'application/json','accept':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/list',params:{}})});
      if(!r.ok)return {ok:false,reason:'HTTP '+r.status};
      const d=await r.json();
      const names=(d.result?.tools||[]).map(t=>t.name);
      const expected=['bushin_discord_whoami','bushin_discord_list_servers','bushin_session_status'];
      return expected.every(n=>names.includes(n))?{ok:true,public_tools:expected.length}:{ok:false,reason:'catálogo MCP incompleto'};
    })(),
    (async () => {
      const r=await request(AGENT+'/health');
      if(!r.ok)return {ok:false,reason:'HTTP '+r.status};
      const d=await r.json();
      return d.status==='online'?{ok:true,service:d.service}:{ok:false,reason:'status inesperado'};
    })()
  ]);
  const fallback = v => v.status==='fulfilled'?v.value:{ok:false,reason:'servidor indisponível'};
  return {
    discord_mcp:fallback(discord),
    browser_lab:fallback(browser),
    chatgpt_app_connected:'NOT_VERIFIED',
    discord_personal_messages:'NOT_TESTED',
    scope:'PUBLIC_ENDPOINTS_ONLY'
  };
}

async function handle(request,envOrFetcher = fetch) {
  const fetcher = typeof envOrFetcher === 'function' ? envOrFetcher : (url,options) => {
    // No same-zone workers.dev recursion; use Cloudflare service bindings.
    const target = url.startsWith(DISCORD + '/') ? envOrFetcher.DISCORD_WORKER : envOrFetcher.AGENT_WORKER;
    if(!target?.fetch)throw Error('Service binding indisponível');
    return target.fetch(url,options);
  };
  const url=new URL(request.url);
  if(request.method!=='GET' && request.method!=='HEAD')return json({error:'method_not_allowed'},405);
  if(url.pathname==='/' || url.pathname==='/connect')return new Response(request.method==='HEAD'?null:PAGE,{headers:{...BASE_HEADERS,'content-type':'text/html; charset=utf-8'}});
  if(url.pathname==='/app.js')return new Response(request.method==='HEAD'?null:client,{headers:{...BASE_HEADERS,'content-type':'application/javascript; charset=utf-8'}});
  if(url.pathname==='/health')return json({service:'bushin-connect-hub',status:'online',auth:'external_oauth_only'});
  if(url.pathname==='/api/status')return json(await checkServices(fetcher));
  return json({error:'not_found'},404);
}
export default {fetch:handle};
export {handle,checkServices,MCP};
