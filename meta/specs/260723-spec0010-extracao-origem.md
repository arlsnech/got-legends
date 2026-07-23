# spec0010 — Extração retroativa do `GOT_Build_-_Origem.md`, correção da Picada Celestial e enxugamento do mount

**Data:** 2026-07-23 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner`

**Por que esta spec existe:** terceira sessão da extração retroativa (DEC-011). O `meta/legacy/GOT_Build_-_Origem.md` (197 KB, 35 blocos, 18 rodadas) é a **conversa de origem do projeto** — vai da planilha do Google até a publicação. Diferente do Joker e do Alex, ela não é só uma sequência de correções: contém as **regras de domínio canônicas** ditadas pelo autor, a genealogia do projeto, e um requisito que nunca foi implementado por inteiro.

**Esta spec toca código** — uma linha em `src/data.js`. Diferente das specs 0008 e 0009: **rode `npm run build` antes de commitar** e siga o roteiro de conferência da Parte 3.

**Regras de execução:**
- Nenhum `--force`, `rebase` ou `reset --hard`.
- A única remoção autorizada é a da Parte 11, e só depois de o resto estar no `git diff`.
- Se **uma** âncora que seja não for encontrada exatamente: **PARE e reporte qual falhou.**
- **Dois commits separados:** um de código (Partes 2–3) e um de documentação (Partes 4–12). O de código vai primeiro e só depois do build passar.

---

## Parte 1 — Levantamento

```
git branch --show-current
git status
ls meta/legacy/
```

1. Estamos na `v2-planner`? Se não, **PARE**.
2. Há algo modificado e não commitado? Liste.

---

## Parte 2 — Correção de código: `picada_celestial` em `REQUIRED_PERKS`

**Arquivo:** `src/data.js`

**Contexto da correção** (não copie isto para o arquivo — é para o executor entender o que está fazendo): a Picada Celestial é arma do Assassino, e o Ronin só a usa gastando o perk `desbloq_ron_pc`, que já está no pool do próprio item. A tabela `REQUIRED_PERKS` não tinha entrada para ela, então o Ronin a equipava sem travar nada — ao contrário da Zarabatana, que é o mesmo caso e está na tabela. A regra foi ditada pelo autor no bloco 27 do arquivo de origem: *Zarabatana e Picada Celestial = Assassino (Ronin com Vantagem)*.

**Âncora:**

```
  zarabatana:         { ronin: 'desbloq_ron' },
```

**Substituir por:**

```
  zarabatana:         { ronin: 'desbloq_ron' },
  picada_celestial:   { ronin: 'desbloq_ron_pc' },
```

> **Confira antes de editar:** o pool de perks do item `picada_celestial` em `GEAR` precisa conter `desbloq_ron_pc`. Se não contiver, **PARE e reporte** — o perk travado apontaria para um id que o `<select>` não tem, e o campo ficaria vazio.

---

## Parte 3 — Build e conferência visual

Rode `npm run build`. Se falhar, **PARE**.

Depois suba o dev server e confira, **nesta ordem**:

1. **Ronin + Picada Celestial** → Vantagem I trava com o selo 🔒 e mostra "Desbloqueio do Ronin". É o caso que a correção existe para resolver.
2. **Assassino + Picada Celestial** → Vantagem I **livre**, sem cadeado, escolhendo entre os perks normais. O Assassino é o dono da arma; travar para ele seria bug novo.
3. **Ronin, Picada Celestial equipada → trocar para Assassino** → o perk obrigatório sai e o slot libera. Trocar de volta → volta a travar. É o caminho do `changeClass`, o mais fácil de quebrar.
4. **Zarabatana com Ronin** → continua travando como antes. Não-regressão do caso vizinho.
5. **🎲 com Ronin, algumas vezes** → quando a Picada Celestial sair sorteada, `perk1` vem com o desbloqueio e `perk2` sorteado entre os outros — nunca duplicado.
6. **Nenhum `<select>` de vantagem vazio** em nenhum dos casos acima.

Se todos passarem, faça o **commit de código**:

```
git add src/data.js
git commit -m "fix(data): trava o perk de desbloqueio do Ronin na Picada Celestial"
```

Não faça `push` ainda — o commit de documentação vem em seguida.

---

## Parte 4 — `meta/DECISIONS.md`

**Âncora** (último parágrafo do arquivo, fim da DEC-017):

```
A convenção é **implícita no dado** — é uma string, e nada valida seu formato. Uma linha escrita fora do padrão (parêntese em outro lugar, espaço a mais) não casa com nenhuma das duas expressões regulares e passa adiante inalterada, sem erro. Ver armadilha 9 no `CONTEXT.md`.
```

**Substituir por:**

```
A convenção é **implícita no dado** — é uma string, e nada valida seu formato. Uma linha escrita fora do padrão (parêntese em outro lugar, espaço a mais) não casa com nenhuma das duas expressões regulares e passa adiante inalterada, sem erro. Ver armadilha 9 no `CONTEXT.md`.

