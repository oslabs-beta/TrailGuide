import React, { useEffect, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';

interface IPData {
  ip: string;
  value: number;
  latitude: number;
  longitude: number;
}

const ipData: IPData[] = [
  { ip: '192.168.1.1', value: 10, latitude: 37.7749, longitude: -122.4194 },
  { ip: '203.0.113.1', value: 20, latitude: -34.6037, longitude: -58.3816 },
];

const HeatMap: React.FC = () => {
  const [geoJSON, setGeoJSON] = useState<GeoJSON.FeatureCollection | null>(
    null
  );

  useEffect(() => {
    const fetchGeoJSON = async (): Promise<void> => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as GeoJSON.FeatureCollection;
        setGeoJSON(data);
      } catch (error) {
        console.error('Error fetching geoJSON:', error);
      }
    };

    void fetchGeoJSON();
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
                geographies.map((geo: { properties: { name: string } }) => (
                  <Geography
                    key={geo.properties.name}
                    geography={geo}
                    fill="#3CB371"
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                  />
                ))
              }
            </Geographies>
            {ipData.map(({ ip, value, latitude, longitude }) => (
              <Marker key={ip} coordinates={[longitude, latitude]}>
                <circle
                  r={Math.sqrt(value) * 2}
                  fill="#FF5722"
                  fillOpacity={0.6}
                />
                <text
                  textAnchor="middle"
                  y={-10}
                  style={{ fontSize: '10px', fill: '#FFFFFF' }}
                >
                  {value}
                </text>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      )}
    </div>
  );
};

export default HeatMap;
