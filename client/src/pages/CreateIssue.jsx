import { useEffect, useState } from 'react';
import api from '../api';
import { Button, Card, Input, Select, Textarea } from '../components/ui';

export default function CreateIssue() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [files, setFiles] = useState([]);
  const [coords, setCoords] = useState({ lat: '', lng: '' });
  const [address, setAddress] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('category', category);
    fd.append('lat', coords.lat);
    fd.append('lng', coords.lng);
    fd.append('address', address);
    Array.from(files).forEach((f) => fd.append('images', f));
    try {
      await api.post('/issues', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Reported successfully!');
      setTitle(''); setDescription(''); setFiles([]); setAddress('');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error creating issue');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Report an Issue</h2>
        {msg && <div className="mb-3 text-sm text-gray-700">{msg}</div>}
        <form onSubmit={submit} className="grid gap-3">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Road</option><option>Sewer</option><option>Streetlight</option><option>Garbage</option><option>Other</option>
            </Select>
            <Input placeholder="Address (optional)" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="text-sm text-gray-600">Location: {coords.lat && coords.lng ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Fetching...'}</div>
          <input className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 hover:file:bg-gray-200" type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
          <Button type="submit" className="w-fit">Submit</Button>
        </form>
      </Card>
    </div>
  );
}