'use client';
import { useState, useEffect } from 'react';
import { Range } from 'react-range';

export default function PriceRangeSlider({ min, max, onChange }) {
  const [values, setValues] = useState([min, max]);

  useEffect(() => {
    setValues([min, max]);
  }, [min, max]);

  const handleChange = (newValues) => {
    setValues(newValues);
    onChange(newValues);
  };

  return (
    <div className="px-2 py-4">
      <Range
        step={10}
        min={min}
        max={max}
        values={values}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-1 w-full bg-gray-200 rounded-full"
          >
            <div
              className="h-1 bg-primary rounded-full"
              style={{
                width: `${((values[1] - values[0]) / (max - min)) * 100}%`,
                left: `${((values[0] - min) / (max - min)) * 100}%`,
                position: 'absolute'
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="h-4 w-4 bg-primary rounded-full shadow focus:outline-none"
          />
        )}
      />
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>{values[0]} شيكل</span>
        <span>{values[1]} شيكل</span>
      </div>
    </div>
  );
} 