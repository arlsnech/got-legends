---
title: "GOT Build - Joker"
id: "mrwsspjtln14"
created: "2026-07-23T00:53:39.545Z"
updated: "2026-07-23T00:53:39.545Z"
blocks: 6
---
# GOT Build - Joker

<!-- ENTRADA -->
**ID:** `mrwsspjtln14`  
**Criado em:** 22/07/26 21:53  
**Modificado em:** 22/07/26 21:53  
**Total de blocos:** 6  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [Bloco 1] Prompt · v1

<!-- BLOCO 1 -->
**Subtítulo:** Prompt  
**Versão:** v1  

**Conteúdo:**

<!-- CONTEUDO:INICIO bloco=1 -->
Preciso de ajuda para descobrir como corrigir uma ferramenta, pois não sei os locais para corrigir os problemas nos scripts que passei. Os problemas são que a opção de criar build aleatória não seleciona aleatóriamente props para equipamentos magistrais, os perks estão sendo escolhidos, mas os props não, funciona normalmente para os outros equipamentos normais escolher o props, mas para os magistrais ele não ta escolhendo
Por fim, me ajude a localizar TODOS os lugares para corrigir, se possível me orientando e explicando para que serve, e me dando COMPLETAMENTE TODAS AS PARTES, CóDIGOS, SCRIPTS, Linhas de códigos para corrigir, e explicando exatamente a posição (se possivel passando o antigo e o novo código) PARA TUDO, eu vou corrigir, não é para você me dar todos os scripts "corrigidos" completo para eu baixar pois tem grande chance de você mudar e estragar outras linhas que não falei para mexer. ME AJUDE A FAZER TUDO, EXPLICANDO E ENSINANDO TUDO, PASSO A PASSO
<!-- CONTEUDO:FIM bloco=1 -->

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [Bloco 2] Claude · v1

<!-- BLOCO 2 -->
**Subtítulo:** Claude  
**Versão:** v1  

**Conteúdo:**

<!-- CONTEUDO:INICIO bloco=2 -->
Encontrei o bug! Ele está **apenas no `logic.js`**, na função `randomBuild`, em **2 lugares muito próximos**. Vou te explicar tudo detalhadamente.

---

## 🔍 Diagnóstico — O que está errado e por quê

Na função `randomBuild` (linha ~974), existe um filtro para selecionar as props P1 e P2. Esse filtro tem uma condição `!chosen.leg` que significa: *"só inclui esta prop se o item NÃO for magistral"*.

Resultado: quando o item sorteado é magistral (`chosen.leg === true`), `!chosen.leg` vira `false`, e a lista de props fica **vazia** → nenhuma prop é selecionada. Como os perks não têm essa condição, eles funcionam normalmente.

---

## 🛠️ Correções — Passo a Passo

### CORREÇÃO 1 — Linha 975 (filtro do P1)

**Código antigo (com o bug):**
```js
const p1opts = effectiveItem.props.filter(p => p.sl.includes('P1') && !chosen.leg);
```

**Código novo (corrigido):**
```js
const p1opts = effectiveItem.props.filter(p => p.sl.includes('P1'));
```

**Por que funciona:** Remove a condição `&& !chosen.leg` que bloqueava a seleção de props em itens magistrais. O filtro agora só verifica se a prop é válida para o slot P1 (`p.sl.includes('P1')`), que é o único critério que importa aqui.

---

### CORREÇÃO 2 — Linhas 980–984 (filtro do P2)

**Código antigo (com o bug):**
```js
const p2opts = effectiveItem.props.filter(p =>
  p.sl.includes('P2') &&
  !chosen.leg &&
  !(p1 && p.sk === p1.sk)
);
```

**Código novo (corrigido):**
```js
const p2opts = effectiveItem.props.filter(p =>
  p.sl.includes('P2') &&
  !(p1 && p.sk === p1.sk)
);
```

**Por que funciona:** Mesmo motivo — remove `!chosen.leg`. Mantém a proteção `!(p1 && p.sk === p1.sk)` que impede P1 e P2 terem o mesmo `sk` (stat key), que é uma regra válida do jogo.

