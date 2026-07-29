# spec0013 — Auditoria dos guias legados, plano refinado da Fase 3 e encerramento do `meta/legacy/`

**Data:** 2026-07-25 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner`

**Por que esta spec existe:** os três insumos subiram ao mount e foram lidos. A diretriz do autor é clara — *estudar os guias e depois removê-los; o conteúdo vai para `meta/`, `specs/` e para os scripts.* Esta spec faz a parte de estudo e registro, remove dois dos três arquivos, e converte o código da Fase 3 de "guia a aplicar" em **plano de engenharia auditado**.

**Os três veredictos, em uma linha cada:**
- `GOT_Build.md` → **subconjunto estrito do TOhno**, já extraído pela spec0011. Nada novo. Sai.
- `GUIA_COMPLETO_v4.md` → **superado inteiro** pelo outro guia. Uma única coisa dele merecia sobreviver, e vai para o `CONTEXT.md`. Sai.
- `GUIA_CORRECOES_FASE3.md` → é o mais recente e tem o código da Fase 3 — **mas o código tem sete defeitos**, dois deles capazes de estragar a imagem em silêncio. Fica **mais uma sessão**, e morre quando a Fase 3 entrar.

**Esta spec não toca código** → sem `npm run build`; a rede é o `git diff`.

**Regras de execução:**
- Nenhum `--force`, `rebase` ou `reset --hard`.
- As remoções da Parte 9 só depois de o resto estar no `git diff`.
- Se **uma** âncora que seja não for encontrada exatamente: **PARE e reporte qual falhou.**

---

## Parte 1 — Levantamento

```
git branch --show-current
git status
ls meta/legacy/
```

1. Estamos na `v2-planner`? Se não, **PARE**.
2. `meta/legacy/` deve ter quatro arquivos: `GOT_Build.md`, `GUIA_COMPLETO_v4.md`, `GUIA_CORRECOES_FASE3.md`, `README.md`. Reporte se divergir.

---

## Parte 2 — `meta/DECISIONS.md`

**Âncora** (último parágrafo do arquivo, fim da DEC-023):

```
**Regra que fica:** mexeu no layout de um modo, confira o outro na mesma sessão. É o defeito de repetição mais provável deste arquivo, e a razão de a spec0006 ter um item de conferência só para isso.
```

**Substituir por:**

```
**Regra que fica:** mexeu no layout de um modo, confira o outro na mesma sessão. É o defeito de repetição mais provável deste arquivo, e a razão de a spec0006 ter um item de conferência só para isso.

---

## DEC-024 — Três recursos simplificados de propósito: não são regressão

**Data:** 2026-07-25 · **Status:** aceita · **Fonte:** respostas do autor às perguntas abertas desde a spec0010

A extração retroativa encontrou dois recursos que existiram e sumiram, e uma pergunta antiga sem desfecho. Os três foram levados ao autor em vez de reimplementados por suposição. As respostas:

### 1. Botões de 🎲 granulares (`Tudo` / `Classe` / `Gear`) — removidos por darem problema
Existiram na v1.1. **Foram tirados porque davam problema**, sobrando o 🎲 global. O autor registra que a versão simplificada **agradou os usuários**. Não é regressão: é simplificação que funcionou. A ideia de reintroduzir opções mais específicas — aleatório por equipamento, por propriedade, por valor — continua no `IDEAS.md` como possibilidade, **não** como conserto pendente.

### 2. Seletor "Só alteradas" no painel de estatísticas — removido, e sem utilidade na tela
Mesma origem: dava problema. A avaliação do autor é que o recurso era inútil, e ela se sustenta. **A utilidade de um filtro é proporcional à escassez de espaço**, e na tela não há escassez: a tabela rola de graça, e o destaque visual (`s.value !== s.base`) já responde "o que a minha build muda" sem esconder nada.

Mas o **conceito** não morreu — mudou de lugar. Na imagem da Fase 3 o espaço é fixo e caro, e ali a regra é obrigatória: só as estatísticas modificadas entram, com HP e Determinação sempre presentes (DEC-022). O filtro vive onde o espaço é escasso; some onde é abundante.

