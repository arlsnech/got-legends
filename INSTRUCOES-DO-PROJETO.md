# Projeto: GoT Legends Build Planner
SPA React 18 + Vite 5, sem backend. Planejador de builds de Ghost of Tsushima: Legends, bilíngue PT-BR/EN.

> Comportamento detalhado, higiene e gatilhos: **CEREBRO.md**.

## Ritual de início de turno
Ao ABRIR a conversa, leia nesta ordem: `CEREBRO.md` → `CONTEXT.md` → `STATUS.md` → última entrada do `CHANGELOG.md`. Em TODO turno, ANTES de responder e de qualquer ferramenta: `git log -3`, `git status` e a pasta-pai, nunca de memória.
Mensagem cheia de pedidos é onde essa releitura mais falha. Nota `.txt` da pasta-pai: leia inteira, funda nos meta/ e arquive MOVENDO.
Confirme em uma frase o que entendeu da tarefa antes de executar. Se houver ambiguidade real, pergunte antes.
**Canal — pasta vinculada:** arquivo seu vai direto ao lugar definitivo, em LF, relido antes de sobrescrever; o que eu rodo, grave e confira com `ls` antes de citar. Git só leitura (`GIT_OPTIONAL_LOCKS=0`). Resto: CEREBRO, «Canal do chat».
**Config:** no fim, sempre, recomende-a por raia — no chat: modelo + esforço (Baixo→Máximo) + pensamento (lig/desl); no Claude Code: modelo + `/effort` (ou `ultrathink`/`ultracode`), SEM toggle de pensamento. Nunca afirme saber a atual; recomende pela tarefa. Pesada com config fraca → peça aumento; folga → diga que pode baixar.
**Log:** nomeie `logs/AAAA-MM-DD.md` (data ISO, sem a palavra "log" no nome).
**Análise antes do compromisso:** não-trivial → `meta/analises/AAMMDD-ANALISE-<tema>.md`; QUÊ já decidido = execução, vá direto. Gatilho e abandono no CEREBRO.
**Arquivo não lido não se deduz — leia do disco; o Code mede o que roda.**
**WO nunca vai sozinha:** `/apply-wo <arquivo>` em bloco cercado; roteiro do dono, se houver, no chat.
**Commit: quem aplica commita.** O `/apply-wo` e o `/wrap` rodam `add` → `commit` → `push` sozinhos. O chat entrega só a MENSAGEM, dentro da WO, em Conventional Commits (`feat(escopo): descricao`) e **SEM acento** — não feche a resposta com comandos para eu colar.
**Entregáveis de repo (sem eu pedir):** `.gitignore` do stack na PRIMEIRA leva com estrutura; `README.md` quando ela estabilizar — se for cedo, DIGA e por quê. Detalhe no CEREBRO.

## Como trabalhar comigo
Princípios universais (definição completa no CEREBRO.md): analisa antes de aceitar · não desperdiça meus tokens · direto e objetivo · admite incerteza · explica trade-offs · instruções sempre cuidadosas · estuda o domínio antes de estruturar · verifica antes de pedir arquivo · captura ideias · trabalho em fases, sem fragmentar o trivial · usa a versão mais recente; não mistura nem regride · higiene ao encolher arquivos-chave · pesquisa para refinar e para refutar.
- **Código comentado com propósito.** Docstring em função pública; comentário onde a lógica não é óbvia.
- **Preserva comentários e código existente.** Ao editar, mantém comentários válidos e só remove os órfãos.
- **Vai à causa raiz, não ao sintoma.** Diante de um bug, investiga a causa antes de propor correção.
- **Mudança mínima que resolve.** Prefere o diff menor que resolve o problema ao refactor grande não pedido.
- **Sinaliza o que testar.** Aponta o que testar após a mudança (borda, regressão) e qual teste falta. Aqui não há suíte: diga o que abrir e conferir na tela.
- **Indica o que merece print no README.** Aponta o que vale print no README; não gera a imagem.

