# wo0027 — Fecha as duas duplicações restantes: `selectTech`/`selectAbility` e o formatador de estatísticas

**Data:** 2026-08-24 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Toca código do produto?** **SIM** — `src/App.jsx` (só ele; `logic.js` não muda). **Build obrigatório** + conferência na tela.
**Base:** as `wo0024`–`wo0026` aplicadas.

---

## O que foi medido antes de escrever esta WO

**1. Os três toggles.** `handleAbility` (linha ~882), o botão de limpar técnica (~986) e o `onToggle` do card de técnica (~1026) reimplementam inline exatamente o corpo de `selectAbility` e `selectTech`. Confirmado que `selectTech(build, tier, null)` devolve `null` para o slot em qualquer caso — serve para o botão de limpar sem gambiarra. Nenhuma das duas funções está importada hoje no `App.jsx`.

**2. O formatador — e uma divergência que precisa ser dita.** O `fmtStat` do `StatsPanel` não é cópia fiel de `formatStatValue`: o ramo de porcentagem usa o helper local `pct`, que arredonda para **inteiro** (`Math.round(v * 100)`), enquanto `formatStatValue` mantém **duas casas** (`Math.round(v * 10000) / 100`). Ou seja, para um valor como `0.125` o painel mostraria `+13%` e a exportação de texto e de imagem — que já chamam `formatStatValue` — mostrariam `+12.5%`.

Fui ver se isso já acontece: **não.** Varri o `data.js` e não há nenhum valor com três ou mais casas decimais, então hoje as duas implementações produzem a mesma string em 100% dos casos. A divergência é **latente**, não ativa. Ela vira bug no dia em que o jogo trouxer um valor fracionário — e o sintoma apareceria como painel e imagem discordando, que é caro de diagnosticar.

Por isso a troca é segura agora e a versão que fica é a de `logic.js`, a mais precisa das duas. **`pct` deixa de existir** — não é perda, é a retirada da implementação pior.

**3. Órfãos que a mudança cria.** `pct` e `pts` (linhas 114-115) são chamados **apenas** dentro de `fmtStat`. Removido o `fmtStat`, os dois ficam órfãos e a seção `// ─── Small helpers ───` fica vazia. Saem junto, nesta mesma WO — deixar orfão é a dívida que este projeto já limpou uma vez.

**4. `changed`.** O `StatsPanel` também define `const changed = (s) => s.value !== s.base`, que é `isStatChanged` — **já importado** no arquivo e já usado nas duas rotinas de exportação. Mesma família, entra junto.

**O `logic.js` não é tocado.** Toda a mudança é no `App.jsx`.

**Preserve o estilo do arquivo: o `App.jsx` NÃO usa ponto e vírgula no fim das linhas.**

---

# Parte A — código

## Edição 1 — import

**Âncora (uma linha, exata):**

```
  getClass, getItem,
  getAvailableProps, getAvailablePerks,
```

**Substituir por:**

```
  getClass, getItem,
  getAvailableProps, getAvailablePerks,
  selectTech, selectAbility,
```

## Edição 2 — `handleAbility`

**Âncora (bloco exato):**

```
  const handleAbility = (id) => {
    setBuild(prev => ({ ...prev, abilityId: prev.abilityId === id ? null : id }))
  }
```

**Substituir por:**

```
  const handleAbility = (id) => {
    setBuild(prev => selectAbility(prev, id))
  }
```

## Edição 3 — botão de limpar técnica

**Âncora (uma linha, exata):**

```
                    setBuild(prev => ({ ...prev, techs: { ...prev.techs, [tier]: null } }))
```

**Substituir por:**

```
                    // selectTech com techId null sempre esvazia o slot
                    setBuild(prev => selectTech(prev, tier, null))
```

## Edição 4 — toggle do card de técnica

**Âncora (bloco exato):**

```
                    const incoming = build.techs[tier] === t.id ? null : t.id
                    if (!canChangeTech(tier, incoming)) return
                    setBuild(prev => ({
                      ...prev,
                      techs: { ...prev.techs, [tier]: prev.techs[tier] === t.id ? null : t.id },
                    }))
```

**Substituir por:**

```
                    const incoming = build.techs[tier] === t.id ? null : t.id
                    if (!canChangeTech(tier, incoming)) return
                    setBuild(prev => selectTech(prev, tier, t.id))
```

> O `incoming` continua sendo calculado a partir de `build` para o teste do `canChangeTech`, que é como estava. Só a atualização do estado passa a usar `prev`, via `selectTech` — mesma semântica de antes.

## Edição 5 — `StatsPanel`: retirar `fmtStat` e `changed`

**Âncora (bloco exato):**

```
  const fmtStat = (s) => {
    if (s.unit === '●') return '●'.repeat(s.value)
    if (s.unit === '%') return pct(s.value)
    if (s.unit === 'pts' || s.unit === 's') return pts(s.value, s.unit)
    return String(s.value)
  }

  const changed = (s) => s.value !== s.base

  if (!stats) return null
```

