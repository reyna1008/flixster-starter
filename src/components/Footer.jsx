import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__text">
          &copy; {currentYear} Flixster. All rights reserved.
        </p>
        <p className="footer__attribution">
          Movie data provided by{' '}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            The Movie Database (TMDb)
          </a>
        </p>
        <div className="footer__links">
          <a
            href="https://www.themoviedb.org/documentation/api"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            API Documentation
          </a>
          <span className="footer__separator">•</span>
          <a
            href="https://www.themoviedb.org/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            Terms of Use
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
