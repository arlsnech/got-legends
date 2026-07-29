# LOG-TEMPLATE.md — Formato do Log de Sessão

> **Referência fixa.** Este arquivo é o MOLDE — não é substituído pelo conteúdo preenchido.
> Ao final de cada sessão, o assistente entrega um arquivo novo `logs/AAAA-MM-DD.md` preenchido neste formato.
> Os logs vivem em `logs/` **no Git** (NÃO no Projeto do Claude — o `.flatdropignore` os mantém fora do mount) e são lidos só sob demanda, quando você precisar recuperar o detalhe de uma sessão antiga.

---

# Log — AAAA-MM-DD

## Objetivo da sessão
[O que se pretendia fazer ao começar.]

## Feito
- [Mudanças concretas: arquivos tocados, funções criadas, bugs resolvidos.]

## Análises abertas / decididas
- [`AAMMDD-ANALISE-<tema>.md` — o problema que ela levanta e em que Status ficou. Se foi decidida, qual DEC registrou o desfecho.]

## Specs de feature entregues
- [`AAMMDD-<nome>.md` em `meta/specs/` — o que a feature promete e quais critérios de aceite ficaram escritos.]

## WOs entregues / aplicadas
- [`AAMMDD-woNNNN-desc.md` — o que ela fez, e se já foi aplicada pelo Claude Code ou está aguardando. Âncora que falhou, se houve.]

## Decisões
- [Decisões tomadas → quais viraram DEC-N em DECISIONS.md.]

## Bugs
- [Bugs encontrados/resolvidos → quais viraram FIX-N em DECISIONS.md.]

## Aprendizados / armadilhas
- [O que descobrimos que vale virar armadilha em CONTEXT.md, ou entrada em «Correções de processo» no IDEAS.]

## Onde parei
[Estado exato ao encerrar + próximo passo óbvio. Alimenta o «Última Sessão» do STATUS.]

## Próximos passos
- [Ações concretas para a próxima sessão, em ordem de prioridade.]
