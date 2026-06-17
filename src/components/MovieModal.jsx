import { useState, useEffect } from 'react';
import Backdrop from './Backdrop';
import Trailer from './Trailer';
import AiRecommendation from './AiRecommendation';
import { tmdbUrl, imageUrl, formatRating, BACKDROP_PLACEHOLDER } from '../utils/tmdb';
import './MovieModal.css';

const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const MovieModal = ({ movieId, isOpen, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) {
      return;
    }

    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(tmdbUrl(`/movie/${movieId}`));

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication failed.');
          } else if (response.status === 404) {
            throw new Error('Movie details unavailable.');
          } else {
            throw new Error('Unable to load movie details. Please try again.');
          }
        }

        const data = await response.json();
        setMovieDetails(data);
      } catch (err) {
        if (err.message.includes('fetch')) {
          setError('Network error. Please check your connection.');
        } else {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  // Clear details on close so reopening doesn't flash the previous movie. The
  // Trailer/AiRecommendation children reset themselves via their keyed remount.
  useEffect(() => {
    if (!isOpen) {
      setMovieDetails(null);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // lock background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e) => {
    // Close only when the backdrop itself is clicked, not its children.
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (isLoading) {
    return (
      <>
        <Backdrop />
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="modal-content">
            <div className="modal-loading">Loading movie details...</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Backdrop />
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="modal-content">
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
            <div className="modal-error">{error}</div>
          </div>
        </div>
      </>
    );
  }

  if (!movieDetails) {
    return null;
  }

  const backdropUrl = imageUrl(movieDetails.backdrop_path, 'w1280', BACKDROP_PLACEHOLDER);

  return (
    <>
      <Backdrop />
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>
            ×
          </button>

          <div
            className="modal-backdrop-image"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          />

          <div className="modal-details">
            <h2 className="modal-title">{movieDetails.title}</h2>

            <div className="modal-meta">
              <span className="modal-rating">⭐ {formatRating(movieDetails.vote_average)}</span>
              <span className="modal-runtime">{formatRuntime(movieDetails.runtime)}</span>
              <span className="modal-date">{formatDate(movieDetails.release_date)}</span>
            </div>

            <div className="modal-genres">
              {movieDetails.genres && movieDetails.genres.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="modal-overview">
              <h3>Overview</h3>
              <p>{movieDetails.overview || 'No overview available.'}</p>
            </div>

            {/* Keyed by movie id so switching movies cleanly unmounts/remounts:
                fresh fetch, no stale content, and their async updates never
                re-render this modal/Backdrop. */}
            <Trailer key={`trailer-${movieDetails.id}`} movieId={movieDetails.id} />

            <AiRecommendation
              key={`ai-${movieDetails.id}`}
              title={movieDetails.title}
              genres={movieDetails.genres}
              overview={movieDetails.overview}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieModal;
