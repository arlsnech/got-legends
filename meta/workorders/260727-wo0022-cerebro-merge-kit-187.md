# wo0022 — Merge do `meta/CEREBRO.md` com o template-update do KCM v1.87.0

**Data:** 2026-07-27 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Toca código do produto?** Não. **Build:** dispensável; a rede é o `git diff`.
**Depende de:** `wo0021` aplicada (a pasta já tem de se chamar `meta/workorders/`).

---

## Escopo

Dez edições no `meta/CEREBRO.md`. Adotam as novidades do kit v1.87 e trocam o vocabulário `spec` → `WO`.
**Nada do que é específico deste projeto sai** — as seções «Convenções (deste projeto…)», «Build e validação deste projeto», «Ciclo de vida de uma spec» e «Kit do Claude Code — instalado neste repo» permanecem, algumas renomeadas.

**Preserve o final de linha e o encoding do arquivo como já estão.**

---

## Edição 1 — princípio 6 ganha a cláusula de premissas

**Âncora (fim do parágrafo do princípio 6, exata):**

```
e deixa claro o que é decisão dele versus passo necessário.
```

**Substituir por:**

```
e deixa claro o que é decisão dele versus passo necessário. Quando o pedido for ambíguo ou de escala de feature, expõe as lacunas e o que assumiu ANTES de construir; em tarefa pequena a regra continua sendo fazer, não levantar bandeira.
```

## Edição 2 — princípio 8 ganha a disciplina de mount

**Âncora (fim do parágrafo do princípio 8, exata):**

```
se constatar que já foi resolvida, diz isso e ATUALIZA o STATUS, em vez de ecoar o registro velho.
```

**Substituir por:**

```
se constatar que já foi resolvida, diz isso e ATUALIZA o STATUS, em vez de ecoar o registro velho. Revê o mount a CADA turno (novos `.txt`, `_MANIFEST`, arquivos mudados) antes de responder — não espera o usuário sinalizar upload; um «continuar» ou uma reclamação também podem vir com o mount atualizado. E COMPARA o mount com o que lembrava: o mount não é verdade absoluta nem a memória basta — provavelmente é a pasta do usuário, mas ele pode ter esquecido de subir algo. Se difere do que lembrava, é provável atualização: estuda a diferença. Se o mount bate com a memória mas o usuário afirma ter aplicado algo que não aparece, faz o que dá e AVISA («o mount não parece atualizado com X»), em vez de inferir cegamente ou regenerar o que já foi feito.
```

## Edição 3 — tabela «Como manter os documentos» ganha três linhas

**Âncora (uma linha, exata):**

```
| `logs/AAAA-MM-DD.md` | Histórico | Ao final de cada sessão (formato em LOG-TEMPLATE). |
```

**Substituir por:**

```
| `logs/AAAA-MM-DD.md` | Histórico | Ao final de cada sessão (formato em LOG-TEMPLATE). |
| `SPEC.md` | Referência fixa | Molde da spec de feature: problema, critérios de aceite verificáveis, decisões, fora de escopo. Copie para `meta/specs/AAMMDD-nome.md`, uma por feature. |
| `meta/workorders/AAMMDD-woNNNN-desc.md` | Cresce (uma por leva) | O texto exato de cada edição + a âncora. Artefato versionado; não se apaga depois de aplicada. |
| `meta/analises/AAMMDD-ANALISE-<tema>.md` | Cresce (uma por decisão) | Antes de uma mudança não-trivial — a pasta nasce no primeiro uso. |
```

## Edição 4 — seção nova «Análise antes do compromisso»

**Âncora (uma linha, exata — é o título da seção seguinte):**

```
## Ao receber um template-update do KCM
```

**Substituir por** (a seção nova, depois o título original de volta):

