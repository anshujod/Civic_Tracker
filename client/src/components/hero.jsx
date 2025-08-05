import { Link } from 'react-router-dom';

export default function Hero({ showCTA = true }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-brand-50 to-white p-8 dark:from-gray-900 dark:to-gray-900 dark:border-gray-800">
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Report civic issues. Track progress. Improve your city.
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Snap a photo, mark the location, and notify the right department. Follow updates from pending to resolved.
        </p>
        {showCTA && (
          <div className="mt-5 flex gap-3">
            <Link to="/create" className="px-4 py-2 rounded-md bg-brand-500 text-white hover:bg-brand-600">
              Report an Issue
            </Link>
            <a href="#issues" className="px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
              Browse Issues
            </a>
          </div>
        )}
      </div>
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/20" />
    </section>
  );
}