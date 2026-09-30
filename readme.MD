# As Aventuras de Robojão 🤖

Jogo didático em que o Robojão executa, passo a passo, exatamente os comandos escritos no código.

Ele serve para mostrar os primeiros passos da programação: uma lista de instruções, em ordem, e um resultado visível na tela. Não há teclado nem clique no tabuleiro. O robô faz só o que está no JavaScript.

## Como jogar

O Robojão começa na casa 1 de um tabuleiro com 16 casas:

```
 1   2   3   4
 5   6   7   8
 9  10  11  12
13  14  15  16
```

O prêmio é a engrenagem dourada, na casa 16. Para vencer, ele precisa chegar andando nessa casa e o comando seguinte tem que ser `pegar prêmio`. A tela mostra **VOCÊ VENCEU!**.

O jogo termina com **FIM DO JOGO** quando:

- ele pisa numa armadilha;
- ele anda para fora do tabuleiro;
- ele tenta pegar o prêmio fora da casa 16;
- o comando escrito não é um dos que ele conhece;
- os comandos acabam e ele não venceu.

Se a lista de comandos estiver vazia, o botão **INICIAR** deixa o robô parado na casa 1, sem mensagem de fim.

As armadilhas ficam à vista:

- casa 7: poça de óleo
- casa 9: balde de água
- casa 15: ímã

Depois de **INICIAR**, o robô espera um segundo antes de cada comando, inclusive o primeiro. A lista na tela marca com uma seta o comando que está rodando.

## Comandos

O robô entende exatamente estas frases:

- `andar para baixo`
- `andar para cima`
- `andar para direita`
- `andar para esquerda`
- `pegar prêmio`

Um caminho que evita as armadilhas e pega a engrenagem:

```javascript
const COMANDOS_DO_ROBO = [
  "andar para direita",
  "andar para direita",
  "andar para direita",
  "andar para baixo",
  "andar para baixo",
  "andar para baixo",
  "pegar prêmio",
];
```



## Como executar

Abra o arquivo `index.html` no navegador. Não precisa de servidor nem de instalação.

## Como personalizar

No começo de `jogo.js`:

- `NOME_DO_ROBO` muda o nome que aparece no título **AS AVENTURAS DE ...**
- `COMANDOS_DO_ROBO` é a lista que o robô executa, de cima para baixo

Depois de salvar, atualize a página e aperte **INICIAR**. No fim da partida, **JOGAR DE NOVO** volta o robô para a casa 1. Para rodar de novo, aperte **INICIAR**.

## Arquivos

- `index.html` — estrutura da tela
- `estilo.css` — visual
- `jogo.js` — nome, comandos e regras
- `imagens/` — robô, engrenagem e armadilhas
- `readme.MD` — este texto



## Imagens

As figuras do robô, da engrenagem e do ímã estão em domínio público:

- Robô: [Cartoon Robot.svg](https://commons.wikimedia.org/wiki/File:Cartoon_Robot.svg), de Sirrob01, Open Clip Art Library, CC0
- Engrenagem: [Gear shape black 11.svg](https://commons.wikimedia.org/wiki/File:Gear_shape_black_11.svg), de Heatherawalls, CC0, com a cor trocada para dourado
- Ímã: [Horse shoe Magnet.svg](https://commons.wikimedia.org/wiki/File:Horse_shoe_Magnet.svg), de Sav vas e Francesco Rollandin, domínio público

A figura da poça de óleo no Wikimedia era uma cena detalhada de poluição e não cabia numa casa do tabuleiro. A poça usada no jogo é um desenho simples feito para este projeto, assim como o balde de água.