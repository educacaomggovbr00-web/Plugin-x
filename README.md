# 🍥 Bushin Browser — laboratório de desenvolvimento

Este repositório privado contém uma cópia dos arquivos do Bushin Browser 2.15.0 para desenvolver, testar e corrigir bugs **antes** de publicar qualquer atualização. Não instala nem recupera automaticamente um plugin no ChatGPT.

## Conteúdo

- `plugin.json` e `.codex-plugin/plugin.json`: manifestos de laboratório.
- `skills/`: oito skills e referências técnicas do Bushin.
- `tests/`: testes offline do pacote e smoke MCP remoto.
- `.github/workflows/`: CI em push/PR e testes MCP manuais.
- `docs/TESTING.md`: procedimentos e limitações.

## Teste local

```sh
python -m unittest discover -s tests -p 'test_*.py' -v
```

No GitHub, abra **Actions** para ver os resultados e executar manualmente o teste remoto.

**Limites:** o código fonte do Worker Cloudflare não está neste ZIP; as ferramentas MCP no backend não comprovam integração com o ChatGPT Android. Não armazene tokens, senhas nem cookies neste repositório. O GitHub Actions utiliza runners Linux na nuvem para CI, mas seu celular não precisa de Linux.
