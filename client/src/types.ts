/**
 * =================================
 * CLIENT TYPES
 * =================================
 */

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

export interface CardState {
  id: string;
  title: string;
  component: React.ReactNode;
}

export interface IpAccessCombinedProps {
  currentIp?: string;
  setCurrentIp: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export interface EventsDashboardProps {
  isDarkMode: boolean;
}

export interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

export interface EventCardProps {
  event: LocationTGEvent | TGEvent | CountedEvent;
  onViewDetails: (event: LocationTGEvent | TGEvent | CountedEvent) => void;
  isDarkMode: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: TGEvent | null;
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

export interface TGEvent {
  _id: string;
  name: string;
  source: string;
  read_only: boolean;
  username: string;
  accesskey_id: string;
  account_id: string;
  arn: string;
  aws_region: string;
  cipher_suite: string;
  client_provided_host_header: string;
  category: string;
  time: Date;
  type: string;
  version: string;
  is_management: boolean;
  pricipal_id: string;
  recipient_account_id: string;
  request_id: string;
  source_ip: string;
  tls_version: string;
  user_identity_type: string;
  user_agent: string;
}

export interface IPLocation {
  country: string;
  region: string;
  city: string;
  lat: number;
  long: number;
}

export interface CountedEvent extends TGEvent {
  count: number;
}

export type LocationTGEvent = IPLocation & (TGEvent | CountedEvent);

export interface LoginFormData {
  username: string;
  password: string;
}

/**
 * GeoJSON Types
 */
export interface GeoJSONFeatureCollection {
  type: string;
  features: {
    type: string;
    properties: Record<string, unknown>;
    geometry: {
      type: string;
      coordinates: number[][] | number[][][];
    };
  }[];
}
