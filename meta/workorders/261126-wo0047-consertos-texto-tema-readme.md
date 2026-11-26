# wo0047 — Tres consertos pequenos: ✗ quando Texto ou Imagem falham, botoes no tema claro e o README

**Data:** 2026-11-26 · **Autora:** raia de planejamento (chat) · **Executor:** Claude Code
**Tipo:** WO de CODIGO (`src/App.jsx`) + documentacao (`README.md`) + registro (CHANGELOG, backlog do STATUS).
**Config sugerida:** Sonnet, `/effort` medio.
**Pre-requisito:** a `wo0046` aplicada (o commit da 1.1.0 e a tag `v1.1.0`); arvore limpa fora desta WO.
**Base:** pedido do dono em 2026-11-26 («escreva a WO dos três consertos pequenos (Texto, tema claro, README)»); os tres itens do backlog do STATUS: «O botão Texto mostra ✓ mesmo quando a cópia falha» (2026-11-16), «Botões neutros não acompanham o tema claro» (2026-11-24) e «README desatualizado» (2026-11-23).
**Depende de:** `wo0046` — a Ed. 14 ancora no `_Nada ainda._` que ela poe no CHANGELOG.

> **Ancoras lidas em:** 2026-11-26, neste turno, do disco sem `\r`, recortadas por script. As de uma linha deram **1** ocorrencia; as de varias (Ed. 2, 5, 6, 7, 8, 10) foram recortadas do arquivo. A Ed. 14 foi conferida contra o CHANGELOG ja com a `wo0046` aplicada (simulacao).
> - Ed. 1 — `src/App.jsx`, em `handleCopyText`, no `ExportPanel`.
> - Ed. 2 — `src/App.jsx`, no `.catch` de `handleGenImage` — ANCORA DE 2 LINHAS.
> - Ed. 3 — `src/App.jsx`, o rotulo do botao Imagem.
> - Ed. 4 — `src/App.jsx`, o rotulo do botao Texto.
> - Ed. 5 — `src/App.jsx`, a definicao de `btnSmall` — ANCORA DE 6 LINHAS.
> - Ed. 6 — `src/App.jsx`, a definicao de `btnNeutral` — ANCORA DE 5 LINHAS.
> - Ed. 7 — `src/App.jsx`, o botao de diminuir do `PropInput` — ANCORA DE 2 LINHAS.
> - Ed. 8 — `src/App.jsx`, o botao de aumentar do `PropInput` — ANCORA DE 2 LINHAS.
> - Ed. 9 — `README.md`, «Visão Geral», o item do sistema de saves.
> - Ed. 10 — `README.md`, o bloco da arvore em «Estrutura do Projeto», de `got-legends/` a `index.css` — ANCORA DE VARIAS LINHAS (12).
> - Ed. 11 — `README.md`, «Como Rodar Localmente».
> - Ed. 12 — `README.md`, «Builds de Exemplo».
> - Ed. 13 — `README.md`, «Builds de Exemplo», a instrucao abaixo da descricao.
> - Ed. 14 — `meta/CHANGELOG.md`, o `[Não lançado]` aberto pela `wo0046`.
> - Ed. 15 — `meta/STATUS.md`, «📋 Backlog».
> - Ed. 16 — `meta/STATUS.md`, «📋 Backlog».
> - Ed. 17 — `meta/STATUS.md`, «📋 Backlog».
>
> **Ancora semantica:** trecho que nao bater EXATAMENTE → **PARE e reporte**. **Idempotencia:** procure o texto NOVO inteiro antes de cada edicao; ja aplicado, PULE e diga. Nas remocoes (Ed. 15–17), ja aplicada = a ancora nao esta mais no arquivo.
>
> **Canal dos meta neste ciclo = CODE.** CHANGELOG e o backlog aqui; a entrada de «Ultima Sessao» e o log do dia no `/wrap`, que fecha as duas WOs (`wo0046` e esta).
>
> **Proximo comando:** `/wrap`

---

## 1. Por que

