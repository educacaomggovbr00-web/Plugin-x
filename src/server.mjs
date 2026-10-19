import http from 'node:http';
import { pathToFileURL } from 'node:url';

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 8788);
const MAX_BODY = 65536;
export const TOOLS = [
  {name:'bushin_browser_open',description:'Open an HTTPS website in the isolated browser',inputSchema:{type:'object',properties:{url:{type:'string'}},required:['url']}},
  {name:'bushin_browser_read',description:'Read the current page title, URL and visible text',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true}},
  {name:'bushin_browser_click',description:'Click a visible element by CSS selector',inputSchema:{type:'object',properties:{selector:{type:'string'}},required:['selector']}},
  {name:'bushin_browser_type',description:'Type text into an element by CSS selector; never use for passwords',inputSchema:{type:'object',properties:{selector:{type:'string'},text:{type:'string'}},required:['selector','text']}},
  {name:'bushin_browser_screenshot',description:'Take a PNG screenshot of the browser',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true}},
  {name:'bushin_browser_status',description:'Get local browser status',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true}}
];
const text = value => ({content:[{type:'text',text:JSON.stringify(value)}]});
const safeUrl = raw => {
  const url = new URL(raw);
  if(url.protocol !== 'https:') throw Error('Only HTTPS is allowed');
  const h=url.hostname.toLowerCase();
  if(h==='localhost'||h.endsWith('.localhost')||h.endsWith('.local')||h.endsWith('.internal')||h.endsWith('.onion')||
     /^(?:127|0|10|169\.254|192\.168)\./.test(h)||/^172\.(1[6-9]|2\d|3[01])\./.test(h)||
     h==='::1'||h.startsWith('[')||h==='0.0.0.0') throw Error('Local or private addresses are forbidden');
  if(url.username||url.password) throw Error('Credentials in URL are forbidden');
  if(url.port && url.port!=='443') throw Error('Nonstandard port forbidden');
  return url.href;
};
export function makeHandler(engine){
  return async (request) => {
    const {jsonrpc,id,method,params={}}=request??{};
    if(jsonrpc!=='2.0'||typeof method!=='string') return {jsonrpc:'2.0',id:id??null,error:{code:-32600,message:'Invalid Request'}};
    try {
      if(method==='initialize')return {jsonrpc:'2.0',id,result:{protocolVersion:'2025-06-18',capabilities:{tools:{listChanged:false}},serverInfo:{name:'bushin-browser-lab',version:'0.1.0'}}};
      if(method==='notifications/initialized')return null;
      if(method==='ping')return {jsonrpc:'2.0',id,result:{}};
      if(method==='tools/list')return {jsonrpc:'2.0',id,result:{tools:TOOLS}};
      if(method!=='tools/call')return {jsonrpc:'2.0',id,error:{code:-32601,message:'Method not found'}};
      const {name,arguments:args={}}=params;
      let value;
      if(name==='bushin_browser_open')value=await engine.open(safeUrl(args.url));
      else if(name==='bushin_browser_read')value=await engine.read();
      else if(name==='bushin_browser_click')value=await engine.click(args.selector);
      else if(name==='bushin_browser_type')value=await engine.type(args.selector,args.text);
      else if(name==='bushin_browser_screenshot') {
        const data=await engine.screenshot();
        return {jsonrpc:'2.0',id,result:{content:[{type:'image',mimeType:'image/png',data}]}};
      }
      else if(name==='bushin_browser_status')value=await engine.status();
      else throw Error('Unknown tool');
      return {jsonrpc:'2.0',id,result:text(value)};
    } catch(e){return {jsonrpc:'2.0',id,result:{isError:true,content:[{type:'text',text:String(e.message||e)}]}};}
  };
}
export function createBrowserEngine() {
  let browser,context,page;
  async function ensure(){
    if(!page) {
      const {chromium}=await import('playwright');
      browser=await chromium.launch({headless:true});
      context=await browser.newContext({acceptDownloads:false});
      await context.route('**/*',async route=>{
        try {safeUrl(route.request().url());await route.continue();}catch{await route.abort();}
      });
      page=await context.newPage();
    }
    return page;
  }
  function selector(s){if(typeof s!=='string'||!s||s.length>300)throw Error('Invalid selector');return s;}
  return {
    async open(url){const p=await ensure();await p.goto(url,{waitUntil:'domcontentloaded',timeout:20000});return {url:p.url(),title:await p.title()};},
    async read(){const p=await ensure();return {url:p.url(),title:await p.title(),text:(await p.locator('body').innerText()).slice(0,12000)};},
    async click(sel){const p=await ensure();await p.locator(selector(sel)).click({timeout:10000});return {url:p.url(),clicked:sel};},
    async type(sel,value){const p=await ensure();if(typeof value!=='string'||value.length>2000)throw Error('Invalid text');const el=p.locator(selector(sel));if(await el.evaluate(e=>e.type==='password'||e.autocomplete==='current-password'||e.autocomplete==='new-password'))throw Error('Password entry is disabled');await el.fill(value,{timeout:10000});return {typed:true,selector:sel};},
    async screenshot(){const p=await ensure();return (await p.screenshot({type:'png'})).toString('base64');},
    async status(){return {ready:!!page,url:page?.url()??null};},
    async close(){await browser?.close();}
  };
}
export function startServer(engine=createBrowserEngine(),port=PORT) {
  const handle=makeHandler(engine);
  const server=http.createServer(async(req,res)=>{
    res.setHeader('Cache-Control','no-store');
    res.setHeader('X-Content-Type-Options','nosniff');
    if(req.url!=='/mcp'||req.method!=='POST'){res.writeHead(404);res.end('Not Found');return;}
    if(!String(req.headers['content-type']||'').includes('application/json')){res.writeHead(415);res.end('JSON required');return;}
    const pieces=[];let size=0;
    try{
      for await(const chunk of req){size+=chunk.length;if(size>MAX_BODY)throw Error('Request too large');pieces.push(chunk);}
      const result=await handle(JSON.parse(Buffer.concat(pieces).toString('utf8')));
      if(result===null){res.writeHead(202);res.end();return;}
      res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify(result));
    }catch(e){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({error:String(e.message)}));}
  });
  server.listen(port,HOST);
  return {server,engine};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  const {server,engine}=startServer();
  console.log('Bushin lab MCP listening on http://'+HOST+':'+PORT+'/mcp');
  process.on('SIGTERM',async()=>{await engine.close();server.close();});
}
