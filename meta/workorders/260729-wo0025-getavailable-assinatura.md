# wo0025 — `getAvailableProps` / `getAvailablePerks`: assinatura por item, e uso real no `App.jsx`

**Data:** 2026-07-29 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Toca código do produto?** **SIM** — `src/logic.js` e `src/App.jsx`. **Build obrigatório** + conferência na tela.
**Decisão:** DEC-032, que entra pela `wo0026`.

---

## Por quê

As duas funções não têm consumidor e, como estão, são armadilha: resolvem o item por `id` (`getItem(itemId)`) e por isso devolvem lista **incompleta e sem erro** para amuleto magistral com `classBinding`, que só ganha os props e perks de classe depois de passar por `getEffectiveCharm` (armadilha 14 do CONTEXT).

O `App.jsx` filtra inline exatamente a mesma regra em dois lugares — e nos dois **já tem o item efetivo em mãos**. Trocar a assinatura para receber o item mata a armadilha pela raiz (o erro passa a ser impossível de escrever), tira a duplicação, e não exige nada dos chamadores que eles já não tenham.

## Edição 1 — `src/logic.js`, `getAvailableProps`

**Âncora (bloco exato):**

```
/**
 * Retorna as props disponíveis para um slot (P1 ou P2) de um item,
 * excluindo a prop já escolhida no outro slot (mesma sk = bloqueada).
 */
export function getAvailableProps(itemId, slot, otherPropId) {
  const item = getItem(itemId);
  if (!item) return [];
```

**Substituir por:**

```
/**
 * Retorna as props disponíveis para um slot (P1 ou P2) de um item,
 * excluindo a prop já escolhida no outro slot (mesma sk = bloqueada).
 *
 * Recebe o ITEM já resolvido, nunca o id. Amuleto magistral com classBinding
 * só tem os props de classe depois de passar por getEffectiveCharm; resolver
 * por id aqui devolveria lista incompleta e sem erro — era a armadilha 14.
 * A assinatura é a barreira: ver DEC-032.
 */
export function getAvailableProps(item, slot, otherPropId) {
  if (!item) return [];
```

## Edição 2 — `src/logic.js`, `getAvailablePerks`

**Âncora (bloco exato):**

```
/**
 * Retorna os perks disponíveis para um item, excluindo o já escolhido
 * no outro slot de perk.
 */
export function getAvailablePerks(itemId, otherPerkId) {
  const item = getItem(itemId);
  if (!item) return [];
  return item.perks.filter(p => p.id !== otherPerkId);
}
```

**Substituir por:**

```
/**
 * Retorna os perks disponíveis para um item, excluindo o já escolhido
 * no outro slot de perk.
 *
 * Recebe o ITEM já resolvido, nunca o id — mesmo motivo de
 * getAvailableProps (armadilha 14, DEC-032).
 */
export function getAvailablePerks(item, otherPerkId) {
  if (!item) return [];
  return item.perks.filter(p => p.id !== otherPerkId);
}
```

## Edição 3 — `src/App.jsx`, import

**Âncora (uma linha, exata):**

```
  getClass, getItem,
```

**Substituir por:**

```
  getClass, getItem,
  getAvailableProps, getAvailablePerks,
```

## Edição 4 — `src/App.jsx`, `PropInput`

**Âncora (bloco exato — note que este arquivo NÃO usa ponto e vírgula):**

```
  const avail = useMemo(() => {
    if (!item) return []
    const slotCode = propSlot === 'p1' ? 'P1' : 'P2'
    return item.props.filter(p => {
      if (!p.sl.includes(slotCode)) return false
      if (otherPropId) {
        const other = item.props.find(pp => pp.id === otherPropId)
        if (other && p.sk === other.sk) return false
      }
      return true
    })
  }, [item, propSlot, otherPropId])
```

**Substituir por:**

```
  const avail = useMemo(() => {
    const slotCode = propSlot === 'p1' ? 'P1' : 'P2'
    // `item` aqui já é o EFETIVO (classBinding resolvido pelo pai) — que é
    // exatamente o que a assinatura de getAvailableProps exige.
    return getAvailableProps(item, slotCode, otherPropId)
  }, [item, propSlot, otherPropId])
```

## Edição 5 — `src/App.jsx`, `PerkRow`

**Âncora (uma linha, exata):**

```
  const avail = item ? item.perks.filter(p => p.id !== other) : []
```

**Substituir por:**

```
  const avail = getAvailablePerks(item, other)
```

## Edição 6 — `meta/CONTEXT.md`, armadilha 14

A armadilha muda de natureza: deixa de ser «cuidado ao usar» e passa a ser «resolvido, e por que a assinatura é assim».

**Âncora (o item 14 inteiro, exato):**

```
14. **`getAvailableProps` e `getAvailablePerks` resolvem o item por `id`** — e por isso **não servem para amuleto com `classBinding`**: devolvem o item cru do `GEAR`, sem os props e perks de classe, e sem erro. É a armadilha 7 disfarçada de utilitário. O `App.jsx` filtra inline justamente para poder passar o item **efetivo**. Nenhum consumidor as usa hoje (verificado em 2026-07-25); antes de usar uma delas em código novo — inclusive na Fase 3 — troque a assinatura para receber o item, não o id.
```

**Substituir por:**

```
14. **`getAvailableProps(item, …)` e `getAvailablePerks(item, …)` recebem o ITEM, nunca o `id`** — e a assinatura é deliberada. Até 2026-07-29 elas resolviam por `id` internamente, o que devolvia lista incompleta **e sem erro** para amuleto com `classBinding` (o item cru do `GEAR` não tem os props e perks de classe): era a armadilha 7 disfarçada de utilitário. Hoje quem chama precisa ter o item **efetivo** em mãos — `getEffectiveCharm(itemId, linkedClass)` —, e o erro antigo virou impossível de escrever. Consumidores: `PropInput` e `PerkRow` no `App.jsx`. **Não reintroduza uma sobrecarga que aceite `id`** (DEC-032).
```

---

## Fechamento

1. **`npm run build`** — obrigatório, esta WO toca `src/`.
2. `git diff` — confira que não sobrou nenhuma referência a `getItem(` dentro das duas funções.
3. `git add` (incluindo esta WO), commit e push:

```
git commit -m "refactor(logic): getAvailableProps e getAvailablePerks passam a receber o item resolvido"
git push
```

## O que conferir na tela (não há suíte de testes)

- **Caso feliz:** abra qualquer classe, escolha uma arma, e nos dois slots de propriedade confira que a lista aparece e que escolher uma prop no P1 some com as de mesma `sk` no P2. Faça o mesmo com as duas Vantagens.
- **Borda (é aqui que a mudança importa):** equipe um **amuleto magistral com `classBinding`** e vincule uma classe. As props e vantagens **exclusivas daquela classe** têm de aparecer nas listas. Se sumirem, a mudança regrediu — reporte, não conserte.
- **Regressão provável:** o `PerkRow` tem o caminho do `forcedPerkId` (vantagem de desbloqueio obrigatória). Confira um item que force a Vantagem I: o slot continua travado e a lista da Vantagem II continua correta.
- Confira nos **dois idiomas** (PT-BR e EN) e nos **dois temas**.

## Relatório esperado
Âncoras que bateram, resultado do `npm run build`, o que você conferiu na tela, e o hash do commit. Se qualquer âncora falhar, PARE.
