---
name: wrap
description: Encerra a tarefa — append em STATUS/DECISIONS, build se houve codigo, git diff, commit e push. Use quando o usuario pedir /wrap ou para fechar a sessao de trabalho.
disable-model-invocation: true
---
Encerre a tarefa:

1. Atualize `meta/STATUS.md` por APPEND (nao reescreva o arquivo): o que passou a funcionar, o que ficou pendente, e o bloco «Ultima Sessao» com a data de hoje e o proximo passo obvio.
2. Acrescente `DEC-` / `FIX-` em `meta/DECISIONS.md` se houve decisao de arquitetura ou bug grave resolvido.
3. Se houve mudanca de codigo: rode `npm run build` e diga o que vale abrir e conferir na tela (nao ha suite de testes neste projeto).
4. Mostre o `git diff`.
5. Commit e push: `git add` dos arquivos tocados, `git commit` em Conventional Commits com mensagem SEM acento, `git push`.

Curadoria que REESCREVE documento (encolher, reordenar, mudar voz) nao e trabalho do Code — reporte ao usuario para o chat cuidar.
