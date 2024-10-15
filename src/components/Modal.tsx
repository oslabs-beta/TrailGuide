import React from 'react';
import { ModalProps } from '../types'; // Adjust the import based on your file structure

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, eventDetails }) => {
  if (!isOpen || !eventDetails) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Event Details</h2>
        <p>
          <strong>Event Type:</strong> {eventDetails.EventName || 'N/A'}
        </p>
        <p>
          <strong>Timestamp:</strong> {new Date(eventDetails.EventTime).toLocaleString() || 'Invalid Date'}
        </p>
        <p>
          <strong>Source IP:</strong> {eventDetails.SourceIPAddress || 'N/A'}
        </p>
        <p>
          <strong>User Email/ID:</strong> {eventDetails.UserIdentity?.userName || 'N/A'}
        </p>
        <p>
          <strong>Description:</strong> {eventDetails.CloudTrailEvent || 'No description available'}
        </p>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
