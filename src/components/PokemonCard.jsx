import { Link } from 'react-router-dom';
import { formatPokemonNumber } from '../utils/pokemon';

function PokemonCard({ id, name, image, types = [], isFavorite = false, onToggleFavorite }) {
  return (
    <div className="col">
      <article className="pokemon-card card h-100 align-items-center text-center p-3 p-md-4 shadow-sm">
        {onToggleFavorite && (
          <button
            className={`favorite-icon btn btn-light rounded-circle position-absolute top-0 end-0 m-2 ${isFavorite ? 'text-warning' : 'text-secondary'}`}
            type="button"
            onClick={() => onToggleFavorite({ id, name, image, types })}
            aria-label={isFavorite ? `${name} uit favorieten verwijderen` : `${name} favoriet maken`}
            title={isFavorite ? 'Uit favorieten verwijderen' : 'Favoriet maken'}
            aria-pressed={isFavorite}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9Z" />
            </svg>
          </button>
        )}

        <img className="object-fit-contain mw-100" src={image} alt={name} />
        <h3 className="h5 text-capitalize text-break mt-2 mb-1">{name}</h3>
        <p className="text-body-secondary mb-2">{formatPokemonNumber(id)}</p>

        <div className="d-flex justify-content-center flex-wrap gap-1 mb-3">
          {types.map((type) => (
            <span className="badge rounded-pill text-bg-light text-capitalize" key={type}>{type}</span>
          ))}
        </div>

        <Link className="btn btn-danger w-100 mt-auto" to={`/detail/${id}`}>
          Bekijk
        </Link>
      </article>
    </div>
  );
}

export default PokemonCard;
