"use strict";

const key = "91fd374470118ffd6fce69fa801af5ce";

//pesquisa o cep digitado na tela html
function PesquisaCep() {
    let dados = document.getElementById("cep").value.replace("-","");
    if (dados.length === 8) {
        ColetarCep(dados);
    } else {
        alert("Digite um CEP válido com 8 dígitos.");
    }
}

async function ColetarCep(dados) {
    try{
        const cep = await fetch(`https://viacep.com.br/ws/${dados}/json/`).then(
        (Response) => Response.json()
        );
        if (cep.erro) {
            alert("CEP não encontrado.");
            return;
        }
        DadosEndereco(cep);

        ColetarCidade(cep.localidade);
    } catch (error) {
        alert("Erro ao buscar o CEP.");
        console.error(error);
    }
}

//Envia os dados retornado para a tela html.
function DadosEndereco(cep) {
    console.log("Endereço: ", cep);
    document.getElementById("bairro").value = cep.bairro;
    document.getElementById("localidade").value = cep.localidade;
    document.getElementById("uf").value = cep.uf;
}


async function ColetarCidade(cidade) {
    try {
        const dado = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&units=metric&lang=pt_br`).then(
            (response) => response.json()
        );

        if (dado.cod !== 200) {
            alert("Cidade não encontrada na previsão do tempo.");
            return;
        }

        DadosClima(dado);
    } catch (error) {
        alert("Erro ao buscar o clima.");
        console.error(error);
    }
}

function DadosClima(dado) {
    console.log("Clima:", dado);
    document.querySelector(".tempCidade").innerHTML = "Tempo em " + dado.name;
    document.querySelector(".temperatura").innerHTML = dado.main.temp + " °C";
    document.querySelector(".icons").src = `https://openweathermap.org/img/wn/${dado.weather[0].icon}.png`;
    document.querySelector(".tempo").innerHTML = dado.weather[0].description;
    document.querySelector(".umidade").innerHTML = "Umidade: " + dado.main.humidity + "%";
}