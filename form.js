const fs = require('fs');
const { daysInMonth } = require('./day');

const writeInFile = (content, filename) => {
  try {
    fs.writeFileSync(filename, content, 'utf8');
    return true;
  } catch (err) {
    return false;
  }
};

class Form {
  #formInputs;
  #currentInputIndex;
  constructor(formInputs) {
    this.#formInputs = formInputs;
    this.#currentInputIndex = 0;
  }

  getFormData() {
    return this.#formInputs.reduce((formData, formInput) => {
      formData[formInput.name] = formInput.value;
      return formData;
    }, {});
  }

  nextInput() {
    return this.#formInputs[++this.#currentInputIndex];
  }

  currentInput() {
    return this.#formInputs[this.#currentInputIndex];
  }
}

class FormInput {
  #parser;
  #validator;
  constructor(name, label, parser, validator) {
    this.name = name;
    this.label = label;
    this.#parser = parser;
    this.#validator = validator;
  }

  addValue(text) {
    const value = this.#parser(text);
    if (this.#isValid(value)) {
      this.value = value;
      return true;
    }
    return false;
  }

  #isValid(value) {
    try {
      this.#validator(value);
      return true;
    } catch (err) {
      return false;
    }
  }
}

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

const validateDob = (dob) => {
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

const parseHobbies = (hobbies) => {
  if (hobbies.length === 0) {
    return [];
  }
  return hobbies.split(',');
};

const prompt = (text) => {
  console.log(text);
};

const fillForm = (form) => {
  process.stdin.setEncoding('utf8');

  let currentInput = form.currentInput();
  prompt(currentInput.label);

  process.stdin.on('data', (chunk) => {
    if (currentInput.addValue(chunk.trim())) {
      currentInput = form.nextInput();
    }

    if (currentInput) {
      prompt(currentInput.label);
    }
  });

  process.stdin.on('end', () => {
    const formData = form.getFormData();
    const content = JSON.stringify(formData);
    writeInFile(content, 'form-data.json');
    prompt('Thank you');
  });
};

const identity = (x) => x;

const main = () => {
  const formInputs = [
    new FormInput('name', 'Please enter your name :', identity, validateName),
    new FormInput(
      'dob', 'Please enter you dob(yyyy-mm-dd) :', identity, validateDob
    ),
    new FormInput(
      'hobbies',
      'Please enter your hobbies separated by commans :',
      parseHobbies,
      validateHobbies
    ),
  ]
  const form = new Form(formInputs);
  fillForm(form);
};

main();
