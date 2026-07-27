# spec0020 — Custo em pips, o comando dos Supremos, e o painel de exportação reconstruído

**Data:** 2026-07-27 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner`

**Três frentes, todas confirmadas pelo autor:**

1. **`3 ●` vira `●●●`.** O autor tem razão e eu errei na `spec0019`: custo é quantidade a comparar com o que se tem, e a topbar já mostra a Determinação disponível como pips. `●●●` embaixo de `●●●●●` diz "gasta três dos cinco" sem ler número nenhum.
2. **O comando de ativação existe e é `L1+R1`**, igual para as quatro classes. O renderizador de teclas está pronto desde a `spec0018` e liga sozinho quando o campo aparece.
3. **O painel de exportação passa a separar nível de detalhe de formato**, com o controle segmentado que a pesquisa recomenda. O botão de Código **não entra** — o autor recusou, e a decisão de para onde vai o compartilhamento por link fica para uma fase futura.

**Mais uma correção de casa:** a `spec0019` inseriu uma entrada *Determinação* no `GLOSSARY.md` sem verificar que já havia outra mais abaixo. O executor seguiu a âncora à risca e reportou — a Parte 4 consolida as duas.

**Esta spec toca código.** Rode `npm run build` e siga a conferência da Parte 7.

**Regras de execução:**
- Nenhum `--force`, `rebase` ou `reset --hard`.
- Se **uma** âncora que seja não for encontrada exatamente: **PARE e reporte qual falhou.**

---

## Parte 1 — Levantamento

```
git branch --show-current
git status
```

1. Estamos na `v2-planner`? Se não, **PARE**.
2. A árvore deve estar limpa. Se houver modificação pendente, **PARE e reporte**.

---

## Parte 2 — `src/App.jsx`: o custo vira pips

Três pontos, os mesmos que a `spec0019` tocou.

### 2.1 — Painel da interface

**Âncora:**

```
          {lang === 'en' ? 'Cost:' : 'Custo:'} {ult.cost} ●
```

**Substituir por:**

```
          {lang === 'en' ? 'Cost:' : 'Custo:'} {'●'.repeat(ult.cost)}
```

### 2.2 — Texto exportado

**Âncora:**

```
  if (ult.cost != null) parts.push(`${L ? 'Cost' : 'Custo'}: ${ult.cost} ●`)
```

**Substituir por:**

```
  // Pips em vez de numero: a topbar mostra a Determinacao disponivel do mesmo
  // jeito, entao "●●●" embaixo de "●●●●●" ja diz quanto sobra. Ver DEC-029.
  if (ult.cost != null) parts.push(`${L ? 'Cost' : 'Custo'}: ${'●'.repeat(ult.cost)}`)
```

### 2.3 — Cabeçalho da imagem

**Âncora:**

```
  if (ult?.cost != null) bits.push(`${L ? 'Cost' : 'Custo'} ${ult.cost} ●`)
```

**Substituir por:**

```
  if (ult?.cost != null) bits.push(`${L ? 'Cost' : 'Custo'} ${'●'.repeat(ult.cost)}`)
```

---

## Parte 3 — `src/data.js`: o comando dos Supremos

O campo `cmd` já é lido pelo cabeçalho da imagem desde a `spec0018` — quando ausente, nada é desenhado. Agora ele existe.

**As quatro classes usam o mesmo comando, e ainda assim ele é escrito quatro vezes.** É a DEC-006 em vigor: `data.js` é explícito, sem derivação. Uma constante compartilhada economizaria três linhas e criaria a pergunta "e se uma classe mudar?" — que é exatamente o tipo de dúvida que o dado explícito não tem.

### 3.1 — Samurai

**Âncora:**

```
      id: "furia_de_hachiman",
      nPT: "Fúria de Hachiman", nEN: "Hachiman's Fury",
      cost: 3, strikes: 3,
```

**Substituir por:**

```
      id: "furia_de_hachiman",
      nPT: "Fúria de Hachiman", nEN: "Hachiman's Fury",
      // Comando de ativacao, conferido no jogo. Vira teclas desenhadas no
      // cabecalho da imagem exportada. Ver DEC-029.
      cmd: "L1+R1",
      cost: 3, strikes: 3,
```

### 3.2 — Caçadora

**Âncora:**

```
      id: "olho_de_uchitsune",
