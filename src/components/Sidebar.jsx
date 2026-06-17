import './Sidebar.css';

const Sidebar = ({ favorites, watched, movies, onMovieClick, isOpen, onClose }) => {
  // Get full movie objects for favorited IDs
  const favoriteMovies = movies.filter((movie) => favorites.includes(movie.id));

  // Get full movie objects for watched IDs
  const watchedMovies = movies.filter((movie) => watched.includes(movie.id));

  return (
    <div className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__header">
        <h2 className="sidebar__title">My Lists</h2>
        <button className="sidebar__close" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="sidebar__content">
        {/* Favorites Section */}
        <div className="sidebar__section">
          <h3 className="sidebar__section-title">
            ❤️ Favorites ({favoriteMovies.length})
          </h3>
          {favoriteMovies.length === 0 ? (
            <p className="sidebar__empty">No favorites yet. Click the ❤️ on any movie card!</p>
          ) : (
            <div className="sidebar__list">
              {favoriteMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="sidebar__item"
                  onClick={() => onMovieClick(movie)}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : 'https://via.placeholder.com/92x138?text=No+Poster'
                    }
                    alt={movie.title}
                    className="sidebar__poster"
                  />
                  <div className="sidebar__info">
                    <h4 className="sidebar__movie-title">{movie.title}</h4>
                    <p className="sidebar__rating">⭐ {movie.vote_average?.toFixed(1)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Watched Section */}
        <div className="sidebar__section">
          <h3 className="sidebar__section-title">
            👁️ Watched ({watchedMovies.length})
          </h3>
          {watchedMovies.length === 0 ? (
            <p className="sidebar__empty">No watched movies yet. Click the 👁️ on any movie card!</p>
          ) : (
            <div className="sidebar__list">
              {watchedMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="sidebar__item"
                  onClick={() => onMovieClick(movie)}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : 'https://via.placeholder.com/92x138?text=No+Poster'
                    }
                    alt={movie.title}
                    className="sidebar__poster"
                  />
                  <div className="sidebar__info">
                    <h4 className="sidebar__movie-title">{movie.title}</h4>
                    <p className="sidebar__rating">⭐ {movie.vote_average?.toFixed(1)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
