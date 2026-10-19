---
name: bushin-oauth-discord-userinstall
description: "Use quando o usuário pedir para liberar OAuth do Discord no Bushin para ler canais, enviar mensagens, comandos slash, ou instalar comandos na própria conta pelo Android."
---

# Bushin — permissões Discord OAuth pessoais no Android

## Estado real do projeto

O **mesmo plugin privado** Bushin Browser funciona como skill no Android; não possui MCP local. O portal Cloudflare existente é https://bushin-discord-direct.henrique-silva081106.workers.dev/mobile. O usuário já conseguiu entrar com Discord; não peça logout/relogin sem erro comprovado.

O botão **Autorizar comandos pessoais do Bushin** no cartão 'Discord conectado' acessa `/mobile/commands`. É um fluxo OAuth **separado**, encaminhado pelo Worker a `https://discord.com/oauth2/authorize` com `client_id=1561589128108314636`, `scope=applications.commands` e `integration_type=1` (USER_INSTALL). É preciso habilitar instalação por usuário no Developer Portal Discord, seção Installation, e criar comandos do aplicativo para efetivamente usá-los. Não adicionar `bot` nem `guild_id` nesse fluxo pessoal; o usuário não possui permissão de administrar Naruto Project RP.

O OAuth de identidade continua com `identify`, `guilds`, `guilds.members.read` no Worker; não reautorizar a identidade para instalar comandos pessoais. O consentimento OAuth da instalação de usuário ocorre no domínio oficial discord.com. Nunca copiar tokens, códigos, client secrets ou senhas em texto do chat.

## Limites exatos

- `applications.commands` não autoriza leitura de conteúdo de mensagens nem permite responder como o usuário do Discord; permite instalar e usar comandos do aplicativo quando registrados e habilitados.
- `messages.read` serve à RPC local do cliente Discord, **não** à leitura remota de canais por OAuth Web via Cloudflare; não adicionar como promessa falsa.
- Instalar um bot de leitura/envio de mensagens em Naruto Project RP exige permissão de gerenciar o servidor. Mesmo com token de bot, apenas canais efetivamente permitidos estão acessíveis.
- No navegador remoto as ferramentas de leitura, rascunho e envio com confirmação são independentes do OAuth. Se não há uma sessão autenticada ativa não afirmar que leu ou enviou nada. Comandos slash do servidor são distintos dos comandos do aplicativo Bushin.

## Resposta prática

Quando o usuário pedir permissões OAuth, explique: abra o botão do portal para autorizar comandos pessoais, isso não exige administrador no servidor, não altera o login existente. Se o Discord indicar que o aplicativo não suporta USER_INSTALL, o proprietário deverá ativar o contexto de instalação por usuário na aplicação Discord; não alegar que foi feito automaticamente. Se a instalação funcionar, confirmar separadamente se os comandos foram registrados antes de prometer interação real.
