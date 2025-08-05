import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function IssuesMap({ items }) {
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const center = items.length
    ? [items[0]?.location?.coordinates?.[1] || 0, items[0]?.location?.coordinates?.[0] || 0]
    : [12.9716, 77.5946];

  const lightUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const darkUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  return (
    <div className="h-80">
      <MapContainer center={center} zoom={12} className="h-full w-full rounded-xl">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url={dark ? darkUrl : lightUrl}
        />
        {items.map((i) => {
          const lat = i.location?.coordinates?.[1];
          const lng = i.location?.coordinates?.[0];
          if (typeof lat !== 'number' || typeof lng !== 'number') return null;
          return (
            <Marker position={[lat, lng]} key={i._id}>
              <Popup>
                <div className="max-w-[200px]">
                  <strong>{i.title || '(No title)'}</strong><br />
                  {i.category} • {i.status}<br />
                  {i.images?.[0]?.url && <img src={i.images[0].url} alt="" className="w-full mt-2 rounded" />}
                  <div className="mt-2">
                    <Link to={`/issue/${i._id}`}>View</Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}