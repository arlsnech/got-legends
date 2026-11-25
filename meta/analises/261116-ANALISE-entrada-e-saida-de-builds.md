# ANÁLISE — Entrada e saída de builds

> **Status:** Implementada — pacote aprovado pelo dono em 2026-11-17 (DEC-038): Fatia 0 `wo0036`, Fatia 1 `wo0038`/`wo0041`/`wo0042`, Fatia 2 `wo0044`; tudo conferido na tela pelo dono até 2026-11-25.
> **Data:** 2026-11-16 (data de criação; não muda depois)
> **Origem:** backlog do `STATUS.md` (próxima frente escolhida pelo dono em 2026-11-16); `IDEAS.md` — «Importar build arrastando um `.json`», «Exportar só as builds escolhidas», «Filtrar, ordenar e agrupar as builds salvas», «URL compartilhável», «QR Code» e «Onde vive o compartilhamento por link» (2026-07-27); `ROADMAP.md` F4 e F5.
> **Marcas de origem:** `[medido]` = lido no código ou rodado nesta conversa · `[relatado pelo dono]` · `[estimativa]` = raciocínio sem medição · `[pesquisa]` = fonte externa, listada em «Fontes».

---

## Problema

Uma build entra na ferramenta por **três portas que não conversam entre si**, e o dono quer abrir mais três (arrastar arquivo, link e QR). Cada porta nova herda os defeitos da validação de hoje — e uma delas, o link, é a primeira em que **outra pessoa** escolhe o que entra na sua tela.

Para quem dói:
- **Para quem recebe uma build**, hoje: copiar um bloco de ~1.480 caracteres, abrir o painel lateral, colar e clicar em Carregar. A troca acontece no Discord, onde a mensagem comum tem teto de 2.000 caracteres `[pesquisa]`.
- **Para quem guarda builds:** carregar uma build salva **não troca o nome** no campo de nome (D1, abaixo). O próximo «Salvar» grava a build carregada **por cima de outra**, sem aviso. É perda de dado silenciosa, e acontece no uso normal.
- **Para quem importa arquivo:** o arquivo vai inteiro para os salvos, sem escolha, sem validação de conteúdo (D2), e uma entrada malformada só falha depois — ao carregar, derrubando a tela (D3).

Se nada for feito: as ideias novas continuam paradas no IDEAS, e D1 continua comendo builds de quem salva mais de uma.

---

## Restrições / o que foi medido

### M1. As portas de hoje e o que cada uma valida `[medido: src/App.jsx, SaveDrawer; src/logic.js, «SAVE / LOAD»]`

| Porta | Código | Valida com | Para onde vai | Troca a build aberta | Troca o nome |
|---|---|---|---|---|---|
| Clicar num salvo | `load(entry)` | `deserializeBuild` | build aberta | sim, sem confirmação | **não** |
| Colar código | `loadCode()` → `decodeBuild` | `deserializeBuild` | build aberta | sim, sem confirmação | **não** (o `name` decodificado é descartado) |
| Importar `.json` | `importFile(e)` | **só** `b.build?.classId` existir | salvos (todas) | não | — |

**A premissa do brief não vale:** o arquivo importado **não** passa por `deserializeBuild`. Ele não confere `game`, não confere se a classe existe, não normaliza (`normalizeLegendaryProps`). A validação só acontece quando a entrada é clicada, já dentro do `localStorage`.