### 3. Modo Estatístico — **decisão adiada de propósito**, e há uma data para ela
O autor cogitou removê-lo nos prompts antigos e hoje também o percebe como pouco útil. Não foi removido nem confirmado, e o adiamento é deliberado: **a informação que decide chega na Fase 3.**

O raciocínio, para quem retomar: como **texto**, o modo é fraco — uma tabela colada em texto puro num Discord ou Reddit vira ruído, e é justamente esse formato que o autor experimentou. Como **imagem**, é o oposto: grade é exatamente o que imagem faz bem, e a tabela de estatísticas calculada é o diferencial declarado do projeto (`HISTORY.md`, seção 8 — a coisa que nenhum outro planejador faz). O mesmo conteúdo pode ser inútil num meio e ser o principal no outro.

Então: **nada é removido agora.** Quando a Fase 3 entregar a versão em imagem, o autor compara as duas lado a lado e decide — inclusive a hipótese de manter só o botão de imagem do modo Estatístico. Custo de manter até lá: zero, porque o código já existe e funciona desde a FIX-005.

### O que os três têm em comum
Nenhum foi encontrado como defeito; todos vieram da pergunta *"o que a ferramenta já teve e não tem mais?"*. **Recurso ausente não é recurso perdido.** A extração registrou os três como "possível regressão" e fez certo em não os reimplementar — a resposta do autor mudou a classificação de dois deles em uma frase, e uma reimplementação teria trazido de volta os problemas que os tiraram.

---

## DEC-025 — Guia legado não vive no repositório: é estudado, absorvido e removido

**Data:** 2026-07-25 · **Status:** aceita · **Fonte:** diretriz do autor + comparação dos dois guias

### A diretriz
Guias de aplicação antigos **não são estrutura do projeto**. Usá-los como estão é ruim de duas maneiras — um estava superado (regressão) e o outro tem defeitos (ver DEC-026). O destino correto de um guia é: estudar, levar o conteúdo para `meta/`, `meta/specs/` e para os scripts, e então **remover**. O Git preserva o corpo; os `meta/` preservam o sentido.

Isso completa a DEC-012, que resolveu *não perder* o material legado. Esta resolve o que fazer **depois** de ele ter servido: material legado é insumo, não acervo.

### A comparação — qual guia era o mais recente
| | `GUIA_COMPLETO_v4.md` | `GUIA_CORRECOES_FASE3.md` |
|---|---|---|
| Origem | rodada **v8** do `TOhno` | rodada **v10**, a última |
| Correções | 6 (barra de HP, largura da coluna, TechRow, habilidades sem quebra, espaçamento) | 4 — **as que consertaram os defeitos das 6 anteriores** |
| Fase 2 | código completo | só a correção dos `undefined` |
| Fase 3 | **esqueleto** | **código completo, ~470 linhas** |

O segundo é o mais novo em todos os eixos: suas quatro correções são o *follow-up* das seis do primeiro, e onde um tem esqueleto o outro tem implementação. **Codar a Fase 3 a partir do `GUIA_COMPLETO_v4.md` teria sido regressão dupla** — esqueleto no lugar de código, e correções antigas no lugar das novas.

### O que sobreviveu do guia superado
Uma coisa só, e não é código: a localização das larguras de coluna (`gridTemplateColumns`, no bloco `ÁREA DE 3/2 COLUNAS`), conferida em 2026-07-25 como ainda exata. Foi para o `CONTEXT.md`, junto da armadilha 13, que é sobre os mesmos dois modos.

Todo o resto já estava aplicado no código e registrado nos `meta/` — as seis correções, a Fase 2 inteira, e o esqueleto da Fase 3 que o guia mais novo substitui.

### `GOT_Build.md` — verificação que dispensou uma sessão
A spec0012 recomendou re-extraí-lo com o método da DEC-011, sob a suspeita de que a leitura de 2026-07-22 tivesse sido rasa. **A suspeita foi verificada e é falsa.** Os sete prompts do arquivo foram comparados um a um com os do `GOT_Build_-_TOhno.md`: são **os mesmos prompts, sem as respostas** — o arquivo é a exportação "só prompts" da mesma conversa, e ainda por cima sem o bloco de relatório de erro. É **subconjunto estrito** de um arquivo já extraído por inteiro pela spec0011, com mais contexto.

