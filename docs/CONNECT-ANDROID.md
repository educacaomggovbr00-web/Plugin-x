# 🍥 Conexão do Bushin ao ChatGPT Android

## Estado verificado em 19/10/2026

- Worker `bushin-agent-lab` publicado em Cloudflare, separado de `bushin-discord-direct`.
- URL: `https://bushin-agent-lab.henrique-silva081106.workers.dev/mcp`.
- MCP `initialize` e `tools/list` respondem; `tools/call` sem autenticação retorna HTTP 401.
- GitHub Actions: [smoke remoto aprovado](https://github.com/educacaomggovbr00-web/Plugin-x/actions/runs/39341967384).
- As ferramentas Cloudflare são **somente leitura/captura de páginas públicas permitidas**; não existem sessão de navegador persistente ou controle Discord.
- O executor Node com click/type funciona em testes descartáveis no GitHub, **não está hospedado para uso remoto**.

## Ação segura pendente na Cloudflare

A criação do segredo via integração foi bloqueada pelas configurações de segurança. O **proprietário** precisa criar uma chave aleatória forte no painel Cloudflare, sem enviá-la no chat ou colocá-la no GitHub:

1. Cloudflare Dashboard → Workers & Pages → `bushin-agent-lab` → Settings → Variables and Secrets.
2. Adicione segredo do tipo **Secret**, nome exato `AGENT_API_KEY`, valor aleatório com no mínimo 40 caracteres gerado localmente por um gerenciador de senhas.
3. Salve/deploy a configuração. Não exponha a chave em capturas de tela, tickets, issues ou mensagens.

O segredo apenas protege o endpoint experimental; **não configura OAuth do ChatGPT**. Não cole o segredo na tela de Client ID/Client Secret do Discord e não trate como token de usuário Discord.

## Para realmente chamar as ferramentas no Android

1. Criar um fluxo de OAuth do **app Bushin** com PKCE e permissão explícita `browser.read` / `browser.control`. A autorização existente do Discord (`identify`, `guilds`, `guilds.members.read`) não dá permissão de navegador ou de enviar mensagens.
2. Cadastrar esse MCP HTTPS como App executável no ChatGPT (não basta `skills/` ou `plugin.json`).
3. O proprietário faz a conexão/login pela interface segura do ChatGPT. Isso **exige ação explícita do usuário**.
4. Após aparecer o App e suas ferramentas disponíveis no ChatGPT, executar `bushin_cloud_browser_status` e `bushin_cloud_browser_read` numa página pública para confirmar ponta a ponta.
5. Somente então desenvolver ações mutáveis em sessões autenticadas separadas, com aprovação, auditoria e restrições. Não usar self-bot nem token pessoal Discord.

Acompanhe os próximos passos na [issue #1](https://github.com/educacaomggovbr00-web/Plugin-x/issues/1).
