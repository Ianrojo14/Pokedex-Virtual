const axios = require('axios');

// Función para obtener información de un Pokémon por su nombre
async function getPokemonInfo(pokemonName) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener información del Pokémon:', error.message);
        return null;
    }
}

// Ejemplo de uso
const pokemonName = 'pikachu';
getPokemonInfo(pokemonName)
    .then(pokemonData => {
        if (pokemonData) {
            console.log('Información de', pokemonName, ':', pokemonData);
        } else {
            console.log('No se pudo obtener información del Pokémon', pokemonName);
        }
    });
// Fetch("https://pokeapi.co/api/v2/pokemon/pikachu").then((res) => { mivar = res}) 
// No recibo resultados del request, se logea un código 403
