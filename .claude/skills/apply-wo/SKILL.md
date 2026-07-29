---
name: apply-wo
description: Aplica uma WO de meta/workorders/ ao repo — localiza cada ancora exatamente, substitui, para se nao achar, e fecha com commit e push. Use quando o usuario pedir /apply-wo ou para aplicar uma WO nomeada.
disable-model-invocation: true
---
Leia o arquivo de WO indicado em `meta/workorders/` e execute-o.

1. Localize cada ancora EXATAMENTE. Se nao achar UMA que seja, PARE e reporte qual falhou — nao chute um lugar proximo, nao aplique as outras pela metade.
2. Nao toque em nada fora das edicoes nomeadas na WO.
3. Se a WO contiver um portao de diagnostico ("rode este teste; se o resultado for X, PARE"), obedeca ao portao antes de editar qualquer coisa. Hipotese de causa nao e permissao para corrigir.
4. Rode `git diff` e confira que a forma bateu com o esperado.
5. Se a WO tocou codigo (fora de `meta/`), rode `npm run build` antes de commitar.
6. Feche o ciclo sem esperar novo pedido: `git add` incluindo o PROPRIO arquivo da WO, depois `git commit` (Conventional Commits, mensagem SEM acento) e `git push`.
7. Nao apague a WO aplicada — ela e artefato versionado.

Ao terminar, RELATE o trabalho: o que foi feito, o que voce encontrou que foge do que a WO pedia, os arquivos tocados, o resultado do build ou da conferencia, e o commit. Nao substitua o relatorio pelo bloco de fecho de turno do `meta/CEREBRO.md` — aquele e da raia de planejamento, e trocar um pelo outro perde a informacao que so quem executou tem.

WO: $ARGUMENTS
