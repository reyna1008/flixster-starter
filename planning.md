# Flixster — Project Planning

## Component Architecture

### Hierarchy
```
App
├── Header
│   ├── SortControl        (custom two-level dropdown)
│   └── SearchBar
├── main
│   └── MovieList
│       ├── MovieCard (×N) — poster, rating, Watched + Favorite buttons
│       └── LoadMoreButton
├── MovieModal             (rendered only when a movie is selected)
│   ├── Backdrop           (static blur/dim overlay)
│   ├── Trailer            (self-contained, embedded YouTube)
│   └── AiRecommendation   (self-contained, OpenRouter)
└── Footer
```

Loading/error/empty states are inline `<div>`s inside `MovieList` and `MovieModal`, not separate components. `Sidebar` is built but not currently mounted in `App` (see [Design Decisions](#favorites--watched-session-only)).

### Component Specs

**App** — Root. Owns all app-level state and the `fetchMovies` data-fetching logic; passes data and callbacks down. Renders `Header`, `MovieList`, `MovieModal`, `Footer`.

**Header** — Branding (🎬 Flixster) plus the `SortControl` and `SearchBar` controls. Pure presentational; forwards props through.

**SearchBar** — Controlled search input with Search (🔍) and conditional Clear (✖️) buttons. Submitting fires `onSearchSubmit`; Clear fires `onClear` to reset back to Now Playing.
- Props: `searchQuery`, `onSearchChange`, `onSearchSubmit`, `onClear`

**SortControl** — Custom button-driven dropdown with a two-level hierarchy.
- Flow: click button → primary menu (Title/Name, Release Date, Ratings) → click a category to reveal its submenu → click an option to apply, close, and update the button label. Click-outside closes everything.
- Props: `sortOption`, `onSortChange`
- Local state: `isOpen`, `activeCategory`
- Categories → options: Title/Name → (A-Z)/(Z-A) · Release Date → Newest/Oldest · Ratings → Highest/Lowest

**MovieList** — Renders the grid of `MovieCard`s and the `LoadMoreButton`. Handles loading (initial only), error, and empty states.
- Props: `movies`, `isLoading`, `error`, `onMovieClick`, `onLoadMore`, `hasMorePages`, `favorites`, `watched`, `onToggleFavorite`, `onToggleWatched`

**MovieCard** — One movie: poster (with rating badge + hover title overlay), Watched (👁️) and Favorite (❤️) toggle buttons. Clicking the poster opens the modal; action buttons `stopPropagation` so they don't trigger it.
- Props: `movie`, `onClick`, `isFavorite`, `isWatched`, `onToggleFavorite`, `onToggleWatched`

**MovieModal** — Fetches and shows details for the selected movie: backdrop image, title, rating, runtime, release date, genre tags, overview. Hosts `Trailer` and `AiRecommendation`.
- Props: `movieId`, `isOpen`, `onClose`
- Local state: `movieDetails`, `isLoading`, `error`
- Open: card click sets `selectedMovie = movie.id` in App. Close: backdrop click, × button, or Escape → `selectedMovie = null`. Body scroll is locked while open; details clear on close.
- `Trailer` and `AiRecommendation` are keyed by movie id so switching movies fully remounts them (fresh fetch, no stale content).

**Backdrop** — Static, childless blur/dim layer. Kept separate from the modal's dynamic content (AI text, iframe) so Chromium doesn't drop `backdrop-filter` for a frame when that content updates (fixes a flicker bug).

**Trailer** — Owns its own `trailerKey` + fetch (see [Videos endpoint](#4-movie-videos)). Renders an embedded YouTube iframe, or nothing if no trailer is found. Self-contained so its async update doesn't re-render the modal/Backdrop.

**AiRecommendation** — Owns `aiInsight` + `loadingInsight` + its OpenRouter fetch. Renders nothing if `VITE_OPENROUTER_API_KEY` is missing. Self-contained for the same reason as `Trailer`.
- Props: `title`, `genres`, `overview`

**LoadMoreButton** — Triggers loading the next page. Props: `onClick`, `isLoading`.

**Footer** — TMDb attribution and doc links.

---

## API Contracts

All TMDb requests are built through `tmdbUrl(path, params)` in `src/utils/tmdb.js`, which attaches `api_key` (`VITE_API_KEY`) and any extra params. Image URLs use `imageUrl(path, size, placeholder)`; ratings use `formatRating`.

### 1. Now Playing
`GET https://api.themoviedb.org/3/movie/now_playing` · params: `page`
- Used from `results[]`: `id`, `title`, `poster_path`, `vote_average`, `release_date`, `overview`; plus `page`, `total_pages`.

### 2. Search Movies
`GET https://api.themoviedb.org/3/search/movie` · params: `query`, `page`
- Same `results[]` fields as Now Playing, plus `total_results`.

### 3. Movie Details
`GET https://api.themoviedb.org/3/movie/{movie_id}`
- Used: `id`, `title`, `backdrop_path`, `poster_path`, `vote_average`, `release_date`, `runtime`, `genres[] {id, name}`, `overview`.

### 4. Movie Videos
`GET https://api.themoviedb.org/3/movie/{movie_id}/videos`
- Used from `results[]`: `key`, `site`, `type`, `official`.
- Selection (first match wins, for max trailer coverage): official YouTube trailer → any YouTube trailer → YouTube teaser → any YouTube video. Embeds as `https://www.youtube.com/embed/${key}`. No match → render nothing.

### 5. Images
Base `https://image.tmdb.org/t/p`. Used: card poster `w342`, sidebar poster `w92`, modal backdrop `w1280`. Missing path → `via.placeholder.com` placeholder.

### Error messages
| Status | Message |
|--------|---------|
| 401 | Authentication failed. Please check API configuration. |
| 404 | Unable to fetch movies / Movie details unavailable. |
| 422 | Please enter a valid search term. |
| 5xx | Service temporarily unavailable. Please try again later. |
| Network | Network error. Please check your connection and try again. |
| Empty search | No movies found matching '{query}'. Try a different search. |

Trailer and AI errors never surface to the UI — they fail silently / fall back.

---

## State Architecture

All app-level state lives in `App`; modal/trailer/AI state is local to its component.

| Variable | Type | Initial | Owner | Updated by |
|----------|------|---------|-------|------------|
| `movies` | array | `[]` | App | Now Playing / Search response (replace, or append on Load More) |
| `searchQuery` | string | `""` | App | SearchBar input; cleared on Clear |
| `currentPage` | number | `1` | App | Load More (+1); reset to 1 on new search / clear |
| `totalPages` | number | `0` | App | From response `total_pages` (drives `hasMorePages`) |
| `selectedMovie` | number \| null | `null` | App | Card click (movie **id**); `null` on close. Modal open = `!== null` |
| `sortOption` | string | `"default"` | App | SortControl selection |
| `isLoading` | boolean | `false` | App | True around each fetch |
| `error` | string \| null | `null` | App | API failure message; cleared on next fetch |
| `favorites` | number[] | `[]` | App | Favorite toggle (session-only) |
| `watched` | number[] | `[]` | App | Watched toggle (session-only) |
| `movieDetails` | object \| null | `null` | MovieModal | Details response; cleared on close |
| `trailerKey` | string \| null | `null` | Trailer | Videos response |
| `aiInsight` | string \| null | `null` | AiRecommendation | OpenRouter response (or fallback text) |
| `loadingInsight` | boolean | `false` | AiRecommendation | True around AI call |

There is no `showModal` flag — modal visibility is derived from `selectedMovie !== null`. AI failures resolve to a fallback string, so there's no separate `aiError`.

### Sort behavior
Sorting is derived, never mutates `movies`. App computes `sortedMovies` with `useMemo([movies, sortOption])`: first **dedupe by id** (the API can repeat movies across pages), then sort a copy.
- `default` (API order) · `title-asc/desc` · `date-newest/oldest` · `rating-highest/lowest`
- Operates on currently-loaded movies only (client-side). Keeping raw order in state makes reset trivial and plays nicely with pagination append.

---

## Data Flow

1. **Initial load** — App mounts → `fetchMovies(1)` hits Now Playing → `setMovies(results)`, `setTotalPages`.
2. **Render** — App passes `sortedMovies` to `MovieList`, which maps each to a `MovieCard`. Image URLs are built at render time from `poster_path`.
3. **Open modal** — Card click → `onMovieClick(movie)` → App `setSelectedMovie(movie.id)`. Modal's `useEffect([movieId])` fetches details, then renders; keyed `Trailer`/`AiRecommendation` fetch their own data.
4. **Close** — Backdrop/×/Escape → `onClose()` → `setSelectedMovie(null)`; modal clears `movieDetails`.
5. **Sort** — SortControl → `setSortOption` → `useMemo` recomputes `sortedMovies`. No API call.
6. **Pagination** — Load More → `fetchMovies(currentPage + 1, true)` → appends `results` to `movies`.
7. **Search** — Submit → `fetchMovies(1, false)` (replaces list). Clear → `fetchMovies(1, false, '')` (empty query forces Now Playing).
8. **Errors** — any failed fetch sets `error`; `MovieList` shows the message instead of the grid.

---

## Responsive Design

Mobile-first CSS Grid, `repeat(auto-fill, minmax(MIN, 1fr))`, container capped at `1600px`.

| Breakpoint | Card min | Gap |
|------------|----------|-----|
| Base (mobile) | 160px | 20px |
| ≥ 600px (tablet) | 190px | 24px |
| ≥ 1024px (desktop) | 230px | 28px |
| ≥ 1440px (large) | 250px | 32px |

Touch targets stay ≥ 44×44px; text stays readable at every size.

---

## AI Feature — Watch Recommendation

When a movie's modal opens, an AI-generated 2–3 sentence recommendation appears below the overview, helping the user decide if it's worth watching tonight.

### Prompt
- **System**: "You are an enthusiastic but honest movie critic helping users decide if a film is worth their time tonight. Write compelling 2-3 sentence watch recommendations (40-80 words) that capture each movie's appeal without spoilers. Use third-person perspective, be specific to genres and themes, and focus on who would enjoy the film and why. Avoid generic phrases and comparisons unless truly helpful."
- **User**: `Movie: {title}\nGenres: {genres}\nPlot: {overview}\n\nWrite a 2-3 sentence watch recommendation for this film.`
- **Output**: plain text, 2–3 sentences (40–80 words), third-person, genre-specific, no spoilers, no negative takes.

### Integration
- `POST https://openrouter.ai/api/v1/chat/completions`, model `openrouter/free`
- Headers: `Authorization: Bearer ${VITE_OPENROUTER_API_KEY}`, `Content-Type: application/json`
- Read `data.choices[0].message.content`, trimmed. Any error → fallback string (logged to console, never shown raw).

### Lifecycle (in `AiRecommendation`)
Keyed by movie id, so it remounts per movie. On mount with a title + key present: `loadingInsight = true` → call → set `aiInsight` (response or fallback) → `loadingInsight = false`. A `cancelled` flag in the effect cleanup prevents setting state after unmount. Renders nothing when the API key is absent.

### UI
Below the overview: heading `✨ Watch Recommendation`, then one of — loading (`✨ Getting a recommendation...`), the AI text, or the fallback message. Distinct section styling, slightly smaller/italic text to set it apart from static content.

### Decisions
- **Model**: `openrouter/free` — no-cost, good enough instruction-following for short blurbs.
- **State location**: local to `AiRecommendation` (and `Trailer`) so async updates don't re-render the modal or trigger the `backdrop-filter` flicker.
- **Trigger**: after details exist, sequential (details → AI), via the keyed remount.
- **Failure**: friendly fallback that points to the overview; never expose technical errors.

### Testing
- Vary genres → recommendations stay specific, not boilerplate.
- Invalid key / forced error → fallback shows, no crash.
- Throttle network → loading state is visible.
- Switch movies rapidly → no stale text (keyed remount + `cancelled` guard).
- Confirm no API keys leak into committed code.

### Future
Cache per movie, user toggle, model A/B testing, thumbs up/down, use rating + year as extra context.

---

## Design System

CSS custom properties in `index.css`.

**Colors** — background `#0f1419`, surface `#1a2332` (hover `#22303f`), accent `#3b82f6` (hover `#2563eb`), border `#374151`, text primary `#ffffff`, text secondary `#9ca3af`, star `#fbbf24`, favorite `#ef4444`, watched `#3b82f6`. All combinations meet WCAG AA (4.5:1).

**Typography** — headings Poppins (600–800), body Inter (400–700), via Google Fonts.

**Interaction** — `:focus-visible` 2px accent outline; transitions `0.15s`/`0.2s`/`0.3s ease`; card hover lift + shadow; button scale.

---

## Design Decisions

### Favorites & Watched: session-only
Stored as plain id arrays in App state — no localStorage, cookies, or backend. They reset on reload.

- **Why**: the app is for browsing/discovery, not long-term tracking; this keeps it lightweight and avoids persistence complexity. Toggling gives immediate visual feedback (grayscale → colored) without commitment.
- **Sidebar**: a `Sidebar` component (favorites/watched lists) is scaffolded but not currently mounted in `App`. If persistence is wanted later, a `useEffect` syncing these arrays to localStorage plus wiring up the sidebar is all it takes.

### Shared TMDb utils
`src/utils/tmdb.js` centralizes the API host, key, image CDN, placeholders, and the `tmdbUrl` / `imageUrl` / `formatRating` helpers so URLs aren't hand-concatenated across components.

### Isolated async children
`Trailer`, `AiRecommendation`, and the static `Backdrop` are deliberately separate from `MovieModal` so their independent async updates don't re-render the modal shell — which is what caused the `backdrop-filter` flicker.
