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
      const { name, value } = formInput.getEntry();
      formData[name] = value;
      return formData;
    }, {});
  }

  fill(response) {
    const input = this.currentInput();
    input.addValue(response);
    if (input.isFilled()) {
      ++this.#currentInputIndex;
    }
  }

  currentInput() {
    return this.#formInputs[this.#currentInputIndex];
  }

  hasFormCompleted() {
    return this.#currentInputIndex >= this.#formInputs.length;
  }

  getPrompt() {
    return this.currentInput().getPrompt();
  }

  storeForm() {
    const formData = this.#getFormData();
    const content = JSON.stringify(formData);
    writeInFile(content, 'form-data.json');
  }
}

class FormInput {
  #name;
  #label;
  #value;
  #parser;
  #validator;
  constructor(name, label, parser, validator) {
    this.#name = name;
    this.#label = label;
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

  getEntry() {
    return { name: this.#name, value: this.#parser(this.#value) };
  }

  getPrompt() {
    return this.#label;
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
  #name;
  #parser;
  #inputs;
  #currentInputIndex;
  constructor(name, formInputs, parser) {
    this.#name = name;
    this.#inputs = formInputs;
    this.#parser = parser;
    this.#currentInputIndex = 0;
  }

  addValue(text) {
    const currentInput = this.#inputs[this.#currentInputIndex];
    if (currentInput.addValue(text)) {
      ++this.#currentInputIndex;
      return true;
    }
    return false;
  }

  getEntry() {
    const inputsValues = this.#inputs.map(input => input.getEntry().value);
    return { name: this.#name, value: this.#parser(inputsValues) };
  }

  getPrompt() {
    return this.#inputs[this.#currentInputIndex].getPrompt();
  }

  isFilled() {
    return this.#inputs.every(input => input.isFilled());
  }
}

exports.FormInput = FormInput;
exports.CombinedFormInput = CombinedFormInput;
exports.Form = Form;
