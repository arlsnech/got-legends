# spec0011 — Extração retroativa do `GOT_Build_-_TOhno.md` e encerramento da DEC-011

**Data:** 2026-07-24 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner`

**Por que esta spec existe:** quarta e **última** sessão da extração retroativa (DEC-011). O `meta/legacy/GOT_Build_-_TOhno.md` (267 KB, 18 blocos, 10 rodadas) é a conversa que construiu a **interface atual** — layout de 3 colunas, barra lateral de builds, HP e Determinação, ícones do jogo, painel de exportação — e que planejou a Fase 3 sem chegar a executá-la.

**O saldo é diferente das três anteriores.** Aqui quase tudo virou código e o código está certo. O que faltava eram **os requisitos da fase que ainda não começou**: o autor ditou como a imagem da Fase 3 deve ser, perguntou duas vezes sobre um detalhe que temia ver esquecido, e nada disso está no `ROADMAP.md`.

**Esta spec não toca código** → sem `npm run build`; a rede é o `git diff`.

**Regras de execução:**
- Nenhum `--force`, `rebase` ou `reset --hard`.
- A única remoção autorizada é a da Parte 9, e só depois do resto estar no `git diff`.
- Se **uma** âncora que seja não for encontrada exatamente: **PARE e reporte qual falhou.**

---

## Parte 1 — Levantamento

```
git branch --show-current
git status
ls meta/legacy/
```

1. Estamos na `v2-planner`? Se não, **PARE**.
2. Confirme que `meta/legacy/` tem hoje: `GOT_Build.md`, `GOT_Build_-_TOhno.md`, `GUIA_COMPLETO_v4.md`, `GUIA_CORRECOES_FASE3.md`, `README.md`. Reporte se divergir.

---

## Parte 2 — `meta/DECISIONS.md`

**Âncora** (último parágrafo do arquivo, fim da DEC-020):

```
`formatAmmoForClass` hoje é função pura de `(ammoStr, classId, item)` e vive na camada de exibição. Condicionar por técnica exige passar o build (ou as técnicas) até ela e mapear qual técnica libera qual munição — dado que **não existe hoje** em `data.js`. Ou seja: não é ajuste de uma linha, é dado novo mais acoplamento novo. Está no `IDEAS.md` como melhoria, não como defeito.
```

**Substituir por:**

```
`formatAmmoForClass` hoje é função pura de `(ammoStr, classId, item)` e vive na camada de exibição. Condicionar por técnica exige passar o build (ou as técnicas) até ela e mapear qual técnica libera qual munição — dado que **não existe hoje** em `data.js`. Ou seja: não é ajuste de uma linha, é dado novo mais acoplamento novo. Está no `IDEAS.md` como melhoria, não como defeito.

---

## DEC-021 — A Fase 3 gera a imagem com Canvas API pura, sem dependência externa

**Data do registro:** 2026-07-24 · **Status:** aceita, ainda não executada · **Fonte:** `meta/legacy/GOT_Build_-_TOhno.md`, bloco 3

### A decisão
Ao planejar a exportação em imagem, o autor foi direto: *"api do canvas sem dependências externas"*. Isso **descarta** `html2canvas`, `dom-to-image`, `satori` e qualquer biblioteca de captura de DOM. A imagem é desenhada à mão no `<canvas>`, com o mesmo dado que o `generateBuildText` já usa.

### Por que isso importa mais do que parece
Capturar o DOM seria muito mais rápido de escrever — e produziria uma foto da tela, não um artefato próprio. O que o autor pediu é outra coisa: um **layout em colunas com caixas e formatação**, dimensionado para caber num post, não um recorte da interface. Um `html2canvas` entregaria a coisa errada com menos esforço, e é exatamente por isso que a restrição está registrada.

Efeito colateral bem-vindo: o `package.json` continua com duas dependências de runtime (React e ReactDOM) e nenhuma para a Fase 3.

### Consequência
`generateBuildImage` precisa carregar os ícones como `Image()` e esperá-los antes de desenhar — trabalho assíncrono que a versão em texto não tem. O esqueleto já escrito para isso está no `meta/legacy/GUIA_CORRECOES_FASE3.md` (~470 linhas); ver a nota operacional no fim do `ROADMAP.md`.

