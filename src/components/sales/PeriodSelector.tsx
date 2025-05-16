import React from 'react';
import { Surface, Text, Border, Object as ObjectColor } from '../../styles/semanticColors';
import { formatDate, getDateWithWeekdayColor } from '../../utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons/faChevronRight';

interface PeriodSelectorProps {
  currentDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

/**
 * 期間選択コンポーネント
 * 日付の表示と前日/翌日への移動ボタンを提供する
 */
const PeriodSelector: React.FC<PeriodSelectorProps> = ({ 
  currentDate, 
  onPrevDay, 
  onNextDay, 
  onToday 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: 24,
      background: Surface.Primary,
      padding: '12px 16px',
      borderRadius: 8,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center' }}>
        <span style={{ color: Text.Secondary, marginRight: 8 }}>日報</span>
        <button
          onClick={onPrevDay}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: ObjectColor.AccentPrimary,
            padding: '0 8px'
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </button>
        <div style={{
          padding: '6px 16px',
          border: `1px solid ${Border.LowEmphasis}`,
          borderRadius: 4,
          margin: '0 8px',
          fontWeight: 'bold',
          width: '180px',  // 固定幅を設定
          textAlign: 'center', // テキストを中央揃え
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {(() => {
            const { dateText, weekdayText, weekdayColor } = getDateWithWeekdayColor(currentDate);
            return (
              <>
                {dateText}
                <span style={{ color: weekdayColor }}>{weekdayText}</span>
              </>
            );
          })()}
        </div>
        <button
          onClick={onNextDay}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: ObjectColor.AccentPrimary,
            padding: '0 8px'
          }}
        >
          <FontAwesomeIcon icon={faChevronRight} size="lg" />
        </button>
      </div>
      <button 
        onClick={onToday}
        style={{
          border: `1px solid ${Border.LowEmphasis}`,
          background: Surface.Primary,
          padding: '6px 12px',
          borderRadius: 4,
          cursor: 'pointer',
          color: Text.Secondary
        }}
      >
        今日
      </button>
    </div>
  );
};

export default PeriodSelector;