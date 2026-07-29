# spec0008 — Extração retroativa do `GOT_Build_-_Joker.md`

**Data:** 2026-07-23 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner`

**Por que esta spec existe:** primeira sessão da extração retroativa (DEC-011). O `meta/legacy/GOT_Build_-_Joker.md` (15 KB, 6 blocos, 3 prompts) foi lido por inteiro e conferido contra o código de hoje. Resultado: **os três pedidos já estão aplicados no código** — mas dois deles **não existem em nenhum registro do projeto**. Esta spec grava o que sobreviveu ao crivo e remove o arquivo, cujo conteúdo passa a viver nos `meta/` e no histórico do Git.

**Achado principal:** o `FIX-006` registra um bug nas *mesmas linhas* do `randomBuild` (prop de Magistral saindo abaixo do máximo), mas é um bug **diferente** do que o Joker documenta (prop de Magistral não sendo sorteada **de todo**). Quem ler o `DECISIONS.md` hoje conclui que a segunda história nunca aconteceu.

**Regras de execução:**
- Nenhum arquivo de código (`src/`) é tocado → **não precisa de `npm run build`**; a rede é o `git diff`.
- Nenhum `--force`, `rebase` ou `reset --hard`.
- A única remoção autorizada é a da Parte 8, e só depois de as Partes 2–7 estarem no `git diff`.
- Se **uma** âncora que seja não for encontrada exatamente: **PARE e reporte qual falhou.** Não aplique pela metade.

---

## Parte 1 — Levantamento

Rode e reporte a saída antes de aplicar qualquer coisa:

```
git branch --show-current
git status
ls meta/legacy/
```

Responda explicitamente:
1. Estamos na `v2-planner`? Se não, **PARE**.
2. `meta/legacy/GOT_Build_-_Joker.md` existe? Se **não existir**, aplique as Partes 2–7 e 9 normalmente e apenas reporte a ausência na Parte 8 — o conteúdo dele já está nesta spec.
3. Há algo modificado e não commitado? Liste.

---

## Parte 2 — `meta/DECISIONS.md`

**Âncora** (último parágrafo do arquivo, dentro de DEC-012):

```
**Regra que fica:** artefato do projeto que só existe fora do repositório é artefato em risco. Se importa, entra no Git; se pesa, sai do flatdrop. As duas coisas são independentes.
```

**Substituir por** (a âncora, seguida do conteúdo novo):

```
**Regra que fica:** artefato do projeto que só existe fora do repositório é artefato em risco. Se importa, entra no Git; se pesa, sai do flatdrop. As duas coisas são independentes.

---

## FIX-007 — Props de item Magistral não eram sorteadas na build aleatória

**Data do registro:** 2026-07-23 · **Data da correção:** desconhecida (anterior à adoção do KCM) · **Gravidade:** alta

> **Registro retroativo.** O conserto **já está no código** — foi conferido em `src/logic.js` nesta data. O que faltava era o registro. A fonte é o `meta/legacy/GOT_Build_-_Joker.md`, blocos 1 e 2, extraído e removido pela `spec0008`.

### Sintoma
Ao gerar build com o botão 🎲, itens Magistrais vinham **sem nenhuma propriedade P1/P2**. As vantagens (perks) eram sorteadas normalmente, e itens comuns recebiam props normalmente — só o Magistral saía vazio.

### Causa raiz
Os filtros de props em `randomBuild()` carregavam a condição `&& !chosen.leg`:

```js
const p1opts = effectiveItem.props.filter(p => p.sl.includes('P1') && !chosen.leg);
const p2opts = effectiveItem.props.filter(p =>
  p.sl.includes('P2') && !chosen.leg && !(p1 && p.sk === p1.sk)
);
```

Para item Magistral, `chosen.leg === true` → `!chosen.leg` é `false` → o filtro devolve lista **vazia** → nenhuma prop é escolhida. Os perks nunca tiveram essa condição, por isso funcionavam.

### Correção
Remoção de `!chosen.leg` dos dois filtros em `src/logic.js`. A guarda `!(p1 && p.sk === p1.sk)`, que impede P1 e P2 compartilharem o mesmo `sk`, foi preservada — é regra válida do jogo. Nada foi tocado em `App.jsx` nem em `data.js`.

