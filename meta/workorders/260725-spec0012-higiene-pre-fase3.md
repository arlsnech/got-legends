# spec0012 — Higiene pré-Fase 3: código morto, imports órfãos e correções de registro

**Data:** 2026-07-25 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner`

**Por que esta spec existe:** a extração retroativa acabou e a Fase 3 é o próximo passo — e ela vai mexer pesado no `App.jsx`. Limpar antes é mais barato que limpar depois, e o mount atual tem exatamente o que essa limpeza precisa (`App.jsx`, `logic.js`, `icons.js`, `data.js`) e nada do que a Fase 3 precisa (os guias). Então esta é a sessão certa para a higiene.

**O que foi verificado e o que mudou de estado:**
- Os **três itens de ícone do backlog** foram conferidos por cruzamento programático e estão **todos em ordem** — 50 itens de `GEAR` ↔ 50 chaves de `GEAR_ICON`, 60 chaves de `TECH_ICON` ↔ 60 ids de técnica/habilidade, **zero órfãos nos dois sentidos**. Eram resquícios da época em que o `icons.js` foi escrito. Fecham sem tocar em código.
- O código morto do vínculo de classe (DEC-015) foi confirmado e **traz companhia**: o `App.jsx` importa **nove** símbolos que não usa.
- Um deles revelou algo maior — ver a Parte 8, armadilha 14. Não é limpeza; é armadilha ativa em `logic.js`.

**Esta spec toca código** → rode `npm run build` e siga a conferência da Parte 7. **Dois commits separados:** código primeiro, documentação depois.

**Regras de execução:**
- Nenhum `--force`, `rebase` ou `reset --hard`.
- Se **uma** âncora que seja não for encontrada exatamente: **PARE e reporte qual falhou.**
- Nenhuma remoção de arquivo nesta spec.

---

## Parte 1 — Levantamento

```
git branch --show-current
git status
```

1. Estamos na `v2-planner`? Se não, **PARE**.
2. Há algo modificado e não commitado? Liste.

---

## Parte 2 — `src/App.jsx`: imports órfãos

**Contexto** (para o executor entender, não para copiar): nove símbolos importados aparecem **uma única vez** no arquivo — na própria linha do import. Foram conferidos um a um. Três grupos, com histórias diferentes:

- `setCharmLinkedClass` — resíduo da DEC-015; sai junto com o `onLinkedClass` da Parte 3.
- `BASE_HP`, `BASE_RESOLVE`, `BASE_LEG_SLOTS`, `GEAR_ICON`, `TECH_ICON` — resíduo puro. Os valores chegam por `stats`, e os ícones por `getGearIconUrl` / `getTechIconUrl`.
- `selectTech`, `selectAbility`, `getAvailableProps`, `getAvailablePerks` — **estes quatro têm equivalente reimplementado inline no `App.jsx`.** O import some aqui, mas a duplicação em si **não é tocada nesta spec**: dois dos casos são duplicação removível e dois são necessários por causa do amuleto efetivo. Ver a Parte 8 (armadilha 14) e o backlog da Parte 10.

### 2.1 — Import de `./icons.js`

**Âncora:**

```
import { GEAR_ICON, TECH_ICON, CLASS_ICON, CLASS_TECH_FALLBACK, LOGO_URL, getGearIconUrl, getTechIconUrl } from './icons.js'
```

**Substituir por:**

```
import { CLASS_ICON, CLASS_TECH_FALLBACK, LOGO_URL, getGearIconUrl, getTechIconUrl } from './icons.js'
```

### 2.2 — Import de `./logic.js`

**Âncora** (o bloco inteiro, da abertura ao `from`):

```
import {
  createEmptyBuild, computeStats,
  selectTech, selectAbility, selectItem, selectProp,
  setPropValue, selectPerk, setCharmLinkedClass,
  checkLegendaryLimit, getGearListForClass, getAvailableProps, getRequiredPerkId,
  getAvailablePerks, getEffectiveCharm, getStatGroups, isStatChanged,
  getClass, getItem,
  formatStatValue, formatPropRange, propValueForDisplay,
  propValueFromDisplay, formatCd,
  encodeBuild, decodeBuild, serializeBuild, deserializeBuild,
  changeClass, randomBuild,
  LABELS_PT, LABELS_EN,
  BASE_HP, BASE_RESOLVE, BASE_LEG_SLOTS,
} from './logic.js'
```

**Substituir por:**

```
import {
  createEmptyBuild, computeStats,
  selectItem, selectProp,
  setPropValue, selectPerk,
  checkLegendaryLimit, getGearListForClass, getRequiredPerkId,
  getEffectiveCharm, getStatGroups, isStatChanged,
  getClass, getItem,
  formatStatValue, formatPropRange, propValueForDisplay,
  propValueFromDisplay, formatCd,
  encodeBuild, decodeBuild, serializeBuild, deserializeBuild,
  changeClass, randomBuild,
  LABELS_PT, LABELS_EN,
} from './logic.js'
```

---

## Parte 3 — `src/App.jsx`: remover `onLinkedClass`

Função declarada e nunca chamada — resíduo da remoção do seletor de classe vinculada (DEC-015).

> **Não confundir:** o que sai é a função de **troca**. O campo `linkedClass` do estado **fica** e continua sendo lido logo acima, no `useMemo` que resolve o amuleto efetivo. Se o `git diff` mostrar `linkedClass` sumindo de qualquer outro lugar, **PARE**.

**Âncora:**

```
  const onLinkedClass = (cls) => {
    setBuild(prev => setCharmLinkedClass(prev, cls))
  }

  // Ícone do item atual (para compact e full)
