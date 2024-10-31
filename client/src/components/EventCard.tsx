import React from 'react';
import { EventCardProps } from '../types'; // Ensure this matches the updated structure

const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
  // Ensure event.time is a valid Date object
  const eventDate = new Date(event.time);

  // Check if the date is valid
  const isValidDate = !isNaN(eventDate.getTime());

  return (
    <div className="event-card">
      <h3>Event: {event.name || 'N/A'}</h3>
      <p>
        <strong>Timestamp:</strong>{' '}
        {isValidDate ? eventDate.toLocaleString() : 'Invalid Date'}
      </p>
      <p>
        <strong>User:</strong> {event.username ?? 'Unknown User'}
      </p>
      <button onClick={() => onViewDetails(event)}>View Details</button>
    </div>
  );
};

export default EventCard;
