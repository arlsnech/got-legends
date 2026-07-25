# STATUS.md — Estado Atual

> Arquivo **rolante**: descreve só o AGORA. O assistente lê no início para saber onde retomar.
> Item resolvido SAI daqui — vai para o CHANGELOG (se foi entrega) e/ou para o log da sessão.

---

## Versão Atual

**[1.0.0-beta]** — 2026-06-24 — Planejador funcional completo com exportação de texto (Fase 2). Geração de imagem em guia, pendente de aplicação.

---

## ✅ Funcionando

- 4 classes jogáveis: Samurai, Caçadora, Ronin, Assassino
- Seleção de habilidade de classe com recarga calculada (CDR aplicado)
- Vantagens I, II, III por tier (1 por tier, comportamento rádio)
- 5 slots de gear: Katana, Longo Alcance, Amuleto, GW I, GW II
- Props P1/P2 com valores numéricos editáveis (steppers ▲▼ + input)
- Perks por slot com perk obrigatório travado (🔒) quando aplicável — tabela `REQUIRED_PERKS` (DEC-014)
- Munições exibidas conforme a classe ativa: quantidade da classe primária entre parênteses, linha exclusiva omitida para as demais (DEC-017)
- Amuletos magistrais com `classBinding` — props/perks de classe injetados em runtime
- Cálculo de stats em tempo real (`computeStats` via `useMemo`)
- CDR de Armas Fantasma calculado individualmente (GW1 ≠ GW2 ≠ global do amuleto)
- Painel de estatísticas com grupos e highlight de stats modificados
- `UltimateHeader` — ícone grande da habilidade suprema no topo da col direita
- `HpResolveBar` — barra de HP (só bônus acima de 100) + círculos de DET (só ativos)
- Layout 3 colunas e 2 colunas com scroll independente por coluna
- Modo compacto e expandido para ícones de gear
- Tema escuro / claro com `T` mutável (Object.assign no render do App)
- Ícones SVG de classe (com `T.iconFilter`) e gear (com `T.iconFilter`)
- Ícones PNG de técnicas/habilidades (sem filtro — cores originais)
- `BookmarkTab` (aba lateral) → abre `SaveDrawer`
- `SaveDrawer`: salvar/carregar/excluir builds, exportar/importar JSON, código Base64
- Build aleatória (🎲)
- Troca de classe preservando itens compatíveis e técnicas magistrais equivalentes
- `SettingsModal`: tema, modo de layout, modo de ícone de gear, código no export, créditos
- **Fase 2** — `generateBuildText` funcional para modos `build`, `detailed`, `stats`
  - Texto bilíngue conforme `lang` ativo — **inclusive nas estatísticas** (corrigido em 2026-07-22)
  - Cooldowns calculados (recarga real, não base)
  - HP e DET sempre presentes nas estatísticas
  - Demais stats com valor formatado, filtradas pelo que o build alterou, e com o grupo específico da classe presente (FIX-005)
  - Código Base64 opcional (toggle nas configurações)
- `ExportPanel` com 2 grupos visuais: `📋 Texto` e `🖼️ Print` × 3 modos

---

## 🔧 Em Progresso

- **Fase 3 — `generateBuildImage`**: código completo entregue no guia `GUIA_CORRECOES_FASE3.md`, ainda não aplicado ao `App.jsx`. Próximo passo: inserir antes de `ExportPanel` e conectar ao `handleGenImage`.

---

## ❌ Quebrado / Com Problema

_Nada ativo._ (Bug com sintoma observável entra aqui; quando resolvido e se foi grave, vira FIX-N em DECISIONS.)

---

## ⏳ Pendente de Aplicação (guias prontos, não aplicados ainda)

> ✅ **O `GUIA_CORRECOES_FASE3.md` foi encontrado** (2026-07-22, fora do repositório — o aviso anterior, de que teria se perdido, estava errado). São 35 KB contendo o ANTES/DEPOIS das três correções restantes **e** o código completo da Fase 3 (`generateBuildImage` via Canvas, ~470 linhas), além do trecho da FIX-005 que a spec0004 já aplicou por outro caminho.
>
> **Não aplique o guia à mão.** Ele continua sendo o formato que deixou este trabalho parado desde junho (DEC-007). O caminho é ler o guia como fonte e converter cada correção em spec, conferindo cada bloco ANTES contra o `App.jsx` de hoje — o arquivo mudou desde que o guia foi escrito, e um bloco que não bate mais é um bloco que precisa ser reescrito, não colado.

