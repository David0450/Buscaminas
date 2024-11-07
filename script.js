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

    constructor(numeroFilas, numeroColumnas, numeroMinas) {
        this.tableroHTML = document.getElementById("tbody");
        this.numeroColumnas = numeroColumnas;
        this.numeroFilas = numeroFilas;
        this.numeroMinas = numeroMinas;
        this.tablero = new Array(numeroFilas).fill(0).map(() => new Array(numeroColumnas).fill(0));
    }
    
    asignarMinas() {
        let esMina;
        for (let x = 0; x < this.numeroFilas; x++) {
            for (let y = 0; y < this.numeroColumnas; y++) {
                esMina = Math.random() < 0.5 ? true : false;
                if (this.numeroMinas <= 0) return;
                if (esMina == true) {
                    this.numeroMinas--;
                    this.tablero[x][y] = '<i class="fa-solid fa-bomb"></i>';
                    this.asignarNumeros(x, y);
                }   
            }
        }
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
        el.oncontextmenu = '';  
    }

    colocarBandera(el, event) {
        event.preventDefault();
        if (el.style.backgroundColor != 'whitesmoke') {
            if (el.children.item(0).style.visibility == 'hidden') {
                el.children.item(0).style.visibility = 'visible';
            } else {
                el.children.item(0).style.visibility = 'hidden'
            }
        }
    }

}


const partida = new Buscaminas(12,12,50);

partida.asignarMinas();
partida.dibujarTablero();