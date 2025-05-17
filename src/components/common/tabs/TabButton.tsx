import React from 'react';
import { Surface, Text, Border, Object as ObjectColor } from '../../../styles/semanticColors';

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
}

/**
 * タブボタンコンポーネント
 * タブUIのボタン部分を表示する
 */
const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, label }) => (
  <button
    onClick={onClick}
    style={{
      background: isActive ? ObjectColor.AccentPrimary : Surface.Primary,
      color: isActive ? Surface.Primary : Text.HighEmphasis,
      border: 'none',
      padding: '8px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: isActive ? 'bold' : 'normal',
      transition: 'background-color 0.2s'
    }}
  >
    {label}
  </button>
);

export default TabButton;