---

## DEC-018 — Regras canônicas de restrição de classe das armas de longo alcance

**Data do registro:** 2026-07-23 · **Status:** aceita · **Fonte:** `meta/legacy/GOT_Build_-_Origem.md`, blocos 21 e 27

### Por que isto existe
Foi o erro que mais voltou na origem do projeto. Marcar equipamento como "exclusivo desta classe" errado aconteceu pelo menos três vezes, e a causa foi identificada pelo autor: a planilha tem, na aba de Magistrais, quatro colunas por classe com marcações cruzadas — e essas colunas são **recomendação de build**, não permissão de uso. Ler aquilo como restrição de classe produz um `data.js` errado que parece plausível.

### A tabela canônica
Ditada pelo autor no bloco 27, contra o jogo. **É esta a referência; nada de reinferir da planilha.**

| Equipamento | Quem equipa |
|---|---|
| Arco Curto · Espírito Imponderável | qualquer classe, sem custo |
| Arco Longo · Arco Ricocheteador | qualquer classe — as não-Caçadoras gastam **Versátil** |
| Visão de Sugaru | qualquer classe, **sem custo** (ver abaixo) |
| Zarabatana · Picada Celestial | Assassino; **Ronin com perk de desbloqueio** |
| Pacote de Bombas | Ronin; **Assassino com perk** |
| Remédio Proibido | Ronin; **Assassino e Samurai com perk** |
| Katanas, Amuletos, AF I e AF II Magistrais | **todas** as classes |

Repare no par que não é simétrico: o Pacote de Bombas libera para o Assassino, mas a versão Magistral dele — o Remédio Proibido — libera para **Assassino e Samurai**. Não é erro de digitação.

### A Visão de Sugaru é o caso especial
Ela é um **Arco Longo**, e mesmo assim não exige Versátil. O motivo é de dado, não de mecânica: o pool dela é o do Arco Longo **menos** Disparo Arremessante, Certeiro, Olho de Águia e Versátil (bloco 21). Sem Versátil no pool, não há o que travar — e é assim no jogo. O Arco Ricocheteador, ao contrário, herda o pool do Arco Longo **inteiro**, e por isso exige Versátil.

**Consequência prática:** ausência de perk de desbloqueio no pool de um item não é omissão de dado. Antes de "consertar", cheque contra esta tabela.

---

## FIX-009 — Picada Celestial não travava o perk de desbloqueio para o Ronin

**Data:** 2026-07-23 · **Gravidade:** baixa (build inválido montável, sem corromper cálculo)

### Sintoma
O Ronin equipava a Picada Celestial e escolhia livremente as duas vantagens, sem gastar o Desbloqueio do Ronin. Build impossível no jogo. A Zarabatana, mesmo caso, travava corretamente — a diferença entre as duas era visível lado a lado.

### Causa raiz
`REQUIRED_PERKS` (`data.js`) não tinha entrada para `picada_celestial`. O perk `desbloq_ron_pc` estava no pool do item desde sempre; faltava só a linha da tabela. É exatamente a consequência aberta anotada na DEC-014: **a tabela é lista à mão e não se valida contra o `GEAR`**.

### Correção
Uma linha em `REQUIRED_PERKS`: `picada_celestial: { ronin: 'desbloq_ron_pc' }`. Nenhuma mudança em `logic.js` nem em `App.jsx` — os seis pontos de integração já existiam e passaram a cobrir o item sozinhos.

