import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import Modal from '../components/Modal';
import { getEvents } from '../aws/getEvents';
import { CloudTrailEvent, ParsedAWSEvent } from '../types';
import { EventsDashboardProps } from '../types';

const EventsDashboard: React.FC<EventsDashboardProps> = ({ isDarkMode }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ParsedAWSEvent | null>(
    null
  );
  const [events, setEvents] = useState<ParsedAWSEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents(30);
      console.log('Raw event data:', data);

      if (!data || !Array.isArray(data) || data.length === 0) {
        setError('No events found.');
        return;
      }

      const formattedData: ParsedAWSEvent[] = data
        .map((event) => {
          let cloudTrailData: CloudTrailEvent;

          try {
            cloudTrailData = JSON.parse(
              event.CloudTrailEvent!
            ) as CloudTrailEvent;
            return {
              ...event,
              ParsedCloudTrailEvent: cloudTrailData,
            };
          } catch (error) {
            console.error('Failed to parse CloudTrailEvent:', error);
            return;
          }

          // return {
          //   EventId: event.EventId ?? 'Unknown Event',
          //   EventType: cloudTrailData.eventType ?? 'Unknown Event Type',
          //   EventName: event.EventName ?? 'N/A',
          //   EventTime:
          //     typeof event.EventTime === 'string'
          //       ? event.EventTime
          //       : new Date().toISOString(),
          //   SourceIPAddress: cloudTrailData.sourceIPAddress ?? '',
          //   UserIdentity: {
          //     type: cloudTrailData.userIdentity?.type ?? 'Unknown',
          //     accountId: cloudTrailData.userIdentity?.accountId ?? '',
          //   },
          //   UserName: event.Username ?? 'Unknown User',
          //   CloudTrailEvent: event.CloudTrailEvent ?? 'Unknown Event',
          // };
        })
        .filter((event) => event !== undefined);

      setEvents(formattedData);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event: ParsedAWSEvent): void => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className={`event-dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      <h1>Event Dashboard</h1>
      {loading && <p>Loading events...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div className="grid-container">
          {events.map((event) => (
            <EventCard
              key={event.EventId}
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
          eventDetails={{
            ...selectedEvent,
            timestamp: new Date(selectedEvent.EventTime!).toLocaleString(),
            sourceIP: selectedEvent.ParsedCloudTrailEvent.sourceIPAddress,
            userType: selectedEvent.ParsedCloudTrailEvent.userIdentity.type,
            rawJson: selectedEvent.CloudTrailEvent!,
          }}
          isDarkMode={isDarkMode} // Pass the isDarkMode prop
        />
      )}
    </div>
  );
};

export default EventsDashboard;
