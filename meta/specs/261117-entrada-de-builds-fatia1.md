# SPEC — Entrada de builds, Fatia 1: lista com seleção, arrasto e proteção da build aberta

> **Status:** Aprovada pelo dono em 2026-11-17, como está. WO A = `wo0038`. Único ajuste depois da aprovação: o aviso de rodapé passou da WO A para a WO B, onde é usado pela primeira vez (na WO A seria código sem uso, impossível de conferir na tela).
> **Data:** 2026-11-17
> **Origem:** `meta/analises/261116-ANALISE-entrada-e-saida-de-builds.md` (eixos E4 a E7), decidida na DEC-038. A Fatia 0 (`wo0036`) já está aplicada e conferida.
> **Marcas:** `[medido]` = lido no código neste turno · `[decisão da spec]` = escolha técnica minha, que o dono pode trocar ao aprovar.

---

## Problema

Hoje, `[medido]`:
- **Importar `.json` grava tudo nos salvos, sem escolha.** O arquivo pode trazer dez builds; não dá para pegar só duas. Nome repetido entra duplicado, e o Salvar seguinte com esse nome apaga **as duas** (o `save()` deduplica por nome).
- **Exportar baixa todas as builds**, sem escolha.
- **Soltar um arquivo na página é perigoso.** O app não trata arrasto nenhum (nenhum `onDrop`/`dragover` em `src/`). O navegador faz o padrão: **abre o arquivo no lugar da ferramenta**, e a build aberta, se não estava salva, some.
- **Abrir uma build (chip, código) troca a build aberta sem perguntar e sem volta.** Quem estava montando outra e não salvou perde o trabalho com um clique.
- **A lista de salvos e a gravação vivem dentro do `SaveDrawer`** (`saves`, `persist`). Com a gaveta fechada, nada fora dela consegue importar — e o arrasto precisa funcionar com a gaveta fechada.

## Critérios de aceite (verificáveis)

> Conferíveis na tela, nos dois idiomas e nos dois temas. Onde aparece um texto entre aspas, é o PT-BR; o EN equivalente é parte do critério.

### A. Importar pelo botão — o modal da lista
- [ ] **A1.** «⬆ Importar» na gaveta → escolher um `.json` válido → abre um **modal com uma linha por build do arquivo**: caixa de seleção, ícone e cor da classe, nome. Nada é gravado antes de confirmar.
- [ ] **A2.** Todas as linhas válidas vêm **marcadas**. Há «Selecionar todas» e «Nenhuma».
- [ ] **A3.** Linha **inválida** (a Fatia 0 recusa) aparece **desmarcada e desabilitada**, com o motivo em uma linha: «não é uma build do GoT Legends», «estrutura incompleta» ou «classe desconhecida». Nunca some da lista.
- [ ] **A4.** Linha cujo nome **já existe** nos salvos mostra o aviso «já existe uma build com este nome» e uma escolha **«Manter as duas»** (padrão) × **«Substituir»**. Com «Manter as duas», a importada entra como «Nome (2)» (ou o próximo número livre).
- [ ] **A5.** Linha **idêntica** a uma salva de mesmo nome (mesma build, campo a campo) aparece **desmarcada**, com «já está nos salvos». Marcá-la de novo segue o A4.
- [ ] **A6.** O botão principal diz **«Importar N para os salvos»**, com N = marcadas; com N = 0, fica desabilitado. Confirmar grava, fecha o modal, mostra «✓ N importadas» e **não troca a build aberta**.
- [ ] **A7.** Com **exatamente uma** marcada, aparece o segundo botão **«Importar e abrir»**: grava e abre essa build, passando pela proteção da seção C.
- [ ] **A8.** Arquivo que não é JSON, ou não é exportação desta ferramenta, **não abre o modal**: mostra «✗ Este arquivo não é uma exportação do GoT Legends Planner». Os salvos ficam como estavam.
- [ ] **A9.** «Cancelar», `Esc` ou clique fora do modal fecham **sem gravar nada**.
- [ ] **A10.** Um arquivo com **uma** build só (o formato antigo, objeto solto) também passa pelo modal, com uma linha.