**Substituir por:**

```
  if (!stats) return null
```

## Edição 6 — `StatsPanel`: os três pontos de uso

**Âncora A (uma linha, exata):**

```
              <span style={{ fontSize: 12, color: changed(s) ? T.text : T.muted }}>{s.label}</span>
```

**Substituir por:**

```
              <span style={{ fontSize: 12, color: isStatChanged(s) ? T.text : T.muted }}>{s.label}</span>
```

**Âncora B (uma linha, exata):**

```
                color: changed(s) ? T.green : T.muted,
```

**Substituir por:**

```
                color: isStatChanged(s) ? T.green : T.muted,
```

**Âncora C (uma linha, exata):**

```
                {fmtStat(s)}
```

**Substituir por:**

```
                {formatStatValue(s.value, s.unit)}
```

## Edição 7 — remover os helpers órfãos

**Âncora (bloco exato, três linhas):**

```
// ─── Small helpers ───────────────────────────────────────────
const pct = (v) => v > 0 ? `+${Math.round(v * 100)}%` : `${Math.round(v * 100)}%`
const pts = (v, u) => v > 0 ? `+${v}${u}` : `${v}${u}`
```

**Substituir por** (linha vazia — a seção inteira sai):

```
```

> Apague as três linhas, deixando **uma** linha em branco entre o bloco que vem antes e o comentário `// ─── HpResolveBar …` que vem depois. Antes de apagar, confirme com uma busca que `pct(` e `pts(` não aparecem em mais nenhum lugar do arquivo. **Se aparecerem, PARE e reporte** — a medição desta WO estaria errada.

---

# Parte B — registros

> Faça a Parte B **depois** de o `npm run build` passar. Se o build falhar, pare antes daqui e reporte.

## Edição 8 — `meta/DECISIONS.md`: DEC-033 no fim do arquivo

**Âncora (última linha do arquivo, exata):**

```
- `App.jsx` perde cerca de dez linhas e recupera dois imports que a limpeza de julho havia removido por órfãos.
```

**Substituir por:**

```
- `App.jsx` perde cerca de dez linhas e recupera dois imports que a limpeza de julho havia removido por órfãos.

---

## DEC-033 — Painel e exportação passam a usar o mesmo formatador de estatísticas
**Data:** 2026-08-24 · **Status:** aceita · **Aplicada pela** `wo0027`

### Contexto
O `StatsPanel` do `App.jsx` tinha um `fmtStat` local e um `changed` local, duplicando `formatStatValue` e `isStatChanged` de `logic.js` — as duas funções já importadas no mesmo arquivo e já usadas pelas rotinas de exportação de texto e de imagem. Também havia três toggles inline reimplementando `selectTech` e `selectAbility`.

**O achado não foi a duplicação, foi a divergência.** O `fmtStat` delegava o ramo de porcentagem ao helper local `pct`, que arredonda para inteiro (`Math.round(v * 100)`), enquanto `formatStatValue` mantém duas casas (`Math.round(v * 10000) / 100`). Para um valor de `0.125`, o painel diria `+13%` e a imagem exportada diria `+12.5%` — a mesma build mostrando dois números.

Medição feita antes de decidir: não existe no `data.js` atual nenhum valor com três ou mais casas decimais, então **hoje as duas implementações produzem a mesma string em todos os casos**. A divergência é latente. Ela viraria bug silencioso no primeiro valor fracionário que o jogo trouxer, e o sintoma — painel e exportação discordando — é dos caros de diagnosticar, porque as duas telas parecem corretas isoladamente.

### Decisão
O `StatsPanel` passa a chamar `formatStatValue` e `isStatChanged` como o resto do arquivo já fazia. `fmtStat` e `changed` saem. Os helpers locais `pct` e `pts` saem junto, por ficarem órfãos: `pts` era cópia fiel do ramo correspondente, e `pct` era a implementação **menos** precisa das duas — retirá-la é o ponto, não um efeito colateral. Os três toggles inline viram chamadas a `selectTech`/`selectAbility`.

### Alternativas consideradas
- **Só trocar os toggles e deixar o formatador.** Recusada: eram os dois itens da mesma família no backlog, e o do formatador é o que escondia a divergência.
- **Manter `pct` e alinhar `formatStatValue` ao arredondamento inteiro.** Recusada: perderia precisão na exportação para resolver uma duplicação. A regra é convergir para a implementação melhor, não para a mais antiga.
- **Deixar `pct`/`pts` no arquivo para uso futuro.** Recusada: é como nasceram os oito imports órfãos limpos em 2026-07-25.

### Consequências
- O painel e as duas exportações passam a ter uma fonte de verdade só para formatação de estatística. A próxima correção de formato entra em um lugar, não em dois — que foi o custo real cobrado na `spec0019`.
- Fecha o último par de duplicações mapeadas no backlog. A família aberta pela `spec0012` está encerrada.
- Registrado como aplicação da regra de processo «quando duas implementações divergem, a divergência é o achado»: a duplicação era conhecida desde julho, mas o que estava anotado era «é cópia» — e não era.
```

