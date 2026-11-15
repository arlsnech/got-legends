# GoT Legends Build Planner — guia para o Claude Code

> Arquivo-raiz lido pelo Claude Code em todo turno. Mantenha CURTO (< 200 linhas — custa token a cada leitura).
> Regra pratica: se remover uma linha e o Claude ainda acerta, ela nao pertence aqui. Procedural detalhado -> vira skill em `.claude/skills/`.
> O comportamento detalhado do assistente esta em `meta/CEREBRO.md`.

## Ritual de inicio
Leia `meta/CEREBRO.md` -> `meta/CONTEXT.md` -> `meta/STATUS.md` antes de agir. Confirme em uma frase o que entendeu.

## O que este projeto e
SPA React 18 + Vite 5, sem backend. Planejador de builds de Ghost of Tsushima: Legends, bilingue PT-BR/EN.
Quatro arquivos carregam tudo: `src/App.jsx` (UI inteira, ~2500 linhas), `src/data.js` (banco do jogo),
`src/logic.js` (motor de calculo), `src/icons.js` (mapa id -> icone). Detalhe em `meta/CONTEXT.md`.

## Build / validacao
- Build: `npm run build` — rode antes de commitar mudanca de codigo.
- Dev: `npm run dev` (localhost:5173) · Preview do build: `npm run preview`
- Deploy: `npm run deploy` (GitHub Pages) — **so sob pedido explicito**; esta no `deny` (DEC-016).
- **Nao ha suite de testes.** A rede e o build + conferencia visual: ao terminar, diga o que abrir e olhar na tela (caso feliz, borda, regressao provavel).
- Mudanca so em `meta/` NAO precisa de build; a rede e o `git diff`.
- **Encerrar o dev server: por PORTA ou por PID, nunca por nome de imagem.** `taskkill /F /IM node.exe /T` mata TODO processo Node da maquina, nao so o Vite — ja aconteceu duas vezes aqui. Use `netstat -ano | findstr :5173` para achar o PID e `taskkill /PID <pid> /F`, ou simplesmente Ctrl+C no processo que voce mesmo subiu.

## Armadilhas que ja morderam (nao repita)
- `getStatGroups(stats, classId, lang)` — o `classId` e obrigatorio. Sem ele, stats voltam `undefined`.
- Nao envolva `<select>` com `<Tooltip>` — o span inline-block mata o `width: 100%`.
- Nao aplique filtro CSS em icone PNG de tecnica — eles ja tem cor propria; o filtro vira retangulo solido.
- O canvas NAO herda filtro CSS. SVG leva `T.iconFilter`, PNG nao; `pen.icon` deriva isso da extensao, marcada no `loadImg`.
- `transform` num ancestral captura os filhos `position: fixed`. Centralize sobreposicoes por flexbox.
- `T` e objeto MUTAVEL de modulo. Nunca declare `const T = {...}` dentro de um componente filho.
- Amuleto magistral com `classBinding`: leia sempre por `getEffectiveCharm(itemId, linkedClass)`, nunca do `GEAR` direto.
- Tamanho de fonte da imagem gerada mora em `IMG_FS`. Nunca literal.
- `★` e de Magistral; `●` e de Determinacao, sempre repetido (`●●●`). Um significado por caractere.
- Lista completa (23 itens) em `meta/CONTEXT.md` > "Armadilhas Conhecidas".

## Convencoes
- IDs de dominio em `snake_case` PT-BR espelhando `data.js` (`ronin_breath`, `gw_kunai`). **Nao traduza para ingles.**
- Codigo em camelCase ingles; comentarios em PT-BR; secoes marcadas com `// --- Nome ---`.
- Commits em Conventional Commits (`feat(escopo): descricao`), mensagem **SEM acento**.
- Toda string de UI existe em PT-BR e EN. Nunca acrescente string monolingue.
- Edicoes nos meta/ sao **append-only** pelo Code (STATUS, DECISIONS); curadoria que reescreve vem do chat (arquivo inteiro OU WO).
- Antes de INSERIR uma entrada nova num doc (termo, item de backlog, armadilha), procure se ela ja existe no arquivo. A ancora diz onde entra, nao que nao haja duplicata.

