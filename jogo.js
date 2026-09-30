// Mude o nome do robô e a lista de comandos.
// O robô só entende estas frases, escritas exatamente assim:
// "andar para baixo"
// "andar para cima"
// "andar para direita"
// "andar para esquerda"
// "pegar prêmio"

const NOME_DO_ROBO = "ROBONILDO";

const COMANDOS_DO_ROBO = [
];

const CASA_INICIAL = 1;
const CASA_DO_PREMIO = 16;
const TOTAL_DE_CASAS = 16;
const COLUNAS_DO_TABULEIRO = 4;
const ESPERA_ENTRE_COMANDOS_MS = 1500;

const ARMADILHAS = {
  7: {
    imagem: "imagens/poca-de-oleo.svg",
    nome: "poça de óleo",
    motivo: "O robô escorregou na poça de óleo e perdeu um parafuso.",
  },
  9: {
    imagem: "imagens/balde-de-agua.svg",
    nome: "balde de água",
    motivo: "O robô tropeçou no balde de água e entrou em curto-circuito.",
  },
  15: {
    imagem: "imagens/ima.svg",
    nome: "ímã",
    motivo: "O ímã grudou o robô no chão.",
  },
};

let casaDoRobo = CASA_INICIAL;
let jogoEmAndamento = false;

function esperar(milissegundos) {
  return new Promise((resolver) => {
    setTimeout(resolver, milissegundos);
  });
}

function ajustarTamanhoDoTabuleiro() {
  const tabuleiro = document.getElementById("tabuleiro");
  const titulo = document.querySelector(".cabecalho").getBoundingClientRect().height;
  const folga = 20;
  const reservaDoPainel = Math.min(22 * 16, window.innerWidth * 0.32);
  const lado = Math.floor(Math.min(
    window.innerHeight - titulo - folga,
    window.innerWidth - reservaDoPainel - folga
  ));
  tabuleiro.style.width = `${lado}px`;
  tabuleiro.style.height = `${lado}px`;
}

function desenharTitulo() {
  document.getElementById("titulo").textContent = `AS AVENTURAS DE ${NOME_DO_ROBO.toLocaleUpperCase("pt-BR")}`;
  document.title = `As Aventuras de ${NOME_DO_ROBO}`;
}

function montarTabuleiro() {
  const tabuleiro = document.getElementById("tabuleiro");
  tabuleiro.replaceChildren();

  for (let numero = 1; numero <= TOTAL_DE_CASAS; numero += 1) {
    const casa = document.createElement("div");
    casa.className = "casa";
    casa.dataset.casa = String(numero);

    if (numero === CASA_DO_PREMIO) {
      casa.classList.add("casa-premio");
    }

    if (ARMADILHAS[numero]) {
      casa.classList.add("casa-armadilha");
    }

    const numeroDaCasa = document.createElement("span");
    numeroDaCasa.className = "numero";
    numeroDaCasa.textContent = String(numero);
    casa.appendChild(numeroDaCasa);

    if (ARMADILHAS[numero]) {
      const armadilha = document.createElement("img");
      armadilha.className = "imagem-armadilha";
      armadilha.src = ARMADILHAS[numero].imagem;
      armadilha.alt = ARMADILHAS[numero].nome;
      casa.appendChild(armadilha);
    }

    if (numero === CASA_DO_PREMIO) {
      const premio = document.createElement("img");
      premio.className = "imagem-premio";
      premio.src = "imagens/engrenagem.svg";
      premio.alt = "Engrenagem dourada";
      casa.appendChild(premio);
    }

    tabuleiro.appendChild(casa);
  }

  const robo = document.createElement("img");
  robo.id = "robo";
  robo.src = "imagens/robo.svg";
  robo.alt = NOME_DO_ROBO;
  document.querySelector(`[data-casa="${CASA_INICIAL}"]`).appendChild(robo);
  marcarCasaDoRobo();
}

function marcarCasaDoRobo() {
  document.querySelectorAll(".casa-do-robo").forEach((casa) => {
    casa.classList.remove("casa-do-robo");
  });

  const casaBranca = !ARMADILHAS[casaDoRobo] && casaDoRobo !== CASA_DO_PREMIO;
  if (casaBranca) {
    casaDoNumero(casaDoRobo).classList.add("casa-do-robo");
  }
}

function mostrarComandos() {
  const lista = document.getElementById("lista-de-comandos");
  const aviso = document.getElementById("aviso-lista-vazia");
  lista.replaceChildren();

  const listaVazia = COMANDOS_DO_ROBO.length === 0;
  aviso.hidden = !listaVazia;
  lista.hidden = listaVazia;

  COMANDOS_DO_ROBO.forEach((comando) => {
    const item = document.createElement("li");
    item.textContent = comando;
    lista.appendChild(item);
  });
}

function casaDoNumero(numero) {
  return document.querySelector(`[data-casa="${numero}"]`);
}

function destacarComando(indice) {
  const item = document.querySelectorAll("#lista-de-comandos li")[indice];
  item.classList.add("comando-atual");
}

