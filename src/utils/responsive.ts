import { Dimensions, PixelRatio, Platform } from 'react-native';

// 设计稿基准宽度（iPhone 14 / iPhone 13 / iPhone 12）
const DESIGN_WIDTH = 390;
// 设计稿基准高度
const DESIGN_HEIGHT = 844;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 宽度缩放比例
const widthScale = SCREEN_WIDTH / DESIGN_WIDTH;
// 高度缩放比例
const heightScale = SCREEN_HEIGHT / DESIGN_HEIGHT;

/**
 * 根据设计稿宽度缩放（用于水平方向的尺寸、字体大小）
 * @param size 设计稿上的尺寸
 */
export function scale(size: number): number {
  return Math.round(size * widthScale);
}

/**
 * 根据设计稿高度缩放（用于垂直方向的尺寸）
 * @param size 设计稿上的尺寸
 */
export function verticalScale(size: number): number {
  return Math.round(size * heightScale);
}

/**
 * 中等缩放（字体推荐使用，缩放幅度较小，避免字体过大或过小）
 * @param size 设计稿上的尺寸
 * @param factor 缩放因子，默认 0.5（即只缩放差值的一半）
 */
export function moderateScale(size: number, factor: number = 0.5): number {
  return Math.round(size + (scale(size) - size) * factor);
}

/**
 * 字体缩放（考虑系统字体缩放设置）
 * @param size 设计稿上的字体大小
 */
export function fontScale(size: number): number {
  const scaledSize = moderateScale(size, 0.3);
  // 限制最小和最大字体
  const minSize = size * 0.8;
  const maxSize = size * 1.3;
  return Math.round(Math.min(Math.max(scaledSize, minSize), maxSize));
}

/**
 * 判断是否为小屏设备（宽度 < 375）
 */
export function isSmallDevice(): boolean {
  return SCREEN_WIDTH < 375;
}

/**
 * 判断是否为大屏设备（宽度 >= 414，如 Plus/Max 系列或 iPad）
 */
export function isLargeDevice(): boolean {
  return SCREEN_WIDTH >= 414;
}

/**
 * 判断是否为平板
 */
export function isTablet(): boolean {
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  // 平板的宽高比通常小于 1.6
  return SCREEN_WIDTH >= 600 || (aspectRatio < 1.6 && SCREEN_WIDTH >= 500);
}

/**
 * 获取屏幕信息
 */
export function getScreenInfo() {
  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    widthScale,
    heightScale,
    isSmall: isSmallDevice(),
    isLarge: isLargeDevice(),
    isTablet: isTablet(),
    pixelRatio: PixelRatio.get(),
    platform: Platform.OS,
  };
}

// 导出屏幕尺寸常量
export { SCREEN_WIDTH, SCREEN_HEIGHT, DESIGN_WIDTH, DESIGN_HEIGHT };