Outras leituras que pesam na decisão:
- **`save()` deduplica por NOME; `importFile` deduplica por `id`.** Importar o mesmo arquivo duas vezes não duplica; importar uma build com o nome de uma existente cria duas entradas de mesmo nome, e o próximo Salvar com esse nome apaga **as duas** (`filter(s => s.name !== name)`).
- **`createdAt` é, na prática, «salvo em»:** `save()` chama `serializeBuild`, que gera `id` e `createdAt` novos a cada salvamento. E a lista já está em **ordem do mais recente** (o salvo entra no topo). Logo, ordenar «por edição» **já é o comportamento atual**, e o campo `updatedAt` que o IDEAS previa não é necessário para isso.
- **Não existe noção de «build com alterações não salvas».** Nenhum estado compara a build aberta com a última salva ou carregada. Qualquer confirmação «antes de substituir» hoje teria de perguntar sempre.
- **A exportação** (`exportAll`) grava `{version, game, builds:[…]}`; a importação aceita esse formato **ou** uma build solta (`json.builds ?? [json]`). O formato de arquivo já é extensível: exportar uma build só não exige formato novo.
- O código Base64 também sai no fim do texto exportado, quando o interruptor das Configurações está ligado (`generateBuildText`, chamada **síncrona** de `encodeBuild`).

### M2. Tamanho do código `[medido: node 22, 800 builds de randomBuild, 200 por classe, nome «Minha Build de Teste»]`

| Formato | mín / média / máx (caracteres) |
|---|---|
| JSON do envelope (`serializeBuild`) | 1.076 / ~1.109 / 1.136 |
| **Código atual** (`encodeBuild`: Base64 do envelope) | **1.436 / ~1.480 / 1.516** |
| Build vazia (Samurai) no código atual | 1.076 |
| Só o `build`, deflate-raw + base64url | **494 / ~527 / 562** |

- O código atual sozinho ocupa **~74% de uma mensagem comum do Discord** (2.000 caracteres) `[medido ÷ pesquisa]`. Somado ao texto exportado, o risco de passar do teto é real — **não medi** o comprimento do texto do Estatístico.
- O deflate foi medido com o `zlib` do Node; o `CompressionStream('deflate-raw')` do navegador deve dar número próximo, mas **não foi medido no navegador** `[estimativa]`.
- O envelope (`version`, `game`, `id`, `createdAt`) é ~25% do JSON e não tem função num link: `id` e `createdAt` são regenerados ao salvar.

### M3. O que o validador deixa passar `[medido: deserializeBuild + computeStats + checkLegendaryLimit, node, build de Ronin adulterada]`

| Adulteração | `deserializeBuild` | Cálculo |
|---|---|---|
| item, propriedade, técnica ou habilidade inexistente | aceita | roda sem erro |
| valor de propriedade em texto (`"abc"`) | aceita | roda sem erro |
| **sem `gear`** | **aceita** | **lança exceção** |
| **sem `techs`** | **aceita** | **lança exceção** |

`computeStats` roda dentro de `useMemo` no `App`: exceção ali derruba a renderização. **Não medi** o que a tela faz com id inexistente (seletor vazio? item fantasma?) — o render é JSX e não roda no Node.

### M4. Defeitos achados na leitura (candidatos; nenhum visto na tela)

| # | Defeito | Onde | Gravidade |
|---|---|---|---|
| **D1** | Carregar salvo ou código não atualiza o nome → o próximo Salvar sobrescreve outra build | `load`, `loadCode` (sem `setBuildName`) | **alta** — perda silenciosa |
| **D2** | Importar arquivo grava sem validar | `importFile` | média |
| **D3** | Validador aceita build sem `gear`/`techs`; o cálculo quebra | `deserializeBuild` | média hoje; **alta com link** |
| D4 | Mensagens de erro de `deserializeBuild`/`decodeBuild` só em PT-BR | `logic.js` | baixa — hoje não são exibidas; vira problema se forem |
| D5 | `URL.createObjectURL` sem `revokeObjectURL` | `exportAll` | baixa |
| D6 | `localStorage.setItem` sem `try` (cota cheia lança no clique) | `persist` | baixa |

D1 foi achado por leitura: o caminho é direto (o `buildName` vive no `App` e só o campo de texto o altera), mas **não foi reproduzido na tela**. Roteiro na seção «Riscos».

### M5. A lista de salvos hoje `[medido no código; capacidade é estimativa]`