```

**Substituir por:**

```
  // Ícone do item atual (para compact e full)
```

---

## Parte 4 — `src/logic.js`: remover `setCharmLinkedClass`

Sem consumidor depois da Parte 3. Segue recuperável pelo histórico do Git.

**Âncora** (a docstring, a função e o início da função seguinte):

```
/**
 * Define a classe vinculada de um amuleto magistral.
 * Limpa P1, P2 (as opções disponíveis mudam com a classe).
 *
 * @param {Object} build
 * @param {string} linkedClass
 * @returns {Object} novo build
 */
export function setCharmLinkedClass(build, linkedClass) {
  const slot = build.gear.charm;
  return {
    ...build,
    gear: {
      ...build.gear,
      charm: {
        ...emptySlot(),
        itemId:      slot.itemId,
        linkedClass: linkedClass,
      },
    },
  };
}

/**
 * Seleciona a variante do Sopro de Izanami (Ronin).
 */
```

**Substituir por:**

```
/**
 * Seleciona a variante do Sopro de Izanami (Ronin).
 */
```

---

## Parte 5 — `src/icons.js`: comentário obsoleto

O arquivo `half-bow` já foi renomeado para `shortbow` — o `IDEAS.md` registra isso como feito. O comentário manda fazer algo que já está feito, e comentário que mente é pior que comentário nenhum.

**Âncora:**

```
  arco_curto:            G + 'shortbow.svg',   // renomeie o arquivo para shortbow.svg
```

**Substituir por:**

```
  arco_curto:            G + 'shortbow.svg',
