# wo0028 — Fatia 1 do kit v1.138.0: `settings.json`, as tres skills e o `_TEMPLATE.md` de WO

**Data:** 2026-11-14 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Toca codigo do produto?** Nao — `.claude/` e `meta/workorders/`. **Build:** dispensavel; a rede e o `git diff`.
**Base:** commit `85a427e`, arvore limpa (conferido com `git log -3 --oneline` e `git status --short`).
**Pacote de origem:** `../261114-kcm-update-v1.138.0/` (fora do repo, nunca versionada).

> **Ancoras lidas em:** 2026-11-14, neste turno, direto do disco.
> - `.claude/settings.json` — arquivo inteiro lido com `cat`; e substituicao integral, nao ancora parcial.
> - `.claude/skills/apply-wo/SKILL.md` e `.claude/skills/wrap/SKILL.md` — arquivos inteiros lidos com `cat`; sao substituicao integral.
> - `.claude/skills/sondar/SKILL.md` e `meta/workorders/_TEMPLATE.md` — nao existem; sao criacao, nao edicao.
>
> **Canal dos meta neste ciclo = CODE.**
>
> **Proximo comando:** `/wrap` — esta WO fecha sozinha, mas o log do dia ainda nao existe.

---

## 1. Por que

A Fatia 1 e a superficie que o proprio pacote manda varrer primeiro: skill e lida ANTES de trabalhar,
entao linha revogada ali dirige o trabalho seguinte em vez de so informar mal. E e a fatia que
destrava as outras duas — sem `Write` e sem `additionalDirectories` no `settings.json`, as skills
novas nao conseguem gravar o que elas mesmas mandam gravar.

Escopo: as tres correcoes obrigatorias do `settings.json`, a fusao das duas skills vivas com as do
pacote, a criacao da skill `sondar` e a criacao do `_TEMPLATE.md` de WO.

## Fora de escopo

- A varredura de cadencia (`sessao` → turno/conversa, «commit pronto em bloco», «nunca blocos para
  costurar»): 42 pontos em 8 arquivos. E a **Fatia 2**, com uma WO por arquivo e contagem antes/depois.
- O merge do `meta/CEREBRO.md` (123 blocos no pacote): **Fatia 3**.
- Mover `../261114-kcm-update-v1.138.0/` para `../notas-arquivadas/`: so quando a Fatia 3 fechar.
- As Instrucoes do Projeto (fora do repo): Fatia 2.

## Medicao previa

- `grep -c '"Write"' .claude/settings.json` → **0**. Nao ha `defaultMode: acceptEdits` no arquivo, entao
  nada disfarca a falta: hoje cada arquivo novo pede aprovacao.
- `grep -c additionalDirectories .claude/settings.json` → **0**. Os oito `.txt` ja na pasta-pai sao os
  relatorios que o padrao novo manda gravar em `../AAMMDD-HHMM-code-*.txt` — hoje o Code nao escreve la.
- Nao ha linha `//` depois do `}`: o JSON e valido. Essa das tres correcoes obrigatorias ja estava boa.
- Carimbos de versao do kit em dia: **0 de 5**. Esta WO acerta 4 (as tres skills e o `_TEMPLATE`); o do
  CEREBRO fica para a Fatia 3.

## Armadilhas desta WO

- **A Edicao 1 pode nao valer de imediato.** O Claude Code le `.claude/settings.json` ao iniciar. Se as
  Edicoes 2 e 5 forem recusadas por permissao, **nao force**: termine o que der, relate, e o dono
  reabre a sessao do Code para o `settings.json` novo passar a valer.
- **As Edicoes 2 e 5 leem a pasta-pai.** Se `cp` de `../261114-kcm-update-v1.138.0/` for negado, PARE
  naquela edicao, relate, e siga para as outras — nao reconstrua o arquivo de cabeca nem de resultado
  de ferramenta truncado.