_Nenhum item pendente de aplicação._ Os três que restavam — `wrapperStyle` no Tooltip, `TechRow` independente por modo e o contador de Magistrais por extenso — foram aplicados pela spec0006 em 2026-07-22, a partir do `GUIA_CORRECOES_FASE3.md` recuperado. Os três blocos ANTES do guia foram conferidos contra o `App.jsx` antes de virarem spec e batiam exatamente.

O que resta do guia é a **Fase 3** (`generateBuildImage` via Canvas, ~470 linhas, seção a partir da linha 420). Ela está fora desta leva de propósito: as conversas antigas recuperadas contêm a discussão de requisito da imagem — em especial quais ícones entram —, e construir a Fase 3 antes de extrair isso arrisca construí-la errada.

> O quarto item — o fix das estatísticas de `generateBuildText` — **saiu desta lista em 2026-07-22**: foi de fato aplicado pela spec0004. Ver FIX-005.

---

## 📋 Backlog (curto prazo — acionáveis na próxima sessão)

> O item "aplicar as 4 correções pendentes do `GUIA_CORRECOES_FASE3.md`" **saiu daqui em 2026-07-23**: as três de layout foram aplicadas pela spec0006 e a quarta pela spec0004. Estava contradizendo a seção «⏳ Pendente de Aplicação», que já dizia que não havia pendência.

- [ ] Implementar `generateBuildImage` (Fase 3)
- [x] ~~`picada_celestial` fora de `REQUIRED_PERKS`~~ — **corrigido em 2026-07-23** (FIX-009). A regra foi confirmada pela fonte no bloco 27 do arquivo de origem, e virou a DEC-018.
- [x] ~~Limpar o código morto do vínculo de classe~~ — **feito em 2026-07-25** (spec0012). Junto saíram outros oito imports órfãos do `App.jsx`. O campo `linkedClass` do estado ficou intacto.
- [ ] **Decidir o destino de `getAvailableProps` e `getAvailablePerks` em `logic.js`** — não têm consumidor e, como estão, são armadilha: resolvem o item por `id` e por isso devolvem lista errada para amuleto com `classBinding` (armadilha 14). Duas saídas: **remover** as duas, já que ninguém as usa, ou **trocar a assinatura** para receber o item já resolvido e então usá-las no `App.jsx` no lugar do filtro inline. Não decidir também é uma escolha — mas aí a armadilha fica.
- [ ] **Duplicação de `selectTech` / `selectAbility`** — o `App.jsx` reimplementa inline o toggle que essas duas funções de `logic.js` já fazem, com lógica idêntica. Ao contrário do caso acima, aqui não há motivo: as assinaturas servem. Trocar o inline pela chamada elimina uma fonte de verdade duplicada. Mudança de duas linhas, mas **não embutida na spec0012** por estar fora do escopo dela.
- [x] ~~Verificar se `visao_sugaru` deveria ter perk de desbloqueio~~ — **respondido em 2026-07-23: não deveria, e o dado está certo.** O pool dela é o do Arco Longo menos Disparo Arremessante, Certeiro, Olho de Águia e Versátil; sem Versátil no pool, qualquer classe a equipa sem custo. Ver DEC-018.
- [x] ~~Verificar IDs de amuletos, técnicas do Assassino e entradas faltantes em `TECH_ICON`~~ — **os três verificados em 2026-07-25 e todos em ordem.** Cruzamento programático de `data.js` contra `icons.js`: **50 itens de `GEAR` ↔ 50 chaves de `GEAR_ICON`** e **60 chaves de `TECH_ICON` ↔ 60 ids de técnica/habilidade**, sem nenhum órfão nos dois sentidos. `sumico_toxico` e `supergolpe`, citados como faltantes, estão mapeados. Os quatro ids restantes são os supremos (`furia_de_hachiman`, `olho_de_uchitsune`, `sopro_de_izanami`, `golpe_sombrio`), que por decisão usam `CLASS_TECH_FALLBACK`. Eram resquícios da escrita original do `icons.js`.
- [ ] Apagar as duas cópias soltas de `GUIA_COMPLETO*.md` que ficaram **fora do repositório** (`got-legends/GUIA_COMPLETO.md` e `got-legends/notas-arquivadas/GUIA_COMPLETO_v4.md`). São byte-idênticas — md5 conferido em 2026-07-23 — à versionada em `meta/legacy/GUIA_COMPLETO_v4.md`. Pela DEC-012, cópia fora do repo é cópia em risco, e estas três divergirem seria pior do que não existirem.

---

## 📁 Arquivos Críticos (não mexer sem contexto)

- `src/data.js` — banco de dados do jogo; IDs de itens são a chave de tudo; magistrais 100% explícitos
- `src/logic.js` — `computeStats`, `getStatGroups`, `checkLegendaryLimit`, `changeClass`; assinaturas exatas importam
- `src/App.jsx` — componente monolítico; ordem dos componentes importa para depuração
- `src/icons.js` — mapeamento ID → URL; IDs devem ser idênticos aos de `data.js`

