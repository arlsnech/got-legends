# spec0019 — A estrela significava duas coisas: separar Determinação de Magistral

**Data:** 2026-07-26 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner`

**Por que esta spec existe:** o autor percebeu, olhando o print, que o custo do Supremo aparece como `3★` — e ★ já significa **Magistral** em toda a ferramenta. Foi verificar e o problema é maior do que o print mostrava: **a estrela carrega dois significados diferentes em cinco lugares do código**, e a Determinação nunca teve símbolo próprio.

**Onde cada significado vive hoje:**

| ★ = Magistral | ★ = Determinação |
|---|---|
| selo ao lado do ícone do item | custo do Supremo no painel da UI |
| item Magistral no `<select>` | custo do Supremo no texto exportado |
| marca no texto exportado | custo do Supremo no cabeçalho da imagem |
| marca no cartão da imagem | **`unit: '★'` do `maxResolve` em `logic.js`** |
| contador `★☆☆` na topbar e na imagem | **`formatStatValue`, que repete a estrela** |

Os dois últimos são a raiz: a Determinação Máxima é uma estatística cuja **unidade é a estrela**, então a tabela de estatísticas mostra `★★★★` para Determinação e `★☆☆` para Magistrais, a poucos centímetros de distância. Não é um símbolo mal escolhido num lugar — é a mesma unidade valendo para duas grandezas.

**A correção:** Determinação passa a usar **`●`**, que é o que a interface já desenha na topbar e o que o jogo mostra. A estrela fica exclusiva de Magistral. Nenhum dos dois muda de forma — só param de se confundir.

**Junto vão os dois ajustes que o autor pediu no cabeçalho da imagem:** afastar o contador de Magistrais do número de HP, e nomeá-lo.

**Esta spec toca código.** Rode `npm run build` e siga a conferência da Parte 8.

**Regras de execução:**
- Nenhum `--force`, `rebase` ou `reset --hard`.
- Se **uma** âncora que seja não for encontrada exatamente: **PARE e reporte qual falhou.**
- **Não toque nas ocorrências de ★ que significam Magistral.** A Parte 7 lista quais são, para conferir no `git diff`.

---

## Parte 1 — Levantamento

```
git branch --show-current
git status
```

1. Estamos na `v2-planner`? Se não, **PARE**.
2. A árvore deve estar limpa. Se houver modificação pendente, **PARE e reporte**.

---

## Parte 2 — `src/logic.js`: a unidade da Determinação

É aqui que a confusão nasce — a estatística declara a estrela como unidade, e todo o resto só obedece.

**Âncora:**

```
        { key: 'maxResolve',       label: t.maxResolve,       value: stats.maxResolve,       unit: '★', base: BASE_RESOLVE },
```

**Substituir por:**

```
        // Unidade '●': o circulo e o simbolo da Determinacao, igual a topbar
        // e ao jogo. Era '★' — a MESMA unidade dos itens Magistrais, o que
        // punha "Determinacao ★★★★" e "Magistrais ★☆☆" na mesma tabela. Ver FIX-014.
        { key: 'maxResolve',       label: t.maxResolve,       value: stats.maxResolve,       unit: '●', base: BASE_RESOLVE },
```

---

## Parte 3 — `src/logic.js`: o formatador

**Âncora:**

```
 * @param {string} unit  '%' | 'pts' | 's' | '★' | ''
 * @param {string} sk    stat key (para casos especiais)
 * @returns {string}
 */
