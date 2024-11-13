class Buscaminas {
    numeroFilas; // Numero de filas del tablero
    numeroColumnas; // Numero de columnas del tablero
    numeroMinas; // Numero de minas en el tablero
    tableroHTML; // El tablero HTML (tbody con sus tr y td)
    tablero; // Un array multidimensional del tablero
    numeroCasillasReveladas;

    constructor(numeroFilas, numeroColumnas, numeroMinas) {
        this.tableroHTML = document.getElementById("tbody");
        this.numeroColumnas = numeroColumnas;
        this.numeroFilas = numeroFilas;
        this.numeroMinas = numeroMinas;
        this.numeroCasillasReveladas = 0;
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
        let numeroMinasRestantes = this.numeroMinas
        while (numeroMinasRestantes > 0) { // Mientras sigan habiendo minas que colocar...
            filaMina = Math.trunc(Math.random() * this.numeroFilas); // La fila en la que habrá una mina será un número random entre 0 y el numero de filas
            columnaMina = Math.trunc(Math.random() * this.numeroColumnas); // La columna en la que habrá una mina será un número random entre 0 y el numero de columnas
            if (this.tablero[filaMina][columnaMina] != '<i class="fa-solid fa-bomb"></i>') { // Si no hay una mina en ese vector, coloca una (icono de mina)
                this.tablero[filaMina][columnaMina] = '<i class="fa-solid fa-bomb"></i>';
                numeroMinasRestantes--; // -1 minas restantes
                this.asignarNumeros(filaMina, columnaMina); // Ejecuta la función de colocar los números alrededor de la mina
            }
        }
        this.dibujarTablero(); // Después de asignar todas las minas y sus números adyacentes, dibuja el tablero HTML en la página
    }

    asignarNumeros(fila, columna) {
        /* Desde la fila y columna anteriores hasta las posteriores,
        si no hay una mina y no se sale de las dimensiones del tablero,
        suma +1 al número en esa casilla*/
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
            // Por cada fila inserta un td con un id de su número de fila
            this.tableroHTML.innerHTML += "<tr id='fila"+x+"'></tr>";
            for (let y = 0; y < this.numeroColumnas; y++) {
                // Por cada columna crea un td con sus funciones onclick y oncontextmenu junto con el contenido del array del tablero en ese mismo vector
                document.getElementById("fila"+x+"").innerHTML += "<td onclick='partida.revelarCasilla(this)' oncontextmenu='partida.colocarBandera(this, event)'><i class='fa-solid fa-flag'></i>"+this.tablero[x][y]+"</td>";
            }
        }
    }

    revelarCasilla(el) {
        /* Al hacer click en una casilla (el), se cambian sus estilos para revelar su contenido, 
        se eliminan sus funciones onclick y oncontextmenu
        y se oculta el icono de bandera que contiene*/
        el.style.backgroundColor = 'whitesmoke';
        el.style.color = 'black';
        el.onclick = '';
        el.oncontextmenu = '';  
        el.children.item(0).style.visibility = 'hidden';
        el.style.cursor = 'default';

        // Si la casilla revelada contiene un icono de bomba se llama a la función hasPerdido()
        if (el.children.item(1)) {
            if (el.children.item(1).classList.contains('fa-bomb')) {
                this.hasPerdido(el);
            }
        }
        console.log(this.numeroCasillasReveladas);
        console.log(((this.numeroFilas*this.numeroColumnas) - this.numeroMinas));
        this.numeroCasillasReveladas++;
        if (this.numeroCasillasReveladas == ((this.numeroFilas*this.numeroColumnas) - this.numeroMinas)) {
            console.log("a");
            this.hasGanado();
        }
    }

    colocarBandera(el, event) {
        /* Al hacer click derecho, no se ejecuta el menú contextual (preventDefault()) 
        y si la bandera no esta visible la muestra en pantalla y viceversa*/
        event.preventDefault();
        if (el.children.item(0).style.visibility == 'hidden') {
            el.children.item(0).style.visibility = 'visible';
        } else {
            el.children.item(0).style.visibility = 'hidden';
        }
    }

    resolverPartida() {
        for(let x = 0; x < this.numeroFilas; x++) {
            for (let y = 0; y < this.numeroColumnas; y++) {
                document.getElementById("fila"+x).children.item(y).style.backgroundColor = 'whitesmoke';
                document.getElementById("fila"+x).children.item(y).style.color = 'black';
                document.getElementById("fila"+x).children.item(y).style.cursor = 'default';
                document.getElementById("fila"+x).children.item(y).onclick = '';
                document.getElementById("fila"+x).children.item(y).oncontextmenu = '';
                document.getElementById("fila"+x).children.item(y).children.item(0).style.visibility = 'hidden';
            }
        }
    }

    reiniciarPartida() {
        /* 
        TODO: Función que reinicie la partida
        */
    }

    comprobarFinal() {
        /*
        TODO: Cada vez que se revele una casilla llamar a esta función y comprobar si se ha ganado
        */
    }

    hasPerdido(casilla) {
        this.resolverPartida();
        casilla.style.backgroundColor = 'firebrick';
    }

    hasGanado() {
        /*
        TODO: Comprobar que se llama a la función cuando se han revelado todas las casillas menos las que contienen minas
        */
        /* Cuando se llama a la función revela todas las casillas,
        mostrando las minas con un fondo rojo
        y los números con un fondo verde*/
        for (let x = 0; x < this.numeroFilas; x++) {
            for (let y = 0; y < this.numeroColumnas; y++) {
                document.getElementById("fila"+x).children.item(y).style.backgroundColor = 'mediumseagreen'
                document.getElementById("fila"+x).children.item(y).style.color = 'black';
                document.getElementById("fila"+x).children.item(y).style.cursor = 'default';
                document.getElementById("fila"+x).children.item(y).onclick = '';
                document.getElementById("fila"+x).children.item(y).oncontextmenu = '';
                document.getElementById("fila"+x).children.item(y).children.item(0).style.visibility = 'hidden';
                if (document.getElementById("fila"+x).children.item(y).children.item(1) && document.getElementById("fila"+x).children.item(y).children.item(1).classList.contains('fa-bomb')) {
                    document.getElementById("fila"+x).children.item(y).style.backgroundColor = 'firebrick';
                }
            }
        }
    }
}




