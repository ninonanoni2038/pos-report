import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Object, Surface, Border, Text, Background } from '../styles/semanticColors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCalendarAlt,
	faShoppingCart,
	faUtensils,
	faCog,
	faUsers,
	faEnvelope,
	faBullhorn,
	faChartBar,
  } from '@fortawesome/pro-solid-svg-icons';
  

const SIDE_MENU_WIDTH = 220;

// 階層構造のメニュー定義
const menuItems = [
  {
    category: 'レストラン',
    items: [
      { name: '予約', icon: faCalendarAlt, path: '/reservation' },
      { name: '注文', icon: faShoppingCart, path: '/orders' },
      { name: 'キッチモニター', icon: faUtensils, path: '/kitchen' },
      { name: '設定', icon: faCog, path: '/settings' }
    ]
  },
  {
    category: 'テイクアウト',
    items: [
      { name: '注文', icon: faShoppingCart, path: '/takeout-orders' },
      { name: '設定', icon: faCog, path: '/takeout-settings' }
    ]
  },
  {
    category: '顧客管理',
    items: [
      { name: '顧客一覧', icon: faUsers, path: '/customers' },
      { name: 'メッセージ', icon: faEnvelope, path: '/messages' },
      { name: '顧客へ一斉送信', icon: faBullhorn, path: '/broadcast' },
      { name: '設定', icon: faCog, path: '/customer-settings' }
    ]
  },
  {
    category: '分析',
    items: [
      { name: '日報・月報', icon: faChartBar, path: '/sales' },
      { name: '売上分析', icon: faChartBar, path: '/analysis-detail' }
    ]
  }
];

const SideMenu: React.FC = () => {
  const primary = Object.AccentPrimary;
  const primaryLight = Surface.AccentPrimaryTint03;
  const location = useLocation();
  return (
    <div
      style={{
        width: SIDE_MENU_WIDTH,
        height: '100vh',
        background: Surface.Primary,
        borderRight: `1px solid ${Border.LowEmphasis}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      {/* レストラン名 */}
      <div
        style={{
          height: 64,
          background: Surface.Primary,
          color: Text.HighEmphasis,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          fontWeight: 'bold',
          fontSize: 20,
          letterSpacing: 2,
          borderBottom: `1px solid ${Border.LowEmphasis}`,
          padding: '0 16px',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: Surface.AccentPrimary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: Surface.Primary,
            fontWeight: 'bold',
            fontSize: 18,
            marginRight: 12,
          }}
        >
          サ
        </div>
        <span>サンプル食堂</span>
      </div>
      {/* メニューリスト - 階層構造 */}
      <div style={{ flex: 1, paddingTop: 16, overflowY: 'auto' }}>
        {menuItems.map((category, categoryIdx) => (
          <div key={`category-${categoryIdx}`}>
            {/* カテゴリ見出し */}
            <div
              style={{
                padding: '8px 16px',
                color: Text.LowEmphasis,
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginTop: categoryIdx > 0 ? '16px' : '0',
              }}
            >
              {category.category}
            </div>
            
            {/* サブカテゴリアイテム */}
            <div>
              {category.items.map((item, itemIdx) => {
                // パスの前方一致でアクティブ状態を判定
                // 例: /analysis-detail/period では /analysis-detail もアクティブになる
                const isActive = location.pathname === item.path ||
                                (item.path !== '/' && location.pathname.startsWith(`${item.path}/`));
                return (
                  <Link
                    to={item.path}
                    key={`item-${categoryIdx}-${itemIdx}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div
                      style={{
                        padding: '10px 16px 10px 24px',
                        color: isActive ? primary : Text.HighEmphasis,
                        background: isActive ? primaryLight : 'transparent',
                        borderRadius: 6,
                        margin: '4px 8px',
                        fontWeight: isActive ? 'bold' : 'normal',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <FontAwesomeIcon
                        icon={item.icon}
                        style={{
                          marginRight: '12px',
                          width: '16px',
                          color: isActive ? primary : Object.MediumEmphasis
                        }}
                      />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {/* カテゴリ区切り線 */}
            {categoryIdx < menuItems.length - 1 && (
              <div
                style={{
                  height: '1px',
                  background: Border.LowEmphasis,
                  margin: '16px 16px',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const location = useLocation();
  
  // パスに基づいてタイトルを決定
  let title = '売上分析';
  if (location.pathname === '/analysis-detail' || location.pathname.startsWith('/analysis-detail/')) {
    title = '売上分析詳細';
  }
  
  return (
    <div style={{
      height: 64,
      background: Surface.Primary,
      borderBottom: `1px solid ${Border.LowEmphasis}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', // 中央揃えに変更
      fontWeight: 'bold',
      fontSize: 22,
      color: Object.AccentPrimary, // 色を AccentPrimary に変更
      position: 'fixed',
      top: 0,
      left: SIDE_MENU_WIDTH,
      right: 0,
      zIndex: 90,
      boxSizing: 'border-box',
    }}>
      {title}
    </div>
  );
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    display: 'flex',
    minHeight: '100vh',
    background: Background.Default,
  }}>
    <SideMenu />
    <div style={{
      flex: 1,
      marginLeft: SIDE_MENU_WIDTH,
      background: Background.Default,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: `calc(100% - ${SIDE_MENU_WIDTH}px)`,
      position: 'relative',
    }}>
      <Header />
      <main style={{
        marginTop: 64,
        background: Background.Default,
        minHeight: 'calc(100vh - 64px)',
        padding: '16px',
        boxSizing: 'border-box',
        width: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}>
        {children}
      </main>
    </div>
  </div>
);

export default MainLayout; 