```

> O bloco de comentário `⚠️ Se algum ícone não aparecer, adicione o ID correto aqui` **fica**: é orientação de diagnóstico, ainda válida.

---

## Parte 6 — Nada mais em `src/`

Nenhum outro arquivo de código é tocado. `data.js` não muda nesta spec.

---

## Parte 7 — Build e conferência

Rode `npm run build`. Se falhar, **PARE** — import removido a mais aparece aqui.

Depois suba o dev server e confira, **nesta ordem**:

1. **Amuleto Magistral com `classBinding`** (ex.: um amuleto magistral qualquer, com uma classe ativa) → os props e perks **de classe** continuam aparecendo nas listas de P1/P2 e Vantagem. É o teste que importa: prova que `getEffectiveCharm` e o `linkedClass` do estado sobreviveram à limpeza.
2. **Trocar de classe com esse amuleto equipado** → os props de classe **trocam** junto. Prova que o `changeClass` continua atualizando o `linkedClass`.
3. **Selecionar e trocar técnicas** nos três tiers → funciona normalmente, e o bloqueio por limite de Magistrais continua travando. Cobre a remoção do import de `selectTech`.
4. **Habilidade de classe** → clicar seleciona, clicar de novo desmarca. Cobre `selectAbility`.
5. **P1 e P2 de qualquer equipamento** → escolher uma prop em P1 remove da lista de P2 as que compartilham o mesmo `sk`. Cobre `getAvailableProps`.
6. **Vantagem I e II** → a escolhida em uma não aparece na outra. Cobre `getAvailablePerks`.
7. **Ícones** — de gear, de técnica, de classe e o da aba de builds salvas: todos ainda carregam. Cobre `GEAR_ICON` / `TECH_ICON`.
8. **HP, Determinação e contador de Magistrais** → valores corretos. Cobre `BASE_HP` / `BASE_RESOLVE` / `BASE_LEG_SLOTS`.
9. **Console do navegador limpo** — nenhum erro de referência.

Se todos passarem, faça o **commit de código**:

```
git add src/App.jsx src/logic.js src/icons.js
git commit -m "refactor(app): remove codigo morto do vinculo de classe e imports orfaos"
```

Não faça `push` ainda.

---

## Parte 8 — `meta/CONTEXT.md`: armadilha 14

**O achado.** `logic.js` exporta `getAvailableProps(itemId, slot, otherPropId)` e `getAvailablePerks(itemId, otherPerkId)`. As duas resolvem o item **por id**, com `getItem(itemId)` — e o `App.jsx` nunca as usou, filtrando inline a partir do **objeto de item já resolvido**.

Isso não foi preguiça: para o amuleto com `classBinding`, o `App.jsx` trabalha com o item **efetivo** (`getEffectiveCharm`), e resolver por id devolveria o item cru do `GEAR`, **sem os props e perks de classe**. Ou seja, as duas funções, usadas hoje com um amuleto Magistral vinculado, devolvem lista incompleta **sem erro nenhum** — é a armadilha 7 vestida de função utilitária.

**Âncora** (item 13, último da lista):

```
13. **3 colunas e 2 colunas não compartilham estilo** — os dois modos pedem comportamentos **opostos** para habilidades e vantagens de classe (empilhadas no 3-col, lado a lado no 2-col). Estilo aplicado sem olhar o `layoutMode` conserta um e quebra o outro — aconteceu três vezes seguidas. Mexeu num, confira o outro **na mesma sessão**. Ver DEC-023.
```

**Substituir por:**

```
13. **3 colunas e 2 colunas não compartilham estilo** — os dois modos pedem comportamentos **opostos** para habilidades e vantagens de classe (empilhadas no 3-col, lado a lado no 2-col). Estilo aplicado sem olhar o `layoutMode` conserta um e quebra o outro — aconteceu três vezes seguidas. Mexeu num, confira o outro **na mesma sessão**. Ver DEC-023.

14. **`getAvailableProps` e `getAvailablePerks` resolvem o item por `id`** — e por isso **não servem para amuleto com `classBinding`**: devolvem o item cru do `GEAR`, sem os props e perks de classe, e sem erro. É a armadilha 7 disfarçada de utilitário. O `App.jsx` filtra inline justamente para poder passar o item **efetivo**. Nenhum consumidor as usa hoje (verificado em 2026-07-25); antes de usar uma delas em código novo — inclusive na Fase 3 — troque a assinatura para receber o item, não o id.
```

---

## Parte 9 — `meta/DECISIONS.md`: fechar a ponta solta da DEC-015

**Âncora** (a subseção «O que ficou por fazer», do título ao item 2):

```
### O que ficou por fazer
Duas pontas soltas, ambas conferidas em 2026-07-23 e agora no backlog do `STATUS.md`:

1. **Código morto.** `onLinkedClass` está declarado em `App.jsx` e nunca é usado; `setCharmLinkedClass` continua importado lá e exportado em `logic.js` sem nenhum consumidor.
2. **Nenhuma indicação visual do vínculo.** A proposta original substituía o `<select>` por um selo "Vinculado a: 🗡️ Samurai". Isso não foi feito — o bloco foi apagado e nada entrou no lugar. Hoje o jogador vê props e perks de classe surgirem no amuleto sem nada na tela explicando de onde vêm.
```

**Substituir por:**

```
### O que ficou por fazer

1. ~~**Código morto.**~~ **Resolvido em 2026-07-25** (spec0012): `onLinkedClass` removido do `App.jsx`, `setCharmLinkedClass` removido do `logic.js`, import limpo. O campo `linkedClass` do estado **permanece** e continua alimentando `getEffectiveCharm` — como esta decisão previa.
2. **Nenhuma indicação visual do vínculo.** A proposta original substituía o `<select>` por um selo "Vinculado a: 🗡️ Samurai". Isso não foi feito — o bloco foi apagado e nada entrou no lugar. Hoje o jogador vê props e perks de classe surgirem no amuleto sem nada na tela explicando de onde vêm. Continua no `IDEAS.md`.
```

---

## Parte 10 — `meta/STATUS.md`

### 10.1 — Backlog: fechar quatro itens

**Âncora** (o item do código morto):

```
- [ ] **Limpar o código morto do vínculo de classe** — `onLinkedClass` declarado e nunca usado em `App.jsx`; `setCharmLinkedClass` importado lá e exportado em `logic.js` sem consumidor. Resíduo da remoção do seletor (DEC-015). Cuidado: o campo `linkedClass` do estado **fica** — quem some é só a função de troca.
```

**Substituir por:**

```
- [x] ~~Limpar o código morto do vínculo de classe~~ — **feito em 2026-07-25** (spec0012). Junto saíram outros oito imports órfãos do `App.jsx`. O campo `linkedClass` do estado ficou intacto.
- [ ] **Decidir o destino de `getAvailableProps` e `getAvailablePerks` em `logic.js`** — não têm consumidor e, como estão, são armadilha: resolvem o item por `id` e por isso devolvem lista errada para amuleto com `classBinding` (armadilha 14). Duas saídas: **remover** as duas, já que ninguém as usa, ou **trocar a assinatura** para receber o item já resolvido e então usá-las no `App.jsx` no lugar do filtro inline. Não decidir também é uma escolha — mas aí a armadilha fica.
- [ ] **Duplicação de `selectTech` / `selectAbility`** — o `App.jsx` reimplementa inline o toggle que essas duas funções de `logic.js` já fazem, com lógica idêntica. Ao contrário do caso acima, aqui não há motivo: as assinaturas servem. Trocar o inline pela chamada elimina uma fonte de verdade duplicada. Mudança de duas linhas, mas **não embutida na spec0012** por estar fora do escopo dela.
```

**Âncora** (os três itens de ícone, consecutivos):

```
- [ ] Verificar IDs reais de amuletos em `data.js` vs entradas em `icons.js` (alguns podem não bater)
- [ ] Verificar IDs de técnicas do Assassino (comentados em `icons.js` como pendentes)
- [ ] Adicionar técnicas do Assassino faltantes em `TECH_ICON` (sumica_toxico, supergolpe, etc.)
```

**Substituir por:**

```
- [x] ~~Verificar IDs de amuletos, técnicas do Assassino e entradas faltantes em `TECH_ICON`~~ — **os três verificados em 2026-07-25 e todos em ordem.** Cruzamento programático de `data.js` contra `icons.js`: **50 itens de `GEAR` ↔ 50 chaves de `GEAR_ICON`** e **60 chaves de `TECH_ICON` ↔ 60 ids de técnica/habilidade**, sem nenhum órfão nos dois sentidos. `sumico_toxico` e `supergolpe`, citados como faltantes, estão mapeados. Os quatro ids restantes são os supremos (`furia_de_hachiman`, `olho_de_uchitsune`, `sopro_de_izanami`, `golpe_sombrio`), que por decisão usam `CLASS_TECH_FALLBACK`. Eram resquícios da escrita original do `icons.js`.
```

### 10.2 — Registrar a sessão

**Âncora** (último parágrafo do arquivo):

```
**Próximo passo: Fase 3 (`generateBuildImage`)** — agora com o roteiro completo no `ROADMAP.md`. Antes de abrir a sessão, reinclua `meta/legacy/GUIA_CORRECOES_FASE3.md` no `.flatdropignore`.
```

**Substituir por:**

```
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
```

---

## Parte 11 — `meta/GLOSSARY.md`: corrigir o nome do guia

O arquivo versionado é `GUIA_COMPLETO_v4.md`. `GUIA_COMPLETO.md` é justamente a cópia solta fora do repositório que o backlog manda apagar — nomear a entrada assim aponta para a coisa errada.

**Âncora:**

```
- **`GUIA_COMPLETO.md`** — arquivo de guia anterior com correções de layout e HpResolveBar
```

**Substituir por:**

```
- **`meta/legacy/GUIA_COMPLETO_v4.md`** — guia anterior, com correções de layout e `HpResolveBar`. Cobre território parecido com o do `GUIA_CORRECOES_FASE3.md`; **antes de usar qualquer um dos dois na Fase 3, confira qual é o mais recente.** Existem duas cópias soltas dele fora do repositório (ver backlog do `STATUS.md`) — a versionada é esta.
```

---

## Parte 12 — `meta/CHANGELOG.md`

**Âncora** (a subseção «### Adicionado» do «[Não lançado]», da primeira à última linha do bloco de infraestrutura):

```
### Adicionado
- Fase 3 — `generateBuildImage` via Canvas API: código completo entregue em guia, pendente de aplicação em `App.jsx`.
```

**Substituir por:**

```
### Adicionado
- Fase 3 — `generateBuildImage` via Canvas API: código completo entregue em guia, pendente de aplicação em `App.jsx`.

