import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ColorPaletteViewer from './pages/ColorPaletteViewer';
import SalesAnalysisPage from './pages/SalesAnalysisPage';
import SalesAnalysisDetailLayout from './pages/SalesAnalysisDetailLayout';
import SalesByPeriodPage from './pages/SalesByPeriodPage';
import SalesByProductPage from './pages/SalesByProductPage';
import SalesByPaymentMethodPage from './pages/SalesByPaymentMethodPage';
import MainLayout from './layouts/MainLayout';
import { SalesAnalysisProvider } from './contexts/SalesAnalysisContext';
import './App.css';

// 仮のトップページ（今後Dashboardなどに差し替え可）
const DummyTop: React.FC = () => <div style={{ padding: 32 }}>ここにメインコンテンツが入ります</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dev/colors" element={<ColorPaletteViewer />} />
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<SalesAnalysisPage />} />
              <Route path="/sales" element={<SalesAnalysisPage />} />
              
              {/* 売上分析詳細ページのルート */}
              <Route path="/analysis-detail" element={
                <SalesAnalysisProvider>
                  <SalesAnalysisDetailLayout />
                </SalesAnalysisProvider>
              }>
                <Route index element={<Navigate to="period" />} />
                <Route path="period" element={<SalesByPeriodPage />} />
                <Route path="product" element={<SalesByProductPage />} />
                <Route path="payment" element={<SalesByPaymentMethodPage />} />
              </Route>
              
              {/* 他のページをここに追加 */}
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
