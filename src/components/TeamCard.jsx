import { Link } from 'react-router-dom';
import { formatPokemonNumber } from '../utils/pokemon';

function TeamCard({ team, onDelete, onRemovePokemon }) {
  return (
    <article className="card p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
        <div className="team-name">
          <h3 className="h4 text-break">{team.name}</h3>
          <p className="text-body-secondary mb-0">{team.pokemon.length}/6 Pokémon</p>
        </div>

        <button className="btn btn-outline-danger" type="button" onClick={() => onDelete(team.id)}>
          Team verwijderen
        </button>
      </div>

      {team.pokemon.length === 0 ? (
        <div className="bg-body-tertiary rounded p-3 text-body-secondary">
          Nog geen Pokémon in dit team. Open een Pokémon en voeg hem toe aan dit team.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
          {team.pokemon.map((pokemon) => (
            <div className="col" key={pokemon.id}>
              <div className="d-flex align-items-center gap-2 border rounded p-2 h-100 bg-body-tertiary">
                <Link to={`/detail/${pokemon.id}`} className="team-pokemon-link d-flex align-items-center gap-2 flex-grow-1 text-body text-decoration-none">
                  <img className="flex-shrink-0 object-fit-contain" width="62" height="62" src={pokemon.image} alt={pokemon.name} />
                  <div className="overflow-hidden">
                    <strong className="d-block text-truncate text-capitalize">{pokemon.name}</strong>
                    <span className="small text-body-secondary">{formatPokemonNumber(pokemon.id)}</span>
                  </div>
                </Link>

                <button
                  className="btn-close flex-shrink-0"
                  type="button"
                  onClick={() => onRemovePokemon(team.id, pokemon.id)}
                  aria-label={`${pokemon.name} uit ${team.name} verwijderen`}
                  title="Uit team verwijderen"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default TeamCard;
