# Bushin Browser 2.0 — integração nativa dentro do mesmo plugin

## Como validar

1. Para testagem do código, consultar `services/discord-oauth/` no repositório original do Bushin e a execução bem-sucedida do GitHub Actions workflow `bushin-discord-oauth-tests.yml`. Testes locais usam dados falsos: isto NÃO prova login Discord real.
2. Confirmar HTTPS persistente e fixo de servidor MCP publicado pelo próprio Bushin. Se não existir, parar e solicitar decisão do usuário sobre hospedagem; **não** criar segundo plugin nem usar Composio/TinyFish como substitutos.
3. Testar publicamente sem tokens `GET /health`, `GET /.well-known/oauth-authorization-server` (inclui DCR e PKCE S256) e `GET /.well-known/oauth-protected-resource` (issuer próprio). MCP `tools/list` e `resources/read` devem funcionar; tool calls privadas retornam HTTP 401 com `WWW-Authenticate` sem autenticação.
4. Na secret manager do hosting, e apenas nela, fornecer `PUBLIC_BASE_URL`, `DISCORD_CLIENT_SECRET`, `BUSHIN_OWNER_DISCORD_ID` e opcionalmente `BUSHIN_GITHUB_TOKEN` (necessário para controle remoto). Não solicitar segredos, login, 2FA ou URLs privadas no chat.
5. Registrar no Discord Developer Portal do app `1561589128108314636` a URI HTTPS exata: `<PUBLIC_BASE_URL>/oauth/discord/callback`.
6. Depois do endpoint REAL online, modificar `services/discord-oauth/mcp.template.json` apenas na URL e salvar como `mcp.json` no mesmo plugin existente usando Plugin Creator, mantendo identidade `plugins_6ad54d1a617c819191f5c10570c66ef3`, OAuth com `client.mode: dcr`. Não criar uma cópia do plugin.
7. Abrir o Bushin no ChatGPT, clicar em conectar e autorizar pelo Discord; somente após `bushin_discord_whoami` retornar a conta correta, `bushin_discord_naruto_membership` comprovar membro e o painel `bushin_open_browser_console` mostrar capturas reais, declarar o login e a visualização **realmente funcionais**.
8. O painel utiliza imagens estáticas devolvidas pelo GitHub, sem transformar a sessão do Chromium num streaming de vídeo igual ao Work. A partir de uma foto verificada, clique nas coordenadas, rolamentos e links permitidos; sem DMs ou postagem pessoal.

## Contexto técnico

- O provedor OAuth2.1 é o próprio servidor estável do Bushin e redireciona ao Discord para autenticar; exige callback próprio e tokens separados. Há códigos de autorização e registros armazenados **somente em memória nesta versão**, então reinícios podem exigir reconexão. Para produção, planejar persistência criptografada e rate limiting.
- A infraestrutura temporária GitHub Actions continua: o OAuth comprova identidade para o MCP, mas **não loga automaticamente o Discord no Chromium temporário**. Login da aba Discord só pela interface protegida do navegador, com o usuário presente.
- Os comandos MCP foram implementados no código, mas os novos nomes de ferramenta só aparecem no ChatGPT depois de conectar efetivamente o servidor. Não inventar chamadas à ferramenta antes dessa etapa.