export function formatStatValue(value, unit, sk) {
  if (unit === '★') {
    return '★'.repeat(value);
  }
```

**Substituir por:**

```
 * @param {string} unit  '%' | 'pts' | 's' | '●' | ''
 * @param {string} sk    stat key (para casos especiais)
 * @returns {string}
 */
export function formatStatValue(value, unit, sk) {
  // '●' e a unidade da Determinacao. A estrela e reservada a Magistral e nao
  // deve voltar para ca — ver FIX-014.
  if (unit === '●') {
    return '●'.repeat(value);
  }
```

---

## Parte 4 — `src/App.jsx`: o formatador do painel de estatísticas

O mesmo `if`, duplicado no `StatsPanel`. (Sim, é a duplicação da armadilha 14 aparecendo de novo — está no backlog e não é escopo desta spec.)

**Âncora:**

```
    if (s.unit === '★') return '★'.repeat(s.value)
```

**Substituir por:**

```
    if (s.unit === '●') return '●'.repeat(s.value)
```

---

## Parte 5 — `src/App.jsx`: o custo do Supremo, nos três lugares

### 5.1 — Painel da interface

**Âncora:**

```
          {lang === 'en' ? 'Cost:' : 'Custo:'} {ult.cost}★
```

**Substituir por:**

```
          {lang === 'en' ? 'Cost:' : 'Custo:'} {ult.cost} ●
```

### 5.2 — Texto exportado

**Âncora:**

```
  if (ult.cost != null) parts.push(`${L ? 'Cost' : 'Custo'}: ${ult.cost}★`)
```

**Substituir por:**

```
  if (ult.cost != null) parts.push(`${L ? 'Cost' : 'Custo'}: ${ult.cost} ●`)
```

### 5.3 — Cabeçalho da imagem

**Âncora:**

```
  if (ult?.cost != null) bits.push(`${L ? 'Cost' : 'Custo'} ${ult.cost}★`)
```

**Substituir por:**

```
  if (ult?.cost != null) bits.push(`${L ? 'Cost' : 'Custo'} ${ult.cost} ●`)
```

---

## Parte 6 — `src/App.jsx`: separar e nomear o contador de Magistrais

Dois pedidos do autor sobre a mesma linha: as estrelas estão coladas no número de HP, e não dizem o que são.

O afastamento não pode ser um número fixo — o `+ 34` de hoje não sabe quanto o número de HP ocupa, então com HP de três dígitos as estrelas chegam mais perto do que com dois. Passa a ser medido.

**Âncora:**

```
  // Contador de Magistrais, ao lado do HP
  const legX = tx + labelW + barW + 9 + 34
  pen.text(`${'★'.repeat(leg.used)}${'☆'.repeat(Math.max(0, leg.limit - leg.used))}`,
    legX, hpY + 4, { font: `400 ${IMG_FS.ultInfo}px ${IMG_FONT}`, color: C.leg, lineH: 0 })
```

**Substituir por:**

```
  // Contador de Magistrais — na mesma linha do HP, mas AFASTADO e com nome.
  // O afastamento e medido, nao fixo: o numero de HP muda de largura entre
  // dois e tres digitos, e um espaco fixo deixava as estrelas coladas nele.
  // O nome existe porque estrela sozinha nao diz o que conta — e agora que a
  // Determinacao usa circulo, e a unica coisa contada em estrelas. Ver FIX-014.
  const hpNumFt = `700 ${IMG_FS.ultInfo}px ${IMG_FONT}`
  const legLbl  = L ? 'LEGENDARY' : 'MAGISTRAIS'
  const legX    = tx + labelW + barW + 9 + pen.width(String(hp), hpNumFt) + 44
  pen.text(legLbl, legX, hpY + 3, { font: vitalFt, color: C.muted, lineH: 0 })
  pen.text(`${'★'.repeat(leg.used)}${'☆'.repeat(Math.max(0, leg.limit - leg.used))}`,
    legX + pen.width(legLbl, vitalFt) + 9, hpY + 4,
    { font: `400 ${IMG_FS.ultInfo}px ${IMG_FONT}`, color: C.leg, lineH: 0 })
```

---

## Parte 7 — As estrelas que **não** mudam

Confira no `git diff` que estas continuam intactas — todas significam **Magistral**:

| Onde | O quê |
|---|---|
| `App.jsx` · selo do item | `<span …>★</span>` ao lado do ícone |
| `App.jsx` · `<select>` de item | `{…nPT} ★` |
| `App.jsx` · `legMark` | `const legMark = isLeg ? ' ★' : ''` |
| `App.jsx` · cartão da imagem | `(item.leg ? '  ★' : '')` |
| `App.jsx` · topbar da UI | `{'★'.repeat(legInfo.used)}` e `{'☆'.repeat(…)}` |
| `App.jsx` · cabeçalho da imagem | o contador editado na Parte 6 |

Se alguma delas aparecer alterada, **PARE**.

---

## Parte 8 — Build e conferência

Rode `npm run build`. Se falhar, **PARE**.

No dev server:

**O símbolo, que é o alvo da spec**
1. **Painel de estatísticas da UI**, grupo Determinação: *Determinação Máxima* mostra **círculos** (`●●●●`), não estrelas.
2. **Na mesma tela**, o contador de Magistrais da topbar continua em **estrelas** (`★☆☆`). Os dois lado a lado, sem se confundir — era o defeito.
3. **Painel do Supremo**: `Custo: 3 ●`.
4. **Texto exportado** nos três modos: `Custo: 3 ●` na linha do Supremo, e a marca ` ★` continua nos itens Magistrais.
5. **Imagem**, cabeçalho: `Custo 3 ●` na linha do Supremo.
6. Procure `★` em qualquer lugar onde se fale de Determinação — não deve haver nenhuma.

**Cabeçalho da imagem**
7. As estrelas de Magistral estão **visivelmente afastadas** do número de HP, com o rótulo **MAGISTRAIS** entre os dois.
8. Repita com **HP de dois e de três dígitos** (uma build sem bônus de vida e outra com): o afastamento se mantém proporcional nas duas, e as estrelas **não encostam no bloco do Supremo**. Este é o ponto que a medição existe para resolver.
9. Em **EN**, o rótulo vira `LEGENDARY` e continua cabendo.

**Não-regressão**
10. Cartões, bandas, ícones nos dois temas e o modo Estatístico com HP e Determinação na tabela: tudo como estava.

Se todos passarem:

```
git add src/App.jsx src/logic.js
git commit -m "fix(ui): separa o simbolo de Determinacao do de Magistral e afasta o contador"
```

Não faça `push` ainda.

---

## Parte 9 — `meta/DECISIONS.md`

**Âncora** (último parágrafo do arquivo, fim da DEC-028):

```
Todos os tamanhos de fonte da imagem passaram para `IMG_FS`. O pedido de "aumentar um pouco as letras" seria, antes, uma caçada por dezenove literais espalhados pelo desenho — e cada um esquecido produziria um desalinhamento sutil. `IMG_SCALE` subiu de 2 para 3 e `IMG_W` de 900 para 1000 pelo mesmo motivo: mais pixels por unidade lógica, e mais largura para o texto maior respirar.
```

**Substituir por:**

```
Todos os tamanhos de fonte da imagem passaram para `IMG_FS`. O pedido de "aumentar um pouco as letras" seria, antes, uma caçada por dezenove literais espalhados pelo desenho — e cada um esquecido produziria um desalinhamento sutil. `IMG_SCALE` subiu de 2 para 3 e `IMG_W` de 900 para 1000 pelo mesmo motivo: mais pixels por unidade lógica, e mais largura para o texto maior respirar.

---

## FIX-014 — A estrela significava Magistral e Determinação ao mesmo tempo

**Data:** 2026-07-26 · **Gravidade:** média (ambiguidade de leitura, em toda a ferramenta)

### Sintoma
O custo do Supremo aparecia como `3★`. Como ★ marca item Magistral em todo o resto — no selo do item, no `<select>`, no texto exportado, no cartão da imagem e no contador `★☆☆` —, `Custo 3★` sugeria alguma relação com Magistrais que não existe. O autor viu no print, com as duas leituras a poucos centímetros uma da outra.

### Causa raiz
Não era um símbolo mal escolhido num lugar: **a estrela era a unidade da estatística `maxResolve`**. `getStatGroups` declarava `unit: '★'`, e `formatStatValue` repetia a estrela para essa unidade. Daí a tabela de estatísticas mostrar *Determinação Máxima* `★★★★` logo abaixo de *Slots Magistrais*, e daí os três lugares que exibem o custo do Supremo terem herdado a estrela como se fosse o símbolo da Determinação.

A Determinação, na prática, **nunca teve símbolo próprio** — a topbar da interface sempre a desenhou como círculos, mas isso era desenho, não dado. O caractere só aparecia onde havia texto.

### Correção
A unidade virou `●`, que é o que a topbar já desenhava e o que o jogo mostra. Cinco pontos: a declaração em `logic.js`, os dois formatadores (`logic.js` e a cópia dentro do `StatsPanel`), e os três lugares que escrevem o custo do Supremo — painel da UI, texto exportado e cabeçalho da imagem. **A estrela ficou exclusiva de Magistral.**

### Por que passou tanto tempo
Porque as duas leituras raramente apareciam juntas. Foi o cabeçalho novo da imagem (DEC-028) que pôs `Custo 3★` a três centímetros de `★☆☆` e tornou a colisão visível de uma vez.

**Regra que fica:** símbolo é vocabulário, e vocabulário tem que ser único por significado. Antes de usar um caractere como unidade, procure onde mais ele já aparece na interface — a colisão não dói enquanto os dois usos vivem em telas diferentes, e dói de uma vez quando alguém os aproxima.

### De passagem
O contador de Magistrais no cabeçalho da imagem ganhou o rótulo **MAGISTRAIS** e um afastamento **medido** do número de HP — antes era um espaço fixo, que não sabia se o número tinha dois ou três dígitos. Com a Determinação em círculos, a estrela passou a ser a única coisa contada em estrelas, e nomear o contador fecha a leitura.
```

---

## Parte 10 — `meta/CONTEXT.md`

**Âncora** (fim da armadilha 20, última da lista):

```
20. **Tamanho de fonte da imagem mora em `IMG_FS`.** Dezenove literais espalhados pelo desenho tornavam "aumente um pouco as letras" uma caçada, com desalinhamento garantido no que fosse esquecido. Acrescentou texto novo ao canvas? A medida vem do mapa.
```

**Substituir por:**

```
20. **Tamanho de fonte da imagem mora em `IMG_FS`.** Dezenove literais espalhados pelo desenho tornavam "aumente um pouco as letras" uma caçada, com desalinhamento garantido no que fosse esquecido. Acrescentou texto novo ao canvas? A medida vem do mapa.

21. **`★` é de Magistral. `●` é de Determinação. Não troque.** A estrela marca item Magistral no selo, no `<select>`, no texto exportado, no cartão da imagem e no contador `★☆☆`; o círculo é a unidade de `maxResolve` e o custo do Supremo. Já foram a mesma coisa, e o resultado era *Determinação* `★★★★` na tabela logo abaixo de *Slots Magistrais* (FIX-014). Símbolo é vocabulário: um significado por caractere.
```

---

## Parte 11 — `meta/GLOSSARY.md`

**Âncora** (primeira linha da seção «Conceitos do jogo»):

```
- **Magistral** — item Legendary; nível máximo de qualidade de equipamento. Em EN: *Legendary*.
```

**Substituir por:**

```
- **Magistral** — item Legendary; nível máximo de qualidade de equipamento. Em EN: *Legendary*. Marcado por **★** em toda a ferramenta — selo do item, `<select>`, texto exportado, cartão da imagem e o contador `★☆☆`.
- **Determinação** — recurso gasto pelo Supremo e por algumas habilidades. Em EN: *Resolve*. Representada por **●**: é a unidade da estatística `maxResolve` e o símbolo do custo do Supremo. Foi ★ até 2026-07-26, quando colidia com Magistral (FIX-014).
```

---

## Parte 12 — `meta/CHANGELOG.md`

**Âncora** (a primeira linha da subseção «### Corrigido»):

```
- No Ronin, a variante ativa do Sopro sumia do texto exportado quando `activeBreath` não batia com nenhuma das opções, em vez de cair na variante base
```

**Substituir por:**

```
- **A Determinação usava o mesmo símbolo dos itens Magistrais.** O custo do Supremo saía como `3★` e a estatística *Determinação Máxima* como `★★★★`, a poucos centímetros do contador de Magistrais `★☆☆`. A Determinação passou a usar `●`, que é o que a topbar já desenhava; a estrela ficou exclusiva de Magistral (FIX-014)
- No Ronin, a variante ativa do Sopro sumia do texto exportado quando `activeBreath` não batia com nenhuma das opções, em vez de cair na variante base
```

**Âncora** (a primeira linha da subseção «### Modificado»):

```
- **O cabeçalho da imagem passou a mostrar barra de HP e círculos de Determinação de verdade**, como a topbar da ferramenta — em cor uniforme, sem a distinção base/bônus que só faz sentido enquanto se monta. O Supremo saiu da borda para perto do centro e ganhou custo, golpes ou alvos com o bônus, multiplicadores e a **descrição da habilidade**, que existia no dado e nunca tinha sido exibida (DEC-028)
```

**Substituir por:**

```
- No cabeçalho da imagem, o contador de Magistrais ganhou o rótulo **MAGISTRAIS** e um afastamento medido do número de HP, que antes era fixo e não sabia se o número tinha dois ou três dígitos
- **O cabeçalho da imagem passou a mostrar barra de HP e círculos de Determinação de verdade**, como a topbar da ferramenta — em cor uniforme, sem a distinção base/bônus que só faz sentido enquanto se monta. O Supremo saiu da borda para perto do centro e ganhou custo, golpes ou alvos com o bônus, multiplicadores e a **descrição da habilidade**, que existia no dado e nunca tinha sido exibida (DEC-028)
```

---

## Parte 13 — `meta/STATUS.md`

**Âncora** (último parágrafo do arquivo):

```
Simulado antes de virar spec: duas passadas com altura idêntica nos três modos, e as seis combinações de Supremo (Samurai comum e a 300%, Caçadora, Assassino com Ofuscado, Ronin com e sem variante) conferidas uma a uma.
```

**Substituir por:**

```
Simulado antes de virar spec: duas passadas com altura idêntica nos três modos, e as seis combinações de Supremo (Samurai comum e a 300%, Caçadora, Assassino com Ofuscado, Ronin com e sem variante) conferidas uma a uma.

---

**2026-07-26 (3) — a estrela significava duas coisas (FIX-014).**

O autor viu no print que o custo do Supremo saía como `3★`, e ★ já marca Magistral em toda a ferramenta. A verificação mostrou que o problema é de vocabulário, não de um lugar: **a estrela era a unidade da estatística `maxResolve`** (`unit: '★'` em `getStatGroups`, repetida por `formatStatValue`), e daí se espalhou para os três pontos que escrevem o custo do Supremo.

O efeito mais claro estava na própria tabela de estatísticas: *Determinação Máxima* `★★★★` logo abaixo de *Slots Magistrais*, com a mesma estrela contando duas grandezas diferentes.

A Determinação passou a usar **`●`** — que é o que a topbar sempre desenhou, só que como desenho, nunca como dado. A estrela ficou exclusiva de Magistral. Cinco pontos alterados; as seis ocorrências que significam Magistral foram listadas na spec para conferência no `git diff`.

**Por que passou tanto tempo:** as duas leituras quase nunca apareciam juntas. Foi o cabeçalho novo da imagem (DEC-028) que pôs `Custo 3★` a três centímetros de `★☆☆`. Virou a armadilha 21.

**De passagem**, os dois ajustes que o autor pediu no cabeçalho da imagem: o contador de Magistrais ganhou o rótulo **MAGISTRAIS** e um afastamento **medido** do número de HP — o espaço fixo anterior não sabia se o número tinha dois ou três dígitos.

**Próximo passo:** duas frentes em aberto, à escolha do autor — fechar as pendências acumuladas (o `cmd` dos quatro Supremos, o destino de `getAvailableProps`/`getAvailablePerks`, a duplicação de `selectTech`/`selectAbility`, as cópias soltas de `GUIA_COMPLETO*.md`), ou decidir a simplificação dos botões de exportação, cuja proposta foi apresentada ao autor.
```

---

## Parte 14 — `logs/2026-07-26.md`

**Anexe** ao final do arquivo, precedido de uma linha `---`:

```markdown
## Sessão 4 — A estrela significava duas coisas

### Objetivo da sessão
Investigar a inconsistência que o autor viu no print (`Custo 3★`) e corrigir, mais dois ajustes no bloco de sinais vitais do cabeçalho.

### Feito
- Levantadas todas as ocorrências de `★`/`☆` no projeto e separadas por significado: seis para Magistral, cinco para Determinação.
- Identificada a raiz: `unit: '★'` na declaração de `maxResolve`, repetida por `formatStatValue` e pela cópia dentro do `StatsPanel`.
- Determinação passou a `●` nos cinco pontos; a estrela ficou exclusiva de Magistral.
- Contador de Magistrais no cabeçalho da imagem: rótulo **MAGISTRAIS** e afastamento medido em vez de fixo.
- Entregue a `spec0019`.

### Specs entregues / aplicadas
- `260726-spec0019-simbolo-determinacao.md`

### Decisões
- Nenhuma nova de arquitetura. O símbolo da Determinação passou a fazer parte do vocabulário registrado (GLOSSARY e armadilha 21).

### Bugs
- **FIX-014** — a estrela valia para Magistral e para Determinação ao mesmo tempo.

### Aprendizados / armadilhas
- **Símbolo é vocabulário: um significado por caractere.** A colisão existia desde sempre e não doía porque as duas leituras viviam em telas diferentes; doeu de uma vez quando o cabeçalho novo da imagem as aproximou.
- **Espaço fixo não sabe o que veio antes.** O `+ 34` entre o HP e as estrelas encolhia quando o número passava a três dígitos. Afastamento entre elementos de largura variável se mede, não se chuta.
- **Um símbolo virar unidade de dado espalha o problema.** Enquanto `★` era só decoração de UI, era um lugar; virando `unit` de uma estatística, passou a ser reproduzido por todo formatador.

### Onde parei
Correção entregue. Duas frentes em aberto à escolha do autor: fechar pendências acumuladas ou decidir a simplificação dos botões de exportação.

### Próximos passos
1. Escolher entre a limpeza de pendências e a decisão dos botões de exportação.
2. F4 — polimento e mobile.
```

---

## Parte 15 — Fechamento

Rode `git diff` e confira a tabela da Parte 7 antes de commitar.

```
git add meta/DECISIONS.md meta/CONTEXT.md meta/GLOSSARY.md meta/CHANGELOG.md meta/STATUS.md logs/2026-07-26.md meta/specs/260726-spec0019-simbolo-determinacao.md
git commit -m "docs(meta): registra o FIX-014 e a armadilha do simbolo duplo"
git push
```
