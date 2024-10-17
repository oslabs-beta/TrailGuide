/**
 * =================================
 * CLIENT TYPES
 * =================================
 */

import { Event, Resource } from '@aws-sdk/client-cloudtrail';

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
  event: ParsedAWSEvent; // Update to use the full CloudTrailEvent type
  onViewDetails: (event: ParsedAWSEvent) => void;
  isDarkMode: boolean;
}

// Update ModalProps to include UserIdentity
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventDetails:
    | (ParsedAWSEvent & {
        timestamp: string;
        sourceIP: string; // Keep this as is
        userType: string; // Change to UserIdentity type
        rawJson: string; // Include rawJson
      })
    | null; // Update to include UserIdentity
  isDarkMode: boolean;
}

export interface IPAPIResponse {
  ip: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country_code: string;
  country_code_iso3: string;
  country_name: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
  hostname: string;
}

export interface IpLocCount {
  name: string;
  ip: string;
  lat: number;
  long: number;
  country: string;
  region: string;
  city: string;
  count: number;
}

export interface TimeCount {
  time: Date;
  localTime: string;
  count: number;
}

export interface LoginFormData {
  username: string;
  password: string;
}

/**
 * AWS SDK custom types
 *
 */

type JSONParsableString = string;
export interface UnparsedAWSEvent extends Event {
  CloudTrailEvent?: JSONParsableString;
}

export interface ParsedAWSEvent extends Event {
  ParsedCloudTrailEvent: CloudTrailEvent;
}

export interface CloudTrailEvent {
  eventVersion: string;
  userIdentity: UserIdentity;
  eventTime: string;
  eventSource: string;
  eventName: string;
  awsRegion: string;
  sourceIPAddress: string;
  userAgent: string;
  requestParameters: RequestParameters;
  responseElements: null;
  requestID: string;
  eventID: string;
  readOnly: boolean;
  eventType: string;
  managementEvent: boolean;
  recipientAccountId: string;
  eventCategory: string;
  tlsDetails: TLSDetails;
  sessionCredentialFromConsole: string;
}

export interface RequestParameters {
  maxItems: number;
}

export interface TLSDetails {
  tlsVersion: string;
  cipherSuite: string;
  clientProvidedHostHeader: string;
}

export interface UserIdentity {
  type: string;
  principalId: string;
  arn: string;
  accountId: string;
  accessKeyId: string;
  sessionContext: SessionContext;
}

export interface SessionContext {
  sessionIssuer: SessionIssuer;
  attributes: Attributes;
}

export interface Attributes {
  creationDate: Date;
  mfaAuthenticated: string;
}

export interface SessionIssuer {
  type: string;
  principalId: string;
  arn: string;
  accountId: string;
  userName: string;
}

export interface FlattenedEvent {
  AccessKeyId?: string;
  EventId?: string;
  EventName?: string;
  EventSource?: string;
  EventTime?: Date;
  ReadOnly?: string;
  Resources?: Resource[];
  Username?: string;
  type?: string;
  principalId?: string;
  arn?: string;
  accountId?: string;
  accessKeyId?: string;
  sessionContentsType?: string;
  SessionContentsPrincipalId?: string;
  SessionContentsArn?: string;
  SessionContentsAccountId?: string;
  creationDate?: Date;
  mfaAuthenticated?: string;
  userName?: string;
  eventVersion?: string;
  eventTime?: Date;
  eventSource?: string;
  eventName?: string;
  awsRegion?: string;
  sourceIPAddress?: string;
  userAgent?: string;
  maxItems?: number;
  responseElements?: null;
  requestID?: string;
  eventID?: string;
  readOnly?: boolean;
  eventType?: string;
  managementEvent?: boolean;
  recipientAccountId?: string;
  eventCategory?: string;
  tlsVersion?: string;
  cipherSuite?: string;
  clientProvidedHostHeader?: string;
  sessionCredentialFromConsole?: string;
}
