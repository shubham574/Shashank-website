"use client";

import React, { useEffect, useRef, useState } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

interface DraggableResizableCalProps {
  calLink: string; // Your cal.com username/event-type
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
}

const DraggableResizableCal: React.FC<DraggableResizableCalProps> = ({
  calLink,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 700 }
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Initialize Cal.com embed
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({});
      cal('ui', {
        styles: { branding: { brandColor: '#000000' } },
        theme: 'light'
      });
    })();
  }, []);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isResizing) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isResizing) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      setSize({
        width: Math.max(400, resizeStart.width + deltaX),
        height: Math.max(500, resizeStart.height + deltaY)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Handle resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
    setIsResizing(true);
  };

  // Add global event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  return (
    <div
      ref={containerRef}
      className="absolute bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: isDragging || isResizing ? 1000 : 10,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* Draggable Header */}
      <div
        ref={headerRef}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 cursor-grab active:cursor-grabbing flex justify-between items-center"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        
        <h3 className="text-lg font-semibold select-none">Schedule a Meeting</h3>
        
        <div className="text-sm opacity-75 select-none">
          {size.width}×{size.height}
        </div>
      </div>

      {/* Cal.com Embed Container */}
      <div 
        className="relative" 
        style={{ height: size.height - 64 }} // Subtract header height
      >
        {/* Iframe Cover for Dragging/Resizing */}
        {(isDragging || isResizing) && (
          <div 
            className="absolute inset-0 z-50 bg-black bg-opacity-10"
            style={{ pointerEvents: 'all' }}
          />
        )}
        
        <Cal
          calLink={calLink}
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none',
            overflow: 'auto'
          }}
          config={{
            'ui.styles.branding.brandColor': '#000000',
            'theme': 'light'
          }}
        />
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-400 hover:bg-gray-600 transition-colors"
        onMouseDown={handleResizeMouseDown}
        style={{
          background: 'linear-gradient(-45deg, transparent 30%, #666 30%, #666 40%, transparent 40%, transparent 60%, #666 60%, #666 70%, transparent 70%)'
        }}
      />

      {/* Resize Indicator */}
      {isResizing && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded pointer-events-none">
          {size.width} × {size.height}
        </div>
      )}
    </div>
  );
};

export default DraggableResizableCal;
