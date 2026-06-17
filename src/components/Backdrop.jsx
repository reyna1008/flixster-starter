import './Backdrop.css';

// Static, childless overlay layer. Isolating the blur/dim from the modal's
// dynamic content (AI text, YouTube iframe) prevents Chromium from dropping
// the backdrop-filter for a frame when that content changes (the flicker bug).
const Backdrop = () => <div className="modal-overlay" aria-hidden="true" />;

export default Backdrop;
