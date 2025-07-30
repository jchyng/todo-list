/** 달력 시작 날짜 */
export function getCalendarFirstDate(date) {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const calendarStart = new Date(startOfMonth);
  calendarStart.setDate(calendarStart.getDate() - startOfMonth.getDay());
  return calendarStart;
}

/** 달력 마지막 날짜 */
export function getCalendarLastDate(date) {
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const calendarEnd = new Date(endOfMonth);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - endOfMonth.getDay()));
  return calendarEnd;
}

/** 달력 시작일과 종료일을 기준으로 날짜 배열 생성 */
export function getCalendarDaysInRange(startDate, endDate) {
  const days = [];
  const date = new Date(startDate);
  while (date <= endDate) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

/** 현재 날짜를 기준으로 달력에 표시할 날짜 배열 생성 */
export function getCalendarDays(date) {
  const startDate = getCalendarFirstDate(date);
  const endDate = getCalendarLastDate(date);
  return getCalendarDaysInRange(startDate, endDate);
}

/** 이전 달의 첫 번째 날짜 */
export function getPrevMonthDate(date) {
  const prevMonth = new Date(date);
  prevMonth.setMonth(prevMonth.getMonth() - 1);
  return prevMonth;
}

/** 다음 달의 첫 번째 날짜 */
export function getNextMonthDate(date) {
  const nextMonth = new Date(date);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  return nextMonth;
}
