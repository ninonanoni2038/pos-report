import React, { forwardRef } from 'react';
import { Surface, Text, Border, Object as ObjectColor } from '../../../styles/semanticColors';

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
  as?: React.ElementType;
  to?: string | (() => string);
  [x: string]: any; // その他のプロパティを許可
}

/**
 * タブボタンコンポーネント
 * タブUIのボタン部分を表示する
 */
const TabButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, TabButtonProps>(
  ({ isActive, onClick, label, as: Component = 'button', ...rest }, ref) => {
    const styles = {
      background: isActive ? ObjectColor.AccentPrimary : Surface.Primary,
      color: isActive ? Surface.Primary : Text.HighEmphasis,
      border: 'none',
      padding: '8px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: isActive ? 'bold' : 'normal',
      transition: 'background-color 0.2s',
      textDecoration: 'none', // リンクの下線を削除
      display: 'block' // インラインブロック要素として表示
    };

    return (
      <Component
        ref={ref}
        onClick={onClick}
        style={styles}
        {...rest}
      >
        {label}
      </Component>
    );
  }
);

TabButton.displayName = 'TabButton';

export default TabButton;