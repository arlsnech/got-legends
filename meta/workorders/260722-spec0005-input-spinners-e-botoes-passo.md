# spec0005 — Remove os spinners nativos do input numérico e troca ▼▲ por − / +

**Data:** 2026-07-22 · **Autor:** chat (curadoria) · **Executor:** Claude Code (`/apply-spec`)
**Branch:** `v2-planner` · **Depende de:** spec0004 (commits `1f1f470`, `4f5252b`, `f32e1ed`)

**Problema:** o campo de valor das propriedades usa `<input type="number">`, e o Chrome desenha nele as setinhas nativas (*spin buttons*). Elas são redundantes — o componente já tem botões de passo próprios, fora do campo — e reservam uma faixa à direita do campo mesmo quando invisíveis, o que descentra o número e cria o espaçamento irregular visível na captura de 2026-07-22 19:54.

**Sobre a direção dos ícones dos botões:** o usuário sugeriu ◀ ▶ no lugar de ▼ ▲, e pediu que a pesquisa prevalecesse se apontasse outra coisa. Ela aponta: a Nielsen Norman Group recomenda, para steppers horizontais, **sinais de mais e menos** como rótulo dos botões, reservando ▲▼ para steppers verticais. `−` e `+` dizem *o que o botão faz com o valor*; ◀ ▶ carregam a conotação de *navegar entre itens*, que é outra coisa. Esta spec adota **−** e **+**.

**Regras de execução:**
- Localize cada âncora EXATAMENTE. Se UMA falhar, PARE e reporte qual.
- Só `src/index.css`, `src/App.jsx` e dois documentos de `meta/`.
- **Não delete `src/v1..v4/` nem os arquivos `GUIA_*.md`.**
- Nenhum `--force`, `rebase` ou `reset --hard`.

---

## Parte 1 — `src/index.css` · esconder os spinners nativos

Regras de pseudo-elemento não podem ser escritas como estilo inline no React, por isso esta parte vai na folha de estilo.

