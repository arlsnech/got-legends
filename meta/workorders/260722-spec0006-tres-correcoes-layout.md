# spec0006 — As três correções de layout pendentes + semântica do campo numérico

**Data:** 2026-07-22 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner` · **Depende de:** spec0005
**Fonte:** `GUIA_CORRECOES_FASE3.md`, Correções 1, 2 e 3. Os três blocos ANTES foram conferidos contra o `App.jsx` atual em 2026-07-22 e **batem exatamente** — o guia está utilizável sem reescrita. (A Correção 4 do guia já foi aplicada por outro caminho na spec0004.)

**Regras de execução:**
- Localize cada âncora EXATAMENTE. Se UMA falhar, PARE e reporte qual.
- Só `src/App.jsx` e dois documentos de `meta/`.
- **Não delete `src/v1..v4/` nem os `GUIA_*.md`** — a extração retroativa ainda não foi feita.
- Nenhum `--force`, `rebase` ou `reset --hard`.

---

## Parte 1 — Correção 1: `Tooltip` aceita `wrapperStyle`

O `Tooltip` envolve os filhos num `<span display:inline-block>`, que encolhe até o tamanho do conteúdo. Um botão filho com `width: 100%` herda a largura desse span — que é a largura do próprio texto. É a raiz das caixas de vantagem com larguras diferentes.

### Edição 1.1 — assinatura

**Âncora:**
```
function Tooltip({ text, children }) {
```

**Substituir por:**
```
function Tooltip({ text, children, wrapperStyle }) {
```

### Edição 1.2 — o span

**Âncora:**
```
    <span style={{ display: 'inline-block', cursor: 'help' }}
      onMouseEnter={show}
      onMouseLeave={() => setVis(false)}>
```

**Substituir por:**
```
    <span
      style={{ display: 'inline-block', cursor: 'help', ...wrapperStyle }}
      onMouseEnter={show}
      onMouseLeave={() => setVis(false)}>
```

> Usos existentes que não passam `wrapperStyle` recebem `undefined` no spread e ficam idênticos. É uma mudança aditiva.

---

## Parte 2 — Correção 2: `TechRow` independente por modo

O objetivo é que os dois modos se comportem de forma **independente** — foi a queixa registrada: consertar um quebrava o outro.

| | 3 colunas | 2 colunas |
|---|---|---|
| Habilidades de classe | uma por linha, 100% | lado a lado (não muda) |
| Vantagens de classe | uma por linha, **largura uniforme** | **lado a lado em grid** |

### Edição 2.1 — assinatura do `TechRow`

**Âncora:**
```
  const TechRow = ({ tech, selected, onToggle, blocked }) => {
```

**Substituir por:**
```
  const TechRow = ({ tech, selected, onToggle, blocked, layoutMode: rowLayoutMode }) => {
```

> O apelido `rowLayoutMode` evita sombrear o `layoutMode` do escopo externo.

### Edição 2.2 — wrapper por modo

**Âncora:**
```
    return (
      // div de bloco garante que cada TechRow ocupa linha inteira
      // independente de qualquer ancestor inline-block (ex: Tooltip)
      <div style={{ display: 'block', width: '100%', marginBottom: 4 }}>
        <Tooltip text={isBlocked
          ? (lang === 'en' ? 'Unequip a Legendary item first' : 'Desequipe um item Magistral primeiro')
          : desc}>
```

**Substituir por:**
```
    /*
      wrapperStyle do Tooltip — é o que torna os dois modos independentes:
      - three-col: bloco 100% → o botão ocupa a coluna inteira (larguras uniformes)
      - two-col:   inline-block 100% → os botões fluem lado a lado dentro do grid
    */
    const tooltipWrapperStyle = rowLayoutMode === 'two-col'
      ? { display: 'inline-block', width: '100%' }
      : { display: 'block', width: '100%' }

    return (
      <div style={{ marginBottom: 4 }}>
        <Tooltip
          wrapperStyle={tooltipWrapperStyle}
          text={isBlocked
            ? (lang === 'en' ? 'Unequip a Legendary item first' : 'Desequipe um item Magistral primeiro')
            : desc}>
```

### Edição 2.3 — container em grid no 2-col

**Âncora:**
```
            {techs.map(t => (
              <TechRow
                key={t.id}
                tech={t}
                selected={build.techs[tier]}
                onToggle={() => {
                  const incoming = build.techs[tier] === t.id ? null : t.id
                  if (!canChangeTech(tier, incoming)) return
                  setBuild(prev => ({
                    ...prev,
                    techs: { ...prev.techs, [tier]: prev.techs[tier] === t.id ? null : t.id },
                  }))
                }}
                blocked={!canChangeTech(tier, build.techs[tier] === t.id ? null : t.id)}
              />
            ))}
```

**Substituir por:**
```
            {/*
              Container dos TechRows:
              - two-col:   grid lado a lado (minmax 140px evita quebra de nome)
              - three-col: coluna simples, um embaixo do outro
            */}
            <div style={layoutMode === 'two-col' ? {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 4,
            } : {
              display: 'flex',
              flexDirection: 'column',
            }}>
              {techs.map(t => (
                <TechRow
                  key={t.id}
                  tech={t}
                  selected={build.techs[tier]}
                  layoutMode={layoutMode}
                  onToggle={() => {
                    const incoming = build.techs[tier] === t.id ? null : t.id
                    if (!canChangeTech(tier, incoming)) return
                    setBuild(prev => ({
                      ...prev,
                      techs: { ...prev.techs, [tier]: prev.techs[tier] === t.id ? null : t.id },
                    }))
                  }}
                  blocked={!canChangeTech(tier, build.techs[tier] === t.id ? null : t.id)}
                />
              ))}
            </div>
```

> Se o `layoutMode` não estiver no escopo desse ponto do `TechniquesPanel`, **PARE e reporte** em vez de improvisar de onde tirá-lo.

---

## Parte 3 — Correção 3: contador de Magistrais

**Âncora:**
```
        {/* Grupo 2: Contador de magistrais — com padding generoso em ambos os lados */}
        <div style={{
          flexShrink: 0,
          paddingLeft: 20, paddingRight: 20,
          fontSize: 11, color: T.muted,
        }}>
          <span style={{ letterSpacing: 1 }}>
            {'★'.repeat(legInfo.used)}
            {'☆'.repeat(Math.max(0, legInfo.limit - legInfo.used))}
          </span>
          {' '}
          <span style={{
            fontSize: 10,
            color: legInfo.used >= legInfo.limit ? T.leg : T.muted,
            fontWeight: legInfo.used >= legInfo.limit ? 700 : 400,
          }}>
            {lang === 'en'
              ? `${legInfo.used}/${legInfo.limit} Leg.`
              : `${legInfo.used}/${legInfo.limit} Mag.`}
          </span>
        </div>
```

**Substituir por:**
```
        {/* Grupo 2: Contador de magistrais — nome por extenso, afastado do HP */}
        <div style={{
          flexShrink: 0,
          paddingLeft: 32, paddingRight: 32,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        }}>
          {/* Estrelas */}
          <span style={{ fontSize: 14, letterSpacing: 3, color: T.leg, lineHeight: 1 }}>
            {'★'.repeat(legInfo.used)}
            <span style={{ color: T.dim }}>
              {'☆'.repeat(Math.max(0, legInfo.limit - legInfo.used))}
            </span>
          </span>
          {/* Texto completo, nos dois idiomas */}
          <span style={{
            fontSize: 10,
            color: legInfo.used >= legInfo.limit ? T.leg : T.muted,
            fontWeight: legInfo.used >= legInfo.limit ? 700 : 500,
            whiteSpace: 'nowrap',
          }}>
            {legInfo.used}/{legInfo.limit}{' '}
            {lang === 'en' ? 'Legendary Slots' : 'Magistrais'}
          </span>
        </div>
```

---

## Parte 4 — Campo numérico: `type="text"` + `inputMode`

Mudança de escopo diferente das três acima, mas no mesmo arquivo e no mesmo ciclo de build. A spec0005 escondeu as setas nativas por CSS; esta parte remove a causa em vez do sintoma, adotando o padrão que o GOV.UK Design System recomenda desde 2020 (`type="text"` + `inputmode`), e devolve as setas do teclado, que o `type="number"` dava de graça.

### Edição 4.1 — o input

**Âncora:**
```
                type="number"
                value={shown}
                min={minDisplay}
                max={maxDisplay}
                onChange={e => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Tab') commit() }}
                onWheel={e => e.currentTarget.blur()}
```

**Substituir por:**
```
                type="text"
                inputMode="decimal"
                value={shown}
                onChange={e => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === 'Tab') { commit(); return }
                  // O type="text" não incrementa sozinho — reproduzimos o passo
                  // com as setas do teclado, que o type="number" dava nativamente.
                  if (e.key === 'ArrowUp')   { e.preventDefault(); step(1) }
                  if (e.key === 'ArrowDown') { e.preventDefault(); step(-1) }
                }}
```

> `min` e `max` saem porque não fazem nada em `type="text"` — e não eram eles que protegiam o valor: quem limita é o `step()` aqui e o `setPropValue()` do `logic.js`, que já clampa em `[mn, mx]`. **Confirme isso antes de aplicar**; se o clamp do `logic.js` não estiver lá, PARE e reporte.
>
> O `onWheel` também sai: era um remendo para um problema que só existe no `type="number"`.

### Edição 4.2 — o CSS deixa de ser necessário

O bloco que a spec0005 acrescentou ao `src/index.css` fica sem alvo depois da 4.1. **Não o remova nesta spec.** É inofensivo, e mantê-lo protege o caso de algum `type="number"` aparecer em outro ponto no futuro. Registre a observação no seu relatório e seguimos.

---

## Parte 5 — Build

```
npm run build
```

Se falhar, **PARE** e reporte sem commitar.

---

## Parte 6 — Conferência visual

Esta é a spec mais visual até agora; o roteiro é o que decide se ela está certa. Se recriar o `.claude/launch.json`, **commite-o**.

### Modo 3 colunas

| # | O que verificar | Esperado |
|---|---|---|
| 1 | Caixas das **vantagens de classe** | todas com a **mesma largura**, ocupando a coluna inteira — é a correção principal |
| 2 | Habilidades de classe | seguem uma por linha, sem mudança |
| 3 | Nomes longos | sem quebra de linha indevida |

### Modo 2 colunas

| # | O que verificar | Esperado |
|---|---|---|
| 4 | **Vantagens de classe** | **lado a lado**, em grid — hoje estão empilhadas |
| 5 | Habilidades de classe | seguem lado a lado, sem regressão |
| 6 | Independência | o item 1 e o item 4 valem **ao mesmo tempo**. Se consertar um quebrou o outro, a correção falhou — é exatamente o defeito histórico |

### Contador de Magistrais

| # | O que verificar | Esperado |
|---|---|---|
| 7 | Texto | "0/1 Magistrais" / "0/1 Legendary Slots" por extenso, não "Mag." |
| 8 | Distância | visivelmente afastado da barra de HP |
| 9 | Estrelas cheias/vazias | cheias em `T.leg`, vazias em `T.dim`, distinguíveis |

### Campo numérico

| # | O que verificar | Esperado |
|---|---|---|
| 10 | Setas nativas | continuam ausentes |
| 11 | **Setas do teclado** | com o campo focado, ↑ e ↓ alteram o valor de 1 em 1 e **param nos limites** |
| 12 | Limites por digitação | digitar um valor fora da faixa (ex.: `99` numa faixa 5–10) e sair do campo → o valor é corrigido para o limite |
| 13 | Roda do mouse | continua sem alterar o valor |
| 14 | Mobile | se puder emular um celular no DevTools, o teclado numérico ainda aparece |

O **item 6** e o **item 12** são os que podem falhar de um jeito que passa despercebido. Reporte item a item.

---

## Parte 7 — Documentos

### Edição 7.1 — `meta/STATUS.md`

**Âncora:**
```
Os três itens que continuam pendentes — todos de layout, nenhum de cálculo:

- **Tooltip `wrapperStyle` prop**: assinatura e span do Tooltip precisam aceitar `wrapperStyle`
- **TechRow independente por modo**: 3-col → full-width uniforme; 2-col → side-by-side em grid
- **Contador de Magistrais**: texto completo ("Legendary Slots" / "Magistrais"), padding maior, estrelas maiores
```

**Substituir por:**
```
_Nenhum item pendente de aplicação._ Os três que restavam — `wrapperStyle` no Tooltip, `TechRow` independente por modo e o contador de Magistrais por extenso — foram aplicados pela spec0006 em 2026-07-22, a partir do `GUIA_CORRECOES_FASE3.md` recuperado. Os três blocos ANTES do guia foram conferidos contra o `App.jsx` antes de virarem spec e batiam exatamente.

O que resta do guia é a **Fase 3** (`generateBuildImage` via Canvas, ~470 linhas, seção a partir da linha 420). Ela está fora desta leva de propósito: as conversas antigas recuperadas contêm a discussão de requisito da imagem — em especial quais ícones entram —, e construir a Fase 3 antes de extrair isso arrisca construí-la errada.
```

### Edição 7.2 — `meta/CHANGELOG.md`

**Âncora:**
```
### Modificado (interface)
```

**Substituir por:**
```
### Modificado (interface)
- Vantagens de classe: caixas com largura uniforme no modo 3 colunas e lado a lado no modo 2 colunas, agora de forma independente entre os modos — corrige um defeito em que ajustar um dos layouts quebrava o outro
- Contador de Magistrais: nome por extenso ("Magistrais" / "Legendary Slots"), afastado da barra de HP, estrelas maiores com vazias em tom apagado
- `Tooltip` passa a aceitar `wrapperStyle`, permitindo que quem o usa controle a largura do wrapper (usos existentes ficam idênticos)
- Campo de valor das propriedades migrado de `type="number"` para `type="text"` + `inputmode="decimal"`, conforme a orientação do GOV.UK Design System; as setas do teclado (↑ ↓) passam a ser tratadas pelo próprio componente
```

---

## Parte 8 — Fechamento

```
git add src/App.jsx meta/STATUS.md meta/CHANGELOG.md meta/specs/
git status
```

Confira o staged e **reporte a lista**. Não deve haver `logic.js`, `node_modules/` nem `dist/`.

```
git commit -m "fix(ui): aplica as tres correcoes de layout pendentes do guia" -m "Tooltip aceita wrapperStyle; TechRow passa a se comportar de forma independente em 3-col e 2-col; contador de magistrais com nome por extenso e afastado do HP. Migra o campo de valor para type=text com inputmode=decimal e trata as setas do teclado no componente."
git push
```

Ao final, acrescente à «💬 Última Sessão» do `meta/STATUS.md` o registro desta spec com o resultado item a item da Parte 6, e commite como `docs(status): registra aplicacao da spec0006`.

**Permanece em `v2-planner`.**
