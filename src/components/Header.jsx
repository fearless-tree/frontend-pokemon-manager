import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navigation from './Navigation';

function Header() {
  const { pathname } = useLocation();
  const [openedPath, setOpenedPath] = useState(null);
  const menuButton = useRef(null);
  const menuOpen = openedPath === pathname;

  function closeMenu() {
    setOpenedPath(null);
  }

  return (
    <header
      className="navbar navbar-expand-lg bg-danger sticky-top shadow-sm py-3"
      data-bs-theme="dark"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) {
          closeMenu();
          menuButton.current?.focus();
        }
      }}
    >
      <div className="container">
        <Link className="navbar-brand d-flex flex-column flex-lg-row gap-lg-1 fw-bold" to="/" onClick={closeMenu}>
          <span>Pokémon</span>
          <span className="brand-subtitle">Team Manager</span>
        </Link>
        <button
          ref={menuButton}
          className="navbar-toggler"
          type="button"
          aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setOpenedPath(menuOpen ? null : pathname)}
        >
          <span className="navbar-toggler-icon" aria-hidden="true" />
        </button>
        <Navigation isOpen={menuOpen} onNavigate={closeMenu} />
      </div>
    </header>
  );
}

export default Header;