### Relação com o FIX-006 — leia os dois juntos
São **dois bugs distintos nas mesmas linhas**, em momentos diferentes:

| | FIX-007 (este) | FIX-006 |
|---|---|---|
| Sintoma | Magistral sem prop nenhuma | Magistral com prop **abaixo do máximo** |
| Causa | filtro `!chosen.leg` zerava a lista | `randomInRange` ignorava `chosen.leg` |
| Ordem | veio antes | só apareceu **depois** que o FIX-007 fez a prop existir |

O FIX-006 só podia ser observado depois do FIX-007: enquanto não havia prop nenhuma, não havia valor errado para reparar. Quem for mexer em `randomBuild` precisa manter as duas correções — elas se sobrepõem no mesmo trecho.

### Estado hoje
Conferido em `src/logic.js` (2026-07-23): os filtros estão limpos e o valor é travado em `p.mx` para item Magistral. As duas correções coexistem.

---

## DEC-013 — Troca de classe propaga a técnica Magistral equivalente, em vez de remover o Magistral excedente

**Data do registro:** 2026-07-23 · **Data da decisão:** desconhecida (anterior à adoção do KCM) · **Status:** aceita, em vigor no código

> **Registro retroativo.** O comportamento **já está implementado** em `changeClass` (`src/logic.js`) e o `meta/STATUS.md` já o lista como funcionando. O que faltava era o **porquê** — e, principalmente, a alternativa que foi rejeitada. Fonte: `meta/legacy/GOT_Build_-_Joker.md`, blocos 3 a 6.

### Contexto
Técnica Magistral concede `+1 legSlots`. Com ela equipada, o jogador pode usar 2 itens Magistrais, e a UI então **trava** a técnica: desequipá-la deixaria o build inválido.

Ao trocar de classe, `changeClass` preserva os itens compatíveis mas zera as técnicas (são da classe antiga). Resultado antigo: nova classe, 0 técnicas, limite base 1, **2 Magistrais equipados** — estado inválido, e sem nada travado na tela, porque `canChangeTech` só protege técnica já selecionada.

### Alternativa rejeitada — remover o Magistral excedente
A primeira proposta foi contar os Magistrais preservados e esvaziar os que passassem de `BASE_LEG_SLOTS`. Funcionava e era pequena. **Foi recusada pelo autor:** trocar de classe passaria a destruir equipamento montado, em silêncio, para consertar um problema que é de técnica, não de item.

### Decisão
Ao trocar de classe, para cada tier: se a técnica selecionada na classe antiga concedia `legSlots`, a técnica equivalente da **nova** classe no **mesmo tier** já entra equipada. Técnica não-Magistral continua sendo desequipada, como sempre.

Consequências, na ordem em que importam: o build permanece válido sem perder item; a gestão do limite fica com o jogador, que é quem sabe o que quer manter; e o caso em que o jogador tem folga (2 técnicas Magistrais e só 2 itens) não é tratado como erro — ele simplesmente continua com folga.

### Identificação de "técnica Magistral"
Não há flag própria. A regra é `tech.fx.some(fx => fx.s === 'legSlots')` — a mesma que `countLegBonus` e `checkLegendaryLimit` já usavam. Deliberado: uma flag nova seria uma segunda fonte de verdade sobre o mesmo fato.

### Invariante de que esta decisão depende — **conferida em 2026-07-23**
A correspondência "mesmo tier na outra classe" só fecha porque as quatro classes têm técnica com `legSlots` **exatamente nos tiers I e III**:

| Classe | Tier I | Tier II | Tier III |
|---|---|---|---|
| Samurai | `leg_sam_i` | — | `leg_sam_iii` |
| Caçadora | `leg_hun_i` | — | `leg_hun_iii` |
| Ronin | `leg_ron_i` | — | `leg_ron_iii` |
| Assassino | `leg_ass_i` | — | `leg_ass_iii` |

