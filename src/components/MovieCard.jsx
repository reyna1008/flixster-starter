import { imageUrl, formatRating, POSTER_PLACEHOLDER } from '../utils/tmdb';
import './MovieCard.css';

const MovieCard = ({ movie, onClick, isFavorite, isWatched, onToggleFavorite, onToggleWatched }) => {
  const posterUrl = imageUrl(movie.poster_path, 'w342', POSTER_PLACEHOLDER);
  const rating = formatRating(movie.vote_average);

  // stopPropagation so the action buttons don't also trigger the card's onClick.
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(movie.id);
  };

  const handleWatchedClick = (e) => {
    e.stopPropagation();
    onToggleWatched(movie.id);
  };

  return (
    <div className="movie-card">
      <div className="movie-card__poster-container" onClick={() => onClick(movie)}>
        <img
          src={posterUrl}
          alt={`${movie.title} poster`}
          className="movie-card__poster"
        />
        <div className="movie-card__rating">
          <span className="rating-icon">⭐</span>
          <span className="rating-value">{rating}</span>
        </div>
        <div className="movie-card__overlay">
          <h3 className="movie-card__title">{movie.title}</h3>
        </div>
      </div>
      <div className="movie-card__actions">
        <button
          className={`movie-card__button movie-card__button--watched ${isWatched ? 'active' : ''}`}
          onClick={handleWatchedClick}
          aria-label={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
        >
          👁️ Watched
        </button>
        <button
          className={`movie-card__button movie-card__button--favorite ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          ❤️
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
