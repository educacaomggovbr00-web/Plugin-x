---
name: bushin-advanced
description: 'Bushin Advanced 2.12: mapa das ferramentas de navegador, Discord, tarefas, GitHub, arquivos, OAuth e painel Android; distingue implementado de operacional.'
---

# 🍥 Bushin Advanced 2.12 — plugin original

Este é o mesmo plugin privado `plugins_6ad54d1a617c819191f5c10570c66ef3`, **não outro plugin**. Modo Android **skill-only**, sem `mcp.json`, sem `.mcp.json`, não exige Linux para abrir o portal móvel.

## Acesso móvel e painel

- Portal autenticado Discord: https://bushin-discord-direct.henrique-silva081106.workers.dev/mobile
- Painel autenticado com as categorias de ferramentas: https://bushin-discord-direct.henrique-silva081106.workers.dev/mobile/features
- Comandos pessoais OAuth separados: /mobile/commands (escopo `applications.commands` e `integration_type=1`).
- **A sessão de login no portal é independente de uma conexão MCP no ChatGPT Android.** O portal não fornece cookies do Discord ao chat ou ao Chromium.
- O próprio aplicativo ChatGPT controla a lista nativa de contas conectadas, permissões e disponibilidade MCP. Não afirmar que a integração apareceu sem teste de instalação real.

## Backend implementado e nomes das ferramentas

Repositório GitHub privado `educacaomggovbr00-web/shinobi-ai-agent`:

- `services/discord-oauth/cloudflare/src/advanced-suite.mjs`: interface individual por função do catálogo (47 novas interfaces, com duas já existentes reutilizadas).
- `src/browser-bridge.mjs`, `browser_actions/live_controller.py`: navegador `status`, `open_url`, `screenshot`, `click`, `type` restrito a busca/composição, `scroll`, `press`, `read_page`, `inspect_ui`, `tabs`, `capture_gallery` e visualizador noVNC com login próprio. O navegador não está automaticamente ativo no ChatGPT Android. `browser_start` precisa de `BUSHIN_GITHUB_TOKEN` e confirmação.
- `src/discord-suite.mjs`: `discord_whoami`, `discord_get_membership`, `discord_list_servers` com OAuth; `discord_list_channels`, `discord_read_messages`, `discord_send_message` com **bot oficial** e canais permitidos. DMs exigem **bot oficial, allowlist explícita e confirmação**. `discord_execute_command` retorna orientação de uso no cliente; não executa via token de usuário. Upload de anexos não está implementado.
- `src/state-suite.mjs`: D1 para `task_start`, `task_status`, `task_logs`, `task_pause`, `task_resume`, `task_cancel`, `task_request_approval`, `bushin_save_state`, `bushin_load_state`, `auth_*`, `permissions_check`, `audit_log`. O registro de tarefa é persistente; **não** cria monitoramento ou execução em segundo plano.
- `src/repo-suite.mjs`: GitHub/workspace textual (`files_list/read/upload/download`, `github_read_repo`, `github_edit_file`, `github_run_tests`) com caminhos limitados, confirmação para escritas e token privado configurado no Worker.
- `ui_screenshot_gallery`, `ui_live_panel`, `browser_live_view`, `browser_takeover`: as capturas são artifacts de GitHub e o noVNC é externo; não são uma tela nativa do Work dentro do ChatGPT.
- `browser_upload_file`, `browser_download_file`, `discord_upload_attachment`: interfaces registradas, mas transferência por navegador/Discord indisponível até integração autenticada. Nunca simular o upload.

## Como reportar estado

Ao usuário, diga "código instalado e testado" somente quando o CI comprovar, "Worker publicado" somente após deployment 100%, e "funcionando no Discord/Android" somente depois de uma ação real confirmada. Uma resposta `state: unavailable` não é sucesso. Ferramentas do servidor `/mcp` só podem ser usadas por um cliente que de fato conectou esse endpoint e obteve OAuth; skills no celular não invocam MCP automaticamente. Não pedir tokens, senhas, códigos, cookies ou chaves pelo chat.

## Continuidade Naruto RP

Leia `browser_actions/rpg_progress.json`, preserve valores `null` desconhecidos e só confirme nível/ryo/clã quando observar no servidor. Scripts com login Discord de sessões antigas não são migrados para Linux novo. Não acionar publicações sem confirmação explícita, e não agir como bot oficial em servidor que não aprovou a instalação.

## DM de teste oficial no Android (v2.12)

- URL autenticada: https://bushin-discord-direct.henrique-silva081106.workers.dev/mobile/dm
- O painel usa exclusivamente a sessão OAuth já autorizada, sem novo login se estiver ativa.
- A verificação do bot faz GET oficial `/users/@me` usando **Bot Token secreto no Worker**. Nunca mostre esse segredo, não peça em chat e não o coloque na URL.
- O usuário só pode enviar **uma DM de teste por clique confirmado** para sua própria conta Discord. A origem do formulário é validada; não envia em background; até uma tentativa por minuto e cinco ao dia. A API pode recusar por ausência de guild compartilhada ou bloqueio de DMs.
- Se não existir `DISCORD_BOT_TOKEN` como Secret no Worker, a tela informa configuração pendente, oferece links ao Discord Developer Portal e Cloudflare. Não afirmar que DM foi enviada. Para teste ao proprietário não é necessária a lista `BUSHIN_BOT_DM_USER_IDS`; para terceiros, a API do Bushin usa lista explícita.
- `mcp.json` NÃO é reinserido: o modo Android permanece skill-only para evitar aviso de desktop-only. Se a conta do ChatGPT indicar plugin `not_installed`, o usuário deve instalá-lo no ChatGPT; atualizar um plugin próprio não instala ele na conversa nem dá acesso nativo às ferramentas.
- O portal `/mobile/workspace` já permite criar tarefas e salvar progresso; `/mobile/servers` consulta a lista de guilds pela API OAuth.
- ChatGPT pode usar seus conectores GitHub e Cloudflare já conectados para manter o projeto e verificar implantação, mas isso não equivale a invocar MCP do Bushin nem fornece cookies do Discord.