- Chips em linha com quebra, `maxWidth: 200`, numa gaveta de até 300 px, rolagem própria a partir de **180 px** de altura.
- Cabem **~6 a 12 builds** antes de rolar, conforme o tamanho dos nomes `[estimativa: ~31 px por linha de chip, 1 ou 2 chips por linha]`.
- Cada chip já leva **cor e ícone da classe** — a lista já é agrupada visualmente por classe, sem controle nenhum.
- **Não há dado de quantas builds um usuário real guarda:** o projeto não tem backend nem telemetria, e o dono não relatou o próprio número.

### M6. O que a pesquisa externa diz `[pesquisa]`

- **Arrastar arquivo:** a prática é a página inteira como zona de soltura, com realce visível durante o arrasto e **sempre** um botão de escolher arquivo como alternativa — a orientação do W3C sobre movimentos de arrastar pede uma via sem arrasto. O botão «Importar» já existe e cumpre esse papel.
- **Confirmar × desfazer:** a literatura é consistente em reservar confirmação para o que é **irreversível e de alto impacto** e preferir **desfazer** no resto — confirmação em excesso é clicada sem leitura. Há também a recomendação explícita de **não** usar o `confirm()` nativo (o `clearAll` usa hoje).
- **Quando uma lista pede filtro:** os estudos que medem isso são de catálogo de e-commerce (milhares de itens); um achado útil para cá é que participantes raramente percorriam mais de ~10 itens de uma lista. Não achei estudo sobre listas pessoais de dezenas de itens — **a evidência para «quantas builds justificam filtro» é fraca**, e o número abaixo é estimativa.
- **Estado no link:** o padrão em ferramentas sem servidor é JSON → compressão → codificação segura para URL, **no fragmento** (`#`), que não vai ao servidor — o Mermaid Live Editor é o exemplo canônico. Planejadores de jogo (Enshrouded, Run! Goddess, Myth of Empires) tratam o link como o próprio arquivo de save e a forma de compartilhar no Discord. Há também relato de usuários reclamando de **link longo demais** num planejador que codificava sem comprimir.
- **Compressão nativa:** `CompressionStream` com `deflate-raw` funciona nos navegadores principais desde 2023 (Chrome/Edge 103+, Firefox 113+, Safari 16.4+). A API é **assíncrona**.
- **QR:** a capacidade máxima é ~2.953 bytes, mas a confiabilidade de leitura cai muito antes, porque a grade fica densa — um link curto lê melhor que um longo.

### O que NÃO foi olhado

- O comprimento do texto exportado (Build/Detalhado/Estatístico), com e sem código — decide se o texto com código passa de 2.000 caracteres.
- O comportamento **visual** de uma build com id inexistente.
- O deflate pelo `CompressionStream` do navegador (só pelo `zlib` do Node).
- Se o Safari perde a permissão de área de transferência quando a cópia espera uma compressão assíncrona — risco conhecido em geral, **não testado aqui**.
- Quantas builds o dono, ou qualquer usuário, guarda.

---

## Opções consideradas

### E1. Onde mora a validação

- **E1-a. Um validador único, endurecido, usado por todas as portas.** `deserializeBuild` passa a exigir `gear` e `techs` com a forma esperada e a descartar (ou zerar) ids que `data.js` não conhece, devolvendo um código de erro em vez de frase. Arquivo, código, link e arrasto chamam a mesma função. **Recomendada.**
- E1-b. Cada porta valida o que precisa. **Descartada:** é exatamente o estado de hoje, e foi assim que o arquivo importado ficou sem validação.

### E2. Formato do código e do link

