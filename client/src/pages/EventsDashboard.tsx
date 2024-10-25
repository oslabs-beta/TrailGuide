import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { EventsDashboardProps, TGEvent } from '../types';
import EventCard from '../components/EventCard';

// const EventCard = lazy(() => import('../components/EventCard'));
// const Modal = lazy(() => import('../components/Modal'));

const EventsDashboard: React.FC<EventsDashboardProps> = ({ isDarkMode }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TGEvent | null>(null);
  const [events, setEvents] = useState<TGEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    fetch('/events')
      .then((response) => response.json())
      .then((data: TGEvent[]) => setEvents(() => data))
      .catch((error) => console.warn('Could not fetch events: ', error));
    setLoading(false);
  }, []);

  const handleOpenModal = (event: TGEvent): void => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

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
