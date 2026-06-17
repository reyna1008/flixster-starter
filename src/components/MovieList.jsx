import MovieCard from './MovieCard';
import LoadMoreButton from './LoadMoreButton';
import './MovieList.css';

const MovieList = ({
  movies,
  isLoading,
  error,
  onMovieClick,
  onLoadMore,
  hasMorePages,
  favorites = [],
  watched = [],
  onToggleFavorite,
  onToggleWatched
}) => {
  // Show the spinner only on initial load, not when appending via Load More.
  if (isLoading && movies.length === 0) {
    return (
      <div className="movie-list-container">
        <div className="loading-spinner">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-list-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="movie-list-container">
        <div className="empty-message">No movies found.</div>
      </div>
    );
  }

  return (
    <div className="movie-list-container">
      <div className="movie-list">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onMovieClick}
            isFavorite={favorites.includes(movie.id)}
            isWatched={watched.includes(movie.id)}
            onToggleFavorite={onToggleFavorite}
            onToggleWatched={onToggleWatched}
          />
        ))}
      </div>

      {hasMorePages && (
        <LoadMoreButton
          onClick={onLoadMore}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default MovieList;