### Como foi encontrado
Não por relato de uso: apareceu na extração retroativa da spec0009, ao conferir `REQUIRED_PERKS` contra os pools de perk do `GEAR`. Ficou no backlog como "provável" até o bloco 27 do arquivo de origem confirmar a regra pela voz do autor. **A varredura que o achou vale repetir**: cruzar toda tabela de domínio escrita à mão contra o dado que ela indexa.

---

## DEC-019 — Os ranks S/A/B/C/D/E não entram na ferramenta

**Data do registro:** 2026-07-23 · **Status:** aceita, em vigor · **Fonte:** `GOT_Build_-_Origem.md`, bloco 15

As planilhas da comunidade trazem uma tier list por letra (S, A, B…) para os itens Magistrais, e uma versão antiga da ferramenta chegou a exibi-la ao lado do nome do item (`⭐ Espírito Imponderável [A]`).

**Foi removida.** Dois motivos, ambos do autor: a nota é **opinião de fã, não dado do jogo** — não aparece em lugar nenhum na tela do Tsushima; e o *Ghost of Yotei* usa um sistema de ranking por letra para outra coisa, então exibir letras aqui induz erro em quem joga os dois. A tier list continua existindo na planilha, que é onde uma opinião curada tem lugar.

**Regra que fica:** a ferramenta mostra o que o jogo mostra. Dado derivado da comunidade — tier list, recomendação de build, meta — fica fora, mesmo quando é bom.

---

## DEC-020 — A Flecha Perfurante é filtrada por classe, não por técnica

**Data do registro:** 2026-07-23 · **Status:** aceita, deliberadamente parcial · **Fonte:** `GOT_Build_-_Origem.md` bloco 13 e `GOT_Build_-_Alex.md` bloco 1

### O pedido original
No bloco 13 o autor foi específico: a Flecha Perfurante deveria aparecer **só para a Caçadora e só quando a técnica de Flecha Perfurante estivesse equipada**.

### O que foi implementado
Só a primeira metade. `formatAmmoForClass` (DEC-017) esconde a linha para quem não é a classe primária, mas não olha as técnicas do build: com a Caçadora, a Flecha Perfurante aparece sempre.

### Por que isso está certo por enquanto
Não é esquecimento. Na conversa do Alex o próprio autor abriu a porta — *"se for muito complicado pode só deixar mesmo a flecha aparecendo para o caçador, pois já ajuda para o jogador saber quanto que teria sem ter que equipar a técnica"*. A versão simplificada informa o teto de munição sem obrigar o jogador a montar a build inteira para ver o número.

### O custo de completar
`formatAmmoForClass` hoje é função pura de `(ammoStr, classId, item)` e vive na camada de exibição. Condicionar por técnica exige passar o build (ou as técnicas) até ela e mapear qual técnica libera qual munição — dado que **não existe hoje** em `data.js`. Ou seja: não é ajuste de uma linha, é dado novo mais acoplamento novo. Está no `IDEAS.md` como melhoria, não como defeito.
```

---

## Parte 5 — `meta/CONTEXT.md`

**Âncora** (item 10 das «Armadilhas Conhecidas», último da lista):

```
10. **`REQUIRED_PERKS` é uma lista à mão** — o perk de desbloqueio obrigatório só trava se o item estiver nessa tabela de `data.js`. Item que ganhe perk de desbloqueio no `GEAR` e não entre aqui não trava nada, e nada acusa. Ver DEC-014.
```

**Substituir por:**

```
10. **`REQUIRED_PERKS` é uma lista à mão** — o perk de desbloqueio obrigatório só trava se o item estiver nessa tabela de `data.js`. Item que ganhe perk de desbloqueio no `GEAR` e não entre aqui não trava nada, e nada acusa. Ver DEC-014 e FIX-009, que foi exatamente esse caso.

11. **Restrição de classe não se infere da planilha** — a aba de Magistrais tem colunas por classe que são **recomendação de build**, não permissão de uso. Lê-las como restrição já produziu `data.js` errado três vezes na origem do projeto. A tabela canônica está na DEC-018 e é a única referência. Corolário: item sem perk de desbloqueio no pool pode estar certo (a Visão de Sugaru é assim de propósito) — cheque a DEC-018 antes de "consertar".

