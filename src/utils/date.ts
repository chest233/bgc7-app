/**
 * 格式化日期为 YYYY-MM-DD 格式
 */
export function formatDate(date: Date | string | undefined | null): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 计算周数（周日为每周第一天）
 */
export function getWeekNumber(date: Date | string | undefined | null): { year: number; week: number } {
  if (!date) {
    // 默认返回当前日期的周数
    const now = new Date();
    return getWeekNumber(now);
  }
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  if (isNaN(d.getTime())) {
    const now = new Date();
    return getWeekNumber(now);
  }

  // 设置为当天的午夜，避免时区问题
  d.setHours(0, 0, 0, 0);

  // 获取当年1月1日
  const yearStart = new Date(d.getFullYear(), 0, 1);
  yearStart.setHours(0, 0, 0, 0);

  // 计算1月1日是周几（0=周日）
  const yearStartDay = yearStart.getDay();

  // 计算第一周的开始日期（包含1月1日的那个周日）
  const firstSunday = new Date(yearStart);
  firstSunday.setDate(yearStart.getDate() - yearStartDay);

  // 计算当前日期距离第一周开始的天数
  const diffTime = d.getTime() - firstSunday.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 计算周数
  let week = Math.floor(diffDays / 7) + 1;
  let year = d.getFullYear();

  // 处理跨年的情况
  if (week < 1) {
    // 属于上一年的最后一周
    year = d.getFullYear() - 1;
    const prevYearEnd = new Date(year, 11, 31);
    return getWeekNumber(prevYearEnd);
  }

  // 检查是否超过当年的周数
  const yearEnd = new Date(d.getFullYear(), 11, 31);
  const yearEndResult = getWeekNumberInternal(yearEnd);
  if (week > yearEndResult.week && d.getMonth() === 11) {
    // 可能属于下一年的第一周
    const nextYearStart = new Date(d.getFullYear() + 1, 0, 1);
    const nextYearStartDay = nextYearStart.getDay();
    if (d.getDay() >= nextYearStartDay || nextYearStartDay === 0) {
      // 属于下一年第一周
      year = d.getFullYear() + 1;
      week = 1;
    }
  }

  return { year, week };
}

function getWeekNumberInternal(date: Date): { year: number; week: number } {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const yearStart = new Date(d.getFullYear(), 0, 1);
  yearStart.setHours(0, 0, 0, 0);

  const yearStartDay = yearStart.getDay();
  const firstSunday = new Date(yearStart);
  firstSunday.setDate(yearStart.getDate() - yearStartDay);

  const diffTime = d.getTime() - firstSunday.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;

  return { year: d.getFullYear(), week };
}

/**
 * 格式化时间为 mm:ss 格式
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 格式化日期为中文格式
 */
export function formatChineseDate(date: Date | string | undefined | null): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 获取星期几的中文名称
 */
export function getWeekdayName(date: Date | string | undefined | null): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[d.getDay()];
}