- E2-a. **Manter o Base64 atual** e só pô-lo na URL. ~1.480 caracteres de link. Funciona, mas o link fica do tamanho de um parágrafo e o QR fica inviável. **Descartada como formato novo**; mantida como formato **aceito** na leitura, para os códigos já espalhados.
- **E2-b. Comprimir só o `build`** (sem envelope), deflate-raw nativo + base64url, com um prefixo de versão no início do código (ex.: `1.`). ~530 caracteres; sem dependência. O preço é a API assíncrona: o texto exportado com código precisa do código **pronto antes do clique**. **Recomendada.**
- E2-c. Codificação posicional (cada id vira o seu índice em `data.js`). Seria a menor de todas `[estimativa: dezenas de caracteres]`, mas qualquer reordenação de `data.js` corrompe **em silêncio** todos os links antigos — a mesma família de defeito das armadilhas 9 e 10. **Descartada.**
- E2-d. Biblioteca de compressão síncrona. Evita o assíncrono, mas adiciona dependência num projeto que evitou até a do canvas (DEC-021). **Descartada** enquanto o assíncrono for contornável.

### E3. Onde a build vai no link

- **E3-a. Fragmento:** `…/got-legends/#b=1.xxxx`. Não vai ao servidor nem aos logs dos quatro hosts; não depende de configuração de nenhum deles; o GitHub Pages em subcaminho não muda nada. **Recomendada.**
- E3-b. Query string (`?b=`). Vai ao servidor e aos logs; ganha só em pré-visualização por link, que um site estático não gera de qualquer forma. **Descartada.**

### E4. As vias de entrada

| Via | Posição | Por quê |
|---|---|---|
| Botão Importar `.json` | **mantém**, passa pelo modal (E5) | é a alternativa obrigatória ao arrasto |
| **Arrastar `.json` em qualquer ponto** | **entra** | barato; mesma rota do botão; realce na tela inteira durante o arrasto |
| Colar código | **mantém**, aceita código **ou link** colado | quem recebe um link no celular e abre no PC cola o que tiver |
| **Link (`#b=`)** | **entra** | absorve o código como forma principal de compartilhar (IDEAS de 2026-07-27) |
| Link curto | **barrada** | exige serviço externo: num projeto sem backend, a build passa a depender da vida de um terceiro (link que morre), e o conteúdo vai para um servidor alheio. Com ~530 caracteres, o ganho não paga |
| QR | **adiada para F5, com gatilho** | depende do link existir e de biblioteca de QR (não há API nativa). Gatilho: o link com E2-b estar no ar e alguém pedir para passar build do PC para o celular |

### E5. Arquivo com várias builds (e a pergunta do dono: importar sem abrir)

- **E5-a. Modal com a lista**, todas marcadas, «Selecionar todas / nenhuma», o nome, a classe (ícone e cor, como os chips) e um aviso por linha quando o nome já existe nos salvos. Botão principal: **«Importar N para os salvos»** — não abre nenhuma. Com exatamente **uma** marcada, aparece o secundário **«Importar e abrir»**. Linha inválida aparece desmarcada e desabilitada, com o motivo (bilíngue), em vez de sumir. É a preferência do dono `[relatado pelo dono]` e responde à pergunta dele: **sim, importar sem abrir vira o padrão.** **Recomendada.**
- E5-b. Importar tudo direto, como hoje. **Descartada:** é o que o dono quer trocar, e esconde entradas inválidas.
- **Nome repetido:** o modal mostra o conflito e oferece **manter as duas** (a importada ganha sufixo « (2)») como padrão. Substituir é escolha explícita por linha. Motivo: o `save()` deduplica por nome; deixar dois iguais entrar arma a armadilha da sobrescrita dupla (M1).

### E6. Proteger a build aberta (link, código, «Importar e abrir», clique num salvo)

- E6-a. Confirmar sempre. **Descartada:** a pesquisa é clara sobre confirmação em ação rotineira e reversível, e clicar num salvo é a ação mais comum da gaveta.
- E6-b. Só desfazer: substitui e mostra «Build X aberta — Desfazer». Simples, mas o aviso some em segundos e quem percebe depois perdeu o que não tinha salvo.
- **E6-c. Desfazer sempre + modal só quando há alteração não salva.** A ferramenta guarda um instantâneo da build no momento em que ela foi salva, carregada ou criada; se a aberta difere dele, a substituição pergunta: **«Salvar como…»** (campo de nome já preenchido), **«Abrir sem salvar»**, **«Cancelar»**. Sem alteração, troca direto com o Desfazer. Atende o pedido do dono (confirmação com salvar e nomear `[relatado pelo dono]`) sem cobrar confirmação de quem não tem nada a perder. **Recomendada.**
- O modal é componente próprio, bilíngue — **não** `window.confirm`.

