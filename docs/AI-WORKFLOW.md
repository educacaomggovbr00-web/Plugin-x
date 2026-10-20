# 🍥 Etapa 1: workflow que executa tarefas de IA

O Plugin-x agora tem **um único GitHub Actions** para validar o Bushin e, quando acionado manualmente, processar uma tarefa de IA. O estado padrão é **simulação sem custo**.

[Abra o workflow Bushin — Conexão e Testes](https://github.com/educacaomggovbr00-web/Plugin-x/actions/workflows/bushin.yml).

## Testar pelo Android sem pagar

1. Abra **Actions** no repositório Plugin-x.
2. Selecione **🍥 Bushin — Conexão e Testes**.
3. Escolha **Run workflow**, branch `main`.
4. `ai_mode = dry_run` (padrão). Preencha `ai_task` com um pedido sem dados privados.
5. Após os testes, abra o job **Tarefa com IA — acionamento manual** e veja o resumo ou o artefato `bushin-ai-task-report`.

O dry-run **não executa nenhum modelo** e não valida ChatGPT OAuth nem acesso pessoal ao Discord: apenas comprova que o workflow aceita a tarefa e prepara um relatório.

## Executar um modelo de verdade — opcional

Somente se você **quiser usar a API da OpenAI**, que tem **cobrança separada do ChatGPT**:

1. Configure uma credencial própria da API na [plataforma OpenAI](https://platform.openai.com/), conforme suas regras de cobrança e limites. Não é a senha da sua conta ChatGPT.
2. Sem colar a chave no chat, salve-a em GitHub → Plugin-x → **Settings → Secrets and variables → Actions → New repository secret**, nome `OPENAI_API_KEY`.
3. Execute manualmente o mesmo workflow na branch `main`, selecionando `ai_mode = api`.
4. O executor fará **uma única chamada textual** à Responses API com `store:false`, modelo `gpt-6-luna` e saída limitada, e salvará a resposta num relatório. A IA **não recebe credenciais Discord, não controla o navegador e não envia mensagens**.

Nenhum pagamento, conexão API ou consumo de tokens foi habilitado por este commit. O modo `api` exige configuração e escolha explícitas suas. Não existe integração automática do GitHub Actions com suas conversas pessoais do ChatGPT.

## E o login da conta ChatGPT pelo link?

A OpenAI oferece oficialmente **Sign in with ChatGPT**, inclusive para alguns aplicativos open source, mas o fluxo dinâmico de código aberto documentado exige retorno local em `http://127.0.0.1:<porta>/auth/callback` no dispositivo que executa o cliente. Isso **não é equivalente a colocar um botão de login no GitHub Actions**, pois um runner temporário não recebe o retorno do navegador do celular sem uma arquitetura adicional. Não vamos pedir senha, cookie ou token de sessão do ChatGPT para contornar essa segurança.

Referências oficiais:
- https://developers.openai.com/siwc/quickstart
- https://developers.openai.com/siwc/token-sharing-open-source/sign-in
- https://developers.openai.com/api/docs/guides/workload-identity-federation/github-actions

Uma alternativa futura à chave de API é **OpenAI Workload Identity Federation** com GitHub OIDC, mediante configuração da conta OpenAI API; também não utiliza a sessão ChatGPT.

## Próxima etapa do Bushin

Depois de confirmar o modo manual, podemos projetar o sentido oposto: **ChatGPT emitindo comandos autorizados para uma API do Bushin que dispara ações no GitHub**, com autenticação independente. Não implantaremos webhooks sem verificação de identidade e revisão do escopo.
