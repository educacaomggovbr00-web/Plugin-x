# 🍥 Discord OAuth próprio do Bushin (integração em desenvolvimento)

## Sem plugin adicional

Este é o backend do mesmo plugin Bushin Browser, **não outra instalação do Discord nem uma cópia**. Client ID público do Discord Developer Portal: `1561589128108314636`. Código fonte real: repositório GitHub `educacaomggovbr00-web/shinobi-ai-agent`, pasta `services/discord-oauth`. O `README.md` dessa pasta documenta deployment, endpoints, testes e autenticação.

## Estado atual

O Client ID foi fornecido pelo usuário. O serviço MCP somente de leitura foi implementado com duas ferramentas, `bushin_discord_whoami` e `bushin_discord_naruto_membership`, testadas com mocks. O servidor ainda precisa de hospedagem HTTPS estável, configuração de callback/segredo OAuth em uma UI segura e teste de login real. A versão do plugin ainda não tem `mcp.json` nem serviço conectado; **nunca dizer “Discord entrou” antes de executar e verificar essas etapas**.

## Como concluir (sem segredos na conversa)

1. Escolher ou autorizar hospedagem permanente HTTPS para o serviço Node do MESMO repositório (não usar túnel temporário noVNC do GitHub).
2. Configurar `PUBLIC_BASE_URL` no serviço e publicar seu endpoint real `/mcp`. Consultar `/health` e `/.well-known/oauth-protected-resource` externamente.
3. No plugin original, adicionar `mcp.json` com o endereço real; modelo sem senha no repositório: `services/discord-oauth/mcp.template.json`. Manter o mesmo plugin ID e preservar as skills e a sessão Linux existente.
4. Na conexão do próprio Bushin no ChatGPT, ver a **Redirect URI exata**, cadastrá-la no OAuth2 da aplicação Discord e inserir Client Secret apenas no campo seguro da interface, se solicitado. Não enviar Client Secret/código para o chat.
5. Testar a compatibilidade real OAuth Discord ↔ ChatGPT/MCP: pode exigir adaptação para OAuth 2.1 (metadados, resource indicators e PKCE) porque a plataforma não garante integração direta com todo provedor OAuth2. Se falhar, não afirmar sucesso.
6. Depois da conexão, testar `bushin_discord_whoami` e `bushin_discord_naruto_membership`, verificando conta e guild Naruto RP sem ler DMs ou emails. OAuth identifica e verifica guilds, **não** transfere cookies para Chrome nem permite self-bot ou leitura irrestrita de canais.

## Cuidados

Sem dependência de Composio no fluxo nativo. Não criar segundo plugin, não inventar domínio/callback, não codificar segredo, não gravar tokens/authorization codes no GitHub. Os testes mockados apenas provam código básico; login real permanece pendente até haver HTTPS e consentimento de usuário. Para o RPG, funções Playwright/GitHub podem continuar separadamente enquanto a conexão OAuth é construída.