### E7. Exportar só as escolhidas

- **E7-a. O mesmo componente de lista do E5**, com o botão «Exportar N». O arquivo continua `{version, game, builds:[…]}`, mesmo com uma build só — o importador já lê os dois formatos. **Recomendada.** Exportar uma build só pelo chip (menu do chip) fica de fora: o modal com uma marcada resolve sem segundo caminho.

### E8. Filtrar, ordenar e agrupar os salvos

- E8-a. Filtros por classe, equipamento e vantagem; agrupamento por classe. **Barrada.** Os filtros por equipamento e vantagem resolvem um problema de catálogo (milhares de itens), não de uma lista pessoal; o agrupamento por classe já existe por cor e ícone (M5); e cada controle novo ocupa altura numa gaveta de 300 px que tem rolagem própria a partir de 180 px.
- E8-b. Ordenação por data de edição: **já existe** — é a ordem atual, e `createdAt` já é «salvo em» (M1). Nada a fazer, além de **não** chamar o campo de «data de criação» na interface, se algum dia ele aparecer.
- **E8-c. Barrar agora, com gatilho escrito.** Se a lista passar a ter dezenas de builds, o primeiro controle a entrar é uma **busca por nome** (um campo, nenhuma decisão de critério), visível só a partir de ~12 salvos `[estimativa: o que cabe sem rolar, M5]`. Gatilho: um relato de usuário, ou do dono, de lista que não se acha mais. **Recomendada.**

### E9. O interruptor «código no texto exportado»

- **E9-a.** Com o link no ar, o texto exportado passa a terminar com o **link**, não com o código. O interruptor muda de nome («incluir link») e continua desligado por padrão. Cai de ~1.480 para ~600 caracteres anexados e fecha a pergunta do IDEAS de 2026-07-27: o código deixa de ser coisa que se mostra e vira formato interno do link. **Recomendada.**

---

## Recomendação

**Um pacote em três fatias, nesta ordem — a primeira sem esperar as outras:**

1. **Fatia 0 — corrigir antes de abrir portas (código, pequena).** D1: carregar salvo ou código passa a pôr o nome da build no campo. D3 + D2: validador único endurecido (E1-a), e `importFile` passa por ele. D5 e D6 de carona, por serem uma linha cada. Sem interface nova. **Motivo da ordem:** D1 é perda de dado no uso de hoje; e toda porta nova herdaria D2/D3.
2. **Fatia 1 — o componente de lista com seleção.** Modal de importação (E5-a), pelo botão **e** pelo arrasto em qualquer ponto; exportação seletiva no mesmo componente (E7-a); proteção da build aberta com instantâneo + Desfazer + modal só com alteração (E6-c).
3. **Fatia 2 — o link.** Código novo comprimido e versionado (E2-b) no fragmento (E3-a); leitura do código antigo mantida; o campo «Colar código» aceita link; o texto exportado anexa o link (E9-a). Ao abrir pelo link, a ferramenta **limpa o fragmento** depois de carregar — senão recarregar a página reimporta por cima do que a pessoa editou.

**Barrados, com o motivo registrado:** link curto (E4), filtros e agrupamento (E8-a). **Adiado com gatilho:** QR (E4), busca por nome (E8-c).

**O melhor argumento contra:** a Fatia 1 é a maior mudança de interface desde a DEC-029, e o pedido que a motiva vem de um usuário só — o dono —, sem medição de quantos arquivos com várias builds circulam. Se a importação de vários arquivos for rara, o modal é cerimônia. A resposta: o mesmo componente serve à exportação seletiva e ao conflito de nomes, que existem com uma build só; e a Fatia 0 e a Fatia 2 não dependem dela — dá para fazer 0 → 2 → 1 se o dono preferir o link antes.

