import './SearchBar.css';

const SearchBar = ({ searchQuery, onSearchChange, onSearchSubmit, onClear }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-bar__form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="What are you looking for..."
          className="search-bar__input"
        />
        <button
          type="submit"
          className="search-bar__button"
          aria-label="Search"
        >
          🔍
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={onClear}
            className="search-bar__button search-bar__button--clear"
            aria-label="Clear search"
          >
            ✖️
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