### B. Arrastar um `.json` para qualquer ponto da tela
- [ ] **B1.** Arrastar um arquivo do sistema sobre a janela — **com a gaveta aberta ou fechada**, nos modos de 3 e 2 colunas — mostra uma camada sobre a tela inteira: «Solte o .json para importar».
- [ ] **B2.** Soltar um `.json` abre **o mesmo modal da seção A**, com o mesmo comportamento.
- [ ] **B3.** Soltar qualquer outro tipo de arquivo **não sai da ferramenta**: mostra «✗ Só arquivos .json podem ser importados», e a build aberta continua na tela.
- [ ] **B4.** Soltar **mais de um arquivo** de uma vez: «✗ Solte um arquivo por vez», nada é importado.
- [ ] **B5.** Arrastar e **desistir** (sair da janela, ou `Esc`) some com a camada, sem efeito.
- [ ] **B6.** Arrastar **texto ou uma imagem de dentro da própria página** não mostra a camada.
- [ ] **B7.** O botão «⬆ Importar» continua existindo e fazendo o mesmo — é a alternativa sem arrasto.

### C. Proteção da build aberta (clique num salvo, «Carregar» código, «Importar e abrir»)
- [ ] **C1.** Sem alteração desde a última vez que a build foi aberta, salva ou criada: a troca é **direta**, como hoje, e aparece um aviso no rodapé da tela — «Build "X" aberta» — com o botão **«Desfazer»**, por ~8 segundos.
- [ ] **C2.** «Desfazer» volta **a build e o nome** que estavam abertos antes da troca. Depois de desfeita, o aviso some.
- [ ] **C3.** **Com alteração não salva:** antes de trocar, um modal pergunta, com o nome de quem vai entrar: **«Salvar como…»** (campo de nome preenchido com o nome atual), **«Abrir sem salvar»** e **«Cancelar»**.
- [ ] **C4.** «Salvar como…» salva a aberta com o nome do campo e então troca. Se o nome já existe nos salvos, o modal avisa **antes** de confirmar: «isto substitui a build salva "X"».
- [ ] **C5.** «Abrir sem salvar» troca e mostra o «Desfazer» do C1 — a perda ainda tem volta por ~8 segundos.
- [ ] **C6.** «Cancelar» (ou `Esc`) não troca nada.
- [ ] **C7.** O que conta como alteração: **a build** (classe, habilidade, técnicas, itens, propriedades, valores, vantagens). Mudar **só o nome** não conta. A ferramenta acabou de abrir, com a build vazia intocada: não conta. Depois do 🎲: conta.
- [ ] **C8.** Depois de Salvar, a build deixa de contar como alterada até a próxima mudança.

### D. Exportar só as escolhidas
- [ ] **D1.** «⬇ Exportar» na gaveta abre **o mesmo modal de lista**, agora com os salvos, todos marcados, e o botão **«Exportar N»**.
- [ ] **D2.** Com uma marcada, o arquivo se chama `got-legends-<nome>.json` (nome sem caracteres inválidos); com várias, `got-legends-builds.json`, como hoje.
- [ ] **D3.** O arquivo exportado **reimporta** pelo modal da seção A, com as mesmas builds e nomes.
- [ ] **D4.** Sem salvos, «Exportar» segue desabilitado, como hoje.

### E. Transversais
- [ ] **E1.** Toda string nova aparece nos **dois idiomas** — conferir na tela, alternando PT/EN com o modal aberto.
- [ ] **E2.** Modais e camada de arrasto legíveis nos **dois temas**.
- [ ] **E3.** O modal com uma lista longa (o arquivo de teste terá 20 builds) **rola por dentro**, sem barra de rolagem na página e sem empurrar nada ao passar o cursor nas linhas.
- [ ] **E4.** Regressão: salvar, clicar num salvo, ✕ de um chip, «Apagar tudo», código (copiar e carregar), Texto e Imagem seguem como hoje.
- [ ] **E5.** `npm run build` passa sem erro.

## Decisões de design

