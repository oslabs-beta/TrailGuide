/**
 * =================================
 * CLIENT TYPES
 * =================================
 */

export interface CloudTrailEvent {
  EventId: string; // Unique identifier for the event
  EventName: string; // Name of the event (e.g., "RunInstances", "DeleteBucket", etc.)
  EventTime: string; // Timestamp of when the event occurred (ISO 8601 format)
  SourceIPAddress: string; // IP address from which the request was made
  UserIdentity: UserIdentity; // Details about the user who made the request
  CloudTrailEvent: string; // Raw JSON of the CloudTrail event
}

export interface UserIdentity {
  type: string; // Type of user (e.g., "IAMUser", "AssumedRole")
  principalId?: string; // Unique identifier for the user
  arn: string; // Amazon Resource Name (ARN) of the user
  accountId: string; // AWS account ID
  userName?: string; // Name of the IAM user (if applicable)
}

/**
 * REACT PROPS TYPES
 */

export interface EventCardProps {
  event: {
    EventId: string;
    EventName: string;
    EventTime: string; // ISO 8601 format
    UserIdentity: {
      userName?: string; // Name of the user, if applicable
      // Other fields can be added as necessary
    };
  };
  onViewDetails: (event: any) => void; // Adjust as needed
}


export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventDetails: {
    eventType: string;
    timestamp: string;
    sourceIP: string;
    userEmail: string;
    description: string;
  } | null;
}