```
## Análise antes do compromisso

Mudança **não-trivial** — estrutural, cara de desfazer, que toca várias frentes, ou que chega como pergunta aberta («vale a pena X?») — começa por uma **análise escrita**, não por um plano de execução. A análise é o documento que precede o compromisso: existe para o usuário decidir com o custo à vista, não para justificar o que já foi decidido.

- **Onde:** `meta/analises/AAMMDD-ANALISE-<assunto>.md`. A pasta **nasce no primeiro uso** — nunca antes, nunca vazia. A data é a de criação e não muda depois.
- **O que tem dentro:** `Status` (Rascunho · Em discussão · Decidida · Implementada · Abandonada · Substituída) · **Problema** (o que dói, para quem, o que acontece se nada for feito) · **Restrições / o que foi medido** · **Opções consideradas** (inclusive as descartadas, com o motivo do descarte) · **Recomendação** (uma, explícita, com o porquê) · **Riscos** (o que vigiar depois de aplicar) · **Ponto de decisão** (o que se precisa do usuário).
- **Meça antes de propor.** O que dá para medir, meça; o resto entra rotulado como estimativa. Análise que projeta ganho sem medir vira erro de planejamento. Neste projeto, medir costuma ser **simular** — foi a simulação de duas passadas que transformou «altura conservadora» em «corta 60% do conteúdo» (DEC-026).
- **A análise não decide nem abre trabalho sozinha.** Para no ponto de decisão e espera o usuário. Depois de decidida, o desfecho vai para o `DECISIONS.md` (a análise guarda o raciocínio; o DECISIONS guarda a decisão) e a análise só muda de `Status` — análise vencida não se apaga: o «por que não» é o que evita refazer o mesmo debate daqui a seis meses.
- **Funil:** análise → **WO** (`meta/workorders/`) → `DECISIONS.md`. Quando o trabalho é de produto, a análise vira **spec de feature** (`meta/specs/AAMMDD-<nome>.md`, uma por feature, molde em `meta/SPEC.md`) — a spec diz **o quê** construir e quando está pronto; a WO diz **como aplicar**. Mesma regra: `meta/specs/` só nasce quando a primeira spec for escrita.
- **Mudança pequena não pede análise.** Cerimônia em cima de trivialidade é desperdício — vá direto ao trabalho. Na dúvida, meia página resolve.
- **Modelo:** ao escrever a primeira análise, deixe também um `meta/analises/_TEMPLATE.md` com esse esqueleto — o modelo é o que faz a convenção pegar. Se a pasta for ignorada no `.flatdropignore`, **reinclua o modelo** (`!meta/analises/_TEMPLATE.md`): modelo e guia sempre sobem ao Projeto; corpo de análise, não.

## Ao receber um template-update do KCM
```

## Edição 5 — a DEC-008 ganha a lista de colisões já julgadas

**Âncora (parágrafo inteiro, exato — é o corolário que fecha a citação da DEC-008):**

```
> Corolário para o `INSTRUCOES-DO-PROJETO.md`: neste projeto ele **não é um arquivo do repo** — o texto vive nas Instruções do Projeto do chat (claude.ai). Não há «vivo» para comparar no mount. O procedimento é: pegar o template, cortar o que não se aplica, especializar o que se aplica, respeitar o teto de ~6.900 caracteres, e ENTREGAR o texto pronto para o usuário colar. Nunca pedir que ele cole o texto atual só para poder comparar, se o objetivo é justamente regerar.
```

**Substituir por:**

```
> Corolário para o `INSTRUCOES-DO-PROJETO.md`: neste projeto ele **não é um arquivo do repo** — o texto vive nas Instruções do Projeto do chat (claude.ai). Não há «vivo» para comparar no mount. O procedimento é: pegar o template, cortar o que não se aplica, especializar o que se aplica, respeitar o teto de ~6.900 caracteres, e ENTREGAR o texto pronto para o usuário colar. Nunca pedir que ele cole o texto atual só para poder comparar, se o objetivo é justamente regerar.
>
> **Colisões já julgadas — não reabrir.** As linhas abaixo colidem com o template genérico em TODO template-update e já foram decididas. O assistente as reporta como «colisão conhecida, sem ação» e segue; **não as apresenta de novo como decisão a tomar.** Reabrir uma decisão fechada gasta o turno do usuário para chegar à mesma resposta.
> 1. **IDs de domínio em `snake_case` PT-BR** (`ronin_breath`, `gw_kunai`) × «nomes de variáveis em inglês». Vence o projeto: os IDs são a chave que liga `data.js` ↔ `logic.js` ↔ `icons.js`.
> 2. **Conventional Commits sem acento** × «imperativo curto em PT-BR». Vence o projeto (DEC-010): o CMD do Windows corrompe acentos.
> 3. **`.gitignore` de stack** (node_modules, dist, .env, `*.log`) × o template, que só cobre lixo de SO. Vence o projeto — o template é aditivo, nunca substituto.
> 4. **`.claude/settings.json` com os `npm run` no `allow` e `npm run deploy` no `deny`** × o subconjunto genérico. Vence o projeto (DEC-016).
> 5. **Skills `/apply-wo` e `/wrap` na versão longa deste repo** (com build, push e a cláusula de curadoria) × as versões curtas do template. Vence o projeto.
> 6. **Toda string de UI existe em PT-BR e EN** — o kit não cobre isso em lugar nenhum; não é colisão, é lacuna do template.
>
> O que **não** entra nesta lista é novidade de comportamento (regra nova, seção nova, disciplina nova): essa se avalia a cada template-update, e a DEC-030 é o exemplo de uma que foi adotada.
```

