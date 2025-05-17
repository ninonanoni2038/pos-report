import React, { useState, useRef } from 'react';
import { Surface, Text, Border } from '../../../styles/semanticColors';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

/**
 * ツールチップコンポーネント
 * ホバー時に説明テキストを表示する
 */
const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const childRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (childRef.current) {
      const rect = childRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 5
      });
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div
      ref={childRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-block' }}
    >
      {children}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -100%)',
            backgroundColor: Surface.Primary,
            color: Text.HighEmphasis,
            padding: '4px 8px',
            borderRadius: 4,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 1000,
            fontSize: '0.8rem',
            maxWidth: '200px',
            textAlign: 'center',
            pointerEvents: 'none',
            border: `1px solid ${Border.LowEmphasis}`,
            whiteSpace: 'nowrap'
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;