const fs = require('fs');

class Form {
  #formData;
  #formInputs;
  #currentInputIndex;
  constructor(formInputs) {
    this.#formInputs = formInputs;
    this.#formData = {};
    this.#currentInputIndex = 0;
  }

  add(name, value) {
    const input = this.#formInputs.find(input => input.name === name);
    if (input) {
      this.#formData[name] = input.get(value);
    }
  }

  storeInFile(filename) {
    const content = JSON.stringify(this.#formData);
    try {
      fs.writeFileSync(filename, content, 'utf8');
      return true;
    } catch (err) {
      return false;
    }
  }

  nextField() {
    return this.#formInputs[++this.#currentInputIndex];
  }

  currentInput() {
    return this.#formInputs[this.#currentInputIndex];
  }

  print() {
    console.log(this.#formData);
  }
}

const parseHobbies = (hobbies) => {
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
    form.add(currentInput.name, chunk.trim());
    currentInput = form.nextField();
    if (currentInput) {
      prompt(currentInput.label);
    }
  });

  process.stdin.on('end', () => {
    form.storeInFile('form-data.json');
    prompt('Thank you');
  });
};

const main = () => {
  const formInputs = [
    {
      name: 'name',
      label: 'Please enter your name :',
      get: (x) => x
    },
    {
      name: 'dob',
      label: 'Please enter you dob(yyyy-mm-dd) :',
      get: (x) => x
    },
    {
      name: 'hobbies',
      label: 'Please enter your hobbies separated by commans :',
      get: parseHobbies
    }
  ];
  const form = new Form(formInputs);
  fillForm(form);
};

main();
