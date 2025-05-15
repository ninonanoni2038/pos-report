import React from 'react';
import { PrimaryGold, Gray, WhiteAlpha, Red, Green, Orange, Blue } from '../styles/primitiveColors';
import { Text, Border, Background } from '../styles/semanticColors';

const primitiveSets = [
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
  { name: 'Text', colors: require('../styles/semanticColors').Text },
  { name: 'Background', colors: require('../styles/semanticColors').Background },
  { name: 'Surface', colors: require('../styles/semanticColors').Surface },
  { name: 'Border', colors: require('../styles/semanticColors').Border },
  { name: 'Object', colors: require('../styles/semanticColors').Object },
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
      <h2 style={{ fontSize: 20, marginBottom: 12, color: Text.Primary }}>{title}</h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {Object.entries(colors).map(([key, value]) => (
          <div key={key} style={{ textAlign: 'center', marginBottom: 8, color: Text.Primary }}>
            <div style={{
              width: swatchWidth,
              height: swatchHeight,
              background: value,
              border: `1px solid ${Border.LowEmphasis}`,
              borderRadius: 8,
              marginBottom: 8,
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }} />
            <div style={{ fontSize: 12, color: Text.Secondary, width: swatchWidth, overflowWrap: 'break-word' }}>{key}</div>
            <div style={{ fontSize: 12, color: Text.Primary, width: swatchWidth, overflowWrap: 'break-word', textOverflow: 'ellipsis' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ColorPaletteViewer: React.FC = () => {
  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif', background: Background.Default, minHeight: '100vh' }}>
      <h1 style={{ fontSize: 32, marginBottom: 16, color: Text.Primary }}>Color Palette Viewer</h1>
	  <div style={{color: Text.Tertiary, fontSize: 13, marginBottom: 32}}>
        ※このページは開発者向けのカラーパレット可視化用です。将来的にはStorybookでの表示を推奨。
      </div>
      {/* Primitive Color */}
	  <h2 style={{ fontSize: 24, marginBottom: 16, color: Text.Primary }}>Semantic Color Tokens</h2>
        <div style={{color: Text.Tertiary, fontSize: 13, marginBottom: 32}}>
          Primitiveカラー一覧
        </div>
      {primitiveSets.map(set => (
        <ColorSwatchList key={set.name} title={set.name} colors={set.colors} />
      ))}
      {/* Semantic Color */}
      <div style={{ marginTop: 64, marginBottom: 24, borderTop: `2px dashed ${Border.LowEmphasis}`, paddingTop: 32 }}>
        <h2 style={{ fontSize: 24, marginBottom: 16, color: Text.Primary }}>Semantic Color Tokens</h2>
        <div style={{color: Text.Tertiary, fontSize: 13, marginBottom: 32}}>
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