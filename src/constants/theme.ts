import { scale, moderateScale } from '../utils/responsive';

// 主题配色 - 与 web 项目保持一致
export const colors = {
  // 主色调 - 马鞍棕/巧克力棕
  primary: '#8B4513',
  primaryLight: '#A0522D',
  primaryDark: '#654321',

  // 背景色
  background: '#FAF8F5',     // 页面背景（偏米黄色）
  surface: '#FFFFFF',        // 卡片背景
  section: '#F5F3F0',        // 分区背景

  // 文字颜色
  textPrimary: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  textOnPrimary: '#FFFFFF',

  // 边框和分割线
  border: '#E5E5E5',
  divider: '#F0F0F0',

  // 状态颜色
  success: '#52C41A',
  warning: '#FAAD14',
  error: '#FF4D4F',

  // Tab 颜色
  tabActive: '#8B4513',
  tabInactive: '#999999',

  // 标签颜色
  tagBackground: '#FDF5ED',
  tagText: '#8B4513',

  // 经文颜色
  scripture: '#8B4513',

  // 第三级文字颜色
  textTertiary: '#999999',
};

// 间距 - 使用 scale 等比缩放
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(24),
};

// 圆角 - 使用 moderateScale 缓和缩放
export const borderRadius = {
  sm: moderateScale(4),
  md: moderateScale(8),
  lg: moderateScale(12),
  xl: moderateScale(16),
  full: 9999,
};

// 字体大小 - 使用 moderateScale 缓和缩放，避免大屏字体过大
export const fontSize = {
  xs: moderateScale(11),
  sm: moderateScale(13),
  md: moderateScale(15),
  lg: moderateScale(17),
  xl: moderateScale(20),
  xxl: moderateScale(24),
};

// 字体权重
export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// 阴影 - 保持固定值
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
};

// 导出原始设计稿尺寸（供特殊情况使用）
export const rawSizes = {
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 },
  fontSize: { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 24 },
  borderRadius: { sm: 4, md: 8, lg: 12, xl: 16 },
};