Não havia o que extrair. A verificação custou minutos; a re-extração teria custado uma sessão.

**Regra que fica:** antes de agendar uma releitura de material legado, **compare-o com o que já foi lido.** Arquivos exportados da mesma origem se repetem, e a suspeita de leitura rasa é barata de testar e cara de assumir.

---

## DEC-026 — O código da Fase 3 no guia é ponto de partida, não entrega

**Data:** 2026-07-25 · **Status:** aceita, orienta a execução da Fase 3

### Por que esta decisão existe
O `GUIA_CORRECOES_FASE3.md` traz ~470 linhas prontas de `generateBuildImage`. A tentação é aplicá-las e declarar a fase feita. **A auditoria linha a linha encontrou sete defeitos** — e os dois piores não quebram nada visivelmente: produzem uma imagem plausível e errada, que é a pior falha possível num recurso cujo propósito é ser compartilhado publicamente.

A decisão: o guia entra como **rascunho de referência**. A arquitetura de desenho é refeita, e cada defeito abaixo é corrigido antes de a fase ser considerada pronta.

### Os sete defeitos

**D1 — O amuleto é lido do `GEAR` cru.** No laço de desenho dos equipamentos, o código faz `getItem(slotState.itemId)` para os cinco slots, inclusive `charm`, e depois procura as propriedades escolhidas em `item.props`. Para um amuleto Magistral com `classBinding`, as props e perks exclusivos de classe **não existem** no item cru: a busca falha, o `if (!propDef) continue` engole, e a imagem sai **sem as propriedades de classe** — as mesmas que o usuário está vendo na tela naquele instante. É a armadilha 7 acontecendo dentro do recurso novo. **Correção:** usar `getEffectiveCharm(itemId, linkedClass)` para o slot `charm`, como o `App.jsx` já faz.

**D2 — Altura fixa, e calibrada ao contrário.** `IMG_H = mode === 'stats' ? 820 : 560`. Não há medição do conteúdo. O modo **Detalhado** desenha a descrição de cada propriedade e de cada vantagem com quebra de linha — até vinte parágrafos na coluna direita — e recebe a altura **menor** das duas. Ou seja: o modo mais alto do sistema é o que tem menos espaço, e o corte não é caso extremo, é o caso comum. O próprio guia admite ("o canvas pode ficar maior que o conteúdo... no futuro pode-se calcular dinamicamente") e o `ROADMAP.md` já tinha "altura dinâmica" empurrado para a F4. **Correção:** duas passadas — medir e depois desenhar (ver arquitetura abaixo). Isso deixa de ser item de F4 e vira requisito de F3.

**D3 — Ícone de classe fica invisível.** Na tela, os SVG de classe são branqueados por CSS (`iconFilter: 'brightness(0) invert(1)'`). **`ctx.drawImage` não herda filtro CSS.** O ícone entra no canvas com a cor original — escura — sobre o fundo `#07080f`. **Correção:** aplicar `ctx.filter` antes de desenhar o SVG de classe e zerar (`ctx.filter = 'none'`) logo depois. E aqui vale a armadilha 3 sem nenhuma alteração: **filtro em PNG de técnica vira retângulo sólido** — a mesma regra que existe na UI passa a existir dentro do canvas.

**D4 — Sem `devicePixelRatio`.** O canvas é 900 px e o texto varia de 9 a 18 px. Numa tela retina, ou em qualquer visualizador que amplie, o resultado sai borrado — num recurso cujo único propósito é ser postado e ampliado. **Correção:** desenhar em escala 2x (`canvas.width = IMG_W * 2`, `ctx.scale(2, 2)`) e manter todas as coordenadas do layout em unidades lógicas.

**D5 — `toDataURL` em vez de `toBlob`.** Um PNG de 1800×1600 vira uma string base64 de vários megabytes, atribuída ao `href` de uma âncora. **Correção:** `canvas.toBlob()` + `URL.createObjectURL()`, com `URL.revokeObjectURL()` depois do clique.

