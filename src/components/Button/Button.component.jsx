import React from 'react'

export const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      startIcon = null,
      endIcon = null,
      fullWidth = false,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.98]'

    const variants = {
      primary:
        'bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-sm shadow-primary/20',
      secondary:
        'bg-secondary text-main hover:opacity-90 focus:ring-secondary',
      outline:
        'border border-border text-main hover:bg-primary-light focus:ring-primary',
      ghost:
        'text-muted hover:bg-primary-light hover:text-main focus:ring-primary',
      danger:
        'bg-danger text-white hover:opacity-90 focus:ring-danger shadow-sm',
      success:
        'bg-success text-white hover:opacity-90 focus:ring-success shadow-sm',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-base gap-2.5',
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${
          fullWidth ? 'w-full' : ''
        } ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : (
          startIcon
        )}
        <span>{children}</span>
        {!isLoading && endIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
