/* let nMinas = 10;
let posicion = new Array(9).fill(0).map(() => new Array(9).fill(0));
const filas = 9;
const columnas = 9;

let tabla = document.getElementById("tbody");


function crearTabla(tabla, posicion) {
    for (let i = 0; i < filas; i++) {
        tabla.insertAdjacentHTML("afterbegin","<tr id='fila"+i+"'></tr>");
        for (let j = 0; j < columnas; j++) {
            let fila = document.getElementById("fila"+i+"");
            fila.insertAdjacentHTML("afterbegin","<td>"+posicion[i][j]+"</td>");
        }
    }
}

for (let x = 0; x < 9; x++) {
	for (let y = 0; y < 9; y++) {
        if (nMinas > 0) {
		    let mina = Math.random() < 0.12 ? true : false;
		    if (mina == true) {
                nMinas--;
		    	posicion[x][y] = 'M';
		    	asignarNumeros(x,y);
		    }
        }
	}
}

for (let x = 0; x < 9; x++) {
    console.log(JSON.stringify(posicion[x]))
}

// Se asignan el número de minas cercano tras saber la posición de las minas
function asignarNumeros(x,y) {
	for ( let i = x - 1; i <= x + 1; i++ ) {
        if (i != -1 && i != 9) {
		    for ( let j = y - 1; j <= y + 1; j++ ) {
			    if ( posicion[i][j] != 'M' && j != 9 && j != -1) {
				    posicion[i][j]++;
			    }
		    }
        }
	}
}
crearTabla(tabla, posicion) */

class Buscaminas {
    numeroFilas;
    numeroColumnas;
    numeroMinas;
    tableroHTML;
    tablero;

    constructor(numeroFilas, numeroColumnas, numeroMinas) {
        this.tableroHTML = document.getElementById("tbody");
        this.numeroColumnas = numeroColumnas;
        this.numeroFilas = numeroFilas;
        this.numeroMinas = numeroMinas;
        this.tablero = new Array(this.numeroFilas).fill(0).map(() => new Array(this.numeroColumnas).fill(0));
    }

    setFilas(numeroFilas) {
        return this.numeroFilas = numeroFilas;
    }

    setMinas(numeroMinas) {
        return this.numeroMinas = numeroMinas;
    }

    setColumnas(numeroColumnas) {
        return this.numeroColumnas = numeroColumnas;
    }

    setTablero(numeroFilas, numeroColumnas, numeroMinas) {
        this.setFilas(numeroFilas);
        this.setColumnas(numeroColumnas);
        this.setMinas(numeroMinas);
        return this.tablero = new Array(this.numeroFilas).fill(0).map(() => new Array(this.numeroColumnas).fill(0));
    }
    
    asignarMinas() {
        let filaMina;
        let columnaMina;
        while (this.numeroMinas > 0) {
            filaMina = Math.trunc(Math.random() * this.numeroFilas);
            columnaMina = Math.trunc(Math.random() * this.numeroColumnas);
            if (this.tablero[filaMina][columnaMina] != '<i class="fa-solid fa-bomb"></i>') {
                this.tablero[filaMina][columnaMina] = '<i class="fa-solid fa-bomb"></i>';
                this.numeroMinas--;
                this.asignarNumeros(filaMina, columnaMina);
            }
        }
        this.dibujarTablero();
    }

/*     probabilidadMina(iteracion) {
        return (this.numeroMinas + (100*iteracion) - ((this.numeroMinas + iteracion) / (this.numeroColumnas*this.numeroFilas))) / (this.numeroColumnas*this.numeroFilas);
    } */

    asignarNumeros(fila, columna) {
        for (let x = fila-1; x <= fila+1; x++) {
            if (x != -1 && x != this.numeroFilas) {
                for (let y = columna-1; y <= columna+1; y++) {
                    if (this.tablero[x][y] != '<i class="fa-solid fa-bomb"></i>' && columna != this.numeroColumnas && columna != -1) {
                        this.tablero[x][y]++;
                    }
                }
            }
        }
    }

    dibujarTablero() {
        for (let x = 0; x < this.numeroFilas; x++) {
            this.tableroHTML.insertAdjacentHTML("afterbegin", "<tr id='fila"+x+"'></tr>");
            for (let y = 0; y < this.numeroColumnas; y++) {
                document.getElementById("fila"+x+"").insertAdjacentHTML("afterbegin","<td onclick='partida.revelarCasilla(this)' oncontextmenu='partida.colocarBandera(this, event)'><i class='fa-solid fa-flag'></i>"+this.tablero[x][y]+"</td>");
            }
        }
    }

    revelarCasilla(el) {
        el.style.backgroundColor = 'whitesmoke';
        el.style.color = 'black';
        el.onclick = '';
        el.oncontextmenu = '';  
        el.children.item(0).style.visibility = 'hidden';
        el.style.cursor = 'default';
    }

    colocarBandera(el, event) {
        event.preventDefault();
        if (el.style.backgroundColor != 'whitesmoke') {
            if (el.children.item(0).style.visibility == 'hidden') {
                el.children.item(0).style.visibility = 'visible';
            } else {
                el.children.item(0).style.visibility = 'hidden';
            }
        }
    }

}




function comprobarInput() {
    let table = document.getElementById('displayTablero');
    console.log(table.children.length);
    /* for (let i = 0; i < table.children.length; i++) {
        table.removeChild(document.getElementById('displayFila'+i));
        console.log(i);
    } */
    table.innerHTML = '';

    let inputFilasValue = parseInt(document.getElementById('inputFilas').value);
    let inputColumnasValue = parseInt(document.getElementById('inputColumnas').value);
    let inputMinas = document.getElementById('inputMinas');
    let numMinas = parseInt(inputMinas.value)  < Math.trunc((inputFilasValue*inputColumnasValue)/6) ? Math.trunc((inputFilasValue*inputColumnasValue)/6) : parseInt(inputMinas.value);
    
    inputMinas.value = numMinas;
    inputMinas.min = Math.trunc((inputFilasValue*inputColumnasValue)/6);
    inputMinas.max = Math.trunc((inputFilasValue*inputColumnasValue)/2);

    let filasRojas = Math.trunc(numMinas/inputColumnasValue);
    console.log(inputMinas.value);
    let restoRojas = numMinas % inputColumnasValue;

    for (let i = 0; i < filasRojas; i++) {
        table.innerHTML += "<tr id=displayFila"+i+"></tr>";
        document.getElementById('displayFila'+i).innerHTML = "<td style='background-color:red'></td>".repeat(inputColumnasValue);
    }

    table.innerHTML += "<tr id=displayFila"+filasRojas+"></tr>";
    document.getElementById('displayFila'+filasRojas).innerHTML = "<td style='background-color: red'></td>".repeat(restoRojas);
    document.getElementById('displayFila'+filasRojas).innerHTML += "<td></td>".repeat(inputColumnasValue - restoRojas);
    
    for (let i = filasRojas+1; i < inputFilasValue; i++) {
        table.innerHTML += "<tr id=displayFila"+i+"></tr>";
        document.getElementById('displayFila'+i).innerHTML = "<td></td>".repeat(inputColumnasValue);
    }
}

function confirmarDimensiones() {
    let numeroColumnas = parseInt(document.getElementById('inputColumnas').value);
    let numeroFilas = parseInt(document.getElementById('inputFilas').value);
    let numeroMinas = parseInt(document.getElementById('inputMinas').value);
    document.getElementById('modalInicio').style.display = 'none';
    
    partida.setTablero(numeroFilas,numeroColumnas,numeroMinas);
    partida.asignarMinas();
}



const partida = new Buscaminas(0,0,0);
