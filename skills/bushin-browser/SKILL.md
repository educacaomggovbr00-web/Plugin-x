---
name: bushin-browser
description: 'Bushin Browser: experiência Android restaurada, link OAuth Discord no celular, sem exigir MCP nem Linux.'
---

# 🍥 Bushin Browser — modo móvel 2.8

## Objetivo

Manter o **plugin original** `plugins_6ad54d1a617c819191f5c10570c66ef3` funcionando como skill no ChatGPT Android. O usuário quer evitar o erro Desktop only. O login no Discord pelo celular acontece em um portal Cloudflare próprio, não em um Linux. O plugin usa **somente skills**, sem `mcp.json` ou `.mcp.json`. Não introduza dependências de MCP sem consentimento expresso; essa alteração já causou problemas ao usuário.

## Quando o usuário perguntar pela conta

- Portal móvel seguro: https://bushin-discord-direct.henrique-silva081106.workers.dev/mobile
- Quando o usuário mostrar o cartão **Discord conectado** com **Conta verificada** e **Membro do Naruto Project RP**, a autorização móvel foi concluída. Não peça para desconectar/reconectar sem erro concreto.
- Discord OAuth é `identify`, `guilds`, `guilds.members.read`. O login confirma identidade e vínculo, mas não fornece controle do navegador, DMs, canais ou mensagens.
- O login seguro é feito no domínio `discord.com`, não em chat nem em formulário de terceiros.
- A seção nativa **Contas conectadas** do aplicativo ChatGPT, como no plugin GitHub, é controlada pela plataforma e não pode ser ativada pelo skill-only. Seja claro: **não afirmamos que apareceu ou que pode ser forçada com um manifesto**.

## Recursos avançados (não obrigatórios)

O servidor remoto https://bushin-discord-direct.henrique-silva081106.workers.dev/mcp continua no backend, porém **não está ligado ao pacote móvel**. Ferramentas MCP não devem ser anunciadas como visíveis no ChatGPT Android sem um teste real. Uma sessão de Chromium remota é diferente do login OAuth do portal. Somente se o usuário pedir expressamente para explorar computadores externos, consulte referências históricas: `references/controle-work-like.md`, `references/cloudflare-free.md`, `references/discord-oauth.md`, `references/rpg-assistente.md`. Não exigir instalação de Linux, GitHub ou Composio.

## Segurança e relatos

Não solicitar, publicar ou copiar senhas, cookies, tokens, segredos Cloudflare, ID de sessão privada ou códigos de autorização. Não inventar acesso ao Discord nem declarar que enviou mensagens. Distinguir claramente o que o plugin oferece, o que o backend já oferece e o que o cliente Android realmente habilita.


---
Available file URIs for this installed plugin skill. Use these exact URIs when reading files:

skills://plugins/bushin-browser/bushin-browser/skill.md
skills://plugins/bushin-browser/bushin-browser/references/cloudflare-free.md
skills://plugins/bushin-browser/bushin-browser/references/controle-work-like.md
skills://plugins/bushin-browser/bushin-browser/references/discord-direct-permissions.md
skills://plugins/bushin-browser/bushin-browser/references/discord-oauth.md
skills://plugins/bushin-browser/bushin-browser/references/exemplos.md
skills://plugins/bushin-browser/bushin-browser/references/painel-chatgpt.md
skills://plugins/bushin-browser/bushin-browser/references/rpg-assistente.md
skills://plugins/bushin-browser/bushin-browser/references/screenshots-github.md
skills://plugins/bushin-browser/bushin-browser/references/work-like-mcp.md