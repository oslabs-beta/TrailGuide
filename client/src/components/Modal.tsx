import React from 'react';
import { ModalProps } from '../types';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  event,
  isDarkMode,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div
      className={`modal-overlay ${isDarkMode ? 'dark-mode' : ''}`}
      onClick={onClose}
    >
      <div
        className={`modal ${isDarkMode ? 'dark-mode' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`modal-header ${isDarkMode ? 'dark-mode' : ''}`}>
          <h2>Event Details</h2>
          <button
            onClick={onClose}
            className={`close-button ${isDarkMode ? 'dark-mode' : ''}`}
          >
            X
          </button>
        </div>
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
          <div
            className={`raw-json-container ${isDarkMode ? 'dark-mode' : ''}`}
          >
            <pre>{JSON.stringify(event, null, 2)}</pre>
          </div>
        </div>
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