12. **CDR de Arma Fantasma não empilha entre as armas** — propriedade de redução de recarga numa AF vale **só para aquela AF**; a mesma propriedade no Amuleto vale para as duas. Em qualquer dos casos o número é exibido **separado por arma**, nunca somado num total. Errar isso foi o defeito mais repetido da fase de origem.
```

---

## Parte 6 — `meta/GLOSSARY.md`

**Âncora** (na seção «Conceitos do jogo»):

```
- **Tier** — nível da árvore de vantagens de classe (I, II, III). Cada tier tem 4 opções, o jogador escolhe 1.
```

**Substituir por:**

```
- **Tier** — nível da árvore de vantagens de classe (I, II, III). Cada tier tem 4 opções, o jogador escolhe 1.
- **Classe primária de uma arma** — a classe "dona" do equipamento. Recebe a munição entre parênteses e não paga perk de desbloqueio. Ver DEC-018 para a tabela canônica.
- **Tier list (S/A/B/C/D)** — ranking de Magistrais feito pela comunidade. **Não é dado do jogo** e não aparece na ferramenta, de propósito. Vive só na planilha. Ver DEC-019.
```

---

## Parte 7 — `meta/STATUS.md`

### 7.1 — Backlog: fechar os dois itens resolvidos

**Âncora** (dois itens consecutivos do backlog):

```
- [ ] **`picada_celestial` fora de `REQUIRED_PERKS`** — o item carrega o perk `desbloq_ron_pc` ("Desbloqueio do Ronin") no próprio pool e está disponível ao Ronin (`by:["assassin","ronin"]`), mas a tabela não tem entrada para ele: o Ronin equipa a Picada Celestial sem o perk travar, ao contrário do que acontece na Zarabatana. Inconsistência interna do `data.js`, verificada em 2026-07-23. Correção provável: uma linha `picada_celestial: { ronin: 'desbloq_ron_pc' }`. Ver DEC-014.
```

**Substituir por:**

```
- [x] ~~`picada_celestial` fora de `REQUIRED_PERKS`~~ — **corrigido em 2026-07-23** (FIX-009). A regra foi confirmada pela fonte no bloco 27 do arquivo de origem, e virou a DEC-018.
```

**Âncora** (o item do Sugaru):

```
- [ ] Verificar se `visao_sugaru` (Visão de Sugaru, arco longo Magistral) deveria ter perk de desbloqueio — ao contrário do `arco_ricocheteador`, que reusa `PERKS_ARCO_LONGO` e por isso tem `versatil`, o pool do Sugaru não traz nenhum perk de desbloqueio. Pode ser fiel ao jogo ou pode ser omissão de dado; **conferir no jogo antes de mexer.**
```

**Substituir por:**

```
- [x] ~~Verificar se `visao_sugaru` deveria ter perk de desbloqueio~~ — **respondido em 2026-07-23: não deveria, e o dado está certo.** O pool dela é o do Arco Longo menos Disparo Arremessante, Certeiro, Olho de Águia e Versátil; sem Versátil no pool, qualquer classe a equipa sem custo. Ver DEC-018.
```

### 7.2 — Última sessão

**Âncora** (último parágrafo do arquivo):

```
**Próximo passo:** extração 3/4 — `meta/legacy/GOT_Build_-_Origem.md` (197 KB). A linha dele já saiu do `.flatdropignore` nesta spec.
```

**Substituir por:**

```
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
```

---

## Parte 8 — `meta/CHANGELOG.md`

**Âncora** (na seção `## [Não lançado]`, subseção «### Corrigido», primeira linha):

```
- Props de item Magistral saíam abaixo do máximo na build aleatória (FIX-006). Builds salvos ou compartilhados com o valor errado são saneados ao carregar
```

**Substituir por:**

```
- Picada Celestial não obrigava o Ronin a gastar o perk de desbloqueio, ao contrário da Zarabatana (FIX-009)
- Props de item Magistral saíam abaixo do máximo na build aleatória (FIX-006). Builds salvos ou compartilhados com o valor errado são saneados ao carregar
```

---

## Parte 9 — `meta/HISTORY.md`

**Âncora** (últimas linhas do arquivo, fim da seção 7):

```
**Código Base64:** `encodeBuild(build, name)` → base64 do JSON serializado via `serializeBuild`. `decodeBuild(code)` → decodifica e valida estrutura.
```