function marcarComando(indice, classe) {
  const item = document.querySelectorAll("#lista-de-comandos li")[indice];
  item.classList.remove("comando-atual");
  item.classList.add(classe);
}

function calcularDestino(casa, comando) {
  const linha = Math.floor((casa - 1) / COLUNAS_DO_TABULEIRO);
  const coluna = (casa - 1) % COLUNAS_DO_TABULEIRO;
  let novaLinha = linha;
  let novaColuna = coluna;

  if (comando === "andar para baixo") {
    novaLinha += 1;
  } else if (comando === "andar para cima") {
    novaLinha -= 1;
  } else if (comando === "andar para direita") {
    novaColuna += 1;
  } else if (comando === "andar para esquerda") {
    novaColuna -= 1;
  }

  const saiuDaLinha = novaLinha < 0 || novaLinha >= TOTAL_DE_CASAS / COLUNAS_DO_TABULEIRO;
  const saiuDaColuna = novaColuna < 0 || novaColuna >= COLUNAS_DO_TABULEIRO;

  if (saiuDaLinha || saiuDaColuna) {
    return null;
  }

  return novaLinha * COLUNAS_DO_TABULEIRO + novaColuna + 1;
}

function andar(comando) {
  const destino = calcularDestino(casaDoRobo, comando);

  if (destino === null) {
    casaDoNumero(casaDoRobo).classList.add("casa-tremeu");
    return {
      encerrou: true,
      vitoria: false,
      frase: "FIM DO JOGO",
      motivo: "O robô saiu do tabuleiro.",
    };
  }

  casaDoRobo = destino;
  casaDoNumero(destino).appendChild(document.getElementById("robo"));
  marcarCasaDoRobo();

  if (ARMADILHAS[destino]) {
    casaDoNumero(destino).classList.add("armadilha-ativada");
    return {
      encerrou: true,
      vitoria: false,
      frase: "FIM DO JOGO",
      motivo: ARMADILHAS[destino].motivo,
    };
  }

  return { encerrou: false };
}

function pegarPremio() {
  if (casaDoRobo !== CASA_DO_PREMIO) {
    return {
      encerrou: true,
      vitoria: false,
      frase: "FIM DO JOGO",
      motivo: "Não dá para pegar o prêmio fora da casa 16.",
    };
  }

  document.querySelector(".imagem-premio").classList.add("premio-pegado");
  return {
    encerrou: true,
    vitoria: true,
    frase: "VOCÊ VENCEU!",
    motivo: "O robô pegou a engrenagem dourada.",
  };
}

function executarUmComando(comando) {
  if (comando === "pegar prêmio") {
    return pegarPremio();
  }

  if (
    comando === "andar para baixo" ||
    comando === "andar para cima" ||
    comando === "andar para direita" ||
    comando === "andar para esquerda"
  ) {
    return andar(comando);
  }

  return {
    encerrou: true,
    vitoria: false,
    frase: "FIM DO JOGO",
    motivo: "O robô não conhece esse comando.",
  };
}

function terminarJogo(frase, motivo) {
  jogoEmAndamento = false;
  document.getElementById("botao-iniciar").disabled = true;
  document.getElementById("frase-final").textContent = frase;
  document.getElementById("motivo-final").textContent = motivo;
  document.getElementById("mensagem-final").hidden = false;
}

async function executarComandos() {
  if (jogoEmAndamento || COMANDOS_DO_ROBO.length === 0) {
    return;
  }

  jogoEmAndamento = true;
  document.getElementById("botao-iniciar").disabled = true;

  for (let indice = 0; indice < COMANDOS_DO_ROBO.length; indice += 1) {
    await esperar(ESPERA_ENTRE_COMANDOS_MS);

    destacarComando(indice);
    const resultado = executarUmComando(COMANDOS_DO_ROBO[indice]);

    if (resultado.encerrou) {
      const classe = resultado.vitoria ? "comando-vitoria" : "comando-derrota";
      marcarComando(indice, classe);
      terminarJogo(resultado.frase, resultado.motivo);
      return;
    }

    marcarComando(indice, "comando-feito");
  }

  terminarJogo("FIM DO JOGO", "Os comandos acabaram e o prêmio ficou para trás.");
}

function reiniciarTela() {
  casaDoRobo = CASA_INICIAL;
  jogoEmAndamento = false;
  document.getElementById("botao-iniciar").disabled = false;
  document.getElementById("mensagem-final").hidden = true;
  montarTabuleiro();
  mostrarComandos();
  ajustarTamanhoDoTabuleiro();
}

function jogarDeNovo() {
  if (jogoEmAndamento) {
    return;
  }

  reiniciarTela();
}

desenharTitulo();
reiniciarTela();
document.getElementById("botao-iniciar").addEventListener("click", executarComandos);
document.getElementById("botao-jogar-de-novo").addEventListener("click", jogarDeNovo);
window.addEventListener("resize", ajustarTamanhoDoTabuleiro);
