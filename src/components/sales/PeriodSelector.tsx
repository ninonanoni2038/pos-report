import React from 'react';
import { Surface, Text, Border, Object as ObjectColor } from '../../styles/semanticColors';
import { formatDate, formatYearMonth, getDateWithWeekdayColor } from '../../utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons/faChevronRight';
import { DisplayMode, DisplayModeLabel } from '../../types/displayMode';
import { TabButton as CommonTabButton } from '../common/tabs';

interface PeriodSelectorProps {
  displayMode: DisplayMode;
  currentDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onModeChange: (mode: DisplayMode) => void;
}

/**
 * PeriodSelector用のタブボタンコンポーネント
 * 共通のTabButtonコンポーネントをラップして、PeriodSelector用のスタイルを適用する
 */
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => {
  return (
    <div style={{ marginRight: 8 }}>
      <CommonTabButton
        isActive={active}
        onClick={onClick}
        label={children as string}
      />
    </div>
  );
};

/**
 * 期間選択コンポーネント
 * 日付の表示と前日/翌日への移動ボタンを提供する
 */
const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  displayMode,
  currentDate,
  onPrevDay,
  onNextDay,
  onToday,
  onPrevMonth,
  onNextMonth,
  onModeChange
}) => {
  // 現在有効なモードのみ表示（将来的に週報・年報を追加する可能性を考慮）
  const availableModes = [DisplayMode.DAILY, DisplayMode.MONTHLY];
  // 日付操作ハンドラ
  const handlePrev = () => {
    if (displayMode === DisplayMode.DAILY) {
      onPrevDay();
    } else if (displayMode === DisplayMode.MONTHLY && onPrevMonth) {
      onPrevMonth();
    }
  };

  const handleNext = () => {
    if (displayMode === DisplayMode.DAILY) {
      onNextDay();
    } else if (displayMode === DisplayMode.MONTHLY && onNextMonth) {
      onNextMonth();
    }
  };

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
      {/* タブUI */}
      <div style={{ display: 'flex', marginRight: 16 }}>
        {availableModes.map(mode => (
          <TabButton
            key={mode}
            active={displayMode === mode}
            onClick={() => onModeChange(mode)}
          >
            {DisplayModeLabel[mode]}
          </TabButton>
        ))}
      </div>

      <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center' }}>
        <button
          onClick={handlePrev}
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
          {displayMode === DisplayMode.DAILY ? (
            // 日報モード: 日付と曜日を表示
            (() => {
              const { dateText, weekdayText, weekdayColor } = getDateWithWeekdayColor(currentDate);
              return (
                <>
                  {dateText}
                  <span style={{ color: weekdayColor }}>{weekdayText}</span>
                </>
              );
            })()
          ) : (
            // 月報モード: 年月のみ表示
            formatYearMonth(currentDate)
          )}
        </div>
        <button
          onClick={handleNext}
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
      {displayMode === DisplayMode.DAILY && (
        <button
          onClick={onToday}
          style={{
            border: `1px solid ${Border.LowEmphasis}`,
            background: Surface.Primary,
            padding: '6px 12px',
            borderRadius: 4,
            cursor: 'pointer',
            color: Text.MediumEmphasis
          }}
        >
          今日
        </button>
      )}
    </div>
  );
};

export default PeriodSelector;