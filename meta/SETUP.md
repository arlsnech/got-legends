# SETUP.md — Guia de Ambiente

> **Opcional, para o humano.** Como instalar, configurar e rodar o projeto do zero nesta máquina, e o que já deu errado. **Não entra no ritual de leitura** do assistente: ele o consulta quando o assunto é ambiente, e acrescenta aqui o passo que resolveu um bloqueio.
>
> Criado em 2026-11-24 (DEC-039), juntando o que estava espalhado por DECISIONS, CEREBRO, relatórios do Code e handoffs.

---

## Pré-requisitos
- **Node.js e npm.** A versão instalada na máquina do dono **não foi medida** — confira com `node -v`. O build usa Vite 5.4 e React 18.3 (`package.json`).
- **Git para Windows, com o Git Bash.** O Claude Code roda os comandos por ele.
- **Acesso SSH ao GitHub pelo alias `github-gametools`**: o `origin` é `git@github-gametools:arlsnech/got-legends.git`. O alias mora no `~/.ssh/config` da máquina, fora do repositório.

## Instalar
1. `git clone git@github-gametools:arlsnech/got-legends.git` (ou pelo HTTPS do GitHub, sem o alias).
2. Na pasta do repositório: `npm install`.

## Rodar
- **Desenvolvimento:** `npm run dev` → `http://localhost:5173/` (o caminho-base local é `/`).
- **Build de produção:** `npm run build` → `dist/`. É a rede do projeto (ver CONTEXT, «Build e validação»).
- **Conferir o build:** `npm run preview`.
- **Build como o do GitHub Pages**, no Git Bash: `MSYS_NO_PATHCONV=1 VITE_BASE_URL=/got-legends/ npm run build`.
- **Publicar:** não há passo manual. Netlify, Vercel e Cloudflare Pages montam a `main` a cada push; o GitHub Pages sai pelo workflow `.github/workflows/deploy-gh-pages.yml` (DEC-037).

## Configurar
- Sem `.env` e sem segredo. A única variável é `VITE_BASE_URL`, que só o build do GitHub Pages usa.

## Já deu errado (e como saiu)
- **`npm run deploy` quebra no Windows** — o pacote `gh-pages` falha nesta máquina → publicação pelo Netlify (DEC-016) e, desde 2026-11-16, o GitHub Pages pelo workflow (DEC-037).
- **[2026-11-16] O Git Bash transforma `/got-legends/` num caminho do Windows** quando o valor começa com `/` → `MSYS_NO_PATHCONV=1` na frente do comando.
- **[2026-11-17 / 2026-11-23] Arquivo em CRLF na árvore de trabalho** — a maior parte de `src/` e `meta/` está em CRLF (o `core.autocrlf` converte no checkout). A ferramenta Edit do Code não casa âncora nesses arquivos → o Code aplica as WOs por script, preservando o fim de linha. Fim de linha se mede com `git ls-files --eol <arquivo>`, nunca com contagem de `\r` no shell.
- **`.git/index.lock` deixado pelo chat** — um `git status` comum grava o lock, e o chat não consegue apagá-lo → o chat roda Git só em leitura, com `GIT_OPTIONAL_LOCKS=0`. Se o lock aparecer, apague `.git/index.lock` à mão, com nenhum Git rodando.
- **Servidor de preview esquecido** — encerrar «por nome» derruba todo processo Node da máquina → o Code não sobe servidor de preview; a conferência do build é pelo `dist/`.
