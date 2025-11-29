'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if device supports fine pointer (mouse/trackpad)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    
    const handleMove = (e: MouseEvent) => {
      if (!shouldShow) setShouldShow(true);
      setPos({ x: e.clientX, y: e.clientY });
    };

    // Only set up listener if device has fine pointer support
    if (mediaQuery.matches) {
      window.addEventListener('mousemove', handleMove);
    }

    return () => window.removeEventListener('mousemove', handleMove);
  }, [shouldShow]);

  // Don't render until we detect mouse movement
  if (!shouldShow) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: pos.y,
        left: pos.x,
        width: '10px',
        height: '10px',
        background: 'white',
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'difference',
        zIndex: 9999,
        transition: 'transform 0.15s ease-out'
      }}
    />
  );
}
