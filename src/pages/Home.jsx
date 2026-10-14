import { Link } from 'react-router-dom';

function Home() {
  return (
    <section className="row align-items-center g-4 g-lg-5 py-lg-5">
      <div className="col-lg-6">
        <p className="eyebrow">Pokémon Team Manager</p>
        <h1 className="display-1 fw-bold">Welkom!</h1>
        <p className="lead text-body-secondary my-4">
          Zoek Pokémon, bewaar je favorieten en stel teams van maximaal zes Pokémon samen.
        </p>

        <div className="d-flex flex-wrap gap-2">
          <Link className="btn btn-danger btn-lg" to="/list">
            Bekijk Pokémon
          </Link>
          <Link className="btn btn-outline-danger btn-lg" to="/teams">
            Mijn teams
          </Link>
        </div>
      </div>

      <div className="col-lg-6 order-first order-lg-last">
        <div className="home-image-circle rounded-circle d-flex align-items-center justify-content-center mx-auto">
          <img
            className="w-75"
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
            alt="Charmander"
          />
        </div>
      </div>
    </section>
  );
}

export default Home;
