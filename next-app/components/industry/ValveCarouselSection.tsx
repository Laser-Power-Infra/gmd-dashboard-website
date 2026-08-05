'use client';

import { useState, useEffect, useRef } from 'react';
import type { IndustrySection } from '@/types';

export default function ValveCarouselSection({ section }: { section: IndustrySection }) {
  const [step, setStep] = useState(0);
  const isPausedRef = useRef(false);

  const totalItems = section.rows.length;
  const angle = 360 / totalItems;
  const activeIndex = ((step % totalItems) + totalItems) % totalItems;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        setStep((prev) => prev + 1);
      }
    }, 2000); // Auto-rotate every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStep((prev) => prev - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStep((prev) => prev + 1);
  };

  const handleItemClick = (e: React.MouseEvent, targetIdx: number) => {
    e.stopPropagation();
    setStep((prev) => {
      const currentIdx = ((prev % totalItems) + totalItems) % totalItems;
      let diff = targetIdx - currentIdx;
      // Find the shortest rotation path
      if (diff > totalItems / 2) diff -= totalItems;
      else if (diff < -totalItems / 2) diff += totalItems;
      return prev + diff;
    });
  };

  return (
    <div
      className="carousel-split-layout"
      onMouseEnter={() => {
        isPausedRef.current = true;
      }}
      onMouseLeave={() => {
        isPausedRef.current = false;
      }}
    >
      <div className="carousel-left-pane">
        <div className="circular-carousel-scene">
          <div
            className="circular-carousel"
            style={{ transform: `translateZ(-150px) rotateY(${step * -angle}deg)` }}
          >
            {section.rows.map((row, idx) => {
              const itemAngle = angle * idx;
              return (
                <div
                  key={idx}
                  className={`carousel-item ${idx === activeIndex ? 'active' : ''}`}
                  style={{ transform: `rotateY(${itemAngle}deg) translateZ(150px)` }}
                  onClick={(e) => handleItemClick(e, idx)}
                >
                  {row.image ? (
                    <img src={row.image} alt={row.data[0]} />
                  ) : (
                    <div style={{ color: '#9ca3af', fontSize: '0.8rem', textAlign: 'center' }}>Image Coming Soon</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="carousel-controls">
          <button onClick={handlePrev}>&#8592;</button>
          <button onClick={handleNext}>&#8594;</button>
        </div>
      </div>
      <div className="carousel-right-pane">
        <h3 className="active-valve-title">{section.rows[activeIndex].data[0]}</h3>
        <table className="active-valve-table">
          <tbody>
            {section.headers.slice(1).map((header, hIdx) => (
              <tr key={hIdx}>
                <th>{header}</th>
                <td>{section.rows[activeIndex].data[hIdx + 1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