**Substituir por:**

```
**Código Base64:** `encodeBuild(build, name)` → base64 do JSON serializado via `serializeBuild`. `decodeBuild(code)` → decodifica e valida estrutura.

---

## 8. Origem do projeto — da planilha à ferramenta

*(Consolidado em 2026-07-23 a partir de `meta/legacy/GOT_Build_-_Origem.md`, extraído e removido pela spec0010.)*

**O projeto não começou como uma ferramenta.** Começou como uma planilha do Google, montada a partir de material da comunidade — a *NEW GoT: Legends Data Sheet (4.12.22)*, a wiki do Ghost franchise, o `ghostoftsushimalegends.com` e outros compilados. O pedido original foi de **engenharia de dados**: normalizar, eliminar duplicata, separar propriedades de vantagens, e traduzir de verdade em vez de literalmente (*Resolve* → Determinação, *Stagger* → Quebra de Postura, *Perks* → Vantagens).

**O dado é do autor, não da comunidade.** O passo decisivo foi o autor abrir o jogo em PT-BR e corrigir a planilha contra a tela: nomes traduzidos oficialmente, faixas de propriedade, quais props valem para P1 e P2, munições, e as restrições de classe. Daí em diante a planilha passou a ser a fonte, e as planilhas da comunidade viraram material de conferência. É por isso que o rodapé da ferramenta diz *"Dados verificados no jogo (PT-BR)"*, e é por isso que divergência entre `data.js` e um site externo se resolve a favor do `data.js`.

**Créditos herdados:** DoctorKoolman · Boneofimba · berrek45 · tenshimkii · comunidade GoT Legends. Estão no rodapé da ferramenta desde a v1.0.

**A ferramenta nasceu depois, e de propósito.** O autor cogitou construir o planejador dentro da própria planilha e descartou: deixaria o arquivo pesado e o resultado seria pior. A decisão foi exportar para JSON e construir em React — com um alvo declarado, os planejadores de build de outros jogos (MugenMonkey da série Souls, o do Fallout 4 no GitHub Pages), mais **a coisa que nenhum deles faz: a tabela de estatísticas já calculada e visível ao lado da build.** Esse continua sendo o diferencial do projeto.

**Linha do tempo aproximada:** scaffold do Vite em **abril de 2026**; `data.js` → `logic.js` → `App.jsx`, construídos nessa ordem e a pedido, um de cada vez; v1.0.0-beta em **junho de 2026**.

### O que a fase de origem ensinou

- **Reescrever o arquivo inteiro corrompe.** A queixa que mais se repete no arquivo é a mesma: pedir uma correção e receber de volta um arquivo com outras coisas mudadas — inclusive o `data.js` corrompido, com item marcado como exclusivo de classe sem motivo. O próprio autor diagnosticou a saída — *"seria melhor se a ferramenta desde o começo fosse dividida em várias partes, e você só fosse corrigindo as partes necessárias"* — e é literalmente o que o fluxo de specs por âncora faz hoje. A DEC-007 tem raiz aqui, não no kit.
- **As versões intermediárias se perderam.** O autor registra que *"a versão 1 do JSX foi sobrescrita e não salvei, e isso ocorreu para todas as versões"*. Sobraram duas cópias, e é dessa perda que vem o hábito de guardar snapshots (`src/v1..v4`) e, mais tarde, a DEC-012.
- **Ambiente Windows, três tropeços registrados:** o PowerShell recusa `&&` como separador (`O token '&&' não é um separador de instruções válido`); a política de Controle de Aplicativo do Windows bloqueou o binding nativo do rolldown, derrubando o scaffold do Vite mais novo; e o `gh-pages` estoura o limite de linha de comando (DEC-016).
- **Publicação:** GitHub Pages exigiu empurrar o `dist/` à mão para a `gh-pages`; o Vercel serviu **página em branco** por caminho-base — daí o `base` controlado por `VITE_BASE_URL` no `vite.config.js` mais o `vercel.json` e o `netlify.toml`; o Netlify funcionou de primeira e virou o canal principal. Uma tentativa de **Cloudflare Pages** ficou inacabada quando a conversa terminou — o último commit da `main` antes da adoção do KCM (`63fb3a6`) adicionou um `_redirects` para ela.
```

