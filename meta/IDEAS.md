# IDEAS.md — Brainstorm e Visão

> **Segundo cérebro** do projeto. Nunca perde: ideia implementada vai para «Concluídas»; ideia recusada vai para «Descartadas» com o motivo.

---

## 💡 Ideias Ativas — Usuário

### 2026-06 — URL compartilhável com build encodada
Ao invés de copiar um código Base64 separado, o link já teria a build na query string (`?b=eyJ...`). Usuário abre o link e a build carrega automaticamente.

### 2026-06 — Mais opções de layout / temas visuais
Hoje temos dark/light e 2-col/3-col. Possibilidade de adicionar mais layouts (ex: "ultra-wide" 4 colunas) e variantes de tema (ex: tema com paleta do jogo — tons de cinza e dourado samurai).

### 2026-06 — Altura dinâmica do canvas na Fase 3
`generateBuildImage` usa altura fixa (560/820px). Se uma build tiver muitas propriedades com descrição longa, o conteúdo pode ultrapassar. Calcular a altura real antes de criar o canvas.

### 2026-06 — Presets de build (builds populares pré-carregadas)
Seção "Builds populares" com presets curados do meta atual. Usuário clica e carrega a build inteira.

### 2026-06 — Exportar build como link QR Code
Gerar um QR Code da URL compartilhável direto na ferramenta para facilitar compartilhamento mobile.

---

## 🤖 Ideias Ativas — Assistente

### 2026-06-24 — Verificação de completude da build antes de exportar
Antes de gerar texto/imagem, verificar se a build está "completa" (habilidade selecionada, pelo menos 1 item por slot, props configuradas) e avisar o usuário sobre slots vazios no texto gerado.

### 2026-06-24 — Modo "comparar builds"
Mostrar duas builds lado a lado com diferenças destacadas em verde/vermelho. Útil para comparar variantes da mesma build.

### 2026-06-24 — Altura adaptativa das células no StatsPanel
Grupos de stats com hover que expande a descrição do stat (o que ele representa em termos de gameplay).

### 2026-06-24 — Undo/Redo
A arquitetura imutável do `build` state (funções sempre retornam novo objeto) já facilita muito. Um array de snapshots + índice atual habilitaria Ctrl+Z nativo.

### 2026-06-24 — PWA / Offline
Como não há backend, o app funciona offline se instalado como PWA. Adicionar `manifest.json` e service worker básico.

---

## ✅ Concluídas

- **Drawer lateral de saves** — implementado em 1.0.0-beta; substituiu `SavePanel` inline.
- **Ícones SVG de classe nos botões do header** — implementado em 1.0.0-beta.
- **Ícones PNG de técnicas sem filtro CSS** — implementado em 1.0.0-beta (DEC-003).
- **Tema claro** — implementado em 1.0.0-beta com paleta de contraste adequado.
- **HP bar só com bônus** — implementado em 1.0.0-beta; barra aparece só quando HP > 100.
- **Círculos DET dinâmicos** — implementado; só mostra os círculos ativos (FIX-004).
- **Exportação de texto Fase 2** — implementado em 1.0.0-beta; 3 modos, bilíngue, cooldowns calculados.
- **Ícone supremo (CLASS_TECH_FALLBACK) no topo da coluna stats** — `UltimateHeader` implementado.
- **Habilidades lado a lado no modo 2-col** — grid `minmax(160px,1fr)` com `whiteSpace: nowrap`.
- **Botões de export em uma linha com grupos rotulados** — `📋 Texto` e `🖼️ Print`.
- **Código Base64 opcional no texto exportado** — toggle nas configurações.
- **Nome completo dos slots sem emoji** — slotLabel sem emoji; ícone SVG substituiu.
- **Star (★) no final do nome magistral no select** — implementado; não mais na frente.
- **crédito a swiezdo nos créditos** — adicionado no SettingsModal.

---

## 🚫 Descartadas

