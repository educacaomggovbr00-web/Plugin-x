# 🍥 Cloudflare Free — conexão Discord Direct do Bushin original

**Finalidade:** alternativa a Replit e Sites, sem gastar créditos diários, **no mesmo plugin** Bushin Browser (`plugins_6ad54d1a617c819191f5c10570c66ef3`). Não cria outro plugin ChatGPT.

**Código oficial do próprio usuário:** `https://github.com/educacaomggovbr00-web/shinobi-ai-agent/tree/main/services/discord-oauth/cloudflare`.

**Status em 19/10/2026:** Worker/D1 com código e testes offline preparados; não há conta/endpoint Cloudflare verificados nem login real. A versão do Bushin não inclui `mcp.json` com URL real. Nunca alegar conta Discord conectada só por existir código/Client ID.

**Fluxo de ativação:**
1. Usuário entra na própria conta Cloudflare (https://dash.cloudflare.com/) e usa Workers Free. Não pedir senha ou código no chat; não contratar plano. Cloudflare fornece endereço HTTPS estável workers.dev e D1 no plano Free sujeito a limites.
2. Instala/submete o Worker de `services/discord-oauth/cloudflare/src/worker.mjs`, banco D1 e esquema SQL `schema.sql`; usar `wrangler.example.toml` somente como modelo, substituindo o domínio e banco por IDs reais.
3. Configurar pela Secret Manager da Cloudflare, sem exibir aqui: `DISCORD_CLIENT_SECRET`, `BUSHIN_OWNER_DISCORD_ID` e `ENCRYPTION_KEY_BASE64`; definir `PUBLIC_BASE_URL` com o host exato verificado; vincular `DB` ao D1.
4. Discord Developer Portal, aplicação 1561589128108314636, OAuth2, Redirects: `<PUBLIC_BASE_URL>/oauth/discord/callback`. Essa é a callback do Discord; o registro do ChatGPT é feito via DCR e allowlist de URLs oficiais.
5. Testar `GET /health` (a propriedade `configuration_ready` true não comprova login), `/.well-known/oauth-authorization-server`, `/.well-known/oauth-protected-resource` e MCP `tools/list`. Se falhar, não vincular ao plugin.
6. Com a URL HTTPS real testada, integrar `mcp.json` do mesmo Bushin com `mcpServers.bushin-browser.url=https://HOST_REAL/mcp`, auth `{type:"oauth",client:{mode:"dcr"},baseScopes:["identify","guilds","guilds.members.read"]}`. Preservar o plugin existente e solicitar consentimento pelo Discord oficial.
7. Após usuário autorizar, chamar `bushin_discord_whoami` e `bushin_discord_naruto_membership` na ferramenta real e confirmar a conta e Naruto RP.

**Limites:** autenticação OAuth é diferente de login no navegador Web do Discord. Escopos concedem identidade e vínculo ao servidor, não leitura/envio geral de mensagens; automação de conta pessoal (self-bot) não é permitida. Não armazenar secrets no plugin/arquivo GitHub.


## Atualização 2.3 — implementação real verificada

O procedimento acima descreve a implantação inicial. **Já foi implantado**: URL `https://bushin-discord-direct.henrique-silva081106.workers.dev`, Worker, D1, tabelas, segredos e callback Discord relatada como salva pelo usuário. Teste público 39259586055 verificou health pronto, metadata OAuth e MCP com 401 sem login. A configuração `mcp.json` agora existe no Bushin original. A próxima etapa é consentimento do usuário no Discord pela tela segura do ChatGPT. Conexão autenticada ainda **não confirmada**.