### Removido
- Código morto do vínculo de classe (`onLinkedClass` no `App.jsx`, `setCharmLinkedClass` no `logic.js`) e nove imports órfãos — resíduo da remoção do seletor de classe vinculada (DEC-015). Sem efeito visível no produto.
```

---

## Parte 13 — `meta/IDEAS.md`

**Âncora** (último item do arquivo, fim do «Feedback para o Kit»):

```
- *(2026-07-23 — FlatDrop, sugestão)* O bloco gerenciado `# >>> flatdrop-editor … # <<<` fica **no fim** do arquivo, e em `.gitignore` **o último padrão que casa é o que vale**. Toda regra manual escrita acima dele pode ser anulada pelo bloco, sem aviso. Vale documentar essa precedência no próprio cabeçalho do bloco, ou colocá-lo no topo.
```

**Substituir por:**

```
- *(2026-07-23 — FlatDrop, sugestão)* O bloco gerenciado `# >>> flatdrop-editor … # <<<` fica **no fim** do arquivo, e em `.gitignore` **o último padrão que casa é o que vale**. Toda regra manual escrita acima dele pode ser anulada pelo bloco, sem aviso. Vale documentar essa precedência no próprio cabeçalho do bloco, ou colocá-lo no topo.

---

## 🔧 Correções de processo — 2026-07-25

