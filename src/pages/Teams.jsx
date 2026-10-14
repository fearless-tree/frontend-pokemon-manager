import { useState } from 'react';
import { Link } from 'react-router-dom';
import TeamCard from '../components/TeamCard';

function Teams({ teams, onCreateTeam, onDeleteTeam, onRemovePokemon }) {
  const [teamName, setTeamName] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const result = onCreateTeam(teamName);

    if (result === 'empty') {
      setMessage('Vul eerst een teamnaam in.');
      return;
    }

    if (result === 'duplicate') {
      setMessage('Er bestaat al een team met deze naam.');
      return;
    }

    setTeamName('');
    setMessage('Team aangemaakt. Voeg nu Pokémon toe via een detailpagina.');
  }

  return (
    <section>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <p className="eyebrow">Beheer</p>
          <h1 className="display-5 fw-bold">Mijn teams</h1>
          <p className="text-body-secondary mb-0">Maak teams aan, voeg Pokémon toe en verwijder ze weer wanneer je wilt.</p>
        </div>

        <Link className="btn btn-outline-danger flex-shrink-0" to="/list">
          Pokémon zoeken
        </Link>
      </div>

      <form className="card p-4 mb-4" onSubmit={handleSubmit}>
        <label className="form-label fw-bold" htmlFor="team-name">Nieuw team</label>
        <div className="d-flex flex-column flex-sm-row gap-2">
          <input
            className="form-control form-control-lg"
            id="team-name"
            type="text"
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
            placeholder="Bijvoorbeeld: Kantoorkampioenen"
            maxLength={40}
          />
          <button className="btn btn-danger flex-shrink-0" type="submit">
            Team aanmaken
          </button>
        </div>
        {message && <p className="text-body-secondary mt-2 mb-0" role="status">{message}</p>}
      </form>

      {teams.length === 0 ? (
        <div className="card p-4 text-body-secondary">
          Nog geen teams aangemaakt. Maak hierboven je eerste team aan.
        </div>
      ) : (
        <div className="vstack gap-4">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onDelete={onDeleteTeam}
              onRemovePokemon={onRemovePokemon}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Teams;
