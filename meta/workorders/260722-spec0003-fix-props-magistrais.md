# spec0003 — Corrige as props de item Magistral travadas no máximo

**Data:** 2026-07-22 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner` (confirme com `git branch` antes de começar; se não estiver nela, PARE e reporte)
**Depende de:** spec0002, aplicada (`8a99244` na main; `68883d3`, `e6db5be`, `ee632c9` na v2-planner)

**Escopo:** `src/logic.js` (4 edições) + 3 documentos. **`src/App.jsx` NÃO é tocado** — ele já trata o caso corretamente.

**Regras de execução:**
- Localize cada âncora EXATAMENTE. Se UMA falhar, PARE e reporte qual.
- Todas as âncoras foram verificadas como únicas no arquivo em 2026-07-22.
- Esta spec **mexe em código**: `npm run build` é obrigatório antes do commit, e a conferência visual da Parte 4 é obrigatória antes do push.
- Nenhum `--force`, `rebase` ou `reset --hard`.

---

## Correção ao diagnóstico registrado

A tabela de causa raiz gravada no `meta/STATUS.md` pela spec0002 tem uma linha **errada**: a que diz que o `App.jsx` usa `isLeg` só para cor e tag. Não é verdade — o componente `PropInput` recebe `locked={isLeg}` (linhas 715 e 725) e já renderiza o valor como texto travado, sem steppers. A Edição 3.1 corrige esse registro.

O alcance real do bug é outro, e maior: como o valor errado fica **gravado no estado do build**, ele viaja para o JSON salvo e para o código Base64 de compartilhamento. Corrigir só a geração não conserta o que já foi salvo — daí a Edição 1.4.

---

## Parte 1 — `src/logic.js`

### Edição 1.1 — helper `isLegendarySlot`

**Âncora:**
```
export function getEffectiveCharm(itemId, linkedClass) {
  const item = getItem(itemId);
  if (!item) return null;
  if (item.classBinding && linkedClass) {
    return resolveCharmClassBinding(item, linkedClass);
  }
  return item;
}
```

**Substituir por:**
```
export function getEffectiveCharm(itemId, linkedClass) {
  const item = getItem(itemId);
  if (!item) return null;
  if (item.classBinding && linkedClass) {
    return resolveCharmClassBinding(item, linkedClass);
  }
  return item;
}

/**
 * Diz se o item equipado num slot é Magistral (legendary).
 *
 * Item Magistral tem as props travadas no valor máximo — regra do jogo,
 * documentada no README > Mecânicas Implementadas > Itens Magistrais.
 *
 * Lê o item efetivo: para amuletos com classBinding, resolveCharmClassBinding
 * faz `...item`, então a flag `leg` é preservada na cópia.
 *
 * @param {Object} build
 * @param {string} slotName  'katana' | 'ranged' | 'charm' | 'gw1' | 'gw2'
 * @returns {boolean}
 */
export function isLegendarySlot(build, slotName) {
  const slot = build?.gear?.[slotName];
  if (!slot?.itemId) return false;
  const item = slotName === 'charm'
    ? getEffectiveCharm(slot.itemId, slot.linkedClass)
    : getItem(slot.itemId);
  return item?.leg === true;
}

/**
 * Força as props de todo item Magistral do build para o valor máximo.
 *
 * Rede para builds salvos ou compartilhados ANTES desta correção: o valor
 * errado gerado pelo randomBuild ficou gravado no JSON, então precisa ser
 * consertado na LEITURA, não só na geração.
 *
 * @param {Object} build
 * @returns {Object} novo build, ou o mesmo objeto se nada precisou mudar
 */
export function normalizeLegendaryProps(build) {
  if (!build?.gear) return build;

  let changed = false;
  const gear = {};

  Object.entries(build.gear).forEach(([slotName, slot]) => {
    gear[slotName] = slot;
    if (!slot?.itemId) return;

    const item = slotName === 'charm'
      ? getEffectiveCharm(slot.itemId, slot.linkedClass)
      : getItem(slot.itemId);
    if (item?.leg !== true) return;

    let next = slot;
    ['p1', 'p2'].forEach(ps => {
      const propId = next[ps]?.propId;
      if (!propId) return;
      const propDef = item.props.find(p => p.id === propId);
      if (!propDef || next[ps].value === propDef.mx) return;
      next = { ...next, [ps]: { propId, value: propDef.mx } };
      changed = true;
    });

    gear[slotName] = next;
  });

  return changed ? { ...build, gear } : build;
}
```

### Edição 1.2 — `randomBuild` respeita o Magistral

**Âncora:**
```
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

