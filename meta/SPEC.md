# SPEC — [nome da feature]

> **Molde. Referência fixa — não é substituído pelo conteúdo preenchido.**
> Copie para `meta/specs/AAMMDD-nome-da-feature.md` e preencha ANTES de codar.
> A spec diz **o quê** construir e **quando está pronto**. O passo a passo da edição é outra coisa: isso é a **WO** (`meta/workorders/`).
> Mudança não-trivial começa antes disto, por uma **análise** (`meta/analises/`) — ver CEREBRO, «Análise antes do compromisso».

---

## Problema

[Que dor real isto resolve? Para quem? O que acontece hoje sem isto?]

[Se veio de uma análise, cite-a: `meta/analises/AAMMDD-ANALISE-<tema>.md`.]

## Critérios de aceite (verificáveis)

> Cada linha precisa ser conferível — se não dá para dizer «passou / não passou», reescreva.
> **Neste projeto não há suíte de testes:** o critério é conferível na tela ou no `git diff`. Escreva-o como o que se abre e o que se olha.

- [ ] [ex.: com Samurai + Katana Pétrea + amuleto vinculado, o painel de estatísticas mostra Determinação como `●●●`, e o contador de Magistrais como `★`]
- [ ] [ex.: a imagem gerada no modo Detalhado não corta conteúdo em nenhuma das quatro classes]
- [ ] [ex.: `npm run build` passa]
- [ ] [ex.: toda string nova existe em PT-BR e EN — conferir os dois idiomas na tela, não só no código]

## Decisões de design

[O que foi escolhido e por quê; o que foi descartado e por quê. Decisão estrutural → registre também em `DECISIONS.md` como DEC-N.]

## Fora de escopo

[O que esta feature NÃO vai fazer — o limite que impede o escopo de crescer sozinho. Inclua o que foi tentador e ficou de fora.]

## Riscos e armadilhas em jogo

> Quais das 23 armadilhas do `CONTEXT.md` esta feature encosta. Releia-as ANTES de formular hipótese de causa — a resposta do FIX-012 já estava escrita lá.

- [ex.: armadilha 15 — canvas não herda filtro CSS]
- [ex.: armadilha 22 — nível de detalhe é um só para os dois formatos]

## Passos

[Quebra em passos pequenos, ordenados, cada um entregável e conferível. Cada passo vira uma WO ou um bloco de WO.]

1. [passo]
2. [passo]

## O que conferir na tela ao terminar

- **Caso feliz:** [o que abrir e o que deve aparecer]
- **Borda:** [o caso extremo — build vazia, nome mais longo do jogo, os dois temas, os dois idiomas]
- **Regressão provável:** [o que costuma quebrar junto]
