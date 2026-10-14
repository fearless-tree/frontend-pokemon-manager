import { useEffect, useMemo, useState } from 'react';
import Pagination from '../components/Pagination';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import { pokemonToSummary } from '../utils/pokemon';

const POKEMON_PER_PAGE = 8;
const TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

function List({ favorites, onToggleFavorite }) {
  const [allPokemon, setAllPokemon] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [typePokemonNames, setTypePokemonNames] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingType, setLoadingType] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPokemonList() {
      try {
        setLoadingList(true);
        setError(null);

        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Pokémon konden niet worden opgehaald.');
        }

        const data = await response.json();
        setAllPokemon(data.results);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError('Pokémon konden niet worden opgehaald. Probeer het later opnieuw.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingList(false);
        }
      }
    }

    fetchPokemonList();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedType) {
      setTypePokemonNames(null);
      return undefined;
    }

    const controller = new AbortController();

    async function fetchTypePokemon() {
      try {
        setLoadingType(true);
        setTypePokemonNames(null);
        setError(null);
        const response = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Type kon niet worden opgehaald.');
        }

        const data = await response.json();
        setTypePokemonNames(new Set(data.pokemon.map((item) => item.pokemon.name)));
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError('Het typefilter kon niet worden geladen.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingType(false);
        }
      }
    }

    fetchTypePokemon();
    return () => controller.abort();
  }, [selectedType]);

  const filteredPokemon = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return allPokemon.filter((pokemon) => {
      const matchesSearch = pokemon.name.toLowerCase().includes(normalizedSearch);
      const matchesType = !selectedType || typePokemonNames?.has(pokemon.name);
      return matchesSearch && matchesType;
    });
  }, [allPokemon, search, selectedType, typePokemonNames]);

  const totalPages = Math.max(1, Math.ceil(filteredPokemon.length / POKEMON_PER_PAGE));

  useEffect(() => {
    setPage(1);
  }, [search, selectedType]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const currentPokemon = useMemo(() => {
    const start = (page - 1) * POKEMON_PER_PAGE;
    return filteredPokemon.slice(start, start + POKEMON_PER_PAGE);
  }, [filteredPokemon, page]);

  useEffect(() => {
    if (currentPokemon.length === 0) {
      setPokemonDetails([]);
      setLoadingDetails(false);
      return undefined;
    }

    const controller = new AbortController();

    async function fetchPokemonDetails() {
      try {
        setLoadingDetails(true);
        setError(null);

        const details = await Promise.all(
          currentPokemon.map(async (pokemon) => {
            const response = await fetch(pokemon.url, { signal: controller.signal });

            if (!response.ok) {
              throw new Error('Pokémon details konden niet worden opgehaald.');
            }

            return response.json();
          })
        );

        setPokemonDetails(details);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError('Pokémon details konden niet worden opgehaald. Probeer het later opnieuw.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingDetails(false);
        }
      }
    }

    fetchPokemonDetails();
    return () => controller.abort();
  }, [currentPokemon]);

  return (
    <section>
      <div className="mb-4">
        <div>
          <p className="eyebrow">PokéAPI</p>
          <h1 className="display-5 fw-bold">Alle Pokémon</h1>
          <p className="text-body-secondary">Zoek op naam of filter op type. Klik op een kaart voor meer informatie.</p>
        </div>
      </div>

      <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Zoek een Pokémon..." />

        <select
          className="type-filter form-select form-select-lg text-capitalize"
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value)}
          aria-label="Filter op Pokémon-type"
        >
          <option value="">Alle types</option>
          {TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {(loadingList || loadingType || loadingDetails) && <p className="text-body-secondary" role="status">Pokémon laden...</p>}
      {error && <p className="alert alert-danger" role="alert">{error}</p>}

      {!loadingList && !loadingType && !error && filteredPokemon.length === 0 && (
        <div className="card p-4 text-body-secondary">Geen Pokémon gevonden met deze zoekopdracht.</div>
      )}

      {!loadingList && !loadingType && !loadingDetails && !error && pokemonDetails.length > 0 && (
        <>
          <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3 g-lg-4">
            {pokemonDetails.map((pokemon) => {
              const summary = pokemonToSummary(pokemon);
              const isFavorite = favorites.some((favorite) => favorite.id === summary.id);

              return (
                <PokemonCard
                  key={summary.id}
                  id={summary.id}
                  name={summary.name}
                  image={summary.image}
                  types={summary.types}
                  isFavorite={isFavorite}
                  onToggleFavorite={onToggleFavorite}
                />
              );
            })}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </section>
  );
}

export default List;
