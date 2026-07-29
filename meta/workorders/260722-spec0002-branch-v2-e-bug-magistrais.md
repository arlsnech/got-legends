# spec0002 — Registra o bug dos magistrais e protege o código atual na branch `v2-planner`

**Data:** 2026-07-22 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Depende de:** spec0001, já aplicada e publicada (commit `0cebed7` sobre `63fb3a6`).

**Objetivo:** o estado atual da ferramenta (`src/App.jsx` modificado + `src/icons.js`, `public/icons/`, `logs/` não rastreados) só existe no disco do usuário. Esta spec o coloca em segurança numa branch nova, **sem tocar na `main`** e **sem apagar nada**. A limpeza dos `src/v1..v4` é um passo posterior, depois da extração retroativa.

**Regras de execução:**
- Localize cada âncora EXATAMENTE. Se UMA falhar, PARE e reporte qual — não aplique as outras pela metade.
- As edições de documento tocam só `meta/`. As operações de Git são as descritas aqui, nada além.
- **Nenhum `git push --force`, nenhum `git rebase`, nenhum `git reset --hard`, em nenhuma hipótese.**
- **Não delete `src/v1/`, `src/v2/`, `src/v3/`, `src/v4/` nem `GUIA_COMPLETO_v4.md`.** Eles serão removidos numa spec futura, depois de estudados.
- Se qualquer passo divergir do descrito (branch já existe, build falha, worktree em estado inesperado), PARE e reporte antes de seguir.

---

## Parte 1 — Levantamento (somente leitura)

Rode e **reporte a saída** antes de aplicar qualquer edição:

```
git status
git log --oneline -5
git branch -a
git ls-remote --heads origin
ls meta/specs/
```

Confirme e me diga:
- se `origin/main` está em `0cebed7` (ou à frente);
- quais branches existem no remoto (a expectativa é `main` e `gh-pages` — `gh-pages` é a branch de publicação criada pelo `gh-pages -d dist`, **não se toca nela**);
- se `meta/specs/260722-spec0001-history-e-adocao-kit-code.md` está no lugar certo. Se estiver na raiz em vez de `meta/specs/`, mova com `git mv` e inclua no commit da Parte 3.

---

## Parte 2 — Edições de documento

### Edição 2.1 — `meta/STATUS.md` · registrar o bug dos magistrais

**Âncora:**
```
_Nada ativo._ (Bug com sintoma observável entra aqui; quando resolvido e se foi grave, vira FIX-N em DECISIONS.)
```

**Substituir por:**
```
### Props de item Magistral não ficam travadas no máximo

**Sintoma:** ao gerar uma build aleatória (🎲), itens Magistrais aparecem com props em valores **abaixo do máximo**. No jogo — e conforme o próprio `README.md` («Props travadas no valor máximo, selecionáveis mas não editáveis») — item Magistral sempre tem a prop no valor máximo.

**Causa raiz:** a trava nunca foi implementada. O comportamento correto só *parecia* funcionar porque o valor inicial já era o máximo e ninguém o alterava. Três pontos:

| Onde | O que faz hoje | O que deveria fazer |
|---|---|---|
| `logic.js` › `randomBuild()`, ~L1005 e ~L1013 | `randomInRange(p.mn, p.mx, p.u)` sem olhar `chosen.leg` | se o item é `leg`, usar `p.mx` direto |
| `logic.js` › `setPropValue()`, ~L797 | clampa em `[mn, mx]` para qualquer item — deixa **baixar** a prop de um Magistral pelos steppers ▲▼ | se o item é `leg`, ignorar a alteração e manter `mx` |
| `App.jsx` › card de gear | usa `isLeg` só para cor e tag «MAGISTRAL» | renderizar o valor como texto travado, sem input nem steppers |

Note que `logic.js` › `selectProp()` (~L761) já acerta por outro caminho: o padrão dele é `propDef.mx` para todo item, Magistral ou não.

**Correção proposta (ainda não aplicada):** um helper único — `isLegendarySlot(build, slotName)` — consultado nos três pontos. Mudança pequena e cirúrgica; merece spec própria, com build e conferência visual depois.

**Descoberto em:** 2026-07-22, por leitura do código a partir de um relato de memória do usuário. Nunca havia sido registrado — a ferramenta é anterior à adoção do KCM.
```

### Edição 2.2 — `meta/STATUS.md` · corrigir a referência ao guia perdido

**Âncora:**
```
Os itens abaixo têm código completo no arquivo `GUIA_CORRECOES_FASE3.md`. Precisam ser aplicados manualmente ao `App.jsx`:
```

**Substituir por:**
```
> ⚠️ **O `GUIA_CORRECOES_FASE3.md` não existe mais** — não está na pasta local nem no repositório, e não será recuperado (confirmado pelo usuário em 2026-07-22). O código destes quatro itens **precisa ser reescrito do zero**. Não perca tempo procurando o arquivo. Daqui em diante correção de código sai por spec aplicada pelo Claude Code, não por guia para colar à mão — foi justamente esse formato que deixou a Fase 3 parada desde junho (DEC-007).

Os quatro itens que continuam pendentes:
```