Nenhum tier fica órfão, então o estado inválido não volta por esse caminho. **A guarda é essa tabela, não o código:** se `data.js` algum dia ganhar uma técnica `legSlots` num tier assimétrico entre classes, `newLegTech` vira `undefined`, nada é equipado e o build inválido reaparece — sem erro no console. Quem mexer nas técnicas de `data.js` precisa reler este quadro.
```

---

## Parte 3 — `meta/CONTEXT.md`

**Âncora** (item 7 da seção «Armadilhas Conhecidas», último da lista):

```
7. **Amuletos magistrais com `classBinding`** — as props e perks de classe são injetados em runtime por `resolveCharmClassBinding`. Nunca leia as props do item direto do `GEAR` — sempre use `getEffectiveCharm(itemId, linkedClass)`.
```

**Substituir por:**

```
7. **Amuletos magistrais com `classBinding`** — as props e perks de classe são injetados em runtime por `resolveCharmClassBinding`. Nunca leia as props do item direto do `GEAR` — sempre use `getEffectiveCharm(itemId, linkedClass)`.

8. **Técnica Magistral não tem flag própria** — é identificada por `tech.fx.some(fx => fx.s === 'legSlots')`, em `countLegBonus`, `checkLegendaryLimit` e `changeClass`. E ela existe **só nos tiers I e III**, nas quatro classes: é dessa simetria que `changeClass` depende para propagar a técnica ao trocar de classe. Acrescentar uma técnica `legSlots` num tier que só uma classe tenha quebra a troca de classe **em silêncio** — sem erro, apenas com um build acima do limite. Ver DEC-013.
```

---

## Parte 4 — `meta/GLOSSARY.md`

**Âncora** (primeira linha da seção «Conceitos do jogo»):

```
- **Magistral** — item Legendary; nível máximo de qualidade de equipamento. Em EN: *Legendary*.
```

**Substituir por:**

```
- **Magistral** — item Legendary; nível máximo de qualidade de equipamento. Em EN: *Legendary*.
- **Técnica Magistral** — vantagem de classe que concede `+1 legSlots`, elevando o limite de itens Magistrais equipáveis. Existe nos tiers I e III das quatro classes. Não tem flag própria: é reconhecida pelo efeito `legSlots` no array `fx`. Ver DEC-013.
```

---

## Parte 5 — `meta/IDEAS.md`

### 5.1 — Fila de leitura

**Âncora** (duas linhas consecutivas da tabela):

```
| `GOT_Build_-_Joker.md` | 15 KB | ⏳ próximo |
| `GOT_Build_-_Alex.md` | 61 KB | ⏳ |
```

**Substituir por:**

```
| `GOT_Build_-_Joker.md` | 15 KB | ✅ extraído em 2026-07-23 (spec0008) — arquivo removido |
| `GOT_Build_-_Alex.md` | 61 KB | ⏳ próximo |
```

### 5.2 — O que o Joker rendeu

**Âncora** (parágrafo abaixo da tabela):

```
**Critério:** não são fatos. São pedidos históricos, muitos já atendidos, alguns contraditórios entre si, com cronologia desconhecida. Nada entra nos `meta/` sem conferência contra o código atual.
```

**Substituir por:**

```
**Critério:** não são fatos. São pedidos históricos, muitos já atendidos, alguns contraditórios entre si, com cronologia desconhecida. Nada entra nos `meta/` sem conferência contra o código atual.

### Já extraído do `GOT_Build_-_Joker.md` (2026-07-23) — **não reabrir**
Os três pedidos do arquivo já estão no código; nada dele ficou aberto. Viraram FIX-007 (props de Magistral não sorteadas no 🎲) e DEC-013 (troca de classe propaga a técnica Magistral). O bloco 4 contém uma correção **rejeitada pelo autor** — remover o Magistral excedente ao trocar de classe: se ela reaparecer em algum guia antigo, é ruído, não pendência.