- **html2canvas para geração de imagem** — descartado porque adiciona ~300KB, tem bugs com elementos fixed/viewport, e o resultado não é customizável. Substituído por Canvas API nativa (DEC-004).
- **React Context para temas** — descartado pela necessidade de `const T = useContext()` em todos os ~15 componentes; T mutável resolve sem overhead (DEC-002).
- **TypeScript** — descartado para manter baixa fricção no desenvolvimento iterativo assistido por IA. Pode ser reconsiderado em v2.
- **Herança de props em magistrais (`...BASE_PROPS`)** — descartado; cada magistral explícito evita bugs sutis (DEC-006).
- **Emoji de classe no select de gear (⚔️ Katana)** — descartado; substituído por ícone SVG.
- **Emoji ✨ e ⭐ nas técnicas** — descartados; ícones PNG do jogo substituem com mais fidelidade visual.
- **Botão de Layout separado no header** — incorporado no SettingsModal (⚙️); header já estava cheio.
- **Barra de HP mostrando os 100 HP base** — descartado; ficava com aspecto de "barra cheia pré-preenchida" o tempo todo. Só bônus é mostrado.

---

## 📌 Feedback para o Kit de Contexto

*(Desvios e melhorias observadas neste projeto que valem levar ao Kit Universal)*

- O `LOG-TEMPLATE.md` poderia ter um campo "Guias entregues" — neste projeto, vários `.md` de guia foram produzidos sem ser logs de sessão, e não há campo natural para rastreá-los.
- A seção "Arquivos Críticos" do `STATUS.md` é muito valiosa; poderia ser padrão no template, não apenas mencionada como opcional.
- Projetos com assistente de IA gerando código precisam de um campo "Pendente de Aplicação" — diferente de "Em Progresso" (trabalho em andamento) e diferente de "Backlog" (não iniciado). O código existe, mas o usuário ainda não aplicou.
- *(2026-07-22)* O `_UPDATE-PROMPT.md` não diz o que fazer quando uma convenção genérica do CEREBRO/INSTRUCOES colide com uma prática já em vigor num projeto em andamento. Deveria dizer explicitamente: **é sugestão, não ordem** — adapte o CEREBRO ao projeto e gere Instruções personalizadas, nunca refatore o projeto para caber no template. (Virou DEC-008.)
- *(2026-07-22)* O prompt de update também não trata o caso de o `INSTRUCOES-DO-PROJETO.md` **não ser um arquivo do repo** — aqui ele vive nas Instruções do Projeto do claude.ai, então não há "vivo" no mount para comparar. O procedimento correto (pegar o template, especializar, respeitar o teto, entregar pronto para colar) deveria estar escrito.
- *(2026-07-22)* O `IDEAS__template-update.md` **não tem a seção «Feedback para o Kit»**, embora o CEREBRO a exija em dois lugares (regra de higiene e tabela de gatilhos). Template incompleto em relação ao próprio comportamento que prescreve.
- *(2026-07-22)* O `LOG-TEMPLATE__template-update.md` continua **sem o campo «Guias entregues»** — feedback já registrado por este projeto e não absorvido em v1.73.
- *(2026-07-22)* O `STATUS__template-update.md` continua **sem a rubrica «Pendente de Aplicação»** — idem. Sugestão concreta: manter `❌ Quebrado` e `⏳ Pendente de Aplicação` como seções distintas, foi o que este projeto adotou.
- *(2026-07-22)* O `GLOSSARY__template-update.md` não prevê seção de **glossário bilíngue de domínio** (aqui: Magistral↔Legendary, Determinação↔Resolve). Em produto multilíngue isso é estrutural, não acessório.
- *(2026-07-22)* O `gitignore__template-update` só cobre lixo de SO/editor e **não traz `node_modules/` nem `dist/`**. Aplicado ao pé da letra por cima de um `.gitignore` de stack, seria regressão grave. Deveria vir marcado no manifesto como **aditivo**, não como substituto.
- *(2026-07-22)* O `CEREBRO__template-update.md` **se contradiz**: a seção «Convenções» pede commits "no imperativo curto em PT-BR" e a seção «Commit pronto ao final» pede Conventional Commits sem acento.
- *(2026-07-22)* Falta ao kit uma classe de artefato para **"guia de aplicação"** (os `GUIA_*.md` deste projeto): não é log, não é doc de contexto, não é spec. O parente próximo é `meta/specs/`, mas o kit não faz essa ponte — e é justamente o formato que deixou a Fase 3 parada desde junho esperando aplicação manual.
