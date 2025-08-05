import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import IssuesMap from '../components/IssuesMap';
import Hero from '../components/hero';
import { Badge, Card, Select, Spinner } from '../components/ui';

export default function IssuesList() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Change these if your API supports more filters (e.g., search, sort)
  const params = useMemo(() => ({ status, category }), [status, category]);

  const fetchPage = async (p) => {
    setLoading(true);
    try {
      const { data } = await api.get('/issues', { params: { ...params, page: p, limit: 12 } });
      setHasMore(Boolean(data.hasMore));
      if (p === 1) setItems(data.items || []);
      else setItems((prev) => [...prev, ...(data.items || [])]);
    } finally {
      setLoading(false);
    }
  };

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(1);
    fetchPage(1);
  }, [params]);

  // Infinite scroll sentinel
  const sentinelRef = useRef(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMore && !loading) {
        const next = page + 1;
        setPage(next);
        fetchPage(next);
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [page, hasMore, loading, params]);

  return (
    <div className="space-y-4">
      <Hero />

      <div id="issues" className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Reported Issues</h2>
        <div className="flex gap-2">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </Select>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            <option>Road</option>
            <option>Sewer</option>
            <option>Streetlight</option>
            <option>Garbage</option>
            <option>Other</option>
          </Select>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <IssuesMap items={items} />
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <Link key={i._id} to={`/issue/${i._id}`} className="group">
            <Card className="hover:shadow-md transition h-full">
              {i.images?.[0]?.url && (
                <img
                  src={i.images[0].url}
                  alt=""
                  className="h-40 w-full object-cover rounded-md"
                  loading="lazy"
                />
              )}
              <div className="mt-3 space-y-1">
                <h3 className="font-semibold line-clamp-1 group-hover:underline">
                  {i.title || '(No title)'}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge color="blue">{i.category}</Badge>
                  <Badge
                    color={
                      i.status === 'Resolved'
                        ? 'green'
                        : i.status === 'In Progress'
                        ? 'yellow'
                        : 'gray'
                    }
                  >
                    {i.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {i.description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {loading && <Spinner />}
      {!hasMore && items.length > 0 && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          No more issues
        </div>
      )}

      {/* Sentinel element for infinite scroll */}
      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}