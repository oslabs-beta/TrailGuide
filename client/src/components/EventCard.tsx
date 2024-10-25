import React from 'react';
import { EventCardProps } from '../types'; // Ensure this matches the updated structure

const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
  return (
    <div className="event-card">
      <h3>Event: {event.type || 'N/A'}</h3>
      <p>
        <strong>Timestamp:</strong>{' '}
        {event.time.toLocaleString() || 'Invalid Date'}
      </p>
      <p>
        <strong>User:</strong> {event.username ?? 'Unknown User'}
      </p>
      <button onClick={() => onViewDetails(event)}>View Details</button>
    </div>
  );
};

export default EventCard;
