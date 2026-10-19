---
name: bushin-dm-android
description: "Use quando o usuário pedir para testar DM com o Bushin, diagnosticar Bot Token ou configurar mensagens do bot via Android."
---

# 🍥 Bushin — DM oficial no Android

No plugin original, a URL de teste é https://bushin-discord-direct.henrique-silva081106.workers.dev/mobile/dm .

A sessão OAuth móvel existente permite abrir a página, mas **não** enviar DMs como usuário. O painel pode enviar DM via **Bot Token oficial**, somente para a própria conta verificada, com confirmação na tela e limitação de tentativas. Sem `DISCORD_BOT_TOKEN` configurado em `Workers & Pages > bushin-discord-direct > Settings > Variables and Secrets`, a tela mostra o bloqueio e nenhum envio é tentado.

Para configurar, use https://discord.com/developers/applications/1561589128108314636/bot e https://dash.cloudflare.com/ em telas seguras. Nunca solicite segredos no chat ou em screenshots.

O bot pode ter dificuldades para enviar DM sem guild compartilhada. Não afirme envio real sem ID de mensagem confirmado pela API. O recurso não lê nem envia mensagens nos canais do Naruto Project RP sem autorização administrativa para o bot.

O plugin móvel permanece skill-only: a versão 2.12 não fornece ferramentas MCP diretamente ao ChatGPT Android. Se o plugin não estiver instalado na conversa, é preciso ação explícita do usuário na página https://chatgpt.com/plugins/plugins_6ad54d1a617c819191f5c10570c66ef3 . Não prometer que atualização da skill cria UI de contas conectadas.