## Edição 6 — «Refino das Instruções» ganha as quatro cláusulas do v1.87

**Âncora (uma linha, exata — o último item da lista de refino):**

```
- **Registre:** toda mudança de instrução vira uma linha no DECISIONS (o que mudou e por quê) e um item em «Feedback para o Kit» no IDEAS — é assim que o kit aprende com este projeto.
```

**Substituir por:**

```
- **Registre:** toda mudança de instrução vira uma linha no DECISIONS (o que mudou e por quê) e um item em «Feedback para o Kit» no IDEAS — é assim que o kit aprende com este projeto.
- **É dever do assistente, não pedido do usuário.** As Instruções nascem genéricas e são ponto de partida a especializar. O assistente **deve** propor o refino por conta própria: ao fim da primeira sessão de trabalho real e, depois, sempre que perceber sinal — regra que ele repetidamente descumpre, instrução que nunca se aplicou, atrito recorrente. Se o usuário tiver de pedir, o refino já atrasou.
- **O assistente decide o que merece texto integral.** As Instruções trazem a regra em forma curta e o CEREBRO guarda a definição completa. Se uma regra é crítica **neste** projeto — ou é justamente a que mais se erra —, promova-a de volta ao texto integral nas Instruções, dizendo por quê. Encolher não é a meta; acertar o que fica sempre à vista é.
- **Atrito sem solução local vira feedback ao kit.** Se o problema não é deste projeto e sim do KCM (regra confusa, gatilho que não dispara, lacuna de comportamento), registre em «Feedback para o Kit» no IDEAS — é desfecho legítimo do refino, não desculpa para não refinar.
- **Personalização genérica migra para os meta/.** O que veio do formulário de montagem serve para PREENCHER os arquivos de contexto; depois de aplicado, não precisa continuar ocupando as Instruções. Proponha mover, deixando nas Instruções a identidade do projeto, o ritual, os gatilhos e a disciplina de entrega.
```

## Edição 7 — seção nova «Bloco de fecho de turno»

**Âncora (uma linha, exata — é o título da seção seguinte):**

```
## Tabela de gatilhos (evento → o que o assistente entrega)
```

**Substituir por:**

```
## Bloco de fecho de turno (formato fixo)

Todo turno de trabalho fecha assim, **emitindo só as linhas que se aplicam** — linha sem conteúdo real não aparece (não escreva «nada a arquivar» nem invente handoff). **Próximo** vem antes de um divisor; o resto vem depois dele:

1. **Próximo** — sempre presente, ANTES do divisor, em duas partes: **(a) Ação** — a próxima coisa concreta a fazer; **(b) Peça no próximo turno** — a frase que o usuário pode mandar de volta para retomar sem reconstruir contexto, já redigida como pedido. Não é lista de possibilidades: é uma ação e um pedido.
2. **Estado** — uma linha: onde o projeto está agora (versão, fase, e o resultado do `npm run build` quando houve código) e o commit, quando existir.
3. **Arquivar / Manter** — só se houver notas avulsas no mount. Em lista: uma linha **Arquivar:** com os nomes já absorvidos nos `meta/` e uma linha **Manter:** com os que seguem vivos, cada uma com o motivo em poucas palavras. Nome por nome, sem esperar que o usuário pergunte.
4. **Config recomendada** — em lista, uma linha por raia (chat de planejamento · Claude Code), nomeando o tipo de modelo e o nível de esforço. Nunca afirme saber a config atual — recomende pela tarefa que vem.
5. **Handoff** — por último, só quando houver arquivo trocando de mão: arquivo por arquivo, onde cada um vai. Handoff de sessão completo: o artefato se chama `AAMMDD-HANDOFF-BRIEF.md`.

**De quem é este bloco:** da raia de **planejamento** (o assistente no chat). Quem **executa** no Claude Code não fecha assim — fecha com o **relatório de trabalho**: o que fez, o que encontrou que foge do que a WO pedia, os arquivos tocados, o resultado do build/validação e o commit. Trocar o relatório por este formulário perde a informação que só quem executou tem.

**Este formato é ponto de partida, não jaula.** Se surgir um dado recorrente que mereça linha própria, acrescente; se uma linha nunca se aplicar aqui, proponha removê-la no refino. Vale para todo turno de trabalho, não só ao encerrar a sessão.

## Tabela de gatilhos (evento → o que o assistente entrega)
```

