/**
 * =================================
 * CLIENT TYPES
 * =================================
 */


/**
 * REACT PROPS TYPES
 */


export interface CardProps {
  title: string;
  children: React.ReactNode;
}


export interface EventCardProps {

  event: {

      id: number;

      eventType: string;

      timestamp: string;

      sourceIP: string;

      userEmail: string;

      description: string;

  };

  onViewDetails: (event: { id: number; eventType: string; timestamp: string; sourceIP: string; userEmail: string; description: string; }) => void;

}



export interface ModalProps {

  isOpen: boolean;

  onClose: () => void;

  eventDetails: {

    timestamp: string;

    sourceIP: string;

    userEmail: string;

    description: string;

  } | null;

}



/**
 * =================================
 * SERVER TYPES
 * =================================
 */