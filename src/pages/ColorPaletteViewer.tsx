import React from 'react';
import { PrimaryGold, Gray, WhiteAlpha, Red, Green, Orange, Blue } from '../styles/primitiveColors';
import { SemanticColors } from '../styles/semanticColors';

const colorSets = [
  { name: 'PrimaryGold', colors: PrimaryGold },
  { name: 'Gray', colors: Gray },
  { name: 'WhiteAlpha', colors: WhiteAlpha },
  { name: 'Red', colors: Red },
  { name: 'Green', colors: Green },
  { name: 'Orange', colors: Orange },
  { name: 'Blue', colors: Blue },
];

const tones = ['10','20','30','40','50','60','70','80','90','100'] as const;

const semanticSets = [
  { name: 'Text', colors: SemanticColors.Text },
  { name: 'Background', colors: SemanticColors.Background },
  { name: 'Surface', colors: SemanticColors.Surface },
  { name: 'Border', colors: SemanticColors.Border },
  { name: 'Object', colors: SemanticColors.Object },
];

// 共通カラースウォッチリストコンポーネント
const ColorSwatchList: React.FC<{
  title: string;
  colors: Record<string, string>;
}> = ({ title, colors }) => {
  const swatchWidth = 120;
  const swatchHeight = 80;
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, marginBottom: 12 }}>{title}</h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {Object.entries(colors).map(([key, value]) => (
          <div key={key} style={{ textAlign: 'center', marginBottom: 8 }}>
            <div style={{
              width: swatchWidth,
              height: swatchHeight,
              background: value,
              border: '1px solid #eee',
              borderRadius: 8,
              marginBottom: 8,
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }} />
            <div style={{ fontSize: 12, color: '#666', width: swatchWidth, overflowWrap: 'break-word' }}>{key}</div>
            <div style={{ fontSize: 12, width: swatchWidth, overflowWrap: 'break-word', textOverflow: 'ellipsis' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ColorPaletteViewer: React.FC = () => {
  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif', background: '#fafafa', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>Color Palette Viewer</h1>
	  <div style={{color: '#666', fontSize: 13, marginBottom: 32}}>
        ※このページは開発者向けのカラーパレット可視化用です。将来的にはStorybookでの表示を推奨。
      </div>
      {/* Primitive Color */}
	  <h2 style={{ fontSize: 24, marginBottom: 16 }}>Semantic Color Tokens</h2>
        <div style={{color: '#666', fontSize: 13, marginBottom: 32}}>
          Primitiveカラー一覧
        </div>
      {colorSets.map(set => (
        <ColorSwatchList key={set.name} title={set.name} colors={set.colors} />
      ))}
      {/* Semantic Color */}
      <div style={{ marginTop: 64, marginBottom: 24, borderTop: '2px dashed #ddd', paddingTop: 32 }}>
        <h2 style={{ fontSize: 24, marginBottom: 16 }}>Semantic Color Tokens</h2>
        <div style={{color: '#666', fontSize: 13, marginBottom: 32}}>
          Semanticカラー（意味ベースのカラートークン）一覧
        </div>
        {semanticSets.map(set => (
          <ColorSwatchList key={set.name} title={set.name} colors={set.colors} />
        ))}
      </div>
    </div>
  );
};

export default ColorPaletteViewer; 