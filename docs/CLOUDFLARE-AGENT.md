# Bushin Agent Cloudflare — implantação segura

O Worker de laboratório roda separadamente do `bushin-discord-direct`, sem alterar o OAuth/Discord existente.

## Endpoint de laboratório

`https://bushin-agent-lab.henrique-silva081106.workers.dev/mcp`

Saúde pública: `GET /health` (sem login e sem navegação real). `initialize` e `tools/list` anunciam o MCP. **Todas as chamadas a ferramentas exigem `Authorization: Bearer ...`**, usando `AGENT_API_KEY` configurada como secret Cloudflare, nunca em GitHub.

## Ferramentas remotas

- `bushin_cloud_browser_read` — extrai Markdown por Browser Run.
- `bushin_cloud_browser_screenshot` — captura PNG.
- `bushin_cloud_browser_status` — verifica suporte remoto.

Somente URLs públicas HTTPS explicitamente permitidas; sem sites privados, login, Discord pessoal, cliques ou preenchimento de formulários.

## Limitações importantes

Isto **não conecta** automaticamente as ferramentas ao ChatGPT Android. A integração final requer um App ChatGPT registrado e autenticação OAuth com autorização `browser.control` (a atual OAuth Discord `identify` não concede essa permissão). Não utilize este token API como substituto inseguro para OAuth do ChatGPT.

O executor Node+Playwright que suporta `open/click/type` no GitHub Actions continua sendo apenas um laboratório descartável, sem acesso a login.

## CI

`npm test` inclui validações offline para auth, allowlist, tools/list e simulação Browser Run. Um novo workflow verifica `/health` e bloqueio de comandos anônimos. Sem segredos no GitHub.
