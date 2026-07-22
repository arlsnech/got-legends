---
name: apply-spec
description: Aplica uma spec de meta/specs/ ao repo — localiza cada ancora exatamente, substitui, para se nao achar, e fecha com commit e push. Use quando o usuario pedir /apply-spec ou para aplicar uma spec nomeada.
disable-model-invocation: true
---
Leia o arquivo de spec indicado em `meta/specs/` e execute-o.

1. Localize cada ancora EXATAMENTE. Se nao achar UMA que seja, PARE e reporte qual falhou — nao chute um lugar proximo, nao aplique as outras pela metade.
2. Nao toque em nada fora das edicoes nomeadas na spec.
3. Rode `git diff` e confira que a forma bateu com o esperado.
4. Se a spec tocou codigo (fora de `meta/`), rode `npm run build` antes de commitar.
5. Feche o ciclo sem esperar novo pedido: `git add` incluindo o PROPRIO arquivo da spec, depois `git commit` (Conventional Commits, mensagem SEM acento) e `git push`.
6. Nao apague a spec aplicada — ela e artefato versionado.

Spec: $ARGUMENTS