**D6 — Rodapé em posição absoluta.** A assinatura é desenhada em `IMG_H - 10`. Com altura fixa e conteúdo transbordando, ela cai **por cima** do conteúdo. Resolve-se junto com o D2: o rodapé passa a ser o último elemento medido.

**D7 — O diagnóstico de CORS do guia está errado, e importa.** A nota técnica afirma que, sem headers CORS, "o `drawImage` lança `SecurityError`" e "os ícones ficam `null`, silencioso pelo `onError`". Nenhuma das duas coisas é verdade: `drawImage` não lança por contaminação — quem lança é a **exportação** (`toDataURL` / `toBlob`) —, e `onerror` não captura isso, porque a imagem carregou normalmente. O efeito real de um problema de origem seria **a exportação inteira falhar no último passo**, não uma degradação suave. Como os ícones são servidos pelo próprio Vite (mesma origem), o `crossOrigin = 'anonymous'` é desnecessário. **Correção:** remover o `crossOrigin` e envolver a exportação em `try/catch` com mensagem clara, em vez de confiar numa degradação que não existe.

### Arquitetura decidida — medir, depois desenhar
As duas passadas usam **o mesmo código de layout**, com um interruptor: na primeira, as funções de escrita apenas acumulam altura; na segunda, escrevem de fato. É o que torna o D2 e o D6 solucionáveis sem manter duas cópias do layout, que divergiriam.

A altura final é `max(altura da coluna esquerda, altura da coluna direita) + header + rodapé`, e o canvas é criado só depois disso.

### O que continua valendo do guia — não jogue fora
A auditoria confirmou como corretos: a assinatura `getStatGroups(stats, classId, lang)`; as chaves `stats.maxHP` e `stats.maxResolve`; a escolha de `formatStatValue(valor, unidade)` para as propriedades (`0.12 → "+12%"`); todas as chaves de paleta lidas de `T`, inclusive `T.cls`; o carregamento em paralelo dos ícones com `Promise.all`; a resolução de `null` no `onerror` para que um ícone ausente não derrube o desenho; e a lista de ícones por elemento, incluindo os das vantagens de classe, que era a preocupação registrada no `ROADMAP.md`.

O layout em duas colunas com faixa de estatísticas ao pé também fica: é o que o autor pediu desde o primeiro prompt.
```

---

## Parte 3 — `meta/CONTEXT.md`

**Âncora** (fim da armadilha 14, última da lista):

```
14. **`getAvailableProps` e `getAvailablePerks` resolvem o item por `id`** — e por isso **não servem para amuleto com `classBinding`**: devolvem o item cru do `GEAR`, sem os props e perks de classe, e sem erro. É a armadilha 7 disfarçada de utilitário. O `App.jsx` filtra inline justamente para poder passar o item **efetivo**. Nenhum consumidor as usa hoje (verificado em 2026-07-25); antes de usar uma delas em código novo — inclusive na Fase 3 — troque a assinatura para receber o item, não o id.
```

**Substituir por:**

```
14. **`getAvailableProps` e `getAvailablePerks` resolvem o item por `id`** — e por isso **não servem para amuleto com `classBinding`**: devolvem o item cru do `GEAR`, sem os props e perks de classe, e sem erro. É a armadilha 7 disfarçada de utilitário. O `App.jsx` filtra inline justamente para poder passar o item **efetivo**. Nenhum consumidor as usa hoje (verificado em 2026-07-25); antes de usar uma delas em código novo — inclusive na Fase 3 — troque a assinatura para receber o item, não o id.

15. **O canvas não herda filtro CSS.** Na tela, os SVG de classe ficam brancos por `iconFilter: 'brightness(0) invert(1)'`. `ctx.drawImage` ignora isso: o ícone entra com a cor original e some no fundo escuro. Quem desenhar ícone no canvas precisa aplicar `ctx.filter` à mão e zerá-lo depois — **e nunca no PNG de técnica**, onde o filtro vira retângulo sólido (armadilha 3). A regra da UI vale igual dentro do canvas. Ver DEC-026, defeito D3.

### Onde ficam as larguras das colunas

Numa linha só, no `return` do `App`, dentro do bloco marcado `{/* ══ ÁREA DE 3/2 COLUNAS ══ */}`. Busque por `gridTemplateColumns`:

```js
gridTemplateColumns: layoutMode === 'three-col'
  ? '300px 1fr 340px'   // técnicas | equipamentos | estatísticas
  : '1fr 360px',
```

Valores conferidos em 2026-07-25. Alterar a coluna de técnicas mexe com a armadilha 13 — confira **os dois modos** na mesma sessão.
```

---

## Parte 4 — `meta/ROADMAP.md`

A Fase 3 sai de "aplicar o guia" e vira "executar o plano auditado". A altura dinâmica **sobe da F4 para a F3** — a auditoria mostrou que sem ela o modo Detalhado corta conteúdo rotineiramente.

**Âncora** (a lista de itens da F3 mais a nota final, do primeiro item ao fim do bloco de citação):

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

**Substituir por:**

```
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
```

---

## Parte 5 — `meta/STATUS.md`

**Âncora** (últimas duas linhas do arquivo):

```
- `README.md` — descreve a pasta; não é material de extração.

**Próximo passo:** sessão de preparação da Fase 3 — extrair o `GOT_Build.md` e comparar os dois guias. O `.flatdropignore` já liberou os três nesta spec; basta regerar o pacote.
```

**Substituir por:**

```
- `README.md` — descreve a pasta; não é material de extração.

**Próximo passo:** sessão de preparação da Fase 3 — extrair o `GOT_Build.md` e comparar os dois guias. O `.flatdropignore` já liberou os três nesta spec; basta regerar o pacote.

---

**2026-07-25 (2) — auditoria dos guias legados e plano refinado da Fase 3.**

Os três insumos subiram e foram lidos. A diretriz do autor fechou a questão de fundo: **guia legado não é estrutura do projeto** — estuda-se, o conteúdo vai para os `meta/` e para os scripts, e o arquivo sai (DEC-025). Dois dos três saíram nesta sessão.

- **`GOT_Build.md` — nada a extrair.** A spec0012 suspeitou que a leitura de 2026-07-22 tivesse sido rasa e recomendou re-extrair. **A suspeita era falsa:** os sete prompts foram comparados um a um com os do `TOhno` e são os mesmos, só que sem as respostas do assistente. É subconjunto estrito de um arquivo já extraído por inteiro. A verificação custou minutos e dispensou uma sessão.
- **`GUIA_COMPLETO_v4.md` — superado inteiro.** É a rodada v8; o outro é a v10. Suas 6 correções foram consertadas pelas 4 do mais novo, sua Fase 2 já está no código, e sua Fase 3 é esqueleto onde o outro tem implementação. **Codar a partir dele teria sido regressão dupla.** Sobreviveu uma única coisa, e não é código: a localização das larguras de coluna, agora no `CONTEXT.md`.
- **`GUIA_CORRECOES_FASE3.md` — fica mais uma sessão.** É o mais recente e tem as ~470 linhas da Fase 3.

**A auditoria do código da Fase 3 achou sete defeitos** (DEC-026). Os dois graves não quebram nada visivelmente — produzem imagem plausível e errada, que é a pior falha num recurso feito para ser postado em público:
- **D1** — o amuleto é lido do `GEAR` cru, então as propriedades de classe de um Magistral com `classBinding` **somem da imagem** enquanto continuam na tela.
- **D2** — altura fixa, e calibrada ao contrário: o modo **Detalhado**, que desenha todas as descrições, recebe 560 px contra os 820 do Estatístico. O corte é o caso comum, não o extremo.

Os outros cinco: ícone de classe invisível porque o canvas não herda filtro CSS (virou armadilha 15), ausência de renderização em 2x, `toDataURL` no lugar de `toBlob`, rodapé em posição absoluta, e um diagnóstico de CORS que está errado de duas maneiras. A `F3` do `ROADMAP.md` foi reescrita com o plano corrigido, uma lista de conferência visual, e **a altura dinâmica trazida da F4 para cá**.

**Três perguntas antigas encerradas** (DEC-024), com as respostas do autor: os 🎲 granulares e o seletor "Só alteradas" foram tirados **porque davam problema**, e a simplificação agradou — não são regressão. O modo Estatístico fica **adiado de propósito**: a informação que decide chega quando a Fase 3 entregar a versão em imagem, e aí dá para comparar os dois formatos lado a lado.

