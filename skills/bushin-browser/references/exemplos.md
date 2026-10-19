# Bushin Browser v1.1 — exemplos práticos

## ChatGPT: controle como Browser Use (sem Codespaces)

**Pedido:** “Bushin, abre este site, clica no botão e me mostra a prévia.”

Descubra Browser Use em `ALL_TOOLS`; use `automate_browser` com tarefa específica. Aguarde resultado com `wait_browser_result` e mantenha o mesmo `run_id`. A prévia mostrada pelo provedor é visível enquanto a sessão está em execução, não é uma gravação garantida ou streaming permanente. Se o usuário pedir continuação, utilize somente `session_id` genuíno fornecido.

## Perfil autenticado

**Pedido:** “Entra no meu servidor do Discord.”

Confirme perfil Discord em `TinyFish.list_profiles` com `signed_in_sites` ou confirmação expressa. Se não existir, solicite a abertura de uma sessão segura de login via `start_profile_setup_session` e aguarde usuário. Nunca solicite credenciais no chat. Se login não disponível, pare. Nada disso depende dos cookies antigos do Codespace.

## GitHub Actions — exemplo real

**Pedido:** “Bushin, usa Actions para abrir example.com e capturar tela.”

Workflow: `bushin-browser-actions.yml`; usar integração GitHub conectada para `workflow_dispatch` com `ref:main`, `inputs: {"url":"https://example.com","passos_json":"[]"}` serializado em string conforme esquema da ferramenta. Acompanhe o novo run e forneça link exato. Depois veja `Artifacts` para `final.png`, texto e vídeo WebM. Essa execução não mantém sessão; só reproduz os passos solicitados.

**Pedido:** “Quero rolar, clicar e preencher.”

Exemplo `passos_json` como string:

```json
[
  {"action":"scroll","pixels":600},
  {"action":"click","selector":"a[href^='https://']"},
  {"action":"screenshot"},
  {"action":"extract","selector":"body"}
]
```

O seletor deve corresponder à página real; não inventar elementos. Browser Use é preferível quando a pessoa quer navegação visual autônoma e cliques decididos pelo agente.

## O que realmente significa “ao vivo”

- **Browser Use / TinyFish:** prévia visual do navegador remoto enquanto o provedor executa tarefa, se disponível.
- **GitHub Actions:** logs atualizados durante execução; screenshots e vídeo são arquivos criados ao terminar; não existe sessão gráfica compartilhada contínua entre jobs.
- **Nenhum deles:** acesso automático à sessão de Firefox do Codespaces, identidade Discord pessoal persistente no Actions ou autonomia infinita.

## Proteção de privacidade

Não armazenar logins nem trechos privados do Discord em artefatos. Nunca usar o navegador Actions para preencher senhas (mesmo que GitHub mascarasse parte do log). Para publicações no Discord, o modo permitido é um bot oficial autorizado identificado como bot, ou rascunho para envio manual pelo usuário.

### "Bushin, controle meu Linux do GitHub enquanto vejo a tela"

- Se a execução do Linux começou antes da versão v1.2, **não** afirme controle: o receptor não pode ser injetado numa execução existente.
- Para sessões novas, o controle é pela fila privada `browser_actions/live_command.json` e respostas em `browser_actions/live_result.json`, usando `session_id` com `run_id` exato.
- Validar comandos por ID e `ok:true`; somente navegação, rolagem, consulta de estado e leitura do canal autorizado. Não usar o link/chave do noVNC para controle do plugin.
- Screen share permanece no link efêmero da própria execução Actions, acessível só ao usuário e a quem tiver o segredo.
- O token temporário do GitHub não deve chegar ao browser, e nenhum token deve aparecer em logs/resultados da fila.
