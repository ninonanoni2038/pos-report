import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ColorPaletteViewer from './pages/ColorPaletteViewer';
import MainLayout from './layouts/MainLayout';
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
              <Route path="/" element={<DummyTop />} />
              {/* 他のページをここに追加 */}
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