---

## DEC-022 — Os três modos de exportação e a regra do que cada um mostra

**Data do registro:** 2026-07-24 · **Status:** aceita, em vigor no texto e válida para a imagem · **Fonte:** `GOT_Build_-_TOhno.md`, blocos 1, 5 e 16

### Os três modos
São cumulativos, do mais enxuto ao mais completo — e **os três botões de imagem espelham exatamente os três de texto**, mesmo conteúdo, mesma regra:

| Modo | O que sai |
|---|---|
| **Build** | nomes apenas: habilidade, vantagens, equipamentos, propriedades com valor, perks. Sem descrição. |
| **Detalhado** | tudo do Build **mais** a descrição de cada item, e a recarga já calculada com as propriedades da build. |
| **Estatístico** | tudo do Detalhado **mais** o bloco de estatísticas ao final. |

### A regra que quase se perde num refactor
No bloco de estatísticas, **só aparecem as estatísticas modificadas pela build** — *exceto HP e Determinação, que aparecem sempre*, mesmo em seus valores base. O autor pediu isso explicitamente e repetiu depois: *"sobre aqueles estatísticos que só aparecem quando influenciados, HP e Determinação sempre deverão aparecer ok?!"*

Hoje isso vive como uma condição e um comentário dentro de `generateBuildText`. É uma regra de produto, não um detalhe de implementação: **vale igual para a imagem da Fase 3.**

### Código de compartilhamento
O Base64 vai na **última linha** do texto e é **opcional**, ligado por um interruptor no `SettingsModal`. A razão de ser opcional é de uso, não técnica: o código é longo e nem toda conversa comporta.

---

## DEC-023 — Os modos de 3 e 2 colunas têm estilos independentes, de propósito

**Data do registro:** 2026-07-24 · **Status:** aceita, em vigor · **Fonte:** `GOT_Build_-_TOhno.md`, blocos 11, 13 e 16

### Contexto
As duas disposições **não são a mesma tela em larguras diferentes**. O autor especificou comportamentos opostos para os mesmos elementos:

| | 3 colunas | 2 colunas |
|---|---|---|
| Habilidades de classe | uma embaixo da outra | **lado a lado**, sem quebra de linha no nome |
| Vantagens de classe | uma embaixo da outra, caixas de **largura uniforme** | **lado a lado**, em grade |

### Por que isto é uma decisão e não um detalhe
Levou três rodadas para ficar de pé, e todas as três falharam da mesma maneira: **arrumar um modo quebrava o outro**. Foi o próprio autor quem nomeou a causa — o estilo estava sendo aplicado sem distinguir o modo, quando os dois precisavam de tratamento separado. Daí o `layoutMode` chegar até o `TechRow`.

**Regra que fica:** mexeu no layout de um modo, confira o outro na mesma sessão. É o defeito de repetição mais provável deste arquivo, e a razão de a spec0006 ter um item de conferência só para isso.
```

---

## Parte 3 — `meta/CONTEXT.md`

**Âncora** (item 12 das «Armadilhas Conhecidas», último da lista):

```
12. **CDR de Arma Fantasma não empilha entre as armas** — propriedade de redução de recarga numa AF vale **só para aquela AF**; a mesma propriedade no Amuleto vale para as duas. Em qualquer dos casos o número é exibido **separado por arma**, nunca somado num total. Errar isso foi o defeito mais repetido da fase de origem.
```

**Substituir por:**

```
12. **CDR de Arma Fantasma não empilha entre as armas** — propriedade de redução de recarga numa AF vale **só para aquela AF**; a mesma propriedade no Amuleto vale para as duas. Em qualquer dos casos o número é exibido **separado por arma**, nunca somado num total. Errar isso foi o defeito mais repetido da fase de origem.