**Substituir por:**
```
    // P1 — item Magistral trava no máximo; comum sorteia dentro da faixa
    const p1opts = effectiveItem.props.filter(p => p.sl.includes('P1'));
    const p1 = p1opts.length > 0 ? pick(p1opts) : null;
    const p1val = p1
      ? (chosen.leg ? p1.mx : randomInRange(p1.mn, p1.mx, p1.u))
      : 0;

    // P2 (bloqueando mesma sk que P1) — mesma regra do Magistral
    const p2opts = effectiveItem.props.filter(p =>
      p.sl.includes('P2') &&
      !(p1 && p.sk === p1.sk)
    );
    const p2 = p2opts.length > 0 ? pick(p2opts) : null;
    const p2val = p2
      ? (chosen.leg ? p2.mx : randomInRange(p2.mn, p2.mx, p2.u))
      : 0;
```

> `chosen` é o item cru sorteado e já está em escopo — é a mesma referência que o código usa duas linhas acima em `if (chosen.leg) legUsed++`.

### Edição 1.3 — `setPropValue` não deixa baixar um Magistral

**Âncora:**
```
  let v = parseFloat(value);
  if (isNaN(v)) v = propDef.mn;
  if (clamp) {
    v = Math.max(propDef.mn, Math.min(propDef.mx, v));
  }
```

**Substituir por:**
```
  let v = parseFloat(value);
  if (isNaN(v)) v = propDef.mn;
  if (isLegendarySlot(build, slotName)) {
    // Magistral: travado no máximo, venha de onde vier a chamada
    v = propDef.mx;
  } else if (clamp) {
    v = Math.max(propDef.mn, Math.min(propDef.mx, v));
  }
```

> Hoje a UI não alcança este caminho para Magistrais (o `PropInput` esconde os steppers quando `locked`). A trava aqui é defesa em profundidade: garante a regra na camada de lógica, independentemente do que a UI faça amanhã.

### Edição 1.4 — sanear build carregado

**Âncora:**
```
  return { ok: true, build: saved.build };
```

**Substituir por:**
```
  return { ok: true, build: normalizeLegendaryProps(saved.build) };
```

> `decodeBuild` chama `deserializeBuild`, então esta única mudança cobre os dois caminhos de entrada: importar arquivo `.json` e colar código Base64.

---

## Parte 2 — Build

```
npm run build
```

**Se falhar: PARE**, reporte o erro completo e não commite nada.

---

## Parte 3 — Documentação

### Edição 3.1 — `meta/STATUS.md` · mover o bug para resolvido

**Âncora:**
```
### Props de item Magistral não ficam travadas no máximo
```

**Substituir por (a seção inteira até o `---` seguinte será reescrita — localize o bloco pelo título e substitua até a linha `---` que o encerra):**
```
_Nada ativo._ (Bug com sintoma observável entra aqui; quando resolvido e se foi grave, vira FIX-N em DECISIONS.)
```

> Ou seja: remova todo o bloco do bug dos Magistrais desta seção e devolva a seção ao estado vazio. O registro completo passa a viver em `meta/DECISIONS.md` como FIX-006. Se a extensão exata do bloco estiver ambígua, PARE e reporte em vez de adivinhar onde ele termina.

### Edição 3.2 — `meta/DECISIONS.md` · FIX-006