- **Nao renomeie nada em `meta/workorders/`.** O `_TEMPLATE.md` nasce ao lado das WOs existentes; os
  nomes `spec0001`–`spec0020` e `wo0021`–`wo0027` ficam como estao.

---

## Edicao 1 — `.claude/settings.json` · tres correcoes obrigatorias

Substituicao integral do arquivo. Mantem tudo o que este projeto acrescentou (os `npm run`, `git mv`,
`git log`, e `npm run deploy` no `deny` por DEC-016) e acrescenta `Write` e `additionalDirectories`.

**Conteudo novo (arquivo inteiro):**

```json
{
  "permissions": {
    "allow": [
      "Read", "Write", "Edit", "Grep", "Glob",
      "Bash(git status:*)", "Bash(git diff:*)", "Bash(git add:*)", "Bash(git commit:*)", "Bash(git push:*)",
      "Bash(git mv:*)", "Bash(git log:*)",
      "Bash(npm run build:*)", "Bash(npm run dev:*)", "Bash(npm run preview:*)",
      "Bash(npm install:*)", "Bash(npm ci:*)"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(npm run deploy:*)"
    ],
    "additionalDirectories": ["../"]
  }
}
```

**Nao acrescente comentario nenhum a este arquivo.** Uma linha `//` faz o Claude Code descartar o JSON
inteiro em silencio e todas as permissoes param de valer de uma vez, sem erro e sem aviso.

## Edicao 2 — `.claude/skills/sondar/SKILL.md` · criar, copia do pacote

Skill nova, sem equivalente vivo: nada a proteger, copia verbatim.

```
mkdir -p .claude/skills/sondar
cp ../261114-kcm-update-v1.138.0/sondar.SKILL__template-update.md .claude/skills/sondar/SKILL.md
```

Confira depois: `head -5 .claude/skills/sondar/SKILL.md` tem de mostrar o front-matter com
`name: sondar`, e `tail -2` tem de trazer o carimbo `v1.138.0`.

## Edicao 3 — `meta/workorders/_TEMPLATE.md` · criar, copia do pacote

Modelo da WO, artefato que este projeto nunca teve. Copia verbatim — foi varrido por termos revogados
(`sessao`, «commit pronto», «costurar», vocabulario `spec`) e nao traz nenhum.

```
cp ../261114-kcm-update-v1.138.0/workorders._TEMPLATE__template-update.md meta/workorders/_TEMPLATE.md
```

Confira depois: `grep -c "Ancoras lidas em" meta/workorders/_TEMPLATE.md` → **1**, e
`grep -c "Quem roda" meta/workorders/_TEMPLATE.md` → **1** (os tres campos por passo de verificacao,
que o manifesto marca como uma das quatro regras a aplicar primeiro).

## Edicao 4 — `.claude/skills/apply-wo/SKILL.md` · fusao

Base: a skill do pacote v1.138.0. Acrescentadas as tres linhas que este projeto tinha e o kit nao
cobre — o portao de diagnostico (FIX-012), o `npm run build` quando a WO toca codigo, e a proibicao de
apagar WO aplicada. **Substituicao integral do arquivo.**

**Conteudo novo (arquivo inteiro):**

