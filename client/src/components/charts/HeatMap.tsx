import React, { useEffect, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import {
  CountedEvent,
  GeoJSONFeatureCollection,
  IPLocation,
} from '../../types';

/**
 * HeatMap component renders a heatmap using GeoJSON data and IP location data with event counts.
 * 
 * @component
 * @returns {JSX.Element} The rendered heatmap component.
 * 
 * @remarks
 * This component fetches GeoJSON data for the map and event data with IP locations and counts.
 * It uses the `ComposableMap`, `ZoomableGroup`, `Geographies`, and `Marker` components from the `react-simple-maps` library.
 * 
 * @example
 * ```tsx
 * <HeatMap />
 * ```
 * 
 * @typedef {Object} GeoJSONFeatureCollection
 * @property {string} type - The type of the GeoJSON object.
 * @property {Array<GeoJSON.Feature>} features - The array of GeoJSON features.
 * 
 * @typedef {Object} IPLocation
 * @property {string} source_ip - The source IP address.
 * @property {number} lat - The latitude of the IP location.
 * @property {number} long - The longitude of the IP location.
 * 
 * @typedef {Object} CountedEvent 
 * @property {number} count - The count of events for the IP location.
 * 
 * @typedef {IPLocation & CountedEvent} IPLocationWithCount
 * 
 * @state {GeoJSONFeatureCollection | null} geoJSON - The state to store the GeoJSON data.
 * @state {IPLocationWithCount[]} ipData - The state to store the IP location data with event counts.
 * 
 * @function
 * @name fetchGeoJSON
 * @description Fetches the GeoJSON data for the map.
 * 
 * @function
 * @name fetchEventData
 * @description Fetches the event data with IP locations and counts.
 */
const HeatMap: React.FC = () => {
  // State to store the GeoJSON data
  const [geoJSON, setGeoJSON] = useState<GeoJSONFeatureCollection | null>(null);
  // State to store the IP location data with event counts
  const [ipData, setIpData] = useState<(IPLocation & CountedEvent)[]>([]);

  useEffect(() => {
    // Fetch the GeoJSON data for the map
    fetch(
      'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
    )
      .then((response) => response.json())
      .then((data: GeoJSONFeatureCollection) => setGeoJSON(data))
      .catch((error) => console.error('Error fetching geoJSON:', error));

    // Fetch the event data with IP locations and counts
    fetch('/events?countOn=source_ip&includeLocation=true')
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.status + ': ' + response.statusText);
      })
      .then((data: (IPLocation & CountedEvent)[] | { err: string }) =>
        setIpData(() => data as (IPLocation & CountedEvent)[])
      )
      .catch((error) =>
        console.warn('Could not fetch event ip counts and locations: ', error)
      );
  }, []);

  return (
    <div className="heatmap-container" style={{ overflow: 'hidden' }}>
      {geoJSON && (
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 150 }}
          style={{ backgroundColor: '#1E90FF' }}
        >
          <ZoomableGroup zoom={1} center={[0, 0]}>
            <Geographies geography={geoJSON}>
              {({ geographies }) =>
                // Render each geography (country) on the map
                geographies.map((geo) => (
                  <Geography
                    key={
                      ((geo as GeoJSON.Feature).properties?.name as string) ??
                      'unknown'
                    }
                    geography={geo as GeoJSON.Feature}
                    fill="#3CB371"
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                  />
                ))
              }
            </Geographies>
            {ipData.map(({ source_ip, lat, long, count }) => (
              // Render a marker for each IP location with event count
              <Marker key={source_ip} coordinates={[long, lat]}>
                <circle
                  r={Math.sqrt(count) * 2}
                  fill="#FF5722"
                  fillOpacity={0.6}
                />
                <title>{`Count: ${count}`}</title>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      )}
    </div>
  );
};

export default HeatMap;
