import React, { useState } from 'react';
import EventCard from '../components/EventCard'; // Make sure to create this component
import Modal from '../components/Modal'; // Import your Modal component

const EventDashboard: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<{
        id: number;
        eventType: string;
        timestamp: string;
        sourceIP: string;
        userEmail: string;
        description: string;
    } | null>(null);

    const events = Array.from({ length: 30 }, (_, index) => ({
        id: index,
        eventType: `Event Type ${index + 1}`,
        timestamp: new Date().toISOString(),
        sourceIP: "192.168.1.1",
        userEmail: "user@example.com",
        description: "Event description here...",
    }));

    const handleOpenModal = (event: { id: number; eventType: string; timestamp: string; sourceIP: string; userEmail: string; description: string; }) => {
        setSelectedEvent(event);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedEvent(null);
    };

    return (
        <div className="event-dashboard">
            <h1>Event Dashboard</h1>
            <div className="grid-container">
                {events.map(event => (
                    <EventCard key={event.id} event={event} onViewDetails={handleOpenModal} />
                ))}
            </div>

            {modalOpen && selectedEvent && (
                <Modal isOpen={modalOpen} onClose={handleCloseModal} eventDetails={selectedEvent} />
            )}
        </div>
    );
};

export default EventDashboard;
