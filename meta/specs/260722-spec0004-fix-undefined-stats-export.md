# spec0004 — Corrige `undefined` nas estatísticas do texto exportado (FIX-005, finalmente aplicado)

**Data:** 2026-07-22 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner` · **Depende de:** spec0003 (commit `709a3ed`)

**Contexto:** o modo Estatístico do export de texto imprime `undefined` em quase toda linha. O bug foi diagnosticado em 2026-06-24 e registrado como **FIX-005**, mas a correção nunca chegou ao código — ela vivia no `GUIA_CORRECOES_FASE3.md`, que se perdeu. As três causas-raiz de FIX-005 foram reconferidas no código atual em 2026-07-22 e continuam exatas.

**Desvio deliberado em relação ao texto de FIX-005:** ele propunha criar um helper local `fmtStatTxt()`. Não faremos isso. `formatStatValue(value, unit)` já existe em `logic.js` e já está importado no `App.jsx`; e `isStatChanged(stat)` também já existe em `logic.js`, sem uso até agora. Usamos os dois em vez de escrever helper novo.

**Regras de execução:**
- Localize cada âncora EXATAMENTE. Se UMA falhar, PARE e reporte qual.
- Só `src/App.jsx` e três documentos de `meta/`. **Não toque em `logic.js`** — ele já tem tudo o que é preciso.
- **Não delete `src/v1..v4/` nem `GUIA_COMPLETO_v4.md`.**
- Nenhum `--force`, `rebase` ou `reset --hard`.

---

## Parte 1 — Código

### Edição 1.1 — `src/App.jsx` · importar `isStatChanged`

**Âncora:**
```
  getAvailablePerks, getEffectiveCharm, getStatGroups,
```

**Substituir por:**
```
  getAvailablePerks, getEffectiveCharm, getStatGroups, isStatChanged,
```

### Edição 1.2 — `src/App.jsx` · corrigir o bloco de estatísticas de `generateBuildText`

**Âncora:**
```
    // Demais stats — somente as modificadas (valor !== 0)
    const groups = getStatGroups(stats, lang)
    for (const group of groups) {
      for (const stat of group.stats) {
        // HP e DET já foram adicionados acima
        if (stat.key === 'maxHP' || stat.key === 'maxResolve') continue
        // Só mostra se foi modificada (valor diferente de 0 ou base)
        if (!stat.value || stat.value === 0) continue
        lines.push(`  ${stat.label}: ${stat.formatted}`)
      }
    }
```

**Substituir por:**
```
    // Demais stats — somente as que diferem do valor base.
    // ATENÇÃO: getStatGroups(stats, classId, lang) — o classId é obrigatório.
    // Sem ele o lang cai no lugar errado (rótulos sempre em PT) e o grupo
    // de stats específico da classe some da lista. Ver FIX-005.
    const groups = getStatGroups(stats, build.classId, lang)
    for (const group of groups) {
      for (const stat of group.stats) {
        // HP e DET já foram adicionados acima
        if (stat.key === 'maxHP' || stat.key === 'maxResolve') continue
        // Só mostra o que o build de fato alterou em relação à base
        if (!isStatChanged(stat)) continue
        lines.push(`  ${stat.label}: ${formatStatValue(stat.value, stat.unit)}`)
      }
    }
```

---

## Parte 2 — Build

```
npm run build
```

Se falhar, **PARE** e reporte o erro completo sem commitar.

---

## Parte 3 — Conferência

Suba o dev server e confira. O caminho mais barato é o mesmo que você usou na spec0003 — se precisar recriar o `.claude/launch.json`, **desta vez commite o arquivo** em vez de apagá-lo (ver Parte 5).

Monte um Samurai equivalente ao do relato e exporte no modo **Estatístico**:

| # | O que verificar | Esperado |
|---|---|---|
| 1 | Nenhuma linha `undefined` | todas as stats com valor formatado |
| 2 | Percentuais | `+15%`, `+19%` — com sinal e `%`, não `0.15` |
| 3 | Pontos | `Ressurreição Vital: +25pts` |
| 4 | `Slots Magistrais` | aparece **só** quando a Vantagem Magistral está equipada (base é 1; sem ela, some da lista) |
| 5 | **Grupo da classe** | com Samurai + Lâmina Explosiva, procure `Raio da Lâmina Explosiva` / `Alvos do Puxão Espiritual`. **Antes não apareciam** — é ganho, não regressão |
| 6 | **Export em inglês** | troque para EN e exporte: os rótulos devem sair **em inglês**. Antes saíam em PT mesmo no modo EN |
| 7 | Não-regressão | modos `build` e `detailed` seguem iguais; `HP` e `Determinação` continuam sempre presentes |
| 8 | Painel da tela | o painel lateral de estatísticas **não deve mudar em nada** — ele já chamava a função certa |

Reporte o resultado item a item. Se o item 5 ou o 6 não mudar de comportamento, **PARE e reporte** — significa que a correção não pegou.

---

## Parte 4 — Documentos

### Edição 4.1 — `meta/STATUS.md` · tirar da lista de pendências

**Âncora:**
```
Os quatro itens que continuam pendentes:

- **Tooltip `wrapperStyle` prop**: assinatura e span do Tooltip precisam aceitar `wrapperStyle`
- **TechRow independente por modo**: 3-col → full-width uniforme; 2-col → side-by-side em grid
- **Contador de Magistrais**: texto completo ("Legendary Slots" / "Magistrais"), padding maior, estrelas maiores
- **`generateBuildText` stats fix**: `getStatGroups(stats, build.classId, lang)` + `fmtStatTxt()` + filtro `value === base`
```

**Substituir por:**
```
Os três itens que continuam pendentes — todos de layout, nenhum de cálculo:

- **Tooltip `wrapperStyle` prop**: assinatura e span do Tooltip precisam aceitar `wrapperStyle`
- **TechRow independente por modo**: 3-col → full-width uniforme; 2-col → side-by-side em grid
- **Contador de Magistrais**: texto completo ("Legendary Slots" / "Magistrais"), padding maior, estrelas maiores

> O quarto item — o fix das estatísticas de `generateBuildText` — **saiu desta lista em 2026-07-22**: foi de fato aplicado pela spec0004. Ver FIX-005.
```

### Edição 4.2 — `meta/STATUS.md` · registrar em Funcionando

**Âncora:**
```
- **Fase 2** — `generateBuildText` funcional para modos `build`, `detailed`, `stats`
  - Texto bilíngue conforme `lang` ativo
  - Cooldowns calculados (recarga real, não base)
  - HP e DET sempre presentes nas estatísticas
  - Código Base64 opcional (toggle nas configurações)
```

**Substituir por:**
```
- **Fase 2** — `generateBuildText` funcional para modos `build`, `detailed`, `stats`
  - Texto bilíngue conforme `lang` ativo — **inclusive nas estatísticas** (corrigido em 2026-07-22)
  - Cooldowns calculados (recarga real, não base)
  - HP e DET sempre presentes nas estatísticas
  - Demais stats com valor formatado, filtradas pelo que o build alterou, e com o grupo específico da classe presente (FIX-005)
  - Código Base64 opcional (toggle nas configurações)
```

### Edição 4.3 — `meta/DECISIONS.md` · corrigir o status de FIX-005

FIX-005 está registrado como resolvido desde 2026-06-24, mas o código nunca recebeu a correção. Não reescreva a entrada — **acrescente a emenda ao final dela**.

**Âncora:**
```
- **Lição:** Sempre verificar a assinatura de funções de `logic.js` antes de usar — elas têm parâmetros específicos que o assistente pode errar ao referenciar de memória.
```

**Substituir por:**
```
- **Lição:** Sempre verificar a assinatura de funções de `logic.js` antes de usar — elas têm parâmetros específicos que o assistente pode errar ao referenciar de memória.

> **Emenda de 2026-07-22 — esta entrada esteve factualmente errada por quase um mês.** FIX-005 foi registrado como resolvido em 2026-06-24, mas a correção existia apenas dentro do `GUIA_CORRECOES_FASE3.md` e nunca foi aplicada ao `App.jsx`. O bug seguiu vivo e reapareceu em uso normal. A correção só entrou no código em 2026-07-22, pela spec0004. As três causas-raiz acima foram reconferidas nessa data e estavam exatas.
>
> Duas consequências da causa-raiz 1 que não constavam do registro original: com `classId` recebendo o valor de `lang`, (a) o rótulo nunca resolvia para `LABELS_EN` — **o export em inglês saía com rótulos em português**; e (b) o grupo de stats específico da classe era omitido por inteiro do texto, não impresso como `undefined`.
>
> **Lição maior, que motivou DEC-007:** um bug não está resolvido quando o conserto está escrito num documento. Está resolvido quando está no código, compilado e conferido. Nenhuma entrada de FIX deve ser criada com base em código que ainda não foi aplicado — se o código não entrou, o lugar é o `STATUS.md`, em «⏳ Pendente de Aplicação».
```

### Edição 4.4 — `meta/CHANGELOG.md`

**Âncora:**
```
- Props de item Magistral saíam abaixo do máximo na build aleatória (FIX-006). Builds salvos ou compartilhados com o valor errado são saneados ao carregar
```

**Substituir por:**
```
- Props de item Magistral saíam abaixo do máximo na build aleatória (FIX-006). Builds salvos ou compartilhados com o valor errado são saneados ao carregar
- Estatísticas do texto exportado saíam como `undefined` (FIX-005 — diagnosticado em junho, aplicado só agora). Junto com isso: os rótulos das estatísticas passam a respeitar o idioma EN, e o grupo de estatísticas específico da classe volta a aparecer no texto
```

---

## Parte 5 — Opcional, mas recomendado: versionar o `.claude/launch.json`

Na spec0003 você criou esse arquivo para subir o dev server e o apagou antes do commit. A conferência visual vai se repetir em toda spec de UI daqui pra frente. Se você recriá-lo nesta sessão, **commite-o** — `.claude/` é versionado de propósito neste repo. Se julgar que ele carrega algo específico da sua máquina que não deve ir ao Git, não commite e me diga o quê, para eu registrar a razão.

---

## Parte 6 — Fechamento

```
git add src/App.jsx meta/STATUS.md meta/DECISIONS.md meta/CHANGELOG.md meta/specs/
git status
```

Confira o staged e **reporte a lista**. Não deve haver `logic.js`, `node_modules/` nem `dist/`.

```
git commit -m "fix(export): corrige estatisticas undefined no texto exportado" -m "Aplica FIX-005, diagnosticado em junho e nunca aplicado: passa build.classId para getStatGroups, formata o valor com formatStatValue e filtra por isStatChanged. Efeitos colaterais corrigidos: rotulos passam a respeitar o idioma EN e o grupo de stats da classe volta a aparecer."
git push
```

Ao final, acrescente à «💬 Última Sessão» do `meta/STATUS.md` o registro do que esta spec fez — incluindo o resultado item a item da Parte 3 — e commite como `docs(status): registra aplicacao da spec0004`.

**Permanece em `v2-planner`.**
