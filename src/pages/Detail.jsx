import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatPokemonNumber, pokemonToSummary } from '../utils/pokemon';

function Detail({
  favorites,
  teams,
  onToggleFavorite,
  onAddPokemonToTeam,
  onRemovePokemonFromTeam,
}) {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPokemon() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Pokémon niet gevonden.');
        }

        const data = await response.json();
        setPokemon(data);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError('Pokémon kon niet worden opgehaald.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPokemon();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (teams.length === 0) {
      setSelectedTeamId('');
      return;
    }

    const selectedTeamStillExists = teams.some((team) => team.id === selectedTeamId);

    if (!selectedTeamStillExists) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  const summary = useMemo(() => (pokemon ? pokemonToSummary(pokemon) : null), [pokemon]);
  const isFavorite = summary
    ? favorites.some((favorite) => favorite.id === summary.id)
    : false;
  const selectedTeam = teams.find((team) => team.id === selectedTeamId);
  const isInSelectedTeam = Boolean(
    summary && selectedTeam?.pokemon.some((teamPokemon) => teamPokemon.id === summary.id)
  );

  function handleTeamAction() {
    if (!summary || !selectedTeamId) {
      return;
    }

    if (isInSelectedTeam) {
      onRemovePokemonFromTeam(selectedTeamId, summary.id);
      setFeedback(`${summary.name} is uit ${selectedTeam.name} verwijderd.`);
      return;
    }

    const result = onAddPokemonToTeam(selectedTeamId, summary);

    if (result === 'full') {
      setFeedback('Dit team heeft al zes Pokémon. Verwijder eerst een Pokémon.');
    } else if (result === 'exists') {
      setFeedback('Deze Pokémon zit al in het gekozen team.');
    } else if (result === 'added') {
      setFeedback(`${summary.name} is toegevoegd aan ${selectedTeam.name}.`);
    } else {
      setFeedback('Toevoegen aan het team is niet gelukt.');
    }
  }

  if (loading) {
    return <p className="text-body-secondary" role="status">Pokémon laden...</p>;
  }

  if (error || !pokemon || !summary) {
    return <p className="alert alert-danger" role="alert">{error ?? 'Pokémon niet gevonden.'}</p>;
  }

  return (
    <section>
      <Link className="d-inline-block link-danger text-decoration-none fw-bold mb-4" to="/list">
        ← Terug naar overzicht
      </Link>

      <div className="card p-3 p-md-4">
        <div className="row g-4 g-lg-5">
          <div className="col-lg-5">
            <div className="detail-image d-flex align-items-center justify-content-center bg-body-tertiary rounded h-100">
              <img className="mw-100 object-fit-contain" src={summary.image} alt={summary.name} />
            </div>
          </div>

          <div className="col-lg-7">
            <p className="eyebrow">Pokémon detail</p>
            <h1 className="display-4 fw-bold text-capitalize text-break">{summary.name}</h1>
            <p className="text-body-secondary">{formatPokemonNumber(summary.id)}</p>

            <div className="d-flex flex-wrap gap-1 mb-3">
              {summary.types.map((type) => (
                <span className="badge rounded-pill text-bg-light text-capitalize" key={type}>{type}</span>
              ))}
            </div>

            <div className="d-flex justify-content-between gap-3 border-bottom py-2">
              <strong>Hoogte</strong>
              <span>{pokemon.height / 10} m</span>
            </div>

            <div className="d-flex justify-content-between gap-3 border-bottom py-2">
              <strong>Gewicht</strong>
              <span>{pokemon.weight / 10} kg</span>
            </div>

            <div className="d-flex justify-content-between gap-3 border-bottom py-2">
              <strong>Ervaring</strong>
              <span>{pokemon.base_experience ?? 'Onbekend'}</span>
            </div>

            <div className="mt-4">
              <h2 className="h5">Basisstats</h2>
              {pokemon.stats.map((stat) => (
                <div className="d-flex justify-content-between border-bottom py-2 text-capitalize" key={stat.stat.name}>
                  <span>{stat.stat.name}</span>
                  <strong>{stat.base_stat}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 mt-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <h2 className="h5">Team beheren</h2>
            {teams.length === 0 ? (
              <p className="text-body-secondary mb-0">
                Je hebt nog geen team. <Link className="link-danger" to="/teams">Maak eerst een team aan</Link>.
              </p>
            ) : (
              <div className="d-flex flex-column flex-sm-row gap-2">
                <select
                  className="form-select"
                  value={selectedTeamId}
                  onChange={(event) => {
                    setSelectedTeamId(event.target.value);
                    setFeedback('');
                  }}
                  aria-label="Kies een team"
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.pokemon.length}/6)
                    </option>
                  ))}
                </select>

                <button
                  className={`btn flex-shrink-0 ${isInSelectedTeam ? 'btn-secondary' : 'btn-danger'}`}
                  type="button"
                  onClick={handleTeamAction}
                >
                  {isInSelectedTeam ? 'Verwijderen uit team' : 'Toevoegen aan team'}
                </button>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <h2 className="h5">Favoriet</h2>
            <button
              className={`btn ${isFavorite ? 'btn-warning' : 'btn-outline-danger'}`}
              type="button"
              aria-pressed={isFavorite}
              onClick={() => onToggleFavorite(summary)}
            >
              {isFavorite ? '★ Uit favorieten' : '☆ Favoriet maken'}
            </button>
          </div>
        </div>
      </div>

      {feedback && <p className="alert alert-info mt-3" role="status">{feedback}</p>}
    </section>
  );
}

export default Detail;
