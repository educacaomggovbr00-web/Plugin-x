import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_TASK,makeRequest,extractText,executeTask,report} from '../scripts/ai-workflow.mjs';

test('dry-run nao chama nenhuma API ou modelo',async()=>{
  const x=await executeTask({task:DEFAULT_TASK,fetcher:async()=>{throw Error('fetch nao deveria executar');}});
  assert.equal(x.mode,'dry_run');
  assert.equal(x.status,'SIMULADO_SEM_CHAMADA_IA');
  assert.match(report(x),/nenhum modelo executado/);
});
test('modo api exige secret',async()=>{
  await assert.rejects(executeTask({mode:'api',apiKey:'',fetcher:async()=>{throw Error('nao chamar');}}),/OPENAI_API_KEY/);
});
test('API e chamada apenas em modo api e nunca armazena resposta no servidor',async()=>{
  let called=0;
  const result=await executeTask({mode:'api',task:'Descreva um teste seguro do Bushin.',apiKey:'sample-secret-never-log',
    fetcher:async(url,options)=>{
      called++;
      assert.equal(url,'https://api.openai.com/v1/responses');
      assert.equal(options.method,'POST');
      assert.equal(options.headers.authorization,'Bearer sample-secret-never-log');
      const b=JSON.parse(options.body);
      assert.equal(b.store,false);
      assert.equal(b.model,'gpt-6-luna');
      assert.equal(b.tools,undefined);
      assert.ok(b.max_output_tokens<=500);
      return new Response(JSON.stringify({output:[
        {type:'reasoning',content:[]},
        {type:'message',content:[{type:'output_text',text:'Teste de leitura segura OK.'}]}
      ]}),{status:200,headers:{'content-type':'application/json'}});
    }});
  assert.equal(called,1);
  assert.equal(result.status,'RESPOSTA_IA_CONFIRMADA');
  assert.match(result.result,/Teste de leitura segura/);
  assert.doesNotMatch(report(result),/sample-secret-never-log/);
});
test('nao publica mensagens de erro arbitrarias da API',async()=>{
  await assert.rejects(executeTask({mode:'api',apiKey:'a-private-key',fetcher:async()=>new Response('a-private-key', {status:403})}),e=>{
    assert.match(e.message,/HTTP 403/);
    assert.doesNotMatch(e.message,/a-private-key/);
    return true;
  });
});
test('rejeita resposta sem texto confirmado',()=>{
  assert.throws(()=>extractText({output:[{type:'reasoning',content:[]}]}),/texto/);
});
test('limita entrada e rejeita modos desconhecidos',async()=>{
  assert.throws(()=>makeRequest(''),/tarefa/i);
  assert.throws(()=>makeRequest('x'.repeat(1201)),/1200/);
  await assert.rejects(executeTask({mode:'auto',task:'Teste'}),/Modo invalido/);
});
test('nao deixa HTML fornecido pelo modelo virar HTML no resumo',()=>{
  const md=report({mode:'api',model:'gpt-6-luna',status:'OK',result:'<script>alert(1)</script>'});
  assert.ok(md.includes('&lt;script&gt;'));
  assert.ok(!md.includes('<script>'));
});