13. **3 colunas e 2 colunas não compartilham estilo** — os dois modos pedem comportamentos **opostos** para habilidades e vantagens de classe (empilhadas no 3-col, lado a lado no 2-col). Estilo aplicado sem olhar o `layoutMode` conserta um e quebra o outro — aconteceu três vezes seguidas. Mexeu num, confira o outro **na mesma sessão**. Ver DEC-023.
```

---

## Parte 4 — `meta/GLOSSARY.md`

**Âncora** (na seção «Arquiteturas / módulos»):

```
- **`computeStats(build)`** — função principal de `logic.js` que calcula todas as estatísticas da build. Retorna o objeto `stats`.
```

**Substituir por:**

```
- **`computeStats(build)`** — função principal de `logic.js` que calcula todas as estatísticas da build. Retorna o objeto `stats`.
- **`generateBuildText({ build, stats, lang, buildName, mode, includeShareCode })`** — monta o texto de exportação em um dos três modos (`build`, `detailed`, `stats`). Vive no `App.jsx`. HP e Determinação sempre entram no bloco de estatísticas; o resto só se modificado. Ver DEC-022.
- **`generateBuildImage`** — contrapartida em imagem dos mesmos três modos, **ainda não implementada** (Fase 3). Canvas API pura, sem dependência externa; esqueleto no `meta/legacy/GUIA_CORRECOES_FASE3.md`. Ver DEC-021.
- **`layoutMode`** — `'three-col'` ou `'two-col'`. Precisa descer até o `TechRow`: os dois modos têm estilos independentes de propósito. Ver DEC-023.
```

---

## Parte 5 — `meta/ROADMAP.md`

A Fase 3 é a próxima, e o roteiro dela está incompleto: faltam requisitos que o autor ditou e que só existiam dentro do arquivo agora extraído.

**Âncora** (a lista de itens da seção F3, do primeiro ao último):

```
- [ ] Aplicar correções pendentes do `GUIA_CORRECOES_FASE3.md`
- [ ] `generateBuildImage` com Canvas API (código em guia, pendente de inserção no App.jsx)
- [ ] Header com ícone de classe + nome da build + ícone supremo
- [ ] Coluna esquerda: habilidade + vantagens com ícones
- [ ] Coluna direita: gear com ícones, props, perks
- [ ] Seção stats em grid 3-col (somente modo Estatístico)
- [ ] Assinatura discreta no rodapé
- [ ] Download automático como PNG
```

**Substituir por:**

```
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
```

---

## Parte 6 — `meta/HISTORY.md`

**Âncora** (última linha do arquivo, fim da seção 8):

```
**Publicação:** GitHub Pages exigiu empurrar o `dist/` à mão para a `gh-pages`; o Vercel serviu **página em branco** por caminho-base — daí o `base` controlado por `VITE_BASE_URL` no `vite.config.js` mais o `vercel.json` e o `netlify.toml`; o Netlify funcionou de primeira e virou o canal principal. Uma tentativa de **Cloudflare Pages** ficou inacabada quando a conversa terminou — o último commit da `main` antes da adoção do KCM (`63fb3a6`) adicionou um `_redirects` para ela.
```

**Substituir por:**

```
**Publicação:** GitHub Pages exigiu empurrar o `dist/` à mão para a `gh-pages`; o Vercel serviu **página em branco** por caminho-base — daí o `base` controlado por `VITE_BASE_URL` no `vite.config.js` mais o `vercel.json` e o `netlify.toml`; o Netlify funcionou de primeira e virou o canal principal. Uma tentativa de **Cloudflare Pages** ficou inacabada quando a conversa terminou — o último commit da `main` antes da adoção do KCM (`63fb3a6`) adicionou um `_redirects` para ela.

---

## 9. A fase da interface — de onde vem a tela de hoje

*(Consolidado em 2026-07-24 a partir de `meta/legacy/GOT_Build_-_TOhno.md`, extraído e removido pela spec0011.)*

Se a fase de origem produziu o **dado** e o motor de cálculo, esta produziu a **tela**. Quase tudo que se vê hoje nasceu aqui, e nesta ordem:

1. **O layout de 3 colunas.** A queixa que abriu a conversa foi de ergonomia: com tudo numa coluna só, montar uma build exigia rolar demais e sobrava espaço lateral sem uso. Daí técnicas à esquerda, equipamentos ao centro, estatísticas à direita, cada coluna com rolagem própria. O modo de 2 colunas veio junto, e a insistência de que os dois se comportassem de forma **independente** virou a DEC-023.
2. **A barra lateral de builds salvas.** Antes, cada build salva empurrava o resto da tela para baixo. A solução pedida foi uma gaveta sobreposta, aberta por uma aba tipo marcador de livro — a `BookmarkTab` + `SaveDrawer` de hoje. Junto vieram detalhes que continuam valendo: lixeira em vez de "x" para limpar tudo (um "x" parece "fechar"), e o aviso de "salvo" ocupando **altura fixa**, para não deslocar nada ao aparecer.
3. **HP e Determinação como no jogo.** Barra vermelha com os círculos de Determinação por cima. Duas regras saíram de tentativa e erro: a barra só cresce com bônus real — nada de "preenchimento escuro" prometendo espaço vazio — e o número acompanha o crescimento em vez de ser encoberto. As constantes `HP_BAR_WIDTH`, `HP_BASE_WIDTH` e afins existem porque o autor quis poder ajustar cada proporção sem mexer nas outras.
4. **Os ícones do jogo.** Chegaram por **swiezdo**, que compartilhou a coleção — o crédito está no `SettingsModal` desde então. Aqui nasceu uma das armadilhas mais citadas do projeto: os SVG de técnica saíam brancos por causa do filtro de tema, e a solução foi PNG **sem filtro nenhum**. O ícone da habilidade suprema, que não é escolha do jogador, virou cabeçalho fixo no topo da coluna de estatísticas — e substituiu o título "📊 Estatísticas", que deixou de fazer falta.
5. **O painel de exportação.** Seis botões numa linha, em dois quadros nomeados — Texto e Print — com espaço entre eles para não se apertar sem querer. As dicas flutuantes precisaram aprender a virar de lado: nas bordas da tela, apareciam cortadas.

**A Fase 2 foi entregue aqui; a Fase 3, planejada.** O `generateBuildText` funciona desde então. O `generateBuildImage` foi arquitetado e escrito num guia — as ~470 linhas de Canvas do `GUIA_CORRECOES_FASE3.md` — e nunca inserido no `App.jsx`. É o que a Fase 3 do `ROADMAP.md` retoma.

**Rastro de defeito, para reconhecer se voltar:** a exportação em texto saiu com `undefined` no bloco de estatísticas na primeira versão (virou FIX-005), e as caixas de vantagem encolhiam ao ter valor selecionado, ficando de tamanho diferente das de propriedade. Os dois são sintomas da mesma época — arquivos grandes reescritos inteiros, o problema que a DEC-007 existe para evitar.
```

---

## Parte 7 — `meta/STATUS.md`

### 7.1 — Última sessão

**Âncora** (último parágrafo do arquivo):

```
**Próximo passo:** extração 4/4 — `meta/legacy/GOT_Build_-_TOhno.md` (267 KB), o último e o maior. A linha dele já saiu do `.flatdropignore` nesta spec. Com as specs e os `src/v*` fora do pacote, ele cabe com folga.
```

**Substituir por:**

```
**Próximo passo:** extração 4/4 — `meta/legacy/GOT_Build_-_TOhno.md` (267 KB), o último e o maior. A linha dele já saiu do `.flatdropignore` nesta spec. Com as specs e os `src/v*` fora do pacote, ele cabe com folga.

---

**2026-07-24 — extração retroativa 4/4: `GOT_Build_-_TOhno.md`. A DEC-011 está cumprida.**

A conversa que construiu a interface atual: 18 blocos, 10 rodadas. **Nenhum pedido ficou por implementar** — layout de 3 e 2 colunas, gaveta de builds, HP e Determinação, ícones do jogo, painel de exportação com seis botões, dicas que viram nas bordas, modal de configurações com o interruptor do código Base64: tudo conferido no `App.jsx` de hoje e tudo no lugar.

O saldo veio de outro lugar: **os requisitos da fase que ainda não começou.**

