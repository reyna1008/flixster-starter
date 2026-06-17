import { useState, useEffect } from 'react';
import { tmdbUrl } from '../utils/tmdb';
import './Trailer.css';

// Self-contained trailer feature: owns its own trailerKey state + fetch so its
// async update doesn't re-render the parent modal / Backdrop / overlay.
const Trailer = ({ movieId }) => {
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    if (!movieId) {
      return;
    }

    let cancelled = false;

    const fetchTrailer = async () => {
      try {
        const response = await fetch(tmdbUrl(`/movie/${movieId}/videos`));

        if (!response.ok) {
          return; // trailer is optional — fail silently
        }

        const data = await response.json();

        // Prefer an official YouTube trailer, then fall back through any
        // trailer, a teaser, and finally any YouTube video.
        const trailer =
          data.results.find(
            (video) =>
              video.site === 'YouTube' &&
              video.type === 'Trailer' &&
              video.official === true
          ) ||
          data.results.find(
            (video) => video.site === 'YouTube' && video.type === 'Trailer'
          ) ||
          data.results.find(
            (video) => video.site === 'YouTube' && video.type === 'Teaser'
          ) ||
          data.results.find((video) => video.site === 'YouTube');

        if (trailer && !cancelled) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        console.error('Failed to fetch trailer:', error); // trailer is optional
      }
    };

    fetchTrailer();

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  if (!trailerKey) {
    return null;
  }

  return (
    <div className="modal-trailer-section">
      <h3>🎬 Official Trailer</h3>
      <div className="modal-trailer-container">
        <iframe
          src={`https://www.youtube.com/embed/${trailerKey}`}
          title="Movie Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="modal-trailer-iframe"
        />
      </div>
    </div>
  );
};

export default Trailer;
