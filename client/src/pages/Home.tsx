import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import UserActivityChart from '../components/charts/UserActivity';
import EventTypeChart from '../components/charts/EventType';
import EventSourceChart from '../components/charts/EventSource';
import HeatMap from '../components/charts/HeatMap';
import IpAccessCombined from '../components/IpAccessCombined';
import AnomalyChart from '../components/charts/AnomalyChart';
import Card from '../components/Card';

const Home: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  // State to track the current IP (null means no IP selected)
  const [currentIp, setCurrentIp] = useState<string | undefined>();

  // Only ids and titles live in state. The element for each card is built
  // on every render so it always sees the latest currentIp.
  const [cards, setCards] = useState<{ id: string; title: string }[]>([
    { id: 'userActivity', title: 'User Activity' },
    { id: 'eventTypes', title: 'Event Names' },
    { id: 'eventSources', title: 'Event Sources' },
    { id: 'heatMap', title: 'IP Address Heat Map' },
    { id: 'ipAccess', title: 'Access by IP Address' },
    { id: 'anomalyDetection', title: 'Anomaly Detection' },
  ]);

  const renderCard = (id: string): React.ReactNode => {
    switch (id) {
      case 'userActivity':
        return <UserActivityChart />;
      case 'eventTypes':
        return <EventTypeChart />;
      case 'eventSources':
        return <EventSourceChart />;
      case 'heatMap':
        return <HeatMap />;
      case 'ipAccess':
        return (
          <IpAccessCombined
            currentIp={currentIp}
            setCurrentIp={setCurrentIp}
          />
        );
      case 'anomalyDetection':
        return <AnomalyChart />;
      default:
        return null;
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const updatedCards = Array.from(cards);
    const [movedCard] = updatedCards.splice(result.source.index, 1);
    updatedCards.splice(result.destination.index, 0, movedCard);
    setCards(updatedCards);
  };

  return (
    <div className="home-container">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <div
              className="draggable-grid"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <>
                {cards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className={`draggable-card ${
                          card.id === 'ipAccess' && currentIp ? 'expanded' : ''
                        } ${snapshot.isDragging ? 'dragging' : ''}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card title={card.title} isDarkMode={isDarkMode}>
                          {renderCard(card.id)}
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
              </>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Home;
