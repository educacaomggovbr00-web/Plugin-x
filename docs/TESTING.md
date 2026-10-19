# Testes e desenvolvimento

O Plugin-x é um laboratório para o Bushin Browser. O pacote importado contém **manifestos, skills e documentação**, não o código executável completo do servidor Worker Cloudflare.

## Workflows

1. **Bushin — validar pacote**: roda em push, PR ou manualmente; verifica JSON, versão, estrutura dos skills e padrões óbvios de segredos.
2. **Bushin — smoke MCP remoto**: rode manualmente em Actions → Run workflow; testa metadados OAuth, initialize, tools/list e proteção de conta sem token (HTTP 401).

## Ciclo sugerido

Crie uma branch, implemente uma melhoria, faça PR e aguarde os testes. Rode o smoke MCP após mudanças de integração. Só publique uma atualização do plugin privado quando aprovar explicitamente.

## Limites

Esses workflows **não** fazem login no Discord, não leem canais, não enviam mensagens, não exigem Linux no Android e não demonstram integração App/MCP do ChatGPT. A execução do CI usa runners Linux do próprio GitHub.
