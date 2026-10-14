export function pokemonToSummary(pokemon) {
  return {
    id: pokemon.id,
    name: pokemon.name,
    image:
      pokemon.sprites?.other?.['official-artwork']?.front_default ||
      pokemon.sprites?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
    types: pokemon.types?.map((item) => item.type.name) ?? [],
  };
}

export function formatPokemonNumber(id) {
  return `#${String(id).padStart(3, '0')}`;
}