Sem mudança de código nesta sessão. `meta/legacy/` fica com o `GUIA_CORRECOES_FASE3.md` e o `README.md`.

**Próximo passo: Fase 3.** O rascunho já está no mount; nada a mexer no `.flatdropignore`.
```

---

## Parte 6 — `meta/IDEAS.md`

### 6.1 — Reclassificar os 🎲 granulares

**Âncora:**

```
### 2026-07-23 — Botões de build aleatória granulares *(possível regressão)*
O dump da v1.1 no arquivo de origem mostra **três** botões — `🎲 Tudo`, `🎲 Classe`, `🎲 Gear` — e o `App.jsx` de hoje tem só um. O pedido original ia além: aleatório em cadeia, com botão por equipamento, por propriedade e até por valor de propriedade. Como as versões intermediárias se perderam, não dá para saber em qual reescrita os três viraram um, nem se foi decisão. **Antes de reimplementar, vale perguntar ao autor se a simplificação foi intencional.**
```

**Substituir por:**

```
### 2026-07-23 — Aleatório granular *(respondido em 2026-07-25 — não é regressão)*
Os três botões da v1.1 (`🎲 Tudo`, `🎲 Classe`, `🎲 Gear`) **foram removidos porque davam problema**, e o 🎲 global que sobrou **agradou os usuários** (DEC-024). Fica como ideia, sem urgência: aleatório em cadeia, com botão por equipamento, por propriedade e até por valor de propriedade. Se voltar, volta como recurso novo e com os problemas resolvidos — não como conserto de algo perdido.
```

### 6.2 — Reclassificar o "Só alteradas"

**Âncora:**

```
### 2026-07-24 — Seletor "Só alteradas" no painel de estatísticas *(possível regressão)*
O dump da v1.1 mostra um seletor **"Só alteradas"** acima da tabela de estatísticas, e o `App.jsx` de hoje não tem: `StatsPanel` mostra tudo e apenas destaca o que difere da base (`changed = s => s.value !== s.base`). O pedido original é do início do projeto — *"um botão (checkbox) para selecionar se quer ou não ver só as informações da tabela que estão sendo influenciadas pela build"*. Mesma família do sumiço dos botões de 🎲 granulares, e mesma ressalva: **pode ter sido simplificação deliberada.** Perguntar antes de reimplementar. Se for reimplementar, a regra da DEC-022 vale aqui também — HP e Determinação continuam aparecendo com o filtro ligado.
```

**Substituir por:**

```
### 2026-07-24 — Seletor "Só alteradas" *(respondido em 2026-07-25 — encerrado)*
Removido por dar problema, e a avaliação do autor de que era inútil se sustenta: na tela o espaço não é escasso, a tabela rola de graça e o destaque visual já mostra o que a build muda. **Não reimplementar.** O conceito não morreu — mudou de lugar: na imagem da Fase 3, onde o espaço é fixo, filtrar é obrigatório (DEC-022). Fica a regra geral, que vale para qualquer filtro futuro: **a utilidade de esconder é proporcional à escassez de espaço.**
```

### 6.3 — Encerrar as três perguntas

**Âncora:**

```
### Três perguntas ao autor seguem em aberto
Nenhuma bloqueia trabalho, e nenhuma deve ser resolvida por suposição. Ficam listadas juntas para não se perderem uma a uma:

1. **Botões de 🎲 granulares** (`Tudo` / `Classe` / `Gear`) — sumiram em alguma reescrita. Foi simplificação deliberada?
2. **Seletor "Só alteradas"** no painel de estatísticas — mesma pergunta, mesma família.
3. **Modo Estatístico** — nos prompts antigos o autor cogitou removê-lo caso desse trabalho demais. Ele funciona desde a spec0004, mas a pergunta nunca foi formalmente encerrada.

Se as três forem respondidas com "foi de propósito", os dois itens de possível regressão saem do `IDEAS.md` e viram nota de decisão.
```

**Substituir por:**

```
### As três perguntas ao autor — respondidas em 2026-07-25
Todas viraram DEC-024. Duas fecham, uma fica agendada:

