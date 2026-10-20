// 🍥 Plugin-x: tarefa de IA opcional e manual no GitHub Actions.
// Default = dry_run (sem conta, sem custo). "api" exige autorizacao explicita e OpenAI API secret.
import {mkdir,writeFile,appendFile} from 'node:fs/promises';

const MODEL='gpt-6-luna';
export const DEFAULT_TASK='Analise o objetivo do Plugin-x e sugira um teste seguro de conexao do Bushin Browser, sem afirmar que Discord ou ChatGPT estao autenticados.';
const SYSTEM=[
  'Voce e o assistente tecnico do laboratorio Bushin Browser (Plugin-x).',
  'Responda em portugues do Brasil de forma objetiva.',
  'O laboratorio testa um MCP Discord somente leitura e um navegador publico.',
  'Nao afirme que o ChatGPT Android controla o Discord, que o login esta conectado ou que uma DM foi enviada sem evidencia.',
  'Nao recomende self-bot ou token pessoal Discord.',
  'Proponha um plano seguro, verificavel e sem alteracoes de contas.'
].join(' ');

function validateTask(task){
  if(typeof task!=='string'||!task.trim()||task.length>1200||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(task)){
    throw Error('A tarefa deve ter de 1 a 1200 caracteres imprimiveis.');
  }
  return task.trim();
}
export function makeRequest(task){
  return {model:MODEL,store:false,instructions:SYSTEM,
    input:[{role:'user',content:validateTask(task)}],max_output_tokens:500,reasoning:{effort:'low'}};
}
export function extractText(payload){
  if(!Array.isArray(payload?.output))throw Error('A API nao retornou a lista output.');
  const chunks=[];
  for(const item of payload.output){
    if(item.type!=='message'||!Array.isArray(item.content))continue;
    for(const part of item.content){
      if(part.type==='output_text'&&typeof part.text==='string')chunks.push(part.text);
    }
  }
  if(!chunks.length)throw Error('A API nao retornou texto utilizavel.');
  return chunks.join('\n').slice(0,6500);
}
export async function executeTask({mode='dry_run',task=DEFAULT_TASK,apiKey='',fetcher=fetch}={}){
  if(mode!=='dry_run'&&mode!=='api')throw Error('Modo invalido: use dry_run ou api.');
  const payload=makeRequest(task);
  if(mode==='dry_run'){
    return {mode,status:'SIMULADO_SEM_CHAMADA_IA',model:payload.model,
      result:'Simulacao concluida: tarefa validada, nenhum modelo chamado e nenhuma cobranca gerada. Para receber uma resposta real, configure o secret OPENAI_API_KEY no GitHub e inicie manualmente um novo workflow no modo api, ciente de que a OpenAI API e cobrada separadamente.'};
  }
  if(typeof apiKey!=='string'||!apiKey.trim())throw Error('Secret OPENAI_API_KEY ausente. Nenhuma chamada foi realizada.');
  let response;
  try{
    response=await fetcher('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'content-type':'application/json',authorization:'Bearer '+apiKey},
      body:JSON.stringify(payload),
      signal:AbortSignal.timeout(45000)
    });
  }catch{throw Error('Nao foi possivel conectar a OpenAI API.');}
  if(!response.ok)throw Error('OpenAI API retornou HTTP '+response.status+'. Nao houve resposta valida.');
  let body;
  try{body=await response.json();}catch{throw Error('Resposta da OpenAI API invalida.');}
  return {mode,status:'RESPOSTA_IA_CONFIRMADA',model:payload.model,result:extractText(body)};
}
function safeMarkdown(s){
  return s.replaceAll('<','&lt;').replaceAll('>','&gt;').replace(/[\u0000-\u001f]/g,ch=>ch==='\n'?'\n':' ');
}
export function report(r){
  const live=r.mode==='api';
  return ['# 🍥 Plugin-x — tarefa de IA','',
    '**Execucao:** '+(live?'OpenAI API autorizada':'Simulacao sem API e sem cobranca'),
    '**Status:** '+r.status,'**Modelo:** '+(live?r.model:'nenhum modelo executado'),'',
    '## Resultado','',safeMarkdown(r.result),'',
    '> Essa tarefa nao autenticou a conta ChatGPT, nao usou a sessao pessoal e nao leu ou enviou mensagens no Discord.',
    '> Uso da OpenAI API possui cobranca separada e so ocorre quando o modo api for escolhido manualmente.',
    ''].join('\n');
}
async function main(){
  const r=await executeTask({
    mode:process.env.BUSHIN_AI_MODE||'dry_run',
    task:process.env.BUSHIN_AI_TASK||DEFAULT_TASK,
    apiKey:process.env.OPENAI_API_KEY||''
  });
  const md=report(r);
  await mkdir('bushin-output',{recursive:true});
  await writeFile('bushin-output/ai-workflow-result.md',md,'utf8');
  if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,md+'\n','utf8');
  console.log(r.mode==='api'?'PASS: a IA respondeu via OpenAI API.':'PASS: simulacao sem chamada a OpenAI API.');
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)await main();
