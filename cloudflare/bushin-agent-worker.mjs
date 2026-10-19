// 🍥 Bushin Agent remote read-only MCP — Cloudflare Browser Run.
// Separate lab Worker: never exposes an unauthenticated arbitrary browser.
const ALLOWED = new Set(['example.com','developers.cloudflare.com','developer.mozilla.org','www.wikipedia.org','github.com']);
const TOOLS = [
  {name:'bushin_cloud_browser_read',description:'Read the visible content of an allowlisted public HTTPS page with Cloudflare Browser Run; no account login.',inputSchema:{type:'object',properties:{url:{type:'string',description:'Public HTTPS URL'}},required:['url']},annotations:{readOnlyHint:true,openWorldHint:true,destructiveHint:false}},
  {name:'bushin_cloud_browser_screenshot',description:'Capture PNG of an allowlisted public HTTPS page; no account login.',inputSchema:{type:'object',properties:{url:{type:'string'}},required:['url']},annotations:{readOnlyHint:true,openWorldHint:true,destructiveHint:false}},
  {name:'bushin_cloud_browser_status',description:'Report capability/status without opening any page.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,destructiveHint:false}}
];
const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer'};
const json=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{...headers,...extra}});
const rpc=(id,result)=>({jsonrpc:'2.0',id,result});
const error=(id,code,message)=>({jsonrpc:'2.0',id,error:{code,message}});
const content=(obj)=>({content:[{type:'text',text:JSON.stringify(obj)}],structuredContent:obj});
function safeUrl(raw){
  if(typeof raw!=='string'||raw.length>2048)throw Error('URL inválida');
  const url=new URL(raw);
  if(url.protocol!=='https:'||url.username||url.password||url.port&&url.port!=='443')throw Error('Somente HTTPS público');
  if(!ALLOWED.has(url.hostname.toLowerCase()))throw Error('Domínio não liberado neste laboratório');
  url.hash='';
  return url.href;
}
async function auth(request,env) {
  if(typeof env.AGENT_API_KEY!=='string'||env.AGENT_API_KEY.length<40)return false;
  const h=request.headers.get('authorization')||'';
  if(!h.startsWith('Bearer '))return false;
  const supplied=h.slice(7);
  if(supplied.length!==env.AGENT_API_KEY.length)return false;
  const enc=new TextEncoder();
  const [a,b]=await Promise.all([crypto.subtle.digest('SHA-256',enc.encode(supplied)),crypto.subtle.digest('SHA-256',enc.encode(env.AGENT_API_KEY))]);
  let diff=0;const x=new Uint8Array(a),y=new Uint8Array(b);
  for(let i=0;i<x.length;i++)diff|=x[i]^y[i];
  return diff===0;
}
async function main(request,env){
  const url=new URL(request.url);
  if(url.pathname==='/health'&&request.method==='GET')return json({service:'bushin-agent-lab',status:'online',browser_binding:!!env.BROWSER,tools:TOOLS.length,auth:'required_for_tools',session_mode:'stateless',discord:'not_connected'});
  if(url.pathname!=='/mcp')return json({error:'not_found'},404);
  if(request.method!=='POST')return json({error:'method_not_allowed'},405,{allow:'POST'});
  if(!(request.headers.get('content-type')||'').includes('application/json'))return json({error:'json_required'},415);
  const raw=await request.text();if(raw.length>32768)return json({error:'payload_too_large'},413);
  let body;try{body=JSON.parse(raw);}catch{return json({error:'invalid_json'},400);}
  const id=body?.id??null;
  if(body?.jsonrpc!=='2.0')return json(error(id,-32600,'Invalid Request'));
  if(body.method==='initialize')return json(rpc(id,{protocolVersion:'2025-06-18',capabilities:{tools:{listChanged:false}},serverInfo:{name:'bushin-agent-lab',version:'0.2.0'},instructions:'Read-only public browsing. Requires an owner API key for tools/call. This is not an OAuth-connected ChatGPT App.'}));
  if(body.method==='notifications/initialized')return new Response(null,{status:202,headers});
  if(body.method==='ping')return json(rpc(id,{}));
  if(body.method==='tools/list')return json(rpc(id,{tools:TOOLS}));
  if(body.method!=='tools/call')return json(error(id,-32601,'Method not found'));
  if(!await auth(request,env))return json({error:'unauthorized',message:'Owner authorization required'},401,{'www-authenticate':'Bearer'});
  const name=body.params?.name,args=body.params?.arguments||{};
  try{
    if(name==='bushin_cloud_browser_status')return json(rpc(id,content({state:'ready',browser_bound:!!env.BROWSER,mode:'read_only',account_login:false})));
    if(!env.BROWSER?.quickAction)throw Error('Browser Run binding indisponível');
    if(name!=='bushin_cloud_browser_read'&&name!=='bushin_cloud_browser_screenshot')return json(error(id,-32601,'Unknown tool'));
    const target=safeUrl(args.url);
    if(name==='bushin_cloud_browser_read'){
      const response=await env.BROWSER.quickAction('markdown',{url:target});
      if(!response.ok)throw Error('Browser Run HTTP '+response.status);
      const body=(await response.text()).slice(0,16000);
      return json(rpc(id,content({url:target,text:body})));
    }
    const response=await env.BROWSER.quickAction('screenshot',{url:target,screenshotOptions:{type:'png'}});
    if(!response.ok)throw Error('Browser Run HTTP '+response.status);
    const bytes=new Uint8Array(await response.arrayBuffer());
    if(bytes.length>900000)throw Error('Screenshot exceeds 900KB output limit');
    let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));
    return json(rpc(id,{content:[{type:'image',mimeType:'image/png',data:btoa(binary)}]}));
  }catch(e){return json(rpc(id,{isError:true,content:[{type:'text',text:String(e?.message||e).slice(0,320)}]}));}
}
export default {fetch:main};
export {main,TOOLS,safeUrl};
