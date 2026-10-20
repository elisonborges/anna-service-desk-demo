# Ciclo de desenvolvimento — Demonstração v0.2 (20/10/2026)

## Escopo
Apenas a branch `dev/demo-polish-20261020` do repositório público de demonstração. A branch `main` continua servindo a versão publicada v0.1. O repositório privado AnnA Service Desk e o Neon não foram modificados.

## Alterações preparadas
- Separação visual entre título e categoria de cada chamado.
- Ajustes responsivos para telas pequenas.
- Pesquisa local por número, título, categoria e descrição.
- Filtro adicional por prioridade, combinado com o filtro de status.
- Contagem de chamados encontrados e botão para limpar filtros.
- Botão explícito para reiniciar os dados fictícios, com confirmação antes de descartar as alterações da sessão.
- Identificação da versão demonstrativa v0.2.
- Workflow `demo-checks.yml` para checagem sintática de JavaScript, elementos esperados no HTML e ausência de integrações de backend.

## Restrições
- Nenhuma autenticação real ou persistência.
- Nenhum dado real, token ou segredo.
- Nenhuma integração com Neon, Supabase ou API.
- Nenhuma publicação automática desta branch; Pages continua configurado somente para `main`.
- Os testes do workflow e a revisão visual em navegador ainda devem ser confirmados antes de qualquer merge/publicação.

## Próximas verificações
1. Confirmar resultado do workflow Demo Branch Checks.
2. Verificar manualmente pesquisa, combinação de filtros, reset e navegação em telas pequenas.
3. Publicar somente mediante aprovação específica do proprietário.
