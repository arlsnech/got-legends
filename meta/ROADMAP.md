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

> **O código do guia foi auditado em 2026-07-25 e tem sete defeitos** — dois deles produzem imagem plausível e errada. Ele entra como rascunho de referência, não como entrega. Cada item abaixo marcado **[D-n]** corresponde a um defeito descrito na DEC-026.

**Requisitos de produto**
- [ ] `generateBuildImage` com **Canvas API pura, sem dependência externa** (DEC-021). Nada de `html2canvas`: a imagem é artefato próprio, não foto da tela.
- [ ] Os **três modos espelham os de texto** — Build, Detalhado e Estatístico, mesma regra do `generateBuildText` (DEC-022).
- [ ] **Estatísticas: só as modificadas — mas HP e Determinação sempre**, mesmo no valor base (DEC-022).
- [ ] Header com ícone de classe + nome da build + ícone supremo
- [ ] Coluna esquerda: habilidade + vantagens **com os ícones das vantagens de classe**. *O autor perguntou por estes dois vezes — não os deixe de fora.*
- [ ] Coluna direita: gear com ícones, props, perks
- [ ] Seção de estatísticas em grade de 3 colunas (somente modo Estatístico)
- [ ] **Caixas e formatação por seção**, não texto corrido
- [ ] Assinatura discreta no rodapé
- [ ] Download automático como PNG

**Correções obrigatórias sobre o código do guia**
- [ ] **[D1]** Amuleto pelo item **efetivo** — `getEffectiveCharm(itemId, linkedClass)` no slot `charm`. Sem isso, as propriedades de classe do amuleto Magistral **somem da imagem** sem erro (armadilha 7).
- [ ] **[D2]** **Altura calculada**, em duas passadas: medir o layout, criar o canvas, desenhar. A altura fixa do guia (560 / 820) corta o modo Detalhado no uso comum. *Este item veio da F4 para cá.*
- [ ] **[D3]** `ctx.filter` à mão no SVG de classe, zerado logo depois — e **nunca** no PNG de técnica (armadilhas 3 e 15).
- [ ] **[D4]** Renderizar em **2x** (`canvas.width = IMG_W * 2`, `ctx.scale(2,2)`), coordenadas em unidades lógicas.
- [ ] **[D5]** `toBlob` + `createObjectURL` + `revokeObjectURL`, no lugar de `toDataURL`.
- [ ] **[D6]** Rodapé como último elemento medido, não em posição absoluta.
- [ ] **[D7]** Remover `crossOrigin` (ícones são de mesma origem) e envolver a exportação em `try/catch` com mensagem clara.

**Conferência visual mínima** — nenhum destes é opcional:
- [ ] Build **cheia no modo Detalhado**, com descrições longas: nada cortado no pé da imagem. É o caso que a altura fixa quebrava.
- [ ] Build **vazia**: sem faixa enorme de espaço morto.
- [ ] **Amuleto Magistral com `classBinding`**: as propriedades de classe aparecem na imagem exatamente como na tela.
- [ ] **Tema claro e tema escuro**: ícones e texto legíveis nos dois.
- [ ] **PT-BR e EN**: rótulos, descrições e nome do arquivo.
- [ ] Imagem ampliada a 200%: texto nítido, não borrado.

> **Antes de abrir a Fase 3:** o rascunho está em `meta/legacy/GUIA_CORRECOES_FASE3.md`, e ele é o **último** arquivo de `meta/legacy/`. Ele já sobe no pacote atual. Quando a fase entrar, ele sai da árvore (DEC-025) e a pasta se encerra.

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
