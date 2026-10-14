import { NavLink } from 'react-router-dom';

function Navigation({ isOpen, onNavigate }) {
  const linkClass = ({ isActive }) => `nav-link px-3 rounded${isActive ? ' active bg-dark bg-opacity-25' : ''}`;

  return (
    <nav id="main-navigation" className={`collapse navbar-collapse justify-content-end${isOpen ? ' show' : ''}`} aria-label="Hoofdnavigatie">
      <div className="navbar-nav gap-1 pt-3 pt-lg-0">
        <NavLink to="/" end className={linkClass} onClick={onNavigate}>
          Home
        </NavLink>
        <NavLink to="/list" className={linkClass} onClick={onNavigate}>
          Pokémon
        </NavLink>
        <NavLink to="/teams" className={linkClass} onClick={onNavigate}>
          Teams
        </NavLink>
        <NavLink to="/favorieten" className={linkClass} onClick={onNavigate}>
          Favorieten
        </NavLink>
        </div>
    </nav>
  );
}

export default Navigation;
