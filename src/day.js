const isLeap = function (year) {
  if (year % 400 === 0) {
    return true;
  }
  if (year % 4 === 0) {
    return year % 100 !== 0;
  }
  return false;
};

const daysInMonth = function (date) {
  const { year, month } = date;
  let febDay = isLeap(year) ? 29 : 28;
  const months = [0, 31, febDay, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return months[month];
};

exports.daysInMonth = daysInMonth;
exports.isLeap = isLeap;
