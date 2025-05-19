import { PrimaryGold, Gray, Red, Green, Orange, Blue, WhiteAlpha } from './primitiveColors';

// 1. Text 系
export const Text = {
  HighEmphasis: Gray[80],
  MediumEmphasis: Gray[70],
  LowEmphasis: Gray[60],
  Disabled: Gray[50],
  AccentPrimary: PrimaryGold[60],
  Link: Blue[60],
  // OnBrand: WhiteAlpha[100],
  Danger: Red[60],
  Success: Green[60],
  Warning: Orange[60],
};
// 2. Background 系
export const Background = {
  Default: Gray[10],
  // Alt: Gray[10],
  // BrandSubtle: PrimaryGold[20],
  // BrandStrong: PrimaryGold[60],
  // DangerSubtle: Red[10],
  // SuccessSubtle: Green[10],
  // WarningSubtle: Orange[10],
};
// 3. Surface 系
export const Surface = {
  Primary: WhiteAlpha[100],
  Secondary: Gray[10],
  Tertiary: Gray[20],
  AccentPrimary: PrimaryGold[60],
  AccentPrimaryTint01: PrimaryGold[30],
  AccentPrimaryTint02: PrimaryGold[20],
  AccentPrimaryTint03: PrimaryGold[10],
};
// 4. Border / Divider 系
export const Border = {
  HighEmphasis: Gray[60],
  MediumEmphasis: Gray[40],
  LowEmphasis: Gray[20],
  AccentPrimary: PrimaryGold[60],
  HighEmphasisonInverse: WhiteAlpha[100],
  Danger: Red[60],
  // Success: Green[60],
  // Warning: Orange[60],
};
// 5. Object 系
export const Object = {
  HighEmphasis: Gray[80],
  MediumEmphasis: Gray[50],
  LowEmphasis: Gray[40],
  Disable: Gray[30],
  AccentPrimary: PrimaryGold[60],
  AccentSecondary: PrimaryGold[50],
  AccentTertiary: PrimaryGold[40],
  Danger: Red[60],
  Success: Green[60],
  Info: Blue[60],
  Warning: Orange[60],
};

export const SemanticColors = {
  Text,
  Background,
  Surface,
  Border,
  Object,
};
