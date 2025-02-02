import React, { useState, useEffect, useRef } from 'react';

interface EditableCellProps {
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number' | 'color' | 'url';
}

export const EditableCell: React.FC<EditableCellProps> = ({ value, onChange, type = 'text' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState<string | number>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Convert null/undefined to empty string or 0 depending on type
    if (value === null || value === undefined) {
      setCurrentValue(type === 'number' ? 0 : '');
    } else {
      setCurrentValue(value);
    }
  }, [value, type]);

  const handleBlur = () => {
    setIsEditing(false);
    // Ensure we never pass null/undefined back
    const finalValue = currentValue === null || currentValue === undefined ? 
      (type === 'number' ? 0 : '') : 
      currentValue;
    onChange(finalValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  if (!isEditing) {
    return (
      <div
        className="px-4 py-2 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsEditing(true)}
      >
        {type === 'color' ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: currentValue as string }} />
            <span className="text-sm">{currentValue as string}</span>
          </div>
        ) : type === 'url' ? (
          <img 
            src={currentValue as string || 'https://via.placeholder.com/32'} 
            alt="Preview" 
            className="w-8 h-8 object-cover rounded" 
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/32';
            }}
          />
        ) : (
          currentValue || (type === 'number' ? '0' : '')
        )}
      </div>
    );
  }

  if (type === 'color') {
    return (
      <div className="px-4 py-2 flex items-center gap-2">
        <input
          ref={inputRef}
          type="color"
          value={currentValue as string}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleBlur}
          className="w-8 h-8 rounded cursor-pointer"
          autoFocus
        />
        <input
          type="text"
          value={currentValue as string}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-1 border rounded"
          placeholder="#000000"
        />
      </div>
    );
  }

  return (
    <input
      ref={inputRef}
      type={type === 'number' ? 'number' : 'text'}
      value={currentValue}
      onChange={(e) => setCurrentValue(type === 'number' ? Number(e.target.value) : e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="w-full px-4 py-2 border-2 border-blue-500 focus:outline-none"
      autoFocus
    />
  );
};