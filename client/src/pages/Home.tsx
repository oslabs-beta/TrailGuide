import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { CardState } from '../types';
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

  const [cards, setCards] = useState<CardState[]>([
    {
      id: 'userActivity',
      title: 'User Activity',
      component: <UserActivityChart />,
    },
    { id: 'eventTypes', title: 'Event Names', component: <EventTypeChart /> },
    {
      id: 'eventSources',
      title: 'Event Sources',
      component: <EventSourceChart />,
    },
    { id: 'heatMap', title: 'IP Address Heat Map', component: <HeatMap /> },
    {
      id: 'ipAccess',
      title: 'Access by IP Address',
      component: (
        <IpAccessCombined
          currentIp={currentIp}
          setCurrentIp={setCurrentIp} // Pass the setter for updating the selected IP
        />
      ),
    },
    {
      id: 'anomalyDetection',
      title: 'Anomaly Detection',
      component: <AnomalyChart />,
    },
  ]);

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
                          {card.component}
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
