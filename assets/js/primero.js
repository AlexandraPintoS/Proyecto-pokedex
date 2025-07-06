// Elementos del DOM
const barraBuscador = document.getElementById("barraBuscador");
const tarjeta = document.getElementById("tarjetas");
const modal = document.getElementById("modal");
const btnCerrar = document.getElementById("btnCerrar");

// Arreglo global
let revisados = [];

// Función asincronica que obtiene datos de una API
async function fetchDataAndDisplay() {

    try {
        const url = './assets/pokemons.json';
        const response = await fetch(url);
        console.log('Respuesta original de FETCH al leer el JSON: ', response);
        console.log('URL procesada: ', response.url);

        if (!response.ok) {
            throw new Error("Error: " + response.statusText);
        }

        const data = await response.json(); // Conversión a json
        console.log('Contenido dentro de la función asincronica:', data);

        const pokedex = new Pokedex();
        data.forEach(pokemonData => {
            const pokemon = new Pokemon(
                pokemonData.id,
                pokemonData.ThumbnailImage,
                pokemonData.name,
                pokemonData.type,
                pokemonData.weight,
                pokemonData.abilities,
                pokemonData.weakness
            );

            pokedex.agregarPokemons(pokemon);

        });

        revisados = pokedex.eliminarRepetidos(pokedex.pokemons);

        // Llamada a la función tarjetas
        tarjetas(revisados);

        return revisados;

    } catch (error) {
        console.error('Error originado: ', error.message);
    }
}

// Llamada a la función principal
async function main() {
    const datosApi = await fetchDataAndDisplay();
    console.log('Contenido fuera de la función asincronica: ', datosApi);
}

// Ejecutar función principal
main();

// Clase base para los pokemons
class Pokemon {
    constructor(id, img, nombre, tipo, peso, habilidades, debilidades) {
        this.id = id;
        this.ThumbnailImage = img;
        this.name = nombre;
        this.type = tipo;
        this.weight = peso;
        this.abilities = habilidades;
        this.weakness = debilidades;
    }
}

// clase base para la pokedex
class Pokedex {
    constructor() {
        this.pokemons = [];
    }

    // Metodos
    agregarPokemons(pokemon) {
        this.pokemons.push(pokemon);
    }

    eliminarRepetidos(pokemons) {
        // Objeto para buscar nombres vistos
        let nombresVistos = {};

        // Filtrar y eliminar duplicados
        let revisados = pokemons.filter(pokemon => {

            if (!nombresVistos[pokemon.name]) {
                nombresVistos[pokemon.name] = true;
                return true;
            }
            return false;
        });

        // Arreglo para mostrar el total de pokemones filtrados
        console.log('Total de pokemones filtrados: ', revisados.length);
        return revisados;
    }

}

// Función para mostrar las tarjetas en el HTML
function tarjetas(arreglo) {
    let imagen;
    let botonType;
    let nombre;
    let id;

    let contenidoHtml = "";

    // Recorrer el arreglo del pokemon
    for (var i = 0; i < arreglo.length; i++) {
        imagen = arreglo[i].ThumbnailImage;
        botonType = arreglo[i].type;
        nombre = arreglo[i].name;
        id = arreglo[i].id;

        // Dibujar las tarjetas en el HTML
        contenidoHtml +=
            `<div class="infoTarjetas card border border-secondary-subtle border border-3 rounded" style="width: 14rem;">
            <div>
                <img src="${imagen}" class="rounded mx-auto d-block card-img-top" alt="Error al cargar imagen">
                <div>
                    <h3 class="card-title">${nombre}</h3>
                    <h6 id="textID" class="card-text">ID: #${id}</h6>
                    <div id="infobtns">`;
        // Botones del tipo de pokemon
        botonType.forEach(boton => {
            contenidoHtml += `<button class="btn btn-outline-info btnTipoStyle"> ${boton.toUpperCase()}</button>`;
        });

        // Boton para abrir el modal
        contenidoHtml += `
                        <!-- Separador de botones --> 
                        <br>

                        <button class="btnVerMas btn btn-primary">Ver más</button>`;

        contenidoHtml += `</div>
                </div>
            </div>
        </div>`;
    };

    // Insertar tarjetas en el div "tarjetas"
    tarjeta.innerHTML = contenidoHtml;

    // Evento click en cada tarjeta
    const btnVerMas = document.querySelectorAll(".btnVerMas");

    btnVerMas.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const pokemonTarjeta = arreglo[index];

            //Pasar el pokemon al modal
            abrirModal(pokemonTarjeta);
            console.log("Modal abierto");
        });
    });
};

// Función para abrir el modal
function abrirModal(pokemon) {
    // Mostrar el modal
    modal.style.display = "flex";

    document.getElementById("modalNombre").textContent = pokemon.name;
    document.getElementById("modalPeso").textContent = "Peso: " + pokemon.weight;
    document.getElementById("modalHabilidades").textContent = "Habilidades: " + pokemon.abilities.join(", ");
    document.getElementById("modalDebilidades").textContent = "Debilidades: " + pokemon.weakness.join(", ");
}

// Cerrar el modal
btnCerrar.addEventListener("click", () => {
    modal.style.display = "none";
    console.log("Modal cerrado");
});

// Buscador de pokemones
barraBuscador.addEventListener("input", () => {
    const busqueda = barraBuscador.value.toLowerCase();
    const pokemonesRevisados = revisados.filter(pokemon => {
        return pokemon.name.toLowerCase().includes(busqueda);
    });

    tarjetas(pokemonesRevisados);

});