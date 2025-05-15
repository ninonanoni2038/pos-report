import { PrimaryGold, Gray, Red, Green, Orange, Blue, WhiteAlpha } from './primitiveColors';

export const SemanticColors = {
  // 1. Text 系
  Text: {
    Primary: Gray[80],
    Secondary: Gray[70],
    Tertiary: Gray[60],
    Disabled: Gray[50],
    Link: Blue[60],
    // OnBrand: WhiteAlpha[100],
    Danger: Red[60],
    Success: Green[60],
    Warning: Orange[60],
  },
  // 2. Background 系
  Background: {
    Default: Gray[10],
    // Alt: Gray[10],
    // BrandSubtle: PrimaryGold[20],
    // BrandStrong: PrimaryGold[60],
    // DangerSubtle: Red[10],
    // SuccessSubtle: Green[10],
    // WarningSubtle: Orange[10],
  },
  // 3. Surface 系
  Surface: {
    Primary: WhiteAlpha[100],
    Secondary: Gray[10],
	Teritary: Gray[20],
    AccentPrimary: PrimaryGold[60],
  },
  // 4. Border / Divider 系
  Border: {
    HighEmphasis: Gray[60],
	MediumEmphasis: Gray[40],
    LowEmphasis: Gray[20],
    AccentPrimary: PrimaryGold[60],
	HighEmphasisonInverse: WhiteAlpha[100],
    Danger: Red[60],
    // Success: Green[60],
    // Warning: Orange[60],
  },
  // 5. Object 系
  Object: {
	HighEmphasis: Gray[80],
	MediumEmphasis: Gray[50],
    LowEmphasis: Gray[40],
	Disable: Gray[30],
    AccentPrimary: PrimaryGold[60],
    Danger: Red[60],
    Success: Green[60],
    Info: Blue[60],
    Warning: Orange[60],
  },
};
