# 📷 Bushin — screenshots GitHub Actions → ChatGPT (v1.6)

1. Verificar status do workflow `bushin-discord-live.yml`, `run_id`, `head_sha` e se o canal Naruto Project RP está autenticado. Somente sessão iniciada após commit `4099d73c7d9dc1b36acf36eea4db9136959a5473` suporta nova galeria.
2. `browser_actions/live_command.json` recebe `{id,session_id,action:'screenshot'}` para uma captura, ou `{id,session_id,action:'capture_gallery',urls:[...2–4 URLs de canais do guild...]}` para múltiplas, com SHA do arquivo atualizado e ID único.
3. Aguardar `browser_actions/live_result.json` com exatamente mesmo ID/sessão e `ok:true`; para galeria ler `data.captures[]` e verificar cada `artifact_id`, `artifact_name`, `visible_page` no run.
4. Usar GitHub `fetch_workflow_run_artifacts` e `download_workflow_artifact`. Verificar ZIP (membros, tamanho máximo 1 MiB/JPEG), extrair bytes como JPEG em `/mnt/data` pelo container, conferir Pillow. Nunca inferir path por nome do artifact.
5. Mostrar cada JPEG verificado e uma colagem JPEG vertical com cabeçalhos; fornecer links separados para Android. Se faltou arquivo, explicar sem inventar imagem.
6. Respeitar limite de 6 capturas por sessão antiga v1.5 e 12 por sessão nova v1.6 (até 4 por comando). Artifacts privados expiram em 1 dia, não registrar pixels em commits. Campo de senha presente, DM ou host/canal fora da guild devem bloquear a captura. Não exponha segredo, cookie, token ou URL assinada.
7. Não confundir foto estática com streaming noVNC. Na execução v1.5 #39188253738, a galeria de 3 fotos foi produzida por 3 pedidos individuais, não pelo novo comando.