1. **🎲 granulares** — tirados por darem problema; a simplificação agradou. Encerrado.
2. **"Só alteradas"** — tirado por dar problema, e sem utilidade na tela. Encerrado.
3. **Modo Estatístico** — **adiado de propósito, com data.** Como texto o modo é fraco; como imagem pode ser o principal, já que a tabela calculada é o diferencial do projeto. A decisão acontece quando a Fase 3 permitir comparar os dois formatos lado a lado. Custo de esperar: zero.

**O que isso ensinou:** as três vieram da pergunta *"o que a ferramenta já teve e não tem mais?"*, e nenhuma era defeito. **Recurso ausente não é recurso perdido.** A extração fez certo em registrar sem reimplementar — reimplementar teria trazido de volta exatamente os problemas que os tiraram.
```

### 6.4 — Registrar o encerramento da fila de extração

**Âncora** (a linha da tabela de fila de leitura):

```
| `GOT_Build.md` | 40 KB | ✅ lido por inteiro em 2026-07-22 |
```

**Substituir por:**

```
| `GOT_Build.md` | 40 KB | ✅ **verificado em 2026-07-25 como subconjunto estrito do `TOhno`** — mesmos prompts, sem as respostas. Nada a extrair; arquivo removido (spec0013) |
```

---

## Parte 7 — `meta/GLOSSARY.md`

O `GUIA_COMPLETO_v4.md` deixa de existir; a entrada precisa refletir isso em vez de apontar para um arquivo ausente.

**Âncora:**

```
- **`meta/legacy/GUIA_COMPLETO_v4.md`** — guia anterior, com correções de layout e `HpResolveBar`. Cobre território parecido com o do `GUIA_CORRECOES_FASE3.md`; **antes de usar qualquer um dos dois na Fase 3, confira qual é o mais recente.** Existem duas cópias soltas dele fora do repositório (ver backlog do `STATUS.md`) — a versionada é esta.
```

**Substituir por:**

```
- **`GUIA_COMPLETO_v4.md`** — guia da rodada v8, **removido do repositório em 2026-07-25** (DEC-025) por estar superado inteiro pelo `GUIA_CORRECOES_FASE3.md`. Recuperável pelo histórico do Git. As duas cópias soltas fora do repositório continuam no backlog para apagar.
```

---

## Parte 8 — `.flatdropignore`

**Nenhuma mudança.** O bloco `# >>> flatdrop-editor` lista hoje `logs/`, `INSTRUCOES-DO-PROJETO.md` e `meta/legacy/README.md` — e assim deve permanecer:

- `GOT_Build.md` e `GUIA_COMPLETO_v4.md` **saem da árvore** na Parte 9, então não precisam de linha (mesmo tratamento dado a Joker, Alex, Origem e TOhno).
- `GUIA_CORRECOES_FASE3.md` **precisa continuar subindo** — é o rascunho da próxima sessão. Ele já está fora do bloco.

Confirme que o bloco está assim e siga. Se divergir, reporte.

---

## Parte 9 — Remover os dois arquivos absorvidos

**Só depois de as Partes 2 a 7 aparecerem no `git diff`.**

```
git rm meta/legacy/GOT_Build.md
git rm meta/legacy/GUIA_COMPLETO_v4.md
```

Os dois seguem recuperáveis pelo histórico. `meta/legacy/` fica com `GUIA_CORRECOES_FASE3.md` e `README.md`.

---

## Parte 10 — `meta/legacy/README.md`

**Instrução** (sem âncora exata — leia o arquivo e ajuste): a pasta agora tem **um** arquivo de conteúdo, o `GUIA_CORRECOES_FASE3.md`, e ele é **rascunho auditado da Fase 3**, não acervo. Atualize a lista e registre que `GOT_Build.md` e `GUIA_COMPLETO_v4.md` saíram em 2026-07-25 pela spec0013 — o primeiro por ser subconjunto do `TOhno`, o segundo por estar superado. Deixe explícito que, pela DEC-025, **a pasta se encerra quando a Fase 3 entrar**.

Se o arquivo não existir, **reporte e siga** sem criá-lo.

---

## Parte 11 — `logs/2026-07-25.md`

