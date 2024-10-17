import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { getIpCounts } from '../../aws/getIpCounts'; // Update the import path
import { GeoJSONFeatureCollection, IpLocCount } from '../../types'; // Import the new type

const HeatMap: React.FC = () => {
    const [geoJSON, setGeoJSON] = useState<GeoJSONFeatureCollection | null>(null);
    const [ipData, setIpData] = useState<IpLocCount[]>([]); // Store IP data

    useEffect(() => {
        const fetchGeoJSON = async (): Promise<void> => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json() as GeoJSONFeatureCollection; // Use the defined type
                setGeoJSON(data);
            } catch (error) {
                console.error("Error fetching geoJSON:", error);
            }
        };

        const fetchIpCounts = async (): Promise<void> => {
            const data = await getIpCounts(); // Fetch the IP counts
            setIpData(data); // Store the data in state
        };

        void fetchGeoJSON();
        void fetchIpCounts(); // Fetch IP counts
    }, []);
    
    return (
        <div className="heatmap-container" style={{ overflow: 'hidden' }}>
            <h1>IP Address Heat Map</h1>
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
                                        key={(geo as GeoJSON.Feature).properties?.name as string ?? 'unknown'}
                                        geography={geo as GeoJSON.Feature}
                                        fill="#3CB371"
                                        stroke="#FFFFFF"
                                        strokeWidth={0.5}
                                    />
                                ))
                            }
                        </Geographies>
                        {ipData.map(({ ip, lat, long, count }) => (
                            <Marker key={ip} coordinates={[long, lat]}>
                                <circle r={Math.sqrt(count) * 2} fill="#FF5722" fillOpacity={0.6} />
                                <text textAnchor="middle" y={-10} style={{ fontSize: '10px', fill: '#FFFFFF' }}>
                                    {count}
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