---

## 💬 Última Sessão

**2026-07-22** — Sessão de infraestrutura, sem mexer em código do produto. Recebido o template-update do KCM v1.73.0 e comparado item a item com os meta/ vivos. Adotados: `meta/CEREBRO.md` (adaptado a este projeto), Instruções do Projeto regeneradas, kit do Claude Code (`CLAUDE.md`, `.claude/settings.json`, skills `/apply-spec` e `/wrap`), `.flatdropignore` e união no `.gitignore`. `HISTORICO.md` renomeado para `HISTORY.md`. Registradas DEC-007 a DEC-010 e 9 itens de feedback ao kit.
**Próximo passo:** aplicar as 4 correções pendentes do guia da Fase 3 no `App.jsx` e implementar `generateBuildImage` — agora com o Claude Code, via spec, em sessão dedicada.

> Sessão anterior — **2026-06-27**: sessão de documentação (gerados os 10 arquivos do kit de contexto e o `GUIA_CORRECOES_FASE3.md`). Não alterou o `App.jsx`: verificado em 2026-07-22 que `src/App.jsx` é byte a byte idêntico a `src/v4/App.jsx` e não contém `generateBuildImage` nem `wrapperStyle` — ou seja, a Fase 3 e as 4 correções continuam de fato pendentes.

**spec0002 aplicada em 2026-07-22.** As três âncoras de documento foram encontradas exatamente e substituídas (bug dos magistrais no `❌ Quebrado`, nota sobre o guia perdido, seções novas no CHANGELOG); o commit de doc `8a99244` foi para a `main` sem nenhum arquivo de código junto. `Builds/O Samurai Contra-Ataca.json` restaurado do remoto com `git checkout --`. **O `npm run build` passou** (33 módulos, 282 kB / 81,6 kB gzip, 2,1 s) antes de qualquer commit de código. Branch `v2-planner` criada a partir da `main` e publicada, com dois commits: `68883d3` (snapshots `src/v1..v4` + `GUIA_COMPLETO_v4.md`) e `e6db5be` (`src/App.jsx` evoluído, `src/icons.js`, 127 ícones em `public/icons/`, `logs/2026-06-27.md`, `INSTRUCOES-DO-PROJETO.md`). `gh-pages` não foi tocada. **Ficou pendente:** o `.flatdropignore` modificado continua sem commit — a spec não o incluiu em nenhuma das levas; os `src/v1..v4` e o `GUIA_COMPLETO_v4.md` seguem na árvore de trabalho, à espera da extração retroativa antes da limpeza; e a correção do bug dos magistrais continua só diagnosticada, sem código.

**spec0004 aplicada em 2026-07-22.** As duas âncoras de código no `App.jsx` (import de `isStatChanged`, bloco de estatísticas de `generateBuildText`) e as quatro âncoras de documento (`STATUS.md` ×2, `DECISIONS.md`, `CHANGELOG.md`) foram encontradas exatamente e substituídas. `npm run build` passou (33 módulos, 282,79 kB / 81,86 kB gzip, 2,69 s) antes do commit de código. Conferência visual feita com dev server + browser automation, build Samurai (Katana Pétrea com Ganho de Det. C/C, Amuleto Magistral "Último Suspiro" vinculado à classe, Vantagem Magistral, Arma Fantasma Kunai), export em modo Estatístico:
1. Nenhuma linha `undefined` — OK
2. Percentuais com sinal e `%` (`Ganho Det. C/C: +25%`, `Raio da Lâmina Explosiva: +100%`) — OK
3. Pontos não testados neste build (nenhuma prop `pts` selecionada), mas `formatStatValue` para `pts` foi conferido no código e é o mesmo já usado no painel
4. `Slots Magistrais`: ausente do texto com só o amuleto magistral equipado (valor 1 = base); apareceu como `Slots Magistrais: 2` só depois de equipar a Vantagem Magistral — OK
5. Grupo da classe: com Katana + Amuleto Magistral vinculado ao Samurai e prop `Raio da Lâmina Explosiva`, a linha `Raio da Lâmina Explosiva: +100%` apareceu no texto (antes não aparecia) — OK
6. Export em EN: rótulos saíram em inglês (`Legendary Slots`, `Explosive Blade Radius`, `Melee Resolve Gain` etc.) — OK
7. Não-regressão: modos `Build` e `Detailed` inalterados (sem bloco de estatísticas, como esperado); `HP` e `Resolve/Determinação` presentes em PT e EN no modo Estatístico — OK
8. Painel lateral: nenhuma mudança de comportamento — os mesmos valores que apareceram no texto já apareciam no painel antes da spec — OK
Commit de código `1f1f470` (`fix(export): corrige estatisticas undefined no texto exportado`) enviado à `v2-planner`.
**Próximo passo:** dos itens pendentes de layout (Tooltip `wrapperStyle`, TechRow por modo, Contador de Magistrais) ou a Fase 3 (`generateBuildImage`), todos precisam de código reescrito do zero — nenhum guia sobrevive. Escolher um, escrever a spec correspondente e aplicar via `/apply-spec`.

