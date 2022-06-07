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
      formData[formInput.name] = formInput.value();
      return formData;
    }, {});
  }

  nextInput() {
    const flatInputs = this.#flatInputs();
    return flatInputs[++this.#currentInputIndex];
  }

  currentInput() {
    const flatInputs = this.#flatInputs();
    return flatInputs[this.#currentInputIndex];
  }

  #flatInputs() {
    return this.#formInputs.flatMap(input =>
      input.combined ? input.inputs : input);
  }

  hasFormCompleted() {
    return this.#currentInputIndex >= this.#flatInputs().length;
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
  #value;
  constructor(name, label, parser, validator) {
    this.name = name;
    this.label = label;
    this.#parser = parser;
    this.#validator = validator;
  }

  addValue(text) {
    const value = this.#parser(text);
    if (this.#isValid(value)) {
      this.#value = value;
      return true;
    }
    return false;
  }

  value() {
    return this.#value;
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

class CombinedFormInput {
  constructor(name, formInputs) {
    this.name = name;
    this.inputs = formInputs;
    this.combined = true;
  }

  value() {
    return this.inputs.map(input => input.value()).join('\n');
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

    if (form.hasFormCompleted()) {
      form.storeForm();
      prompt('Thank you');
      return;
    }

    prompt(currentInput.label);
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
  const combinedFormInputs = [
    new FormInput(
      'address',
      'Please enter address line 1 :',
      identity,
      identity
    ),
    new FormInput(
      'address',
      'Please enter address line 2 :',
      identity,
      identity
    ),
  ];

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
    new CombinedFormInput('address', combinedFormInputs)
  ];

  const form = new Form(formInputs);
  fillForm(form);
};

main();
