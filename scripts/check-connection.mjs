// 🍥 Bushin: verifica a ligação real MCP ↔ ChatGPT, sem segredos e sem Discord token.
// node scripts/check-connection.mjs [base-url]
const base=(process.argv[2]||'https://bushin-agent-lab.henrique-silva081106.workers.dev').replace(/\\/$/,'');
const checks=[];
async function check(name,fn){try{const detail=await fn();checks.push({name,ok:true,detail});}catch(e){checks.push({name,ok:false,detail:String(e.message||e)});}}
async function rpc(method,params){const r=await fetch(base+'/mcp',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params})});return {status:r.status,body:await r.json()};}
await check('Worker /health',async()=>{const r=await fetch(base+'/health');if(!r.ok)throw Error('HTTP '+r.status);const j=await r.json();if(j.status!=='online')throw Error('status inválido');return j.service;});
await check('MCP initialize',async()=>{const r=await rpc('initialize',{protocolVersion:'2025-06-18',capabilities:{},clientInfo:{name:'bushin-diagnostic',version:'1.0.0'}});if(r.status!==200||!r.body.result?.serverInfo)throw Error('MCP indisponível');return r.body.result.serverInfo.name;});
await check('Ferramentas anunciadas',async()=>{const r=await rpc('tools/list',{});const names=r.body.result?.tools?.map(t=>t.name);if(!Array.isArray(names)||names.length===0)throw Error('sem ferramentas');return names.join(', ');});
await check('Bloqueio de execução anônima',async()=>{const r=await rpc('tools/call',{name:'bushin_cloud_browser_status',arguments:{}});if(r.status!==401)throw Error('esperado 401, recebido '+r.status);return 'HTTP 401 correto';});
await check('OAuth discovery do aplicativo',async()=>{const r=await fetch(base+'/.well-known/oauth-authorization-server');if(!r.ok)throw Error('não configurado (HTTP '+r.status+')');const j=await r.json();if(!j.authorization_endpoint||!j.token_endpoint)throw Error('metadados OAuth incompletos');return 'discovery disponível';});
for(const c of checks)console.log((c.ok?'PASS':'PENDENTE')+' | '+c.name+' | '+c.detail);
console.log('ATENÇÃO: MCP online NÃO significa app instalado/conectado no ChatGPT Android.');
if(checks.slice(0,4).some(c=>!c.ok))process.exitCode=1;
