const Input = ({
    label,
    error,
    className = '',
    type = 'text',
    ...props
  }) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={`
              w-full px-4 py-2 rounded-lg border
              ${error ? 'border-red-500' : 'border-gray-300'}
              focus:outline-none focus:ring-2
              ${error ? 'focus:ring-red-500' : 'focus:ring-primary-500'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  };
  
  export default Input;