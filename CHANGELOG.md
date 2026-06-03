# Bradesco Program Board - Changelog

## v1.3.0 (2026-06-03)

### 🎯 Principais Melhorias

#### ✨ Componentes de Múltipla Seleção Aprimorados
- **Novo componente `multi-select`** para filtros: Vertical, Tribo, Cluster, Squad
- Suporte a **múltiplas seleções simultâneas** em cada filtro
- **Checkboxes intuitivos** para melhor visualização das opções selecionadas
- **Busca em tempo real** dentro de cada dropdown para filtrar opções rapidamente
- **Tags visuais** mostrando valores selecionados no botão de filtro

#### 🎨 Melhor Visualização dos Filtros Ativos
- **Barra de status aprimorada** com design moderno e gradiente
- **Chips/badges individuais** para cada filtro ativo, com ícone correspondente
- Melhor contraste e legibilidade dos filtros aplicados
- Layout responsivo para múltiplos filtros selecionados

#### 🔧 Funcionalidades Técnicas
- Sistema de dados multi-select com array `MS_DATA` para rastreamento de estados
- Funções novas:
  - `msPopulate(id, opts)` - Popula opções do multi-select
  - `msToggle(id)` - Abre/fecha dropdown
  - `msToggleOpt(id, val)` - Alterna seleção de item
  - `msUpdateDisplay(id)` - Atualiza visualização do filtro
  - `msFilter(id)` - Busca dentro do dropdown
- Suporte a armazenamento de múltiplos valores separados por `|` (pipe)
- Integração com lógica de filtragem existente (`filtered()`, `doFilter()`)

#### 🚀 Melhorias na Filtragem
- Função `filtered()` atualizada para suportar múltiplas seleções
- Função `buildTopFilters()` agora usa `msPopulate()` ao invés de `popDL()`
- Função `updateFStatus()` com visualização melhorada de filtros ativos
- Compatibilidade mantida com Quarter e Filtro Ativo (dropdown simples)

#### 📱 Interface UX/UI
- Novo CSS para `.multi-select`, `.ms-btn`, `.ms-drop`, `.ms-opt`
- Estilo de checkboxes com acento na cor vermelha do Bradesco
- Animações suaves ao abrir/fechar dropdowns
- Máximo de altura 220px com scroll para listas grandes
- Campo de busca com styling consistente

### 📋 Compatibilidade
- ✅ Backlog view integrado continua funcionando
- ✅ Vistas de Memorandos e Dependências atualizadas
- ✅ Todas as funcionalidades de v1.2.0 preservadas
- ✅ Sem quebra de compatibilidade com dados existentes

### 🐛 Correções
- Melhor tratamento de valores vazios nos filtros
- Prevent click outside para fechar dropdowns automaticamente
- Sincronização correta de estados ao limpar filtros

### 📝 Arquivos Modificados
- `portal_v1/planejamento_v1.3.0.html` - Nova versão do arquivo principal

### 🔄 Migração de v1.2.0
1. Backup automático do arquivo anterior recomendado
2. Filtros antigos (Vertical, Tribo, Cluster, Squad) agora suportam múltiplas seleções
3. Valores armazenados agora com separador `|` para múltiplos itens
4. Função `popDL()` mantida para Quarter (compatibilidade)

---

## v1.2.0 (2026-05-XX)

### Funcionalidades Iniciais
- ✅ Integração do Backlog view
- ✅ Filtros básicos (Vertical, Tribo, Cluster, Squad, Quarter)
- ✅ Views de Memorandos e Dependências
- ✅ Sistema de dados com CSV parsing

---

## v1.1.0 e anteriores
*Histórico de versões anteriores disponível em git log*