- **A lista de salvos sobe para o `App`.** `saves`, a leitura do `localStorage` e o `persist` saem do `SaveDrawer` e passam a ser do `App` (um hook dele), que os entrega à gaveta, ao modal e ao arrasto. Sem isso, o arrasto com a gaveta fechada não tem onde gravar. `[decisão da spec]` A alternativa — o arrasto só abrir a gaveta e deixar a gaveta importar — foi descartada: faria a gaveta virar dependência de uma ação que não é dela.
- **Um componente de lista para os dois sentidos** (DEC-038, E7-a): o mesmo modal em modo «importar» ou «exportar», mudando a fonte das linhas e os botões.
- **Instantâneo para «alteração não salva».** O `App` guarda uma cópia da build no momento em que ela foi **aberta, salva ou criada**; alteração = a build atual difere dessa cópia. Comparação por conteúdo, não por referência. `[decisão da spec]`
- **«Desfazer» guarda um nível só** — a build e o nome de antes da última troca —, por ~8 s. `[decisão da spec: 8 s]` Mais níveis é o Undo/Redo da F5, outra coisa.
- **Um aviso de rodapé no nível do `App`**, para o que acontece fora da gaveta (Desfazer, erros do arrasto). O aviso que já existe dentro da gaveta continua para as ações da gaveta. Altura fixa, para não empurrar nada (armadilha 23).
- **Erro com código, texto por idioma** (D4 da análise): `deserializeBuild` passa a devolver um **código** além da frase atual; o modal traduz o código. A frase em PT-BR continua, para não quebrar quem a lê hoje.
- **Nome repetido: «Manter as duas» é o padrão**, com sufixo « (2)». Substituir é sempre escolha explícita, linha a linha. Motivo: o `save()` deduplica por nome, e dois iguais na lista armam a sobrescrita dupla.
- **Toda build importada ganha `id` novo.** Resolve a colisão de `id` de vez; o que decide «já está nos salvos» é nome + conteúdo (A5), não o `id`.
- **Modais centralizados por flexbox, sem `transform`** — o mesmo padrão do `SettingsModal` (FIX-011, armadilha 17). `Esc` fecha. Componentes próprios, **não** `window.confirm`.

## Fora de escopo

- **O link (`#b=`), o aviso de item inexistente e a compressão** — Fatia 2.
- **Trocar o `window.confirm` do «Apagar tudo»** pelo modal novo — vale fazer, mas é outro pedido; fica como ideia.
- **«Desfazer» de importação para os salvos** — importar sem abrir não destrói nada (os chips saem pelo ✕).
- Renomear salvos, reordenar a lista, busca e filtros (DEC-038: busca adiada, filtros barrados).
- Mexer no `ExportPanel` (Texto/Imagem) e no código Base64.

## Riscos e armadilhas em jogo

- **Armadilha 17 / FIX-011** — `transform` em ancestral captura os `position: fixed` (o `Tooltip` é fixed). Modais e a camada de arrasto: flexbox.
- **Armadilha 23** — texto que muda precisa de altura fixa: o aviso de rodapé e a linha de motivo das linhas do modal.
- **Armadilha 13** — 3 colunas × 2 colunas: a camada de arrasto e os modais são sobreposições de tela inteira e não dependem do layout, mas o critério B1 confere os dois modos.
- **Armadilha 4** — `T` é o objeto do módulo; componente novo lê `T.xxx`, nunca declara o seu.
- **Regra bilíngue** — toda string nova nos dois idiomas (E1).
- **`dragleave` dispara ao passar de um filho para outro** dentro da página: a camada pisca se o «saiu» for detectado ingenuamente. O critério B5 pega isso.
- **Instantâneo de «alteração» com campos que o cálculo normaliza** (`normalizeLegendaryProps` ao abrir): se o instantâneo for tirado antes da normalização, uma build recém-aberta já nasce «alterada». O C1 pega isso — abrir e imediatamente abrir outra não pode perguntar.
- **Subir o estado dos salvos** mexe na gaveta inteira: o E4 é a rede.

## Passos

Três WOs, nesta ordem, cada uma conferível sozinha:

1. **WO A — base, sem mudança visível:** a lista de salvos sobe para o `App`; `deserializeBuild` ganha o código de erro. Conferência: o E4 inteiro — nada pode ter mudado na tela.
2. **WO B — o modal da lista:** o aviso de rodapé; importar pelo botão (seção A) e exportar só as escolhidas (seção D); depois, o arrasto (seção B), que só abre o mesmo modal.
3. **WO C — proteção da build aberta:** instantâneo, «Desfazer» e o modal «Salvar como…» (seção C), ligados ao clique num salvo, ao «Carregar» código e ao «Importar e abrir».

O chat entrega com cada WO um roteiro de tela para o dono e, para a WO B, um arquivo de teste na pasta-pai com 20 builds: uma inválida, uma com nome repetido e uma idêntica a uma salva.

## O que conferir na tela ao terminar

- **Caso feliz:** arrastar o arquivo de teste com a gaveta fechada → modal → desmarcar duas → «Importar 17 para os salvos» → a build aberta não mudou; os chips novos estão lá.
- **Borda:** arquivo com uma build só; arquivo com todas inválidas; nome repetido com «Substituir»; build alterada + «Importar e abrir» → «Salvar como…» com nome já existente.
- **Regressão provável:** a gaveta depois da subida do estado (E4) — principalmente «Apagar tudo» e o contador `(N)` ao lado de «Builds salvas».
