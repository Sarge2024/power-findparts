# Histórico de Implementação: Reestruturação da Tela Inicial (Catalog)

**Data:** 05 de Julho de 2026
**Funcionalidade:** Reformulação da navegação e filtros da tela inicial

## Resumo das Alterações

1. **Reestruturação do Layout e Filtros**
   - Removido o banner de introdução (Hero) com a imagem do motor para priorizar funcionalidades.
   - O Breadcrumb superior foi substituído por um Bloco de Filtros Vertical de "Seleção de Frota", exibindo Marca, Modelo e Ano um abaixo do outro em caixas bem definidas.

2. **Drill-down em Três Níveis**
   - Alterada a grade de categorias principais para exibir apenas 2 colunas, deixando os botões maiores e fáceis de tocar.
   - Incluída a etapa intermediária de seleção de **Subgrupos** de peças. Agora, após clicar em "Elétrica" ou "Motor", um sub-menu com os subgrupos daquela área é revelado logo abaixo.
   - A tabela (Inventário) só é montada na tela **após** um Subgrupo ser selecionado, deixando a interface limpa e focada nas peças que o usuário quer ver de fato.

3. **Arquitetura de Dados**
   - Atualizada a interface `Part` adicionando a propriedade `subgroup`.
   - Adicionado novo array em cache `INITIAL_TECH_SUBGROUPS` para classificar os níveis internos de engenharia dos grupos.

## Arquivos Modificados
- `src/types.ts`
- `src/initialData.ts`
- `src/App.tsx`
- `src/components/Catalog.tsx`
