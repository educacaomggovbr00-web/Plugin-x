---
name: bushin-visual-android
description: "Controlar navegador remoto Bushin via painel Android usando GitHub Actions OIDC assinado, Cloudflare D1 e login visual privado."
---

# 🍥 Bushin 2.13 — navegador visual no celular

Este é o **mesmo plugin original** `plugins_6ad54d1a617c819191f5c10570c66ef3`, sem novo plugin e **sem MCP nativo no ChatGPT Android**.

## Links seguros

- Portal conectado: https://bushin-discord-direct.henrique-silva081106.workers.dev/mobile
- Controles de navegador: https://bushin-discord-direct.henrique-silva081106.workers.dev/mobile/visual
- Tarefas e memória: https://bushin-discord-direct.henrique-silva081106.workers.dev/mobile/workspace
- DMs por bot oficial (opcional): https://bushin-discord-direct.henrique-silva081106.workers.dev/mobile/dm
- Iniciar a sessão temporária no GitHub: https://github.com/educacaomggovbr00-web/shinobi-ai-agent/actions/workflows/bushin-discord-live.yml

## Arquitetura e capacidade

O GitHub Actions emite JWT assinado via OIDC para o Worker, validado com JWKS, identidade imutável do repositório, audience, workflow e branch main. O Worker registra um runner efêmero em D1 e nunca recebe um token pessoal do GitHub. A sessão autenticada do portal Android pode enfileirar comandos em `/mobile/visual`, e o runner do Chromium consulta `/bridge/runner/poll`, executa com `browser_actions/live_controller.py` e confirma via `/bridge/runner/result`.

Operações oferecidas: status, abas do Naruto Project RP, leitura de texto e RPG estruturado, capturas, inspeção visual, navegação em canal específico, digitar rascunho, e **envio apenas com confirmação explícita no canal indicado**. Somente o navegador com login real pode acessar mensagens visíveis; o OAuth original `identify`, `guilds`, `guilds.members.read` não autoriza isso. Ações são limitadas à guild `1515877468299595919` e conferidas novamente no controlador.

O link privado de login do noVNC aparece apenas no resumo do workflow do GitHub. **Nunca pedir senha ou token do Discord no chat.** O login móvel e o perfil temporário de Chromium são sessões diferentes. Se não existir execução ativa, explicar que os comandos não estão operacionais.

O módulo `services/discord-oauth/cloudflare/src/visual-bridge.mjs` e o Python `browser_actions/cloudflare_bridge.py` contêm a ponte; testes de assinatura e isolamento em `tests/visual-bridge.test.mjs`. Não prometer que a ponte está funcionando em Chromium real até confirmar runner OIDC online e comando concluído. Não chamar comandos em sessão de navegador antiga que não contenha o controlador atualizado.

## Limitações que não devem ser disfarçadas

- Comandos da Cloudflare **não são ferramentas executáveis nativas dentro do ChatGPT Android**: a integração por plugin é skill-only.
- DMs via API Discord requerem bot oficial e seu Bot Token como Secret no Worker. Login OAuth não concede essa função.
- O Work tem controle visual hospedado nativo; aqui o navegador é um GitHub Actions temporário com noVNC.
- Tarefas persistidas em D1 não executam automaticamente em segundo plano.
- Comando enfileirado ≠ comando realizado; verifique o status `completed` e o resultado.