**spec0005 aplicada em 2026-07-22.** As cinco âncoras (`src/index.css` ×1, `src/App.jsx` ×4, `STATUS.md` ×1, `CHANGELOG.md` ×1) foram encontradas exatamente e substituídas. `npm run build` passou (33 módulos, 282,98 kB / 81,93 kB gzip, 3,87 s) antes do commit de código. Conferência visual feita com dev server + browser automation, item comum (Katana Pétrea, propriedade Dano Corpo a Corpo):
1. Nenhuma seta nativa visível no campo, em nenhum estado — OK
2. Número centrado, sem folga assimétrica à direita — OK
3. Botões `−` à esquerda e `+` à direita, mesmo tamanho, legíveis — OK
4. `+` no valor 12 (máximo da faixa 5–12%) manteve 12; `−` desceu para 11 — parada nos limites OK
5. Digitação de `8` + Tab confirmou o novo valor — OK
6. Campo focado em 11, roda do mouse não alterou o valor (ficou em 11) — bug silencioso corrigido, OK
7. Item Magistral (`Mão de Yoshitsune`): habilidade segue como caixa âmbar de texto, sem campo e sem botões — OK, nada mudou
8. Tema claro: `−` e `+` continuam legíveis — OK
9. Layout 2 colunas: a linha da propriedade não quebrou nem estourou — OK
Commit de código `a278783` (`fix(ui): remove spinners nativos e adota - e + nos botoes de passo`) enviado à `v2-planner`.
**Próximo passo:** escolher entre os itens pendentes de layout (Tooltip `wrapperStyle`, TechRow por modo, Contador de Magistrais) ou a Fase 3 (`generateBuildImage`) como próxima spec.

**spec0006 aplicada em 2026-07-22.** As quatro âncoras de código no `App.jsx` (assinatura e span do `Tooltip`, assinatura e wrapper do `TechRow`, container em grid do 2-col, contador de Magistrais) e as duas âncoras de documento (`STATUS.md`, `CHANGELOG.md`) foram encontradas exatamente e substituídas; o clamp em `logic.js` `setPropValue` (linhas 864-866) foi conferido antes de remover `min`/`max` do input, como a spec pediu. `npm run build` passou (33 módulos, 283,47 kB / 82,03 kB gzip, 8,87 s) antes do commit de código. Conferência visual feita com dev server + browser automation, build Samurai (Katana Aquática, propriedade Ganho de Determinação C/C 5–25%):
1. Vantagens de classe em 3 colunas: todas as caixas com a mesma largura, incluindo o nome longo "Fúria de Hachiman (300%)" sem quebra de linha — OK
2. Habilidades de classe em 3 colunas: seguem uma por linha, sem mudança — OK
3. Nomes longos sem quebra indevida — OK
4. Vantagens de classe em 2 colunas: lado a lado em grid — OK
5. Habilidades de classe em 2 colunas: seguem lado a lado, sem regressão — OK
6. Independência entre os modos: os itens 1 e 4 valem ao mesmo tempo (testados em sessões separadas de toggle) — OK
7. Contador de Magistrais: texto "0/1 Magistrais" por extenso, não "Mag." — OK
8. Distância do contador em relação à barra de HP: padding 32px + separador visual, visivelmente mais afastado — OK
9. Estrelas cheias/vazias: só testado com `used=0` (estrela vazia em `T.dim`); a cor `T.leg` da estrela cheia foi conferida no código, não visualmente com uma Magistral equipada
10. Setas nativas do campo numérico: continuam ausentes — OK
11. Setas do teclado (↑/↓): alteram o valor de 1 em 1 e param nos limites (25→22 com 3 toques; 25→5 com toques repetidos, parou em 5) — OK
12. Limite por digitação: `99` fora da faixa 5–25, ao sair do campo corrigiu para 25 (o máximo) — OK
13. Roda do mouse: não testada nesta sessão (comportamento decorre de `type="text"` não ter spinner nativo, já coberto pelo item 10)
14. Mobile (`inputmode="decimal"`): não emulado nesta sessão; presente no código, conferido no `git diff`
Nenhum erro no console do navegador durante os testes. Commit de código `6b13fd9` (`fix(ui): aplica as tres correcoes de layout pendentes do guia`) enviado à `v2-planner`.
**Próximo passo:** Fase 3 (`generateBuildImage` via Canvas) — depende de extrair da conversa antiga a discussão de requisito da imagem (quais ícones entram) antes de escrever a spec.

