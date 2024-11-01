import React from 'react';
import { ModalProps } from '../types';

// Modal component definition
/**
 * Modal component to display event details in a modal dialog.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.isOpen - Indicates if the modal is open.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {Object} props.event - The event object containing event details.
 * @param {boolean} props.isDarkMode - Indicates if dark mode is enabled.
 *
 * @returns {JSX.Element | null} The Modal component or null if not open or no event.
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  event,
  isDarkMode,
}) => {
  // If the modal is not open or there is no event, return null
  if (!isOpen || !event) return null;

  return (
    // Modal overlay that closes the modal when clicked
    <div
      className={`modal-overlay ${isDarkMode ? 'dark-mode' : ''}`}
      onClick={onClose}
    >
      {/* Modal content container */}
      <div
        className={`modal ${isDarkMode ? 'dark-mode' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header with title and close button */}
        <div className={`modal-header ${isDarkMode ? 'dark-mode' : ''}`}>
          <h2>Event Details</h2>
          <button
            onClick={onClose}
            className={`close-button ${isDarkMode ? 'dark-mode' : ''}`}
          >
            X
          </button>
        </div>
        {/* Modal content displaying event details */}
        <div className={`modal-content ${isDarkMode ? 'dark-mode' : ''}`}>
          <p>
            <strong>Event Type:</strong> {event.type ?? 'N/A'}
          </p>
          <p>
            <strong>Event:</strong> {event.name ?? 'N/A'}
          </p>
          <p>
            <strong>Timestamp:</strong>{' '}
            {event.time.toLocaleString() ?? 'Invalid Date'}
          </p>
          <p>
            <strong>Source IP:</strong> {event.source_ip ?? 'N/A'}
          </p>
          <p>
            <strong>User Type:</strong> {event.user_identity_type ?? 'N/A'}
          </p>
          <p>
            <strong>Raw JSON Data:</strong>
          </p>
          {/* Container for displaying raw JSON data of specified event log*/}
          <div
            className={`raw-json-container ${isDarkMode ? 'dark-mode' : ''}`}
          >
            <pre>{JSON.stringify(event, null, 2)}</pre>
          </div>
        </div>
        {/* Modal footer with close button */}
        <div className={`modal-footer ${isDarkMode ? 'dark-mode' : ''}`}>
          <button
            onClick={onClose}
            className={`close-button ${isDarkMode ? 'dark-mode' : ''}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
