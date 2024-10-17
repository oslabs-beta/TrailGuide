import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { getIpCounts } from '../../aws/getIpCounts'; 
import { GeoJSONFeatureCollection, IpLocCount } from '../../types'; 

const HeatMap: React.FC = () => {
    const [geoJSON, setGeoJSON] = useState<GeoJSONFeatureCollection | null>(null);
    const [ipData, setIpData] = useState<IpLocCount[]>([]); 

    useEffect(() => {
        const fetchGeoJSON = async (): Promise<void> => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json() as GeoJSONFeatureCollection; 
                setGeoJSON(data);
            } catch (error) {
                console.error("Error fetching geoJSON:", error);
            }
        };

        const fetchIpCounts = async (): Promise<void> => {
            const data = await getIpCounts(); 
            setIpData(data); 
        };

        void fetchGeoJSON();
        void fetchIpCounts(); 
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
                                <title>{`Count: ${count}`}</title>
                            </Marker>
                        ))}
                    </ZoomableGroup>
                </ComposableMap>
            )}
            {/* <footer className="heatmap-footer">
                <p>{ipData.map(({ ip }) => (
                    <span key={ip}>{[ip]} </span>
                ))}</p>
                </footer> */}
        </div>
    );
};

export default HeatMap;