---

**2026-07-23 — encerramento da sessão de infraestrutura.**

A conversa que produziu as specs 0001–0007 foi encerrada por peso de contexto. O que ela fechou: adoção do kit KCM v1.73 com adaptação (DEC-007, DEC-008), instalação do fluxo chat ↔ Claude Code, criação da branch `v2-planner` com o estado real da ferramenta em segurança, FIX-006 (props de Magistral) e FIX-005 (estatísticas `undefined`, diagnosticado em junho e aplicado só agora).

Recuperado nesta sessão: o `GUIA_CORRECOES_FASE3.md`, dado como perdido, e cinco conversas antigas. Ambos agora versionados em `meta/legacy/` (DEC-012).

**Próximo passo, em ordem:**
1. Aplicar a `spec0006` se ainda estiver pendente — fecha as três correções de layout, todas visíveis na tela. Conferir com atenção o item 6 do roteiro dela: os modos 3-col e 2-col precisam ficar certos **ao mesmo tempo**; o defeito histórico é consertar um e quebrar o outro.
2. Extração retroativa, começando por `meta/legacy/GOT_Build_-_Joker.md` (DEC-011).
3. Fase 3 (`generateBuildImage`), depois da extração e informada por ela.

Há um `HANDOFF-BRIEF.md` gerado para arrancar a próxima conversa. Ele é atalho, não memória — **este arquivo e os demais `meta/` continuam sendo a fonte de verdade.**

---

**2026-07-23 — extração retroativa 1/4: `GOT_Build_-_Joker.md`.**

Arquivo lido por inteiro (6 blocos, 3 prompts) e conferido contra o código de hoje. **Nenhum pedido ficou aberto** — os três já estão implementados. O que faltava era registro:

- **FIX-007** — props de item Magistral não eram sorteadas no 🎲 (filtro `!chosen.leg` em `randomBuild`). Bug **diferente** do FIX-006, nas mesmas linhas: aquele é valor abaixo do máximo, este é prop nenhuma. Corrigido há semanas, nunca registrado.
- **DEC-013** — ao trocar de classe, a técnica Magistral equivalente entra equipada, em vez de o Magistral excedente ser removido. A alternativa de remover o item foi **explicitamente rejeitada** pelo autor; ficou registrada para não voltar como sugestão.
- Conferida a invariante de que a DEC-013 depende: as quatro classes têm técnica `legSlots` nos tiers I e III, e só neles. Virou armadilha 8 no `CONTEXT.md`.

Sem mudança de código nesta sessão — `npm run build` não foi necessário. `meta/legacy/GOT_Build_-_Joker.md` removido da árvore; segue no histórico do Git.

**Descoberto de quebra:** a orientação da DEC-012 de reincluir material legado no mount com `!meta/legacy/<arquivo>` **não funciona** — a sintaxe `.gitignore` não reinclui arquivo cujo diretório-pai está excluído. O `.flatdropignore` passou a enumerar os arquivos legados um a um. Ver o item de 2026-07-23 em «Feedback para o Kit» no `IDEAS.md`.

**Próximo passo:** extração 2/4 — `meta/legacy/GOT_Build_-_Alex.md` (61 KB). A linha dele já saiu do `.flatdropignore` nesta spec; basta regerar o pacote FlatDrop antes de abrir a próxima conversa.

---

**2026-07-23 — extração retroativa 2/4: `GOT_Build_-_Alex.md`.**

Arquivo lido por inteiro (5 blocos, 61 KB) e conferido contra o código de hoje. Como no Joker, **nenhum pedido ficou aberto**. O saldo, porém, foi bem maior:

- **DEC-017 — munições por classe.** O achado principal: a funcionalidade está em produção (`getPrimaryClass` + `formatAmmoForClass` no `App.jsx`) e a busca por "munic" nos oito `meta/` retornava **zero**. Uma funcionalidade inteira que um refactor apagaria sem que nada acusasse.
- **FIX-008** — `resolveCharmClassBinding` deduzia os props "exclusivos de classe" por comparação com o amuleto de classe, e por isso injetava props do **sub-tipo** (ranged) em magistrais que não os tinham. Corrigido com tabelas explícitas em `data.js`. É o caso concreto que originou a DEC-006.
- **DEC-014** — estrutura e razão da tabela `REQUIRED_PERKS` (perk de desbloqueio travado 🔒). O formato aninhado por classe existe porque o `remedio_proibido` tem dois perks de desbloqueio diferentes.
- **DEC-015** — o vínculo de classe do amuleto Magistral é automático; o seletor foi removido. Deixou código morto e a tela sem nenhuma indicação do vínculo.
- **DEC-016** — o motivo real de o site viver no Netlify: `npm run deploy` quebra neste ambiente com `ENAMETOOLONG` (limite de linha de comando do Windows com 120+ ícones no `dist/`). O `deny` no `.claude/settings.json` registrava só "publica no site real".