```

**Substituir por:**

```
      id: "olho_de_uchitsune",
      cmd: "L1+R1",
```

### 3.3 — Ronin

**Âncora:**

```
      id: "sopro_de_izanami",
```

**Substituir por:**

```
      id: "sopro_de_izanami",
      cmd: "L1+R1",
```

### 3.4 — Assassino

**Âncora:**

```
      id: "golpe_sombrio",
```

**Substituir por:**

```
      id: "golpe_sombrio",
      cmd: "L1+R1",
```

> **Cuidado:** os ids dos Supremos podem aparecer também em `icons.js` ou em outros pontos de `data.js`. Aplique **apenas** dentro do bloco `ult:` de cada classe — a linha seguinte tem que ser `nPT:`. Se a âncora casar em mais de um lugar, **PARE e reporte**.

---

## Parte 4 — `meta/GLOSSARY.md`: consolidar a entrada duplicada

A `spec0019` mandou inserir uma entrada *Determinação* logo após *Magistral*, sem verificar que já existia outra três linhas abaixo. O executor seguiu a âncora e reportou — o comportamento certo.

**Âncora** (as duas entradas, com a linha que as separa):

```
- **Determinação** — recurso gasto pelo Supremo e por algumas habilidades. Em EN: *Resolve*. Representada por **●**: é a unidade da estatística `maxResolve` e o símbolo do custo do Supremo. Foi ★ até 2026-07-26, quando colidia com Magistral (FIX-014).
```

**Substituir por** (a entrada consolidada; a duplicata de baixo sai na âncora seguinte):

```
- **Determinação** — Resolve; recurso que permite usar a habilidade suprema e algumas habilidades de classe. Representada por **●**: é a unidade da estatística `maxResolve`, o símbolo do custo do Supremo, e os círculos da topbar. Foi ★ até 2026-07-26, quando colidia com Magistral (FIX-014).
```

**Âncora** (a duplicata, que agora sai):

```
- **Determinação** — Resolve; recurso que permite usar a habilidade suprema. Em EN: *Resolve*.
```

**Substituir por:** *(nada — apague a linha inteira)*

---

## Parte 5 — `src/App.jsx`: o painel de exportação

### O que a pesquisa diz

O autor pediu para consultar as referências de UX sobre três opções mutuamente exclusivas. O resultado, e o que ele muda no desenho:

- **Um *switch* está descartado.** Switch é para **exatamente dois** estados opostos, com efeito imediato. Três níveis de detalhe não cabem nele — é o erro mais comum quando se pensa "switch" para um seletor de três.
- **O controle segmentado é o padrão certo** para 2–5 opções mutuamente exclusivas, igualmente importantes, todas visíveis, em espaço apertado. O GitLab é explícito: *"contenha 2 ou 3 opções e não passe de 5"*.
- **Botões de rádio** seriam a alternativa — mas são para escolhas que exigem envio explícito num formulário, e ocupam mais espaço vertical do que a topbar tem.
- **A ressalva que quase invalidou tudo:** praticamente todo sistema de design diz que a seleção de um controle segmentado deve ter **efeito imediato e visível** ("results are effective and visible immediately"), e alerta contra usá-lo para configurar uma ação futura. O nosso seletor faz exatamente isso: configura o que os botões de Gerar vão produzir.
- **A saída:** dar a ele um efeito imediato. Uma **linha de descrição que muda na hora** transforma a escolha silenciosa em resposta visível, e de quebra resolve o pedido do autor de manter o "info ao passar o cursor" — a mesma linha reage ao cursor e volta para o selecionado quando ele sai. **Um mecanismo servindo às duas coisas**, em vez de balão sobreposto mais estado invisível.
- **Rótulo à esquerda**, não acima: a regra padrão manda acima, e abre exceção explícita *"quando falta espaço vertical"* — que é o caso da topbar.
- **Segmentos de largura igual**, definida pelo mais longo (*Estatístico*), **sem quebra e sem reticência**. Resolvido com `inline-grid` de três colunas `1fr`.

### O que sai

O botão de **Código** não entra. As ideias de link direto, link curto e QR Code são um terceiro formato com decisões próprias, e o autor prefere tratá-las juntas numa fase futura. O interruptor do código Base64 continua nas Configurações, intocado.

### A substituição

**Âncora de início:**

```
function ExportPanel({ build, stats, lang, buildName, includeShareCode }) {
```

**Âncora de fim:**

```
      </div>

    </div>
  )
}

