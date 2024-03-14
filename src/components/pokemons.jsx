import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pokemons = () => {
  const [pokemonData, setPokemonData] = useState(null);
  const token = 'qwer1234'; // Token de autenticación

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/pikachu', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPokemonData(response.data);
      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
      }
    };

    fetchData();
  }, [page, searchTerm]); // Asegúrate de que las dependencias estén correctas aquí

 

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
