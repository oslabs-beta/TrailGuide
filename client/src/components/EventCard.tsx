import React from 'react';
import { EventCardProps } from '../../../types';


const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
    return (
        <div className="event-card">
            <h2>{event.eventType}</h2>
            <p>Timestamp: {event.timestamp}</p>
            <button onClick={() => onViewDetails(event)}>View Details</button>
        </div>
    );
};

export default EventCard;
