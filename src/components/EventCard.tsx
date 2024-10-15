import React from 'react';
import { EventCardProps } from '../types'; // Ensure this matches the updated structure

const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
  return (
    <div className="event-card">
      <h3>Event: {event.EventType || 'N/A'}</h3>
      <p><strong>Timestamp:</strong> {new Date(event.EventTime).toLocaleString() || 'Invalid Date'}</p>
      <p><strong>User:</strong> {event.UserName ?? 'Unknown User'}</p>
      <button onClick={() => onViewDetails(event)}>View Details</button>
    </div>
  );
};

export default EventCard;
