import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard'; // Ensure this component exists
import Modal from '../components/Modal'; // Import your Modal component
import { getEvents } from '../../src/aws/sdkCalls'; // Import the getEvents function
import { CloudTrailEvent } from '../types'; // Import your defined types

const EventsDashboard: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CloudTrailEvent | null>(null);
  const [events, setEvents] = useState<CloudTrailEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents(30); // Fetch 30 events
        if (data) {
          setEvents(data);
        } else {
          setError('No events found.');
        }
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleOpenModal = (event: CloudTrailEvent): void => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const formatEventDetails = (event: CloudTrailEvent) => {
    try {
      const parsedEvent = JSON.parse(event.CloudTrailEvent); // Parse the CloudTrailEvent string
      return {
        eventType: event.EventName || 'N/A',
        timestamp: new Date(event.EventTime).toLocaleString() || 'Invalid Date',
        sourceIP: parsedEvent.sourceIPAddress || 'N/A',
        userEmail: parsedEvent.userIdentity?.userName || 'N/A', // Safely access userName
        description: parsedEvent.eventName || 'No description available',
      };
    } catch (error) {
      console.error('Error parsing event details:', error);
      return {
        eventType: event.EventName || 'N/A',
        timestamp: new Date(event.EventTime).toLocaleString() || 'Invalid Date',
        sourceIP: 'N/A',
        userEmail: 'N/A',
        description: 'Error parsing event details',
      };
    }
  };

  return (
    <div className="event-dashboard">
      <h1>Event Dashboard</h1>
      {loading && <p>Loading events...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div className="grid-container">
          {events.map((event) => (
            <EventCard
              key={event.EventId}
              event={formatEventDetails(event)} // Pass formatted event details
              onViewDetails={handleOpenModal}
            />
          ))}
        </div>
      )}

      {modalOpen && selectedEvent && (
        <Modal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          eventDetails={formatEventDetails(selectedEvent)} // Pass formatted event details to modal
        />
      )}
    </div>
  );
};

export default EventsDashboard;
