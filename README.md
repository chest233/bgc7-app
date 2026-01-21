# BGC7 Church App

BGC7 教会移动应用，基于 React Native (Expo) 开发，与 Web 项目保持一致的 UI 风格。

## 技术栈

- **框架**: Expo SDK 54 + React Native 0.81
- **语言**: TypeScript
- **导航**: React Navigation 7 (Bottom Tabs + Native Stack)
- **状态**: React Hooks
- **存储**: AsyncStorage
- **图标**: @expo/vector-icons (Ionicons)

## 项目结构

```
src/
├── assets/              # 静态资源（图片等）
├── components/          # 可复用组件
│   ├── BannerCarousel.tsx    # 首页轮播图
│   └── index.ts
├── constants/           # 常量定义
│   ├── config.ts             # 应用配置（API地址等）
│   └── theme.ts              # 主题配置（颜色、间距、字体等）
├── hooks/               # 自定义 Hooks
├── navigation/          # 导航配置
│   ├── MainTabNavigator.tsx  # 底部 Tab 导航
│   ├── RootNavigator.tsx     # 根导航（Stack）
│   └── types.ts              # 导航类型定义
├── screens/             # 页面组件
│   ├── HomeScreen.tsx        # 首页（Banner + 讲道列表）
│   ├── DevotionScreen.tsx    # 早灵修
│   ├── MoreScreen.tsx        # 更多功能入口
│   ├── ProfileScreen.tsx     # 我的
│   ├── SermonsScreen.tsx     # 讲道列表
│   ├── SermonDetailScreen.tsx # 讲道详情
│   ├── BibleScreen.tsx       # 圣经阅读
│   ├── BibleReaderScreen.tsx # 圣经阅读器
│   ├── GalleryScreen.tsx     # 相册
│   └── DevotionDetailScreen.tsx # 灵修详情
├── services/            # API 服务
│   └── api.ts
├── types/               # TypeScript 类型
│   └── index.ts
└── utils/               # 工具函数
    └── responsive.ts         # 响应式适配工具
```

## 导航结构

```
RootNavigator (Stack)
├── MainTabs (Bottom Tab Navigator)
│   ├── 首页 (Home)          - 轮播图 + 讲道列表
│   ├── 早灵修 (Devotion)     - 今日灵修 + 祷告事项
│   ├── 更多 (More)          - 功能入口菜单
│   └── 我的 (Profile)       - 个人设置
│
└── Stack Screens
    ├── Sermons              - 讲道列表
    ├── SermonDetail         - 讲道详情
    ├── DevotionDetail       - 灵修详情
    ├── BibleReader          - 圣经阅读器
    └── Gallery              - 相册
```

## 响应式适配

项目采用基于设计稿的响应式适配方案：

### 设计原则

- **基准尺寸**: iPhone 14 (390 x 844)
- **间距/尺寸**: 使用 `scale()` 等比缩放
- **字体/圆角**: 使用 `moderateScale()` 缓和缩放（避免大屏字体过大）
- **垂直方向**: 使用 `verticalScale()` 适配不同高度

### 工具函数 (`src/utils/responsive.ts`)

```typescript
// 等比缩放（用于间距、宽度等）
scale(16)  // 在 iPhone 14 上返回 16，在更大屏幕上按比例增大

// 缓和缩放（用于字体、圆角，缩放幅度减半）
moderateScale(16)  // 缩放幅度更温和

// 垂直缩放（用于高度相关尺寸）
verticalScale(160)  // 根据屏幕高度比例缩放

// 设备判断
isSmallDevice()  // 宽度 < 375
isLargeDevice()  // 宽度 >= 414
isTablet()       // 平板设备
```

### 使用示例

```typescript
import { scale, moderateScale, verticalScale } from '../utils/responsive';
import { spacing, fontSize, borderRadius } from '../constants/theme';

// theme.ts 中已应用响应式
const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,           // scale(16)
    borderRadius: borderRadius.md, // moderateScale(8)
  },
  title: {
    fontSize: fontSize.xl,         // moderateScale(20)
  },
  banner: {
    height: verticalScale(160),    // 垂直方向适配
  },
});
```

## 主题配置

主题配置位于 `src/constants/theme.ts`，与 Web 项目保持一致：

- **主色调**: 马鞍棕 `#8B4513`
- **背景色**: 米黄色 `#FAF8F5`
- **文字色**: 深灰 `#333333`

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# iOS 模拟器
npm run ios

# Android 模拟器
npm run android
```

## 安全区域处理

- **Tab 页面**: 使用 `edges={['top']}`（底部由 TabBar 处理）
- **Stack 页面**: 使用 `edges={['bottom']}`（顶部由导航 Header 处理）

## API 配置

API 地址在 `src/constants/config.ts` 中配置：

```typescript
export const API_BASE_URL = 'https://api.bgc7.cn';
```

## 版本

- **当前版本**: 1.0.0
- **Expo SDK**: 54
- **React Native**: 0.81.5