---

## 📍 Localização exata no arquivo

Ambas as correções estão dentro da função `randomBuild`, que começa na **linha 930** de `logic.js`. O trecho completo correto após as duas alterações fica assim:

```js
// P1
const p1opts = effectiveItem.props.filter(p => p.sl.includes('P1'));
const p1 = p1opts.length > 0 ? pick(p1opts) : null;
const p1val = p1 ? randomInRange(p1.mn, p1.mx, p1.u) : 0;

// P2 (bloqueando mesma sk que P1)
const p2opts = effectiveItem.props.filter(p =>
  p.sl.includes('P2') &&
  !(p1 && p.sk === p1.sk)
);
const p2 = p2opts.length > 0 ? pick(p2opts) : null;
const p2val = p2 ? randomInRange(p2.mn, p2.mx, p2.u) : 0;
```

---

## ✅ Resumo

| # | Arquivo | Linha | O que remover |
|---|---------|-------|---------------|
| 1 | `logic.js` | ~975 | `&& !chosen.leg` no filtro do P1 |
| 2 | `logic.js` | ~980–984 | `!chosen.leg &&` no filtro do P2 |

**Nenhuma alteração necessária** em `App.jsx` ou `data.js`. O problema era inteiramente essa condição equivocada que impedia props de serem selecionadas quando o item era magistral.
<!-- CONTEUDO:FIM bloco=2 -->

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [Bloco 3] Prompt · v2

<!-- BLOCO 3 -->
**Subtítulo:** Prompt  
**Versão:** v2  

**Conteúdo:**

<!-- CONTEUDO:INICIO bloco=3 -->
Corrigiu perfeitamente, mas só agora percebi um bug, caso eu selecione uma das tecnicas que aumentam o limite de magistral, e equipo magistrais até o limite, o que lindamente faz a tecnica ficar "bloqueada", acontece que se eu mudar de classe ocorre um bug, e o jogador fica com magistrais liberados acima do limite enquanto as tecnicas estão livres para ele escolher, eu gostaria de fazer a tecnica que ja estava bloqueada por equipar magistrais continuar bloqueada quando mudar de classe, não acho que teria que fazer muita alteração né?? ME ajude como antes apresentando tudo completamente explicado
<!-- CONTEUDO:FIM bloco=3 -->

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [Bloco 4] Claude · v2

<!-- BLOCO 4 -->
**Subtítulo:** Claude  
**Versão:** v2  

**Conteúdo:**

<!-- CONTEUDO:INICIO bloco=4 -->
Deixa eu primeiro entender bem como funciona o bloqueio de técnicas e a troca de classe antes de te indicar qualquer coisa.Agora entendi o bug por completo. Deixa eu traçar o caminho exato do problema antes de te dar a correção.

---

## 🔍 Diagnóstico — Por que o bug acontece

O fluxo do problema é este:

1. Você tem a **técnica Magistral** selecionada (ex: tier I) → limite sobe de 1 para 2
2. Você equipa **2 itens magistrais** → a técnica fica bloqueada (`canChangeTech` em `App.jsx` impede desequipá-la)
3. Você **muda de classe** → `changeClass` em `logic.js` é chamada

Dentro de `changeClass`, o que acontece:
- ✅ Os equipamentos **válidos para a nova classe são preservados** (incluindo os 2 magistrais)
- ❌ As técnicas **não são preservadas** (são da classe antiga — correto)
- ❌ Mas ninguém verifica: *"esses magistrais preservados excedem o limite base da nova classe sem técnicas?"*

Resultado: nova classe, 0 técnicas selecionadas, limite = 1, mas 2 magistrais equipados → estado inválido.

A função `canChangeTech` no `App.jsx` só bloqueia **desequipar uma técnica já selecionada**. Como na nova classe nenhuma técnica está selecionada, ela não protege nada.

---

## 🛠️ Correção — 1 único lugar para mexer

