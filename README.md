# ⛩ Ghost of Tsushima: Legends — Build Planner

> Planejador de builds completo para Ghost of Tsushima: Legends, com cálculo de estatísticas em tempo real, suporte bilíngue PT-BR/EN e sistema de salvar/exportar builds.
>
> A complete build planner for Ghost of Tsushima: Legends, featuring real-time stat calculations, PT-BR/EN bilingual support, and build save/export system.

**🔗 [Acesse a ferramenta / Access the tool](https://arlsnech.github.io/got-legends/)**

---

## 📸 Visão Geral / Overview

A ferramenta permite montar completamente um personagem de Ghost of Tsushima: Legends:

- **4 classes**: Samurai, Caçadora (Hunter), Ronin, Assassino (Assassin)
- **Seleção de habilidade de classe** com recarga calculada em tempo real
- **Vantagens I, II e III** (comportamento de rádio, 1 por tier)
- **5 slots de equipamento**: Katana, Longo Alcance, Amuleto, Arma Fantasma I e II
- **Propriedades e Vantagens** por equipamento, incluindo todos os itens Magistrais (Legendary)
- **Painel de estatísticas** calculadas em tempo real com separação por categoria
- **CDR de Armas Fantasma calculado individualmente** — CDR própria da arma ≠ CDR global do amuleto
- **Card do Supremo** com variantes selecionáveis (Ronin), golpes e modificadores
- **Toggle PT-BR ↔ EN** em tempo real
- **Sistema de saves**: salvar/carregar localmente, exportar/importar .json, compartilhar por código

---

## 🗂 Estrutura do Projeto

```
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
```

---

## 🚀 Como Rodar Localmente

```bash
# 1. Clonar o repositório
git clone https://github.com/arlsnech/got-legends.git
cd got-legends

# 2. Instalar dependências
npm install

# 3. Rodar em desenvolvimento
npm run dev
# Acesse: http://localhost:5173/got-legends/
```

> **Requisitos:** Node.js 18+ e npm

---

## ⚙️ Mecânicas Implementadas

### Itens Magistrais (Legendary)
- Props travadas no valor máximo (selecionáveis mas não editáveis)
- Limite de 1 magistral por padrão, expandível via técnicas "Magistral" (+1 por técnica)
- Bloqueio ao tentar remover a técnica Magistral quando o limite já está sendo usado

### CDR de Armas Fantasma
- CDR própria da AF (propriedade na própria arma) → afeta **apenas aquela arma**
- CDR global do amuleto → afeta **ambas as armas**
- Exibição separada por arma no painel de estatísticas

### Restrições de Classe
| Equipamento | Classe Base |
|---|---|
| Zarabatana / Picada Celestial | Assassino (Ronin com Vantagem) |
| Pacote de Bombas / Remédio Proibido | Ronin (Assassino com Vantagem) |
| Amuletos de Classe | Exclusivo da classe correspondente |
| Arco Longo, Arcos Magistrais, todas as Katanas e AF Magistrais | Qualquer classe |

---

## 📁 Builds de Exemplo

### Códigos de Compartilhamento (Base64)
#### [O Samurai Contra-Ataca] — **Samurai**
Build focada no contra-ataque da katana Ira de Sarugami
*[cole o codigo abaixo e carregue]*
```
eyJ2ZXJzaW9uIjoiMS4wIiwiZ2FtZSI6ImdvdC1sZWdlbmRzIiwiaWQiOiJtbzhzM2NrcWN0MXEyIiwibmFtZSI6Ik8gU2FtdXJhaSBDb250cmEtQXRhY2EiLCJjcmVhdGVkQXQiOiIyMDI2LTA0LTIxVDE1OjI4OjIxLjA5OFoiLCJidWlsZCI6eyJjbGFzc0lkIjoic2FtdXJhaSIsImFiaWxpdHlJZCI6ImxhbWluYV9leHBsb3NpdmEiLCJyb25pbl9icmVhdGgiOm51bGwsInRlY2hzIjp7IkkiOiJnb2xwZXNfcHJvZiIsIklJIjoiZ29scGVfY3VyIiwiSUlJIjoiZnVyaWFfaGFjaF90MyJ9LCJnZWFyIjp7ImthdGFuYSI6eyJpdGVtSWQiOiJpcmFfc2FydWdhbWkiLCJwMSI6eyJwcm9wSWQiOiJqYW5lbGFfYXBhcm8iLCJ2YWx1ZSI6MC4xMn0sInAyIjp7InByb3BJZCI6ImRhbm9fY29udHJhIiwidmFsdWUiOjAuMn0sInBlcmsxIjoiY29udHJhX2ludGltIiwicGVyazIiOiJwb3N0dXJhX2x1YSJ9LCJyYW5nZWQiOnsiaXRlbUlkIjoiYXJjb19jdXJ0byIsInAxIjp7InByb3BJZCI6ImdhbmhvX2RldF9kaXN0IiwidmFsdWUiOjAuMX0sInAyIjp7InByb3BJZCI6InZlbF90ZW5zYW8iLCJ2YWx1ZSI6MC4yfSwicGVyazEiOiJtdW5fZW52IiwicGVyazIiOiJtdW5fYWZpIn0sImNoYXJtIjp7Iml0ZW1JZCI6ImFtdWxldG9fc2FtdXJhaSIsInAxIjp7InByb3BJZCI6ImphbmVsYV9jIiwidmFsdWUiOjAuMTJ9LCJwMiI6eyJwcm9wSWQiOiJjb250cmFfYyIsInZhbHVlIjowLjJ9LCJwZXJrMSI6InJpdG1vX2NyZXNjIiwicGVyazIiOiJnb2xwZXNfYWJlbmMiLCJsaW5rZWRDbGFzcyI6InNhbXVyYWkifSwiZ3cxIjp7Iml0ZW1JZCI6ImFycmVtZXNzb190ZXJyYSIsInAxIjp7InByb3BJZCI6ImphbmVsYV9rIiwidmFsdWUiOjAuMTJ9LCJwMiI6eyJwcm9wSWQiOiJyZWRfcmVjX2d3MV9raWxsIiwidmFsdWUiOjR9LCJwZXJrMSI6ImVtX2NoYW1hczIiLCJwZXJrMiI6InBvZHJpZGFvIn0sImd3MiI6eyJpdGVtSWQiOiJjYWJhY2FfY3VyYXRpdmEiLCJwMSI6eyJwcm9wSWQiOiJyZWRfZGFub19nIiwidmFsdWUiOjAuMX0sInAyIjp7InByb3BJZCI6InJlZF9yZWNfZ3cyX2tpbGwiLCJ2YWx1ZSI6NH0sInBlcmsxIjoiZGV0X3JlcGVudDIiLCJwZXJrMiI6ImJlYmlkYV9mb3J0ZSJ9fX19

```

---

## 📊 Fontes de Dados

Os dados da ferramenta foram compilados a partir de:

- **[Planilha PT-BR](https://docs.google.com/spreadsheets/d/1nTewBLL3gQrmVvFe0cs81CGWzqryh9uS-PHK7vuzUgg/edit?usp=sharing)** criada e mantida pelo autor deste repositório (arlsnech)
  — cobre todas as propriedades, vantagens, técnicas, equipamentos e magistrais com valores verificados no jogo
- **[Ghost of Tsushima: Legends Wiki — Gear](https://ghostfranchise.fandom.com/wiki/Gear)**
  — referência para termos em inglês e dados de equipamentos
- **[ghostoftsushimalegends.com — Damage Calculator](https://ghostoftsushimalegends.com/damage/)**
  — referência para regras de empilhamento de dano e mecânicas avançadas
- **Community Data Sheet** compilado por:
  - **DoctorKoolman** · **Boneofimba** · **berrek45** · **tenshimkii** e demais colaboradores da comunidade GoT Legends
  — planilha com dados de datamining, testes de mecânicas e tier lists de magistrais

---

## 🤝 Créditos / Credits

| Papel | Quem |
|---|---|
| Autor e mantenedor | **arlsnech** |
| Dados, pesquisa e verificação | **arlsnech** (planilha PT-BR) |
| Dados da comunidade EN | DoctorKoolman, Boneofimba, berrek45, tenshimkii |
| Wiki de referência | ghostfranchise.fandom.com |
| Mecânicas de dano | ghostoftsushimalegends.com |
| Desenvolvimento técnico (código) | **Claude** (Anthropic) — IA assistente que escreveu a implementação completa de `data.js`, `logic.js` e `App.jsx` com base nas especificações, planilha e dados fornecidos pelo autor |

> Este projeto é um trabalho colaborativo entre pesquisa humana (dados, especificações, verificação e correções) e implementação assistida por IA.

---

## 🌐 Outras Plataformas

<!-- A adicionar -->

---

## 📄 Licença

Uso pessoal e não-comercial. Os dados do jogo pertencem à **Sucker Punch Productions / Sony Interactive Entertainment**.

---

## 🗒 Notas de Desenvolvimento

Alguns desafios e decisões tomadas durante o desenvolvimento:

- **Banco de dados explícito**: todos os 27 itens magistrais têm props e perks escritos explicitamente, sem "herança" de itens base — evita bugs de dados incorretos ao regenerar código
- **CDR separado por arma**: as propriedades de cooldown de Arma Fantasma usam chaves distintas (`gw1CDR`, `gw2CDR`, `gwCDRglobal`) para garantir que a CDR de um item não afete o outro erroneamente
- **Motor de estados imutável**: todo o estado do build é tratado como imutável (funções retornam novos objetos), facilitando undo/redo no futuro
- **Suporte bilíngue nativo**: todos os dados têm campos `nPT`/`nEN`/`dPT`/`dEN` — trocar idioma não requer nova busca de dados
