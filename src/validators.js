const { daysInMonth } = require('./day');

const isPhoneNumber = (text) => /^\d{10}$/.test(text);
const isValidDate = (text) => /^\d{4}-\d{2}-\d{2}$/.test(text);

const parseDate = (date) => {
  const [year, month, day] = date.split('-');
  return {
    year: +year,
    month: +month,
    day: +day
  };
};

const validateName = (name) => {
  if (name.length < 5) {
    throw new Error('Invalid name');
  }
};

const validateYear = (date) => {
  const { year } = date;
  if (year.length === 0) {
    throw new Error('Invalid year');
  }
};

const validateMonth = (date) => {
  const { month } = date;
  if (month > 12 || month < 1) {
    throw new Error('Invalid month');
  }
};

const validateDay = (date) => {
  const { day } = date;
  if (day > daysInMonth(date) || day < 1) {
    throw new Error('Invalid day');
  }
};

const validateDateFormate = (date) => {
  if (isValidDate(date)) {
    return;
  }
  throw new Error('Invalid date formate');
};

const validateDob = (dob) => {
  validateDateFormate(dob);

  const date = parseDate(dob);
  validateYear(date);
  validateMonth(date);
  validateDay(date);
};

const validateHobbies = (hobbies) => {
  if (hobbies.length === 0) {
    throw new Error('No hobby found');
  }
};

const validatePhoneNumber = (phoneNumber) => {
  if (isPhoneNumber(phoneNumber)) {
    return;
  }
  throw new Error('Invalid phone number');
};

exports.validateName = validateName;
exports.validateDob = validateDob;
exports.validateHobbies = validateHobbies;
exports.validatePhoneNumber = validatePhoneNumber;