~~~
---
name: apply-wo
description: Aplica uma WO de meta/workorders/ ao repo — localiza cada âncora exatamente, substitui, e para se não achar. Use quando o usuário pedir /apply-wo ou para aplicar uma WO nomeada.
disable-model-invocation: true
---
Leia o arquivo de WO indicado em `meta/workorders/` e execute-o.
ANTES de editar: se a WO edita arquivo existente e o cabeçalho dela NÃO traz o campo «Âncoras lidas em» preenchido, RECUSE — não aplique, e diga que falta. Quem escreveu a WO é quem tem o viés; esta conferência é sua justamente por isso.
Localize cada âncora EXATAMENTE; se não achar uma, PARE e reporte — não chute um lugar próximo.
Antes de cada edição, confira a idempotência pelo texto NOVO INTEIRO: se ele já está no arquivo **e a âncora não** — salvo quando a âncora está dentro do texto novo, na forma «trocar» —, PULE e diga no relatório. Frase-chave não basta: na forma «trocar» o texto novo repete a âncora, e um trecho dele já existe antes de aplicar; e na REMOÇÃO o texto novo é um pedaço da âncora, presente antes de aplicar.
Se o banner «Canal dos meta» disser CHAT e o corpo trouxer edição numerada num documento `meta/`, a WO é contraditória: PARE e pergunte. O banner decide quem APLICA; escolher um dos lados em silêncio já deixou o registro de uma WO inteira de fora.
Se a WO contiver um portão de diagnóstico («rode este teste; se o resultado for X, PARE»), obedeça ao portão ANTES de editar qualquer coisa. Hipótese de causa não é permissão para corrigir — foi o que impediu o FIX-012 de entrar errado.
Não toque em nada fora das edições nomeadas. Ao fim, rode `git diff` e confira a forma esperada antes de commitar.
Se a WO tocou código fora de `meta/`, rode `npm run build` ANTES de commitar — este projeto não tem suíte de testes, então o build é metade da rede; a outra metade é dizer o que abrir e conferir na tela.
Não apague a WO aplicada: ela é artefato versionado, e o `git add` inclui o PRÓPRIO arquivo da WO.
Ao terminar, RELATE com corpo mínimo, nesta ordem: (1) o que foi feito, edição por edição; (2) a SAÍDA CRUA das conferências — o número e o comando que o produziu, nunca só «bate»; (3) o que fugiu do texto literal da WO; (4) o que muda para quem usa; (5) o que você olhou além da WO; (6) arquivos tocados; (7) build/validação; (8) commit e push. Relatório que só repete «bate, bate, bate» não foi escrito por quem olhou o diff.
Resolva o push ANTES de escrever o relatorio, e escreva o campo do push com o RESULTADO REAL — nunca «pendente» por antecipacao. Se ele ficar mesmo pendente, REABRA o relatorio e corrija quando resolver: o arquivo que afirma o falso e o que a proxima sessao le. Confira tambem que nenhum relatorio `.txt` ficou DENTRO do repo (`git status` o mostraria como nao rastreado): o lugar dele e a pasta-pai, e relatorio na raiz vira `??` que ninguem identifica. Verde: `add`, `commit` e `push` sem perguntar — e, se a WO declarar um **Proximo comando**, termine o relatorio com ele CRU e SOZINHO na ultima linha, sem frase de apresentacao (texto em volta esconde o comando). Vermelho: nao commite nem empurre — feche com MENU DE OPCOES pela ferramenta `AskUserQuestion`, com a recomendada em primeiro lugar e marcada `(Recomendado)`. **Nunca pergunte em prosa — e menu numerado escrito no corpo da mensagem TAMBEM e prosa**, porque obriga o dono a digitar a resposta em vez de clicar. Sem a ferramenta, caia no menu numerado em texto e DIGA que caiu no fallback. **O cartao serve para ESCOLHER, nao para DISPARAR:** ele nao contorna `disable-model-invocation`, entao nao o use para oferecer «rodar a skill agora» — medido duas vezes, isso acrescenta um passo sem tirar nenhum. Grave o MESMO relatório em `../AAMMDD-HHMM-code-<slug>-apply-<alvo>.txt` (pasta-pai do repo) — o ato é sempre `apply` nesta skill, e `<alvo>` é a WO aplicada (`wo0028`). Se a escrita for negada, diga e siga.
O `HHMM` do nome do relatório sai de `date +%y%m%d-%H%M`, rodado na hora — nunca de cabeça.
WO: $ARGUMENTS


*Gerado pelo Kit de Contexto Universal v1.138.0 — 2026-11-14 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
~~~

## Edicao 5 — `.claude/skills/wrap/SKILL.md` · fusao

