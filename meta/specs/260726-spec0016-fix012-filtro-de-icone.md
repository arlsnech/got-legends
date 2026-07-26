# spec0016 — FIX-012 corrigido: a causa era filtro de tema, não dimensão de SVG · retomada da spec0015

**Data:** 2026-07-26 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner`

**Por que esta spec existe:** a `spec0015` mandava diagnosticar antes de corrigir o FIX-012, e o diagnóstico **derrubou a hipótese**. O executor parou, como a spec pedia, e trouxe a causa real. Esta spec substitui a Parte 4 da `spec0015` e retoma o que ficou pendente a partir dali.

**Esta spec pressupõe a árvore como o executor a deixou:** `src/App.jsx` com as **Partes 2, 3 e 5 da `spec0015` aplicadas e não commitadas** (FIX-011, quebra de nome no 2-col, FIX-013). **Não as reaplique.** A Parte 1 confere isso antes de qualquer coisa.

**Esta spec toca código.** Rode `npm run build` e siga a conferência da Parte 4. **Dois commits:** código e documentação.

**Regras de execução:**
- Nenhum `--force`, `rebase` ou `reset --hard`.
- Se **uma** âncora que seja não for encontrada exatamente: **PARE e reporte qual falhou.**

---

## Parte 1 — Levantamento e conferência do estado

```
git branch --show-current
git status
git diff --stat
```

1. Estamos na `v2-planner`? Se não, **PARE**.
2. O `git status` deve mostrar **apenas `src/App.jsx` modificado e não commitado**. Se houver mais arquivos, ou se `App.jsx` estiver limpo, **PARE e reporte**.
3. Confirme que as três partes já aplicadas continuam na árvore:

```
grep -c "minmax(190px, 1fr)" src/App.jsx     # deve ser 1  (Parte 3)
grep -c "pointerEvents: 'none'," src/App.jsx  # deve ser >= 1 (Parte 2)
grep -c "function loadImg(src) {" src/App.jsx # deve ser 1  (Parte 4 NAO aplicada)
```

Se o terceiro não for 1, a Parte 4 da `spec0015` foi aplicada por engano — **PARE e reporte**.

---

## Parte 2 — A causa real, e por que a regra muda de lugar

**O que a `spec0015` supôs:** que os SVG de gear não tinham dimensão intrínseca e por isso `drawImage` não pintava nada. **Falso** — o executor conferiu ao vivo, interceptando `drawImage`: os cinco ícones eram desenhados com dimensão válida, e nenhum arquivo em `public/icons/gear/` ou `public/icons/ghost_weapons/` está sem `width`.

**O que é de verdade:** os ícones **estão sendo desenhados** — na cor errada para o tema. É a armadilha 15 (*o canvas não herda filtro CSS*), e o detalhe que fazia o sintoma variar de slot para slot é a cor nativa de cada arquivo:

| Origem | Cor nativa | Sem filtro |
|---|---|---|
| `icons/gear/*.svg` — Katana, Longo Alcance, Amuleto | sem `fill` → **preto** | somem no tema **escuro** |
| `icons/ghost_weapons/*.svg` — as duas Armas Fantasma | `fill="#fff"` → **branco** | somem no tema **claro** |

Foi por isso que a análise das imagens enganou: nas capturas em tema claro, Katana e Longo Alcance apareciam e as Armas Fantasma não. "Alguns sim, outros não" parecia diferença **entre arquivos**; era diferença **entre a cor de cada arquivo e o fundo**.

A interface nunca teve esse problema porque aplica o filtro: `style={{ filter: T.iconFilter, ... }}` nas duas variantes do ícone de equipamento. O canvas é que ficou de fora — `paintBuildImage` chama `pen.icon(icons[gear_${slot}], ..., false)` para os cinco slots.

### Por que a correção não é trocar `false` por `true`

Trocar os cinco argumentos resolveria hoje e repetiria a classe do erro amanhã: a decisão continuaria copiada em cinco lugares, e o próximo ícone acrescentado herdaria o valor errado por descuido. E a decisão não é arbitrária — **é uma função do tipo de arquivo**, e a separação é perfeita no projeto inteiro:

| Mapa | Extensão | Filtro |
|---|---|---|
| `GEAR_ICON` | 100% `.svg` | **sim** |
| `CLASS_ICON` | 100% `.svg` | **sim** |
| `TECH_ICON` | 100% `.png` | **não** — vira retângulo sólido (armadilha 3) |
| `CLASS_TECH_FALLBACK` | 100% `.png` | **não** |

Então a correção **deriva** o filtro da extensão, em vez de perguntar em cada chamada. Os cinco pontos passam a acertar sozinhos, e o parâmetro que dava margem ao erro deixa de existir.

---

## Parte 3 — `src/App.jsx`

### 3.1 — `loadImg` marca o tipo do arquivo

**Âncora:**

```
function loadImg(src) {
  if (!src) return Promise.resolve(null)
  return new Promise(resolve => {
    const img = new Image()
    img.onload  = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}
```

**Substituir por:**

```
function loadImg(src) {
  if (!src) return Promise.resolve(null)
  return new Promise(resolve => {
    const img = new Image()
    img.onload  = () => {
      // Marca o tipo AQUI, que e onde a URL esta a mao. A regra de filtro do
      // canvas e por tipo de arquivo, nao por slot: SVG e monocromatico e
      // precisa do filtro do tema; PNG ja vem colorido e nao pode receber.
      // Ver FIX-012 e as armadilhas 3 e 15.
      img.isSvgIcon = /\.svg(\?|#|$)/i.test(src)
      resolve(img)
    }
    img.onerror = () => {
      console.warn('[imagem da build] icone nao carregou:', src)
      resolve(null)
    }
    img.src = src
  })
}
```

### 3.2 — `pen.icon` decide sozinho

**Âncora:**

```
    icon(img, x, yTop, size, invert = false) {
      if (!draw || !img) return
      if (invert && T.iconFilter) ctx.filter = T.iconFilter
      ctx.drawImage(img, x, yTop, size, size)
      if (invert && T.iconFilter) ctx.filter = 'none'
    },
```

**Substituir por:**

```
    icon(img, x, yTop, size) {
      if (!draw || !img) return
      // O filtro vem do TIPO do arquivo, marcado no loadImg — nao de um
      // parametro em cada chamada. Um booleano por ponto de chamada foi o que
      // deixou os cinco icones de equipamento sem filtro por engano, enquanto
      // a interface aplicava. Ver FIX-012.
      //   SVG (gear, classe) → monocromatico, precisa do filtro do tema
      //   PNG (tecnica, supremo) → colorido; com filtro vira retangulo solido
      const invert = img.isSvgIcon && !!T.iconFilter
      if (invert) ctx.filter = T.iconFilter
      ctx.drawImage(img, x, yTop, size, size)
      if (invert) ctx.filter = 'none'
    },
```

### 3.3 — Os cinco pontos de chamada perdem o argumento

São cinco substituições de uma linha. Cada âncora é única no arquivo.

**Âncora 1:**

```
  pen.icon(icons.cls, IMG_PAD, (IMG_HEADER_H - 28) / 2, 28, true)
```

**Substituir por:**

```
  pen.icon(icons.cls, IMG_PAD, (IMG_HEADER_H - 28) / 2, 28)
```

**Âncora 2:**

```
  pen.icon(icons.supreme, ultX, 6, IMG_ICON_ULT, false)
```

**Substituir por:**

```
  pen.icon(icons.supreme, ultX, 6, IMG_ICON_ULT)
```

**Âncora 3:**

```
    pen.icon(icons.ability, leftX, ly - IMG_ICON_SMALL + 4, IMG_ICON_SMALL, false)
```

**Substituir por:**

```
    pen.icon(icons.ability, leftX, ly - IMG_ICON_SMALL + 4, IMG_ICON_SMALL)
```

**Âncora 4:**

```
    pen.icon(icons[`tech_${tier}`], leftX, ly - IMG_ICON_SMALL + 4, IMG_ICON_SMALL, false)
```

**Substituir por:**

```
    pen.icon(icons[`tech_${tier}`], leftX, ly - IMG_ICON_SMALL + 4, IMG_ICON_SMALL)
```

**Âncora 5:**

```
    pen.icon(icons[`gear_${slot}`], rightX, ry - IMG_ICON_SMALL + 4, IMG_ICON_SMALL, false)
```

**Substituir por:**

```
    pen.icon(icons[`gear_${slot}`], rightX, ry - IMG_ICON_SMALL + 4, IMG_ICON_SMALL)
```

### 3.4 — Aviso de ícone ausente

Esta parte da `spec0015` continua valendo: o defeito era outro, mas o silêncio que o escondeu é o mesmo.

**Âncora:**

```
  const keys    = Object.keys(jobs)
  const results = await Promise.all(keys.map(k => jobs[k]))
  const out     = {}
  keys.forEach((k, i) => { out[k] = results[i] })
  return out
}
```

**Substituir por:**

```
  const keys    = Object.keys(jobs)
  const results = await Promise.all(keys.map(k => jobs[k]))
  const out     = {}
  keys.forEach((k, i) => { out[k] = results[i] })

  // Icone ausente nao derruba o desenho — mas some sem dizer nada, e foi
  // justamente o silencio que fez o FIX-012 ser diagnosticado errado da
  // primeira vez. Avisar no console custa nada.
  const missing = keys.filter(k => !out[k])
  if (missing.length) console.warn('[imagem da build] sem icone:', missing.join(', '))

  return out
}
```

---

## Parte 4 — Build e conferência

Rode `npm run build`. Se falhar, **PARE**.

Depois, no dev server. Esta lista cobre as quatro correções — as três já na árvore e a desta spec.

**Ícones na imagem (FIX-012) — o alvo desta spec**
1. **Tema escuro**, build com os cinco slots preenchidos, 🖼️ **Detalhado**: os cinco ícones de equipamento aparecem, **claros sobre o fundo escuro**. Katana, Longo Alcance e Amuleto eram os que sumiam aqui.
2. **Tema claro**, mesma build: os cinco aparecem, **escuros sobre o fundo claro**. As duas Armas Fantasma eram as que sumiam aqui.
3. **Ícones de técnica e o do supremo continuam coloridos** nos dois temas — dourados, não retângulos sólidos pretos ou brancos. Se viraram bloco, o filtro vazou para PNG e a armadilha 3 voltou: **PARE**.
4. **Ícone de classe no cabeçalho** legível nos dois temas (já era, não pode regredir).
5. **Console:** nenhum aviso `[imagem da build] sem icone`. Se aparecer, copie a lista e reporte.

**Não-regressão das partes já aplicadas**
6. **Modal** (FIX-011): passe o cursor por **3 Colunas**, **2 Colunas**, **Compacto** e **Expandido** — nenhum retângulo cinza no pé, nada se desloca, o tooltip aparece logo abaixo do botão. O modal segue centralizado e clicar fora fecha.
7. **2 Colunas** (Parte 3 da spec0015): nenhum nome de vantagem quebra em duas linhas — confira *Identificação Precisa* e, no Ronin, *Armas Fantasma Melhoradas*. **3 Colunas** inalterado (armadilha 13).
8. **Rótulos na imagem** (FIX-013): *Vantagem I/II/III* e os rótulos de slot legíveis, sem o ícone nem o nome por cima.
9. Repita 1–3 nos **dois idiomas**.

Se todos passarem, faça o **commit de código** — ele fecha as quatro correções de uma vez:

```
git add src/App.jsx
git commit -m "fix(ui): corrige barra fantasma no modal, quebra de nome no 2-col, sobreposicao e filtro de icone na imagem"
```

Não faça `push` ainda.

---

## Parte 5 — `meta/DECISIONS.md`

> As entradas do FIX-011 e do FIX-013 são as mesmas da `spec0015` — elas **não foram aplicadas**, porque o executor parou antes das partes de documentação. Esta spec entrega as três de uma vez, com o FIX-012 já com a causa certa.

**Âncora** (último parágrafo do arquivo, fim do FIX-010):

```
**Regra que fica:** quando duas implementações do mesmo dado divergem, a divergência é o achado. Não escolha a mais recente nem a que parece mais cuidada — vá à fonte. É a terceira vez que uma chave errada some com informação em silêncio neste projeto (FIX-005, e agora as três desta entrada); **a exportação não tem quem reclame**, porque nada quebra: o texto sai bonito e incompleto.
```

**Substituir por:**

```
**Regra que fica:** quando duas implementações do mesmo dado divergem, a divergência é o achado. Não escolha a mais recente nem a que parece mais cuidada — vá à fonte. É a terceira vez que uma chave errada some com informação em silêncio neste projeto (FIX-005, e agora as três desta entrada); **a exportação não tem quem reclame**, porque nada quebra: o texto sai bonito e incompleto.

---

## FIX-011 — Barra de rolagem fantasma no modal de configurações

**Data:** 2026-07-25 · **Gravidade:** baixa (incômodo visual), **causa alta** (afeta qualquer filho posicionado)

### Sintoma
Passar o cursor sobre uma opção do modal fazia surgir um retângulo cinza no pé da janela; o conteúdo se deslocava, e voltava ao tirar o cursor. Entrar e sair repetidamente deixava a janela "tremendo".

### Causa raiz
O retângulo era uma **barra de rolagem horizontal**, e a causa não estava no `Tooltip`.

`position: fixed` normalmente se posiciona pela janela do navegador e não entra no `overflow` de ancestral nenhum. **Mas um ancestral com `transform` vira o bloco-contenedor dos descendentes fixos.** O modal se centralizava com `transform: translate(-50%, -50%)`, então o tooltip — que é `fixed` — passou a contar como conteúdo do modal para efeito de rolagem. Com 360 px de largura e um tooltip de 260 px posicionado por coordenadas de janela, o transbordo horizontal era garantido, e a barra que o navegador cria para ele ocupa altura.

O mesmo mecanismo desalinhava o tooltip: `getBoundingClientRect` devolve coordenadas relativas à **janela**, e elas passaram a ser lidas como relativas ao **modal**.

### Correção
Centralização por flexbox, num envelope `position: fixed; inset: 0` com `pointerEvents: none`, e o modal como filho com `pointerEvents: auto`. Sem `transform`, o tooltip volta a se posicionar pela janela, não entra no overflow e aparece no lugar certo. `overflowX: hidden` ficou como rede.

### Por que vale registrar
Duas propriedades inofensivas — `transform` para centralizar e `position: fixed` para flutuar — produzem juntas um terceiro comportamento que nenhuma das duas anuncia. Virou a armadilha 16.

---

## FIX-012 — Ícones de equipamento invisíveis na imagem: filtro de tema não aplicado

**Data:** 2026-07-26 · **Gravidade:** média (imagem incompleta, sem erro)

> **Esta entrada foi diagnosticada errado na primeira tentativa.** A seção final registra o erro, porque ele ensina mais que o conserto.

### Sintoma
Na imagem gerada em tema claro, Katana e Longo Alcance apareciam com ícone; Amuleto e as duas Armas Fantasma, não. Na interface, todos apareciam. Nenhum erro no console.

### Causa raiz
Os ícones **estavam sendo desenhados** — na cor errada para o tema. É a armadilha 15 em ação: `ctx.drawImage` não herda filtro CSS, e `paintBuildImage` chamava `pen.icon(..., false)` para os cinco slots de equipamento, enquanto a interface aplica `filter: T.iconFilter` nos dois tamanhos do ícone de gear.

O que fazia o sintoma variar de slot para slot era a cor nativa de cada arquivo:

| Origem | Cor nativa | Sem filtro |
|---|---|---|
| `icons/gear/*.svg` (Katana, Longo Alcance, Amuleto) | sem `fill` → preto | somem no tema **escuro** |
| `icons/ghost_weapons/*.svg` (as duas Armas Fantasma) | `fill="#fff"` → branco | somem no tema **claro** |

O filtro do tema resolve os dois casos de uma vez porque começa por `brightness(0)`: zera qualquer cor de origem para preto, e no tema escuro inverte para branco. Preto ou branco na origem, o resultado é o mesmo.

### Correção
O filtro deixou de ser um parâmetro em cada chamada e passou a ser **derivado da extensão do arquivo**, marcada no `loadImg`. A separação é perfeita no projeto: `GEAR_ICON` e `CLASS_ICON` são 100% `.svg` e levam filtro; `TECH_ICON` e `CLASS_TECH_FALLBACK` são 100% `.png` e não podem levar (armadilha 3). Os cinco pontos de chamada perderam o argumento e passaram a acertar sozinhos.

Trocar os cinco `false` por `true` também resolveria hoje — e deixaria a decisão copiada em cinco lugares, esperando o próximo ícone acrescentado com o valor errado.

### O diagnóstico errado, e o que ele ensina
A primeira hipótese, escrita na `spec0015`, foi que os SVG não tinham dimensão intrínseca e por isso não pintavam. A spec exigia **diagnosticar antes de corrigir**, o executor rodou o teste, ele contradisse a hipótese, e a execução parou ali — sem aplicar nada.

O que induziu ao erro foi a leitura de um padrão: nas capturas em tema claro, dois ícones apareciam e três não. "Alguns sim, outros não" parece diferença **entre arquivos**, e daí a hipótese sobre o conteúdo dos arquivos. Era diferença **entre a cor de cada arquivo e o fundo** — a mesma coisa vista do outro lado.

Três coisas valem ficar:
1. **A resposta já estava no repositório.** A armadilha 15 descreve exatamente este defeito e foi escrita neste mesmo projeto três specs antes. Diagnosticar sem reler as armadilhas foi o erro de método.
2. **Um sintoma que varia entre itens não implica causa nos itens.** Pode ser uma causa única interagindo com uma propriedade que varia — aqui, um filtro ausente encontrando cores de origem diferentes.
3. **O portão de diagnóstico pagou por si.** Sem ele, a correção errada teria entrado, não teria consertado nada, e ainda teria acrescentado código inútil ao `loadImg`. Vale repetir o padrão sempre que a causa for hipótese e não observação: descreva o teste, descreva como interpretar cada resultado, e mande parar quando contradisser.

---

## FIX-013 — Rótulos sobrescritos pelo ícone e pelo nome na imagem gerada

**Data:** 2026-07-25 · **Gravidade:** baixa (legibilidade)

### Sintoma
Na imagem, *Vantagem I/II/III* e os rótulos de slot apareciam por baixo do ícone e do nome da linha seguinte.

### Causa raiz
Aritmética de linha de base. `fillText` posiciona pela **base**, e o ícone era desenhado a partir de `y − 18 + 4`, ou seja 14 px **acima** da base da própria linha. Com avanço de 12 px depois do rótulo, o topo do ícone caía 2 px acima da base do rótulo e o topo das maiúsculas do nome caía exatamente sobre ela.

### Correção
Avanço de 20 px depois dos rótulos e de 18 px depois dos divisores de seção — o mínimo para o ícone limpar a linha anterior é 18.

### Nota
O defeito não apareceu na simulação de altura da `spec0014` porque **as duas passadas concordavam**: a sobreposição é colisão dentro de uma linha, não erro de altura acumulada. Medir bem a altura não diz nada sobre colisão dentro da faixa medida.
```

---

## Parte 6 — `meta/CONTEXT.md`

**Âncora** (fim da armadilha 15, última da lista):

```
15. **O canvas não herda filtro CSS.** Na tela, os SVG de classe ficam brancos por `iconFilter: 'brightness(0) invert(1)'`. `ctx.drawImage` ignora isso: o ícone entra com a cor original e some no fundo escuro. Quem desenhar ícone no canvas precisa aplicar `ctx.filter` à mão e zerá-lo depois — **e nunca no PNG de técnica**, onde o filtro vira retângulo sólido (armadilha 3). A regra da UI vale igual dentro do canvas. Ver DEC-026, defeito D3.
```

**Substituir por:**

```
15. **O canvas não herda filtro CSS.** Na tela, os SVG ficam monocromáticos por `filter: T.iconFilter`. `ctx.drawImage` ignora isso: o ícone entra com a cor original do arquivo. **A regra é por tipo de arquivo, e no projeto ela é limpa:** `GEAR_ICON` e `CLASS_ICON` são 100% `.svg` e **levam** o filtro; `TECH_ICON` e `CLASS_TECH_FALLBACK` são 100% `.png` e **não podem** levar — viram retângulo sólido (armadilha 3). Hoje `pen.icon` deriva isso da extensão, marcada no `loadImg`; não volte a decidir por parâmetro em cada chamada. Ver DEC-026 (D3) e FIX-012.

16. **Ícone sem filtro some em um dos temas, e qual deles depende do arquivo.** Os SVG de `icons/gear/` não declaram `fill` (default preto) e os de `icons/ghost_weapons/` declaram `fill="#fff"`. Sem filtro, os primeiros somem no tema escuro e os segundos no claro — o que faz o defeito parecer "alguns ícones estão faltando" e mandar a investigação para o arquivo errado. **Sintoma que varia entre itens não implica causa nos itens:** pode ser uma causa única encontrando uma propriedade que varia. Ver FIX-012.
```

> **Atenção à renumeração:** as armadilhas que a `spec0015` chamaria de 16 e 17 mudam de número. As duas entradas abaixo entram **depois** da nova 16, como **17** e **18**.

**Âncora** (a linha em branco e o fim da seção de armadilhas — cole as duas novas logo após o bloco acima):

Acrescente, na sequência:

```
17. **`transform` num ancestral captura os filhos `position: fixed`.** Elemento fixo se posiciona pela janela e não entra no `overflow` de ninguém — **exceto** se algum ancestral tiver `transform`, `filter` ou `perspective`, que passam a ser o bloco-contenedor dele. Foi o que criou a barra de rolagem fantasma no modal (FIX-011). Centralize sobreposições por **flexbox**, não por `translate(-50%,-50%)`, sempre que houver `Tooltip` ou qualquer flutuante dentro.

18. **Medir altura não detecta colisão.** A simulação de duas passadas da Fase 3 acerta a altura total e não diz nada sobre elementos que se sobrepõem *dentro* da faixa medida — foi assim que o FIX-013 passou. Conferência de imagem precisa de olho, não só de número.
```

---

## Parte 7 — `meta/CHANGELOG.md`

**Âncora** (primeira linha da subseção «### Corrigido»):

```
- Picada Celestial não obrigava o Ronin a gastar o perk de desbloqueio, ao contrário da Zarabatana (FIX-009)
```

**Substituir por:**

```
- Barra de rolagem fantasma no modal de configurações: um retângulo cinza surgia ao passar o cursor sobre as opções e deslocava o conteúdo (FIX-011)
- Na imagem gerada, os ícones de equipamento saíam na cor original em vez da cor do tema — os de gear sumiam no tema escuro e os de Arma Fantasma no tema claro (FIX-012)
- Na imagem gerada, os rótulos de tier e de slot saíam por baixo do ícone e do nome da linha seguinte (FIX-013)
- Picada Celestial não obrigava o Ronin a gastar o perk de desbloqueio, ao contrário da Zarabatana (FIX-009)
```

**Âncora** (a subseção «### Removido»):

```
### Removido
```

**Substituir por:**

```
### Modificado
- No modo 2 Colunas, os nomes das vantagens de classe não quebram mais em duas linhas: a célula da grade passou de 190 px e o nome ganhou `nowrap`. O comentário anterior afirmava que 140 px já evitavam a quebra — não evitavam.

### Removido
```

---

## Parte 8 — `meta/STATUS.md`

**Âncora** (último parágrafo do arquivo):

```
**Próximo passo — e agora há uma escolha real.** A F4 (polimento e mobile) é a fase seguinte no `ROADMAP.md`. Mas há uma decisão marcada para agora: com a imagem funcionando, dá para comparar os dois formatos do modo Estatístico lado a lado e decidir o destino dele (DEC-024). Vale fazer isso antes de abrir a F4 — é a informação que estava faltando, e ela chegou.
```

**Substituir por:**

```
**Próximo passo — e agora há uma escolha real.** A F4 (polimento e mobile) é a fase seguinte no `ROADMAP.md`. Mas há uma decisão marcada para agora: com a imagem funcionando, dá para comparar os dois formatos do modo Estatístico lado a lado e decidir o destino dele (DEC-024). Vale fazer isso antes de abrir a F4 — é a informação que estava faltando, e ela chegou.

---

**2026-07-25 / 26 — conferência de uso da Fase 3: quatro correções, e um diagnóstico refeito.**

O autor gerou as três imagens e os três textos e relatou o que viu. **O FIX-010 está confirmado em uso**: a recarga das Armas Fantasma aparece (`[90s]`) e o Supremo sai com o resumo por classe (`Alvos: 5 · Custo: 3★`).

Quatro defeitos, todos com causa raiz:

- **FIX-011 — o retângulo no modal.** Era uma barra de rolagem horizontal, e a causa não estava no `Tooltip`: o modal se centralizava com `transform`, e **um ancestral com `transform` vira o bloco-contenedor dos filhos `position: fixed`**. Corrigido com flexbox — o que de quebra conserta o desalinhamento do tooltip, que era o segundo sintoma da mesma causa. Virou a armadilha 17.
- **FIX-012 — ícones de equipamento invisíveis. Diagnosticado errado na primeira tentativa.** A `spec0015` supôs SVG sem dimensão intrínseca; o portão de diagnóstico da própria spec derrubou a hipótese e a execução parou sem aplicar nada. A causa real era a armadilha 15 — o canvas não herda filtro CSS —, e o que fazia o sintoma variar de slot para slot era a cor nativa de cada arquivo: gear é preto e some no tema escuro, Arma Fantasma é branco e some no claro. Corrigido derivando o filtro da **extensão** do arquivo, não de um parâmetro por chamada.
- **FIX-013 — rótulos sobrescritos.** Aritmética de linha de base: o ícone é desenhado 14 px acima da base e o avanço depois do rótulo era de 12.
- **Quebra de nome no 2-col.** O comentário do código afirmava que `minmax(140px)` evitava a quebra; o pior nome do jogo (*Armas Fantasma Melhoradas*, 25 caracteres) precisa de ~190 px.

**A lição da sessão é de método, não de código.** A resposta do FIX-012 estava no `CONTEXT.md` deste projeto, escrita três specs antes, e o diagnóstico não a releu. O que evitou o estrago foi o portão — *diagnostique, e pare se contradisser* —, que existe na spec justamente para hipótese que não pôde ser observada. Virou regra: causa por hipótese vem com teste e com instrução de parada.

**Decisão do autor registrada:** o **modo Estatístico fica**. A dúvida da DEC-024 vinha dos defeitos que insistiam nele, não do recurso — e os defeitos acabaram.

**Em aberto:** o refinamento de layout da imagem. O diagnóstico é que a imagem **não preenche o espaço** — no modo Build a coluna esquerda termina com metade da altura da direita — e que falta a "caixas e formatação" do pedido original. A direção foi apresentada ao autor com duas opções e aguarda escolha; ver o item no `IDEAS.md`.
```

---

## Parte 9 — `meta/IDEAS.md`

### 9.1 — Encerrar a pergunta do modo Estatístico

**Âncora:**

```
3. **Modo Estatístico** — **adiado de propósito, com data.** Como texto o modo é fraco; como imagem pode ser o principal, já que a tabela calculada é o diferencial do projeto. A decisão acontece quando a Fase 3 permitir comparar os dois formatos lado a lado. Custo de esperar: zero.
```

**Substituir por:**

```
3. **Modo Estatístico** — **encerrado em 2026-07-25: fica.** O autor esclareceu que a dúvida vinha dos defeitos que insistiam nele, não do recurso. Com a Fase 3 entregue e o FIX-005 e o FIX-010 aplicados, os defeitos acabaram e a dúvida com eles.

### 2026-07-25 — Refinar o layout da imagem gerada *(proposta, aguardando direção do autor)*
A Fase 3 entregou uma imagem correta e **mal distribuída**. Três diagnósticos:

1. **Não preenche o espaço.** As duas colunas têm conteúdos muito diferentes: no modo Build a esquerda tem ~7 linhas e a direita ~30, então a metade inferior esquerda fica vazia. O pedido original dizia, com estas palavras, *"podendo preencher bem o espaço da imagem"*.
2. **Falta a caixa.** O mesmo pedido dizia *"com caixas e formatação, e não só o texto bruto um atrás do outro"*, e o `ROADMAP.md` da F3 repetia. O que saiu é texto corrido em duas colunas.
3. **Falta o cabeçalho de estado.** HP, Determinação e o contador de Magistrais são a primeira coisa que a interface mostra e não estão na imagem em modo nenhum.

**Direção proposta — bandas:** habilidade e vantagens numa faixa de largura total abaixo do cabeçalho (quatro cartões lado a lado), equipamentos abaixo em duas colunas de cartões, e a faixa de estatísticas ao pé.

**A bifurcação:** o pedido original descrevia **três colunas** — *"Habilidades e vantagens em uma coluna, equipamentos em outra, e estatísticas em outra"*. Aquilo veio da tela, onde cada coluna rola por conta própria e altura desigual não custa nada; numa imagem de altura fixa, custa. A escolha é do autor.
```

### 9.2 — Feedback de método

**Âncora** (último item do «Feedback para o Kit», antes da seção de correções de processo):

```
### Três perguntas ao autor seguem em aberto
```

**Substituir por:**

```
### 2026-07-26 — Hipótese de causa precisa vir com teste e com instrução de parada
A `spec0015` diagnosticou o FIX-012 a partir de capturas de tela e chegou à causa errada. O que impediu o estrago foi um portão escrito na própria spec: *rode este teste, interprete assim, e **pare** se contradisser*. O executor rodou, contradisse, parou, e trouxe a causa real — sem aplicar código inútil.

**Regra que fica, e que vale para o kit:** quando a causa de um defeito é **hipótese** e não observação — porque quem escreveu a spec não pôde rodar o sistema —, a spec não deve mandar corrigir. Deve mandar **diagnosticar**, dizer o que cada resultado significa, e mandar parar no caso de divergência. O custo é um passo a mais; o benefício é não gravar uma causa errada nos `meta/`, que é um estrago que sobrevive ao commit.

Vale a nota complementar: a resposta certa já estava no `CONTEXT.md` do projeto, na armadilha 15, escrita três specs antes. **Reler as armadilhas antes de formular uma hipótese** deveria ser parte do ritual de diagnóstico, não do de escrita.

### Três perguntas ao autor seguem em aberto
```

---

## Parte 10 — `logs/2026-07-26.md`

**Crie** o arquivo com este conteúdo:

```markdown
# Log — 2026-07-26

## Sessão 1 — FIX-012 rediagnosticado e fechamento da spec0015

### Objetivo da sessão
Retomar a `spec0015`, travada no portão de diagnóstico da Parte 4, com a causa real do FIX-012.

### Feito
- Lidos os dois relatórios da sessão anterior: Partes 2, 3 e 5 aplicadas e não commitadas; Parte 4 travada.
- Confirmada a causa real com duas evidências independentes: o relato do autor (gear sempre preto, Arma Fantasma sempre branca, e cada um some num tema) e o código da interface, que aplica `filter: T.iconFilter` nos dois tamanhos do ícone de equipamento enquanto o canvas não aplicava em nenhum.
- Verificado que a separação por tipo de arquivo é limpa no projeto inteiro: `GEAR_ICON` e `CLASS_ICON` 100% `.svg`, `TECH_ICON` e `CLASS_TECH_FALLBACK` 100% `.png`.
- Entregue a `spec0016`, que substitui a Parte 4 da `spec0015` e retoma build, conferência e documentação.

### Specs entregues / aplicadas
- `260726-spec0016-fix012-filtro-de-icone.md` — corrige o FIX-012 derivando o filtro da extensão do arquivo; registra FIX-011, FIX-012 e FIX-013; armadilhas 16, 17 e 18; fecha a pergunta do modo Estatístico.

### Decisões
- O filtro de ícone no canvas deixa de ser parâmetro por chamada e passa a ser **derivado do tipo de arquivo**. Trocar os cinco `false` por `true` resolveria hoje e manteria a decisão copiada em cinco lugares.

### Bugs
- **FIX-012** — causa real: filtro de tema não aplicado aos ícones de equipamento no canvas. A hipótese anterior (SVG sem dimensão intrínseca) foi descartada por teste ao vivo.

### Aprendizados / armadilhas
- **A resposta estava no repositório.** A armadilha 15 descreve exatamente este defeito e foi escrita neste projeto três specs antes do diagnóstico errado. Reler as armadilhas pertence ao ritual de diagnóstico.
- **Sintoma que varia entre itens não implica causa nos itens.** "Alguns ícones aparecem, outros não" era uma causa única (filtro ausente) encontrando uma propriedade que varia (a cor nativa do arquivo). Virou a armadilha 16.
- **Portão de diagnóstico paga por si.** Sem ele, a correção errada teria entrado sem consertar nada. Virou item de feedback ao kit.

### Onde parei
`spec0016` entregue. As quatro correções fecham num commit de código só.

### Próximos passos
1. Decidir a direção do layout da imagem — bandas ou três colunas — e escrever a spec do redesenho.
2. F4 — polimento e mobile.
3. Backlog: destino de `getAvailableProps` / `getAvailablePerks`, duplicação de `selectTech` / `selectAbility`, cópias soltas de `GUIA_COMPLETO*.md` fora do repo, `.claude/launch.json`.
```

---

## Parte 11 — Fechamento

Rode `git diff`. O commit de código da Parte 4 já deve estar feito; agora o de documentação:

```
git add meta/DECISIONS.md meta/CONTEXT.md meta/CHANGELOG.md meta/STATUS.md meta/IDEAS.md logs/2026-07-26.md meta/specs/260726-spec0016-fix012-filtro-de-icone.md
git commit -m "docs(meta): registra FIX-011 a FIX-013 e as armadilhas 16 a 18"
git push
```

> A `spec0015` fica no repositório como está, com a Parte 4 errada. **Não a edite** — spec aplicada não se apaga, e esta aqui declara no cabeçalho que a substitui. O erro dela é parte do registro.