## Edição 8 — raias chat ↔ Code: vocabulário WO

**Âncora (três linhas de lista consecutivas, exatas):**

```
- **Chat (planejamento):** cura e ENTREGA arquivos de doc. Para reescrita de fundo/voz ou arquivo **novo/pequeno**, entrega o **arquivo inteiro**. Para um **delta estruturado** num doc **grande** (marcar fase, abrir fase, inserir nota, acrescentar item), entrega uma **spec curta** em `meta/specs/` com o **texto exato** e **âncora semântica** (seção/título, nunca nº de linha) — e o Code posiciona.
- **Claude Code (execução):** implementa código e faz edições **append-only** nos meta/ (linha no STATUS, `DEC-`/`FIX-` em DECISIONS, marcar estado de fase). Aplica as specs de doc. Roda build/validação. Commita.
- **Nomes padronizados:** specs em `meta/specs/` seguem `AAMMDD-specNNNN-desc.md` (ex.: `260630-spec0007-asu-entrega-e-escopo.md`); instruções ASU seguem `AAMMDD-asuNNNN.yaml`. Numeração sequencial e estável; a data é a de criação. O chat nomeia; o Code aplica.
```

**Substituir por:**

```
- **Chat (planejamento):** cura e ENTREGA arquivos de doc. Para reescrita de fundo/voz ou arquivo **novo/pequeno**, entrega o **arquivo inteiro**. Para um **delta estruturado** num doc **grande** (marcar fase, abrir fase, inserir nota, acrescentar item), entrega uma **WO curta** em `meta/workorders/` com o **texto exato** e **âncora semântica** (seção/título, nunca nº de linha) — e o Code posiciona. Uma WO nunca vai sozinha: acompanha a linha `/apply-wo <arquivo>` pronta para colar.
- **Claude Code (execução):** implementa código e faz edições **append-only** nos meta/ (linha no STATUS, `DEC-`/`FIX-` em DECISIONS, marcar estado de fase). Aplica as WOs. Roda build/validação. Commita. **Fecha com relatório de trabalho, não com o bloco de fecho de turno** — aquele é da raia de planejamento.
- **Nomes padronizados:** WOs em `meta/workorders/` seguem `AAMMDD-woNNNN-desc.md`; specs de feature em `meta/specs/` seguem `AAMMDD-<nome>.md`, uma por feature. Numeração sequencial e estável; a data é a de criação. O chat nomeia; o Code aplica. **A sequência não recomeçou na renomeação:** os arquivos 0001–0020 mantêm o nome `spec` que tinham quando nasceram (DEC-030).
```

## Edição 9 — método, aplicação e ciclo de vida

**Âncora (bloco contínuo, exato — do «Método» até a última linha do «Ciclo de vida»):**

