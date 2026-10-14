import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import './App.css';

import Footer from './components/Footer';
import Header from './components/Header';
import Detail from './pages/Detail';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import List from './pages/List';
import Teams from './pages/Teams';

const FAVORITES_KEY = 'pokemon-team-manager-favorites';
const TEAMS_KEY = 'pokemon-team-manager-teams';

function readStoredArray(key) {
  try {
    const storedValue = localStorage.getItem(key);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function App() {
  const [favorites, setFavorites] = useState(() => readStoredArray(FAVORITES_KEY));
  const [teams, setTeams] = useState(() => readStoredArray(TEAMS_KEY));

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
  }, [teams]);

  function toggleFavorite(pokemon) {
    setFavorites((currentFavorites) => {
      const alreadyFavorite = currentFavorites.some((item) => item.id === pokemon.id);

      if (alreadyFavorite) {
        return currentFavorites.filter((item) => item.id !== pokemon.id);
      }

      return [...currentFavorites, pokemon];
    });
  }

  function createTeam(name) {
    const cleanName = name.trim();

    if (!cleanName) {
      return 'empty';
    }

    const alreadyExists = teams.some(
      (team) => team.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (alreadyExists) {
      return 'duplicate';
    }

    setTeams((currentTeams) => [
      ...currentTeams,
      {
        id: String(Date.now()),
        name: cleanName,
        pokemon: [],
      },
    ]);

    return 'created';
  }

  function deleteTeam(teamId) {
    setTeams((currentTeams) => currentTeams.filter((team) => team.id !== teamId));
  }

  function addPokemonToTeam(teamId, pokemon) {
    const targetTeam = teams.find((team) => team.id === teamId);

    if (!targetTeam) {
      return 'not-found';
    }

    if (targetTeam.pokemon.some((item) => item.id === pokemon.id)) {
      return 'exists';
    }

    if (targetTeam.pokemon.length >= 6) {
      return 'full';
    }

    setTeams((currentTeams) =>
      currentTeams.map((team) =>
        team.id === teamId ? { ...team, pokemon: [...team.pokemon, pokemon] } : team
      )
    );

    return 'added';
  }

  function removePokemonFromTeam(teamId, pokemonId) {
    setTeams((currentTeams) =>
      currentTeams.map((team) =>
        team.id === teamId
          ? { ...team, pokemon: team.pokemon.filter((pokemon) => pokemon.id !== pokemonId) }
          : team
      )
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="container flex-grow-1 py-4 py-md-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/list"
            element={<List favorites={favorites} onToggleFavorite={toggleFavorite} />}
          />
          <Route
            path="/detail/:id"
            element={
              <Detail
                favorites={favorites}
                teams={teams}
                onToggleFavorite={toggleFavorite}
                onAddPokemonToTeam={addPokemonToTeam}
                onRemovePokemonFromTeam={removePokemonFromTeam}
              />
            }
          />
          <Route
            path="/teams"
            element={
              <Teams
                teams={teams}
                onCreateTeam={createTeam}
                onDeleteTeam={deleteTeam}
                onRemovePokemon={removePokemonFromTeam}
              />
            }
          />
          <Route
            path="/favorieten"
            element={<Favorites favorites={favorites} onToggleFavorite={toggleFavorite} />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