- **✓ falso:** `handleCopyText` e `handleGenImage` chamavam o mesmo `flash` no `.then` e no `.catch`, e o botao mostrava ✓ nos dois casos. Quando a area de transferencia recusa (permissao, aba sem foco), quem cola leva o texto ANTERIOR sem saber. A Imagem tinha o mesmo defeito, na mesma forma — entra junto, avisado ao dono.
- **Tema claro:** `btnSmall` e `btnNeutral` eram objetos literais do modulo, montados com o `T` da carga (tema escuro); o `T` e mutado a cada render, mas os objetos guardavam os valores antigos. Getters nas tres cores fazem o estilo ler o `T` na hora; e os dois usos diretos de `btnSmall` (botoes ▲▼ do `PropInput`) passam a espalhar o objeto, senao o React ve a mesma referencia e nao reaplica o estilo quando o tema muda. Os quatro usos de `btnNeutral` ja espalhavam (`{ ...btnNeutral, … }`).
- **README:** o endereco local (`/got-legends/` so vale no GitHub Pages; local e `/`), a arvore do projeto (contagens de linha velhas, sem `icons.js`, sem `public/`, `meta/` e o workflow — e sem contagens agora, que envelhecem), o sistema de saves e o link da build de exemplo. O link foi gerado pelo chat a partir do proprio codigo do README e volta identico (nome «O Samurai Contra-Ataca», nenhum item perdido, 596 caracteres). O codigo antigo fica, porque o campo da gaveta ainda o aceita.

## Edicao 1 — `src/App.jsx` · Texto mostra ✗ quando falha

**Ancora** (em `handleCopyText`, no `ExportPanel`):

````
      .catch(() => flash('txt'))  // copia mesmo se o clipboard falhou silenciosamente
````

**Substituir por:**

````
      // Falha da área de transferência (permissão negada, aba sem foco) mostra ✗: com ✓
      // aqui, quem colava levava o texto ANTERIOR sem saber (backlog de 2026-11-16).
      .catch(() => flash('txt-err'))
````

## Edicao 2 — `src/App.jsx` · Imagem mostra ✗ quando falha

**Ancora** (no `.catch` de `handleGenImage` — ANCORA DE 2 LINHAS):

````
        console.error('Falha ao gerar a imagem da build:', err)
        flash('img')
````

**Substituir por:**

````
        console.error('Falha ao gerar a imagem da build:', err)
        flash('img-err')   // o mesmo ✓ falso do Texto, na Imagem
````

## Edicao 3 — `src/App.jsx` · o botao Imagem desenha o ✗

**Ancora** (o rotulo do botao Imagem):

````
            {feedback === 'img' ? '✓' : `🖼️ ${L ? 'Image' : 'Imagem'}`}
````

**Substituir por:**

````
            {feedback === 'img' ? '✓' : feedback === 'img-err' ? '✗' : `🖼️ ${L ? 'Image' : 'Imagem'}`}
````

## Edicao 4 — `src/App.jsx` · o botao Texto desenha o ✗

**Ancora** (o rotulo do botao Texto):

````
            {feedback === 'txt' ? '✓' : `📋 ${L ? 'Text' : 'Texto'}`}
````

**Substituir por:**

````
            {feedback === 'txt' ? '✓' : feedback === 'txt-err' ? '✗' : `📋 ${L ? 'Text' : 'Texto'}`}
````

## Edicao 5 — `src/App.jsx` · `btnSmall` le o tema no render

**Ancora** (a definicao de `btnSmall` — ANCORA DE 6 LINHAS):

