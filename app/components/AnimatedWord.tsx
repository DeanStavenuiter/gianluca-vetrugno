'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AnimatedWordProps {
  word?: string;
  children?: string;
  className?: string;
  letterClassName?: string;
  duration?: number;
  staggerDelay?: number;
}

const AnimatedWord: React.FC<AnimatedWordProps> = ({
  word,
  children,
  className = '',
  letterClassName = '',
  duration = 1000,
  staggerDelay = 90,
}) => {
  const text = word || children || '';
  const letters = text.split('');
  const [, setHoveredIndex] = useState<number | null>(null);
  const [animatingLetters, setAnimatingLetters] = useState<Set<number>>(new Set());
  const [isWaveAnimating, setIsWaveAnimating] = useState(false);
  const [isAnimationInProgress, setIsAnimationInProgress] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      // Cleanup all timeouts on unmount
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleLetterHover = (index: number) => {
    // Prevent new animations if one is already in progress
    if (isAnimationInProgress) return;

    setIsAnimationInProgress(true);
    setHoveredIndex(index);
    setAnimatingLetters(new Set([index]));

    // Calculate animation sequence
    const sequence: number[] = [index];
    let distance = 1;

    while (sequence.length < letters.length) {
      const before = index - distance;
      const after = index + distance;

      if (before >= 0) sequence.push(before);
      if (after < letters.length) sequence.push(after);

      distance++;
    }

    // Animate letters in sequence
    sequence.forEach((letterIndex, seqIndex) => {
      const timeout = setTimeout(() => {
        setAnimatingLetters(prev => new Set([...prev, letterIndex]));

        // If this is the last letter, start wave animation
        if (seqIndex === sequence.length - 1) {
          const waveTimeout = setTimeout(() => {
            setIsWaveAnimating(true);
            setAnimatingLetters(new Set());

            // Reset after wave animation
            const resetTimeout = setTimeout(() => {
              setIsWaveAnimating(false);
              setHoveredIndex(null);
              setIsAnimationInProgress(false);
            }, letters.length * 50 + 500);

            timeoutsRef.current.push(resetTimeout);
          }, duration);

          timeoutsRef.current.push(waveTimeout);
        }
      }, seqIndex * staggerDelay);

      timeoutsRef.current.push(timeout);
    });
  };

  const handleMouseLeave = () => {
    // Don't reset if any animation is in progress
    if (!isAnimationInProgress) {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      setHoveredIndex(null);
      setAnimatingLetters(new Set());
    }
  };

  return (
    <span 
      className={`inline-flex items-center ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {letters.map((letter, index) => {
        const isAnimating = animatingLetters.has(index);
        const waveDelay = isWaveAnimating ? index * 50 : 0;

        return (
          <span
            key={index}
            className={`relative inline-block ${letterClassName}`}
            style={{
              perspective: '1000px',
            }}
            onMouseEnter={() => handleLetterHover(index)}
          >
            {/* Container for letter animation */}
            <span
              className="relative inline-block"
              style={{
                display: 'inline-block',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Original letter that moves down */}
              <span
                className="inline-block"
                style={{
                  transform: isAnimating
                    ? 'translateY(150%)'
                    : 'translateY(0)',
                  opacity: isAnimating ? 0 : 1,
                  transition: isAnimating 
                    ? `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`
                    : 'none',
                  animation: isWaveAnimating 
                    ? `waveUp 400ms cubic-bezier(0.34, 1.56, 0.64, 1) ${waveDelay}ms forwards`
                    : 'none',
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>

              {/* Replacement letter that comes from top */}
              {isAnimating && (
                <span
                  className="absolute inset-0 inline-block"
                  style={{
                    transform: 'translateY(-100%)',
                    opacity: 0,
                    animation: `slideInFromTop ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              )}
            </span>
          </span>
        );
      })}

      <style jsx>{`
        @keyframes slideInFromTop {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes waveUp {
          0% {
            transform: translateY(30px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
};

export default AnimatedWord;
