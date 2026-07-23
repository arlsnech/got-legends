---
title: "GOT Build - Alex"
id: "mrwqlvttwgbf"
created: "2026-07-22T23:52:21.857Z"
updated: "2026-07-22T23:52:21.857Z"
blocks: 5
---
# GOT Build - Alex

> **Descrição/Resumo:** Preciso de ajuda para descobrir como corrigir uma ferramenta, pois não sei os locais para corrigir os problemas nos scripts que passei. Se olhar a versão anterior de data, consegui (creio eu que não estraguei nada) limpar e corrigir algumas inconsistências, mas enfim, vou falar os problemas. Os amuletos de classe, estão corretos agora como deixei, mas acontece que os amuletos magistrais possuem um sistema de "vincular" a classe, então o que deveria acontecer (mas na ferramenta está incorreto) era adicionar ao amuleto em questão APENAS as propriedades e perks exclusivos da classe (e inclusive, para ambas as posições p1 e p2, mesmo que no amuleto de classe ele só estivesse presente na posição 1), então 
> vinculado ao samurai, qualquer amuleto de classe teria
> 
> ```javascript
> {id:"alvos_extr",    nPT:"Alvos Extração Espiritual",nEN:"Spirit Pull Targets",  sl:["P1","P2"],      mn:1,   mx:1,   u:"pts",sk:"spiritPullTargets"},
> {id:"raio_lam",      nPT:"Raio da Lâmina Explosiva",nEN:"Explosive Blade Radius",sl:["P1","P2"],      mn:0.5, mx:1.0, u:"%",sk:"explosiveBladeRadius"}
> ```
> 
> e perk
> 
> ```javascript
> {id:"ritmo_cresc", nPT:"Ritmo Crescente",  nEN:"Rising Tempo",    dPT:"Abates sucessivos sem receber dano aumentam o dano causado.", dEN:"Successive kills without taking damage increase damage dealt."},
>       {id:"golpes_abenc",nPT:"Golpes Abençoados",nEN:"Blessed Strikes", dPT:"Causar dano C/C cura você enquanto sua habilidade de classe estiver ativa.", dEN:"Dealing melee damage heals you while your class ability is active."}
> ```
> 
> Nesse sistema corrigido, os perks tão saindo corretamente pois o script não repete os PERKS_CHARM_BASE, então aparece os exclusivos corretamente, (na vesão anterior de data junto com o scrpt de lógic eu acho, tava cometendo duplicação e adição incorreta de alguns props e perks de classe para qualquer classe, não sei por que foi erroniamente adicionado em data antiga daquele jeito, enfim, isso calsava para alguns amuletos duplicação por exemplo de ritmo crescente e golpes abençoados, para as outras classes também ocorriam para outros amuletos.
> Para a caçadora, os scripts atuais colocam em parte corretamente, mas só em um amuleto magistral, o que usa sub de amuleto a distancia, pois não adiciona nenhum prop em posição incorreta que 
> 
> ```javascript
> {id:"raio_hab_h",   nPT:"Raio Habilidades Caçador",nEN:"Hunter Ability Radius", sl:["P1","P2"],mn:0.5, mx:1.0, u:"%",sk:"hunterAbilityRadius"},
> ```
> 
> Que felizmente já é para ambas as posições, mas vincular caçador com outro amuleto adiciona também os props de ataque a distância, 
> Como do samurai, os perks de caçador aparecem corretamente
> 
> ```javascript
> {id:"flechas_vis",  nPT:"Flechas Vis",        nEN:"Foul Arrows",    dPT:"Tiros na cabeça também enfraquecem o alvo.",          dEN:"Headshots also weaken the target."},
>       {id:"flechas_abenc",nPT:"Flechas Abençoadas", nEN:"Blessed Arrows", dPT:"Tiros na cabeça também curam aliados próximos.",      dEN:"Headshots also heal nearby allies."},
>       {id:"catador",      nPT:"Catador",            nEN:"Scavenger",      dPT:"Aumenta a quantidade de munição coletada em 100%.",    dEN:"Increases ammo picked up by 100%."}
> ```
> 
> Para o ronin, os props exclusivos que deveriam adicionar para p1 e p2
> 
> ```javascript
> {id:"raio_aroma",  nPT:"Raio do Aroma Curativo",  nEN:"Healing Incense Radius",   sl:["P1","P2"],mn:0.5,mx:1.0,u:"%",sk:"aromaticoRadius"},
>       {id:"dur_aroma",   nPT:"Duração do Aroma Curativo",nEN:"Healing Incense Duration", sl:["P1","P2"],mn:0.2,mx:0.4,u:"%",sk:"aromaticoDuration"},
>       {id:"raio_esp",    nPT:"Raio do Espírito Curativo",nEN:"Healing Spirit Radius",    sl:["P1","P2"],mn:0.5,mx:1.0,u:"%",sk:"healingSpiritRadius"},
>       {id:"raio_raj_ro", nPT:"Raio da Rajada Debilitante",nEN:"Weakening Burst Radius", sl:["P1","P2"],     mn:0.5, mx:1.0, u:"%",sk:"weakeningBurstRadius"}
> ```
> 
> Os perks, já compreendidos o funcionamento né
> 
> ```javascript
> {id:"esp_urso",    nPT:"Espírito de Urso", nEN:"Spirit Bear",    dPT:"O Animal Espiritual do Ronin invoca um urso em vez de um cachorro.", dEN:"The Ronin's Spirit Animal summons a bear instead of a dog."},
>       {id:"esp_curat",   nPT:"Espírito Curativo",nEN:"Healing Spirit", dPT:"O Animal Espiritual do Ronin tem uma aura curativa.",                dEN:"The Ronin's Spirit Animal has a healing aura."}
> ```
> 
> E para o assassino
> 
> ```javascript
> {id:"raio_sumi",    nPT:"Raio do Sumiço Tóxico",    nEN:"Toxic Vanish Radius",   sl:["P1","P2"],mn:0.5, mx:1.0, u:"%",sk:"toxicVanishRadius"},
>       {id:"dur_sumi",     nPT:"Duração do Sumiço",        nEN:"Vanish Duration",       sl:["P1","P2"],mn:0.25,mx:0.5, u:"%",sk:"vanishDuration"},
>       {id:"dano_cima",    nPT:"Dano Assassinato de Cima", nEN:"Assassinate from Above",sl:["P1","P2"],mn:0.1, mx:0.5, u:"%",sk:"assassinFromAbove"},
> ```
> 
> E seus perks
> 
> ```javascript
> {id:"sumi_cadeia_p",nPT:"Sumiço em Cadeia", nEN:"Chain Vanish", dPT:"Assassinar ao usar Sumiço reativa e renova a duração.",dEN:"Assassinating while vanished re-activates vanish."},
>       {id:"histeria",     nPT:"Histeria",          nEN:"Hysteria",     dPT:"Assassinatos fazem com que inimigos próximos alucinem.",dEN:"Assassinations cause nearby enemies to hallucinate."}
>     ]
> ```
> 
> Eu não tenho muita certeza de como corrigir isso, mas tava pensando se tinha que fazer como fiz para "limpar" o código data, de colocar la no começo algo como const CHARM_SAM_P1P2 = [ .... 
> E colocar os props do samurai, e dos outros, para depois no logic ou app.jsx, colocar para o "vincular" usar desses props para adicionar nos magistrais, (inclusive, já ficando óbvio, mas esse CHARM_SAM_P1P2 não poderia ser adicionado também para acelerar o processo nos props do amuleto de classe samurai pois os props dele são só para p2 no amuleto de classe, só daria para reusar para o amuleto de caçador e assassino creio eu. Enfim, queria corrigir isso do vincular estar adicionando incorretamente TODOS os props (e teoricamente os perks, só que ele felizmente não duplica) dos amuletos de classe da classe vinculada ao amuleto magistral, enquanto só deveria ser essas poucas ADIÇÕES. Outra coisa sobre o vincular, eu queria saber se daria para tirar a opção de "selecionar" a classe vinculada quando escolhesse um amuleto magistral, em logic, eu vi algo com
> 
> ```javascript
> const linkedClass = slot === 'charm' ? classId : undefined;
> const effectiveItem = slot === 'charm' && chosen.classBinding
>       ? getEffectiveCharm(chosen.id, linkedClass)
>       : chosen;
> ```
> 
> Não sei se é aqui ou outro lugar para "travar/trancar" apenas na classe usada, ao invés de permitir para o usuário selecionar a classe vinculada.
> Outras duas coisas que queria descobrir se teria como fazer (e se seria facil, caso for muito complicado, eu só gostaria de saber como seria) que é para arco longo, digo o equipamento arco longo e arco ricocheteador, eles possuem um perk Versátil, que é necessário para as classes Samurai, Ronin e Assassino equiparem ele (o caçador não precisa, o equipamento é teoricamente exclusivo dele), então eu queria saber como fazer para quando estivesse com essas 3 classes, o Versátil seria automaticamente adicionado ao primeiro perk do arco e não poderia ser removido, só se trocasse para classe caçadora ou se trocasse de equipamento de longo alcance, e essa mecanica se repetiria para a Zarabatana (exclusiva teoricamente para Assassino) caso o Ronin equipasse, o perk de desbloqueio do Ronin seria equipado no mesmo estilo, e por consequencia, também fazer o mesmo com pacote de bombas para desbloqueio para assassino, e para o remédio proibido para desbloqueio do assassino e samurai, como fazer isso? Seria muito complicado e alterar e adicionar muita coisa com possibilidade de bugs? Qualquer coisa, eu deixo como está, o usuário seriam jogadores, que iriam usar para ajudar a construir builds, eles não ganhariam nada "aproveitando as brechas" da ferramenta. Aí a outra coisa nesse mesmo teor de "dependendo da classes" seriam as munições das armas a distância, eu queria saber se seria muito trabalhosos e complicado, fazer as munições aparecerem de certa forma dependendo da classe, pois é o seguinte, flecha perfurante é exclusiva de caçador, e inclusive para o caçador só deveria aparecer caso tivesse com a tecnica de flecha perfurante equipada (se for muito complicado pode só deixar mesmo a flecha aparecendo para o caçador, pois já ajuda para o jogador saber quanto que teria sem ter que equipar a tecnica) enfim, além da flecha perfurante, acontece que algumas munições possuem um valor dentro de (), esse valor seria a quantidade que a classe "Principal" do equipamento teria, enquanto as outras 3 teriam a quantidade fora do parenteses, creio que o diferencial estaria apenas no caçador com certas flechas, e o ronin com os pacotes de bombas. Por fim, me ajude a localizar TODOS os lugares para corrigir, se possível me orientando e explicando para que serve, e me dando COMPLETAMENTE TODAS AS PARTES, CóDIGOS, SCRIPTS, Linhas de códigos para corrigir, e explicando exatamente a posição (se possivel passando o antigo e o novo código) PARA TUDO, eu vou corrigir, não é para você me dar todos os scripts "corrigidos" completo para eu baixar pois tem grande chance de você mudar e estragar outras linhas que não falei para mexer. ME AJUDE A FAZER TUDO, EXPLICANDO E ENSINANDO TUDO, PASSO A PASSO

<!-- ENTRADA -->
**ID:** `mrwqlvttwgbf`  
**Criado em:** 22/07/26 20:52  
**Modificado em:** 22/07/26 20:52  
**Total de blocos:** 5  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [Bloco 1] Prompt · v1

<!-- BLOCO 1 -->
**Subtítulo:** Prompt  
**Versão:** v1  

**Conteúdo:**

<!-- CONTEUDO:INICIO bloco=1 -->
Ia mandar junto com a solicitação, apertei sem querer no enter
Preciso de ajuda para descobrir como corrigir uma ferramenta, pois não sei os locais para corrigir os problemas nos scripts que passei. Se olhar a versão anterior de data, consegui (creio eu que não estraguei nada) limpar e corrigir algumas inconsistências, mas enfim, vou falar os problemas. Os amuletos de classe, estão corretos agora como deixei, mas acontece que os amuletos magistrais possuem um sistema de "vincular" a classe, então o que deveria acontecer (mas na ferramenta está incorreto) era adicionar ao amuleto em questão APENAS as propriedades e perks exclusivos da classe (e inclusive, para ambas as posições p1 e p2, mesmo que no amuleto de classe ele só estivesse presente na posição 1), então 
vinculado ao samurai, qualquer amuleto de classe teria
```javascript
{id:"alvos_extr",    nPT:"Alvos Extração Espiritual",nEN:"Spirit Pull Targets",  sl:["P1","P2"],      mn:1,   mx:1,   u:"pts",sk:"spiritPullTargets"},
{id:"raio_lam",      nPT:"Raio da Lâmina Explosiva",nEN:"Explosive Blade Radius",sl:["P1","P2"],      mn:0.5, mx:1.0, u:"%",sk:"explosiveBladeRadius"}
```
e perk
```javascript
{id:"ritmo_cresc", nPT:"Ritmo Crescente",  nEN:"Rising Tempo",    dPT:"Abates sucessivos sem receber dano aumentam o dano causado.", dEN:"Successive kills without taking damage increase damage dealt."},
      {id:"golpes_abenc",nPT:"Golpes Abençoados",nEN:"Blessed Strikes", dPT:"Causar dano C/C cura você enquanto sua habilidade de classe estiver ativa.", dEN:"Dealing melee damage heals you while your class ability is active."}
```
Nesse sistema corrigido, os perks tão saindo corretamente pois o script não repete os PERKS_CHARM_BASE, então aparece os exclusivos corretamente, (na vesão anterior de data junto com o scrpt de lógic eu acho, tava cometendo duplicação e adição incorreta de alguns props e perks de classe para qualquer classe, não sei por que foi erroniamente adicionado em data antiga daquele jeito, enfim, isso calsava para alguns amuletos duplicação por exemplo de ritmo crescente e golpes abençoados, para as outras classes também ocorriam para outros amuletos.
Para a caçadora, os scripts atuais colocam em parte corretamente, mas só em um amuleto magistral, o que usa sub de amuleto a distancia, pois não adiciona nenhum prop em posição incorreta que 
```javascript
{id:"raio_hab_h",   nPT:"Raio Habilidades Caçador",nEN:"Hunter Ability Radius", sl:["P1","P2"],mn:0.5, mx:1.0, u:"%",sk:"hunterAbilityRadius"},
```
Que felizmente já é para ambas as posições, mas vincular caçador com outro amuleto adiciona também os props de ataque a distância, 
Como do samurai, os perks de caçador aparecem corretamente
```javascript
{id:"flechas_vis",  nPT:"Flechas Vis",        nEN:"Foul Arrows",    dPT:"Tiros na cabeça também enfraquecem o alvo.",          dEN:"Headshots also weaken the target."},
      {id:"flechas_abenc",nPT:"Flechas Abençoadas", nEN:"Blessed Arrows", dPT:"Tiros na cabeça também curam aliados próximos.",      dEN:"Headshots also heal nearby allies."},
      {id:"catador",      nPT:"Catador",            nEN:"Scavenger",      dPT:"Aumenta a quantidade de munição coletada em 100%.",    dEN:"Increases ammo picked up by 100%."}
```
Para o ronin, os props exclusivos que deveriam adicionar para p1 e p2
```javascript
{id:"raio_aroma",  nPT:"Raio do Aroma Curativo",  nEN:"Healing Incense Radius",   sl:["P1","P2"],mn:0.5,mx:1.0,u:"%",sk:"aromaticoRadius"},
      {id:"dur_aroma",   nPT:"Duração do Aroma Curativo",nEN:"Healing Incense Duration", sl:["P1","P2"],mn:0.2,mx:0.4,u:"%",sk:"aromaticoDuration"},
      {id:"raio_esp",    nPT:"Raio do Espírito Curativo",nEN:"Healing Spirit Radius",    sl:["P1","P2"],mn:0.5,mx:1.0,u:"%",sk:"healingSpiritRadius"},
      {id:"raio_raj_ro", nPT:"Raio da Rajada Debilitante",nEN:"Weakening Burst Radius", sl:["P1","P2"],     mn:0.5, mx:1.0, u:"%",sk:"weakeningBurstRadius"}
```
Os perks, já compreendidos o funcionamento né
```javascript
{id:"esp_urso",    nPT:"Espírito de Urso", nEN:"Spirit Bear",    dPT:"O Animal Espiritual do Ronin invoca um urso em vez de um cachorro.", dEN:"The Ronin's Spirit Animal summons a bear instead of a dog."},
      {id:"esp_curat",   nPT:"Espírito Curativo",nEN:"Healing Spirit", dPT:"O Animal Espiritual do Ronin tem uma aura curativa.",                dEN:"The Ronin's Spirit Animal has a healing aura."}
```
E para o assassino
```javascript
{id:"raio_sumi",    nPT:"Raio do Sumiço Tóxico",    nEN:"Toxic Vanish Radius",   sl:["P1","P2"],mn:0.5, mx:1.0, u:"%",sk:"toxicVanishRadius"},
      {id:"dur_sumi",     nPT:"Duração do Sumiço",        nEN:"Vanish Duration",       sl:["P1","P2"],mn:0.25,mx:0.5, u:"%",sk:"vanishDuration"},
      {id:"dano_cima",    nPT:"Dano Assassinato de Cima", nEN:"Assassinate from Above",sl:["P1","P2"],mn:0.1, mx:0.5, u:"%",sk:"assassinFromAbove"},
```
E seus perks
```javascript
{id:"sumi_cadeia_p",nPT:"Sumiço em Cadeia", nEN:"Chain Vanish", dPT:"Assassinar ao usar Sumiço reativa e renova a duração.",dEN:"Assassinating while vanished re-activates vanish."},
      {id:"histeria",     nPT:"Histeria",          nEN:"Hysteria",     dPT:"Assassinatos fazem com que inimigos próximos alucinem.",dEN:"Assassinations cause nearby enemies to hallucinate."}
    ]
```
Eu não tenho muita certeza de como corrigir isso, mas tava pensando se tinha que fazer como fiz para "limpar" o código data, de colocar la no começo algo como const CHARM_SAM_P1P2 = [ .... 
E colocar os props do samurai, e dos outros, para depois no logic ou app.jsx, colocar para o "vincular" usar desses props para adicionar nos magistrais, (inclusive, já ficando óbvio, mas esse CHARM_SAM_P1P2 não poderia ser adicionado também para acelerar o processo nos props do amuleto de classe samurai pois os props dele são só para p2 no amuleto de classe, só daria para reusar para o amuleto de caçador e assassino creio eu. Enfim, queria corrigir isso do vincular estar adicionando incorretamente TODOS os props (e teoricamente os perks, só que ele felizmente não duplica) dos amuletos de classe da classe vinculada ao amuleto magistral, enquanto só deveria ser essas poucas ADIÇÕES. Outra coisa sobre o vincular, eu queria saber se daria para tirar a opção de "selecionar" a classe vinculada quando escolhesse um amuleto magistral, em logic, eu vi algo com
```javascript
const linkedClass = slot === 'charm' ? classId : undefined;
const effectiveItem = slot === 'charm' && chosen.classBinding
      ? getEffectiveCharm(chosen.id, linkedClass)
      : chosen;
```
Não sei se é aqui ou outro lugar para "travar/trancar" apenas na classe usada, ao invés de permitir para o usuário selecionar a classe vinculada.
Outras duas coisas que queria descobrir se teria como fazer (e se seria facil, caso for muito complicado, eu só gostaria de saber como seria) que é para arco longo, digo o equipamento arco longo e arco ricocheteador, eles possuem um perk Versátil, que é necessário para as classes Samurai, Ronin e Assassino equiparem ele (o caçador não precisa, o equipamento é teoricamente exclusivo dele), então eu queria saber como fazer para quando estivesse com essas 3 classes, o Versátil seria automaticamente adicionado ao primeiro perk do arco e não poderia ser removido, só se trocasse para classe caçadora ou se trocasse de equipamento de longo alcance, e essa mecanica se repetiria para a Zarabatana (exclusiva teoricamente para Assassino) caso o Ronin equipasse, o perk de desbloqueio do Ronin seria equipado no mesmo estilo, e por consequencia, também fazer o mesmo com pacote de bombas para desbloqueio para assassino, e para o remédio proibido para desbloqueio do assassino e samurai, como fazer isso? Seria muito complicado e alterar e adicionar muita coisa com possibilidade de bugs? Qualquer coisa, eu deixo como está, o usuário seriam jogadores, que iriam usar para ajudar a construir builds, eles não ganhariam nada "aproveitando as brechas" da ferramenta. Aí a outra coisa nesse mesmo teor de "dependendo da classes" seriam as munições das armas a distância, eu queria saber se seria muito trabalhosos e complicado, fazer as munições aparecerem de certa forma dependendo da classe, pois é o seguinte, flecha perfurante é exclusiva de caçador, e inclusive para o caçador só deveria aparecer caso tivesse com a tecnica de flecha perfurante equipada (se for muito complicado pode só deixar mesmo a flecha aparecendo para o caçador, pois já ajuda para o jogador saber quanto que teria sem ter que equipar a tecnica) enfim, além da flecha perfurante, acontece que algumas munições possuem um valor dentro de (), esse valor seria a quantidade que a classe "Principal" do equipamento teria, enquanto as outras 3 teriam a quantidade fora do parenteses, creio que o diferencial estaria apenas no caçador com certas flechas, e o ronin com os pacotes de bombas. Por fim, me ajude a localizar TODOS os lugares para corrigir, se possível me orientando e explicando para que serve, e me dando COMPLETAMENTE TODAS AS PARTES, CóDIGOS, SCRIPTS, Linhas de códigos para corrigir, e explicando exatamente a posição (se possivel passando o antigo e o novo código) PARA TUDO, eu vou corrigir, não é para você me dar todos os scripts "corrigidos" completo para eu baixar pois tem grande chance de você mudar e estragar outras linhas que não falei para mexer. ME AJUDE A FAZER TUDO, EXPLICANDO E ENSINANDO TUDO, PASSO A PASSO
<!-- CONTEUDO:FIM bloco=1 -->

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [Bloco 2] Claude · v1

<!-- BLOCO 2 -->
**Subtítulo:** Claude  
**Versão:** v1  

**Conteúdo:**

<!-- CONTEUDO:INICIO bloco=2 -->
Vou ler todos os arquivos primeiro para entender bem o código antes de te guiar!Agora vou ler o logic.js:Agora o App.jsx, especificamente a parte de amuleto e class binding:Deixa eu ver mais contexto em volta da linha 402 do App.jsx para entender as variáveis em escopo:Agora tenho uma visão completa de todos os 3 arquivos. Vou te guiar por **todos os problemas**, passo a passo, com o código exato (antigo vs. novo).

---

## 🗺️ MAPA DOS PROBLEMAS ENCONTRADOS

1. **`resolveCharmClassBinding` (logic.js)** — função adiciona TODOS os props do amuleto de classe, não só os exclusivos
2. **Import (logic.js)** — precisa importar as novas constantes do data.js
3. **Seletor de classe vinculada (App.jsx)** — precisa virar texto fixo
4. **Novas constantes (data.js)** — ponto de partida para corrigir tudo acima

---

## 📝 MUDANÇA 1 — `data.js`: Criar as constantes de props/perks exclusivos

**Por que?** Em vez de a lógica tentar "deduzir" quais props são exclusivos comparando com o amuleto de classe, você define explicitamente uma vez aqui. Isso evita o bug onde props de ataque à distância (do amuleto Caçador) eram indevidamente adicionados a magistrais que têm sub `ranged`.

**Onde exatamente:** Logo APÓS o fechamento do `PERKS_CHARM_BASE` (linha 376, o `];`), e ANTES da linha `// ─── GEAR DATA ───` (linha 378).

**ANTIGO (o que está entre as linhas 376-378):**
```javascript
  {id:"arrem_impac",  nPT:"Arremessos Impactantes",  nEN:"Impactful Throws",     dPT:"Arremessar um inimigo deixa-o derrubado e vulnerável a golpes críticos.", dEN:"Throwing an enemy leaves them knocked down and vulnerable to critical hits."}
];

// ─── GEAR DATA ───────────────────────────────────────────────
```

**NOVO (substitua por):**
```javascript
  {id:"arrem_impac",  nPT:"Arremessos Impactantes",  nEN:"Impactful Throws",     dPT:"Arremessar um inimigo deixa-o derrubado e vulnerável a golpes críticos.", dEN:"Throwing an enemy leaves them knocked down and vulnerable to critical hits."}
];

// ─── PROPS E PERKS EXCLUSIVOS DE CLASSE (para amuletos magistrais vinculados) ──
// Regra: ao vincular um magistral a uma classe, APENAS estes são adicionados.
// sl:["P1","P2"] em todos — magistrais expõem o prop em ambos os slots.
export const CLASS_EXCLUSIVE_CHARM_PROPS = {
  samurai: [
    {id:"alvos_extr", nPT:"Alvos Extração Espiritual",nEN:"Spirit Pull Targets",   sl:["P1","P2"],mn:1,   mx:1,   u:"pts",sk:"spiritPullTargets"},
    {id:"raio_lam",   nPT:"Raio da Lâmina Explosiva", nEN:"Explosive Blade Radius",sl:["P1","P2"],mn:0.5, mx:1.0, u:"%",  sk:"explosiveBladeRadius"}
  ],
  hunter: [
    {id:"raio_hab_h", nPT:"Raio Habilidades Caçador", nEN:"Hunter Ability Radius", sl:["P1","P2"],mn:0.5, mx:1.0, u:"%",  sk:"hunterAbilityRadius"}
  ],
  ronin: [
    {id:"raio_aroma",   nPT:"Raio do Aroma Curativo",   nEN:"Healing Incense Radius",   sl:["P1","P2"],mn:0.5,mx:1.0,u:"%",sk:"aromaticoRadius"},
    {id:"dur_aroma",    nPT:"Duração do Aroma Curativo", nEN:"Healing Incense Duration", sl:["P1","P2"],mn:0.2,mx:0.4,u:"%",sk:"aromaticoDuration"},
    {id:"raio_esp",     nPT:"Raio do Espírito Curativo", nEN:"Healing Spirit Radius",    sl:["P1","P2"],mn:0.5,mx:1.0,u:"%",sk:"healingSpiritRadius"},
    {id:"raio_raj_ro",  nPT:"Raio da Rajada Debilitante",nEN:"Weakening Burst Radius",   sl:["P1","P2"],mn:0.5,mx:1.0,u:"%",sk:"weakeningBurstRadius"}
  ],
  assassin: [
    {id:"raio_sumi",  nPT:"Raio do Sumiço Tóxico",    nEN:"Toxic Vanish Radius",    sl:["P1","P2"],mn:0.5, mx:1.0, u:"%",sk:"toxicVanishRadius"},
    {id:"dur_sumi",   nPT:"Duração do Sumiço",         nEN:"Vanish Duration",        sl:["P1","P2"],mn:0.25,mx:0.5, u:"%",sk:"vanishDuration"},
    {id:"dano_cima",  nPT:"Dano Assassinato de Cima",  nEN:"Assassinate from Above", sl:["P1","P2"],mn:0.1, mx:0.5, u:"%",sk:"assassinFromAbove"}
  ]
};

export const CLASS_EXCLUSIVE_CHARM_PERKS = {
  samurai: [
    {id:"ritmo_cresc",  nPT:"Ritmo Crescente",   nEN:"Rising Tempo",    dPT:"Abates sucessivos sem receber dano aumentam o dano causado.",              dEN:"Successive kills without taking damage increase damage dealt."},
    {id:"golpes_abenc", nPT:"Golpes Abençoados", nEN:"Blessed Strikes", dPT:"Causar dano C/C cura você enquanto sua habilidade de classe estiver ativa.",dEN:"Dealing melee damage heals you while your class ability is active."}
  ],
  hunter: [
    {id:"flechas_vis",  nPT:"Flechas Vis",        nEN:"Foul Arrows",    dPT:"Tiros na cabeça também enfraquecem o alvo.",        dEN:"Headshots also weaken the target."},
    {id:"flechas_abenc",nPT:"Flechas Abençoadas", nEN:"Blessed Arrows", dPT:"Tiros na cabeça também curam aliados próximos.",    dEN:"Headshots also heal nearby allies."},
    {id:"catador",      nPT:"Catador",            nEN:"Scavenger",      dPT:"Aumenta a quantidade de munição coletada em 100%.", dEN:"Increases ammo picked up by 100%."}
  ],
  ronin: [
    {id:"esp_urso",  nPT:"Espírito de Urso", nEN:"Spirit Bear",    dPT:"O Animal Espiritual do Ronin invoca um urso em vez de um cachorro.", dEN:"The Ronin's Spirit Animal summons a bear instead of a dog."},
    {id:"esp_curat", nPT:"Espírito Curativo",nEN:"Healing Spirit", dPT:"O Animal Espiritual do Ronin tem uma aura curativa.",                dEN:"The Ronin's Spirit Animal has a healing aura."}
  ],
  assassin: [
    {id:"sumi_cadeia_p",nPT:"Sumiço em Cadeia", nEN:"Chain Vanish", dPT:"Assassinar ao usar Sumiço reativa e renova a duração.",dEN:"Assassinating while vanished re-activates vanish."},
    {id:"histeria",     nPT:"Histeria",          nEN:"Hysteria",     dPT:"Assassinatos fazem com que inimigos próximos alucinem.",dEN:"Assassinations cause nearby enemies to hallucinate."}
  ]
};

// ─── GEAR DATA ───────────────────────────────────────────────
```

> **Atenção:** Note que para o Samurai, o `alvos_extr` e `raio_lam` agora têm `sl:["P1","P2"]` (no amuleto de classe original são só P2). Isso é intencional — a regra é que no magistral vinculado, ficam disponíveis nos dois slots. O mesmo vale para `raio_raj_ro` do Ronin (no classe original é P2, aqui é P1+P2).

---

## 📝 MUDANÇA 2 — `logic.js`: Atualizar o import

**Onde:** Linha 6 (a única linha de import no início do arquivo).

**ANTIGO:**
```javascript
import { CLASSES, GEAR } from './data.js';
```

**NOVO:**
```javascript
import { CLASSES, GEAR, CLASS_EXCLUSIVE_CHARM_PROPS, CLASS_EXCLUSIVE_CHARM_PERKS } from './data.js';
```

---

## 📝 MUDANÇA 3 — `logic.js`: Reescrever `resolveCharmClassBinding`

**Por que o bug acontecia?** A função antiga achava o amuleto de classe pelo `linkedClass`, e depois filtrava os props do amuleto de classe que *não existiam no magistral base* pelo `sk`. O problema: um magistral de Furtividade (`bravura_xogum`) não tem props de ataque à distância, então quando vinculado ao Caçador, os props como `rangedDamage`, `drawSpeed` etc. passavam no filtro como "exclusivos". Mas esses props não são exclusivos do Caçador — são do sub-tipo "ranged" do amuleto de classe.

A solução é usar diretamente a nova tabela `CLASS_EXCLUSIVE_CHARM_PROPS` em vez de derivar pela comparação.

**Onde:** Linhas 175–210 (a função `resolveCharmClassBinding` completa).

**ANTIGO:**
```javascript
export function resolveCharmClassBinding(item, linkedClass) {
  if (!item || !item.classBinding || !linkedClass) return item;

  // Encontra o amuleto de classe correspondente
  const classCharm = GEAR.find(g =>
    g.type === 'charm' &&
    !g.leg &&
    g.by &&
    g.by.includes(linkedClass) &&
    !g.by.includes('hunter') // evita pegar amuleto errado quando hunter não está em `by`
  ) ?? GEAR.find(g =>
    g.type === 'charm' &&
    !g.leg &&
    g.by &&
    g.by[0] === linkedClass
  );

  if (!classCharm) return item;

  // Props exclusivas da classe (não existem no item base)
  const baseSkSet = new Set(item.props.map(p => p.sk));
  const exclusiveProps = classCharm.props.filter(p => !baseSkSet.has(p.sk));

  // Perks exclusivos da classe (não existem no item base)
  const basePerkSet = new Set(item.perks.map(p => p.id));
  const baseUniversalPerks = ['regen_comb','aparo_sang','mestre_fogo','aum_vida','maior_det_p','superarmadura','arrem_impac'];
  const exclusivePerks = classCharm.perks.filter(
    p => !basePerkSet.has(p.id) && !baseUniversalPerks.includes(p.id)
  );

  return {
    ...item,
    props: [...item.props, ...exclusiveProps],
    perks: [...item.perks, ...exclusivePerks],
  };
}
```

**NOVO:**
```javascript
export function resolveCharmClassBinding(item, linkedClass) {
  if (!item || !item.classBinding || !linkedClass) return item;

  // Usa diretamente as tabelas de props/perks exclusivos definidas em data.js.
  // Isso evita o bug antigo de adicionar props do sub-tipo do amuleto de classe
  // (ex: props de ranged do Amuleto do Caçador em magistrais de Furtividade).
  const exclusiveProps = CLASS_EXCLUSIVE_CHARM_PROPS[linkedClass] ?? [];
  const exclusivePerks = CLASS_EXCLUSIVE_CHARM_PERKS[linkedClass] ?? [];

  // Filtra props cujo sk já exista no magistral base (evita duplicação)
  const baseSkSet  = new Set(item.props.map(p => p.sk));
  const propsToAdd = exclusiveProps.filter(p => !baseSkSet.has(p.sk));

  // Filtra perks que já existam no magistral base (evita duplicação)
  const basePerkSet = new Set(item.perks.map(p => p.id));
  const perksToAdd  = exclusivePerks.filter(p => !basePerkSet.has(p.id));

  if (propsToAdd.length === 0 && perksToAdd.length === 0) return item;

  return {
    ...item,
    props: [...item.props, ...propsToAdd],
    perks: [...item.perks, ...perksToAdd],
  };
}
```

---

## 📝 MUDANÇA 4 — `App.jsx`: Substituir o seletor de classe por texto fixo

**Por que?** O vínculo já é automático — `createEmptyBuild` inicializa `linkedClass: classId`, e `changeClass` atualiza para `newClassId` quando a classe muda. O seletor só serve para confundir e permitir escolhas inválidas.

**Onde:** Linhas 401–421 (o bloco `{/* Class binding for legendary charms */}`).

**ANTIGO:**
```jsx
          {/* Class binding for legendary charms */}
          {slotName === 'charm' && isLeg && item.classBinding && !item.by && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>
                {lang === 'en' ? 'Bind to class:' : 'Vincular à classe:'}
              </div>
              <select
                value={slotState.linkedClass ?? ''}
                onChange={e => onLinkedClass(e.target.value)}
                style={{
                  width: '100%', background: T.panel, border: `1px solid ${T.border}`,
                  borderRadius: 6, color: T.text, fontSize: 12, padding: '5px 8px',
                }}>
                {CLASSES.map(c => (
                  <option key={c.id} value={c.id}>
                    {cls_emoji[c.id]} {lang === 'en' ? c.nEN : c.nPT}
                  </option>
                ))}
              </select>
            </div>
          )}
```

**NOVO:**
```jsx
          {/* Class binding for legendary charms — vinculado automaticamente à classe atual */}
          {slotName === 'charm' && isLeg && item.classBinding && !item.by && (() => {
            const boundCls = CLASSES.find(c => c.id === classId)
            return (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                marginBottom: 10, padding: '5px 10px',
                background: T.panel, border: `1px solid ${T.border}`,
                borderRadius: 6, fontSize: 11, color: T.muted,
              }}>
                <span>{lang === 'en' ? 'Bound to:' : 'Vinculado a:'}</span>
                <span style={{ fontWeight: 700, color: T.text }}>
                  {cls_emoji[classId]} {lang === 'en' ? boundCls?.nEN : boundCls?.nPT}
                </span>
              </div>
            )
          })()}
```

> **O que faz:** Mostra um badge simples e informativo com a classe atual. Como `linkedClass` já é sempre igual a `classId` (inicializado em `createEmptyBuild` e atualizado em `changeClass`), isso é apenas exibição — sem lógica adicional necessária.

---

## ✅ VERIFICAÇÃO RÁPIDA APÓS AS MUDANÇAS

Para testar que o Problema 1 está correto, ligue o magistral `bravura_xogum` (sub: stealth) e vincule a cada classe. Você deve ver:
- **Samurai**: `alvos_extr` + `raio_lam` aparecem em P1 e P2. Perks: `ritmo_cresc` + `golpes_abenc`
- **Caçadora**: apenas `raio_hab_h` em P1 e P2. Perks: `flechas_vis`, `flechas_abenc`, `catador`
- **Ronin**: `raio_aroma`, `dur_aroma`, `raio_esp`, `raio_raj_ro` em P1 e P2. Perks: `esp_urso`, `esp_curat`
- **Assassino**: `raio_sumi`, `dur_sumi`, `dano_cima` em P1 e P2. Perks: `sumi_cadeia_p`, `histeria`

Nenhum prop do sub-tipo do magistral deve desaparecer!

---

## ❓PERGUNTAS EXTRAS (Versátil / Perks de Desbloqueio / Munições)

### Perk "Versátil" automático no Arco Longo

**É viável? Sim, moderado esforço.** O plano seria:

**Em `data.js`** — criar uma tabela de desbloqueios:
```javascript
export const REQUIRED_PERKS = {
  // itemId: { classes: [...], perkId: "id_do_perk" }
  arco_longo:         { classes: ['samurai','ronin','assassin'], perkId: 'versatil' },
  arco_ricocheteador: { classes: ['samurai','ronin','assassin'], perkId: 'versatil' },
  zarabatana:         { classes: ['ronin'],                      perkId: 'desbloq_ron' },
  pacote_bombas:      { classes: ['assassin'],                   perkId: 'desbloq_ass' },
  remedio_proibido:   { classes: ['assassin','samurai'],         perkId: 'desbloq_ass_rp' }, // ou desbloq_sam_rp dependendo da classe
};
```

**Em `logic.js`** — a função `selectItem` ao selecionar o arco já auto-preenche `perk1`. E `selectPerk` bloqueia a remoção de `perk1` se for o perk obrigatório.

**Em `App.jsx`** — o slot de Perk 1 fica visualmente travado (sem botão de remover) quando é um perk obrigatório.

**É complicado?** São ~40-60 linhas de mudança em 3 arquivos, com lógica clara. Risco de bugs é baixo se feito com cuidado. Me diz se quer que eu te guie por isso em detalhe como fiz acima.

---

### Munições por classe

**É viável? Sim, baixo/médio esforço** — as strings já estão prontas no formato `"X (Y)"`, você só precisa de um parser de exibição.

A lógica seria: para cada arma, definir qual é a "classe primária". Na exibição em App.jsx (linha 377), em vez de mostrar a string bruta, processá-la assim:

```javascript
// "Flecha Flamejante: 2 (5)" → para hunter mostra "5", para outros mostra "2"
// "Flecha Perfurante: (6)"   → para hunter mostra "6", para outros não mostra linha
```

Isso muda **apenas** como o texto de ammo é formatado em App.jsx — umas 20 linhas novas, zero risco de afetar a lógica de stats. Me fala se quer o guia completo.
<!-- CONTEUDO:FIM bloco=2 -->

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [Bloco 3] Claude · v2

<!-- BLOCO 3 -->
**Subtítulo:** Claude  
**Versão:** v2  

**Conteúdo:**

<!-- CONTEUDO:INICIO bloco=3 -->
Deixa eu primeiro ver o PerkInput no App.jsx para te dar o código exato da implementação dos perks obrigatórios:Tenho tudo que preciso. Resposta completa e detalhada agora:

---

## ❓ PERGUNTA 1: Pode apagar o bloco `{/* Class binding */}` com segurança?

**Sim, quase.** Há exatamente **4 pontos** para checar:

| O que | Arquivo | Pode apagar? |
|---|---|---|
| O bloco JSX (`{/* Class binding... */}`) | App.jsx | ✅ Sim |
| Função `onLinkedClass` (linhas 307-309) | App.jsx | ✅ Sim |
| `setCharmLinkedClass` no import (linha 7) | App.jsx | ✅ Sim, remover do import |
| Função `setCharmLinkedClass` (linha 860-873) | logic.js | ⚠️ Pode deixar ou apagar — não causa erro, só fica "morta" |
| Campo `linkedClass` no estado do build | logic.js / build state | ❌ **Não apagar!** Usado por `getEffectiveCharm` em múltiplos lugares |

**Resumindo:** o campo `linkedClass` no estado interno (inicializado em `createEmptyBuild` e atualizado em `changeClass`) **precisa ficar**, pois é ele que `getEffectiveCharm(slot.itemId, slot.linkedClass)` usa para aplicar os props de classe. Só a *interface* de seleção que pode sumir.

---

## 📝 FEATURE: Perks obrigatórios de desbloqueio

São **4 mudanças**: 1 em `data.js`, 3 em `logic.js`, 2 em `App.jsx`.

---

### MUDANÇA 1 — `data.js`: Tabela `REQUIRED_PERKS`

**Onde:** Logo após as constantes `CLASS_EXCLUSIVE_CHARM_PERKS` que você já adicionou (ou, se não as adicionou ainda, logo antes de `// ─── GEAR DATA ───`).

**Adicionar (bloco novo, não substitui nada):**
```javascript
// ─── PERKS OBRIGATÓRIOS POR ITEM+CLASSE ─────────────────────
// Estrutura: { itemId: { classId: 'perkId', ... } }
// Quando uma classe usa um item que não é "primário" dela,
// o perk listado é obrigatório e fica travado no slot Perk I.
export const REQUIRED_PERKS = {
  arco_longo:         { samurai: 'versatil', ronin: 'versatil', assassin: 'versatil' },
  arco_ricocheteador: { samurai: 'versatil', ronin: 'versatil', assassin: 'versatil' },
  zarabatana:         { ronin: 'desbloq_ron' },
  pacote_bombas:      { assassin: 'desbloq_ass' },
  remedio_proibido:   { assassin: 'desbloq_ass_rp', samurai: 'desbloq_sam_rp' },
};
```

> **Por que a estrutura `{ classId: 'perkId' }`?** Porque o `remedio_proibido` tem **dois** perks de desbloqueio diferentes: um para assassino e um para samurai. Se fosse `{ classes: [...], perkId: '...' }` não daria para diferenciá-los.

---

### MUDANÇA 2 — `logic.js`: Atualizar import e adicionar helper

**Onde:** Linha 6 (import do data.js).

**ANTIGO:**
```javascript
import { CLASSES, GEAR, CLASS_EXCLUSIVE_CHARM_PROPS, CLASS_EXCLUSIVE_CHARM_PERKS } from './data.js';
```

**NOVO:**
```javascript
import { CLASSES, GEAR, CLASS_EXCLUSIVE_CHARM_PROPS, CLASS_EXCLUSIVE_CHARM_PERKS, REQUIRED_PERKS } from './data.js';
```

Depois, **logo abaixo do import** (pode ser antes da linha `// ─── CONSTANTES ───`), adicionar a função helper:

```javascript
/**
 * Retorna o id do perk obrigatório para um item numa determinada classe.
 * Retorna null se não houver obrigatoriedade.
 */
export function getRequiredPerkId(itemId, classId) {
  if (!itemId || !classId) return null;
  return REQUIRED_PERKS[itemId]?.[classId] ?? null;
}
```

---

### MUDANÇA 3 — `logic.js`: Atualizar `selectItem`

**Por que?** Quando o usuário escolhe, por exemplo, o Arco Longo como Samurai, o `perk1` já deve vir preenchido com `'versatil'` automaticamente, sem o usuário precisar selecionar.

**Onde:** Função `selectItem` completa (linhas 721–735).

**ANTIGO:**
```javascript
export function selectItem(build, slotName, itemId) {
  const prev = build.gear[slotName];
  return {
    ...build,
    gear: {
      ...build.gear,
      [slotName]: {
        ...emptySlot(),
        itemId: itemId ?? null,
        // Preserva linkedClass no charm
        ...(slotName === 'charm' ? { linkedClass: prev.linkedClass ?? build.classId } : {}),
      },
    },
  };
}
```

**NOVO:**
```javascript
export function selectItem(build, slotName, itemId) {
  const prev = build.gear[slotName];
  // Se o item exige um perk para esta classe, pré-preenche perk1
  const requiredPerkId = itemId ? getRequiredPerkId(itemId, build.classId) : null;
  return {
    ...build,
    gear: {
      ...build.gear,
      [slotName]: {
        ...emptySlot(),
        itemId: itemId ?? null,
        // Preserva linkedClass no charm
        ...(slotName === 'charm' ? { linkedClass: prev.linkedClass ?? build.classId } : {}),
        // Auto-preenche perk1 se houver perk obrigatório
        ...(requiredPerkId ? { perk1: requiredPerkId } : {}),
      },
    },
  };
}
```

---

### MUDANÇA 4 — `logic.js`: Atualizar `selectPerk`

**Por que?** Bloqueia qualquer tentativa de trocar ou remover o `perk1` quando ele é obrigatório para a classe atual.

**Onde:** Função `selectPerk` completa (linhas 830–850).

**ANTIGO:**
```javascript
export function selectPerk(build, slotName, perkSlot, perkId) {
  const slot      = build.gear[slotName];
  const otherKey  = perkSlot === 'perk1' ? 'perk2' : 'perk1';
  const otherPerk = slot[otherKey];

  // Clicar no mesmo desseleciona
  if (slot[perkSlot] === perkId) perkId = null;
  // Impede duplicata
  if (perkId && perkId === otherPerk) return build;

  return {
    ...build,
    gear: {
      ...build.gear,
      [slotName]: {
        ...slot,
        [perkSlot]: perkId ?? null,
      },
    },
  };
}
```

**NOVO:**
```javascript
export function selectPerk(build, slotName, perkSlot, perkId) {
  const slot      = build.gear[slotName];
  const otherKey  = perkSlot === 'perk1' ? 'perk2' : 'perk1';
  const otherPerk = slot[otherKey];

  // Bloqueia qualquer interação com perk1 se ele for obrigatório para esta classe
  if (perkSlot === 'perk1') {
    const requiredPerkId = getRequiredPerkId(slot.itemId, build.classId);
    if (requiredPerkId) return build; // slot travado, ignora silenciosamente
  }

  // Clicar no mesmo desseleciona
  if (slot[perkSlot] === perkId) perkId = null;
  // Impede duplicata
  if (perkId && perkId === otherPerk) return build;

  return {
    ...build,
    gear: {
      ...build.gear,
      [slotName]: {
        ...slot,
        [perkSlot]: perkId ?? null,
      },
    },
  };
}
```

---

### MUDANÇA 5 — `logic.js`: Atualizar `changeClass`

**Por que?** Quando o usuário troca de classe e o equipamento é preservado (válido para a nova classe), o `perk1` precisa ser atualizado. Exemplo: Samurai tinha Arco Longo com `perk1: 'versatil'` (obrigatório). Troca para Caçadora → Caçadora não precisa do `versatil`, então `perk1` deve virar `null` (liberado para o usuário escolher). No sentido inverso, Caçadora troca para Samurai → `perk1` deve automaticamente virar `'versatil'`.

**Onde:** Dentro da função `changeClass` (linhas 895–912), especificamente o bloco `if (valid)`.

**ANTIGO:**
```javascript
    if (valid) {
      newBuild.gear[slotName] = {
        ...slot,
        linkedClass: slotName === 'charm' ? newClassId : undefined,
      };
    }
```

**NOVO:**
```javascript
    if (valid) {
      const oldRequiredPerk = getRequiredPerkId(slot.itemId, build.classId);
      const newRequiredPerk = getRequiredPerkId(slot.itemId, newClassId);
      // Se perk1 era o perk obrigatório da classe antiga, atualiza para o novo (ou libera)
      const preservedPerk1 = newRequiredPerk
        ? newRequiredPerk
        : (slot.perk1 === oldRequiredPerk ? null : slot.perk1);
      newBuild.gear[slotName] = {
        ...slot,
        linkedClass: slotName === 'charm' ? newClassId : undefined,
        perk1: preservedPerk1,
      };
    }
```

---

### MUDANÇA 6 — `logic.js`: Atualizar `randomBuild`

**Por que?** O build aleatório também deve respeitar o perk obrigatório — se sorteia o Arco Longo para o Samurai, `perk1` já começa com `'versatil'` e `perk2` sorteia entre os demais.

**Onde:** Linhas 981–994 (bloco de perks no `randomBuild`).

**ANTIGO:**
```javascript
    // Perks
    const perks = [...effectiveItem.perks];
    const perk1 = perks.length > 0 ? pick(perks).id : null;
    const remaining = perks.filter(p => p.id !== perk1);
    const perk2 = remaining.length > 0 ? pick(remaining).id : null;

    nb.gear[slot] = {
      itemId: chosen.id,
      linkedClass,
      p1: { propId: p1?.id ?? null, value: p1val },
      p2: { propId: p2?.id ?? null, value: p2val },
      perk1,
      perk2,
    };
```

**NOVO:**
```javascript
    // Perks
    const perks = [...effectiveItem.perks];
    const forcedPerk = getRequiredPerkId(chosen.id, classId);
    // perk1: usa o obrigatório se existir, senão sorteia livremente
    const perk1 = forcedPerk ?? (perks.length > 0 ? pick(perks).id : null);
    const remaining = perks.filter(p => p.id !== perk1);
    const perk2 = remaining.length > 0 ? pick(remaining).id : null;

    nb.gear[slot] = {
      itemId: chosen.id,
      linkedClass,
      p1: { propId: p1?.id ?? null, value: p1val },
      p2: { propId: p2?.id ?? null, value: p2val },
      perk1,
      perk2,
    };
```

---

### MUDANÇA 7 — `App.jsx`: Importar `getRequiredPerkId`

**Onde:** O bloco de imports do `logic.js` (linhas 4–17).

**ANTIGO (linha 8):**
```javascript
  checkLegendaryLimit, getGearListForClass, getAvailableProps,
```

**NOVO:**
```javascript
  checkLegendaryLimit, getGearListForClass, getAvailableProps, getRequiredPerkId,
```

---

### MUDANÇA 8 — `App.jsx`: Calcular `requiredPerkId` em `GearSlotCard`

**Por que?** O componente de slot precisa saber se `perk1` está travado para passar a informação ao `PerkRow`.

**Onde:** Dentro de `GearSlotCard` (linhas 259–466), logo após o `useMemo` do `effectiveItem` (depois da linha 268).

**ANTIGO (linhas 270–273):**
```javascript
  const isLeg   = item?.leg === true
  const ammo    = item?.ammo
  const xp      = item?.xp
  const legInfo = useMemo(() => checkLegendaryLimit(build), [build])
```

**NOVO:**
```javascript
  const isLeg   = item?.leg === true
  const ammo    = item?.ammo
  const xp      = item?.xp
  const legInfo = useMemo(() => checkLegendaryLimit(build), [build])
  // Perk obrigatório para esta combinação item+classe (null se não houver)
  const requiredPerkId = useMemo(
    () => getRequiredPerkId(slotState.itemId, classId),
    [slotState.itemId, classId]
  )
```

---

### MUDANÇA 9 — `App.jsx`: Passar `forcedPerkId` ao `PerkRow` de perk1

**Onde:** Linhas 446–453 (o primeiro `<PerkRow>`).

**ANTIGO:**
```jsx
          <PerkRow
            item={effectiveItem}
            selected={slotState.perk1}
            other={slotState.perk2}
            onSelect={id => onPerkSelect('perk1', id)}
            perkSlot="perk1"
            lang={lang}
          />
```

**NOVO:**
```jsx
          <PerkRow
            item={effectiveItem}
            selected={slotState.perk1}
            other={slotState.perk2}
            onSelect={id => onPerkSelect('perk1', id)}
            perkSlot="perk1"
            lang={lang}
            forcedPerkId={requiredPerkId}
          />
```

---

### MUDANÇA 10 — `App.jsx`: Atualizar o componente `PerkRow`

**Por que?** É aqui que a interface mostra visualmente que o `perk1` está travado — o select fica desabilitado e aparece um ícone de cadeado indicando que é um perk de desbloqueio obrigatório.

**Onde:** Função `PerkRow` completa (linhas 222–256).

**ANTIGO:**
```jsx
function PerkRow({ item, selected, other, onSelect, perkSlot, lang }) {
  const avail = item ? item.perks.filter(p => p.id !== other) : []
  const perkDef = selected ? item?.perks.find(p => p.id === selected) : null
  const labelPT = perkSlot === 'perk1' ? 'Vantagem I (60 Ki)' : 'Vantagem II (120 Ki)'
  const labelEN = perkSlot === 'perk1' ? 'Perk I (60 Ki)' : 'Perk II (120 Ki)'
  const label = lang === 'en' ? labelEN : labelPT
  const desc = perkDef ? (lang === 'en' ? (perkDef.dEN || perkDef.dPT) : perkDef.dPT) : null

  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ fontSize: 10, color: T.muted, marginBottom: 3 }}>{label}</div>
      <Tooltip text={desc}>
        <select
          value={selected ?? ''}
          onChange={e => onSelect(e.target.value || null)}
          style={{
            width: '100%', background: T.panel, border: `1px solid ${T.border}`,
            borderRadius: 6, color: T.text, fontSize: 12, padding: '5px 8px',
          }}>
          <option value="">— {lang === 'en' ? 'Perk' : 'Vantagem'} —</option>
          {avail.map(p => (
            <option key={p.id} value={p.id}>
              {lang === 'en' ? (p.nEN || p.nPT) : p.nPT}
            </option>
          ))}
        </select>
      </Tooltip>
      {desc && (
        <div style={{ fontSize: 11, color: T.muted, marginTop: 3, paddingLeft: 4 }}>
          {desc}
        </div>
      )}
    </div>
  )
}
```

**NOVO:**
```jsx
function PerkRow({ item, selected, other, onSelect, perkSlot, lang, forcedPerkId }) {
  // Se forcedPerkId existe, este slot está travado (perk de desbloqueio obrigatório)
  const isForced = perkSlot === 'perk1' && !!forcedPerkId
  const effectiveSelected = isForced ? forcedPerkId : selected

  const avail = item ? item.perks.filter(p => p.id !== other) : []
  const perkDef = effectiveSelected ? item?.perks.find(p => p.id === effectiveSelected) : null
  const labelPT = perkSlot === 'perk1' ? 'Vantagem I (60 Ki)' : 'Vantagem II (120 Ki)'
  const labelEN = perkSlot === 'perk1' ? 'Perk I (60 Ki)' : 'Perk II (120 Ki)'
  const label = lang === 'en' ? labelEN : labelPT
  const desc = perkDef ? (lang === 'en' ? (perkDef.dEN || perkDef.dPT) : perkDef.dPT) : null

  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: T.muted }}>{label}</span>
        {isForced && (
          <span style={{ fontSize: 10, color: T.leg, fontWeight: 700 }}>
            🔒 {lang === 'en' ? 'Required' : 'Obrigatório'}
          </span>
        )}
      </div>
      <Tooltip text={desc}>
        <select
          value={effectiveSelected ?? ''}
          onChange={e => !isForced && onSelect(e.target.value || null)}
          disabled={isForced}
          style={{
            width: '100%', background: isForced ? T.panel : T.panel,
            border: `1px solid ${isForced ? T.leg + '60' : T.border}`,
            borderRadius: 6, color: isForced ? T.leg : T.text,
            fontSize: 12, padding: '5px 8px',
            opacity: isForced ? 0.85 : 1,
            cursor: isForced ? 'not-allowed' : 'default',
          }}>
          {isForced ? null : <option value="">— {lang === 'en' ? 'Perk' : 'Vantagem'} —</option>}
          {avail.map(p => (
            <option key={p.id} value={p.id}>
              {lang === 'en' ? (p.nEN || p.nPT) : p.nPT}
            </option>
          ))}
        </select>
      </Tooltip>
      {desc && (
        <div style={{ fontSize: 11, color: isForced ? T.leg : T.muted, marginTop: 3, paddingLeft: 4 }}>
          {desc}
        </div>
      )}
    </div>
  )
}
```

> **O que mudou visualmente:** quando o perk é obrigatório, o label mostra `🔒 Obrigatório`, a borda do select fica com a cor dourada dos magistrais (`T.leg`), o cursor muda para `not-allowed` e o texto da descrição fica na mesma cor dourada. O usuário vê claramente que está travado e por quê.

---

## 📝 FEATURE: Munições por classe

São apenas **2 mudanças**, ambas em `App.jsx`.

---

### MUDANÇA 11 — `App.jsx`: Adicionar funções de formatação de munição

**Onde:** Logo após a linha `const btnSmall = { ... }` (linha 215–219), antes do componente `PerkRow`. Adicionar este bloco novo:

```javascript
// ─── Formatação de munições por classe ───────────────────────
/**
 * Detecta a classe "primária" de um item (aquela que tem a quantidade maior).
 * - Itens com `by`: o primeiro da lista é o primário.
 * - Itens `by: null` do tipo ranged: hunter é o primário (flechas).
 */
function getPrimaryClass(item) {
  if (!item) return null;
  if (item.by && item.by.length > 0) return item.by[0];
  if (item.type === 'ranged') return 'hunter';
  return null;
}

/**
 * Formata o texto de munição de acordo com a classe atual.
 *
 * Regras:
 * - "Label: X (Y)" → classe primária mostra Y, outras mostram X
 * - "Label: (Y)"   → classe primária mostra Y, outras NÃO mostram a linha
 * - "Label: X"     → todos mostram X (sem diferença)
 */
function formatAmmoForClass(ammoStr, classId, item) {
  if (!ammoStr) return ammoStr;
  const primaryClass = getPrimaryClass(item);
  // Se não há classe primária definida, mostra como está
  if (!primaryClass) return ammoStr;

  const isPrimary = classId === primaryClass;

  const lines = ammoStr.split('\n');
  const result = lines.map(line => {
    // Padrão "Label: X (Y)" — valor externo e interno
    const matchBoth = line.match(/^(.+?):\s*(\d+)\s*\((\d+)\)$/)
    if (matchBoth) {
      const [, label, outside, inside] = matchBoth
      return isPrimary ? `${label}: ${inside}` : `${label}: ${outside}`
    }
    // Padrão "Label: (Y)" — só valor entre parênteses
    const matchInner = line.match(/^(.+?):\s*\((\d+)\)$/)
    if (matchInner) {
      const [, label, inside] = matchInner
      // Primário mostra o valor; outros ocultam a linha inteiramente
      return isPrimary ? `${label}: ${inside}` : null
    }
    // Sem parênteses — igual para todos
    return line
  }).filter(Boolean)  // remove as linhas null (ocultas)

  return result.join('\n')
}
```

---

### MUDANÇA 12 — `App.jsx`: Usar a formatação no display de ammo

**Onde:** Linhas 371–379 (o bloco `{/* Ammo info */}`).

**ANTIGO:**
```jsx
          {/* Ammo info */}
          {ammo && (
            <div style={{
              background: T.panel, border: `1px solid ${T.border}`,
              borderRadius: 7, padding: '7px 12px', marginBottom: 10,
              fontSize: 11, color: T.muted, whiteSpace: 'pre-line',
            }}>
              🎯 {lang === 'en' ? (ammo.en || ammo.pt) : ammo.pt}
            </div>
          )}
```

**NOVO:**
```jsx
          {/* Ammo info — formatada por classe */}
          {ammo && (() => {
            const rawAmmo = lang === 'en' ? (ammo.en || ammo.pt) : ammo.pt
            const formattedAmmo = formatAmmoForClass(rawAmmo, classId, item)
            if (!formattedAmmo) return null
            return (
              <div style={{
                background: T.panel, border: `1px solid ${T.border}`,
                borderRadius: 7, padding: '7px 12px', marginBottom: 10,
                fontSize: 11, color: T.muted, whiteSpace: 'pre-line',
              }}>
                🎯 {formattedAmmo}
              </div>
            )
          })()}
```

> **O que é esse `(() => { ... })()`?** É uma IIFE (função imediatamente executada) dentro do JSX. Permite usar variáveis locais (`rawAmmo`, `formattedAmmo`) sem criar um componente separado. Funciona exatamente como o bloco que você já tinha no `{/* Class binding */}` da correção anterior.

---

## ✅ Resultado final das munições por classe

Com essas mudanças, um **Samurai** com Arco Longo verá:
```
Flecha Normal: 15
Flecha Flamejante: 2
```
(A flecha perfurante `(6)` some pois não tem valor externo)

E o **Caçador** com o mesmo arco verá:
```
Flecha Normal: 15
Flecha Flamejante: 5
Flecha Perfurante: 6
```

Para o **Ronin** com Pacote de Bombas verá:
```
Bomba de Concussão: 12
Bomba Luminosa: 2
Bomba de Pólvora: 2
```

E o **Assassino** com o mesmo pacote verá:
```
Bomba de Concussão: 6
Bomba Luminosa: 2
Bomba de Pólvora: 2
```
<!-- CONTEUDO:FIM bloco=3 -->

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [Bloco 4] Prompt · v2

<!-- BLOCO 4 -->
**Subtítulo:** Prompt  
**Versão:** v2  

**Conteúdo:**

<!-- CONTEUDO:INICIO bloco=4 -->
Eu tentei publicar no git conforme as especificações do claude
deu esse erro no caminho
PS C:\Users\alexk\got-legends> git remote add origin https://github.com/arlsnech/got-legends.git
PS C:\Users\alexk\got-legends> git branch -M main
PS C:\Users\alexk\got-legends> git push -u origin main
Enumerating objects: 4202, done.
Counting objects: 100% (4202/4202), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3060/3060), done.
Writing objects: 100% (4202/4202), 13.45 MiB | 6.66 MiB/s, done.
Total 4202 (delta 1012), reused 4202 (delta 1012), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (1012/1012), done.
To https://github.com/arlsnech/got-legends.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
PS C:\Users\alexk\got-legends> npm install
up to date, audited 159 packages in 3s
30 packages are looking for funding
  run `npm fund` for details
2 moderate severity vulnerabilities
To address all issues (including breaking changes), run:
  npm audit fix --force
Run `npm audit` for details.
PS C:\Users\alexk\got-legends> npm run deploy
> got-legends-build-planner@1.0.0 deploy
> npm run build && npx gh-pages -d dist
> got-legends-build-planner@1.0.0 build
> vite build
vite v5.4.21 building for production...
✓ 32 modules transformed.
dist/index.html                  0.53 kB │ gzip:  0.38 kB
dist/assets/index-4rQ1sHRp.js  251.94 kB │ gzip: 73.49 kB
✓ built in 1.30s
Error: spawn ENAMETOOLONG
    at ChildProcess.spawn (node:internal/child_process:421:11)
    at Object.spawn (node:child_process:796:9)
    at C:\Users\alexk\got-legends\node_modules\gh-pages\lib\git.js:30:22
    at new Promise (<anonymous>)
    at spawn (C:\Users\alexk\got-legends\node_modules\gh-pages\lib\git.js:29:10)
    at Git.exec (C:\Users\alexk\got-legends\node_modules\gh-pages\lib\git.js:69:10)
    at Git.rm (C:\Users\alexk\got-legends\node_modules\gh-pages\lib\git.js:146:15)
    at C:\Users\alexk\got-legends\node_modules\gh-pages\lib\index.js:188:22
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
PS C:\Users\alexk\got-legends>

e então tive que ir para o PARTE 6 — Ativar o GitHub Pages (se não ligar automaticamente)
Acesse o repositório em https://github.com/arlsnech/got-legends/settings/pages e configure:

* Source: Deploy from a branch
* Branch: `gh-pages` → `/ (root)`
* Salvar
só que ao inves de gh-pages só tinha a opção main, fiz como disse, e abriu minha pagina, só que em branco, sem nada, recarreguei varias vezes e já esperei 10 minutos e testei de novo, e nada
Como faço para corrigir isso? onde está o problema?
<!-- CONTEUDO:FIM bloco=4 -->

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## [Bloco 5] Claude · v3

<!-- BLOCO 5 -->
**Subtítulo:** Claude  
**Versão:** v3  

**Conteúdo:**

<!-- CONTEUDO:INICIO bloco=5 -->
O erro `ENAMETOOLONG` é um problema clássico do Windows — o `gh-pages` tenta rodar um comando `git rm` com centenas de arquivos na mesma linha, excedendo o limite de tamanho de comando do Windows. O `main` branch em branco é porque ele está servindo código-fonte React (que o browser não entende), não o build compilado.

Você tem duas saídas. Vou te dar as duas, da mais simples para a menos simples:

---

## ✅ OPÇÃO 1 — Netlify (arrasta e solta, 2 minutos, zero comando)

Esta é a mais fácil e não tem nenhum dos problemas do Windows:

1. Abra o terminal na pasta do projeto e rode só o build:
```powershell
npm run build
```
Isso vai criar/atualizar a pasta `dist/` com os arquivos compilados.

2. Acesse **https://app.netlify.com/drop**

3. Arraste a pasta `dist/` (que fica dentro de `C:\Users\alexk\got-legends\dist\`) direto para a página do Netlify

4. Pronto — em segundos você recebe uma URL como `https://nome-aleatorio.netlify.app`

5. Opcionalmente, faça login com GitHub e renomeie o site para `got-legends` nas configurações, ficando `https://got-legends.netlify.app`

---

## ✅ OPÇÃO 2 — Corrigir o GitHub Pages manualmente (sem o gh-pages problemático)

O que vamos fazer: criar o branch `gh-pages` na mão, colocar só o conteúdo do `dist/` lá, e configurar o GitHub Pages para usar esse branch.

Rode **um comando por vez** no PowerShell dentro de `C:\Users\alexk\got-legends`:

**Passo 1 — Buildar:**
```powershell
npm run build
```

**Passo 2 — Entrar na pasta dist e inicializar um git temporário:**
```powershell
cd dist
git init
git add .
git commit -m "deploy"
```

**Passo 3 — Forçar push para o branch gh-pages do seu repositório:**
```powershell
git push --force https://github.com/arlsnech/got-legends.git HEAD:gh-pages
```
Aqui vai pedir usuário e senha (use o Personal Access Token como senha, igual fez antes).

**Passo 4 — Voltar para a pasta principal:**
```powershell
cd ..
```

**Passo 5 — Configurar o GitHub Pages:**
- Acesse **https://github.com/arlsnech/got-legends/settings/pages**
- **Source:** Deploy from a branch
- **Branch:** `gh-pages` → `/ (root)`
- Salvar

Aguarde 2–3 minutos e acesse **https://arlsnech.github.io/got-legends/**

> **Para deploys futuros** (quando atualizar o código): repita os Passos 1 a 4. O Passo 5 só precisa fazer uma vez.

---

## Por que a página ficou em branco antes?

Quando você apontou o Pages para o branch `main`, o GitHub serviu os arquivos `App.jsx`, `data.js` etc. diretamente — que são código React/JSX, não HTML/JS que o browser entende. O browser recebeu o arquivo e não soube o que fazer com ele. O build (`npm run build`) é justamente o processo que transforma esses arquivos em HTML+JS puro que qualquer browser entende.
<!-- CONTEUDO:FIM bloco=5 -->

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

