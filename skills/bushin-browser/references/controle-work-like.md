# 🍥 Bushin — controle visual seguro v1.6

1. Confirmar run GitHub Actions ativo, `head_sha`, Chrome online, guild autorizado. Não reiniciar sessões antigas sem autorização.
2. Executar comando único pela fila GitHub privada, com ID novo e `session_id` correto; aguardar resposta pareada `ok:true`.
3. `inspect_ui` fornece até 35 controles visíveis; `click` apenas controles seguros no RP; `press` só teclas de navegação; `scroll` em intensidade 1 a 8; `type_search` somente busca, não campo de mensagem. Nunca postar em conta pessoal, ler DMs ou digitar credenciais.
4. `screenshot` dá artifact JPEG privado e exige página no guild sem campo de senha. Sessões v1.5 têm limite 6. Sessões novas v1.6 têm teto total 12 e permitem `capture_gallery` (2–4 URLs de canais distintos do guild). Voltar ao canal original após galeria.
5. Conferir cada artifact e validar JPEG antes de links reais; no celular oferecer três JPEGs individuais e colagem vertical, rotulados como capturas estáticas.
6. Não apresentar iframe de noVNC como janela dentro do ChatGPT nem prometer streaming/automação contínua. O noVNC é externo, via HTTPS com chave secreta.


### Modo RPG v1.7

Use `rpg_scout` (1–4 URLs numéricas distintas do servidor autorizado) para retornar mensagens recentes de vários canais no mesmo pedido e voltar à tela inicial; `rpg_view` devolve apenas mensagens/tópicos do canal atual, sem nomes de outros servidores da barra lateral. Cada resultado tem `id` e `session_id` e fica no histórico privado do GitHub. Não existe envio de mensagens por self-bot. Consulte `rpg-assistente.md` para rotina de jogo e controle de progresso. Comandos só estão disponíveis em sessões Linux iniciadas após implantação do código v1.7.
