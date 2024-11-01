import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { EventsDashboardProps, TGEvent } from '../types';
import EventCard from '../components/EventCard';

/**
 * EventsDashboard component displays a list of recent events on event-cards and allows users to view event details in a modal.
 * 
 * @param {EventsDashboardProps} props - The props for the EventsDashboard component.
 * @param {boolean} props.isDarkMode - A boolean indicating if dark mode is enabled.
 * 
 * @returns {JSX.Element} The rendered EventsDashboard component.
 * 
 * @remarks
 * - Fetches events data from the server when the component mounts.
 * - Handles loading and error states during data fetching.
 * - Maps the fetched events to EventCard components for display.
 * - Allows users to open a modal to view details of a selected event.
 * 
 * @example
 * ```tsx
 * <EventsDashboard isDarkMode={true} />
 * ```
 */
const EventsDashboard: React.FC<EventsDashboardProps> = ({ isDarkMode }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TGEvent | null>(null);
  const [events, setEvents] = useState<TGEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events data from the server when the component mounts
  useEffect(() => {
    fetch('/events')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.status + ': ' + response.statusText);
      })
      .then((data: TGEvent[]) => setEvents(() => data))
      .catch((error) => {
        if (error === '403: Forbidden')
          setError('Please enter AWS Credentials to view events');
        else console.warn('Could not fetch events: ', error);
      });

    setLoading(false);
  }, []);

  // Function to open the modal and set the selected event
  const handleOpenModal = (event: TGEvent): void => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  // Function to close the modal and clear the selected event
  const handleCloseModal = (): void => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className={`event-dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      <h1>Recent Events</h1>
      {loading && <p>Loading events...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div className="grid-container">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onViewDetails={handleOpenModal}
              isDarkMode={isDarkMode} // Pass the isDarkMode prop
            />
          ))}
        </div>
      )}

      {modalOpen && selectedEvent && (
        <Modal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
          isDarkMode={isDarkMode} // Pass the isDarkMode prop
        />
      )}
    </div>
  );
};

export default EventsDashboard;