**Anexe** ao final do arquivo, precedido de uma linha `---`:

```markdown
## Sessão 2 — Auditoria dos guias legados e plano refinado da Fase 3

### Objetivo da sessão
Estudar os três insumos que subiram ao mount, levar o conteúdo aos `meta/` e remover o que já serviu — conforme a diretriz do autor de que guia legado não vive no repositório.

### Feito
- Comparados os sete prompts do `GOT_Build.md` com os do `GOT_Build_-_TOhno.md`: subconjunto estrito, nada a extrair.
- Comparados os dois guias: `GUIA_CORRECOES_FASE3.md` (rodada v10) supersede `GUIA_COMPLETO_v4.md` (rodada v8) em todos os eixos.
- Auditado o código da Fase 3 linha a linha — sete defeitos.
- Conferidos contra `logic.js` e `App.jsx`: assinatura de `getStatGroups`, chaves `stats.maxHP` / `maxResolve`, comportamento de `formatStatValue` com unidade `%`, chaves da paleta `T` (inclusive `T.cls`), e as larguras de coluna do guia antigo (ainda exatas).
- Encerradas as três perguntas ao autor.
- Entregue a `spec0013`.

### Specs entregues / aplicadas
- `260725-spec0013-auditoria-guias-e-plano-fase3.md` — registra DEC-024 a DEC-026; armadilha 15 e a nota das larguras de coluna no CONTEXT; reescreve a F3 do ROADMAP com o plano auditado e a conferência visual; reclassifica duas entradas do IDEAS; atualiza GLOSSARY e o README de `legacy/`; remove `GOT_Build.md` e `GUIA_COMPLETO_v4.md`.

### Decisões
- **DEC-024** — três recursos simplificados de propósito; o modo Estatístico fica adiado com data.
- **DEC-025** — guia legado é insumo, não acervo: estuda, absorve, remove.
- **DEC-026** — o código da Fase 3 do guia é rascunho; sete defeitos catalogados e arquitetura de duas passadas decidida.

### Bugs
- Nenhum em produção. Os sete defeitos são de código **ainda não aplicado** — catalogados antes de entrar, que é o barato.

### Aprendizados / armadilhas
- **O canvas não herda filtro CSS.** Ícone de classe sairia invisível na imagem. Virou armadilha 15, e traz junto a armadilha 3 (nunca filtrar PNG de técnica) para dentro do canvas.
- **Compare antes de reagendar releitura.** A suspeita sobre o `GOT_Build.md` era razoável e falsa; testá-la custou minutos, assumi-la custaria uma sessão.
- **Guia pronto convida a aplicar sem ler.** As ~470 linhas pareciam entrega e eram rascunho — e os dois piores defeitos não quebram nada visivelmente.
- **A utilidade de um filtro é proporcional à escassez de espaço.** Explica por que "Só alteradas" era inútil na tela e é obrigatório na imagem.

### Onde parei
`meta/legacy/` com um único arquivo de conteúdo. Fase 3 com plano auditado no ROADMAP, pronta para execução.

### Próximos passos
1. **Fase 3** — implementar `generateBuildImage` com as sete correções e a arquitetura de duas passadas; ao final, remover o último guia e encerrar `meta/legacy/`.
2. Depois da Fase 3: decidir o destino do modo Estatístico comparando texto e imagem (DEC-024).
3. Backlog: destino de `getAvailableProps` / `getAvailablePerks`, duplicação de `selectTech` / `selectAbility`, cópias soltas de `GUIA_COMPLETO*.md` fora do repo, `.claude/launch.json`.
```

---

## Parte 12 — Fechamento

Rode `git diff` e confira que nenhum arquivo de `src/` aparece — se aparecer, **PARE**.

```
git add meta/DECISIONS.md meta/CONTEXT.md meta/ROADMAP.md meta/STATUS.md meta/IDEAS.md meta/GLOSSARY.md meta/legacy/README.md logs/2026-07-25.md meta/specs/260725-spec0013-auditoria-guias-e-plano-fase3.md
git commit -m "docs(meta): audita os guias legados e registra o plano refinado da fase 3"
git push
```

As remoções entram pelos `git rm` da Parte 9.
