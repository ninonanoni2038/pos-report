import React from 'react';
import { Border } from '../../../styles/semanticColors';

interface TabGroupProps {
  children: React.ReactNode;
}

/**
 * タブグループコンポーネント
 * 複数のタブボタンをグループ化して表示する
 */
const TabGroup: React.FC<TabGroupProps> = ({ children }) => (
  <div style={{
    display: 'flex',
    borderRadius: '8px',
    overflow: 'hidden',
    border: `1px solid ${Border.LowEmphasis}`,
    width: 'fit-content'
  }}>
    {children}
  </div>
);

export default TabGroup;