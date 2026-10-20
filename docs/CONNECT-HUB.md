# 🍥 Bushin — Conexão e Testes (Plugin-x)

**Esta é a central de links para usar pelo celular.** As duas autorizações são separadas: GitHub Actions **não** consegue instalar um App na sua conta ChatGPT nem fazer login em seu Discord.

## 1. Discord: login autorizado

[Abrir o portal móvel do Bushin](https://bushin-discord-direct.henrique-silva081106.workers.dev/mobile)

- Faça a autorização OAuth diretamente no site seguro.
- O login móvel confirma a identidade e permissões concedidas, mas não autoriza enviar mensagens pela conta pessoal.
- Não cole senhas, tokens, cookies ou códigos de autenticação no GitHub/ChatGPT.

## 2. ChatGPT: adicionar o MCP onde for permitido

[Abrir o ChatGPT](https://chatgpt.com/)

**URL HTTPS do servidor MCP Discord do Bushin:**

`https://bushin-discord-direct.henrique-silva081106.workers.dev/mcp`

No ChatGPT, verifique se sua interface permite adicionar/conectar um App MCP personalizado. Se permitir, cadastre a URL e aprove a autorização na interface do ChatGPT. **Não é um login automático**; disponibilidade e execução no Android precisam ser verificadas no próprio aplicativo.

O endpoint do laboratório de navegador é separado e não substitui o MCP de identidade do Discord: `https://bushin-agent-lab.henrique-silva081106.workers.dev/mcp`.

## 3. GitHub Actions: teste do Plugin-x

[Ver o workflow Bushin — Conexão e Testes](https://github.com/educacaomggovbr00-web/Plugin-x/actions/workflows/bushin.yml)

Use o botão **Run workflow** caso esteja disponível na página. O workflow verifica os metadados OAuth, o catálogo MCP, o bloqueio de chamadas anônimas e o navegador descartável do laboratório. Ele publica um resumo e um artefato `bushin-chatgpt-connection` sem credenciais.

**Testes realizados pelo workflow ≠ conexão do ChatGPT Android concluída.** Para confirmar o uso real, é necessário conectar o App no ChatGPT e chamar uma ferramenta autorizada, verificando o retorno. Também não é possível ler/enviar mensagens pessoais via escopos OAuth atuais.

## Segurança e escopo

- Não altera o Bushin original e não instala outro plugin.
- Não solicita token de usuário Discord nem implementa self-bot.
- O GitHub Actions utiliza infraestrutura temporária do GitHub apenas para testes. **Você não precisa fazer login em Linux**.
- Esta página fornece links e instruções, não uma autorização conjunta das duas contas.
