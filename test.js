function calculateDaysBetweenDates(begin, end) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const millisBetween = end - begin;
  const days = millisBetween / millisecondsPerDay;

  return Math.floor(days);
}