### Edição 2.3 — `meta/CHANGELOG.md` · registrar esta leva

**Âncora:**
```
### Pendente de aplicação (guia pronto, não aplicado)
```

**Substituir por:**
```
### Infraestrutura de repositório
- Pasta local ligada ao remoto `arlsnech/got-legends` (SSH, alias `github-gametools`); histórico preservado, nada reescrito
- Branch `v2-planner` criada a partir da `main` para abrigar o estado atual da ferramenta — a `main` e o site publicado seguem intactos
- `src/v1..v4` e `GUIA_COMPLETO_v4.md` preservados em commit próprio antes da limpeza futura

### Bug conhecido (registrado, não corrigido)
- Props de item Magistral não ficam travadas no máximo — visível na build aleatória. Diagnóstico completo em `meta/STATUS.md`

### Pendente de aplicação (código precisa ser reescrito — guia original perdido)
```

---

## Parte 3 — Commit de documentação na `main`

Ainda na branch `main`. Estagie **exclusivamente** os documentos e as specs — nenhum arquivo de código:

```
git add meta/STATUS.md meta/CHANGELOG.md meta/specs/
git status
```

Confira que o staged contém **só** `meta/`. Se aparecer qualquer coisa de `src/`, `public/` ou raiz, remova do stage com `git restore --staged <arquivo>` e reporte.

```
git commit -m "docs(status): registra bug de props travadas em item magistral" -m "Diagnostico com causa raiz nos tres pontos de logic.js e App.jsx. Corrige a nota que mandava procurar o GUIA_CORRECOES_FASE3.md, que nao existe mais."
git push origin main
```

---

## Parte 4 — Restaurar o arquivo de build de exemplo

O `Builds/O Samurai Contra-Ataca.json` existe no remoto, é referenciado pelo `README.md`, e sumiu da pasta local. Traga de volta:

```
git checkout -- "Builds/O Samurai Contra-Ataca.json"
ls Builds/
```

Se o `git checkout` falhar, reporte — não recrie o arquivo à mão.

---

## Parte 5 — Verificar o build ANTES de commitar código

```
npm install
npm run build
```

**Se o build falhar: PARE aqui.** Reporte o erro completo e não crie a branch nem commite nada. Um commit de código que não compila é pior que nenhum commit.

Se passar, siga.

---

## Parte 6 — Branch `v2-planner` e os dois commits

```
git checkout -b v2-planner
```

Confirme com `git branch` que está em `v2-planner`. **Se a branch já existir**, PARE e reporte.

### Commit A — snapshots históricos (antes da limpeza)

```
git add src/v1/ src/v2/ src/v3/ src/v4/
git status
git commit -m "chore(historico): preserva snapshots v1 a v4 antes da limpeza" -m "Copias congeladas do App.jsx ao longo do desenvolvimento, mais o GUIA_COMPLETO_v4.md. Entram no historico para poderem ser removidas da arvore de trabalho sem perda. src/v4/App.jsx e byte a byte igual ao src/App.jsx atual."
```

### Commit B — estado atual da ferramenta

```
git add src/ public/ logs/ INSTRUCOES-DO-PROJETO.md
git status
```

Confira o staged antes de commitar e **reporte a lista**. A expectativa é: `src/App.jsx` (modificado), `src/icons.js` (novo), `public/icons/**` (novo), `logs/2026-06-27.md` (novo), `INSTRUCOES-DO-PROJETO.md` (novo). Se aparecer algo de `node_modules/` ou `dist/`, PARE — o `.gitignore` está falhando e isso precisa ser resolvido antes.

```
git commit -m "feat(planner): estado atual da ferramenta com fase 2 completa" -m "Traz o src/App.jsx evoluido (~2500 linhas, layout 3-col, SaveDrawer, temas, exportacao de texto), o src/icons.js novo e os icones em public/icons/. A main permanece na v1.0 ate esta branch ser validada."
git push -u origin v2-planner
```

---

## Parte 7 — Fechamento

1. Rode `git log --oneline --all --graph -10` e reporte, para o usuário ver as duas linhas (`main` e `v2-planner`).
2. Confirme que `main` **não** ganhou nenhum commit de código e que `gh-pages` não foi tocada.
3. Acrescente ao final de `meta/STATUS.md`, na seção «💬 Última Sessão», um parágrafo curto registrando o que esta spec fez de fato — incluindo se o build passou e o que ficou pendente. Commite esse ajuste na `v2-planner` (`docs(status): registra aplicacao da spec0002`) e dê push.
4. Reporte, em lista, **o que ficou fora de propósito**: os `src/v1..v4` e o `GUIA_COMPLETO_v4.md` continuam na árvore de trabalho, aguardando a extração retroativa antes de serem removidos.

**Permanece na branch `v2-planner`** ao terminar — é onde o trabalho continua.
