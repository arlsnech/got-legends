# IDEAS.md — Brainstorm e Visão

> **Segundo cérebro** do projeto. Nunca perde: ideia implementada vai para «Concluídas»; ideia recusada vai para «Descartadas» com o motivo.

---

## 💡 Ideias Ativas — Usuário

### 2026-06 — URL compartilhável com build encodada
Ao invés de copiar um código Base64 separado, o link já teria a build na query string (`?b=eyJ...`). Usuário abre o link e a build carrega automaticamente.

### 2026-06 — Mais opções de layout / temas visuais
Hoje temos dark/light e 2-col/3-col. Possibilidade de adicionar mais layouts (ex: "ultra-wide" 4 colunas) e variantes de tema (ex: tema com paleta do jogo — tons de cinza e dourado samurai).

### 2026-06 — Altura dinâmica do canvas na Fase 3
`generateBuildImage` usa altura fixa (560/820px). Se uma build tiver muitas propriedades com descrição longa, o conteúdo pode ultrapassar. Calcular a altura real antes de criar o canvas.

### 2026-06 — Presets de build (builds populares pré-carregadas)
Seção "Builds populares" com presets curados do meta atual. Usuário clica e carrega a build inteira.

### 2026-06 — Exportar build como link QR Code
Gerar um QR Code da URL compartilhável direto na ferramenta para facilitar compartilhamento mobile.

---

## 🤖 Ideias Ativas — Assistente

### 2026-06-24 — Verificação de completude da build antes de exportar
Antes de gerar texto/imagem, verificar se a build está "completa" (habilidade selecionada, pelo menos 1 item por slot, props configuradas) e avisar o usuário sobre slots vazios no texto gerado.

### 2026-06-24 — Modo "comparar builds"
Mostrar duas builds lado a lado com diferenças destacadas em verde/vermelho. Útil para comparar variantes da mesma build.

### 2026-06-24 — Altura adaptativa das células no StatsPanel
Grupos de stats com hover que expande a descrição do stat (o que ele representa em termos de gameplay).

### 2026-06-24 — Undo/Redo
A arquitetura imutável do `build` state (funções sempre retornam novo objeto) já facilita muito. Um array de snapshots + índice atual habilitaria Ctrl+Z nativo.

### 2026-07-23 — Selo "Vinculado a: <classe>" no amuleto Magistral
Quando o seletor de classe vinculada foi removido (DEC-015), nada entrou no lugar. O jogador vê props e perks de classe aparecerem no amuleto sem nada na tela dizendo de onde vêm. A proposta original era um selo estático com o emoji e o nome da classe ativa — display puro, sem lógica, já que `linkedClass` sempre acompanha `classId`. Baixo custo, e fecha uma pergunta silenciosa da interface.

### 2026-07-23 — Versionar o `.claude/launch.json`
O Claude Code precisou criá-lo para subir o dev server nas conferências visuais das specs 0003 e 0004, e o apagou nas duas vezes por não estar no `.gitignore` nem previsto em spec. Versioná-lo tornaria a conferência visual barata e repetível — hoje ela custa um arquivo recriado a cada sessão. A recomendação partiu do próprio Code, duas vezes; nunca foi decidida.

### 2026-06-24 — PWA / Offline
Como não há backend, o app funciona offline se instalado como PWA. Adicionar `manifest.json` e service worker básico.

---

## ✅ Concluídas

- **Drawer lateral de saves** — implementado em 1.0.0-beta; substituiu `SavePanel` inline.
- **Ícones SVG de classe nos botões do header** — implementado em 1.0.0-beta.
- **Ícones PNG de técnicas sem filtro CSS** — implementado em 1.0.0-beta (DEC-003).
- **Tema claro** — implementado em 1.0.0-beta com paleta de contraste adequado.
- **HP bar só com bônus** — implementado em 1.0.0-beta; barra aparece só quando HP > 100.
- **Círculos DET dinâmicos** — implementado; só mostra os círculos ativos (FIX-004).
- **Exportação de texto Fase 2** — implementado em 1.0.0-beta; 3 modos, bilíngue, cooldowns calculados.
- **Ícone supremo (CLASS_TECH_FALLBACK) no topo da coluna stats** — `UltimateHeader` implementado.
- **Habilidades lado a lado no modo 2-col** — grid `minmax(160px,1fr)` com `whiteSpace: nowrap`.
- **Botões de export em uma linha com grupos rotulados** — `📋 Texto` e `🖼️ Print`.
- **Código Base64 opcional no texto exportado** — toggle nas configurações.
- **Nome completo dos slots sem emoji** — slotLabel sem emoji; ícone SVG substituiu.
- **Star (★) no final do nome magistral no select** — implementado; não mais na frente.
- **crédito a swiezdo nos créditos** — adicionado no SettingsModal.

