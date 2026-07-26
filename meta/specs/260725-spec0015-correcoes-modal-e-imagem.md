# spec0015 — Retângulo no modal, sobreposição de rótulos na imagem, ícones que não pintam e quebra de nome no 2-col

**Data:** 2026-07-25 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner`

**Por que esta spec existe:** a Fase 3 entrou e a conferência de uso encontrou quatro defeitos — três na imagem e na interface, um antigo. Todos têm causa raiz identificada, e duas delas são interessantes o bastante para virarem armadilha.

**Não inclui o refinamento de layout da imagem.** Esse é uma decisão de desenho com uma bifurcação real e foi apresentada à parte, para o autor decidir a direção antes de reescrever o `paintBuildImage`.

**Esta spec toca código.** Rode `npm run build` e siga a conferência da Parte 6. **Dois commits:** código e documentação.

**Regras de execução:**
- Nenhum `--force`, `rebase` ou `reset --hard`.
- Se **uma** âncora que seja não for encontrada exatamente: **PARE e reporte qual falhou.**
- A Parte 4 tem um passo de **diagnóstico antes da correção**. Não pule: se o diagnóstico contradisser a hipótese, **PARE e reporte** em vez de aplicar o resto da Parte 4.

---

## Parte 1 — Levantamento

```
git branch --show-current
git status
```

1. Estamos na `v2-planner`? Se não, **PARE**.
2. Há algo modificado e não commitado? Liste.

---

## Parte 2 — `src/App.jsx`: o retângulo no modal de configurações (FIX-011)

**O que o autor vê:** ao passar o cursor sobre uma opção do modal, aparece um retângulo cinza no pé da janela e o conteúdo se desloca; ao tirar o cursor, some e desloca de volta.

**O que é:** uma **barra de rolagem horizontal**. E a causa não está no `Tooltip` — está numa linha do próprio modal.

O `Tooltip` usa `position: 'fixed'`, e elemento fixo normalmente se posiciona pela janela do navegador, sem entrar no `overflow` de ancestral nenhum. **Só que um ancestral com `transform` passa a ser o bloco-contenedor dos descendentes fixos** — e o modal tem `transform: translate(-50%, -50%)` para se centralizar. Com isso o tooltip vira conteúdo do modal para efeito de rolagem, estoura a largura de 360 px e o navegador cria a barra horizontal. A barra ocupa altura, e é isso que empurra o conteúdo.

De quebra, a mesma causa desalinha o tooltip: as coordenadas vêm de `getBoundingClientRect` (relativas à janela) e passam a ser interpretadas como relativas ao modal.

**A correção é tirar o `transform`** e centralizar por flexbox.

### 2.1 — Abertura

**Âncora:**

```
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 900,
        background: T.panel, border: `1px solid ${T.borderHov}`,
        borderRadius: 13, padding: '16px 18px',
        width: 360, maxWidth: '92vw',
        boxShadow: '0 20px 56px rgba(0,0,0,0.75)',
        maxHeight: '88vh', overflowY: 'auto',
      }}>
```

**Substituir por:**

```
      {/*
        Centralizacao por FLEXBOX, sem transform — e proposital, nao estilo.
        Um transform aqui torna este elemento o bloco-contenedor dos filhos
        `position: fixed`, e o Tooltip e fixed: ele passaria a contar no
        overflow do modal, criando uma barra de rolagem horizontal que empurra
        o conteudo a cada hover. Ver FIX-011 e a armadilha 16.
        `pointerEvents: none` no envelope deixa o clique fora do modal chegar
        ao backdrop, que e quem fecha.
      */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 900,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
      <div style={{
        pointerEvents: 'auto',
        background: T.panel, border: `1px solid ${T.borderHov}`,
        borderRadius: 13, padding: '16px 18px',
        width: 360, maxWidth: '92vw',
        boxShadow: '0 20px 56px rgba(0,0,0,0.75)',
        maxHeight: '88vh', overflowY: 'auto', overflowX: 'hidden',
      }}>
```

### 2.2 — Fechamento

O envelope novo precisa de um `</div>` a mais.

**Âncora:**

```
              : 'Implementação técnica: Claude (Anthropic AI)'}
          </div>
        </div>
      </div>
    </>