### Arquivo: `logic.js` — Função `changeClass`

A correção é adicionar **um segundo loop** logo antes do `return newBuild`, que conta os magistrais preservados e remove os que excedem `BASE_LEG_SLOTS` (o limite base sem técnicas).

**Código antigo (linha 917–918):**
```js
  });
  return newBuild;
}
```

**Código novo (substitua essas 2 linhas finais):**
```js
  });

  // Garante que os magistrais preservados não excedem o limite
  // base da nova classe (sem nenhuma técnica selecionada ainda).
  // Se excederem, remove os magistrais extras para manter o estado válido.
  let legCount = 0;
  ['katana', 'ranged', 'charm', 'gw1', 'gw2'].forEach(slotName => {
    const slot = newBuild.gear[slotName];
    if (!slot.itemId) return;
    const item = getItem(slot.itemId);
    if (item?.leg) {
      legCount++;
      if (legCount > BASE_LEG_SLOTS) {
        newBuild.gear[slotName] = {
          ...emptySlot(),
          ...(slotName === 'charm' ? { linkedClass: newClassId } : {}),
        };
      }
    }
  });

  return newBuild;
}
```

---

## 📖 Explicando cada parte do novo código

| Trecho | O que faz |
|--------|-----------|
| `let legCount = 0` | Contador de quantos magistrais foram preservados |
| `['katana', 'ranged', ...]forEach(...)` | Percorre todos os slots do novo build |
| `if (!slot.itemId) return` | Pula slots vazios |
| `if (item?.leg)` | Só conta itens que são magistrais |
| `legCount++` | Incrementa o contador |
| `if (legCount > BASE_LEG_SLOTS)` | Se passou do limite base (1), o magistral é excesso |
| `newBuild.gear[slotName] = { ...emptySlot(), ... }` | Remove o item magistral extra, limpando o slot |
| `...(slotName === 'charm' ? { linkedClass: newClassId } : {})` | Preserva o `linkedClass` do amuleto mesmo ao limpar |

---

## ✅ Comportamento resultante

- Se você tinha **1 magistral** → preservado normalmente ✅
- Se você tinha **2 magistrais** (graças à técnica) e muda de classe → o **segundo magistral é removido**, e a nova classe começa com estado válido ✅
- O player precisa escolher a técnica Magistral na nova classe para poder re-equipar o segundo magistral → **exatamente o comportamento correto e esperado** ✅

**Nenhuma alteração necessária** em `App.jsx` ou `data.js`.
<!-- CONTEUDO:FIM bloco=4 -->

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [Bloco 5] Prompt · v3

<!-- BLOCO 5 -->
**Subtítulo:** Prompt  
**Versão:** v3  

**Conteúdo:**

<!-- CONTEUDO:INICIO bloco=5 -->
Não, queria saber se é possível fazer a nova classe já vir com a tecnica equipada a tecnica que ta bloqueada por causa da quantidade de magistrais equipados (no caso, eu sei que quando tenho as 2 tecnicas magistrais equipadas, e só 2 equipamentos magistrais, a interface não "bloqueia" a tecnica) então teria que ter cuidado, mas queria saber se não tem com fazer sei lá, sempre que as tecnicas magistrais tiverem equipadas em uma classe, ao trocar de classe, essa "tecnica" magistral "correspondente" nesa outra classe já equipada, sempre, entende? Então isso evita qualquer problema, aí o usuário que se vire para trocar e gerenciar se está bloqueado por limite ou não, pois a tecnica sempre estará equipada (caso na classe anterior estivesse), entre essas trocas de classe, as outras tecnicas desequipam normalmente, mas a tecnica magistral se uma tiver ativa, a correspondente na outra classe também já começa ativa, se a só a segunda tecnica magistral tiver ativa, então ela que "começa" equipada ao trocar de classe
<!-- CONTEUDO:FIM bloco=5 -->

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [Bloco 6] Claude · v3

<!-- BLOCO 6 -->
**Subtítulo:** Claude  
**Versão:** v3  