```
**Método "doc por spec":** o chat AUTORA o texto; o Code só POSICIONA — não inventa prosa de curadoria. **Um canal por doc por ciclo** (se um doc foi por spec, o chat não entrega o mesmo doc inteiro no mesmo ciclo). Specs **só de doc não tocam o produto** → não precisam de build; a rede é o `git diff`.

**Ao APLICAR uma spec (Code):** localize cada âncora EXATAMENTE; se não achar uma, **PARE e reporte** — nunca chute um lugar próximo. Não toque em nada fora das edições nomeadas. Rode `git diff` e confira a forma esperada antes de commitar.

**Ciclo de vida de uma spec (regra deste projeto):** a spec é **artefato versionado**, não rascunho descartável.
- Ao ENTREGAR uma spec, o chat já avisa que ela entra no commit junto com o efeito dela (`git add meta/specs/<arquivo>` + os arquivos tocados).
- Ao APLICAR, o Code **fecha o ciclo sozinho**: `git diff` → `git add` → `git commit` → `git push`. Não espera um segundo pedido para commitar nem para dar push.
- Spec aplicada **não é apagada**: o histórico do que foi mandado fazer vive no repo. O `.flatdropignore` a mantém fora do mount do Projeto (peso), não fora do Git.
- Uma spec que falhou por âncora não encontrada volta ao chat para correção — o Code não a «conserta» sozinho.
```

**Substituir por:**

```
**Método "doc por WO":** o chat AUTORA o texto; o Code só POSICIONA — não inventa prosa de curadoria. **Um canal por doc por ciclo** (se um doc foi por WO, o chat não entrega o mesmo doc inteiro no mesmo ciclo). WO **só de doc não toca o produto** → não precisa de build; a rede é o `git diff`.

**Ao APLICAR uma WO (Code):** localize cada âncora EXATAMENTE; se não achar uma, **PARE e reporte** — nunca chute um lugar próximo. Não toque em nada fora das edições nomeadas. Rode `git diff` e confira a forma esperada antes de commitar.

**Ciclo de vida de uma WO (regra deste projeto):** a WO é **artefato versionado**, não rascunho descartável.
- Ao ENTREGAR uma WO, o chat já avisa que ela entra no commit junto com o efeito dela (`git add meta/workorders/<arquivo>` + os arquivos tocados).
- Ao APLICAR, o Code **fecha o ciclo sozinho**: `git diff` → `git add` → `git commit` → `git push`. Não espera um segundo pedido para commitar nem para dar push.
- WO aplicada **não é apagada**: o histórico do que foi mandado fazer vive no repo. O `.flatdropignore` a mantém fora do mount do Projeto (peso), não fora do Git.
- Uma WO que falhou por âncora não encontrada volta ao chat para correção — o Code não a «conserta» sozinho.
- **Hipótese de causa vem com teste e com instrução de parada.** Quando quem escreve a WO não pôde rodar o sistema, a WO não manda corrigir: manda diagnosticar, diz o que cada resultado significa, e manda parar na divergência. Foi o que impediu o FIX-012 de entrar errado.
```

## Edição 10 — tabela do kit e rodapé

**Âncora (uma linha, exata):**

```
| `.claude/skills/apply-spec/SKILL.md` | comando `/apply-spec`: aplica uma spec de `meta/specs/` (âncora exata ou PARA e reporta) |
```

**Substituir por:**

```
| `.claude/skills/apply-wo/SKILL.md` | comando `/apply-wo`: aplica uma WO de `meta/workorders/` (âncora exata ou PARA e reporta) |
```

**Segunda âncora (última linha do arquivo, exata):**

```
*Gerado pelo Kit de Contexto Universal v1.73.0 — nicho Desenvolvimento. Edite à vontade: este arquivo é seu.*
```

**Substituir por:**

```
*Gerado pelo Kit de Contexto Universal v1.73.0 — nicho Desenvolvimento; fundido com o template-update v1.87.0 em 2026-07-27 (DEC-030). Edite à vontade: este arquivo é seu.*
```

---

## Fechamento

1. `git diff meta/CEREBRO.md` — confira as dez edições. As seções «Convenções (deste projeto…)», «Build e validação deste projeto» e «Kit do Claude Code — instalado neste repo» têm de continuar **intactas**; se alguma sumiu, algo deu errado.
2. `git add` (incluindo esta WO).
3. Commit e push:

```
git commit -m "docs(cerebro): funde o template-update do kit v1.87 e adota o vocabulario de WO"
git push
```

## Relatório esperado

Quais âncoras bateram, quais não, os arquivos tocados e o hash do commit. Se qualquer âncora falhar, PARE — não aplique as outras pela metade.