---

## Parte 10 — `meta/IDEAS.md`

### 10.1 — Fila de leitura

**Âncora:**

```
| `GOT_Build_-_Origem.md` | 197 KB | ⏳ próximo |
| `GOT_Build_-_TOhno.md` | 267 KB | ⏳ — talvez 2 sessões |
```

**Substituir por:**

```
| `GOT_Build_-_Origem.md` | 197 KB | ✅ extraído em 2026-07-23 (spec0010) — arquivo removido |
| `GOT_Build_-_TOhno.md` | 267 KB | ⏳ próximo — talvez 2 sessões |
```

### 10.2 — O que o Origem rendeu

**Âncora** (fim da seção acrescentada pela spec0009):

```
**O critério aguentou o arquivo maior, e uma pergunta nova apareceu:** *"isso está registrado?"* pegou o FIX-008 e as decisões, mas quem pegou as munições foi *"o que este código faz que nenhum `meta/` menciona?"*. São perguntas diferentes — a primeira parte do arquivo antigo, a segunda parte do código. Para o `Origem` (197 KB) e o `TOhno` (267 KB), vale rodar as duas.
```

**Substituir por:**

```
**O critério aguentou o arquivo maior, e uma pergunta nova apareceu:** *"isso está registrado?"* pegou o FIX-008 e as decisões, mas quem pegou as munições foi *"o que este código faz que nenhum `meta/` menciona?"*. São perguntas diferentes — a primeira parte do arquivo antigo, a segunda parte do código. Para o `Origem` (197 KB) e o `TOhno` (267 KB), vale rodar as duas.

### Já extraído do `GOT_Build_-_Origem.md` (2026-07-23) — **não reabrir**
Viraram DEC-018 (tabela canônica de restrição de classe), FIX-009 (Picada Celestial, corrigido), DEC-019 (ranks de fã fora da ferramenta), DEC-020 (Flecha Perfurante por classe, não por técnica), as armadilhas 11 e 12 do `CONTEXT.md` e a seção 8 do `HISTORY.md`. Já conferido como **atendido** no código de hoje, não reabrir: um item por linha nas vantagens de classe · rótulo "Vantagem I/II/III" · 2 vantagens por equipamento (slot de 120 Ki) · Magistral com propriedade **selecionável** e valor travado no máximo · técnica bloqueada quando os Magistrais estão no limite · CDR das duas Armas Fantasma calculado em separado · cores de classe (Caçadora azul, Assassino verde) · Fúria de Hachiman com 3 golpes base · tooltip de técnica sem o payload interno (`legendarySlot +1`, `+stat`) · munição e descrições em EN no modo inglês.

**Terceira pergunta, que só apareceu neste arquivo:** *"o que a ferramenta já teve e não tem mais?"* Os dumps de interface colados pelo autor são fotografias de versões que não existem mais em lugar nenhum — as intermediárias se perderam. Foi assim que os botões de aleatório granulares apareceram. Para o `TOhno`, vale ler os dumps de tela com essa pergunta em mãos.

### 2026-07-23 — Botões de build aleatória granulares *(possível regressão)*
O dump da v1.1 no arquivo de origem mostra **três** botões — `🎲 Tudo`, `🎲 Classe`, `🎲 Gear` — e o `App.jsx` de hoje tem só um. O pedido original ia além: aleatório em cadeia, com botão por equipamento, por propriedade e até por valor de propriedade. Como as versões intermediárias se perderam, não dá para saber em qual reescrita os três viraram um, nem se foi decisão. **Antes de reimplementar, vale perguntar ao autor se a simplificação foi intencional.**

### 2026-07-23 — Flecha Perfurante condicionada à técnica
Completar o pedido original do bloco 13: a munição exclusiva só aparece quando a técnica que a concede está equipada. Hoje aparece sempre para a classe primária (DEC-020). Precisa de dado novo em `data.js` — o vínculo técnica → munição não existe — e de passar as técnicas até `formatAmmoForClass`, que hoje é função pura de exibição. Melhoria, não defeito.
```

---

## Parte 11 — `.flatdropignore` e remoção do arquivo

> Arquivo com quebras de linha **CRLF**. Preserve-as.

### 11.1 — Parar de subir as specs aplicadas

**Âncora:**