- **DEC-021** — a Fase 3 usa **Canvas API pura, sem dependência externa**. Ditado pelo autor e nunca registrado. Importa porque `html2canvas` seria mais fácil e entregaria a coisa errada: uma foto da tela, não o layout em colunas que foi pedido.
- **DEC-022** — os três modos de exportação e a regra que os rege: só as estatísticas modificadas, **exceto HP e Determinação, que aparecem sempre**. Hoje isso vive como um comentário dentro do `generateBuildText`. É regra de produto e vale igual para a imagem.
- **DEC-023** — 3 colunas e 2 colunas têm estilos **independentes de propósito**. Levou três rodadas, e as três falharam do mesmo jeito: arrumar um modo quebrava o outro. Virou a armadilha 13 do `CONTEXT.md`.
- O **`ROADMAP.md` da Fase 3 foi completado** com o que faltava, incluindo os **ícones das vantagens de classe** — o autor perguntou por eles duas vezes, temendo que fossem esquecidos — e a nota operacional de reincluir o `GUIA_CORRECOES_FASE3.md` no mount antes de abrir a fase. Saiu de lá o item obsoleto de "aplicar as correções pendentes", que já não existiam.
- `meta/HISTORY.md` ganhou a seção 9, com a genealogia da tela e o crédito a **swiezdo** pelos ícones.

**Segunda regressão provável, da mesma família da anterior:** o painel de estatísticas tinha um seletor **"Só alteradas"** — aparece no dump da v1.1 e não existe no `App.jsx` de hoje, que mostra tudo e apenas destaca o que mudou. Junto com os botões de 🎲 granulares, são dois recursos que sumiram sem registro na época dos arquivos reescritos por inteiro. Ambos estão no `IDEAS.md`; nenhum é bug até o autor dizer que não foi de propósito.

### A extração retroativa terminou

Quatro conversas, quatro sessões, saldo final: **FIX-007, FIX-008, FIX-009** e **DEC-013 a DEC-023**, mais nove armadilhas novas no `CONTEXT.md`, duas seções no `HISTORY.md` e uma correção de código. Nenhum pedido em aberto foi encontrado — o que estava perdido era **registro**, não trabalho.

`meta/legacy/` fica com o `GOT_Build.md` (índice, já lido) e os dois guias, que não são conversa e continuam servindo: o `GUIA_CORRECOES_FASE3.md` guarda o código da Fase 3.

**Próximo passo: Fase 3 (`generateBuildImage`)** — agora com o roteiro completo no `ROADMAP.md`. Antes de abrir a sessão, reinclua `meta/legacy/GUIA_CORRECOES_FASE3.md` no `.flatdropignore`.
```

---

## Parte 8 — `meta/IDEAS.md`

### 8.1 — Fila de leitura

**Âncora:**

```
| `GOT_Build_-_TOhno.md` | 267 KB | ⏳ próximo — talvez 2 sessões |
```

**Substituir por:**

```
| `GOT_Build_-_TOhno.md` | 267 KB | ✅ extraído em 2026-07-24 (spec0011) — arquivo removido · **fila encerrada** |
```

### 8.2 — O que o TOhno rendeu, e o fechamento do método

**Âncora** (fim da seção acrescentada pela spec0010):

```
### 2026-07-23 — Flecha Perfurante condicionada à técnica
```

**Substituir por** (o conteúdo novo entra **antes** dessa linha):

```
### Já extraído do `GOT_Build_-_TOhno.md` (2026-07-24) — **não reabrir**
Nenhum pedido ficou aberto. Viraram DEC-021 (Canvas puro na Fase 3), DEC-022 (os três modos e a regra das estatísticas), DEC-023 (estilos independentes por layout), a armadilha 13 do `CONTEXT.md`, a seção 9 do `HISTORY.md` e o roteiro completo da Fase 3 no `ROADMAP.md`. Já conferido como **atendido** no código de hoje: layout 3-col e 2-col · `BookmarkTab` + `SaveDrawer` com lixeira · aviso de "salvo" com altura fixa · `HpResolveBar` (barra só com bônus, número empurrado) · `UltimateHeader` no lugar do título de estatísticas · seis botões em dois quadros nomeados · dicas com `flipX`/`flipY` nas bordas · `SettingsModal` com layout, créditos e interruptor do Base64 · ícones SVG com filtro por tema e PNG de técnica sem filtro · estrela ★ no fim do nome do Magistral · contador de Magistrais por extenso nos dois idiomas.

### Fechamento do método de extração (DEC-011) — 2026-07-24
Quatro arquivos, quatro sessões. **Nenhum deles continha pedido por implementar.** O que os quatro continham era registro que nunca foi feito: três FIX, onze DEC, nove armadilhas e duas seções de histórico. Uma única linha de código mudou em todo o processo (FIX-009).