Base: a skill do pacote v1.138.0. Acrescentadas as duas linhas vivas que o kit nao cobre — o `npm run
build` com a conferencia na tela, e a clausula de que curadoria que reescreve documento nao e trabalho
do Code. **Retirado** o passo «Mostre o `git diff`», que e a linha revogada em v1.104.0.
**Substituicao integral do arquivo.**

**Conteudo novo (arquivo inteiro):**

~~~
---
name: wrap
description: Encerra a tarefa — append em STATUS/DECISIONS, confere o git diff, commita e empurra. Use quando o usuário pedir /wrap ou para fechar o trabalho.
disable-model-invocation: true
---
ANTES de escrever qualquer coisa: abra o relatório que carrega o COMMIT MAIS NOVO em `../AAMMDD-HHMM-code-*.txt` — ordene por commit, não por nome nem por data do arquivo, porque relatório antigo que foi REABERTO tem data nova — e confira o que ele AFIRMA contra `git status` e `git log`. **Sobre MEDIÇÃO você não conclui: cita e aponta.** O `1b` compara commit e estado do git — coisas que o git responde. Achado numérico do relatório anterior (quantos bytes, quantos itens, qual chave) o git NÃO desmente: ou você reroda a medição e diz que rerodou, ou escreve «medido no relatório X, não reconferido aqui». Contradizer sem remedir é o modo de falha caro — o log do dia guarda o relatório ERRADO, e desempatar dois registros que se negam custa uma sessão e exige os dois relatórios em mãos, que é o que se perde. Confira também qualquer relatório anterior que tenha declarado PENDÊNCIA: ele é o que uma sessão futura vai ler, e o `1b` que só olha o mais recente deixa a mentira no disco. Divergência vira uma linha de correção no log do dia; conferência que passa não vira linha.
Encerre a tarefa: atualize `meta/STATUS.md` (append, não reescreva), acrescente `DEC-`/`FIX-` em `meta/DECISIONS.md` se houve decisão/bug,
e confira o `git diff` — a forma esperada, nada além. Mensagem de commit SEM acento.
Se houve mudança de código: rode `npm run build` e diga o que vale abrir e conferir na tela — caso feliz, borda e regressão provável. Este projeto não tem suíte de testes; o build sozinho não é a rede inteira.
**Antes do commit, conte a ESTRUTURA que você editou.** No `STATUS.md`, o bloco da sessão anterior tem de continuar no arquivo depois da sua edição — procure o título dele: mover tem duas metades, e a que some é sempre a de apagar. Estrutura que costuma duplicar (`<details>`, o bloco do topo do STATUS) tem contagem esperada — `grep -c` da abertura e do fechamento, um de cada. Aviso em prosa já falhou duas vezes seguidas; contagem não.
Se o commit toca `INSTRUCOES-DO-PROJETO.md`, meça os caracteres com `LC_ALL=C.UTF-8 wc -m` (sem o locale, `wc -m` conta bytes) e escreva o número no relatório, ao lado do teto do projeto (6900): teto que ninguém mede envelhece calado.
O `HHMM` do nome do relatório sai de `date +%y%m%d-%H%M`, rodado na hora — nunca de cabeça.
Ao mudar um número ou um estado no `STATUS.md` (contagem de testes/checagens, versão, «funciona até X»), procure o valor ANTIGO no arquivo INTEIRO e atualize todas as ocorrências — o cabeçalho não é o único lugar onde ele aparece, e a cópia esquecida no meio do texto passa a mentir.
Escreva o log do dia em `logs/AAAA-MM-DD.md` (formato em `meta/LOG-TEMPLATE.md`). Se o arquivo do dia NÃO existe, CRIE — não regenerar é uma coisa, não criar é outra. Cinco linhas escritas hoje valem mais que uma página reconstituída na semana que vem: só você viu o que aconteceu aqui.
Curadoria que REESCREVE documento (encolher, reordenar, mudar voz) não é trabalho do Code — reporte ao usuário para o chat cuidar.
Resolva o push ANTES de escrever o relatorio, e escreva o campo do push com o RESULTADO REAL — nunca «pendente» por antecipacao. Se ele ficar mesmo pendente, REABRA o relatorio e corrija quando resolver: o arquivo que afirma o falso e o que a proxima sessao le. Confira tambem que nenhum relatorio `.txt` ficou DENTRO do repo (`git status` o mostraria como nao rastreado): o lugar dele e a pasta-pai, e relatorio na raiz vira `??` que ninguem identifica. Verde: `add`, `commit` e `push` sem perguntar. Vermelho: nao commite nem empurre — feche com MENU DE OPCOES pela ferramenta `AskUserQuestion`, com a recomendada em primeiro lugar e marcada `(Recomendado)`. **Nunca pergunte em prosa — e menu numerado escrito no corpo da mensagem TAMBEM e prosa**, porque obriga o dono a digitar a resposta em vez de clicar. Sem a ferramenta, caia no menu numerado em texto e DIGA que caiu no fallback. **O cartao serve para ESCOLHER, nao para DISPARAR:** ele nao contorna `disable-model-invocation`, entao nao o use para oferecer «rodar a skill agora». Grave o relatório de trabalho em `../AAMMDD-HHMM-code-<slug>-wrap-<alvo>.txt` (pasta-pai do repo) — o ato é sempre `wrap` nesta skill, e `<alvo>` é a WO que fechou (`wo0028`) ou, sem WO, duas ou três palavras com hífen. Se a escrita for negada, diga e siga.


