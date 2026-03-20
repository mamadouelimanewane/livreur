import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Correction des icônes Leaflet par défaut
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

// Composant pour recentrer la carte quand les coordonnées changent
function ChangeView({ center, zoom }) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY || 'placeholder'

/**
 * Composant de carte interactive utilisant Leaflet et LocationIQ.
 */
export default function MapView({ 
  center = [14.7167, -17.4677], // Dakar par défaut
  zoom = 13, 
  markers = [], 
  route = null,
  height = '200px'
}) {
  return (
    <div style={{ height, width: '100%', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ChangeView center={center} zoom={zoom} />
        
        {/* Tuiles de carte LocationIQ (plus élégantes et incluent les noms de rues) */}
        <TileLayer
          url={`https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${LOCATIONIQ_KEY}`}
          attribution='&copy; LocationIQ / OpenStreetMap contributors'
        />

        {markers.map((m, i) => (
          <Marker key={i} position={m.position}>
            {m.label && <Popup>{m.label}</Popup>}
          </Marker>
        ))}

        {route && (
          <Polyline 
            positions={route} 
            color="#4680ff" 
            weight={4} 
            opacity={0.8} 
          />
        )}
      </MapContainer>
    </div>
  )
}
