# Bushin Agent — primeira versão executável

Servidor experimental MCP em `src/server.mjs`. Funciona localmente em `127.0.0.1:8788/mcp` com JSON-RPC 2.0 e seis ferramentas: `bushin_browser_open`, `bushin_browser_read`, `bushin_browser_click`, `bushin_browser_type`, `bushin_browser_screenshot` e `bushin_browser_status`.

## Rodar localmente

```sh
npm install
npx playwright install chromium
npm start
```

Endpoint: `http://127.0.0.1:8788/mcp`. Ele é **apenas um servidor experimental**, não um aplicativo instalado no ChatGPT. Nunca exponha esse endereço diretamente à internet: **não há autenticação de cliente**. O processo usa navegador sem login e não inclui controle de Discord autenticado.

## Próximas etapas para ChatGPT Android

1. Hospedar executor isolado com autenticação real de cliente, gerenciamento de sessões e limites por usuário.
2. Expor MCP remoto em HTTPS com autenticação OAuth compatível com ChatGPT.
3. Criar/instalar App que registre as ferramentas de execução (skills não bastam).
4. Testar chamada real do ChatGPT Android ao executor.
5. Usar Discord somente por caminhos autorizados; OAuth identify/guilds não autoriza ler/enviar mensagens pessoais.

GitHub Actions testa um navegador descartável na nuvem. Ele não mantém uma sessão Discord ativa, nem fornece controle contínuo de browser. Não use tokens de usuário nem self-bot.