````
const btnSmall = {
  background: T.card, border: `1px solid ${T.border}`, color: T.text,
  borderRadius: 4, width: 22, height: 22, cursor: 'pointer',
  fontSize: 14, fontWeight: 600, lineHeight: 1, paddingBottom: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
````

**Substituir por:**

````
// Os dois estilos de botão do módulo usam getters nas cores: são lidos no render,
// então seguem o tema ativo (o T é mutado a cada render do App). Como objeto literal,
// guardavam as cores do tema escuro da carga da página e não mudavam no tema claro.
// Quem os usa espalha ({ ...btnSmall }) — uma referência nova a cada render, senão o
// React vê o mesmo objeto e não reaplica o estilo quando o tema muda.
const btnSmall = {
  get background() { return T.card },
  get border() { return `1px solid ${T.border}` },
  get color() { return T.text },
  borderRadius: 4, width: 22, height: 22, cursor: 'pointer',
  fontSize: 14, fontWeight: 600, lineHeight: 1, paddingBottom: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
````

## Edicao 6 — `src/App.jsx` · `btnNeutral` le o tema no render

**Ancora** (a definicao de `btnNeutral` — ANCORA DE 5 LINHAS):

````
const btnNeutral = {
  background: T.cardHov, border: `1px solid ${T.borderHov}`, color: T.text,
  borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12,
  fontWeight: 600, whiteSpace: 'nowrap',
}
````

**Substituir por:**

````
const btnNeutral = {
  get background() { return T.cardHov },
  get border() { return `1px solid ${T.borderHov}` },
  get color() { return T.text },
  borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12,
  fontWeight: 600, whiteSpace: 'nowrap',
}
````

## Edicao 7 — `src/App.jsx` · o botao − espalha o estilo

**Ancora** (o botao de diminuir do `PropInput` — ANCORA DE 2 LINHAS):

````
                aria-label={lang === 'en' ? 'Decrease value' : 'Diminuir valor'}
                style={btnSmall}
````

**Substituir por:**

````
                aria-label={lang === 'en' ? 'Decrease value' : 'Diminuir valor'}
                style={{ ...btnSmall }}
````

## Edicao 8 — `src/App.jsx` · o botao + espalha o estilo

**Ancora** (o botao de aumentar do `PropInput` — ANCORA DE 2 LINHAS):

````
                aria-label={lang === 'en' ? 'Increase value' : 'Aumentar valor'}
                style={btnSmall}
````

**Substituir por:**

````
                aria-label={lang === 'en' ? 'Increase value' : 'Aumentar valor'}
                style={{ ...btnSmall }}
````

## Edicao 9 — `README.md` · sistema de saves

**Ancora** («Visão Geral», o item do sistema de saves):

````
- **Sistema de saves**: salvar/carregar localmente, exportar/importar .json, compartilhar por código
````

**Substituir por:**

````
- **Sistema de saves**: salvar/carregar localmente, importar e exportar `.json` escolhendo as builds (também arrastando o arquivo para a tela), desfazer a troca de build, compartilhar por link
````

## Edicao 10 — `README.md` · estrutura do projeto

**Ancora** (o bloco da arvore em «Estrutura do Projeto», de `got-legends/` a `index.css` — ANCORA DE VARIAS LINHAS (12)):

````
got-legends/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx          — ponto de entrada React
    ├── App.jsx           — interface completa (~1.2k linhas)
    ├── data.js           — banco de dados do jogo (~1.1k linhas)
    ├── logic.js          — motor de cálculo de stats (~1.5k linhas)
    └── index.css         — estilos base
````

**Substituir por:**

````
got-legends/
├── index.html
├── package.json
├── vite.config.js        — caminho-base pelo VITE_BASE_URL (o GitHub Pages usa /got-legends/)
├── tailwind.config.js
├── postcss.config.js
├── netlify.toml · vercel.json · public/_redirects — rota única da SPA em cada host
├── .github/workflows/
│   └── deploy-gh-pages.yml — publica o GitHub Pages a cada push na main
├── public/
│   └── icons/            — SVGs de classe, equipamento e armas fantasma; PNGs das técnicas
├── meta/                 — documentos de contexto do projeto (estado, decisões, changelog)
└── src/
    ├── main.jsx          — ponto de entrada React
    ├── App.jsx           — interface completa
    ├── data.js           — banco de dados do jogo
    ├── logic.js          — motor de cálculo, validação e link de compartilhamento
    ├── icons.js          — mapeamento id → ícone
    └── index.css         — estilos base
````

## Edicao 11 — `README.md` · endereco local

**Ancora** («Como Rodar Localmente»):

````
# Acesse: http://localhost:5173/got-legends/
````

**Substituir por:**

````
# Acesse: http://localhost:5173/
````

## Edicao 12 — `README.md` · titulo dos exemplos

**Ancora** («Builds de Exemplo»):

````
### Códigos de Compartilhamento (Base64)
````

**Substituir por:**

````
### Links de compartilhamento
````

## Edicao 13 — `README.md` · o link da build de exemplo

**Ancora** («Builds de Exemplo», a instrucao abaixo da descricao):

````
<br>*[copie o código abaixo, e então cole-o e carregue]*
````

**Substituir por:**

````
<br>**[Abrir esta build na ferramenta](https://arlsnech.github.io/got-legends/#b=1.hZPNjpwwEIRfZdVnEmVITtyiPc0phzxAqzA94OAf1DaziVa8e2RYZWB_MjdUXZjPXcUzBWrox8NP-FlhHx5jyIpP3zMMqKKWmmcyDimdO2oobS6qCK11Nv9ZVQdvA1h-Ty4mey3vaQw2cKuCPFATZucqymKGVM47U0N9dJMknjReqKLzP4nNrKtQlMusFjzADJy_0lJRL9BywoiMgPJks_gVwio4QecevvBNpzKdNE7r9BeCODAmaKSKrnCzUPPl86leKprqg7dDiGzWPeytq1N0PFFD25RtyNbTJtfU0BRTnhXsZhRaReilO1BCTSxXzPEtY48wRO4kc2dTPlC-hbyK4ywhIX7E6OfAEq47vKLgYguaGaD-SOZnJznyLeL3V2jure9lN-YjLrXZRzYqyezYXvqAVkKRnQ2jdI-leLvalQY8nV4tVMVLSpGz6BrY-9jjPWyVjlUM908nHq1zN_-3Hbx4NgM8Un2IvVPbIW589YHPoIVBiRx5-zVe8ZXvro3r7yR-A6z_A1jqozJJyHvCVlrbgS9Rs9CyLMtf)** · ou copie o código abaixo (formato antigo, ainda aceito) e cole no campo «Link de Compartilhamento» da gaveta
````

## Edicao 14 — `meta/CHANGELOG.md` · os consertos

**Ancora** (o `[Não lançado]` aberto pela `wo0046`):

````
_Nada ainda._
````

**Substituir por:**

````
### Corrigido
- **Os botões Texto e Imagem mostram ✗ quando falham.** Antes mostravam ✓ mesmo quando a cópia ou a geração da imagem falhava, e quem colava levava o texto anterior sem saber.
- **Os botões ▲▼ das propriedades e «Exportar», «Importar» e «Copiar link» da gaveta acompanham o tema claro.** Os estilos deles guardavam as cores do tema escuro da carga da página.

### Documentação
- README: endereço local (`localhost:5173/`), estrutura do projeto, o sistema de saves e o link da build de exemplo.
````

## Edicao 15 — `meta/STATUS.md` · sai o ✓ falso, feito

**Remover a linha inteira** («📋 Backlog»):

````
- [ ] **O botão Texto mostra ✓ mesmo quando a cópia falha** (`handleCopyText`, `App.jsx`: o `.catch` também chama `flash('txt')`). Quando falha, o que se cola é o texto anterior, sem aviso. Achado em 2026-11-16.
````

## Edicao 16 — `meta/STATUS.md` · sai o README, feito

**Remover a linha inteira** («📋 Backlog»):

````
- [ ] **README desatualizado:** manda abrir `localhost:5173/got-legends/` (o caminho-base local hoje é `/`), e a árvore de «Estrutura do Projeto» fala em `App.jsx` de ~1.2k linhas e não cita o `icons.js`. Achado em 2026-11-23.
````

## Edicao 17 — `meta/STATUS.md` · sai o tema claro, feito

**Remover a linha inteira** («📋 Backlog»):

````
- [ ] **Botões neutros não acompanham o tema claro:** `btnNeutral` (e `btnSmall`) são objetos de módulo, montados com o `T` da carga (tema escuro), e não mudam com o tema — os botões «Exportar», «Importar» e «Copiar» da gaveta ficam escuros no tema claro. Os componentes da WO B usam um estilo lido no render (`plainBtn`). Achado em 2026-11-24, lendo o código; **não conferido na tela**.
````

---

## Fora de escopo

- Outros estilos de modulo (`btnAction` e `btnMini` ja sao funcoes; os componentes da WO B usam `plainBtn`).
- O resto do README (mecanicas, fontes, creditos, licenca).

## Armadilhas desta WO

- **Fim de linha:** `src/App.jsx`, `README.md`, `meta/CHANGELOG.md` e `meta/STATUS.md` em CRLF (`git ls-files --eol`). Compare sem `\r` e grave em CRLF.
- **Ed. 7 e 8:** a linha `style={btnSmall}` aparece DUAS vezes; cada ancora inclui a linha do `aria-label` de cima, que e unica.

## Depois de aplicar — conferencia antes do commit

1. **Quem roda:** quem aplica. `git status --short` → `src/App.jsx`, `README.md`, `meta/CHANGELOG.md`, `meta/STATUS.md` e esta WO.
2. **Quem roda:** quem aplica. `npm run build` → **0 erros**. Erro → **PARE e reporte antes de commitar**.
3. **Quem roda:** quem aplica. Contagens (LINHAS; `tr -d '\r'` antes):
CHECKS
4. **Quem roda:** o dono, na tela — roteiro entregue pelo chat no mesmo turno.

## Relatorio de aplicacao

Os campos da skill `apply-wo` — a primeira linha diz o que entrou —, com a saida crua dos passos 1–3. Termine com `git status` limpo e `git log -1 --oneline` igual a `origin/main`.

## Commit — mensagem SEM acento

```
git add src/App.jsx README.md meta/CHANGELOG.md meta/STATUS.md meta/workorders/261126-wo0047-consertos-texto-tema-readme.md
```

```
git commit -m "fix(ui): mostra erro quando texto ou imagem falham e faz os botoes seguirem o tema claro" -m "Texto e Imagem mostravam o check mesmo na falha (catch chamava o mesmo flash). btnSmall e btnNeutral passam a ler o tema no render (getters), e os botoes de passo espalham o estilo. README: endereco local, estrutura, saves e o link da build de exemplo."
```

```
git push
```