**Âncora:**
```
body {
  background: #07080f;
  color: #dde0ef;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

**Substituir por:**
```
body {
  background: #07080f;
  color: #dde0ef;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Esconde as setinhas nativas do <input type="number">.
   O PropInput já tem botões de passo próprios, fora do campo; as nativas
   eram redundantes e reservavam uma faixa à direita que descentrava o número.
   Mantemos type="number" pelo teclado numérico no mobile e pela validação
   de min/max — só a decoração sai. */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
```

---

## Parte 2 — `src/App.jsx`

### Edição 2.1 — botão de decremento

**Âncora:**
```
              <button onClick={() => step(-1)} style={btnSmall}>▼</button>
```

**Substituir por:**
```
              <button
                onClick={() => step(-1)}
                aria-label={lang === 'en' ? 'Decrease value' : 'Diminuir valor'}
                style={btnSmall}
              >−</button>
```

> O caractere é o sinal de menos U+2212 (`−`), não o hífen do teclado. Ele tem a mesma largura do `+` e alinha na mesma altura óptica; o hífen fica visivelmente menor e mais alto.

### Edição 2.2 — botão de incremento

**Âncora:**
```
              <button onClick={() => step(1)} style={btnSmall}>▲</button>
```

**Substituir por:**
```
              <button
                onClick={() => step(1)}
                aria-label={lang === 'en' ? 'Increase value' : 'Aumentar valor'}
                style={btnSmall}
              >+</button>
```

### Edição 2.3 — input: sem roda do mouse, com respiro simétrico

**Âncora:**
```
                onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Tab') commit() }}
                style={{
                  width: 52, textAlign: 'center', background: T.panel,
                  border: `1px solid ${T.borderHov}`, borderRadius: 6,
                  color: T.text, fontSize: 12, padding: '4px 2px',
                }}
```

**Substituir por:**
```
                onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Tab') commit() }}
                onWheel={e => e.currentTarget.blur()}
                style={{
                  width: 46, textAlign: 'center', background: T.panel,
                  border: `1px solid ${T.borderHov}`, borderRadius: 6,
                  color: T.text, fontSize: 12, padding: '4px 6px',
                }}
```

> Duas mudanças além do padding. O `onWheel` corrige um problema clássico do `type="number"`: com o campo focado, girar a roda do mouse **altera o valor em silêncio** enquanto o usuário só queria rolar a página. Tirar o foco na roda elimina isso. E a largura cai de 52 para 46 porque a faixa reservada às setas nativas deixou de existir — o número passa a ficar centrado de fato.

### Edição 2.4 — `btnSmall`: tipografia adequada a `−` e `+`

**Âncora:**
```
const btnSmall = {
  background: T.card, border: `1px solid ${T.border}`, color: T.text,
  borderRadius: 4, width: 22, height: 22, cursor: 'pointer', fontSize: 10,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
```

**Substituir por:**
```
const btnSmall = {
  background: T.card, border: `1px solid ${T.border}`, color: T.text,
  borderRadius: 4, width: 22, height: 22, cursor: 'pointer',
  fontSize: 14, fontWeight: 600, lineHeight: 1, paddingBottom: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
```

> `fontSize: 10` foi calibrado para os triângulos, que são glifos pequenos e sólidos. `−` e `+` nesse tamanho ficariam finos e apagados. O `paddingBottom: 1` compensa a altura óptica dos dois sinais, que assentam acima da linha de base.

---

## Parte 3 — Build

```
npm run build
```

Se falhar, **PARE** e reporte sem commitar.

---

## Parte 4 — Conferência visual

Suba o dev server. Se recriar o `.claude/launch.json`, **commite-o desta vez** — a conferência visual se repete a cada spec de UI, e `.claude/` é versionado neste repo.

Abra um item **comum** (não Magistral) com propriedade selecionada:

| # | O que verificar | Esperado |
|---|---|---|
| 1 | Dentro do campo | **nenhuma seta nativa**, nem visível nem no hover/foco |
| 2 | Centralização | o número centrado no campo, sem folga assimétrica à direita |
| 3 | Botões | `−` à esquerda, `+` à direita, mesmo tamanho, legíveis |
| 4 | Passo | `−` diminui e `+` aumenta; param no mínimo e no máximo da faixa |
| 5 | Digitação | continua possível digitar e confirmar com Enter, Tab ou saindo do campo |
| 6 | **Roda do mouse** | com o campo focado, rolar a roda **não** altera mais o valor |
| 7 | Item Magistral | segue como caixa âmbar de texto, sem campo e sem botões (não deve mudar nada) |
| 8 | Tema claro | os dois botões continuam legíveis no tema claro |
| 9 | 3-col e 2-col | a linha da propriedade não quebrou nem estourou em nenhum dos dois modos |

O item 6 é o único que corrige um bug silencioso; confirme-o com atenção. Reporte item a item.

---

## Parte 5 — Documentos

### Edição 5.1 — `meta/STATUS.md` · corrigir o registro do guia

O `GUIA_CORRECOES_FASE3.md` **foi encontrado** em 2026-07-22, fora do repositório. O aviso atual afirma o contrário e orienta a reescrever tudo do zero — precisa ser corrigido antes que alguém aja com base nele.

**Âncora:**
```
> ⚠️ **O `GUIA_CORRECOES_FASE3.md` não existe mais** — não está na pasta local nem no repositório, e não será recuperado (confirmado pelo usuário em 2026-07-22). O código destes quatro itens **precisa ser reescrito do zero**. Não perca tempo procurando o arquivo. Daqui em diante correção de código sai por spec aplicada pelo Claude Code, não por guia para colar à mão — foi justamente esse formato que deixou a Fase 3 parada desde junho (DEC-007).
```

**Substituir por:**
```
> ✅ **O `GUIA_CORRECOES_FASE3.md` foi encontrado** (2026-07-22, fora do repositório — o aviso anterior, de que teria se perdido, estava errado). São 35 KB contendo o ANTES/DEPOIS das três correções restantes **e** o código completo da Fase 3 (`generateBuildImage` via Canvas, ~470 linhas), além do trecho da FIX-005 que a spec0004 já aplicou por outro caminho.
>
> **Não aplique o guia à mão.** Ele continua sendo o formato que deixou este trabalho parado desde junho (DEC-007). O caminho é ler o guia como fonte e converter cada correção em spec, conferindo cada bloco ANTES contra o `App.jsx` de hoje — o arquivo mudou desde que o guia foi escrito, e um bloco que não bate mais é um bloco que precisa ser reescrito, não colado.
```

### Edição 5.2 — `meta/CHANGELOG.md`

**Âncora:**
```
- Estatísticas do texto exportado saíam como `undefined` (FIX-005 — diagnosticado em junho, aplicado só agora). Junto com isso: os rótulos das estatísticas passam a respeitar o idioma EN, e o grupo de estatísticas específico da classe volta a aparecer no texto
```

**Substituir por:**
```
- Estatísticas do texto exportado saíam como `undefined` (FIX-005 — diagnosticado em junho, aplicado só agora). Junto com isso: os rótulos das estatísticas passam a respeitar o idioma EN, e o grupo de estatísticas específico da classe volta a aparecer no texto
- Roda do mouse sobre o campo de valor focado alterava a propriedade em silêncio

### Modificado (interface)
- Campo de valor das propriedades: as setinhas nativas do `type="number"` foram escondidas — eram redundantes com os botões de passo e reservavam uma faixa que descentrava o número
- Botões de passo passam de ▼ ▲ para **−** e **+**, seguindo a recomendação da Nielsen Norman Group para steppers horizontais (▲▼ são a convenção de steppers verticais; ◀▶ sugeririam navegar entre itens, não alterar um valor)
```

---

## Parte 6 — Fechamento

```
git add src/index.css src/App.jsx meta/STATUS.md meta/CHANGELOG.md meta/specs/
git status
```

Confira o staged e **reporte a lista**. Não deve haver `logic.js`, `node_modules/` nem `dist/`.

```
git commit -m "fix(ui): remove spinners nativos e adota - e + nos botoes de passo" -m "Esconde as setas nativas do input type=number, que eram redundantes e descentravam o valor. Troca os triangulos por menos e mais, conforme recomendacao NN/g para steppers horizontais. Corrige tambem a alteracao silenciosa do valor pela roda do mouse."
git push
```

Ao final, acrescente à «💬 Última Sessão» do `meta/STATUS.md` o registro desta spec com o resultado item a item da Parte 4, e commite como `docs(status): registra aplicacao da spec0005`.

**Permanece em `v2-planner`.**