As quatro perguntas que renderam, na ordem em que apareceram:
1. *Isso está no código?* — quase sempre sim. Sozinha, acha pouco.
2. *Isso está **registrado**?* — pegou o grosso das decisões.
3. *O que o código faz que nenhum `meta/` menciona?* — pegou as munições por classe, uma funcionalidade inteira invisível.
4. *O que a ferramenta já teve e não tem mais?* — pegou as duas regressões prováveis. Só funciona onde há dumps de tela.

**Se um dia houver material antigo de novo, comece pela 3 e pela 4.** As duas primeiras são as intuitivas e as menos produtivas.

### 2026-07-24 — Seletor "Só alteradas" no painel de estatísticas *(possível regressão)*
O dump da v1.1 mostra um seletor **"Só alteradas"** acima da tabela de estatísticas, e o `App.jsx` de hoje não tem: `StatsPanel` mostra tudo e apenas destaca o que difere da base (`changed = s => s.value !== s.base`). O pedido original é do início do projeto — *"um botão (checkbox) para selecionar se quer ou não ver só as informações da tabela que estão sendo influenciadas pela build"*. Mesma família do sumiço dos botões de 🎲 granulares, e mesma ressalva: **pode ter sido simplificação deliberada.** Perguntar antes de reimplementar. Se for reimplementar, a regra da DEC-022 vale aqui também — HP e Determinação continuam aparecendo com o filtro ligado.

### 2026-07-23 — Flecha Perfurante condicionada à técnica
```

---

## Parte 9 — `.flatdropignore` e remoção do arquivo

> Arquivo com quebras de linha **CRLF**. Preserve-as.

### 9.1 — Corrigir a orientação do `!`, de novo

A linha abaixo repete o erro que a spec0008 já corrigiu para o `meta/legacy/` — agora aplicado ao `meta/specs/`. A negação não reinclui arquivo cujo diretório-pai está excluído, então a instrução não funciona como está escrita.

**Âncora:**

```
# (Para estudar uma spec no Projeto, reinclua com !meta/specs/<arquivo>.)
```

**Substituir por:**

```
# (Para estudar uma spec no Projeto, comente a linha abaixo — "!meta/specs/<arquivo>"
#  NAO funciona: a sintaxe .gitignore nao reinclui arquivo de diretorio-pai excluido.)
```

### 9.2 — Devolver o TOhno ao bloco

Dentro do bloco `# >>> flatdrop-editor`, **acrescente de volta** a linha, em ordem alfabética entre as existentes:

```
meta/legacy/GOT_Build_-_TOhno.md
```

Ela sai da árvore na Parte 9.3, mas a linha volta ao bloco para o caso de o arquivo ser recuperado do histórico algum dia. Ao final desta spec o bloco deve listar: `logs/`, `INSTRUCOES-DO-PROJETO.md`, `meta/legacy/GOT_Build.md`, `meta/legacy/GOT_Build_-_TOhno.md`, `meta/legacy/GUIA_COMPLETO_v4.md`, `meta/legacy/GUIA_CORRECOES_FASE3.md`, `meta/legacy/README.md`.

### 9.3 — Remover o arquivo extraído

**Só depois de as Partes 2 a 8 aparecerem no `git diff`.**

```
git rm meta/legacy/GOT_Build_-_TOhno.md
```

---

## Parte 10 — `meta/legacy/README.md`

O arquivo descreve o conteúdo da pasta e ficou desatualizado: quatro das cinco conversas já não existem.

**Instrução** (sem âncora exata — o executor deve ler o arquivo e ajustar): atualize a lista de conteúdo para refletir o estado final da pasta — restam `GOT_Build.md` (índice, lido em 2026-07-22), `GUIA_COMPLETO_v4.md` e `GUIA_CORRECOES_FASE3.md`. Acrescente uma nota de que as quatro conversas foram extraídas pelas specs 0008 a 0011 entre 2026-07-23 e 2026-07-24, seguem recuperáveis pelo histórico do Git, e que **o `GUIA_CORRECOES_FASE3.md` não é material extraído — é insumo ativo da Fase 3.**

