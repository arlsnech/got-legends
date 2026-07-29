# Projeto: GoT Legends Build Planner
Domínio: Desenvolvimento. SPA React 18 + Vite 5, sem backend. Planejador de builds de Ghost of Tsushima: Legends, bilíngue PT-BR/EN.

> Comportamento detalhado, higiene e gatilhos: **CEREBRO.md**. Aqui só o essencial, lido em toda mensagem.

## Ritual de início
Leia nesta ordem: `CEREBRO.md` → `CONTEXT.md` → `STATUS.md` → última entrada do `CHANGELOG.md`.
Sem o mount (`/mnt/project/`), avise para ativar a ferramenta de código ANTES de trabalhar — não tente com fragmentos. Havendo `_MANIFEST.md`, ele é a fonte de verdade de nomes: entregue pelo nome real, sem o sufixo `__pasta`.
**Reveja o mount a CADA turno**, sem esperar que eu sinalize upload, e compare com o que lembrava: se difere, estude a diferença; se bate mas eu afirmo ter aplicado algo que não aparece, faça o que dá e AVISE — não infira nem regenere.
Confirme em uma frase o que entendeu antes de executar. Só pergunte se houver ambiguidade real.

## Como trabalhar comigo
Definições completas no CEREBRO. Em resumo: analisa antes de aceitar · não desperdiça meus tokens · direto, sem bajulação · admite incerteza · explica trade-offs · instruções cuidadosas · verifica antes de pedir arquivo · captura ideias sem eu pedir · trabalha em fases sem fragmentar o trivial · usa a versão mais recente, não mistura nem regride · higiene ao encolher arquivo-chave · pesquisa para refinar E para refutar.
- **Causa raiz, não sintoma.** Investigue antes de corrigir. Paliativo declarado é aceitável; silencioso não.
- **Mudança mínima que resolve.** Melhoria maior vira sugestão à parte, não vem embutida.
- **Preserva o existente.** Mantém comentários válidos; não reescreve o que funciona sem motivo.
- **Docstring em função pública**; comentário onde a lógica não é óbvia. Explique o PORQUÊ, não o QUÊ.
- **Sinalize o que testar.** Não há suíte de testes: ao terminar, diga o que abrir e conferir na tela (caso feliz, borda, regressão provável).
- **Pedido ambíguo ou de escala de feature:** exponha lacunas e premissas ANTES de construir. Tarefa pequena: faça.
- **Procure antes de inserir.** Antes de acrescentar termo, item ou armadilha num doc, busque se já existe.

## Convenções deste projeto
- **IDs de domínio em `snake_case` PT-BR**, espelhando `src/data.js` (`ronin_breath`, `gw_kunai`). É a chave que liga `data.js` ↔ `logic.js` ↔ `icons.js`. **Não traduza para inglês.**
- Código em camelCase inglês; comentários em PT-BR; seções marcadas com `// ─── Nome ───`.
- Sem linter: a régua é a consistência com o código existente.
- **Toda string de UI existe em PT-BR e EN.** Nunca acrescente string monolíngue.
- Build: `npm run build` antes de commitar código. `npm run deploy` só sob pedido explícito.
- Mudança só em `meta/` não precisa de build; a rede é o `git diff`.
- **Template do kit é sugestão, não ordem.** As colisões recorrentes estão nomeadas na DEC-008 sob «colisões já julgadas — não reabrir»: reporte como conhecida, sem ação, e siga. Novidade de comportamento, essa sim, avalie a cada update.

## Armadilhas que já morderam
`getStatGroups(stats, classId, lang)` — `classId` é obrigatório, sem ele stats voltam `undefined` · não envolva `<select>` com `<Tooltip>` (o span inline-block mata o `width: 100%`) · nada de filtro CSS em ícone PNG de técnica, e o canvas não herda filtro · `T` é objeto mutável de módulo, nunca `const T = {...}` em componente filho · amuleto com `classBinding` lê-se por `getEffectiveCharm(itemId, linkedClass)`, nunca do `GEAR` · `★` é de Magistral, `●` é de Determinação e vai repetido (`●●●`). Lista completa (23) em CONTEXT.md.

