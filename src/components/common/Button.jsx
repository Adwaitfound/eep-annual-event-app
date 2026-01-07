export const Button = ({ children, variant = 'primary', size = 'md', disabled = false, onClick, className, ...props }) => {
  const baseStyles = 'font-bold rounded-full transition-all cursor-pointer border border-transparent flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-[var(--brand-primary)] text-black hover:shadow-lg hover:shadow-[var(--brand-primary)]/50',
    secondary: 'bg-[var(--brand-surface-2)] text-[var(--brand-text)] border-[var(--brand-border)] hover:border-[var(--brand-primary)]',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }
  
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
