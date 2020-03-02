var arrayNumbers=[];

function adicionarNumero() {
    arrayNumbers.push(parseInt(document.getElementById("newNumbers").value));
    document.getElementById("numerosAdicionados").innerText = "Adicionados: " + arrayNumbers.toString();
    //console.log(arrayNumbers);
}

function calcular() {
    let max = (Math.max.apply(Math, arrayNumbers));
    if(arrayNumbers.length >= 5) {
        document.getElementById("maiorNumero").innerText = "Maior número: " + max;
    }
}