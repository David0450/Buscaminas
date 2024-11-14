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
        this.tablero = new Array(this.numeroFilas).map(() => new Array(this.numeroColumnas).fill(0));
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
        this.tableroHTML.innerHTML = '';
        for (let x = 0; x < this.numeroFilas; x++) { 
            // Por cada fila inserta un td con un id de su número de fila
            this.tableroHTML.innerHTML += "<tr id='fila"+x+"'></tr>";
            for (let y = 0; y < this.numeroColumnas; y++) {
                // Por cada columna crea un td con sus funciones onclick y oncontextmenu junto con el contenido del array del tablero en ese mismo vector
                document.getElementById("fila"+x+"").innerHTML += "<td id='f"+x+"c"+y+"' onclick='partida.revelarCasilla(this)' oncontextmenu='partida.colocarBandera(this, event)'><i class='fa-solid fa-flag'></i>"+this.tablero[x][y]+"</td>";
            }
        }
    }

    revelarCasilla(casilla) {
        /* Al hacer click en una casilla (el), se cambian sus estilos para revelar su contenido, 
        se eliminan sus funciones onclick y oncontextmenu
        y se oculta el icono de bandera que contiene*/
        casilla.style.backgroundColor = 'whitesmoke';
        casilla.style.color = 'black';
        casilla.onclick = '';
        casilla.oncontextmenu = '';  
        casilla.children.item(0).style.visibility = 'hidden';
        casilla.style.cursor = 'default';

        // Si la casilla (elemento <td>) tiene un segundo elemento hijo (<i>) se llama a la función hasPerdido()
        if (casilla.children.item(1)) {
            this.hasPerdido(casilla);
        } else if(casilla.innerHTML.includes('0')) { // Si la casilla es un 0 se llama a la función revelarCasillasVacias
            this.revelarCasillasVacias(casilla);
        }

        /* Cada vez que se revela una casilla aumenta el contador,
        de esta forma se comprueba si: casillasReveladas = casillasTotales - totalMinas
        si esto es verdadero, solo quedan sin revelar las minas y has ganado*/
        this.numeroCasillasReveladas++; 
        if (this.numeroCasillasReveladas == ((this.numeroFilas*this.numeroColumnas) - this.numeroMinas)) {
            this.hasGanado();
        }
    }

    revelarCasillasVacias(casilla) {
        // Cuando se llama a esta función va a revelar todas las casillas adyacentes que no sean bombas
        /* Las casillas tienen un id='f0c0' donde 'f0' es el número de fila y 'c0' es el número de columna
        de esta forma saco las coordenadas de la siguiente forma...*/
        let coordenadas = casilla.id.split('f').join('').split('c');
        let fila = parseInt(coordenadas[0]);
        let columna = parseInt(coordenadas[1]);
        if (columna-1 >= 0) { // Si la columna no se sale del tablero...
            let casillaIzquierda = document.getElementById("fila"+(fila)).children.item(columna-1);
            // Si la casilla no tiene bomba y no se ha revelado...
            if (!casillaIzquierda.children.item(1) && casillaIzquierda.style.backgroundColor != 'whitesmoke') {
                this.revelarCasilla(casillaIzquierda);
            }
        }
        if (columna+1 != this.numeroColumnas) { // Si la columna no se sale del tablero...
            let casillaDerecha = document.getElementById("fila"+(fila)).children.item(columna+1);
            // Si la casilla no tiene bomba y no se ha revelado...
            if (!casillaDerecha.children.item(1) && casillaDerecha.style.backgroundColor != 'whitesmoke') {
                this.revelarCasilla(casillaDerecha);
            }
        }
        if (fila-1 >= 0) { // Si la fila no se sale del tablero...
            let casillaSuperior = document.getElementById("fila"+(fila-1)).children.item(columna);
             // Si la casilla no tiene bomba y no se ha revelado...
            if (!casillaSuperior.children.item(1) && casillaSuperior.style.backgroundColor != 'whitesmoke') {
                this.revelarCasilla(casillaSuperior);
            }
            if (columna-1 >= 0) { // A su vez va a intentar revelar la casilla situada arriba a la izquierda
                let casillaIzquierda = document.getElementById("fila"+(fila-1)).children.item(columna-1);
                // Si la casilla no tiene bomba y no se ha revelado...
                if (!casillaIzquierda.children.item(1) && casillaIzquierda.style.backgroundColor != 'whitesmoke') {
                    this.revelarCasilla(casillaIzquierda);
                }
            }
            if (columna+1 != this.numeroColumnas) {// A su vez va a intentar revelar la casilla situada arriba a la derecha
                let casillaDerecha = document.getElementById("fila"+(fila-1)).children.item(columna+1);
                // Si la casilla no tiene bomba y no se ha revelado...
                if (!casillaDerecha.children.item(1) && casillaDerecha.style.backgroundColor != 'whitesmoke') {
                    this.revelarCasilla(casillaDerecha);
                }
            }
        }
        if (fila+1 != this.numeroFilas) {
            let casillaInferior = document.getElementById("fila"+(fila+1)).children.item(columna);
            // Si la casilla no tiene bomba y no se ha revelado...
            if (!casillaInferior.children.item(1) && casillaInferior.style.backgroundColor != 'whitesmoke') {
                this.revelarCasilla(casillaInferior);
            }
            if (columna-1 >= 0) { // A su vez va a intentar revelar la casilla situada abajo a la izquierda
                let casillaIzquierda = document.getElementById("fila"+(fila+1)).children.item(columna-1);
                // Si la casilla no tiene bomba y no se ha revelado...
                if (!casillaIzquierda.children.item(1) && casillaIzquierda.style.backgroundColor != 'whitesmoke') {
                    this.revelarCasilla(casillaIzquierda);
                }
            }
            if (columna+1 != this.numeroColumnas) { // A su vez va a intentar revelar la casilla situada abajo a la derecha
                let casillaDerecha = document.getElementById("fila"+(fila+1)).children.item(columna+1);
                // Si la casilla no tiene bomba y no se ha revelado...
                if (!casillaDerecha.children.item(1) && casillaDerecha.style.backgroundColor != 'whitesmoke') {
                    this.revelarCasilla(casillaDerecha);
                }
            }
        }
    }

    colocarBandera(casilla, event) {
        /* Al hacer click derecho, no se ejecuta el menú contextual (preventDefault()) 
        y si la bandera no esta visible la muestra en pantalla y viceversa*/
        event.preventDefault();
        if (casilla.children.item(0).style.visibility == 'hidden') {
            casilla.children.item(0).style.visibility = 'visible';
        } else {
            casilla.children.item(0).style.visibility = 'hidden';
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
        partida.setTablero(this.numeroFilas,this.numeroColumnas,this.numeroMinas);
        partida.asignarMinas();
    }

    hasPerdido(casilla) {
        this.resolverPartida();
        casilla.style.backgroundColor = 'firebrick';
    }

    hasGanado() {
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