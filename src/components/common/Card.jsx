export const Card = ({ children, className = '', onClick, ...props }) => {
  return (
    <div
      className={`rounded-lg p-4 border border-[var(--brand-border)] bg-[var(--brand-surface)] shadow-md text-[var(--brand-text)] ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}