**Conteúdo:**

<!-- CONTEUDO:INICIO bloco=6 -->
Perfeito, entendi! A lógica é simples: **se a técnica da classe antiga no tier X concedia legSlots → encontra a técnica da nova classe no mesmo tier que também concede legSlots → já equipa ela automaticamente.** Uma só alteração em `logic.js`.

---

## 🔍 Como funciona a identificação da técnica "Magistral"

Uma técnica é "magistral" quando tem em seu array `fx` um efeito com `s === 'legSlots'`. A função `countLegBonus` já usa essa mesma lógica — você pode confirmar isso na linha ~1016 do seu `logic.js`:

```js
tech?.fx.forEach(fx => { if (fx.s === 'legSlots') bonus += fx.v; });
```

Então a regra é clara: **`fx.some(fx => fx.s === 'legSlots')`** = é técnica magistral.

---

## 🛠️ Correção — 1 único lugar: `logic.js`, função `changeClass`

**Código antigo (linhas 917–918, o final da função):**
```js
  });
  return newBuild;
}
```

**Código novo:**
```js
  });

  // Para cada tier: se a técnica selecionada na classe antiga concedia
  // legSlots ("magistral"), busca a técnica equivalente na nova classe
  // (mesma tier, também concede legSlots) e já a equipa automaticamente.
  const oldCls = getClass(build.classId);
  const newCls = getClass(newClassId);
  if (oldCls && newCls) {
    ['I', 'II', 'III'].forEach(tier => {
      const oldTechId = build.techs[tier];
      if (!oldTechId) return; // tier sem técnica selecionada → ignora

      const oldTech = oldCls.techs.find(t => t.id === oldTechId);
      if (!oldTech) return;

      // Verifica se a técnica antiga concedia legSlots
      const grantsLeg = oldTech.fx?.some(fx => fx.s === 'legSlots');
      if (!grantsLeg) return; // não era magistral → ignora (desequipa normalmente)

      // Encontra a técnica magistral da nova classe no mesmo tier
      const newLegTech = newCls.techs.find(
        t => t.tier === tier && t.fx?.some(fx => fx.s === 'legSlots')
      );
      if (newLegTech) {
        newBuild.techs[tier] = newLegTech.id; // equipa automaticamente
      }
    });
  }

  return newBuild;
}
```

---

## 📖 Explicando cada parte

| Trecho | O que faz |
|--------|-----------|
| `getClass(build.classId)` | Pega o objeto da classe **antiga** para consultar as técnicas |
| `getClass(newClassId)` | Pega o objeto da **nova** classe para encontrar a correspondente |
| `forEach tier` | Analisa cada tier independentemente (I, II, III) |
| `if (!oldTechId) return` | Se não tinha técnica naquele tier → não faz nada (comportamento padrão) |
| `oldTech.fx?.some(fx => fx.s === 'legSlots')` | Checa se a técnica antiga era magistral |
| `if (!grantsLeg) return` | Se não era magistral → sai sem fazer nada (desequipa normalmente, como antes) |
| `newCls.techs.find(t => t.tier === tier && t.fx?.some(...))` | Encontra a técnica magistral da nova classe **no mesmo tier** |
| `newBuild.techs[tier] = newLegTech.id` | Equipa automaticamente |

---

## ✅ Comportamento resultante

- Técnica **normal** ativa na classe antiga → **desequipa** ao trocar (comportamento já existente) ✅  
- **1ª técnica magistral** ativa (ex: tier I) → nova classe começa com a **magistral do tier I** já equipada ✅  
- **2ª técnica magistral** ativa (ex: tier II) → nova classe começa com a **magistral do tier II** já equipada ✅  
- **Ambas** ativas → nova classe começa com **ambas as magistrais** já equipadas ✅  
- Se a nova classe não tiver técnica magistral em algum tier → simplesmente não equipa nada naquele tier (sem erro) ✅

**Sem alteração em `App.jsx` ou `data.js`.**
<!-- CONTEUDO:FIM bloco=6 -->

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

