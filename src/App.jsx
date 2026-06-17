import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import MovieList from './components/MovieList';
import MovieModal from './components/MovieModal';
import Footer from './components/Footer';
import { tmdbUrl } from './utils/tmdb';
import './App.css';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('default');

  const [selectedMovie, setSelectedMovie] = useState(null);

  // Favorites and Watched are session-only — they reset on reload, not persisted.
  const [favorites, setFavorites] = useState([]);
  const [watched, setWatched] = useState([]);

  // Fetch Now Playing (no query) or Search results (with query).
  const fetchMovies = async (page = 1, isLoadMore = false, query = searchQuery) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = query
        ? tmdbUrl('/search/movie', { query, page })
        : tmdbUrl('/movie/now_playing', { page });

      const response = await fetch(endpoint);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please check API configuration.');
        } else if (response.status === 404) {
          throw new Error('Unable to fetch movies. Please try again.');
        } else if (response.status === 422) {
          throw new Error('Please enter a valid search term.');
        } else if (response.status >= 500) {
          throw new Error('Service temporarily unavailable. Please try again later.');
        } else {
          throw new Error('An error occurred while fetching movies.');
        }
      }

      const data = await response.json();

      if (query && data.results.length === 0 && page === 1) {
        setError(`No movies found matching '${query}'. Try a different search.`);
        setMovies([]);
        setTotalPages(0);
        return;
      }

      if (isLoadMore) {
        setMovies(prevMovies => [...prevMovies, ...data.results]);
      } else {
        setMovies(data.results);
      }

      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (err) {
      if (err.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1);
  }, []);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setCurrentPage(1);
      fetchMovies(1, false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    fetchMovies(1, false, ''); // empty string forces the Now Playing endpoint
  };

  const handleLoadMore = () => {
    fetchMovies(currentPage + 1, true);
  };

  // Deduplicate by id (the API can return duplicates across pages), then sort.
  const sortedMovies = useMemo(() => {
    const uniqueMovies = Array.from(
      new Map(movies.map(movie => [movie.id, movie])).values()
    );

    switch (sortOption) {
      case 'title-asc':
        return [...uniqueMovies].sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return [...uniqueMovies].sort((a, b) => b.title.localeCompare(a.title));
      case 'date-newest':
        return [...uniqueMovies].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      case 'date-oldest':
        return [...uniqueMovies].sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
      case 'rating-highest':
        return [...uniqueMovies].sort((a, b) => b.vote_average - a.vote_average);
      case 'rating-lowest':
        return [...uniqueMovies].sort((a, b) => a.vote_average - b.vote_average);
      default:
        return uniqueMovies;
    }
  }, [movies, sortOption]);

  // Toggle a movie id in or out of a session list (favorites/watched).
  const makeToggle = (setList) => (movieId) => {
    setList(prev =>
      prev.includes(movieId)
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  return (
    <div className="App">
      <Header
        sortOption={sortOption}
        onSortChange={setSortOption}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onClear={handleClearSearch}
      />
      <main>
        <MovieList
          movies={sortedMovies}
          isLoading={isLoading}
          error={error}
          onMovieClick={(movie) => setSelectedMovie(movie.id)}
          onLoadMore={handleLoadMore}
          hasMorePages={currentPage < totalPages}
          favorites={favorites}
          watched={watched}
          onToggleFavorite={makeToggle(setFavorites)}
          onToggleWatched={makeToggle(setWatched)}
        />
      </main>
      <MovieModal
        movieId={selectedMovie}
        isOpen={selectedMovie !== null}
        onClose={() => setSelectedMovie(null)}
      />
      <Footer />
    </div>
  );
};

export default App;
