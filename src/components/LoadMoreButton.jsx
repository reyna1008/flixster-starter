import './LoadMoreButton.css';

const LoadMoreButton = ({ onClick, isLoading }) => {
  return (
    <div className="load-more">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="load-more__button"
      >
        {isLoading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
};

export default LoadMoreButton;