Conferido de passagem e **em ordem**: `REQUIRED_PERKS` aponta para perks que existem (`versatil`, `desbloq_ron`, `desbloq_ass`, `desbloq_ass_rp`, `desbloq_sam_rp`); `getPrimaryClass` bate com o `by` real de todos os itens de longo alcance; as seis integrações de `getRequiredPerkId` estão todas no lugar.

Três achados novos foram para o backlog: `picada_celestial` fora de `REQUIRED_PERKS`, o código morto do vínculo e a dúvida do `visao_sugaru`.

**Também absorvido nesta sessão:** os dez relatórios de sessão em `.txt` do mount foram lidos e conferidos. Tudo neles já estava registrado, **menos** três coisas, agora no backlog e no IDEAS: as cópias soltas de `GUIA_COMPLETO*.md` fora do repo, a decisão em aberto sobre versionar o `.claude/launch.json`, e o registro de que os nomes do legado foram normalizados (espaço → underscore) ao serem movidos. Com isso os `.txt` podem ser arquivados.

Sem mudança de código nesta sessão — `npm run build` não foi necessário. `meta/legacy/GOT_Build_-_Alex.md` removido da árvore; segue no histórico do Git.

**Próximo passo:** extração 3/4 — `meta/legacy/GOT_Build_-_Origem.md` (197 KB). A linha dele já saiu do `.flatdropignore` nesta spec.

---

**2026-07-23 — extração retroativa 3/4: `GOT_Build_-_Origem.md`.**

A conversa de origem do projeto: 35 blocos, 18 rodadas, da planilha do Google até a publicação. Diferente das duas anteriores, o valor não estava só no que virou código — estava nas **regras que o autor ditou** e que nunca foram escritas em lugar nenhum.

- **DEC-018 — a tabela canônica de restrição de classe das armas de longo alcance.** Marcar exclusividade errada foi o erro mais repetido da fase de origem, e a causa está identificada: a aba de Magistrais da planilha tem colunas por classe que são **recomendação de build**, não permissão de uso. A tabela agora é a referência única.
- **FIX-009 — Picada Celestial travando o Desbloqueio do Ronin.** Achado na spec0009 como "provável", confirmado pelo bloco 27 e **corrigido nesta sessão** — uma linha em `REQUIRED_PERKS`. Primeira mudança de código desde a spec0006.
- **DEC-019** — os ranks S/A/B/C/D de tier list são opinião de fã e ficam fora da ferramenta, também porque o *Ghost of Yotei* usa letras para outra coisa.
- **DEC-020** — a Flecha Perfurante hoje filtra por classe e não por técnica. É metade do pedido original, e a metade que falta foi **abrida pelo próprio autor**; o custo de completar é dado novo em `data.js`, não um ajuste.
- Três armadilhas novas no `CONTEXT.md` (11 e 12 além da 10 emendada), incluindo a que mais custou tempo na origem: **CDR de Arma Fantasma não empilha entre as duas armas.**
- `meta/HISTORY.md` ganhou a seção «Origem do projeto», que até agora não existia em nenhum arquivo.

**Achado que não fecha nesta sessão:** os botões de build aleatória **granulares** (🎲 Tudo · 🎲 Classe · 🎲 Gear) aparecem no dump da v1.1 dentro do arquivo de origem e **não existem no `App.jsx` de hoje** — só o 🎲 global sobrou. Como as versões intermediárias se perderam, não dá para dizer em qual reescrita sumiram. Foi para o `IDEAS.md` como possível regressão, não como bug: pode ter sido simplificação deliberada que ninguém registrou.

**Mount enxugado:** o `.flatdropignore` passou a excluir também `meta/specs/`. As specs aplicadas já não precisam subir — o efeito delas vive nos `meta/` e o corpo vive no Git. São ~126 KB por pacote.

**Próximo passo:** extração 4/4 — `meta/legacy/GOT_Build_-_TOhno.md` (267 KB), o último e o maior. A linha dele já saiu do `.flatdropignore` nesta spec. Com as specs e os `src/v*` fora do pacote, ele cabe com folga.

---