### O chat afirmou "CRLF" no `.flatdropignore` em quatro specs seguidas — e o arquivo é LF
As specs 0008 a 0011 abriram a parte do `.flatdropignore` com um aviso de que o arquivo tinha quebras CRLF e que era preciso preservá-las. **Está errado:** o relatório de aplicação da spec0010 registra `git ls-files --eol` mostrando LF, e o executor manteve o formato real em vez de seguir a spec. O que induziu ao erro foi ler o `_TREE` e o `_MANIFEST` do pacote FlatDrop, esses **sim** em CRLF, e generalizar para o arquivo vizinho.

**Regra que fica:** o chat não afirma final de linha de arquivo que não pode inspecionar. Se importar, a spec pede ao executor que **verifique e preserve o que houver** — nunca nomeia o formato de cor. Vale para qualquer atributo de arquivo que só o Code enxerga: permissão, encoding, presença de BOM.

### Três perguntas ao autor seguem em aberto
Nenhuma bloqueia trabalho, e nenhuma deve ser resolvida por suposição. Ficam listadas juntas para não se perderem uma a uma:

1. **Botões de 🎲 granulares** (`Tudo` / `Classe` / `Gear`) — sumiram em alguma reescrita. Foi simplificação deliberada?
2. **Seletor "Só alteradas"** no painel de estatísticas — mesma pergunta, mesma família.
3. **Modo Estatístico** — nos prompts antigos o autor cogitou removê-lo caso desse trabalho demais. Ele funciona desde a spec0004, mas a pergunta nunca foi formalmente encerrada.

Se as três forem respondidas com "foi de propósito", os dois itens de possível regressão saem do `IDEAS.md` e viram nota de decisão.
```

---

## Parte 14 — `.flatdropignore`

> **Verifique o final de linha do arquivo antes de editar e preserve o que encontrar.** A spec não afirma qual é.

### 14.1 — Corrigir a contradição sobre o `GUIA_COMPLETO_v4.md`

O comentário afirma que o arquivo continua subindo; o bloco `flatdrop-editor` o exclui há semanas. E o motivo escrito ("guia de aplicação, ainda pendente") está obsoleto: as correções dele já foram aplicadas.

**Âncora:**

```
# GUIA_COMPLETO_v4.md NAO entra aqui: continua subindo (e guia de aplicacao, ainda pendente).
```

**Substituir por:**

```
# (Este bloco trata so dos snapshots src/v*. Os arquivos de meta/legacy/ sao
#  controlados no bloco flatdrop-editor no fim deste arquivo.)
```

### 14.2 — Ajustar o bloco `flatdrop-editor`

Duas coisas: a linha do `GOT_Build_-_TOhno.md` refere um arquivo **que não existe mais** — e é assimétrica, já que Joker, Alex e Origem não têm linha. E os três arquivos necessários à preparação da Fase 3 precisam subir no próximo pacote.

**Âncora** (o bloco inteiro):

```
# >>> flatdrop-editor
logs/
INSTRUCOES-DO-PROJETO.md
meta/legacy/GOT_Build.md
meta/legacy/GOT_Build_-_TOhno.md
meta/legacy/GUIA_COMPLETO_v4.md
meta/legacy/GUIA_CORRECOES_FASE3.md
meta/legacy/README.md
# <<<
```

**Substituir por:**

```
# >>> flatdrop-editor
logs/
INSTRUCOES-DO-PROJETO.md
meta/legacy/README.md
# <<<
```

> **O que isso faz:** o próximo pacote passa a subir `GOT_Build.md`, `GUIA_COMPLETO_v4.md` e `GUIA_CORRECOES_FASE3.md` — os três insumos da preparação da Fase 3. **Depois que a Fase 3 fechar, as três linhas voltam para cá.** Se o editor gráfico do FlatDrop for usado depois desta edição, ele reescreve o bloco a partir das caixas marcadas: nesse caso, desmarque os três lá em vez de editar à mão.

---

## Parte 15 — `logs/2026-07-25.md`

**Crie** o arquivo com este conteúdo:

```markdown
# Log — 2026-07-25