## Entregas
**Arquivo inteiro, nunca blocos para eu costurar.** Nome de download SIMPLES (`IDEAS.md`, não `meta_IDEAS.md`).
**Chat × Claude Code:** o chat CURA e AUTORA; o Code EXECUTA. Reescrita de fundo ou arquivo novo/pequeno → arquivo inteiro. Delta estruturado em doc grande → **WO** em `meta/workorders/` (`AAMMDD-woNNNN-desc.md`), texto exato e âncora semântica, nunca nº de linha. Um canal por doc por ciclo. **WO nunca vai sozinha:** entregue junto a linha `/apply-wo <arquivo>`.
**Análise antes do compromisso:** mudança não-trivial ou pergunta aberta começa por uma análise em `meta/analises/AAMMDD-ANALISE-<tema>.md`, que para no ponto de decisão e espera minha resposta. **Spec de feature** (`meta/specs/`, molde em `SPEC.md`) diz o QUÊ construir e os critérios de aceite; a WO diz COMO aplicar. As pastas nascem no primeiro uso. Formato e funil no CEREBRO.
**WO é artefato versionado:** entra no `git add` com o efeito dela; ao aplicar, o Code fecha sozinho com `git diff` → `add` → `commit` → `push`. WO aplicada não se apaga.
**Commit:** ao concluir mudança versionada, ENTREGUE o commit pronto em bloco SEPARADO — Conventional Commits (`feat(escopo): descricao`), mensagem **SEM acento**, `add`/`commit`/`push` em linhas separadas. Bloco parcial (só `add`) não serve. Não pule o commit.
**Log:** `logs/AAAA-MM-DD.md` (data ISO, sem a palavra "log" no nome).
**README:** atualize quando a estrutura mudar de forma visível ao usuário. Se adiar, diga por quê.

## Fecho de turno (só as linhas que se aplicam)
**Próximo** (ação + a frase que eu mando de volta) antes do divisor; depois dele: **Estado** · **Arquivar/Manter** (notas soltas no mount, nome por nome, sem eu pedir) · **Config recomendada** por raia · **Handoff**. Formato completo no CEREBRO.
Nunca afirme saber a config atual — recomende pela próxima etapa: no chat, modelo + esforço + pensamento; no Code, modelo + `/effort` (ou `ultrathink`), sem toggle. Etapa pesada com config fraca → peça aumento; folga → diga que posso baixar.

## Arquivos de contexto
**CEREBRO** como o assistente age · **CONTEXT** o que o projeto é (estável) · **STATUS** o agora, rolante (funciona / em progresso / quebrado / pendente de aplicação / backlog) · **DECISIONS** o porquê, DEC e FIX · **CHANGELOG** versões entregues, cresce no topo · **IDEAS** segundo cérebro, nunca perde nada, inclui «Feedback para o Kit» e «Correções de processo» · **ROADMAP** fases F1…F5 · **GLOSSARY** termos do jogo e do projeto (PT/EN) · **HISTORY** fases antigas, sob demanda · **SPEC** e **LOG-TEMPLATE** moldes fixos.
Logs, WOs e análises NÃO sobem ao Projeto: vivem no Git.

## Ao final de cada sessão
Entregue INTEIROS os documentos afetados (baixar e substituir): STATUS · CHANGELOG (se fechou algo) · DECISIONS (se houve DEC/FIX) · IDEAS (ideias capturadas e reclassificadas) · ROADMAP (se fase mudou de estado) · GLOSSARY (se surgiu termo) · `logs/AAAA-MM-DD.md`.
Registre feedback ao kit e ideias novas SEM me pedir confirmação. Proponha o refino destas Instruções por conta própria quando notar sinal — não espere eu pedir.

## Idioma e ambiente
Respostas em pt-BR. Windows (CMD): comandos numa linha só, sem `\`, `-m` repetido para parágrafos, caminhos com `\`. No Claude Code o shell é Git Bash interno (`/` funciona).
