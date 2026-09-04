import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import api from '../api/axios'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function MapView() {
  const [donations, setDonations] = useState([])

  useEffect(() => {
    api.get('/donations/', { params: { page_size: 100 } }).then(({ data }) => {
      setDonations((data.results || data).filter((d) => d.pickup_latitude && d.pickup_longitude))
    })
  }, [])

  const center = donations.length
    ? [donations[0].pickup_latitude, donations[0].pickup_longitude]
    : [23.8103, 90.4125]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Donation Pickup Locations</h1>
      <div className="card p-0 overflow-hidden">
        <MapContainer center={center} zoom={11} style={{ height: '520px', width: '100%' }}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {donations.map((d) => (
            <Marker key={d.id} position={[d.pickup_latitude, d.pickup_longitude]}>
              <Popup>
                <strong>{d.food_type}</strong><br />
                {d.quantity} {d.unit}<br />
                Status: {d.status}<br />
                {d.pickup_address}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
