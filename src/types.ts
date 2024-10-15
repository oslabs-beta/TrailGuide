/**
 * =================================
 * CLIENT TYPES
 * =================================
 */

// types.ts

export interface UserIdentity {
  type: string;
  accountId: string;
}

export interface CloudTrailData {
  sourceIPAddress: string;
  userIdentity: UserIdentity;
  eventType: string;
}

export interface CloudTrailEvent {
  EventId: string;
  EventType: string;
  EventName: string;
  EventTime: string;
  SourceIPAddress: string;
  UserIdentity: UserIdentity;
  UserName: string;
  CloudTrailEvent: string;
}
/**
 * REACT PROPS TYPES
 */

export interface ProfileProps {

  isDarkMode: boolean;

}

export interface CardProps {
  title: string;
  children: React.ReactNode;
  isDarkMode: boolean;

}

export interface EventsDashboardProps {

  isDarkMode: boolean;

}


export interface NavbarProps {

  toggleDarkMode: () => void;
  isDarkMode: boolean;

}

export interface EventCardProps {
  event: CloudTrailEvent; // Update to use the full CloudTrailEvent type
  onViewDetails: (event: CloudTrailEvent) => void;
  isDarkMode: boolean; 
}

// Update ModalProps to include UserIdentity
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventDetails: (CloudTrailEvent & { 
    timestamp: string; 
    sourceIP: string; // Keep this as is
    userType: string; // Change to UserIdentity type
    rawJson: string; // Include rawJson
  }) | null; // Update to include UserIdentity
  isDarkMode: boolean;
}

