export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[var(--brand-text)] mb-1">{label}</label>}
      <input
        className={`w-full px-4 py-2 border border-[var(--brand-border)] bg-white text-black placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  )
}