**2026-07-24 — extração retroativa 4/4: `GOT_Build_-_TOhno.md`. A DEC-011 está cumprida.**

A conversa que construiu a interface atual: 18 blocos, 10 rodadas. **Nenhum pedido ficou por implementar** — layout de 3 e 2 colunas, gaveta de builds, HP e Determinação, ícones do jogo, painel de exportação com seis botões, dicas que viram nas bordas, modal de configurações com o interruptor do código Base64: tudo conferido no `App.jsx` de hoje e tudo no lugar.

O saldo veio de outro lugar: **os requisitos da fase que ainda não começou.**

- **DEC-021** — a Fase 3 usa **Canvas API pura, sem dependência externa**. Ditado pelo autor e nunca registrado. Importa porque `html2canvas` seria mais fácil e entregaria a coisa errada: uma foto da tela, não o layout em colunas que foi pedido.
- **DEC-022** — os três modos de exportação e a regra que os rege: só as estatísticas modificadas, **exceto HP e Determinação, que aparecem sempre**. Hoje isso vive como um comentário dentro do `generateBuildText`. É regra de produto e vale igual para a imagem.
- **DEC-023** — 3 colunas e 2 colunas têm estilos **independentes de propósito**. Levou três rodadas, e as três falharam do mesmo jeito: arrumar um modo quebrava o outro. Virou a armadilha 13 do `CONTEXT.md`.
- O **`ROADMAP.md` da Fase 3 foi completado** com o que faltava, incluindo os **ícones das vantagens de classe** — o autor perguntou por eles duas vezes, temendo que fossem esquecidos — e a nota operacional de reincluir o `GUIA_CORRECOES_FASE3.md` no mount antes de abrir a fase. Saiu de lá o item obsoleto de "aplicar as correções pendentes", que já não existiam.
- `meta/HISTORY.md` ganhou a seção 9, com a genealogia da tela e o crédito a **swiezdo** pelos ícones.

**Segunda regressão provável, da mesma família da anterior:** o painel de estatísticas tinha um seletor **"Só alteradas"** — aparece no dump da v1.1 e não existe no `App.jsx` de hoje, que mostra tudo e apenas destaca o que mudou. Junto com os botões de 🎲 granulares, são dois recursos que sumiram sem registro na época dos arquivos reescritos por inteiro. Ambos estão no `IDEAS.md`; nenhum é bug até o autor dizer que não foi de propósito.

### A extração retroativa terminou

Quatro conversas, quatro sessões, saldo final: **FIX-007, FIX-008, FIX-009** e **DEC-013 a DEC-023**, mais nove armadilhas novas no `CONTEXT.md`, duas seções no `HISTORY.md` e uma correção de código. Nenhum pedido em aberto foi encontrado — o que estava perdido era **registro**, não trabalho.

`meta/legacy/` fica com o `GOT_Build.md` (índice, já lido) e os dois guias, que não são conversa e continuam servindo: o `GUIA_CORRECOES_FASE3.md` guarda o código da Fase 3.

**Próximo passo: Fase 3 (`generateBuildImage`)** — agora com o roteiro completo no `ROADMAP.md`. Antes de abrir a sessão, reinclua `meta/legacy/GUIA_CORRECOES_FASE3.md` no `.flatdropignore`.

---

**2026-07-25 — higiene pré-Fase 3.**

Sessão curta e deliberadamente antes da Fase 3, que vai mexer pesado no `App.jsx`: limpar depois sairia mais caro. O mount desta sessão tinha exatamente o código e nada dos guias, então o encaixe foi natural.

**Código.** Removidos o `onLinkedClass` do `App.jsx` e o `setCharmLinkedClass` do `logic.js`, fechando a ponta solta da DEC-015. Na conferência apareceram mais oito imports órfãos no `App.jsx` — `selectTech`, `selectAbility`, `getAvailableProps`, `getAvailablePerks`, `BASE_HP`, `BASE_RESOLVE`, `BASE_LEG_SLOTS`, `GEAR_ICON`, `TECH_ICON` —, todos aparecendo uma única vez no arquivo, na própria linha do import. Saíram junto. Um comentário obsoleto no `icons.js` (mandava renomear um arquivo já renomeado) também saiu.

**Três itens de backlog fechados sem tocar em código.** Os avisos de que os ids de `icons.js` podiam não bater com os de `data.js` eram resquícios da escrita original: o cruzamento deu **50 ↔ 50** em gear e **60 ↔ 60** em técnicas, sem órfão nenhum dos dois lados.

**Um achado que não é limpeza — armadilha 14.** `getAvailableProps` e `getAvailablePerks` resolvem o item por `id`, e por isso devolveriam lista **incompleta e sem erro** para amuleto com `classBinding`. O `App.jsx` filtra inline justamente para passar o item efetivo. Não têm consumidor hoje; o destino delas foi para o backlog em vez de ser decidido de afogadilho.