---

## 🚫 Descartadas

- **html2canvas para geração de imagem** — descartado porque adiciona ~300KB, tem bugs com elementos fixed/viewport, e o resultado não é customizável. Substituído por Canvas API nativa (DEC-004).
- **React Context para temas** — descartado pela necessidade de `const T = useContext()` em todos os ~15 componentes; T mutável resolve sem overhead (DEC-002).
- **TypeScript** — descartado para manter baixa fricção no desenvolvimento iterativo assistido por IA. Pode ser reconsiderado em v2.
- **Herança de props em magistrais (`...BASE_PROPS`)** — descartado; cada magistral explícito evita bugs sutis (DEC-006).
- **Emoji de classe no select de gear (⚔️ Katana)** — descartado; substituído por ícone SVG.
- **Emoji ✨ e ⭐ nas técnicas** — descartados; ícones PNG do jogo substituem com mais fidelidade visual.
- **Botão de Layout separado no header** — incorporado no SettingsModal (⚙️); header já estava cheio.
- **Barra de HP mostrando os 100 HP base** — descartado; ficava com aspecto de "barra cheia pré-preenchida" o tempo todo. Só bônus é mostrado.

---

## 📌 Feedback para o Kit de Contexto

*(Desvios e melhorias observadas neste projeto que valem levar ao Kit Universal)*

- O `LOG-TEMPLATE.md` poderia ter um campo "Guias entregues" — neste projeto, vários `.md` de guia foram produzidos sem ser logs de sessão, e não há campo natural para rastreá-los.
- A seção "Arquivos Críticos" do `STATUS.md` é muito valiosa; poderia ser padrão no template, não apenas mencionada como opcional.
- Projetos com assistente de IA gerando código precisam de um campo "Pendente de Aplicação" — diferente de "Em Progresso" (trabalho em andamento) e diferente de "Backlog" (não iniciado). O código existe, mas o usuário ainda não aplicou.
- *(2026-07-22)* O `_UPDATE-PROMPT.md` não diz o que fazer quando uma convenção genérica do CEREBRO/INSTRUCOES colide com uma prática já em vigor num projeto em andamento. Deveria dizer explicitamente: **é sugestão, não ordem** — adapte o CEREBRO ao projeto e gere Instruções personalizadas, nunca refatore o projeto para caber no template. (Virou DEC-008.)
- *(2026-07-22)* O prompt de update também não trata o caso de o `INSTRUCOES-DO-PROJETO.md` **não ser um arquivo do repo** — aqui ele vive nas Instruções do Projeto do claude.ai, então não há "vivo" no mount para comparar. O procedimento correto (pegar o template, especializar, respeitar o teto, entregar pronto para colar) deveria estar escrito.
- *(2026-07-22)* O `IDEAS__template-update.md` **não tem a seção «Feedback para o Kit»**, embora o CEREBRO a exija em dois lugares (regra de higiene e tabela de gatilhos). Template incompleto em relação ao próprio comportamento que prescreve.
- *(2026-07-22)* O `LOG-TEMPLATE__template-update.md` continua **sem o campo «Guias entregues»** — feedback já registrado por este projeto e não absorvido em v1.73.
- *(2026-07-22)* O `STATUS__template-update.md` continua **sem a rubrica «Pendente de Aplicação»** — idem. Sugestão concreta: manter `❌ Quebrado` e `⏳ Pendente de Aplicação` como seções distintas, foi o que este projeto adotou.
- *(2026-07-22)* O `GLOSSARY__template-update.md` não prevê seção de **glossário bilíngue de domínio** (aqui: Magistral↔Legendary, Determinação↔Resolve). Em produto multilíngue isso é estrutural, não acessório.
- *(2026-07-22)* O `gitignore__template-update` só cobre lixo de SO/editor e **não traz `node_modules/` nem `dist/`**. Aplicado ao pé da letra por cima de um `.gitignore` de stack, seria regressão grave. Deveria vir marcado no manifesto como **aditivo**, não como substituto.
- *(2026-07-22)* O `CEREBRO__template-update.md` **se contradiz**: a seção «Convenções» pede commits "no imperativo curto em PT-BR" e a seção «Commit pronto ao final» pede Conventional Commits sem acento.
- *(2026-07-22)* Falta ao kit uma classe de artefato para **"guia de aplicação"** (os `GUIA_*.md` deste projeto): não é log, não é doc de contexto, não é spec. O parente próximo é `meta/specs/`, mas o kit não faz essa ponte — e é justamente o formato que deixou a Fase 3 parada desde junho esperando aplicação manual.

