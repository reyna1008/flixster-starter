// Shared TMDb config + URL builders so the API host, key, and image CDN live
// in one place instead of being hand-concatenated across components.
const API_KEY = import.meta.env.VITE_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const POSTER_PLACEHOLDER = 'https://via.placeholder.com/342x513?text=No+Poster';
export const BACKDROP_PLACEHOLDER = 'https://via.placeholder.com/1280x720?text=No+Image';

// Build a TMDb endpoint with the api key (and any extra params) attached.
export const tmdbUrl = (path, params = {}) => {
  const query = new URLSearchParams({ api_key: API_KEY, ...params });
  return `${API_BASE_URL}${path}?${query}`;
};

// Build an image URL, falling back to a placeholder when the path is missing.
export const imageUrl = (path, size, placeholder) =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : placeholder;

// Display a vote average to one decimal, or 'N/A' when absent.
export const formatRating = (voteAverage) =>
  voteAverage ? voteAverage.toFixed(1) : 'N/A';