## Work orders (`meta/workorders/`)
- Nome: `AAMMDD-woNNNN-desc.md`. Aplicadas com `/apply-wo <arquivo>`.
- Ache cada ancora EXATAMENTE; se nao achar, **PARE e reporte**. Nao mexa fora das edicoes nomeadas.
- Se a WO trouxer portao de diagnostico, obedeca ao portao antes de editar. Hipotese nao e permissao para corrigir.
- `git diff` antes do commit. A WO e versionada: entra no `git add` junto com o efeito dela.
- Ao terminar de aplicar, feche o ciclo sozinho: `git add` -> `git commit` -> `git push`.
- Ate a wo0020 estes arquivos se chamavam **spec** e viviam em `meta/specs/`. Os nomes antigos foram preservados de proposito (DEC-030) — nao os renomeie.

## Spec de feature (`meta/specs/`) e analise (`meta/analises/`)
- **Spec de feature** — o quE construir e quando esta pronto (criterios de aceite verificaveis). Molde: `meta/SPEC.md`. Nao e WO.
- **Analise** — precede mudanca nao-trivial: problema, opcoes, recomendacao, ponto de decisao. Nao decide sozinha.
- As duas pastas nascem no primeiro uso. Nao as crie vazias.

## Ao fechar a tarefa, RELATE o trabalho
O que fez, o que encontrou que foge do que a tarefa pedia, os arquivos tocados, o resultado do build ou da conferencia visual, e o commit. **Nao** copie o bloco de fecho de turno do `meta/CEREBRO.md`: aquele e da raia de planejamento, e trocar relatorio por formulario perde o que so voce viu.

## Quando eu pedir medição
- Eu leio a pasta com teto de contexto e de tempo por comando; você lê o repositório inteiro. Se eu pedir para **medir**, o pedido não tem âncora nem commit: não edite nada, não conserte nada, não sugira nada.
- Responda com o **número cru e o comando que o produziu**. Sem interpretação, sem recomendação — se você achar que o número indica um problema, diga o número primeiro e a suspeita depois, separada.
- Se o alvo estiver fora da raiz do repositório, isso depende de `permissions.additionalDirectories` no `.claude/settings.json` (a mesma chave do relatório em arquivo). Se a leitura for negada, DIGA — não estime.

## Push e relatório — nesta ordem, sempre
- **Verde** (validação passou, ou WO só de doc com o `git diff` conferido) → `add`, `commit` e **`push`, sem perguntar.** Não peça permissão para o que já está decidido.
- **Vermelho** (validação falhou, âncora não encontrada, `git diff` com arquivo fora do previsto) → **não commite e não empurre.** E **não pergunte em prosa** («posso dar push?») — pergunta escrita no meio do texto passa despercebida. Feche com um **menu numerado** de saídas reais, a recomendada em **1** — ex.: `1) corrigir <o quê> e revalidar (recomendado)  2) reverter as edições  3) commitar local, sem push  4) empurrar assim mesmo`.
- **O relatório é o ÚLTIMO passo** — só depois de resolvido o push. Ele diz o que de fato aconteceu: empurrado (com o hash), não empurrado (com o motivo), ou aguardando a escolha do menu. **Relatório escrito antes da decisão conta metade da história** e vira mentira assim que o push sai; se a escolha chegar depois, **reescreva o relatório**, não deixe a versão velha valendo.

## Relatório em arquivo (sempre, sem pedir)
- Ao fechar QUALQUER tarefa (`/apply-wo` ou `/wrap`), grave o MESMO relatório também em `../AAMMDD-HHMM-code-<slug>-<ato>-<alvo>.txt` — pasta-PAI do repo, fora do versionamento. **`<slug>`** = nome curto do projeto (a pasta-pai costuma ser compartilhada por vários repos). **`<ato>`** = vocabulário FECHADO: `apply` · `wrap` · `probe` · `explore` — nada fora desta lista. **`<alvo>`** = a WO (`wo0108`) quando houver uma; senão, duas ou três palavras com hífen sobre o que foi feito (`teto-narrative`). Exemplo: `260903-2011-code-kcm-apply-wo0108.txt`. O nome existe para responder «qual relatório trata do quê» sem abrir nenhum deles.
- Exige `permissions.additionalDirectories` no `.claude/settings.json`. Se a escrita for negada, DIGA e siga — o relatório no chat continua sendo a entrega.
- **Para desligar:** apague esta seção. O relatório no chat não muda.

## Config (modelo x esforco)
- WO com diff exato ja validado -> **Sonnet**, esforco proporcional (mecanico = baixo/medio).
- Tarefa com julgamento sem rede (refator no `App.jsx`, WO que delega decisao) -> **Opus**, esforco alto.
- Esforco proporcional a ambiguidade; `/effort low` para o trivial.