**Calibração do critério, para os próximos arquivos:** o valor do Joker não foi encontrar código faltando — foi encontrar **código sem registro**. Dois consertos em vigor há semanas não existiam em nenhum `meta/`, e um deles estava a um passo de ser lido como já coberto pelo FIX-006. Ler o arquivo perguntando "isso está no código?" acha pouco; perguntar "isso está *registrado*?" acha o que interessa.
```

### 5.3 — Feedback ao kit

**Âncora** (último item da leva de 2026-07-23, fim do arquivo):

```
- O kit não diz em lugar nenhum que **uma entrada de FIX não deve ser criada a partir de código ainda não aplicado**. Este projeto perdeu um mês com FIX-005 registrado como resolvido enquanto o conserto vivia só num guia. A regra deveria estar no CEREBRO, junto das regras de higiene.
```

**Substituir por:**

```
- O kit não diz em lugar nenhum que **uma entrada de FIX não deve ser criada a partir de código ainda não aplicado**. Este projeto perdeu um mês com FIX-005 registrado como resolvido enquanto o conserto vivia só num guia. A regra deveria estar no CEREBRO, junto das regras de higiene.
- *(2026-07-23 — FlatDrop, bug de comportamento)* **A reinclusão com `!` não funciona quando a pasta inteira está ignorada.** A `spec0007` escreveu `meta/legacy/` no `.flatdropignore` e recomendou reincluir um arquivo com `!meta/legacy/<arquivo>`. A recomendação está **errada**, e a sintaxe `.gitignore` explica por quê: *não é possível reincluir um arquivo se um diretório-pai dele estiver excluído* — o motor nem chega a avaliar os arquivos de dentro da pasta podada. Não é bug do FlatDrop; é uma regra da sintaxe que ele herda. **O que o FlatDrop poderia fazer:** avisar quando um `!` for anulado por uma exclusão de pasta, em vez de ignorá-lo em silêncio — foi exatamente o silêncio que custou tempo aqui. **Contorno adotado:** enumerar os arquivos legados um a um, em vez da pasta, e comentar a linha do que se quer no mount.
- *(2026-07-23 — FlatDrop, sugestão)* O bloco gerenciado `# >>> flatdrop-editor … # <<<` fica **no fim** do arquivo, e em `.gitignore` **o último padrão que casa é o que vale**. Toda regra manual escrita acima dele pode ser anulada pelo bloco, sem aviso. Vale documentar essa precedência no próprio cabeçalho do bloco, ou colocá-lo no topo.
```

---

## Parte 6 — `meta/STATUS.md`

**Âncora** (último parágrafo do arquivo):

```
Há um `HANDOFF-BRIEF.md` gerado para arrancar a próxima conversa. Ele é atalho, não memória — **este arquivo e os demais `meta/` continuam sendo a fonte de verdade.**
```

**Substituir por:**

```
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
```

---

## Parte 7 — `.flatdropignore`

> Arquivo com quebras de linha **CRLF**. Preserve-as.
> O bloco `# >>> flatdrop-editor … # <<<` é gerado pela GUI do FlatDrop. Editá-lo à mão é seguro **desde que a GUI não rode em seguida** — se ela rodar, reescreve o bloco a partir das caixas marcadas. Se o usuário preferir, as duas edições abaixo podem ser feitas pela GUI; o efeito é o mesmo.

### 7.1 — Corrigir a orientação errada

**Âncora** — a linha inteira que começa com:

```
# Para trabalhar um deles, reinclua pontualmente: !meta/legacy/<arquivo>
```

(ela é longa e termina com texto solto do usuário sobre o `!` não funcionar). **Substitua a linha inteira** por estas três:

```
# ATENCAO: "!meta/legacy/<arquivo>" NAO funciona. A sintaxe .gitignore nao reinclui
# arquivo cujo diretorio-pai esteja excluido. Por isso os legados sao enumerados um a
# um no bloco flatdrop-editor abaixo: para subir um deles, comente a linha dele la.
```

### 7.2 — Liberar o próximo arquivo da fila

Dentro do bloco `# >>> flatdrop-editor`, **remova a linha**:

```
meta/legacy/GOT_Build_-_Alex.md
```

Com ela fora, o `GOT_Build_-_Alex.md` volta a subir no próximo pacote FlatDrop — que é a matéria-prima da próxima sessão.

### 7.3 — Não mexer no resto

As linhas de `GOT_Build.md`, `GOT_Build_-_Origem.md`, `GOT_Build_-_TOhno.md`, dos dois `GUIA_*` e do `README.md` **ficam como estão**. `meta/legacy/GOT_Build_-_Joker.md` não tem linha no bloco e não precisa ganhar uma — o arquivo deixa de existir na Parte 8.

---

## Parte 8 — Remover o arquivo extraído

**Só depois de as Partes 2 a 7 aparecerem no `git diff`.**

```
git rm meta/legacy/GOT_Build_-_Joker.md
```

Ele continua recuperável pelo histórico do Git — é para isso que a DEC-012 o versionou antes de qualquer leitura.

