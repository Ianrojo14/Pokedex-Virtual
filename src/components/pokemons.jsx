import React, { useState, useEffect } from 'react';
import { Pagination, Input, Divider, Card, CardHeader, CardBody } from '@nextui-org/react';
import { IoSearch } from 'react-icons/io5';

const Pokemons = () => {
  const [pokemons, setPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const limit = 25;
  const maxPages = 5;

  const fetchPokemonDetails = async (pokemon) => {
    const response = await fetch(pokemon.url);
    const data = await response.json();
    return { ...pokemon, details: data };
  };

  useEffect(() => {
    if (searchTerm) {
      // Fetch individual pokemon when a search term is entered
      fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`No se encontró un pokémon con el nombre "${searchTerm}"`);
          }
          return response.json();
        })
        .then(data => {
          setPokemons([{ name: searchTerm, url: '', details: data }]);
          setError(null); // Clear error
        })
        .catch(error => setError(error.message));
    } else {
      // Fetch list of pokemons when search term is empty
      fetch(`https://pokeapi.co/api/v2/pokemon?offset=${(page - 1) * limit}&limit=${limit}`)
        .then(response => response.json())
        .then(async data => {
          const detailedPokemons = await Promise.all(data.results.map(fetchPokemonDetails));
          setPokemons(detailedPokemons);
          setError(null); // Clear error
        });
    }
  }, [page, searchTerm]);

  return (
    <div className="bg-black p-5">
      <div className="flex justify-center items-center">
        <Input
          className="w-full md:w-2/5"
          type="text"
          variant="underlined"
          label={<span className="text-white">Buscar Pokemon</span>} // Cambiar el color del texto "Pokemon"
            placeholder="Pokemon"
            style={{ color: 'white' }}
          color="danger"
          size="lg"
          endContent={<IoSearch/>}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Divider />

      <div className="flex flex-col justify-center items-center gap-10">
        <h2 className="text-3xl font-bold text-white">Lista de Pokemons</h2> {/* Cambiar el color del texto "Lista de Pokemons" */}
        {/* Render condicional para mostrar error o lista de pokemons */}
        {error ? (
          <div>{error}</div>
        ) : (
          <div className="flex flex-row flex-wrap gap-5 justify-center items-center">
            {pokemons.map((pokemon, index) => (
                <Card key={index} className='w-full md:w-60 p-2 md:py-4 bg-gray-100'> {/* Cambiar el color de fondo */}
                    <CardHeader className='flex flex-col border-b-3 border-black/50'>
                        <h3 className='text-3xl font-semibold'>{pokemon.name}</h3>
                        <img className='h-52 md:h-32' src={pokemon.details.sprites.front_default} alt={pokemon.name} />
                    </CardHeader>
                    <CardBody>
                        <h5 className='text-xl font-medium'>Estadisticas:</h5>
                        <ul className='ps-2 text-lg'>
                        {pokemon.details.stats.map((stat, i) => (
                      <li key={i}>
                        <span className='font-normal text-black'>{stat.stat.name}:</span>
                        <span className='text-md font-thin text-blue-500'>{stat.base_stat}</span>
                      </li>
                    ))}
                        </ul>
                    </CardBody>
                </Card>
            ))}
          </div>
        )}
          
        {/* Render condicional para mostrar la paginación solo cuando no haya término de búsqueda */}
        {!searchTerm && (
            <Pagination
              total={5} // Limit to 5 pages
              pageSize={limit}
              current={page}
              onChange={(newPage) => setPage(newPage)}
            />
          )}
      </div>
    </div>
  );
};

export default Pokemons;
