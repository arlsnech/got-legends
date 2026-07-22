# LOG-TEMPLATE.md — Formato do Log de Sessão

> **Referência fixa.** Este arquivo é o MOLDE — não é substituído pelo conteúdo preenchido.
> Ao final de cada sessão, o assistente entrega um arquivo novo `logs/AAAA-MM-DD.md` preenchido neste formato.
> Os logs vivem em `logs/` **no Git** (NÃO no Projeto do Claude — o `.flatdropignore` os mantém fora do mount) e são lidos só sob demanda, quando você precisar recuperar o detalhe de uma sessão antiga.

---

# Log — AAAA-MM-DD

## Objetivo da sessão
[O que se pretendia fazer ao começar.]

## Feito
- [Mudanças concretas: arquivos tocados, funções criadas, bugs resolvidos, guias entregues.]

## Guias entregues
- [Nome do arquivo `.md` de guia, se houver — diferente do log: são instruções de aplicação, não o próprio trabalho. Se virou spec, anote o nome da spec em `meta/specs/`.]

## Specs entregues / aplicadas
- [`AAMMDD-specNNNN-desc.md` — o que ela fez, e se já foi aplicada pelo Claude Code ou está aguardando.]

## Decisões
- [Decisões tomadas → quais viraram DEC-N em DECISIONS.md.]

## Bugs
- [Bugs encontrados/resolvidos → quais viraram FIX-N em DECISIONS.md.]

## Aprendizados / armadilhas
- [O que descobrimos que vale virar armadilha em CONTEXT.md.]

## Onde parei
[Estado exato ao encerrar + próximo passo óbvio. Alimenta o «Última Sessão» do STATUS.]

## Próximos passos
- [Ações concretas para a próxima sessão, em ordem de prioridade.]
