import { useState, useRef, useEffect } from 'react';
import './SortControl.css';

const SortControl = ({ sortOption, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setActiveCategory(null);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const handleOptionSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
    setActiveCategory(null);
  };

  const getDisplayText = () => {
    switch (sortOption) {
      case 'title-asc':
        return 'Title (A-Z)';
      case 'title-desc':
        return 'Title (Z-A)';
      case 'date-newest':
        return 'Newest to Oldest';
      case 'date-oldest':
        return 'Oldest to Newest';
      case 'rating-highest':
        return 'Highest to Lowest';
      case 'rating-lowest':
        return 'Lowest To Highest';
      default:
        return 'Sort By';
    }
  };

  return (
    <div className="sort-control" ref={dropdownRef}>
      <button
        className="sort-control__button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
      >
        {getDisplayText()}
        <span className={`sort-control__arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="sort-control__dropdown">
          <div className="sort-control__category-wrapper">
            <div
              className={`sort-control__category ${activeCategory === 'title' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('title')}
            >
              Title/Name
              <span className="sort-control__chevron">›</span>
            </div>
            {activeCategory === 'title' && (
              <div className="sort-control__submenu">
                <div
                  className="sort-control__option"
                  onClick={() => handleOptionSelect('title-asc')}
                >
                  (A-Z)
                </div>
                <div
                  className="sort-control__option"
                  onClick={() => handleOptionSelect('title-desc')}
                >
                  (Z-A)
                </div>
              </div>
            )}
          </div>

          <div className="sort-control__category-wrapper">
            <div
              className={`sort-control__category ${activeCategory === 'date' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('date')}
            >
              Release Date
              <span className="sort-control__chevron">›</span>
            </div>
            {activeCategory === 'date' && (
              <div className="sort-control__submenu">
                <div
                  className="sort-control__option"
                  onClick={() => handleOptionSelect('date-newest')}
                >
                  Newest to Oldest
                </div>
                <div
                  className="sort-control__option"
                  onClick={() => handleOptionSelect('date-oldest')}
                >
                  Oldest to Newest
                </div>
              </div>
            )}
          </div>

          <div className="sort-control__category-wrapper">
            <div
              className={`sort-control__category ${activeCategory === 'rating' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('rating')}
            >
              Ratings
              <span className="sort-control__chevron">›</span>
            </div>
            {activeCategory === 'rating' && (
              <div className="sort-control__submenu">
                <div
                  className="sort-control__option"
                  onClick={() => handleOptionSelect('rating-highest')}
                >
                  Highest to Lowest
                </div>
                <div
                  className="sort-control__option"
                  onClick={() => handleOptionSelect('rating-lowest')}
                >
                  Lowest To Highest
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortControl;
