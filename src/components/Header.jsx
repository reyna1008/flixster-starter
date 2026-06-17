import './Header.css';
import SortControl from './SortControl';
import SearchBar from './SearchBar';

const Header = ({ sortOption, onSortChange, searchQuery, onSearchChange, onSearchSubmit, onClear }) => {
  return (
    <header className="header">
      <div className="header__content">
        <h1 className="header__title">🎬 Flixster</h1>
        <div className="header__controls">
          <SortControl
            sortOption={sortOption}
            onSortChange={onSortChange}
          />
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onSearchSubmit={onSearchSubmit}
            onClear={onClear}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
