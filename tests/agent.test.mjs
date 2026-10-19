import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeHandler,TOOLS,startServer} from '../src/server.mjs';

const calls=[];
const fake={
  async open(url){calls.push(['open',url]);return {url,title:'Example'};},
  async read(){return {url:'https://example.com',text:'Hello Bushin'};},
  async click(selector){return {clicked:selector};},
  async type(selector,text){return {selector,typed:!!text};},
  async screenshot(){return Buffer.from('fake png').toString('base64');},
  async status(){return {ready:true};},
  async close(){}
};
const rpc=(id,method,params={})=>({jsonrpc:'2.0',id,method,params});
test('MCP initializes and lists six browser tools',async()=>{
  const h=makeHandler(fake);
  assert.equal((await h(rpc(1,'initialize'))).result.serverInfo.name,'bushin-browser-lab');
  const result=await h(rpc(2,'tools/list'));
  assert.equal(result.result.tools.length,6);
  assert.deepEqual(result.result.tools.map(x=>x.name),TOOLS.map(x=>x.name));
});
test('open and read return real engine results',async()=>{
  const h=makeHandler(fake);
  const opened=await h(rpc(3,'tools/call',{name:'bushin_browser_open',arguments:{url:'https://example.com'}}));
  assert.equal(JSON.parse(opened.result.content[0].text).title,'Example');
  const read=await h(rpc(4,'tools/call',{name:'bushin_browser_read'}));
  assert.equal(JSON.parse(read.result.content[0].text).text,'Hello Bushin');
});
test('private URLs and non-HTTPS schemes rejected',async()=>{
  const h=makeHandler(fake);
  for(const url of ['http://example.com','https://127.0.0.1','https://192.168.1.1','file:///etc/passwd','https://user:pass@example.com']) {
    const r=await h(rpc(7,'tools/call',{name:'bushin_browser_open',arguments:{url}}));
    assert.equal(r.result.isError,true,url);
  }
});
test('screenshot returns image content',async()=>{
  const h=makeHandler(fake);
  const r=await h(rpc(9,'tools/call',{name:'bushin_browser_screenshot'}));
  assert.equal(r.result.content[0].mimeType,'image/png');
});
test('HTTP transport accepts JSON RPC locally',async()=>{
  const {server}=startServer(fake,0);
  await new Promise(resolve=>server.once('listening',resolve));
  try{
    const port=server.address().port;
    const response=await fetch('http://127.0.0.1:'+port+'/mcp',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(rpc(5,'tools/list'))});
    assert.equal(response.status,200);
    assert.equal((await response.json()).result.tools.length,6);
  }finally{server.close();}
});
