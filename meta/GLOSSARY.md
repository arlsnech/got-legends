# GLOSSARY.md — Termos do Projeto

> Termos próprios que se repetem entre sessões e que um recém-chegado não entenderia.

---

## Conceitos do jogo (tradução PT-BR usada no projeto)

- **Magistral** — item Legendary; nível máximo de qualidade de equipamento. Em EN: *Legendary*.
- **Técnica Magistral** — vantagem de classe que concede `+1 legSlots`, elevando o limite de itens Magistrais equipáveis. Existe nos tiers I e III das quatro classes. Não tem flag própria: é reconhecida pelo efeito `legSlots` no array `fx`. Ver DEC-013.
- **Vantagem** — Perk; modificador passivo equipado num item ou técnica. Em EN: *Perk*.
- **Determinação** — Resolve; recurso que permite usar a habilidade suprema. Em EN: *Resolve*.
- **Arma Fantasma (AF)** — Ghost Weapon; habilidade ativa de combate (kunai, bomba etc.). Em EN: *Ghost Weapon (GW)*.
- **Habilidade Suprema** — Ultimate; habilidade poderosa que consome Determinação. Em EN: *Ultimate*.
- **Habilidade de Classe** — Class Ability; habilidade ativa de cooldown de cada classe. Em EN: *Class Ability*.
- **Longo Alcance** — Ranged; slot de arma à distância (arco, zarabatana, pacote de bombas). Em EN: *Ranged*.
- **CDR** — Cooldown Reduction; redução do tempo de recarga de habilidades ou GWs.
- **Propriedade (Prop)** — atributo numérico de um item (P1 ou P2). Ex: "Dano Corpo a Corpo: +12%".
- **Tier** — nível da árvore de vantagens de classe (I, II, III). Cada tier tem 4 opções, o jogador escolhe 1.
- **Classe primária de uma arma** — a classe "dona" do equipamento. Recebe a munição entre parênteses e não paga perk de desbloqueio. Ver DEC-018 para a tabela canônica.
- **Tier list (S/A/B/C/D)** — ranking de Magistrais feito pela comunidade. **Não é dado do jogo** e não aparece na ferramenta, de propósito. Vive só na planilha. Ver DEC-019.

---

## Conceitos do projeto

- **Build** — configuração completa de um personagem: classe, habilidade, vantagens, 5 equipamentos com props e perks.
- **Slot** — um dos 5 espaços de equipamento: `katana`, `ranged`, `charm`, `gw1`, `gw2`.
- **classBinding** — flag em amuletos magistrais que indica que eles ganham props/perks extras dependendo da classe vinculada. Resolvido em runtime por `resolveCharmClassBinding`.
- **linkedClass** — a classe atualmente vinculada ao slot de amuleto (`slotState.linkedClass`).
- **Modo compacto / expandido** — `gearIconMode`: como o ícone SVG aparece no card de equipamento (`compact` = pequeno ao lado do nome; `full` = grande com nome à direita).
- **Fase 2** — funcionalidade de exportação de texto (`generateBuildText`, botões 📋).
- **Fase 3** — funcionalidade de geração de imagem PNG (`generateBuildImage`, botões 🖼️).

---

## Arquiteturas / módulos

- **T** — objeto mutável de tema. Sempre lido como `T.bg`, `T.text`, etc. Atualizado via `Object.assign(T, THEME_ATUAL)` no render do App.
- **`THEME_DARK` / `THEME_LIGHT`** — objetos imutáveis com as paletas. Nunca modificados; só copiados para `T`.
- **`iconFilter` / `iconFilterDim`** — propriedades de `T` com os filtros CSS corretos para ícones SVG no tema ativo. `iconFilter` = 100% visível; `iconFilterDim` = 45% opacidade.
- **`computeStats(build)`** — função principal de `logic.js` que calcula todas as estatísticas da build. Retorna o objeto `stats`.
- **`getStatGroups(stats, classId, lang)`** — agrupa as stats calculadas em seções para exibição. Atenção: `classId` é obrigatório — sem ele, grupos de classe errados são incluídos.
- **`getEffectiveCharm(itemId, linkedClass)`** — retorna o item de amuleto com props/perks de classe já injetados. Nunca ler amuleto magistral com `classBinding` direto do `GEAR`.
- **`CLASS_EXCLUSIVE_CHARM_PROPS` / `_PERKS`** — tabelas de `data.js`, indexadas por `classId`, com o que um amuleto Magistral vinculado ganha da classe. São a fonte de verdade: `resolveCharmClassBinding` lê delas, não deduz por comparação. Ver FIX-008.
- **Perk de desbloqueio** — perk que uma classe não-primária precisa gastar para usar uma arma de outra classe (Versátil no Arco Longo, Desbloqueio do Ronin na Zarabatana). Fica travado no slot Vantagem I com o selo 🔒. Definido em `REQUIRED_PERKS` (`data.js`). Ver DEC-014.
- **Classe primária (de uma arma)** — a classe "dona" do equipamento, que recebe a quantidade de munição entre parênteses. Calculada por `getPrimaryClass(item)`: `item.by[0]`, ou `hunter` para arma de longo alcance sem restrição. Ver DEC-017.

---

## Comandos / artefatos

- **`npm run dev`** — inicia servidor de desenvolvimento Vite em `localhost:5173`
- **`npm run build`** — gera build de produção em `dist/`
- **`npm run deploy`** — faz build e chama `gh-pages -d dist`. **Quebra neste ambiente** com `ENAMETOOLONG` (limite de linha de comando do Windows); está no `deny` do `.claude/settings.json`. O site é publicado pelo Netlify a partir do `dist/`. Ver DEC-016.
- **`GUIA_CORRECOES_FASE3.md`** — arquivo de guia com 4 correções pendentes + código completo da Fase 3
- **`GUIA_COMPLETO.md`** — arquivo de guia anterior com correções de layout e HpResolveBar
- **spec** — arquivo em `meta/specs/` com o texto exato de uma alteração de documento e a âncora onde ela entra. O chat autora, o Claude Code posiciona. Nome: `AAMMDD-specNNNN-desc.md`. É artefato versionado; não se apaga depois de aplicada.
- **`/apply-spec`** — comando do Claude Code que aplica uma spec (âncora exata, ou PARA e reporta).
- **`/wrap`** — comando do Claude Code que fecha a sessão: append em STATUS/DECISIONS, build, `git diff`, commit e push.
- **`.flatdropignore`** — lista do que NÃO sobe ao Projeto do Claude no achatamento (continua tudo no Git).
- **KCM** — Kit de Contexto Universal, o gerador dos documentos de `meta/`. Um **template-update** do KCM traz arquivos genéricos do nicho, propositalmente vazios do específico desta obra.
- **CEREBRO.md** — documento que define COMO o assistente age (≠ CONTEXT.md, que define O QUE o projeto é).

---

## Identificadores

- **`gw1` / `gw2`** — tipos de item para Arma Fantasma I e II no `GEAR` de `data.js`
- **`three-col` / `two-col`** — valores de `layoutMode` state no App
- **`compact` / `full`** — valores de `gearIconMode` state no App
- **`build` / `detailed` / `stats`** — modos do `ExportPanel` (texto e imagem)
- **`ULTIMATE_ICON_SIZE`** — constante configurável no App.jsx para o tamanho do ícone supremo no topo da col de stats
- **`HP_BAR_WIDTH` / `HP_BAR_HEIGHT` / `DET_CIRCLE_SIZE`** — constantes configuráveis independentes no `HpResolveBar`
