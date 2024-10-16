import React from 'react';
import { ModalProps } from '../types';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  eventDetails,
  isDarkMode,
}) => {
  if (!isOpen || !eventDetails) return null;

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
            <strong>Event Type:</strong>{' '}
            {eventDetails.ParsedCloudTrailEvent.eventType ?? 'N/A'}
          </p>
          <p>
            <strong>Event:</strong> {eventDetails.EventName ?? 'N/A'}
          </p>
          <p>
            <strong>Timestamp:</strong>{' '}
            {new Date(eventDetails.EventTime!).toLocaleString() ??
              'Invalid Date'}
          </p>
          <p>
            <strong>Source IP:</strong>{' '}
            {eventDetails.ParsedCloudTrailEvent.sourceIPAddress ?? 'N/A'}
          </p>
          <p>
            <strong>User Type:</strong>{' '}
            {eventDetails.ParsedCloudTrailEvent.userIdentity.type ?? 'N/A'}
          </p>
          <p>
            <strong>Raw JSON Data:</strong>
          </p>
          <div
            className={`raw-json-container ${isDarkMode ? 'dark-mode' : ''}`}
          >
            <pre>
              {JSON.stringify(
                JSON.parse(eventDetails.CloudTrailEvent!),
                null,
                2
              )}
            </pre>
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