**Sobre `meta/legacy/`, agora com quatro arquivos e três destinos diferentes:**
- `GUIA_CORRECOES_FASE3.md` — **não se extrai, se usa.** É o insumo da Fase 3.
- `GUIA_COMPLETO_v4.md` — **precisa de uma comparação antes de a Fase 3 começar.** Pelo `GLOSSARY.md` ele cobre o mesmo território do outro guia (layout e `HpResolveBar`), e os dois podem conter versões diferentes do código da Fase 3. Usar o mais antigo sem perceber seria regressão silenciosa. A primeira tarefa da sessão da Fase 3 é dizer qual é o mais recente.
- `GOT_Build.md` — **vale extrair de verdade.** Foi "lido por inteiro" em 2026-07-22, **antes de o método da DEC-011 existir**, com a pergunta que o próprio projeto registrou como a menos produtiva ("isso está no código?"). O saldo daquela leitura foram quatro itens de UI, contra três FIX e onze DEC vindos dos outros quatro arquivos. E a DEC-011 diz que **é dele** o prompt em que o autor pergunta pelos ícones das vantagens de classe na imagem — ou seja, ele contém requisito da Fase 3. Ler depois de construir a fase é caro.
- `README.md` — descreve a pasta; não é material de extração.

**Próximo passo:** sessão de preparação da Fase 3 — extrair o `GOT_Build.md` e comparar os dois guias. O `.flatdropignore` já liberou os três nesta spec; basta regerar o pacote.

---

**2026-07-25 (2) — auditoria dos guias legados e plano refinado da Fase 3.**

Os três insumos subiram e foram lidos. A diretriz do autor fechou a questão de fundo: **guia legado não é estrutura do projeto** — estuda-se, o conteúdo vai para os `meta/` e para os scripts, e o arquivo sai (DEC-025). Dois dos três saíram nesta sessão.

- **`GOT_Build.md` — nada a extrair.** A spec0012 suspeitou que a leitura de 2026-07-22 tivesse sido rasa e recomendou re-extrair. **A suspeita era falsa:** os sete prompts foram comparados um a um com os do `TOhno` e são os mesmos, só que sem as respostas do assistente. É subconjunto estrito de um arquivo já extraído por inteiro. A verificação custou minutos e dispensou uma sessão.
- **`GUIA_COMPLETO_v4.md` — superado inteiro.** É a rodada v8; o outro é a v10. Suas 6 correções foram consertadas pelas 4 do mais novo, sua Fase 2 já está no código, e sua Fase 3 é esqueleto onde o outro tem implementação. **Codar a partir dele teria sido regressão dupla.** Sobreviveu uma única coisa, e não é código: a localização das larguras de coluna, agora no `CONTEXT.md`.
- **`GUIA_CORRECOES_FASE3.md` — fica mais uma sessão.** É o mais recente e tem as ~470 linhas da Fase 3.

**A auditoria do código da Fase 3 achou sete defeitos** (DEC-026). Os dois graves não quebram nada visivelmente — produzem imagem plausível e errada, que é a pior falha num recurso feito para ser postado em público:
- **D1** — o amuleto é lido do `GEAR` cru, então as propriedades de classe de um Magistral com `classBinding` **somem da imagem** enquanto continuam na tela.
- **D2** — altura fixa, e calibrada ao contrário: o modo **Detalhado**, que desenha todas as descrições, recebe 560 px contra os 820 do Estatístico. O corte é o caso comum, não o extremo.

Os outros cinco: ícone de classe invisível porque o canvas não herda filtro CSS (virou armadilha 15), ausência de renderização em 2x, `toDataURL` no lugar de `toBlob`, rodapé em posição absoluta, e um diagnóstico de CORS que está errado de duas maneiras. A `F3` do `ROADMAP.md` foi reescrita com o plano corrigido, uma lista de conferência visual, e **a altura dinâmica trazida da F4 para cá**.

**Três perguntas antigas encerradas** (DEC-024), com as respostas do autor: os 🎲 granulares e o seletor "Só alteradas" foram tirados **porque davam problema**, e a simplificação agradou — não são regressão. O modo Estatístico fica **adiado de propósito**: a informação que decide chega quando a Fase 3 entregar a versão em imagem, e aí dá para comparar os dois formatos lado a lado.

Sem mudança de código nesta sessão. `meta/legacy/` fica com o `GUIA_CORRECOES_FASE3.md` e o `README.md`.

**Próximo passo: Fase 3.** O rascunho já está no mount; nada a mexer no `.flatdropignore`.
