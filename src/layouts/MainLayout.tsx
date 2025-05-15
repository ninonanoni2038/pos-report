import React from 'react';
import { Object, Surface, Border, Text, Background } from '../styles/semanticColors';

const SIDE_MENU_WIDTH = 220;

const menuItems = [
  '予約',
  '注文',
  '設定',
  '顧客',
  '顧客へ一斉送信',
  '設定',
  '売上分析',
  'その他',
];

const SideMenu: React.FC = () => {
  const primary = Object.AccentPrimary;
  const primaryLight = Surface.AccentPrimaryLight;
  return (
    <div
      style={{
        width: SIDE_MENU_WIDTH,
        height: '100vh',
        background: Surface.Primary,
        borderRight: `1px solid ${Border.LowEmphasis}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* レストラン名 */}
      <div
        style={{
          height: 64,
          background: Surface.Primary,
          color: Text.Primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: 20,
          letterSpacing: 2,
          borderBottom: `1px solid ${Border.LowEmphasis}`,
        }}
      >
        サンプル食堂
      </div>
      {/* メニューリスト */}
      <div style={{ flex: 1, paddingTop: 16 }}>
        {menuItems.map((item, idx) => {
          const isActive = item === '売上分析';
          return (
            <div
              key={item + idx}
              style={{
                padding: '12px 24px',
                color: isActive ? primary : Text.Secondary,
                background: isActive ? primaryLight : 'transparent',
                borderRadius: 6,
                margin: '4px 8px',
                fontWeight: isActive ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Header: React.FC = () => (
  <div style={{ height: 64, background: Surface.Primary, borderBottom: `1px solid ${Border.LowEmphasis}`, display: 'flex', alignItems: 'center', padding: '0 32px', fontWeight: 'bold', fontSize: 22, color: Text.Primary }}>
    売上分析
  </div>
);

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', height: '100vh' }}>
    <SideMenu />
    <div style={{ flex: 1, background: Background.Default, display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  </div>
);

export default MainLayout; 