import React, { lazy, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { CardState } from '../types';

const Card = lazy(() => import('../components/Card'));
const UserActivityChart = lazy(() => import('../components/charts/UserActivity'));
const HeatMap = lazy(() => import('../components/charts/HeatMap'));
const IpAccessCombined = lazy(() => import('../components/IpAccessCombined'));
const EventTypeChart = lazy(() => import('../components/charts/EventType'));
const EventSourceChart = lazy(() => import('../components/charts/EventSource'));

const Home: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  // State to track the current IP (null means no IP selected)
  const [currentIp, setCurrentIp] = useState<string | undefined>();

  const [cards, setCards] = useState<CardState[]>([
    { id: 'userActivity', title: 'User Activity', component: <UserActivityChart  /> },
    { id: 'eventTypes', title: 'Event Types', component: <EventTypeChart /> },
    { id: 'eventSources', title: 'Event Sources', component: <EventSourceChart /> },
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