```

**Substituir por:**

```
              : 'Implementação técnica: Claude (Anthropic AI)'}
          </div>
        </div>
      </div>
      </div>
    </>
```

---

## Parte 3 — `src/App.jsx`: nome de vantagem sem quebra no modo 2 colunas

O comentário do container afirma que `minmax(140px, 1fr)` "evita quebra de nome". **Não evita.** Descontando padding (20), ícone (18) e espaçamento (7), sobram ~95 px de texto — e a vantagem de nome mais longo do jogo, *Armas Fantasma Melhoradas*, tem 25 caracteres e precisa de cerca de 150 px a 12 px. Daí as quebras que o autor vê em *Identificação Precisa*, *Cheiro de Sangue* e *Flecha Perfurante*.

A correção é dupla, e nenhuma das duas sozinha resolve: alargar a célula para caber o pior caso, e proibir a quebra para o caso de a janela ficar estreita demais.

> **Armadilha 13:** mexer no layout de um modo pede conferir o outro. Aqui só o ramo `two-col` muda — o `three-col` empilha em coluna única de 300 px e continua como está. **Confira os dois assim mesmo.**

### 3.1 — Largura da célula

**Âncora:**

```
            <div style={layoutMode === 'two-col' ? {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 4,
            } : {
```

**Substituir por:**

```
            <div style={layoutMode === 'two-col' ? {
              display: 'grid',
              // 190px cabe o nome mais longo do jogo ("Armas Fantasma
              // Melhoradas", 25 caracteres) em uma linha, ja descontando
              // padding, icone e gap. O `1fr` faz as celulas esticarem, entao
              // nao sobra buraco quando cabem menos por linha.
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              gap: 4,
            } : {
```

### 3.2 — Proibir a quebra

**Âncora:**

```
            <span style={{
              fontSize: 12, fontWeight: isAct ? 700 : 400,
              color: isAct ? T.text : T.muted,
            }}>
              {name}
              {isBlocked && ' 🔒'}
            </span>
```

**Substituir por:**

```
            <span style={{
              fontSize: 12, fontWeight: isAct ? 700 : 400,
              color: isAct ? T.text : T.muted,
              // No 2-col os botoes ficam lado a lado numa grade: quebrar o
              // nome no meio nao faz sentido. A reticencia so aparece em
              // janela muito estreita — a celula de 190px cobre o pior nome.
              ...(rowLayoutMode === 'two-col' ? {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
              } : {}),
            }}>
              {name}
              {isBlocked && ' 🔒'}
            </span>
```

---

## Parte 4 — `src/App.jsx`: ícones de equipamento que não pintam na imagem (FIX-012)

**O que o autor vê:** na imagem gerada, Katana e Longo Alcance aparecem com ícone; Amuleto, Arma Fantasma I e Arma Fantasma II, não. As vantagens (PNG) aparecem todas.

**Hipótese:** os ícones de gear são **SVG**, e um SVG cujo elemento raiz não declara `width`/`height` não tem dimensão intrínseca. O `<img>` da interface pinta assim mesmo, porque o CSS resolve o tamanho — o canvas não: `drawImage` simplesmente não pinta nada, sem erro e sem `onerror`. Como a coleção de ícones veio de fontes variadas, é esperado que alguns arquivos tenham as dimensões e outros não.

Isso explica todo o quadro: PNG de técnica sempre funciona (raster tem dimensão intrínseca), e entre os SVG uns funcionam e outros não.

### 4.1 — Diagnóstico, ANTES de corrigir

Abra o dev server, gere uma imagem no modo Detalhado com Amuleto e as duas Armas Fantasma equipadas, e no console rode:

```js
['/icons/gear/hunter-charm.svg','/icons/ghost_weapons/gw_sticky_bomb.svg','/icons/gear/stone-katana.svg']
  .forEach(u => { const i = new Image()
    i.onload  = () => console.log('OK  ', u, 'naturalWidth=', i.naturalWidth)
    i.onerror = () => console.log('ERRO', u, '(arquivo nao encontrado)')
    i.src = u })
```

Reporte a saída. Interprete assim:

| Saída | Significado | O que fazer |
|---|---|---|
| `OK` com `naturalWidth= 0` nos que falham | **hipótese confirmada** — SVG sem dimensão | aplique 4.2 |
| `ERRO` nos que falham | arquivo ausente, causa diferente | **PARE**, reporte a lista de URLs com erro e não aplique 4.2 |
| `OK` com `naturalWidth > 0` nos que falham | nenhuma das duas | **PARE e reporte** |

### 4.2 — Correção (só se o diagnóstico confirmar)

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
function loadImg(src, px = 128) {
  if (!src) return Promise.resolve(null)
  return new Promise(resolve => {
    const img = new Image()
    // SVG cujo elemento raiz nao declara width/height nao tem dimensao
    // intrinseca. O <img> da interface pinta assim mesmo, porque o CSS
    // resolve o tamanho; o canvas nao — drawImage nao pinta nada, sem erro e
    // sem cair no onerror. Fixar width/height aqui da a dimensao que faltava,
    // e um valor generoso mantem a rasterizacao nitida quando o desenho sai
    // em 2x. Nao atrapalha PNG: drawImage continua amostrando o raster
    // original. Ver FIX-012 e a armadilha 17.
    img.width  = px
    img.height = px
    img.onload  = () => resolve(img)
    img.onerror = () => { console.warn('[imagem da build] icone nao carregou:', src); resolve(null) }
    img.src = src
  })
}
```

### 4.3 — Relatório de ícones ausentes

Para que o próximo caso não precise de investigação manual.

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

  // Icone ausente nao derruba o desenho — mas some em silencio, e foi assim
  // que o FIX-012 passou despercebido. Avisar no console custa nada.
  const missing = keys.filter(k => !out[k])
  if (missing.length) console.warn('[imagem da build] sem icone:', missing.join(', '))

  return out
}
```

---

## Parte 5 — `src/App.jsx`: rótulos sobrescritos na imagem (FIX-013)

**O que o autor vê:** na imagem, *Vantagem I/II/III* e os rótulos de slot (*Katana*, *Amuleto*…) aparecem por baixo do ícone e do nome que vêm logo abaixo.

**Causa:** aritmética de linha de base. O rótulo é escrito com a base em `y`; o cursor anda **12 px**; e o ícone é desenhado a partir de `y' − 18 + 4`, ou seja **14 px acima** da nova base. Resultado: o topo do ícone cai 2 px **acima** da base do rótulo, e o topo das maiúsculas do nome cai exatamente sobre ela. Sobrepõem os dois, que é precisamente o que o autor descreveu.

Para o ícone respirar são necessários pelo menos 18 px de avanço; a correção usa 20. Os avanços de 14 px depois dos divisores de seção também sobem para 18 pelo mesmo motivo — lá o ícone encosta na linha divisória.

> São **quatro** substituições de uma linha cada. As duas primeiras (`ly += 14` e `ry += 14`) aparecem em contextos diferentes; use os blocos com contexto abaixo para não trocar uma pela outra.

### 5.1 — Divisor da coluna esquerda

**Âncora:**

```
  pen.text(L ? 'CLASS ABILITY & PERKS' : 'HABILIDADE & VANTAGENS', leftX, ly,
    { font: `700 10px ${IMG_FONT}`, color: T.muted, lineH: 15 })
  ly += 15
  pen.divider(leftX, ly, colX - IMG_PAD, T.border)
  ly += 14
```

**Substituir por:**

```
  pen.text(L ? 'CLASS ABILITY & PERKS' : 'HABILIDADE & VANTAGENS', leftX, ly,
    { font: `700 10px ${IMG_FONT}`, color: T.muted, lineH: 15 })
  ly += 15
  pen.divider(leftX, ly, colX - IMG_PAD, T.border)
  // 18 e o minimo para o icone da linha seguinte nao encostar no divisor:
  // ele e desenhado 14px acima da base. Ver FIX-013.
  ly += 18
```

### 5.2 — Rótulo de tier das vantagens

**Âncora:**

```
    pen.text(L ? `Perk ${tier}` : `Vantagem ${tier}`, leftX, ly,
      { font: `600 9px ${IMG_FONT}`, color: T.dim, lineH: 12 })
    ly += 12
```

**Substituir por:**

```
    pen.text(L ? `Perk ${tier}` : `Vantagem ${tier}`, leftX, ly,
      { font: `600 9px ${IMG_FONT}`, color: T.dim, lineH: 12 })
    // O icone da linha seguinte sobe 14px acima da base, e o topo das
    // maiusculas do nome, 12px. Com avanco de 12 os dois caiam em cima do
    // rotulo. Ver FIX-013.
    ly += 20
```

### 5.3 — Divisor da coluna de equipamentos

**Âncora:**

```
  pen.text(L ? 'GEAR' : 'EQUIPAMENTOS', rightX, ry,
    { font: `700 10px ${IMG_FONT}`, color: T.muted, lineH: 15 })
  ry += 15
  pen.divider(rightX, ry, IMG_W - IMG_PAD, T.border)
  ry += 14
```

**Substituir por:**

```
  pen.text(L ? 'GEAR' : 'EQUIPAMENTOS', rightX, ry,
    { font: `700 10px ${IMG_FONT}`, color: T.muted, lineH: 15 })
  ry += 15
  pen.divider(rightX, ry, IMG_W - IMG_PAD, T.border)
  ry += 18   // mesma razao do divisor da coluna esquerda (FIX-013)
```

### 5.4 — Rótulo de slot dos equipamentos

**Âncora:**

```
    pen.text(slotLabels[slot], rightX, ry, { font: `600 9px ${IMG_FONT}`, color: T.dim, lineH: 12 })
    ry += 12
```

**Substituir por:**

```
    pen.text(slotLabels[slot], rightX, ry, { font: `600 9px ${IMG_FONT}`, color: T.dim, lineH: 12 })
    ry += 20   // mesma razao do rotulo de tier (FIX-013)
```

---

## Parte 6 — Build e conferência

Rode `npm run build`. Se falhar, **PARE**.

Depois, no dev server:

**Modal (FIX-011)**
1. Abra as Configurações e passe o cursor por **3 Colunas**, **2 Colunas**, **Compacto** e **Expandido**. **Nenhum retângulo cinza no pé da janela, e nada se desloca.** É o defeito relatado.
2. O tooltip aparece **logo abaixo do botão apontado**, não deslocado. Era o segundo sintoma da mesma causa.
3. O modal continua **centralizado** na tela, e clicar fora continua fechando.
4. Reduza a janela até o modal ficar mais alto que a tela: a rolagem **vertical** continua funcionando.

**Vantagens no 2-col (Parte 3)**
5. Modo **2 Colunas**: nenhum nome de vantagem quebra em duas linhas — confira *Identificação Precisa*, *Cheiro de Sangue*, *Flecha Perfurante* e, no Ronin, *Armas Fantasma Melhoradas*.
6. Modo **3 Colunas**: inalterado (armadilha 13).

**Imagem (FIX-012 e FIX-013)**
7. Gere 🖼️ **Detalhado** com os cinco slots preenchidos: os rótulos *Vantagem I/II/III* e os de slot estão **legíveis e separados** do ícone e do nome abaixo.
8. Na mesma imagem, **os cinco equipamentos têm ícone** — inclusive Amuleto e as duas Armas Fantasma.
9. **Console:** nenhum aviso `[imagem da build] sem icone`. Se aparecer, copie a lista e reporte — sobrou caso.
10. Os ícones de técnica **continuam nítidos**, não viraram retângulos sólidos (armadilha 3).
11. Repita nos **dois temas** e nos **dois idiomas**.

Se todos passarem, faça o **commit de código**:

```
git add src/App.jsx
git commit -m "fix(ui): corrige barra fantasma no modal, quebra de nome no 2-col e sobreposicao na imagem"
```

Não faça `push` ainda.

---

## Parte 7 — `meta/DECISIONS.md`

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

## FIX-012 — Ícones SVG de equipamento não pintavam na imagem gerada

**Data:** 2026-07-25 · **Gravidade:** média (imagem incompleta, sem erro)

### Sintoma
Na imagem gerada, Katana e Longo Alcance saíam com ícone; Amuleto e as duas Armas Fantasma, sem. Na interface, todos apareciam. Nenhum erro no console.

### Causa raiz
SVG cujo elemento raiz não declara `width`/`height` **não tem dimensão intrínseca**. O `<img>` da interface pinta assim mesmo, porque o CSS resolve o tamanho; o canvas não — `drawImage` não pinta nada, não lança e não dispara `onerror`, porque a imagem **carregou** com sucesso. Como a coleção de ícones veio de fontes variadas, uns arquivos trazem as dimensões e outros não.

É a explicação que fecha o quadro inteiro: PNG de técnica sempre funcionou (raster tem dimensão intrínseca), e entre os SVG uns funcionavam e outros não — sem padrão de pasta, de prefixo ou de tipo de item.

### Correção
`loadImg` passou a fixar `img.width` e `img.height` antes do `src`, dando ao SVG a dimensão que faltava. O valor é generoso (128) de propósito: o desenho sai em 2x, e rasterizar pequeno para depois ampliar borraria. Não afeta PNG — `drawImage` continua amostrando o raster original.

`loadBuildIcons` ganhou um aviso de console listando os ícones que voltaram nulos, para que o próximo caso não precise de investigação.

### Por que passou despercebido
Pelo mesmo motivo do FIX-010: **a saída não tem quem reclame.** O `onerror` que resolve `null` foi escrito para que um ícone ausente não derrubasse o desenho — e cumpriu isso bem demais, porque este caso nem chegava lá. Virou a armadilha 17.

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
O defeito não apareceu na simulação de altura da spec0014 porque **as duas passadas concordavam**: a sobreposição é horizontal-vertical dentro de uma linha, não erro de altura acumulada. Medir bem a altura não diz nada sobre colisão dentro da faixa medida.
```

---

## Parte 8 — `meta/CONTEXT.md`

**Âncora** (fim da armadilha 15, última da lista de armadilhas):

```
15. **O canvas não herda filtro CSS.** Na tela, os SVG de classe ficam brancos por `iconFilter: 'brightness(0) invert(1)'`. `ctx.drawImage` ignora isso: o ícone entra com a cor original e some no fundo escuro. Quem desenhar ícone no canvas precisa aplicar `ctx.filter` à mão e zerá-lo depois — **e nunca no PNG de técnica**, onde o filtro vira retângulo sólido (armadilha 3). A regra da UI vale igual dentro do canvas. Ver DEC-026, defeito D3.
```

**Substituir por:**

```
15. **O canvas não herda filtro CSS.** Na tela, os SVG de classe ficam brancos por `iconFilter: 'brightness(0) invert(1)'`. `ctx.drawImage` ignora isso: o ícone entra com a cor original e some no fundo escuro. Quem desenhar ícone no canvas precisa aplicar `ctx.filter` à mão e zerá-lo depois — **e nunca no PNG de técnica**, onde o filtro vira retângulo sólido (armadilha 3). A regra da UI vale igual dentro do canvas. Ver DEC-026, defeito D3.

16. **`transform` num ancestral captura os filhos `position: fixed`.** Elemento fixo se posiciona pela janela e não entra no `overflow` de ninguém — **exceto** se algum ancestral tiver `transform`, `filter` ou `perspective`, que passam a ser o bloco-contenedor dele. Foi o que criou a barra de rolagem fantasma no modal (FIX-011). Centralize sobreposições por **flexbox**, não por `translate(-50%,-50%)`, sempre que houver `Tooltip` ou qualquer flutuante dentro.

17. **SVG sem `width`/`height` no elemento raiz não pinta no canvas.** Sem dimensão intrínseca, `drawImage` não desenha nada — e não lança, e não cai no `onerror`, porque a imagem carregou. Na interface o mesmo arquivo aparece normalmente, porque o CSS resolve o tamanho: **"funciona na tela" não garante que funciona no canvas.** Fixe `img.width`/`img.height` antes do `src`. Ver FIX-012.
```

---

## Parte 9 — `meta/CHANGELOG.md`

**Âncora** (as duas primeiras linhas da subseção «### Corrigido»):

```
- No texto exportado, a recarga das Armas Fantasma não aparecia e o Supremo saía sem a contagem de golpes nem o bônus de dano (FIX-010)
```

**Substituir por:**

```
- Barra de rolagem fantasma no modal de configurações: um retângulo cinza surgia ao passar o cursor sobre as opções e deslocava o conteúdo (FIX-011)
- Ícones de Amuleto e das Armas Fantasma não apareciam na imagem gerada (FIX-012)
- Na imagem gerada, os rótulos de tier e de slot saíam por baixo do ícone e do nome da linha seguinte (FIX-013)
- No texto exportado, a recarga das Armas Fantasma não aparecia e o Supremo saía sem a contagem de golpes nem o bônus de dano (FIX-010)
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

## Parte 10 — `meta/STATUS.md`

**Âncora** (último parágrafo do arquivo):

```
**Próximo passo — e agora há uma escolha real.** A F4 (polimento e mobile) é a fase seguinte no `ROADMAP.md`. Mas há uma decisão marcada para agora: com a imagem funcionando, dá para comparar os dois formatos do modo Estatístico lado a lado e decidir o destino dele (DEC-024). Vale fazer isso antes de abrir a F4 — é a informação que estava faltando, e ela chegou.
```

**Substituir por:**

```
**Próximo passo — e agora há uma escolha real.** A F4 (polimento e mobile) é a fase seguinte no `ROADMAP.md`. Mas há uma decisão marcada para agora: com a imagem funcionando, dá para comparar os dois formatos do modo Estatístico lado a lado e decidir o destino dele (DEC-024). Vale fazer isso antes de abrir a F4 — é a informação que estava faltando, e ela chegou.

---

**2026-07-25 (4) — conferência de uso da Fase 3: quatro correções.**

O autor gerou as três imagens e os três textos e relatou o que viu. **O FIX-010 está confirmado em uso**: a recarga das Armas Fantasma aparece (`[90s]`) e o Supremo sai com o resumo por classe (`Alvos: 5 · Custo: 3★`).

Quatro defeitos, todos com causa raiz encontrada:

- **FIX-011 — o retângulo no modal.** Era uma barra de rolagem horizontal, e a causa não estava no `Tooltip`: o modal se centralizava com `transform`, e **um ancestral com `transform` vira o bloco-contenedor dos filhos `position: fixed`**. O tooltip passou a contar no overflow do modal. Corrigido centralizando por flexbox — o que de quebra conserta o desalinhamento do tooltip, que era o segundo sintoma da mesma causa. Virou a armadilha 16.
- **FIX-012 — ícones de gear ausentes na imagem.** SVG sem `width`/`height` no elemento raiz não tem dimensão intrínseca: `drawImage` não pinta, **não lança e não cai no `onerror`**, porque a imagem carregou. Na tela o mesmo arquivo aparece, porque o CSS resolve o tamanho. Virou a armadilha 17, cuja lição é curta: *funciona na tela não garante que funciona no canvas.*
- **FIX-013 — rótulos sobrescritos.** Aritmética de linha de base: o ícone é desenhado 14 px acima da base e o avanço depois do rótulo era de 12. Vale a nota: **a simulação de altura da spec0014 não pegaria isso** — as duas passadas concordavam, porque o erro é colisão dentro da faixa, não altura acumulada.
- **Quebra de nome no 2-col.** O comentário do código afirmava que `minmax(140px)` evitava a quebra; não evitava — o pior nome do jogo (*Armas Fantasma Melhoradas*, 25 caracteres) precisa de ~190 px. Corrigido com célula maior e `nowrap`.

**Decisão do autor registrada:** o **modo Estatístico fica**. A dúvida da DEC-024 vinha dos defeitos que insistiam nele, não do recurso — e os defeitos acabaram. A pergunta 3 está encerrada.

**Em aberto, à espera de decisão:** o refinamento de layout da imagem foi levantado e apresentado ao autor como proposta, não como spec. O diagnóstico é que a imagem **não preenche o espaço** — no modo Build a coluna esquerda termina com metade da altura da direita —, e que falta a "caixas e formatação" que o pedido original descrevia. A escolha de direção é do autor; ver o item correspondente no `IDEAS.md`.
```

---

## Parte 11 — `meta/IDEAS.md`

**Âncora** (o item 3 da lista de perguntas respondidas):

```
3. **Modo Estatístico** — **adiado de propósito, com data.** Como texto o modo é fraco; como imagem pode ser o principal, já que a tabela calculada é o diferencial do projeto. A decisão acontece quando a Fase 3 permitir comparar os dois formatos lado a lado. Custo de esperar: zero.
```

**Substituir por:**

```
3. **Modo Estatístico** — **encerrado em 2026-07-25: fica.** O autor esclareceu que a dúvida vinha dos defeitos que insistiam nele, não do recurso. Com a Fase 3 entregue e o FIX-005 e o FIX-010 aplicados, os defeitos acabaram e a dúvida com eles.

### 2026-07-25 — Refinar o layout da imagem gerada *(proposta, aguardando direção do autor)*
A Fase 3 entregou uma imagem correta e **mal distribuída**. Três diagnósticos, do mais objetivo ao mais subjetivo:

1. **Não preenche o espaço.** As duas colunas têm conteúdos de tamanhos muito diferentes: no modo Build a esquerda tem ~7 linhas e a direita ~30, então a metade inferior esquerda fica vazia. O pedido original dizia, com estas palavras, *"podendo preencher bem o espaço da imagem"*.
2. **Falta a caixa.** O mesmo pedido dizia *"com caixas e formatação, e não só o texto bruto um atrás do outro"*, e o `ROADMAP.md` da F3 repetia. O que saiu é texto corrido em duas colunas, com um divisor por seção.
3. **Falta o cabeçalho de estado.** HP, Determinação e o contador de Magistrais são a primeira coisa que a interface mostra e não estão na imagem em nenhum modo — no Estatístico, HP e Determinação aparecem no meio da lista, sem destaque.

**Direção proposta — bandas em vez de duas colunas desiguais:** habilidade e vantagens numa faixa de largura total logo abaixo do cabeçalho (quatro cartões lado a lado), equipamentos abaixo em duas colunas de cartões, e a faixa de estatísticas ao pé. Distribui bem nos três modos, cresce sem desequilibrar quando as descrições entram, e entrega a "caixa" pedida.

**A bifurcação:** o pedido original descrevia **três colunas** — *"Habilidades e vantagens em uma coluna, equipamentos em outra, e estatísticas em outra"*. Aquilo veio da tela, onde cada coluna rola por conta própria e altura desigual não custa nada. Numa imagem de altura fixa, custa. A escolha é do autor.
```

---

## Parte 12 — `logs/2026-07-25.md`

**Anexe** ao final do arquivo, precedido de uma linha `---`:

```markdown
## Sessão 4 — Conferência de uso da Fase 3

### Objetivo da sessão
Conferir os textos e imagens gerados pelo autor, diagnosticar o que ele relatou e corrigir.

### Feito
- Conferidos os três textos exportados: **FIX-010 validado em uso** — recarga das Armas Fantasma presente, Supremo com resumo por classe.
- Analisadas onze imagens geradas nos dois temas, recortadas e ampliadas para localizar os defeitos.
- Diagnosticados quatro defeitos até a causa raiz.
- Medidos os nomes de vantagem de todas as classes para dimensionar a célula da grade (pior caso: 25 caracteres).
- Entregue a `spec0015` e apresentada a proposta de refinamento de layout da imagem.

### Specs entregues / aplicadas
- `260725-spec0015-correcoes-modal-e-imagem.md` — FIX-011, FIX-012 e FIX-013; célula de 190px e `nowrap` no 2-col; armadilhas 16 e 17; registro do encerramento da pergunta do modo Estatístico.

### Decisões
- **Modo Estatístico fica** (encerra a pergunta 3 da DEC-024). A dúvida vinha dos defeitos, não do recurso.
- Refinamento de layout da imagem **não entrou nesta spec**: é decisão de desenho com bifurcação real (bandas × três colunas do pedido original), levada ao autor.

### Bugs
- **FIX-011** — barra de rolagem fantasma no modal; causa: `transform` capturando filhos `fixed`.
- **FIX-012** — SVG sem dimensão intrínseca não pinta no canvas.
- **FIX-013** — sobreposição de rótulos por aritmética de linha de base.
- Quebra de nome de vantagem no 2-col; o comentário do código afirmava o contrário do que o código fazia.

### Aprendizados / armadilhas
- **`transform` num ancestral captura descendentes `fixed`** — duas propriedades inofensivas produzem um terceiro comportamento. Armadilha 16.
- **"Funciona na tela" não garante que funciona no canvas.** SVG sem dimensão: o `<img>` pinta, o `drawImage` não, e nada acusa. Armadilha 17.
- **Medir altura não detecta colisão.** A simulação da spec0014 estava certa e não pegaria o FIX-013: as duas passadas concordavam, porque o erro é dentro da faixa medida.
- **Comentário que afirma um efeito é uma asserção que ninguém testa.** O `minmax(140px)` dizia evitar a quebra e não evitava, e o comentário fez o defeito parecer resolvido.

### Onde parei
Quatro correções entregues. Refinamento de layout da imagem aguardando a direção do autor.

### Próximos passos
1. Decidir a direção do layout da imagem e, se aprovada, reescrever o `paintBuildImage`.
2. F4 — polimento e mobile.
3. Backlog: destino de `getAvailableProps` / `getAvailablePerks`, duplicação de `selectTech` / `selectAbility`, cópias soltas de `GUIA_COMPLETO*.md` fora do repo, `.claude/launch.json`.
```

---

## Parte 13 — Fechamento

Rode `git diff`. O commit de código da Parte 6 já deve estar feito; agora o de documentação:

```
git add meta/DECISIONS.md meta/CONTEXT.md meta/CHANGELOG.md meta/STATUS.md meta/IDEAS.md logs/2026-07-25.md meta/specs/260725-spec0015-correcoes-modal-e-imagem.md
git commit -m "docs(meta): registra FIX-011 a FIX-013 e as armadilhas 16 e 17"
git push
```
