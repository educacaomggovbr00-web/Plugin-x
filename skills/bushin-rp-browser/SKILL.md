---
name: bushin-rp-browser
description: "Use quando o usuário pedir ao Bushin ler canais do Naruto Project RP, preparar ou enviar respostas, controlar visualmente o Discord, executar comandos ou avançar no RPG via ChatGPT."
---

# 🍥 Bushin Browser — Naruto RP: ações do navegador e jogo

**Este skill complementa o Bushin Android original** sem adicionar MCP e sem duplicar plugin. O portal Cloudflare `/mobile` confirma identidade e participação no servidor; NÃO transfere cookies do Discord ao ChatGPT ou ao Chromium, não autoriza leitura de canais nem envio.

## Capacidade implementada, sem alegações falsas

No repositório GitHub privado `educacaomggovbr00-web/shinobi-ai-agent`:
- O controlador `browser_actions/live_controller.py` suporta `status`, `read_page_text`, `rpg_view`, `rpg_scout`, `screenshot`, `capture_gallery`, `inspect_ui`, `click`, `scroll`, `open_url`, `type_search`, `compose_message`, `send_message` e `send_command`.
- A execução opcional de desktop `.github/workflows/bushin-discord-live.yml` conecta Chrome visual ao Discord. O navegador precisa estar **realmente em execução, autenticado** e aberto no servidor permitido. Não iniciar Linux só porque o usuário pediu o portal Android.
- As três ações de composição/envio passaram em testes UNITÁRIOS do controlador, mas **não foram validadas com envio real ao Discord**. Não afirmar entrega de mensagem com base apenas na ação `Enter`; conferir a resposta visível. Uma sessão criada antes da alteração do controlador NÃO suporta novas ações.
- Não há piloto automático persistente nem ação em segundo plano sem serviço ativo; quando não houver sessão, explicar claramente. Este skill não concede permissões Discord extras nem desbloqueia MCP no Android.

## Conferir a sessão

1. Com ferramentas GitHub autorizadas, verifique execuções `in_progress` do workflow `bushin-discord-live.yml` no repositório original; se nenhuma estiver ativa, informe que não é possível ler/enviar mensagens reais neste momento.
2. Compare o SHA da execução com o commit que introduziu as ações de envio (`3ec696ce5d1b1433ddb69a758babfed705f465d1` ou descendentes) e os testes publicados. Não escreva comandos não suportados em sessões antigas.
3. Para cada ação, atualize via GitHub com blob SHA o JSON em `browser_actions/live_command.json`, sempre com `id` **novo** e `session_id` exato do `run_id`, em seguida leia `browser_actions/live_result.json` até obter o mesmo `id`, `session_id` e `ok:true`. A escrita na fila não é a execução.
4. Os comandos e respostas ficam registrados no **histórico privado de commits**. Não incluir senhas, tokens, DMs, autenticação ou outras informações confidenciais. Leia apenas canais autorizados da guild `1515877468299595919`.

## Comandos disponíveis

- Ler canal atual: `{"id":"bushin-rp-view-001","session_id":"RUN_ID_ATIVO","action":"rpg_view"}`.
- Investigar canais Naruto RP: `{"id":"bushin-rp-scout-001","session_id":"RUN_ID_ATIVO","action":"rpg_scout","urls":["https://discord.com/channels/1515877468299595919/1520116350360617154","https://discord.com/channels/1515877468299595919/1520114256740352061"]}`.
- Preparar texto SEM enviar: `{"id":"bushin-draft-001","session_id":"RUN_ID_ATIVO","action":"compose_message","channel_url":"https://discord.com/channels/1515877468299595919/1520114256740352061","text":"Olá, alguém disponível para um treino em Konoha?"}`.
- Enviar um texto explicitamente confirmado: `{"id":"bushin-send-001","session_id":"RUN_ID_ATIVO","action":"send_message","channel_url":"https://discord.com/channels/1515877468299595919/1520114256740352061","text":"Olá, alguém disponível para um treino em Konoha?","confirm":true}`.
- Comando de texto bot-prefix ou slash simples (a interação real pode exigir opções e não está validada): `{"id":"bushin-command-001","session_id":"RUN_ID_ATIVO","action":"send_command","channel_url":"https://discord.com/channels/1515877468299595919/1520116350360617154","text":"!status","confirm":true}`.

`compose_message` não envia. `send_message` e `send_command` exigem `confirm:true`, destino exato da guild, máximo 500 caracteres por mensagem, sem menção em massa, intervalo de 20 segundos e máximo de 8 tentativas por sessão. Não repetir um envio cujo resultado seja ambíguo. Para comandos slash complexos, explique a limitação em vez de inventar sucesso.

## Naruto RP sem inventar status

O progresso comprovado fica em `browser_actions/rpg_progress.json`. `null` é dado desconhecido. O usuário controla a narrativa e suas falas quando jogamos em modo chat; para o Discord real, usar evidências do canal. Não fingir rank, nível, clã, time, ryō ou missão concluída. Prioridade: verificar ficha, oportunidades de time, treino e missão adequada. Oferecer um próximo passo e rascunho; efetivar ações somente quando o canal e a sessão permitirem.

## O que não está disponível

Sem sessão Discord real via navegador e sem bot autorizado, **não existe acesso aos conteúdos de canais** por apenas ter feito OAuth `identify/guilds/guilds.members.read`. O portal móvel e o chat Android não controlam diretamente o Linux. Use o estado real do ambiente, sem criar nova sessão automaticamente nem apresentar dados de teste como mensagens reais.