```
# meta/specs/
```

**Substituir por:**

```
meta/specs/
```

### 11.2 — Liberar o último legado da fila

Dentro do bloco `# >>> flatdrop-editor`, **remova a linha**:

```
meta/legacy/GOT_Build_-_TOhno.md
```

### 11.3 — Remover o arquivo extraído

**Só depois de as Partes 4 a 10 aparecerem no `git diff`.**

```
git rm meta/legacy/GOT_Build_-_Origem.md
```

---

## Parte 12 — `logs/2026-07-23.md`

**Anexe** ao final do arquivo, precedido de uma linha `---`:

```markdown
## Sessão 4 — Extração retroativa 3/4: `GOT_Build_-_Origem.md`

### Objetivo da sessão
Extrair a conversa de origem do projeto e corrigir a Picada Celestial, cuja regra o usuário confirmou.

### Feito
- Lido `meta/legacy/GOT_Build_-_Origem.md` (35 blocos, 18 rodadas, 197 KB), com foco nos blocos de prompt.
- Conferidos contra o código atual: cores de classe (`col` em `data.js`), `strikes: 3` da Fúria de Hachiman, ausência de payload interno nos tooltips, pool de perks da Visão de Sugaru e da Picada Celestial, `base` do `vite.config.js`.
- **Corrigido o FIX-009** — `picada_celestial` acrescentada a `REQUIRED_PERKS`. Build e conferência visual em seis pontos.
- Entregue a `spec0010`.

### Specs entregues / aplicadas
- `260723-spec0010-extracao-origem.md` — corrige o FIX-009 em `data.js`; registra DEC-018 a DEC-020; acrescenta as armadilhas 11 e 12 ao CONTEXT, dois termos ao GLOSSARY, a seção 8 ao HISTORY; fecha dois itens do backlog; acrescenta duas ideias; exclui `meta/specs/` do mount e libera o `TOhno`.

### Decisões
- **DEC-018** — tabela canônica de restrição de classe. A origem do erro repetido: colunas de *recomendação* na planilha lidas como *permissão*.
- **DEC-019** — ranks de tier list ficam fora da ferramenta.
- **DEC-020** — Flecha Perfurante por classe, não por técnica; simplificação consciente.

### Bugs
- **FIX-009** — Picada Celestial não travava o Desbloqueio do Ronin. Corrigido. É a consequência aberta da DEC-014 se materializando.

### Aprendizados / armadilhas
- **CDR de Arma Fantasma não empilha entre as duas armas** — o defeito mais repetido da fase de origem. Virou armadilha 12.
- **Restrição de classe não se infere da planilha** — recomendação ≠ permissão. Virou armadilha 11.
- **Ausência de perk de desbloqueio pode ser o dado certo** — a Visão de Sugaru é assim de propósito.
- **Terceira pergunta para a extração:** *"o que a ferramenta já teve e não tem mais?"* Os dumps de interface colados pelo autor são a única foto sobrevivente das versões perdidas.
- **A DEC-007 (fluxo por spec) tem raiz aqui**, não no kit: o autor já havia diagnosticado, na origem, que reescrever o arquivo inteiro corrompia o que funcionava.

### Onde parei
`spec0010` entregue, com uma correção de código e a extração 3/4. Falta só o `TOhno`.

### Próximos passos
1. Extração 4/4 — `GOT_Build_-_TOhno.md` (267 KB), possivelmente em duas sessões.
2. Perguntar ao autor se a simplificação dos botões de aleatório foi intencional.
3. Fase 3 (`generateBuildImage`), depois da extração e informada por ela.
```

---

## Parte 13 — Fechamento

Rode `git diff` e confira. O **commit de código** da Parte 3 já deve estar feito; agora o de documentação:

```
git add meta/DECISIONS.md meta/CONTEXT.md meta/GLOSSARY.md meta/STATUS.md meta/CHANGELOG.md meta/HISTORY.md meta/IDEAS.md .flatdropignore logs/2026-07-23.md meta/specs/260723-spec0010-extracao-origem.md
git commit -m "docs(meta): extrai a conversa de origem e registra DEC-018 a DEC-020"
git push
```

A remoção do `meta/legacy/GOT_Build_-_Origem.md` entra pelo `git rm` da Parte 11.3.
