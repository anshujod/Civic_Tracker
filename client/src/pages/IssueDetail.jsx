import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Badge, Button, Card, Input, Select } from '../components/ui';

export default function IssueDetail() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [status, setStatus] = useState('Pending');
  const [note, setNote] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const load = async () => {
    const { data } = await api.get(`/issues/${id}`);
    setIssue(data);
    setStatus(data.status);
  };

  useEffect(() => { load(); }, [id]);

  const updateStatus = async () => {
    await api.post(`/issues/${id}/status`, { status, note });
    setNote('');
    await load();
  };

  if (!issue) return <div>Loading...</div>;
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <h2 className="text-2xl font-semibold">{issue.title}</h2>
          <div className="mt-2 flex items-center gap-2">
            <Badge color="blue">{issue.category}</Badge>
            <Badge color={issue.status === 'Resolved' ? 'green' : issue.status === 'In Progress' ? 'yellow' : 'gray'}>
              {issue.status}
            </Badge>
          </div>
          <p className="mt-3 text-gray-700">{issue.description}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {issue.images?.map((img) => (
              <img key={img.url} src={img.url} alt="" className="w-full rounded-md border object-cover" />
            ))}
          </div>
          <div className="mt-3 text-sm text-gray-600">{issue.location?.address}</div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">History</h3>
          <ul className="space-y-2">
            {issue.history?.map((h, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                {new Date(h.changedAt).toLocaleString()} — <strong>{h.status}</strong> {h.note ? `: ${h.note}` : ''}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {(user?.role === 'official' || user?.role === 'admin') && (
        <Card>
          <h3 className="text-lg font-semibold mb-3">Update Status</h3>
          <div className="space-y-3">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </Select>
            <Input placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
            <Button onClick={updateStatus}>Save</Button>
          </div>
        </Card>
      )}
    </div>
  );
}