---

## Parte 9 — `logs/2026-07-23.md`

**Se o arquivo já existir** (a sessão anterior encerrou nesta mesma data), **anexe** o conteúdo abaixo ao final dele, precedido de uma linha `---`. **Se não existir**, crie-o com esse conteúdo, acrescentando no topo a linha `# Log — 2026-07-23`.

```markdown
## Sessão 2 — Extração retroativa 1/4: `GOT_Build_-_Joker.md`

### Objetivo da sessão
Executar a primeira sessão da extração retroativa (DEC-011): ler o menor dos arquivos legados, separar o que é pedido aberto, ideia, decisão com motivo e ruído, e entregar uma spec que anexe o resultado aos `meta/`.

### Feito
- Lido por inteiro `meta/legacy/GOT_Build_-_Joker.md` (6 blocos, 3 prompts, 15 KB).
- Cada um dos três pedidos conferido contra o código atual (`src/logic.js`, `src/data.js`, `src/App.jsx`).
- Verificada a invariante das técnicas `legSlots` em `data.js`: tiers I e III, nas quatro classes.
- Verificado que `checkLegendaryLimit` lê `leg` pelo item base e que `leg: true` sobrevive ao spread de `resolveCharmClassBinding` — nenhum problema no amuleto com `classBinding`.
- Diagnosticada a falha do `!` no `.flatdropignore`.
- Entregue a `spec0008`.

### Specs entregues / aplicadas
- `260723-spec0008-extracao-joker.md` — registra FIX-007 e DEC-013, acrescenta armadilha 8 ao CONTEXT, termo novo ao GLOSSARY, três itens de feedback ao kit, atualiza a fila de extração e o STATUS, corrige o `.flatdropignore` e remove o arquivo extraído.

### Decisões
- **DEC-013** — troca de classe propaga a técnica Magistral equivalente. Registro retroativo: o código já fazia isso; faltava o porquê e, sobretudo, a alternativa rejeitada.

### Bugs
- **FIX-007** — props de Magistral não sorteadas no 🎲. Registro retroativo; conserto já em vigor. Confundível com o FIX-006, que vive nas mesmas linhas.

### Aprendizados / armadilhas
- **A técnica Magistral não tem flag** — é o efeito `legSlots` no `fx`. E a simetria tier I / tier III entre as quatro classes é o que sustenta `changeClass`. Virou armadilha 8 no `CONTEXT.md`.
- **`!` em arquivo de ignore não vence exclusão de diretório-pai.** A DEC-012 recomendava uma coisa que a sintaxe não permite. Contorno: enumerar arquivo a arquivo.
- **Bloco gerenciado no fim do arquivo tem a última palavra.** Regra manual escrita acima do `# >>> flatdrop-editor` pode ser anulada sem aviso.
- **Extração é caça a registro, não a código faltando.** Os três pedidos do Joker estavam implementados; dois não existiam em nenhum `meta/`.

### Onde parei
`spec0008` entregue e aplicada. Arquivo do Joker removido da árvore, preservado no histórico. Nenhuma mudança de código, nenhum build necessário.

### Próximos passos
1. Regerar o pacote FlatDrop com o `GOT_Build_-_Alex.md` liberado e abrir a extração 2/4.
2. Extrações 3/4 (`Origem`, 197 KB) e 4/4 (`TOhno`, 267 KB) — antes destas, tirar do mount os snapshots `src/v1..v4`, que hoje ocupam metade do pacote.
3. Fase 3 (`generateBuildImage`), depois da extração e informada por ela.
```

---

## Parte 10 — Fechamento

Rode `git diff` e confira que a forma bateu com o esperado. Nenhum arquivo de `src/` deve aparecer — se aparecer, **PARE**.

Depois feche o ciclo, incluindo **esta spec** no `add`:

```
git add meta/DECISIONS.md meta/CONTEXT.md meta/GLOSSARY.md meta/IDEAS.md meta/STATUS.md .flatdropignore logs/2026-07-23.md meta/specs/260723-spec0008-extracao-joker.md
git commit -m "docs(meta): extrai o legado do Joker e registra FIX-007 e DEC-013"
git push
```

A remoção do `meta/legacy/GOT_Build_-_Joker.md` já entra pelo `git rm` da Parte 8.