Se o arquivo não existir, **reporte e siga** sem criá-lo.

---

## Parte 11 — `logs/2026-07-24.md`

**Crie** o arquivo com este conteúdo:

```markdown
# Log — 2026-07-24

## Sessão 1 — Extração retroativa 4/4: `GOT_Build_-_TOhno.md` (encerramento da DEC-011)

### Objetivo da sessão
Extrair a última e maior das conversas antigas e encerrar o processo da DEC-011.

### Feito
- Lido `meta/legacy/GOT_Build_-_TOhno.md` (18 blocos, 10 rodadas, 267 KB), com foco nos blocos de prompt. Blocos 13/14 e 16/17 são duplicatas — o mesmo texto colado duas vezes.
- Conferidos no `App.jsx` de hoje: `Tooltip` com `flipX`/`flipY`, `SettingsModal` e `includeShareCode`, os seis botões em dois quadros, `generateBuildText` com HP e DET sempre presentes, `layoutMode` chegando ao `TechRow`, crédito a swiezdo, `handleGenImage` como `TODO Fase 3`.
- Confirmado que **nenhum** pedido do arquivo ficou por implementar.
- Encontrada a segunda regressão provável: o seletor "Só alteradas" do painel de estatísticas.
- Entregue a `spec0011`.

### Specs entregues / aplicadas
- `260724-spec0011-extracao-tohno.md` — registra DEC-021 a DEC-023; armadilha 13 no CONTEXT; quatro termos no GLOSSARY; completa o roteiro da Fase 3 no ROADMAP e remove dele o item obsoleto; seção 9 no HISTORY; fechamento da extração no STATUS e no IDEAS; corrige a orientação do `!` no `.flatdropignore`; atualiza o `meta/legacy/README.md`; remove o arquivo extraído.

### Decisões
- **DEC-021** — Fase 3 com Canvas API pura, sem dependência externa.
- **DEC-022** — os três modos de exportação e a regra "só as modificadas, exceto HP e Determinação".
- **DEC-023** — estilos independentes entre 3 e 2 colunas.

### Bugs
- Nenhum novo. Uma possível regressão registrada no IDEAS, não classificada como bug até o autor confirmar.

### Aprendizados / armadilhas
- **Arrumar um modo de layout quebra o outro** — três rodadas seguidas na fase da interface. Virou armadilha 13.
- **Requisito ditado e nunca registrado é a forma mais cara de perda**: a Fase 3 estava a ponto de ser executada com um roteiro que não mencionava a restrição de "sem dependência externa" nem os ícones das vantagens de classe.
- **Fechamento do método:** as perguntas produtivas na extração foram "o que o código faz que nenhum `meta/` menciona?" e "o que a ferramenta já teve e não tem mais?" — não as duas intuitivas.

### Onde parei
Extração retroativa **encerrada**. `meta/legacy/` fica só com o índice e os dois guias. Nenhuma mudança de código nesta sessão.

### Próximos passos
1. **Fase 3 (`generateBuildImage`)** — roteiro completo no `ROADMAP.md`. Reincluir o `GUIA_CORRECOES_FASE3.md` no mount antes de abrir a sessão.
2. Perguntar ao autor se o sumiço dos 🎲 granulares e do seletor "Só alteradas" foi intencional.
3. Backlog: código morto do vínculo de classe, cópias soltas de `GUIA_COMPLETO*.md` fora do repo, `.claude/launch.json`.
```

---

## Parte 12 — Fechamento

Rode `git diff`. Nenhum arquivo de `src/` deve aparecer — se aparecer, **PARE**.

```
git add meta/DECISIONS.md meta/CONTEXT.md meta/GLOSSARY.md meta/ROADMAP.md meta/HISTORY.md meta/STATUS.md meta/IDEAS.md meta/legacy/README.md .flatdropignore logs/2026-07-24.md meta/specs/260724-spec0011-extracao-tohno.md
git commit -m "docs(meta): extrai o TOhno, registra DEC-021 a DEC-023 e encerra a extracao retroativa"
git push
```

A remoção do `meta/legacy/GOT_Build_-_TOhno.md` entra pelo `git rm` da Parte 9.3.