---

## 🗄️ Extração retroativa — fila de leitura

Cinco arquivos de conversas antigas foram recuperados em 2026-07-22 e preservados em `meta/legacy/` (DEC-012). Documentam a origem do projeto, antes do KCM. Contêm pedidos, bugs e ideias que **nunca foram registrados em lugar nenhum**. Ver DEC-011 para o método e o porquê da ordem.

| Arquivo | Tamanho | Estado |
|---|---|---|
| `GOT_Build.md` | 40 KB | ✅ lido por inteiro em 2026-07-22 |
| `GOT_Build_-_Joker.md` | 15 KB | ✅ extraído em 2026-07-23 (spec0008) — arquivo removido |
| `GOT_Build_-_Alex.md` | 61 KB | ✅ extraído em 2026-07-23 (spec0009) — arquivo removido |
| `GOT_Build_-_Origem.md` | 197 KB | ✅ extraído em 2026-07-23 (spec0010) — arquivo removido |
| `GOT_Build_-_TOhno.md` | 267 KB | ⏳ próximo — talvez 2 sessões |

**Critério:** não são fatos. São pedidos históricos, muitos já atendidos, alguns contraditórios entre si, com cronologia desconhecida. Nada entra nos `meta/` sem conferência contra o código atual.

### Já extraído do `GOT_Build_-_Joker.md` (2026-07-23) — **não reabrir**
Os três pedidos do arquivo já estão no código; nada dele ficou aberto. Viraram FIX-007 (props de Magistral não sorteadas no 🎲) e DEC-013 (troca de classe propaga a técnica Magistral). O bloco 4 contém uma correção **rejeitada pelo autor** — remover o Magistral excedente ao trocar de classe: se ela reaparecer em algum guia antigo, é ruído, não pendência.

**Calibração do critério, para os próximos arquivos:** o valor do Joker não foi encontrar código faltando — foi encontrar **código sem registro**. Dois consertos em vigor há semanas não existiam em nenhum `meta/`, e um deles estava a um passo de ser lido como já coberto pelo FIX-006. Ler o arquivo perguntando "isso está no código?" acha pouco; perguntar "isso está *registrado*?" acha o que interessa.

### Já extraído do `GOT_Build_-_Alex.md` (2026-07-23) — **não reabrir**
Os cinco pedidos do arquivo estão todos no código. Viraram FIX-008, DEC-014, DEC-015, DEC-016 e DEC-017. Se reaparecerem em outro arquivo antigo, são ruído: correção do `classBinding` injetando props de sub-tipo · perk de desbloqueio obrigatório (Versátil, Zarabatana, Pacote de Bombas, Remédio Proibido) · remoção do seletor de classe vinculada · munições por classe · o `ENAMETOOLONG` do `gh-pages`.

**O critério aguentou o arquivo maior, e uma pergunta nova apareceu:** *"isso está registrado?"* pegou o FIX-008 e as decisões, mas quem pegou as munições foi *"o que este código faz que nenhum `meta/` menciona?"*. São perguntas diferentes — a primeira parte do arquivo antigo, a segunda parte do código. Para o `Origem` (197 KB) e o `TOhno` (267 KB), vale rodar as duas.

### Já extraído do `GOT_Build_-_Origem.md` (2026-07-23) — **não reabrir**
Viraram DEC-018 (tabela canônica de restrição de classe), FIX-009 (Picada Celestial, corrigido), DEC-019 (ranks de fã fora da ferramenta), DEC-020 (Flecha Perfurante por classe, não por técnica), as armadilhas 11 e 12 do `CONTEXT.md` e a seção 8 do `HISTORY.md`. Já conferido como **atendido** no código de hoje, não reabrir: um item por linha nas vantagens de classe · rótulo "Vantagem I/II/III" · 2 vantagens por equipamento (slot de 120 Ki) · Magistral com propriedade **selecionável** e valor travado no máximo · técnica bloqueada quando os Magistrais estão no limite · CDR das duas Armas Fantasma calculado em separado · cores de classe (Caçadora azul, Assassino verde) · Fúria de Hachiman com 3 golpes base · tooltip de técnica sem o payload interno (`legendarySlot +1`, `+stat`) · munição e descrições em EN no modo inglês.