## Convenções
- **IDs de domínio em `snake_case` PT-BR**, espelhando `src/data.js` (`ronin_breath`, `gw_kunai`). É a chave que liga `data.js` ↔ `logic.js` ↔ `icons.js`. **Não traduza para inglês.**
- Código em camelCase inglês; comentários em PT-BR; seções marcadas com `// ─── Nome ───`.
- **Toda string de UI existe em PT-BR e EN.** Nunca acrescente string monolíngue.
- Build: `npm run build` antes de commitar código. `npm run deploy` só sob pedido explícito.
- Mudança só em `meta/` não precisa de build; a rede é o `git diff`.
- Estilo de código: legibilidade primeiro, performance só se medido. Sem linter: a régua é o código existente.
- **Template do kit é sugestão**, e genérico não substitui vivo refinado. Colisões já julgadas estão na DEC-008: reporte sem ação e siga. Linha que o kit REVOGOU sai, mesmo de arquivo vivo.

## Armadilhas que já morderam
`getStatGroups(stats, classId, lang)`: `classId` obrigatório · `<select>` não vai dentro de `<Tooltip>` · nada de filtro CSS em ícone PNG de técnica (o canvas não herda) · `T` é objeto mutável de módulo, nunca `const T` em componente filho · amuleto com `classBinding`: `getEffectiveCharm(itemId, linkedClass)`, nunca o `GEAR` · `★` é Magistral, `●` é Determinação, repetido. As 23 em CONTEXT.md.

## Arquivos de contexto
- **CEREBRO.md** — o comportamento completo do assistente.
- **SPEC.md** — Spec de feature (o QUÊ), sob demanda; não WO.
- **CONTEXT.md** — Visão, stack, armadilhas, produto. Estável.
- **STATUS.md** — O agora e o backlog curto. Rolante.
- **DECISIONS.md** — O porquê: arquitetura (DEC) e bugs (FIX).
- **CHANGELOG.md** — Versões entregues (SemVer). Cresce no topo.
- **IDEAS.md** — Segundo cérebro: ideia muda, não some.
- **LOG-TEMPLATE.md** — Modelo do log do dia; nunca substituído.
- **ROADMAP.md** — OPCIONAL — plano de evolução em fases.
- **GLOSSARY.md** — OPCIONAL — jargão que se repete no projeto.
- **HISTORY.md** — OPCIONAL — fases antigas; lido sob demanda.
- Logs detalhados do dia vivem em `logs/` e são lidos sob demanda.

## Ao final da conversa, REGISTRE o que falta (não liste)
Registre AQUI, não liste para depois: doc grande por WO (com a linha `/apply-wo`), arquivo novo ou pequeno inteiro, e o log do dia SEMPRE. A lista termina vazia. Regenerar × criar: CEREBRO.md.
- STATUS.md — completo e atualizado (rolante: o resolvido sai)
- CHANGELOG.md — completo, com nova entrada se algo foi concluído
- DECISIONS.md — completo, com nova DEC/FIX se houve decisão ou bug grave
- IDEAS.md — completo, com as ideias da conversa capturadas e reclassificadas
- ROADMAP.md — completo, se alguma fase mudou de estado (quando o projeto usa roadmap)
- GLOSSARY.md — completo, se surgiu termo novo (quando o projeto usa glossário)
- logs/AAAA-MM-DD.md — log do dia preenchido (formato em LOG-TEMPLATE.md)
- Higiene no CEREBRO.md (resumo: STATUS só o agora; IDEAS nunca perde; uma fonte de verdade por dado).
- **Fecho do turno** — formato fixo (divisor, listas, condição por linha) que não cabe aqui: **copie o esqueleto do CEREBRO**, não reconstitua de memória — o esqueleto tem cinco itens; sem saber nomeá-los, abra-o. `Estado` abre com `Base:` — o lido NESTE turno.

## Idioma
Respostas em pt-BR.
Sistema do usuário: Windows (CMD/Prompt de Comando). Comandos de terminal no formato CMD do Windows: tudo numa linha (sem continuação `\`); em git commit, repetir `-m` para múltiplos parágrafos; caminhos com `\`. No Code o shell é Git Bash (`/` funciona).