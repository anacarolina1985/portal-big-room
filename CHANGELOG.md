# Bradesco Program Board - Changelog

## v1.4.1 (2026-06-12)

### 🔧 Unificação do engine de validação OKR
- **Novo arquivo `portal_v1/okr-validation.js`** — fonte única do checklist de validação (O1–O5 + 7 critérios por KR), carregado por `okrs.html`, `estrutura.html` e `dashboard.html` via `<script src>`.
- As cópias inline duplicadas (e divergentes) foram removidas dos três módulos. Agora todos aplicam as regras v1.2:
  - ⛔ **OKR sem KRs = score 0% (crítico)**
  - **H✓ Alinhamento hierárquico** squad → tribo (informativo)
  - **Threshold âmbar unificado em 60%** (≥80% verde · ≥60% âmbar · <60% vermelho) — antes estrutura/dashboard usavam 50%
  - 🕐 Badge de timestamp da última aferição do KR (corrigido: `_last_update` agora é propagado para a renderização)
- `planejamento.html` mantém sua versão leve própria (`bkValidateOkr`), específica do Program Board.

### 🧹 Limpeza
- **index.html**: removido o engine herdado dos módulos (views, filtros, organograma, writer, CSV import — código morto na home, que não tem sidebar/views). A home mantém apenas os helpers usados pelos KPIs consolidados. De ~2.960 para ~560 linhas de código (dados embarcados preservados). De quebra, o script de persistência de tema voltou a funcionar (era bloqueado por uma redeclaração de `const g`).
- Removido `const TODAY_MS` (declarado e nunca usado) de index, dashboard, estrutura e okrs.
- Excluído `styles.css` da raiz (não referenciado por nenhuma página).

### 📝 Documentação
- `V1.3.0_FILTROS_MULTISELECAO.md` marcado como histórico (multi-select substituído na v1.4).

---

## v1.4.0 (2026-06)

### 🎨 Luxury Skin
- Novo `portal_v1/luxury-skin.css` compartilhado pelos 5 módulos: visual clean/minimal, tipografia Cormorant Garamond + Inter, tokens de cor refinados, dark mode.

### 🧭 Filtros
- Filtros multi-select da v1.3 **substituídos** por dropdowns customizados com busca (`.cac`) em todos os módulos: Vertical → Tribo → Cluster → Squad (cascata) + Quarter + Ativo.

### 🏛️ Estrutura
- Nova view de **COEs** (Centros de Excelência) com linha de reporte (Vertical/Tribo), COE Lead, missão e validação.
- Views de Tribos/Clusters/Squads/Pessoas com **agrupamento hierárquico recolhível** e coluna de validação detalhada (tooltip com erros/avisos).

### 📅 MBR
- **Exportar PDF** da apresentação e **Snapshot JSON** (exporta/importa todos os dados de uma vez).
- Importação por **pasta completa** de CSVs em todos os módulos (reconhecimento automático pelo nome do arquivo).
- Diagnóstico e limpeza de localStorage.

### 📝 Arquivos
- `planejamento_v1.3.0.html` consolidado em `planejamento.html` (Memorandos QBR + Dependências + Program Board integrado).

---

## v1.3.0 (2026-06-03)

> ⚠️ Os filtros multi-seleção descritos abaixo foram substituídos na v1.4 pelos dropdowns com busca (`.cac`).

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
