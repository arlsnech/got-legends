# ROADMAP.md — Plano Intencional de Evolução

> Médio e longo prazo vivem AQUI. Tarefas soltas ficam no Backlog do STATUS.

---

## 🟢 F1 — Planejador Core *(concluída)*

**Objetivo:** Ferramenta funcional de planejamento de build com cálculo de stats em tempo real.

**Critério de conclusão:** usuário consegue montar qualquer build das 4 classes, ver todas as stats calculadas, salvar e carregar localmente.

- Classes, habilidades, vantagens I/II/III
- 5 slots de gear com props, perks e restrições de classe
- Motor de cálculo (`computeStats`, CDR, magistrais)
- Saves em localStorage, exportar/importar JSON, código Base64
- Dois layouts (3-col / 2-col), tema escuro/claro
- Ícones SVG e PNG do jogo integrados

---

## 🟢 F2 — Exportação de Texto *(concluída)*

**Objetivo:** Usuário consegue copiar um resumo formatado da build para colar em qualquer chat ou post.

**Critério de conclusão:** 3 modos (Build / Detalhado / Estatístico) funcionando em PT-BR e EN, com cooldowns calculados e stats corretos.

- `generateBuildText` para modos `build`, `detailed`, `stats`
- `ExportPanel` com grupos visuais rotulados
- Código Base64 opcional no final do texto
- HP e DET sempre presentes no modo Estatístico

---

## 🟡 F3 — Exportação de Imagem *(próxima / em curso)*

**Objetivo:** Usuário consegue baixar um PNG visualmente polido da build para compartilhar em redes sociais, Discord, Reddit etc.

**Critério de conclusão:** 3 modos gerando PNGs com ícones, layout em colunas e paleta de cores da classe ativa.

- [ ] `generateBuildImage` com **Canvas API pura, sem dependência externa** (DEC-021). Nada de `html2canvas` ou similar: a imagem é um artefato próprio, não uma foto da tela. Esqueleto de ~470 linhas pronto no `GUIA_CORRECOES_FASE3.md`, pendente de inserção antes do `ExportPanel` e de ligação ao `handleGenImage`.
- [ ] Os **três modos espelham os de texto** — Build, Detalhado e Estatístico, mesmo conteúdo e mesma regra do `generateBuildText` (DEC-022).
- [ ] **Estatísticas: só as modificadas — mas HP e Determinação sempre**, mesmo no valor base. Regra de produto, não detalhe (DEC-022).
- [ ] Header com ícone de classe + nome da build + ícone supremo
- [ ] Coluna esquerda: habilidade + vantagens **com os ícones das vantagens de classe**. *O autor perguntou por estes dois vezes, temendo que fossem esquecidos — não os deixe de fora.*
- [ ] Coluna direita: gear com ícones, props, perks
- [ ] Seção stats em grid 3-col (somente modo Estatístico)
- [ ] **Caixas e formatação por seção**, não texto corrido: o pedido era um layout em colunas que preencha a imagem, não linhas empilhadas
- [ ] Assinatura discreta no rodapé
- [ ] Download automático como PNG

> **Antes de abrir a Fase 3:** o código dela mora no `meta/legacy/GUIA_CORRECOES_FASE3.md`, que está fora do pacote FlatDrop. Remova a linha dele do bloco `# >>> flatdrop-editor` no `.flatdropignore` e regere o pacote — senão a sessão começa sem a peça principal. O `GUIA_COMPLETO_v4.md` **não** é necessário para isso.

---

## 🔵 F4 — Polimento e Mobile *(futuro)*

**Objetivo:** Experiência refinada em mobile e correções de UX baseadas em feedback real de usuários.

- Layout mobile dedicado (1 coluna com tabs entre seções)
- Altura dinâmica do canvas na geração de imagem
- URL compartilhável com build encodada na query string (`?b=eyJ...`)
- Animações de transição suaves entre layouts
- PWA: `manifest.json` + service worker para uso offline

---

## 🔵 F5 — Recursos Avançados *(futuro, sem data)*

**Objetivo:** Expandir a utilidade para jogadores de nível avançado e criadores de conteúdo.

- Modo "comparar builds" side-by-side com diffs em verde/vermelho
- Presets de builds populares/meta curadas
- Undo/Redo (o estado imutável já facilita — basta um array de snapshots)
- QR Code de link compartilhável
- Gerador de tier list de equipamentos por classe

---

## 🚫 Itens descartados desta visão

- **Backend/autenticação** — fora de escopo; o projeto é 100% client-side por design.
- **Tracker de progresso do jogador** — isso é wiki/outra ferramenta.
- **Integração com API do jogo** — não existe API pública do GoT: Legends.
