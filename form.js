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
    const flatInputs = this.#flatInputs();
    return flatInputs[++this.#currentInputIndex];
  }

  currentInput() {
    const flatInputs = this.#flatInputs();
    return flatInputs[this.#currentInputIndex];
  }

  #flatInputs() {
    return this.#formInputs.flatMap(input => input.combined ? input.inputs : input);
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

exports.FormInput = FormInput;
exports.CombinedFormInput = CombinedFormInput;
exports.Form = Form;