*Gerado pelo Kit de Contexto Universal v1.138.0 — 2026-11-14 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
~~~

---

## Depois de aplicar — conferencia antes do commit

Cada passo traz: **quem roda**, **como chega la**, e **qual pergunta o passo NAO responde**.

1. **JSON valido.**
   Quem roda: quem aplica. Como: `node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8')); console.log('ok')"` na raiz do repo.
   Nao responde: se as permissoes ja estao VALENDO nesta sessao do Code — so a proxima abertura dira.
2. **As tres correcoes entraram.**
   Quem roda: quem aplica. Como: `grep -c '"Write"' .claude/settings.json` → 1 e `grep -c additionalDirectories .claude/settings.json` → 1.
   Nao responde: se `../` e de fato gravavel — isso so o passo 5 mostra.
3. **Os quatro carimbos.**
   Quem roda: quem aplica. Como: `grep -rc "v1.138.0" .claude/skills/*/SKILL.md meta/workorders/_TEMPLATE.md` — os quatro arquivos devem responder >= 1.
   Nao responde: o carimbo do CEREBRO, que fica para a Fatia 3 e vai continuar dizendo v1.73.0.
4. **A linha revogada saiu da `wrap`.**
   Quem roda: quem aplica. Como: `grep -c "Mostre o .git diff" .claude/skills/wrap/SKILL.md` → **0**.
   Nao responde: as outras 42 ocorrencias de cadencia da Fatia 2 — elas continuam vivas de proposito.
5. **O relatorio chega na pasta-pai.**
   Quem roda: quem aplica, ao gravar o proprio relatorio desta WO.
   Nao responde: nada — se falhar, e o sinal de que o `settings.json` novo ainda nao esta valendo, e isso vai no relatorio em vez de ser contornado.

## Relatorio de aplicacao

Preencha os oito campos que a skill `apply-wo` nova pede. Se voce aplicou esta WO com a skill ANTIGA
(porque a nova so passa a valer depois), diga isso no relatorio — e o primeiro caso em que a skill que
executa e diferente da que o repo passa a ter.

## Commit — blocos separados, mensagem SEM acento

A propria WO entra no `git add`.

```
git add .claude/settings.json .claude/skills/ meta/workorders/
git commit -m "chore(claude): corrige settings.json e instala as skills do kit v1.138"
git push
```
