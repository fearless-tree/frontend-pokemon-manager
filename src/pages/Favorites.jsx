import { Link } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import { useState } from 'react';

function Favorites({ favorites, onToggleFavorite }) {
  const [search, setSearch] = useState('');
  const normalizedSearch = search.trim().toLowerCase();

  const filteredFavorites = favorites.filter((pokemon) => {
    const matchesName = pokemon.name.toLowerCase().includes(normalizedSearch);
    const matchesType = (pokemon.types ?? []).some((type) => type.includes(normalizedSearch));
    return matchesName || matchesType;
  });

  return (
    <section>
      <div className="mb-4">
        <div>
          <p className="eyebrow">Snel terugvinden</p>
          <h1 className="display-5 fw-bold">Mijn favorieten</h1>
          <p className="text-body-secondary">Bewaar Pokémon die je vaak gebruikt, zodat je sneller teams kunt samenstellen.</p>
        </div>
      </div>

      {favorites.length > 0 && (
        <div className="mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Zoek in je favorieten..."
          />
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="card p-4 text-body-secondary align-items-start">
          <p>Je hebt nog geen favoriete Pokémon.</p>
          <Link className="btn btn-danger" to="/list">
            Pokémon bekijken
          </Link>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="card p-4 text-body-secondary">Geen favorieten gevonden met deze zoekopdracht.</div>
      ) : (
        <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3 g-lg-4">
          {filteredFavorites.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              id={pokemon.id}
              name={pokemon.name}
              image={pokemon.image}
              types={pokemon.types}
              isFavorite
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;
