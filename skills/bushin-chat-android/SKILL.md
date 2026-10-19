---
name: bushin-chat-android
description: 'Use quando o usuário pedir para operar o Bushin Browser ORIGINAL diretamente no ChatGPT Android: verificar sessão, ler Discord Naruto RP, preparar mensagens ou realizar ações autorizadas. Usa conexões Cloudflare e GitHub já aprovadas, sem instalar MCP.'
---

# 🍥 Bushin no ChatGPT Android — ponte comprovada, sem MCP nativo

Mesmo plugin privado `plugins_6ad54d1a617c819191f5c10570c66ef3`. NÃO adicionar `mcp.json` ou `.mcp.json`; isso já tornou o plugin desktop-only. Não criar outros plugins. O usuário quer ler canais, responder quando expressamente confirmado e jogar Naruto RP; o usuário já indicou que NÃO quer ler regras do servidor como etapa automática.

## Ponte real validada em 19/10/2026

- Servidor `bushin-discord-direct`, Cloudflare Workers, vinculado ao banco D1 em binding `DB`.
- Runner temporário em `.github/workflows/bushin-discord-live.yml`, repositório privado `educacaomggovbr00-web/shinobi-ai-agent`, autenticado no Worker com OIDC GitHub (sem PAT GitHub no Worker).
- ChatGPT com **Cloudflare conectado pelo usuário** conseguiu executar, através da API D1, uma ação segura `status` em execução real `39309152333` (sessão efêmera), e recebeu em `bushin_visual_commands`: `completed`, `online:true`, título Discord e URL `https://discord.com/login`. Não repetir IDs antigos, não tomar esses dados como status atual.
- Login no portal `/mobile` não transfere a sessão ao Chromium. Antes de ler ou enviar, o proprietário precisa entrar no Discord visualmente na sessão temporária, usando o acesso privado no resumo do workflow do GitHub. Não expor/registrar o link secreto de login do noVNC.
- Login do portal móvel permanece separado; DMs de bot não são mensagens de conta pessoal.

## Operar diretamente no chat Android usando conectores que já estão conectados

Só se disponíveis neste chat e com pedido explícito do usuário, descubra `mcp__GitHub__fetch` e `mcp__Cloudflare__search/execute` via ferramentas conectadas. Não solicitar senhas, tokens, cookies ou secrets no chat. Não sugerir instalar plugin alternativo.

1. Verifique o workflow `bushin-discord-live.yml` pelo GitHub Actions da conta conectada; escolha `in_progress` na `main`, com ID atual. Não interprete run `completed` como sessão ativa.
2. Use `mcp__Cloudflare__search` para verificar endpoint oficial D1 `POST /accounts/{account_id}/d1/database/{database_id}/query`. No `execute`, consulte somente binding `DB` de `/accounts/${accountId}/workers/scripts/bushin-discord-direct/settings` para identificar seu `id`, sem expor credenciais. Leia `SELECT run_id,last_seen,expires_at FROM bushin_visual_sessions WHERE run_id=...` com a sessão atual. Exija `last_seen` dentro dos últimos 60 segundos e `expires_at > Date.now()`; se não, pare. Opcional: confirme `mobile_user_sessions` por contagem sem divulgar IDs.
3. Antes de enfileirar, consulte `SELECT COUNT(*) AS n FROM bushin_visual_commands WHERE run_id=... AND state IN ('queued','in_progress')` e evite interromper pedidos pendentes de outra aba.
4. Para comandos solicitados e **de risco baixo**, crie ID `visual_` + 32 hex via `crypto.getRandomValues` no ambiente seguro Cloudflare. Faça `INSERT INTO bushin_visual_commands(id,run_id,owner_id,action,args_json,state,created_at,updated_at)` selecionando `owner_id` da sessão atual, por `INSERT ... SELECT ... FROM bushin_visual_sessions WHERE run_id=...`; use somente D1 autenticado pelo conector do usuário, nunca endpoint HTTP aberto; `action` e `args_json` devem cumprir `validateMobileAction` em `src/visual-bridge.mjs` e validação do Python `live_controller.py`.
5. Aguarde até 30 segundos, consultando a linha de comando pelo ID recém-criado; só declare execução se `state='completed'` com `result_json` coerente e `run_id` idêntico. Se `failed`, reporte. Se `queued/in_progress`, não diga que o comando foi feito. Se o navegador mostrar `/login`, pare e instrua o usuário a abrir o acesso privado do run no GitHub para entrar; não faça leitura sem login.
6. Ações seguras: `status`, `tabs`, `open_url` só em `https://discord.com/channels/1515877468299595919/ID`, `rpg_view`, `rpg_scout`, `read_page_text`, `screenshot`, `inspect_ui`, `scroll`, `compose_message` (prepara sem enviar). Restringir leitura ao Naruto Project RP do usuário e evitar DMs, credenciais, canal de regras e qualquer servidor externo sem novo pedido.
7. `send_message` e `send_command` **apenas** quando o usuário confirmar conteúdo e canal exatos. Validate `confirm:true`, até 500 caracteres, sem menções em massa; não repetir se resultado de envio for ambíguo. Mensagens saem pelo navegador logado como a conta do usuário, não pela API OAuth. `compose_message` é a alternativa que não envia.
8. DMs diretas do bot oficial dependem de `DISCORD_BOT_TOKEN` armazenado nos Secrets da Cloudflare e confirmação pelo usuário. Se esse secret estiver ausente, não tente DM. Para DM de teste só para o proprietário OAuth autenticado, a versão atual **não exige allowlist de terceiros**; para destinatários terceiros exige `BUSHIN_BOT_DM_USER_IDS`. O bot pode ser impedido pelo Discord se não compartilha servidor/DM não permitida. Nunca confundir bot com a conta do usuário.

## Restrições e transparência

- A rota conectada Cloudflare é uma **ação do conector já autorizado do ChatGPT**, não prova de que `@Bushin Browser` dispõe de ferramentas MCP nativas; quando Cloudflare/GitHub não estão disponíveis em um chat, não prometer comandos.
- D1 registra resultados visíveis somente do servidor/canal autorizado; não copiar secrets ou links de VNC para logs. Não realizar leitura de canais de regras sem o pedido do usuário.
- Status do Chromium é diferente de autenticação Discord; execução OIDC `in_progress` é diferente de comando concluído. Não inventar entrega de mensagens ou DM.
- A sessão Linux termina após até 6h; um login nessa sessão não é transferido para outra. Não iniciar novas sessões sem necessidade ou consentimento.
