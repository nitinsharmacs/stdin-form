const fs = require('fs');
const {
  validateName,
  validateDob,
  validateHobbies,
  validatePhoneNumber
} = require('./validators.js');

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

  #getFormData() {
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

  hasFormCompleted() {
    return this.#currentInputIndex >= this.#formInputs.length;
  }

  storeForm() {
    const formData = this.#getFormData();
    const content = JSON.stringify(formData);
    writeInFile(content, 'form-data.json');
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

    if (form.hasFormCompleted()) {
      form.storeForm();
      prompt('Thank you');
    }
  });
};

const parseHobbies = (hobbies) => {
  if (hobbies.length === 0) {
    return [];
  }
  return hobbies.split(',');
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
    new FormInput(
      'ph_no',
      'Please enter your phone number :',
      identity,
      validatePhoneNumber
    ),
  ]

  const form = new Form(formInputs);
  fillForm(form);
};

main();