## Sessão 1 — Higiene pré-Fase 3

### Objetivo da sessão
Ler os relatórios de aplicação pendentes, avaliar o que resta em `meta/legacy/` e limpar o `App.jsx` antes de a Fase 3 mexer nele.

### Feito
- Lidos os cinco `.txt` do mount (relatórios das specs 0007 a 0011) e a `_TREE` / `_MANIFEST` do pacote. Tudo já refletido nos `meta/`, **exceto** um achado de processo: o relatório da spec0010 registra que o `.flatdropignore` é LF, não CRLF como quatro specs seguidas afirmaram.
- Cruzamento programático `data.js` × `icons.js`: 50 ↔ 50 em gear, 60 ↔ 60 em técnicas, zero órfãos.
- Varredura de imports do `App.jsx`: nove símbolos importados e nunca usados.
- Investigado o motivo de `getAvailableProps` / `getAvailablePerks` nunca terem sido usados — não é descuido, é a assinatura por `id` sendo incompatível com o amuleto efetivo.
- Entregue a `spec0012`.

### Specs entregues / aplicadas
- `260725-spec0012-higiene-pre-fase3.md` — remove o código morto do vínculo de classe e nove imports órfãos; limpa um comentário obsoleto do `icons.js`; registra a armadilha 14 no CONTEXT; fecha a ponta 1 da DEC-015 e quatro itens do backlog; corrige o nome do guia no GLOSSARY; registra no CHANGELOG; acrescenta a seção de correções de processo ao IDEAS; corrige a contradição do `.flatdropignore` e libera os três insumos da Fase 3.

### Decisões
- Nenhuma decisão nova de arquitetura. Uma foi **adiada de propósito**: o destino de `getAvailableProps` / `getAvailablePerks` foi para o backlog em vez de ser resolvido dentro de uma spec de higiene.

### Bugs
- Nenhum. A armadilha 14 é risco latente, não defeito observado — as funções não têm consumidor.

### Aprendizados / armadilhas
- **Função utilitária pode ser armadilha por causa da assinatura.** `getAvailableProps(itemId, ...)` parece o jeito certo de listar props e é o jeito errado para amuleto com `classBinding`. Virou armadilha 14.
- **O chat não deve afirmar atributo de arquivo que não pode inspecionar.** Quatro specs afirmaram CRLF onde havia LF, por generalizar a partir dos arquivos do FlatDrop. Registrado no IDEAS.
- **Aviso de backlog envelhece.** Três itens diziam que os ícones "podem não bater"; batiam todos, e provavelmente há semanas. Vale conferir antes de agendar trabalho em cima de um aviso antigo.

### Onde parei
Higiene aplicada, `meta/legacy/` triado por destino, três insumos da Fase 3 liberados no mount.

### Próximos passos
1. **Preparação da Fase 3:** extrair o `GOT_Build.md` com o método da DEC-011 e comparar `GUIA_COMPLETO_v4.md` com `GUIA_CORRECOES_FASE3.md` para saber qual guia é o mais recente.
2. **Fase 3** (`generateBuildImage`), com o roteiro do `ROADMAP.md`.
3. Três perguntas ao autor em aberto no `IDEAS.md` (🎲 granulares, "Só alteradas", modo Estatístico).
```

---

## Parte 16 — Fechamento

Rode `git diff` e confira que só `meta/`, `logs/` e `.flatdropignore` aparecem — os arquivos de `src/` já foram no commit da Parte 7.

```
git add meta/CONTEXT.md meta/DECISIONS.md meta/STATUS.md meta/GLOSSARY.md meta/CHANGELOG.md meta/IDEAS.md .flatdropignore logs/2026-07-25.md meta/specs/260725-spec0012-higiene-pre-fase3.md
git commit -m "docs(meta): registra a higiene pre-fase3 e a armadilha das funcoes por id"
git push
```