---

## Riscos

| Risco | Sinal cedo | Conferência |
|---|---|---|
| **D1 não reproduzir** (a leitura estar errada) | o nome muda ao carregar | **do dono, na tela:** salve «A» (Samurai) e «B» (Ronin); com «B» no campo, clique em «A»; clique em Salvar. **Certo hoje (defeito):** «B» passa a ser Samurai e «A» continua. Se «A» aparecer no campo ao carregar, D1 não existe e sai da Fatia 0 |
| Validador endurecido recusar saves antigos legítimos | build salva que abria deixa de abrir | sonda no Code: rodar o validador novo sobre um `localStorage` exportado do dono (`got-legends-builds.json`) e listar recusas, uma por linha, com o motivo |
| Compressão assíncrona quebrar a cópia no Safari | botão Texto/Copiar link sem efeito no iPhone | gerar o link quando a build muda (com atraso curto), não no clique; conferência do dono num Safari |
| Link antigo quebrar quando `data.js` mudar | build do link abre com slot vazio | o validador zera id desconhecido **e avisa** («2 itens desta build não existem mais»), nunca falha em silêncio |
| O fragmento reimportar ao recarregar | edição perdida após F5 | limpar o `#b=` com `history.replaceState` depois de carregar |
| Texto exportado com link ainda passar de 2.000 caracteres | Discord recusa a mensagem | medir o comprimento do Estatístico com link antes de fechar a Fatia 2 |
| O arrasto capturar arquivos que não são build (imagem solta por engano) | tela pisca e nada acontece | aceitar só `.json`; qualquer outro tipo mostra aviso bilíngue e não abre o modal |

---

## Ponto de decisão

**Aprova o pacote como está — Fatia 0 já, depois Fatia 1 e Fatia 2 (ou 2 antes de 1), com link curto e filtros barrados e QR adiado?**

Se aprovar, o próximo turno escreve a WO da Fatia 0 (código, `src/logic.js` e `src/App.jsx`), que versiona também esta análise e o `_TEMPLATE.md`. Se discordar de um eixo, basta dizer qual (E2 a E9): os outros não dependem dele, exceto E9, que depende de E2/E3.

---

## Fontes

- Discord — limites de conta e mensagem: https://support.discord.com/hc/en-us/articles/33694251638295
- web.dev — Compression Streams em todos os navegadores: https://web.dev/blog/compressionstreams
- caniuse — `deflate-raw` no `CompressionStream`: https://caniuse.com/mdn-api_compressionstream_compressionstream_deflate-raw
- Estado no fragmento da URL, com o Mermaid Live como referência: https://curtcox.github.io/SFWA
- Planejador que trata o link como o save (Enshrouded): https://pindrop.gg/enshrouded/guides/skill-calculator-planner
- Reclamação de link longo num planejador (Dragon's Crown): https://lr.us.psf.lt/r/DragonsCrown/comments/1cazhg1/dragons_crown_planner_released
- Arrastar arquivo: alternativa sem arrasto (W3C, via Filestack): https://blog.filestack.com/accessible-react-file-upload/?amp=1
- Polaris (Shopify) — zona de soltura na página inteira: https://polaris.shopify.com/components/drop-zone
- Confirmar × desfazer, e o `confirm()` nativo: https://uiux-atlas.pages.dev/lessons/interaction-design/error-prevention-undo-and-recovery-design
- Escada de fricção por consequência: https://www.saasui.design/blog/saas-destructive-actions-confirmation-ux-patterns
- Baymard — participantes não passavam de ~10 itens: https://baymard.com/research-articles/contextual-list-item-information
- Capacidade e legibilidade do QR: https://dev.to/thejayedge/the-qr-code-capacity-cliff-why-a-shortened-url-scans-more-reliably-than-a-long-one-1l34
