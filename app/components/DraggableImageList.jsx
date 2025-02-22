'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FiX, FiMove } from 'react-icons/fi';

export default function DraggableImageList({ images, onReorder, onRemove }) {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    onReorder(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {images.map((url, index) => (
        <div
          key={url}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`relative group cursor-move ${
            draggedIndex === index ? 'opacity-50' : ''
          }`}
        >
          <div className="aspect-square relative">
            <Image
              src={url}
              alt=""
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 25vw, 200px"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
            <FiMove className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <FiX className="w-4 h-4" />
          </button>
          {index === 0 && (
            <span className="absolute bottom-1 right-1 bg-primary text-white text-xs px-2 py-1 rounded">
              الصورة الرئيسية
            </span>
          )}
        </div>
      ))}
    </div>
  );
} 