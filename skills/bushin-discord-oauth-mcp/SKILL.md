---
name: bushin-discord-oauth-mcp
description: 'Verificar login Discord e conexão efetiva do Bushin no ChatGPT Android sem Linux, no padrão de ferramentas do Reddit Pessoal.'
---

# Bushin Browser — conexão direta Discord OAuth + MCP

Este skill integra o MESMO plugin original, `plugins_6ad54d1a617c819191f5c10570c66ef3`. Não criar novo Bushin, não alterar contas existentes e não inserir `.mcp.json`/`mcp.json` para simular instalação no Android.

## Três ferramentas remotas implementadas e comprovadas

Servidor OAuth MCP: `https://bushin-discord-direct.henrique-silva081106.workers.dev/mcp`

- `bushin_discord_whoami`: identificação pessoal Discord por OAuth, sem e-mail nem tokens.
- `bushin_discord_list_servers`: lista de servidores via OAuth; é uma função da suíte avançada autenticada, não um bot.
- `bushin_session_status`: confirma autenticação do CLIENTE MCP, nome do perfil, escopos e capacidade efetiva. Nunca diz que pode ler ou enviar mensagens como usuário.

O fluxo Cloudflare aceita autorização OAuth 2.1, DCR, PKCE S256 e refresh, com credenciais Discord cifradas em D1. Testes automatizados confirmam acesso autorizado e bloqueio HTTP 401 sem token. A versão pública do Worker foi testada através de GitHub Actions `bushin-live-mcp-tools.yml` após publicação. Esses testes não provam que o App está conectado neste dispositivo.

## Como agir no ChatGPT

1. Confira se aparecem NESTA conversa ferramentas `bushin_session_status`, `bushin_discord_whoami` ou `bushin_discord_list_servers` com acesso de execução. Caso existam, use-as para obter dados reais, sempre diferenciando login do portal e conexão MCP.
2. Se faltarem ferramentas executáveis, informe claramente: o backend está pronto, mas não está ligado a um App instalado no ChatGPT. Nunca invente resultados com base em instruções ou reescreva `plugin.json` para forçar o cliente Android.
3. O plugin do Reddit Pessoal difere porque possui um Apps SDK app registrado em `.app.json`, enquanto o Bushin original permanece skill-only. Para chegar à mesma experiência, é necessário registrar uma integração App/MCP própria para o Bushin através da interface suportada pelo ChatGPT, com ação/autorização explícita do usuário; o assistente não deve reaproveitar o ID do Reddit nem criar aplicativo alternativo sem pedido.
4. Se o usuário puder abrir a interface de conexão de MCP personalizada no ChatGPT web, fornecer o endpoint acima e seguir a autorização segura. A compatibilidade do cliente Android não está garantida: verificar antes de anunciar. NÃO confundir o login do portal `/mobile` com a autorização OAuth do novo cliente MCP.
5. A consulta OAuth de identidade NÃO depende de Linux nem de bot. Controlar canais, ler mensagens e enviar como o usuário exige outro método autorizado; a API OAuth Discord não fornece essa permissão. O usuário não quer bot. Não pedir instalação de bot.

Não pedir senha/token no chat, não mudar sessão móvel existente, não consultar regras do Naruto RP e não executar ações de envio sem consentimento de conteúdo/destino. Ações que retornem `unavailable` não são sucessos.