// ─── SettingsModal ────────────────────────────────────────────
```

**Substituir tudo entre as duas, inclusive, por:**

```jsx
function ExportPanel({ build, stats, lang, buildName, includeShareCode }) {
  const [feedback, setFeedback] = useState(null)

  // O nivel de detalhe e escolhido UMA vez e vale para os dois formatos.
  // Build, Detalhado e Estatistico significam a mesma coisa em imagem e em
  // texto (DEC-022) — a interface anterior obrigava a escolher o mesmo
  // conceito duas vezes, em dois grupos de tres botoes. Ver DEC-029.
  const [mode, setMode] = useState('stats')

  // Nivel sob o cursor. A linha de descricao mostra este quando existe e o
  // selecionado quando nao — e o que da ao controle segmentado o efeito
  // imediato que o padrao exige, e o que substitui o balao de ajuda.
  const [hover, setHover] = useState(null)

  const flash = (key) => { setFeedback(key); setTimeout(() => setFeedback(null), 1500) }

  const handleCopyText = () => {
    const text = generateBuildText({ build, stats, lang, buildName, mode, includeShareCode })
    navigator.clipboard.writeText(text)
      .then(() => flash('txt'))
      .catch(() => flash('txt'))  // copia mesmo se o clipboard falhou silenciosamente
  }

  const handleGenImage = () => {
    generateBuildImage({ build, stats, lang, buildName, mode })
      .then(() => flash('img'))
      .catch(err => {
        // A exportacao e o unico ponto que lanca se o canvas estiver
        // contaminado — o drawImage nao lanca. Ver DEC-026, D7.
        console.error('Falha ao gerar a imagem da build:', err)
        flash('img')
      })
  }

  const L = lang === 'en'

  // As descricoes falam do CONTEUDO, nunca do formato: o mesmo nivel vale
  // para imagem e para texto, e mencionar um dos dois recriaria a confusao
  // que este desenho existe para desfazer.
  const MODES = [
    { id: 'build',
      labelPT: 'Build',       labelEN: 'Build',
      descPT: 'Só os nomes do que está equipado.',
      descEN: 'Names of everything equipped, nothing else.' },
    { id: 'detailed',
      labelPT: 'Detalhado',   labelEN: 'Detailed',
      descPT: 'Os nomes mais a descrição de cada item.',
      descEN: 'The names plus a description for each item.' },
    { id: 'stats',
      labelPT: 'Estatístico', labelEN: 'Statistical',
      descPT: 'Tudo isso mais a tabela de estatísticas calculadas.',
      descEN: 'All of that plus the calculated stats table.' },
  ]
  const shown = MODES.find(m => m.id === (hover || mode)) || MODES[0]

  const groupLabel = {
    fontSize: 9, fontWeight: 800, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: T.muted, whiteSpace: 'nowrap',
  }

  // Botao de gerar: dourado para texto, roxo para imagem — as cores que os
  // dois formatos ja tinham.
  const bGen = (key, tint) => ({
    background: feedback === key ? tint + '44' : tint + '18',
    border: `1px solid ${feedback === key ? tint : tint + '50'}`,
    color: T.text, borderRadius: 6,
    padding: '4px 10px', cursor: 'pointer',
    fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
    transition: 'all 0.15s',
  })

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>

      {/* ── Nivel de detalhe: controle segmentado + descricao viva ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={groupLabel}>{L ? 'Detail' : 'Detalhe'}</span>

          {/*
            inline-grid com colunas 1fr: os tres segmentos saem com a largura
            do mais longo ("Estatistico"), que e o que o padrao pede. Sem gap
            entre eles e com overflow escondido, os tres dividem uma trilha so
            — e o que distingue um controle segmentado de tres botoes soltos.
          */}
          <div role="group"
            aria-label={L ? 'Detail level' : 'Nível de detalhe'}
            style={{
              display: 'inline-grid',
              gridTemplateColumns: `repeat(${MODES.length}, 1fr)`,
              border: `1px solid ${T.border}`,
              borderRadius: 7, overflow: 'hidden', background: T.card,
            }}>
            {MODES.map((m, i) => {
              const on = m.id === mode
              return (
                <button key={m.id}
                  onClick={() => setMode(m.id)}
                  onMouseEnter={() => setHover(m.id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(m.id)}
                  onBlur={() => setHover(null)}
                  aria-pressed={on}
                  style={{
                    background: on ? T.accent + '2e' : 'transparent',
                    color: on ? T.text : T.muted,
                    border: 'none',
                    borderLeft: i ? `1px solid ${T.border}` : 'none',
                    padding: '4px 12px',
                    fontSize: 11, fontWeight: on ? 700 : 500,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'background 0.15s, color 0.15s',
                  }}>
                  {L ? m.labelEN : m.labelPT}
                </button>
              )
            })}
          </div>
        </div>

        {/*
          ALTURA FIXA. A linha troca de texto a cada hover, e sem altura fixa
          um texto de duas linhas empurraria a topbar inteira a cada passada
          do cursor — o mesmo defeito do FIX-011, por outro caminho.
        */}
        <div style={{
          height: 15, marginTop: 3, paddingLeft: 2,
          fontSize: 10, color: T.muted,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {L ? shown.descEN : shown.descPT}
        </div>
      </div>

      {/* ── Gerar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 1 }}>
        <span style={groupLabel}>{L ? 'Generate' : 'Gerar'}</span>

        <Tooltip text={L
          ? 'Downloads a PNG of the build at the selected detail level'
          : 'Baixa um PNG da build no nível de detalhe selecionado'}>
          <button onClick={handleGenImage} style={bGen('img', '#6c5ce7')}>
            {feedback === 'img' ? '✓' : `🖼️ ${L ? 'Image' : 'Imagem'}`}
          </button>
        </Tooltip>

        <Tooltip text={L
          ? 'Copies the build as text at the selected detail level'
          : 'Copia a build como texto no nível de detalhe selecionado'}>
          <button onClick={handleCopyText} style={bGen('txt', T.accent)}>
            {feedback === 'txt' ? '✓' : `📋 ${L ? 'Text' : 'Texto'}`}
          </button>
        </Tooltip>
      </div>

    </div>
  )
}

// ─── SettingsModal ────────────────────────────────────────────
```

---

## Parte 6 — Nada mais em `src/`

Nenhum outro arquivo é tocado. `generateBuildText` e `generateBuildImage` continuam recebendo `mode` e não sabem que a origem dele mudou.

---

## Parte 7 — Build e conferência

Rode `npm run build`. Se falhar, **PARE**.

No dev server:

**Custo em pips**
1. Painel do Supremo: `Custo: ●●●`.
2. Texto exportado: `Custo: ●●●` na linha do Supremo.
3. Imagem, cabeçalho: `Custo ●●●`, e os pips da Determinação disponível logo à esquerda — a comparação entre os dois é o ponto.

**Comando do Supremo**
4. Na imagem, entre o nome do Supremo e a linha de números, aparecem **duas teclas desenhadas**: `L1` e `R1`, com um `+` entre elas.
5. As quatro classes mostram o mesmo comando.
6. As teclas **não encostam** na linha de números nem transbordam a faixa do cabeçalho.

**Painel de exportação**
7. O seletor tem **três segmentos numa trilha só**, de **largura igual** — nenhum mais estreito que o outro, e nenhum rótulo quebrando ou com reticência.
8. Clicar num segmento marca só ele; o anterior desmarca.
9. **Passar o cursor** por um segmento troca a linha de descrição na hora; **tirar** o cursor devolve a do selecionado. É o efeito imediato que o padrão exige.
10. **A topbar não se mexe** ao passar o cursor pelos três segmentos. Se ela empurrar, a altura fixa da linha falhou.
11. Nenhuma descrição menciona imagem ou texto — as três falam só do conteúdo.
12. `🖼️ Imagem` baixa o PNG e `📋 Texto` copia, ambos **no nível selecionado**. Troque o nível e confira que a saída muda.
13. O `✓` de confirmação aparece nos dois e some sozinho.
14. **Não existe botão de Código** na barra.
15. O interruptor do código Base64 nas Configurações continua funcionando: com ele ligado, o texto copiado termina com o código.
16. **Navegação por teclado:** Tab chega aos segmentos e a descrição acompanha o foco.
17. **EN**: rótulos `Detail` / `Generate` / `Build` / `Detailed` / `Statistical`, e as descrições em inglês.
18. Confira nos **dois temas** e nos dois modos de layout (3 e 2 colunas) — a topbar é compartilhada (armadilha 13).

Se todos passarem:

```
git add src/App.jsx src/data.js
git commit -m "feat(export): separa nivel de detalhe de formato e usa pips no custo"
```

Não faça `push` ainda.

---

## Parte 8 — `meta/DECISIONS.md`

**Âncora** (último parágrafo do arquivo, fim do FIX-014):

```
O contador de Magistrais no cabeçalho da imagem ganhou o rótulo **MAGISTRAIS** e um afastamento **medido** do número de HP — antes era um espaço fixo, que não sabia se o número tinha dois ou três dígitos. Com a Determinação em círculos, a estrela passou a ser a única coisa contada em estrelas, e nomear o contador fecha a leitura.
```

**Substituir por:**

```
O contador de Magistrais no cabeçalho da imagem ganhou o rótulo **MAGISTRAIS** e um afastamento **medido** do número de HP — antes era um espaço fixo, que não sabia se o número tinha dois ou três dígitos. Com a Determinação em círculos, a estrela passou a ser a única coisa contada em estrelas, e nomear o contador fecha a leitura.

**Emenda de 2026-07-27:** o custo passou de `3 ●` para `●●●`. A primeira forma trocava o símbolo e mantinha o número; a segunda usa a mesma linguagem da topbar, onde a Determinação **disponível** já aparece como pips. `●●●` embaixo de `●●●●●` diz "gasta três dos cinco" sem ler número nenhum — e era isso que a estrela nunca deixou fazer.

---

## DEC-029 — Nível de detalhe e formato são escolhas separadas

**Data:** 2026-07-27 · **Status:** aceita, em vigor

### O problema
O painel de exportação tinha **seis botões em dois triplos** — Texto {Build, Detalhado, Estatístico} e Print {Build, Detalhado, Estatístico}. Mas Build, Detalhado e Estatístico **significam exatamente a mesma coisa nos dois formatos**; a DEC-022 define os três níveis sem mencionar meio. A interface obrigava a escolher o mesmo conceito duas vezes, em dois lugares, como se fossem coisas diferentes.

Não era excesso de botões: eram duas dimensões independentes — nível × formato — achatadas numa lista só.

### A decisão
Desdobrar as duas. O **nível de detalhe** vira um controle segmentado de três opções, escolhido uma vez; o **formato** vira duas ações, `🖼️ Imagem` e `📋 Texto`. Cinco controles no lugar de seis, e as seis combinações continuam todas alcançáveis.

### O que a pesquisa determinou do desenho
O autor pediu que as referências de UX fossem consultadas antes de desenhar. Quatro pontos vieram de lá e não da intuição:

1. **Um *switch* está fora.** Switch é para dois estados opostos. Três níveis não cabem — é o engano mais comum quando se pensa "switch" para um seletor de três.
2. **Controle segmentado é o padrão** para 2–5 opções mutuamente exclusivas, igualmente importantes, todas visíveis e em espaço apertado. Botões de rádio seriam a alternativa, mas pressupõem envio explícito e pedem mais altura do que a topbar tem.
3. **A ressalva que quase invalidou a escolha:** a literatura é consistente em dizer que a seleção de um segmentado precisa ter **efeito imediato e visível**, e desaconselha usá-lo para configurar uma ação futura — que é justamente o nosso caso.
4. **Segmentos de largura igual**, definida pelo rótulo mais longo, sem quebra e sem reticência. Rótulo à esquerda em vez de acima, exceção que a própria regra abre quando falta espaço vertical.

### A linha de descrição resolve duas coisas de uma vez
A ressalva do ponto 3 foi resolvida dando ao seletor um efeito imediato: uma **linha de descrição abaixo do controle, que muda no instante da escolha**. E ela também reage ao cursor — mostra o nível apontado e volta para o selecionado quando o cursor sai.

Isso substitui os balões de ajuda que existiam em cada um dos seis botões: **um mecanismo servindo às duas necessidades**, sem sobreposição e sem estado invisível. Os balões continuam onde ainda fazem sentido — nos dois botões de Gerar, que explicam o formato, não o conteúdo.

As três descrições falam **só do conteúdo**, nunca do meio. Mencionar imagem ou texto nelas recriaria em palavras a confusão que o desenho existe para desfazer.

A linha tem **altura fixa**. Sem isso, um texto de duas linhas empurraria a topbar a cada passada do cursor — o mesmo defeito do FIX-011 por outro caminho.

### O que ficou de fora, e por quê
Um botão de **Código** foi proposto e **recusado pelo autor**. O código Base64, o link direto para a ferramenta, o link curto e o QR Code são um terceiro formato com decisões próprias — onde vivem, se substituem o Base64, se dependem de encurtador. Tratar isso agora seria decidir de afogadilho a parte mais difícil. O interruptor do Base64 continua nas Configurações, e o assunto fica para uma fase futura.

### O comando de ativação
`cmd: "L1+R1"` entrou nos quatro Supremos de `data.js`, conferido no jogo pelo autor. As quatro classes usam o mesmo comando e ainda assim ele é escrito quatro vezes — DEC-006 em vigor: `data.js` é explícito. Uma constante compartilhada economizaria três linhas e criaria a dúvida "e se uma classe mudar?", que é o tipo de pergunta que dado explícito não tem.
```

---

## Parte 9 — `meta/CONTEXT.md`

**Âncora** (fim da armadilha 21, última da lista):

```
21. **`★` é de Magistral. `●` é de Determinação. Não troque.** A estrela marca item Magistral no selo, no `<select>`, no texto exportado, no cartão da imagem e no contador `★☆☆`; o círculo é a unidade de `maxResolve` e o custo do Supremo. Já foram a mesma coisa, e o resultado era *Determinação* `★★★★` na tabela logo abaixo de *Slots Magistrais* (FIX-014). Símbolo é vocabulário: um significado por caractere.
```

**Substituir por:**

```
21. **`★` é de Magistral. `●` é de Determinação. Não troque.** A estrela marca item Magistral no selo, no `<select>`, no texto exportado, no cartão da imagem e no contador `★☆☆`; o círculo é a unidade de `maxResolve` e o custo do Supremo, sempre **repetido** (`●●●`), nunca como número mais símbolo. Já foram a mesma coisa, e o resultado era *Determinação* `★★★★` na tabela logo abaixo de *Slots Magistrais* (FIX-014). Símbolo é vocabulário: um significado por caractere.

22. **O nível de detalhe é um só para os dois formatos.** Build, Detalhado e Estatístico significam a mesma coisa em imagem e em texto (DEC-022), e o painel de exportação escolhe o nível **uma vez**, num controle segmentado, e o formato separado. Acrescentar um formato novo é acrescentar um botão de Gerar — **não** um triplo novo de níveis. Ver DEC-029.

23. **Texto que muda com o cursor precisa de altura fixa.** A linha de descrição do seletor de detalhe troca a cada hover; sem altura fixa, uma descrição de duas linhas empurra a topbar inteira a cada passada do cursor. É o FIX-011 por outro caminho, e a mesma regra do aviso de "salvo" na gaveta de builds.
```

---

## Parte 10 — `meta/CHANGELOG.md`

**Âncora** (a primeira linha da subseção «### Modificado»):

```
- No cabeçalho da imagem, o contador de Magistrais ganhou o rótulo **MAGISTRAIS** e um afastamento medido do número de HP, que antes era fixo e não sabia se o número tinha dois ou três dígitos
```

**Substituir por:**

```
- **O painel de exportação separou nível de detalhe de formato.** Eram seis botões em dois triplos, e Build/Detalhado/Estatístico significam a mesma coisa nos dois — agora o nível é escolhido uma vez num controle segmentado, com uma linha de descrição que muda ao selecionar e ao passar o cursor, e o formato virou dois botões: 🖼️ Imagem e 📋 Texto (DEC-029)
- O custo do Supremo passou a ser mostrado como pips (`●●●`) em vez de número mais símbolo, na mesma linguagem dos círculos de Determinação da topbar
- Os quatro Supremos ganharam o comando de ativação (`L1+R1`), que aparece como teclas desenhadas no cabeçalho da imagem
- No cabeçalho da imagem, o contador de Magistrais ganhou o rótulo **MAGISTRAIS** e um afastamento medido do número de HP, que antes era fixo e não sabia se o número tinha dois ou três dígitos
```

---

## Parte 11 — `meta/STATUS.md`

**Âncora** (último parágrafo do arquivo):

```
**Próximo passo:** duas frentes em aberto, à escolha do autor — fechar as pendências acumuladas (o `cmd` dos quatro Supremos, o destino de `getAvailableProps`/`getAvailablePerks`, a duplicação de `selectTech`/`selectAbility`, as cópias soltas de `GUIA_COMPLETO*.md`), ou decidir a simplificação dos botões de exportação, cuja proposta foi apresentada ao autor.
```

**Substituir por:**

```
**Próximo passo:** duas frentes em aberto, à escolha do autor — fechar as pendências acumuladas (o `cmd` dos quatro Supremos, o destino de `getAvailableProps`/`getAvailablePerks`, a duplicação de `selectTech`/`selectAbility`, as cópias soltas de `GUIA_COMPLETO*.md`), ou decidir a simplificação dos botões de exportação, cuja proposta foi apresentada ao autor.

---

**2026-07-27 — exportação reconstruída, custo em pips, comando dos Supremos (DEC-029).**

- **O custo virou `●●●`.** O autor corrigiu a `spec0019`: trocar a estrela pelo círculo e manter o número (`3 ●`) resolvia a colisão e perdia a oportunidade. A topbar já mostra a Determinação **disponível** como pips, então `●●●` embaixo de `●●●●●` diz "gasta três dos cinco" sem ler número nenhum.
- **`cmd: "L1+R1"` nos quatro Supremos**, conferido no jogo. O renderizador de teclas estava pronto e desligado desde a `spec0018`; agora liga. As quatro classes usam o mesmo comando e ainda assim ele é escrito quatro vezes — DEC-006 em vigor.
- **O painel de exportação separou nível de formato.** Eram dois triplos independentes para um conceito que é um só (DEC-022). Agora: um controle segmentado de três níveis, escolhido uma vez, e dois botões de Gerar.

**A pesquisa mudou o desenho, e vale registrar como.** O autor pediu que as referências de UX fossem consultadas em vez de eu decidir por instinto, e três coisas vieram de lá: *switch* está descartado (é para dois estados, não três); controle segmentado é o padrão para 2–5 opções mutuamente exclusivas em espaço apertado; e — o ponto que quase invalidou tudo — **a seleção de um segmentado precisa ter efeito imediato**, e a literatura desaconselha usá-lo para configurar uma ação futura, que é exatamente o nosso caso.

A saída foi dar-lhe efeito imediato: uma **linha de descrição que muda na hora**, e que também reage ao cursor. Ela substitui os balões de ajuda dos seis botões antigos — um mecanismo no lugar de dois — e as três descrições falam só do **conteúdo**, nunca do formato, porque mencionar imagem ou texto recriaria em palavras a confusão que o desenho desfaz. Altura fixa, senão a topbar tremeria a cada passada do cursor (armadilha 23).

**Recusado de propósito:** o botão de Código. Base64, link direto, link curto e QR Code são um terceiro formato com decisões próprias, e o autor preferiu tratá-los juntos numa fase futura. O interruptor do Base64 fica nas Configurações.

**Corrigido de casa:** a `spec0019` inseriu uma entrada *Determinação* no `GLOSSARY.md` sem verificar que já havia outra três linhas abaixo. O executor seguiu a âncora e reportou; as duas foram consolidadas.

**Próximo passo:** a limpeza acordada com o autor — o destino de `getAvailableProps`/`getAvailablePerks` (armadilha 14, sem consumidor), a duplicação de `selectTech`/`selectAbility` e a do formatador de stats entre `logic.js` e o `StatsPanel`, e as cópias soltas de `GUIA_COMPLETO*.md` fora do repositório.
```

---

## Parte 12 — `meta/IDEAS.md`

**Âncora** (o título da seção de ideias ativas do assistente — cole a nova entrada logo antes da primeira ideia datada):

```
### 2026-07-24 — Seletor "Só alteradas" *(respondido em 2026-07-25 — encerrado)*
```

**Substituir por:**

```
### 2026-07-27 — Onde vive o compartilhamento por link
Um botão de **Código** ao lado de Imagem e Texto foi proposto e recusado pelo autor: confunde, porque não é um formato de leitura como os outros dois. A observação abre um assunto maior, que vale tratar de uma vez em vez de aos pedaços.

Há hoje **quatro** ideias de compartilhamento espalhadas, e elas competem entre si:
1. **Código Base64** — existe, e é um interruptor nas Configurações que altera o fim do texto copiado.
2. **URL com a build na query string** (`?b=eyJ...`) — está na F4 do `ROADMAP.md`.
3. **Link curto** — mencionado, sem decisão; depende de encurtador, e encurtador é serviço externo num projeto 100% client-side.
4. **QR Code** — está na F5, e depende da URL curta existir.

**A pergunta que decide as quatro:** se a URL com a build embutida funcionar, o Base64 vira redundante — quem quer passar uma build passa um link, não um blocão de texto. Nesse caso o interruptor das Configurações some, a F4 absorve o assunto inteiro, e o painel de exportação ganha no máximo **um** controle novo, não três.

Vale resolver isso **na F4**, junto com a URL, e não antes.

### 2026-07-24 — Seletor "Só alteradas" *(respondido em 2026-07-25 — encerrado)*
```

---

## Parte 13 — `logs/2026-07-27.md`

**Crie** o arquivo com este conteúdo:

```markdown
# Log — 2026-07-27

## Sessão 1 — Exportação reconstruída, pips e comando dos Supremos

### Objetivo da sessão
Três coisas confirmadas pelo autor: custo em pips, o comando `L1+R1` dos Supremos, e a reconstrução do painel de exportação com pesquisa de UX por trás.

### Feito
- Custo do Supremo passou de `3 ●` para `●●●` nos três pontos.
- `cmd: "L1+R1"` acrescentado aos quatro `ult` de `data.js`; o renderizador de teclas, pronto desde a spec0018, passa a desenhar.
- Pesquisadas as referências de UX sobre três opções mutuamente exclusivas antes de desenhar.
- `ExportPanel` reconstruído: controle segmentado de nível + dois botões de Gerar + linha de descrição viva.
- Consolidada a entrada duplicada de *Determinação* no `GLOSSARY.md`, criada pela spec0019.
- Entregue a `spec0020`.

### Specs entregues / aplicadas
- `260727-spec0020-exportacao-e-pips.md`

### Decisões
- **DEC-029** — nível de detalhe e formato são escolhas separadas. Botão de Código recusado; compartilhamento por link fica para a F4.

### Bugs
- Nenhum.

### Aprendizados / armadilhas
- **A pesquisa mudou o desenho, não confirmou o palpite.** O *switch* que parecia natural é para dois estados, não três; e a ressalva de que um controle segmentado precisa de **efeito imediato** quase invalidou a escolha inteira — foi ela que gerou a linha de descrição viva, que por sua vez substituiu os balões de ajuda. O melhor da solução veio da restrição, não da ideia inicial.
- **Duas dimensões achatadas numa lista viram botões demais.** Seis botões eram nível × formato numa fila só. Desdobrar as duas deu cinco controles e as mesmas seis combinações. Armadilha 22.
- **Texto que muda com o cursor precisa de altura fixa** — senão empurra o que está em volta a cada passada. Armadilha 23, e é o FIX-011 por outro caminho.
- **Trocar o símbolo não era o mesmo que resolver a leitura.** A spec0019 tirou a colisão (`★` → `●`) e manteve o número; o autor viu que a forma repetida (`●●●`) fala a mesma língua da topbar e dispensa a leitura do número.

### Onde parei
Exportação reconstruída. A limpeza acordada é a próxima.

### Próximos passos
1. Limpeza: destino de `getAvailableProps`/`getAvailablePerks`, duplicação de `selectTech`/`selectAbility` e do formatador de stats, cópias soltas de `GUIA_COMPLETO*.md`, `.claude/launch.json`.
2. F4 — polimento, mobile e a decisão única sobre compartilhamento por link.
```

---

## Parte 14 — Fechamento

```
git add meta/DECISIONS.md meta/CONTEXT.md meta/CHANGELOG.md meta/STATUS.md meta/IDEAS.md meta/GLOSSARY.md logs/2026-07-27.md meta/specs/260727-spec0020-exportacao-e-pips.md
git commit -m "docs(meta): registra a DEC-029 e a separacao entre nivel e formato"
git push
```
