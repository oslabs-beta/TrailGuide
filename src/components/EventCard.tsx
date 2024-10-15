import React from 'react';
import { EventCardProps } from '../types'; // Ensure this matches the updated structure

const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
  return (
    <div className="event-card">
      <h2>{event.eventType}</h2>
      <p><strong>Timestamp:</strong> {event.timestamp}</p>
      <p><strong>Source IP:</strong> {event.sourceIP || 'N/A'}</p>
      <p><strong>User:</strong> {event.userEmail || 'N/A'}</p>
      <button onClick={() => onViewDetails(event)}>View Details</button>
    </div>
  );
};

export default EventCard;