function comprobarInput() {
    /* Con esta función logro modificar un pequeño tablero (displayTablero) con cada cambio en los inputs de dimensiones 
    para que el usuario pueda visualizar como será su tablero*/
    // Hay que recalcar que esta función se ejectua únicamente cuando un input de columnas, filas o minas se haya modificado

    // Se declara el tbody de la tabla como una variable (displayTablero) y vacía todo su contenido
    let displayTablero = document.getElementById('displayTablero');
    displayTablero.innerHTML = '';

    // Se declaran los valores de los inputs de dimensiones como variables
    let inputFilasValue = parseInt(document.getElementById('inputFilas').value);
    let inputColumnasValue = parseInt(document.getElementById('inputColumnas').value);

    /* Se declara el input de minas como variable,
    si el valor del input es menor al mínimo de minas ((filas*columnas)/6) automáticamente el número de minas pasa a ser ese mínimo,
    si el valor del input es mayor al máximo de minas ((filas*columnas)/2) automáticamente el número de minas pasa a ser ese máximo,
    si no se cumple lo anterior el número de minas es el valor del input*/
    let inputMinas = document.getElementById('inputMinas');
    if (parseInt(inputMinas.value) < Math.trunc((inputFilasValue*inputColumnasValue)/6)) {
        inputMinasValue = Math.trunc((inputFilasValue*inputColumnasValue)/6);
    } else if (parseInt(inputMinas.value) > Math.trunc((inputFilasValue*inputColumnasValue)/2)) {
        inputMinasValue = Math.trunc((inputFilasValue*inputColumnasValue)/2);
    } else {
        inputMinasValue = parseInt(inputMinas.value);
    }
    inputMinas.value = inputMinasValue;
    inputMinas.min = Math.trunc((inputFilasValue*inputColumnasValue)/6);
    inputMinas.max = Math.trunc((inputFilasValue*inputColumnasValue)/2);

    // En el tablero, el número de minas se mostrará con casillas rojas, para eso hago lo siguiente
    let filasRojas = Math.trunc(inputMinasValue/inputColumnasValue);
    let restoRojas = inputMinasValue % inputColumnasValue;

    // Va insertando aquellas casillas rojas
    for (let i = 0; i < filasRojas; i++) {
        displayTablero.innerHTML += "<tr id=displayFila"+i+"></tr>";
        document.getElementById('displayFila'+i).innerHTML = "<td style='background-color:red'></td>".repeat(inputColumnasValue);
    }

    // Aquí se inserta la última fila con casillas rojas, ya que no todas las casillas de esta fila serán rojas
    displayTablero.innerHTML += "<tr id=displayFila"+filasRojas+"></tr>";
    document.getElementById('displayFila'+filasRojas).innerHTML = "<td style='background-color: red'></td>".repeat(restoRojas);
    document.getElementById('displayFila'+filasRojas).innerHTML += "<td></td>".repeat(inputColumnasValue - restoRojas);
    
    // Va insertando el resto de filas con sus casillas vacías
    for (let i = filasRojas+1; i < inputFilasValue; i++) {
        displayTablero.innerHTML += "<tr id=displayFila"+i+"></tr>";
        document.getElementById('displayFila'+i).innerHTML = "<td></td>".repeat(inputColumnasValue);
    }
}

function confirmarDimensiones() {
    /* Al pulsar el botón de confirmar dimensiones se asignan los valores de los inputs a variables,
    se oculta el modal para la configuración de la partida,
    se modifica el tablero de la partida con estas características 
    y se asignan las minas a las casillas junto con los números adyacentes*/
    let numeroColumnas = parseInt(document.getElementById('inputColumnas').value);
    let numeroFilas = parseInt(document.getElementById('inputFilas').value);
    let numeroMinas = parseInt(document.getElementById('inputMinas').value);
    document.getElementById('modalInicio').style.display = 'none';
    
    partida.setTablero(numeroFilas,numeroColumnas,numeroMinas);
    partida.asignarMinas();
}


const partida = new Buscaminas(0,0,0);