const fs = require('fs');

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
    const currentInput = this.currentInput();
    if (currentInput.isFilled()) {
      return this.#formInputs[++this.#currentInputIndex];
    }
    return currentInput;
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
  #value;
  constructor(name, label, parser, validator) {
    this.name = name;
    this.label = label;
    this.#parser = parser;
    this.#validator = validator;
    this.#value = null;
  }

  addValue(text) {
    const value = text;
    if (this.#isValid(value)) {
      this.#value = value;
      return true;
    }
    return false;
  }

  isFilled() {
    return this.#value !== null;
  }

  value() {
    return this.#parser(this.#value);
  }

  getPrompt() {
    return this.label;
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
  #parser;
  #currentInputIndex;
  constructor(name, formInputs, parser) {
    this.name = name;
    this.inputs = formInputs;
    this.#parser = parser;
    this.#currentInputIndex = 0;
  }

  addValue(text) {
    const currentInput = this.inputs[this.#currentInputIndex];
    if (currentInput.addValue(text)) {
      ++this.#currentInputIndex;
      return true;
    }
    return false;
  }

  value() {
    const inputsValues = this.inputs.map(input => input.value());
    return this.#parser(inputsValues);
  }

  getPrompt() {
    return this.inputs[this.#currentInputIndex].getPrompt();
  }

  isFilled() {
    return this.inputs.every(input => input.isFilled());
  }
}

exports.FormInput = FormInput;
exports.CombinedFormInput = CombinedFormInput;
exports.Form = Form;