**Acrescente ao FINAL do arquivo:**
```

---

## FIX-006 — Props de item Magistral saíam abaixo do máximo na build aleatória

**Data:** 2026-07-22 · **Gravidade:** alta (valor errado gravado e propagado)

### Sintoma
Ao gerar build com o botão 🎲, itens Magistrais apareciam com props abaixo do máximo — por exemplo, Fustigador de Pedra ★ com `Dano de Contra-Ataque (10–20%)` em 11% e `Red. Recarga Habilidade (5–12%)` em 5%. No jogo, item Magistral sempre tem a prop no valor máximo, regra que o próprio `README.md` documenta.

### Causa raiz
`randomBuild()` chamava `randomInRange(p.mn, p.mx, p.u)` sem consultar `chosen.leg`, embora já usasse essa mesma flag duas linhas acima para controlar o limite de slots Magistrais. A trava de máximo nunca existiu na camada de lógica: ela só *parecia* funcionar porque `selectProp()` já usava `propDef.mx` como valor padrão, então quem montava a build à mão nunca via o problema.

### O que NÃO era a causa
O `App.jsx` estava correto o tempo todo. O `PropInput` recebe `locked={isLeg}` e renderiza o valor como texto travado, sem steppers. Ele travava fielmente — no valor errado que a lógica havia gravado. Um diagnóstico anterior culpou a UI por engano; ficou registrado aqui para não se repetir a suspeita.

### Alcance
Pior do que "o número aparece errado na tela": o valor fica gravado no estado do build, então viaja para o `.json` salvo e para o código Base64 de compartilhamento. Toda build gerada no 🎲 e salva antes desta correção carrega o valor errado no arquivo. A build de exemplo `O Samurai Contra-Ataca` foi conferida e está limpa — foi montada à mão.

### Correção
Quatro pontos em `src/logic.js`:
1. `isLegendarySlot(build, slotName)` — helper único, lê o item efetivo (preserva `leg` no amuleto com `classBinding`).
2. `randomBuild()` — usa `p.mx` quando `chosen.leg`.
3. `setPropValue()` — força `propDef.mx` em slot Magistral, antes do clamp comum. Defesa em profundidade; a UI hoje não alcança esse caminho.
4. `normalizeLegendaryProps(build)` chamado em `deserializeBuild()` — conserta na leitura o que já foi salvo errado. Cobre import de `.json` e código Base64, porque `decodeBuild` passa por `deserializeBuild`.

### Consequência aberta
O saneamento acontece **na leitura**. Um arquivo `.json` antigo no disco continua com o valor errado gravado até ser carregado e salvo de novo. Isso é intencional: a ferramenta não reescreve arquivos do usuário sozinha.
```

### Edição 3.3 — `meta/CHANGELOG.md`

**Âncora:**
```
### Bug conhecido (registrado, não corrigido)
- Props de item Magistral não ficam travadas no máximo — visível na build aleatória. Diagnóstico completo em `meta/STATUS.md`
```

**Substituir por:**
```
### Corrigido
- Props de item Magistral saíam abaixo do máximo na build aleatória (FIX-006). Builds salvos ou compartilhados com o valor errado são saneados ao carregar
```

---

## Parte 4 — Conferência visual (obrigatória antes do push)

Rode `npm run dev` e **reporte o resultado de cada item**. Não há suíte de testes; esta é a rede.

1. **Caso principal** — Samurai, aperte 🎲 umas 10 vezes. Toda vez que sair item com a tag MAGISTRAL, as duas props devem mostrar o **topo da faixa** (`10–20%` → `20%`).
2. **Regressão crítica** — nas mesmas rodadas, itens **não**-Magistrais devem continuar variando. Se todo item passou a sair no máximo, a condição vazou: PARE e reporte.
3. **Amuleto com classBinding** — repita com Caçadora, Ronin e Assassino, olhando o slot Amuleto. É o caminho que passa por `getEffectiveCharm`.
4. **Seleção manual** — escolha um Magistral à mão: prop vem no máximo, sem steppers ▼▲.
5. **Item comum manual** — os steppers ▼▲ ainda funcionam e param nos limites da faixa.
6. **Saneamento na leitura** — gere uma build no 🎲 com Magistral, salve, recarregue a página, carregue a build salva: deve abrir com as props no máximo.
7. **Não-regressão** — importe o código Base64 do `O Samurai Contra-Ataca` que está no `README.md`. Deve carregar idêntico ao de antes.

Se qualquer item falhar, **não commite** — reporte.

---

## Parte 5 — Commit e push

Inclua o `.flatdropignore`, que ficou sujo desde a spec0002 e pertence a esta branch:

```
git add src/logic.js meta/ .flatdropignore
git status
```

Confira o staged e reporte a lista. Não deve haver nada de `src/App.jsx`, `node_modules/` ou `dist/`.

```
git commit -m "fix(logic): trava props de item magistral no valor maximo" -m "randomBuild usava randomInRange sem consultar chosen.leg, gravando valor abaixo do maximo no estado e propagando para saves e codigos compartilhados. Adiciona isLegendarySlot e normalizeLegendaryProps; saneia builds carregados. App.jsx nao foi tocado - ja tratava o caso via locked. FIX-006."
git push
```

Depois do push, reporte `git log --oneline -3` e confirme que a `main` não foi tocada.