**Terceira pergunta, que só apareceu neste arquivo:** *"o que a ferramenta já teve e não tem mais?"* Os dumps de interface colados pelo autor são fotografias de versões que não existem mais em lugar nenhum — as intermediárias se perderam. Foi assim que os botões de aleatório granulares apareceram. Para o `TOhno`, vale ler os dumps de tela com essa pergunta em mãos.

### 2026-07-23 — Botões de build aleatória granulares *(possível regressão)*
O dump da v1.1 no arquivo de origem mostra **três** botões — `🎲 Tudo`, `🎲 Classe`, `🎲 Gear` — e o `App.jsx` de hoje tem só um. O pedido original ia além: aleatório em cadeia, com botão por equipamento, por propriedade e até por valor de propriedade. Como as versões intermediárias se perderam, não dá para saber em qual reescrita os três viraram um, nem se foi decisão. **Antes de reimplementar, vale perguntar ao autor se a simplificação foi intencional.**

### 2026-07-23 — Flecha Perfurante condicionada à técnica
Completar o pedido original do bloco 13: a munição exclusiva só aparece quando a técnica que a concede está equipada. Hoje aparece sempre para a classe primária (DEC-020). Precisa de dado novo em `data.js` — o vínculo técnica → munição não existe — e de passar as técnicas até `formatAmmoForClass`, que hoje é função pura de exibição. Melhoria, não defeito.

### Já verificado no `GOT_Build.md` — **não reabrir**
Estes pedidos antigos já estão atendidos no código de hoje: estrela do Magistral no fim do nome · ícones dos amuletos (`defense-charm`, `assassin-charm`, `utility-charm`, `hunter-charm`, `benkeis-last-stand`, `shoguns-fortitude`, `lady-sanjos-surprise`) · `half-bow` renomeado para `shortbow` · círculos de Determinação só quando ativos.

### Pergunta antiga ainda em aberto
Nos prompts antigos o autor cogitou **remover o modo Estatístico** caso desse trabalho demais. Ele agora funciona (FIX-005 aplicado na spec0004), mas a pergunta nunca foi formalmente encerrada. Vale confirmar com o usuário em vez de assumir que a correção respondeu por ela.

---

## 📌 Feedback para o Kit de Contexto — leva de 2026-07-23

- O `_UPDATE-PROMPT.md` não trata o caso do `INSTRUCOES-DO-PROJETO.md` **não ser um arquivo do repo**. Neste projeto ele vive nas Instruções do Projeto do claude.ai; não há "vivo" no mount para comparar. O procedimento correto — pegar o template, especializar, respeitar o teto e entregar pronto para colar — deveria estar escrito, em vez de o assistente pedir que o usuário cole o texto atual só para poder comparar.
- Falta ao kit uma **classe de artefato para material legado**: guias de aplicação, conversas antigas, snapshots de versão. Não é log, não é doc de contexto, não é spec. Este projeto resolveu com `meta/legacy/` + `.flatdropignore` (DEC-012) e a solução parece generalizável: **versionado sempre, no mount só quando em pauta**.
- O kit não diz em lugar nenhum que **uma entrada de FIX não deve ser criada a partir de código ainda não aplicado**. Este projeto perdeu um mês com FIX-005 registrado como resolvido enquanto o conserto vivia só num guia. A regra deveria estar no CEREBRO, junto das regras de higiene.
- *(2026-07-23 — FlatDrop, bug de comportamento)* **A reinclusão com `!` não funciona quando a pasta inteira está ignorada.** A `spec0007` escreveu `meta/legacy/` no `.flatdropignore` e recomendou reincluir um arquivo com `!meta/legacy/<arquivo>`. A recomendação está **errada**, e a sintaxe `.gitignore` explica por quê: *não é possível reincluir um arquivo se um diretório-pai dele estiver excluído* — o motor nem chega a avaliar os arquivos de dentro da pasta podada. Não é bug do FlatDrop; é uma regra da sintaxe que ele herda. **O que o FlatDrop poderia fazer:** avisar quando um `!` for anulado por uma exclusão de pasta, em vez de ignorá-lo em silêncio — foi exatamente o silêncio que custou tempo aqui. **Contorno adotado:** enumerar os arquivos legados um a um, em vez da pasta, e comentar a linha do que se quer no mount.
- *(2026-07-23 — FlatDrop, sugestão)* O bloco gerenciado `# >>> flatdrop-editor … # <<<` fica **no fim** do arquivo, e em `.gitignore` **o último padrão que casa é o que vale**. Toda regra manual escrita acima dele pode ser anulada pelo bloco, sem aviso. Vale documentar essa precedência no próprio cabeçalho do bloco, ou colocá-lo no topo.
