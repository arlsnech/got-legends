# wo0021 — Renomear `spec` → `WO` e liberar `specs/` para specs de feature

**Data:** 2026-07-27 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Toca código do produto?** Não — só `meta/`, `.claude/` e raiz. **Build:** dispensável; a rede é o `git diff`.
**Contexto:** template-update do KCM v1.87.0. A decisão está na DEC-030, que entra pela `wo0023`.

---

## Por que esta WO existe

O kit v1.87 separa dois artefatos que este projeto tratava como um só:

- **WO** (`meta/workorders/`, `AAMMDD-woNNNN-desc.md`) — diz **como aplicar**: texto exato e âncora.
- **spec de feature** (`meta/specs/`, molde em `meta/SPEC.md`) — diz **o quê construir e quando está pronto**: problema, critérios de aceite verificáveis, decisões, fora de escopo.

As 20 "specs" 0001–0020 deste projeto são, pelo conteúdo, WOs. O nome `specs/` estava ocupado pelo artefato errado.

## Regra que vale para esta WO inteira

**Não renomeie os 20 arquivos existentes** (`260725-spec0015-....md` e irmãos) **nem as menções históricas** a `spec0001`…`spec0020` em `STATUS.md`, `DECISIONS.md`, `CHANGELOG.md`, `HISTORY.md` e `IDEAS.md`. São nomes próprios de artefatos passados; reescrevê-los faria o histórico mentir sobre o que se chamava o quê em cada data.

Muda só: o **nome da pasta**, o **nome da skill**, e as passagens que enunciam a **convenção em vigor**. A numeração é contínua — a próxima WO nova é a `wo0024`, não a `wo0001`.

**Preserve o final de linha e o encoding de cada arquivo como já estão.** Não normalize nada.

---

## Edição 1 — mover a pasta das WOs

```
git mv meta/specs meta/workorders
```

Se o `git mv` recusar por a pasta ter arquivos untracked, mova o que estiver rastreado e depois `git add` o resto. Confira com `git status` que os 20 arquivos aparecem como **rename**, não como delete+add.

## Edição 2 — mover a skill

```
git mv .claude/skills/apply-spec .claude/skills/apply-wo
```

Depois **substitua o conteúdo** de `.claude/skills/apply-wo/SKILL.md` pelo arquivo `SKILL.md` que o chat entregou junto desta WO (já está no disco, ou peça ao usuário). O `name:` do frontmatter tem de ler `apply-wo`.

## Edição 3 — `meta/CONTEXT.md`, árvore do projeto

**Âncora (uma linha, exata):**

```
│   └── specs/        — specs de doc, aplicadas pelo Claude Code via /apply-spec
```

**Substituir por:**

```
│   ├── workorders/   — WOs: o texto exato de cada edição + âncora, aplicadas via /apply-wo
│   ├── specs/        — specs de feature: o quê construir e os critérios de aceite (molde: SPEC.md)
│   └── analises/     — a análise que precede mudança não-trivial (nasce no primeiro uso)
```

## Edição 4 — `meta/CONTEXT.md`, linha do `.claude/`

**Âncora (uma linha, exata):**

```
├── .claude/          — settings.json + skills /apply-spec e /wrap
```

**Substituir por:**

```
├── .claude/          — settings.json + skills /apply-wo e /wrap
```

## Edição 5 — `meta/GLOSSARY.md`, seção «Comandos / artefatos»

**Âncora (duas linhas consecutivas, exatas):**

```
- **spec** — arquivo em `meta/specs/` com o texto exato de uma alteração de documento e a âncora onde ela entra. O chat autora, o Claude Code posiciona. Nome: `AAMMDD-specNNNN-desc.md`. É artefato versionado; não se apaga depois de aplicada.
- **`/apply-spec`** — comando do Claude Code que aplica uma spec (âncora exata, ou PARA e reporta).
```

**Substituir por:**

```
- **WO (work order)** — arquivo em `meta/workorders/` com o texto exato de uma alteração e a âncora onde ela entra. Diz **como aplicar**. O chat autora, o Claude Code posiciona. Nome: `AAMMDD-woNNNN-desc.md`. É artefato versionado; não se apaga depois de aplicada. Até a `wo0020` estes arquivos se chamavam **spec** e viviam em `meta/specs/`; os nomes antigos foram preservados de propósito (DEC-030).
- **spec de feature** — arquivo em `meta/specs/`, um por feature, no formato de `meta/SPEC.md`: o problema, os critérios de aceite verificáveis, as decisões de desenho e o fora-de-escopo. Diz **o quê** construir e quando está pronto — não como aplicar, que é papel da WO.
- **análise** — arquivo em `meta/analises/AAMMDD-ANALISE-<tema>.md` que precede o compromisso numa mudança não-trivial: problema, o que foi medido, opções (inclusive as descartadas, com o motivo), recomendação única, riscos e ponto de decisão. Não decide nem abre trabalho sozinha; para no ponto de decisão. Funil: análise → WO → DECISIONS.
- **`/apply-wo`** — comando do Claude Code que aplica uma WO (âncora exata, ou PARA e reporta).
```

## Edição 6 — arquivos inteiros entregues pelo chat

Estes vêm prontos, para **substituir** o que existe (ou criar, no caso do `SPEC.md`). Não os edite; só confirme que estão no lugar certo antes do commit:

| Arquivo entregue | Destino |
|---|---|
| `CLAUDE.md` | `CLAUDE.md` (raiz) — substitui |
| `SKILL.md` | `.claude/skills/apply-wo/SKILL.md` — substitui (ver Edição 2) |
| `.flatdropignore` | `.flatdropignore` (raiz) — substitui |
| `SPEC.md` | `meta/SPEC.md` — **novo** |
| `LOG-TEMPLATE.md` | `meta/LOG-TEMPLATE.md` — substitui |

**Não crie `meta/analises/` nem `meta/specs/` vazias.** A pasta nasce no primeiro uso; `meta/specs/` deixa de existir com a Edição 1 e volta quando a primeira spec de feature for escrita.

---

## Fechamento

1. `git status` — confirme os 20 arquivos como **rename** e nenhum delete solto.
2. `git diff` — confira a forma das edições 3, 4 e 5.
3. `git add -A` (inclui esta WO, que já está em `meta/workorders/`).
4. Commit e push:

```
git commit -m "refactor(meta): renomeia specs para workorders e adota o vocabulario do kit v1.87"
git push
```

## Relatório esperado

Ao terminar, relate: os arquivos tocados, se o `git mv` preservou o histórico dos 20, se alguma âncora não bateu, e o hash do commit. Se **qualquer** âncora falhar, PARE e reporte qual — não aplique as outras pela metade.