## Edição 9 — `meta/CHANGELOG.md`

**Âncora (uma linha, exata):**

```
- **`getAvailableProps` e `getAvailablePerks` passam a receber o item resolvido** em vez do `id` (DEC-032). Elimina a armadilha 14 pela assinatura — o erro deixa de ser possível de escrever — e substitui os dois filtros inline do `App.jsx` por chamadas às funções. Sem mudança visível de comportamento.
```

**Substituir por:**

```
- **`getAvailableProps` e `getAvailablePerks` passam a receber o item resolvido** em vez do `id` (DEC-032). Elimina a armadilha 14 pela assinatura — o erro deixa de ser possível de escrever — e substitui os dois filtros inline do `App.jsx` por chamadas às funções. Sem mudança visível de comportamento.
- **Painel de estatísticas e exportações passam a usar o mesmo formatador** (DEC-033). O `StatsPanel` deixa de ter `fmtStat` e `changed` próprios e chama `formatStatValue` e `isStatChanged`, como o resto do `App.jsx` já fazia; os helpers locais `pct` e `pts` saem por ficarem órfãos. Fecha uma divergência de arredondamento que ainda não aparecia na tela: `pct` truncava a porcentagem para inteiro e `formatStatValue` mantém duas casas.
- **Os três toggles inline de técnica e habilidade viram chamadas a `selectTech`/`selectAbility`** (DEC-033). Sem mudança de comportamento.
```

## Edição 10 — `meta/STATUS.md`: fechar os dois itens de backlog

Os dois foram resolvidos — pela regra de higiene, item resolvido **sai** do STATUS.

**Âncora (duas linhas consecutivas, exatas):**

```
- [ ] **Duplicação de `selectTech` / `selectAbility`** — o `App.jsx` reimplementa inline o toggle que essas duas funções de `logic.js` já fazem, com lógica idêntica. Ao contrário do caso acima, aqui não há motivo: as assinaturas servem. Trocar o inline pela chamada elimina uma fonte de verdade duplicada. Mudança de duas linhas, mas **não embutida na spec0012** por estar fora do escopo dela.
- [ ] **Duplicação do formatador de estatísticas** — o `if (s.unit === '●') return '●'.repeat(s.value)` do `StatsPanel` (`App.jsx`) é cópia do que já existe em `formatStatValue` (`logic.js`). Descoberta durante a `spec0019`, onde custou uma edição extra: os dois tiveram de ser corrigidos para a mesma coisa. Mesma família do item acima e deve ser resolvida junto.
```

**Substituir por** (linha vazia — os dois itens saem):

```
```

> Apague as duas linhas sem deixar buraco na lista de backlog. O desfecho está na DEC-033 e no CHANGELOG.

---

## Fechamento

1. **`npm run build`** — obrigatório, entre a Parte A e a Parte B.
2. `git diff` — confira que `logic.js` **não** aparece no diff, e que `pct(`/`pts(` não sobraram em lugar nenhum do `App.jsx`.
3. `git add` (incluindo esta WO), commit e push:

```
git commit -m "refactor(app): painel de stats e toggles passam a usar as funcoes de logic.js"
git push
```

## O que conferir na tela (não há suíte de testes)

- **Caso feliz:** abra uma classe e confira o painel de estatísticas — os valores em `%`, em `pts`/`s` e os `●●●` de Determinação têm de aparecer exatamente como antes, e o realce verde tem de continuar aparecendo só nos stats alterados em relação ao base.
- **Toggles:** clique numa técnica para selecionar e clique de novo para desselecionar; use o botão de limpar do tier; troque a habilidade de classe e clique na mesma para desmarcar. Os três caminhos.
- **Borda (é o ponto da mudança):** com uma build que altere porcentagens, compare o número no painel com o mesmo número na **exportação de texto** e na **imagem gerada**. Têm de bater. Antes desta WO também batiam, com os dados atuais — se agora divergirem, a mudança regrediu.
- **Regressão provável:** o bloqueio de técnica por item Magistral (`canChangeTech`). Equipe um Magistral e tente trocar a técnica bloqueada: o clique tem de continuar sendo recusado, e o card, marcado como bloqueado.
- Confira nos **dois idiomas** e nos **dois temas**.

## Relatório esperado

Âncoras que bateram, o resultado da busca por `pct(`/`pts(` antes da Edição 7, o resultado do `npm run build`, o que conferiu na tela e o hash do commit. Qualquer âncora que falhe → PARE.
