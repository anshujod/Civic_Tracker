export function Button({ className = '', variant = 'primary', ...props }) {
    const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition';
    const variants = {
      primary: 'bg-brand-500 text-white hover:bg-brand-600',
      secondary: 'bg-gray-800 text-white hover:bg-black',
      ghost: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      outline: 'border border-gray-300 text-gray-800 hover:bg-gray-50',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    };
    return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
  }
  
  export function Input(props) {
    return <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" {...props} />;
  }
  
  export function Textarea(props) {
    return <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" {...props} />;
  }
  
  export function Select(props) {
    return <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" {...props} />;
  }
  
  export function Card({ className = '', ...props }) {
    return <div className={`rounded-xl border bg-white p-4 shadow-sm ${className}`} {...props} />;
  }
  
  export function Badge({ children, color = 'gray' }) {
    const map = {
      gray: 'bg-gray-100 text-gray-700',
      green: 'bg-green-100 text-green-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      blue: 'bg-blue-100 text-blue-700',
    };
    return <span className={`inline-block rounded-full px-2.5 py-1 text-xs ${map[color]}`}>{children}</span>;
  }
  
  export function Spinner() {
    return (
      <div className="flex justify-center py-6">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
      </div>
    );
  }