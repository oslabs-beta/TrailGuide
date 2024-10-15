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

  onViewDetails: (event: {
    id: number;
    eventType: string;
    timestamp: string;
    sourceIP: string;
    userEmail: string;
    description: string;
  }) => void;
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
  ip: string;
  lat: number;
  long: number;
  country: string;
  region: string;
  city: string;
  count: number;
}
