import React from 'react';
import { EventCardProps } from '../types'; 
/**
 * EventCard component displays information about an event and provides a button to view more details.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.event - The event object containing details about the event.
 * @param {string} props.event.name - The name of the event.
 * @param {string} props.event.time - The timestamp of the event.
 * @param {string} props.event.username - The username of the person associated with the event.
 * @param {Function} props.onViewDetails - Callback function to handle viewing event details.
 *
 * @returns {JSX.Element} The rendered EventCard component.
 */


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
