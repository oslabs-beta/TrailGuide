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

const HeatMap: React.FC = () => {
  const [geoJSON, setGeoJSON] = useState<GeoJSONFeatureCollection | null>(null);
  const [ipData, setIpData] = useState<(IPLocation & CountedEvent)[]>([]);

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
    )
      .then((response) => response.json())
      .then((data: GeoJSONFeatureCollection) => setGeoJSON(data))
      .catch((error) => console.error('Error fetching geoJSON:', error));

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
