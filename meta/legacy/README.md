# meta/legacy — material anterior ao fluxo de specs

Arquivos preservados aqui para **não se perderem de novo**. O `GUIA_CORRECOES_FASE3.md`
já foi dado como irrecuperável uma vez, e o `meta/STATUS.md` chegou a orientar que o
código dele fosse reescrito do zero. Reapareceu em 2026-07-22.

O `.flatdropignore` mantém esta pasta fora do upload ao Projeto do Claude — são ~660 KB
que só interessam quando a extração retroativa estiver em pauta. Para trabalhar um
arquivo específico, reinclua-o pontualmente com `!meta/legacy/<arquivo>`.

## O que é cada coisa

| Arquivo | O que é | Estado |
|---|---|---|
| `GUIA_CORRECOES_FASE3.md` | 4 correções + Fase 3 completa (Canvas, linhas 420–887) | correções 1–3 viraram a spec0006; a 4 virou a spec0004; **a Fase 3 ainda não foi usada** |
| `GUIA_COMPLETO_v4.md` | guia de aplicação anterior | não extraído |
| `GOT_Build.md` | índice dos 7 prompts que originaram a ferramenta | **lido por inteiro** em 2026-07-22 |
| `GOT_Build_-_Joker.md` | conversa antiga, 15 KB | não extraído — **primeiro alvo** |
| `GOT_Build_-_Alex.md` | conversa antiga, 61 KB | não extraído |
| `GOT_Build_-_Origem.md` | conversa antiga, 197 KB | não extraído |
| `GOT_Build_-_TOhno.md` | conversa antiga, 267 KB | não extraído — provavelmente exige 2 sessões |

## Como ler isto

**Não são fatos sobre o projeto.** São pedidos históricos: muitos já atendidos, alguns
contraditórios entre si, e com cronologia desconhecida — nem o autor sabe quais conversas
foram de fato usadas. Nada daqui entra nos `meta/` sem ser conferido contra o código de hoje.

O mesmo vale para os guias: são **fonte, não gabarito**. Todo bloco "ANTES" precisa bater
com o `App.jsx` atual antes de virar spec. Um bloco que não bate é um bloco a reescrever,
não a colar.
