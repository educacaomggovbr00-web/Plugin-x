# 🍥 Bushin — imagens reais no chat Android

O ChatGPT pode exibir fotos estáticas verificadas recuperadas de artifacts GitHub, mas a CSP não permite `iframe` noVNC dentro do app. Para várias capturas de RP, em execuções v1.6 use `capture_gallery`; em execuções anteriores envie até 6 screenshots separadas e monte um JPEG de colagem quando viável.

**Exibição confiável no Android:** crie arquivos locais JPEG verdadeiros, valide tamanho/resolução com Pillow, forneça links diretos `sandbox:` apenas se presentes no container, e uma colagem vertical (3 capturas com rótulos) que o usuário pode abrir e ampliar. Não usar URLs inventadas. Nunca usar screenshot sintética como se fosse Discord.

Com botões interativos no chat, utilize apenas ações reais via `GenUI.issueNewTurn` para pedir nova captura/leitura/navegação; eles não criam vídeo ao vivo. Não salvar no plugin/commits nenhuma chave `connect?key=`, senha, token ou cookie do noVNC/Discord.

**Segurança:** somente canais autorizados do Naruto RP, bloqueio de DMs e inputs de senha, não enviar mensagens como self-bot. Os artifacts são privados, retidos 1 dia; capturas exibidas pelo ChatGPT são cópias temporárias. A sessão v1.5 não é atualizada com código v1.6.


## Painel RPG v1.7

Quando fizer sentido, ofereça 3 controles reais via `GenUI.issueNewTurn`: **Continuar RPG** (scout + recomendação sem postagem), **Ver minha ficha** (conferir informações verificadas, status/rank com `null` se desconhecidos) e **Galeria de telas** (screenshot ou capture_gallery de acordo com a versão da execução). O botão apenas inicia a nova solicitação, não roda em background. O usuário Android prefere colagem vertical e links individuais para arquivos JPEG verificados. Sem repetir chaves do túnel ou expor DMs.
