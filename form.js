const fs = require('fs');

class Form {
  #formData;
  #formInputs;
  constructor(formInputs) {
    this.#formInputs = formInputs;
    this.#formData = {};
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

  getFormInputs() {
    return this.#formInputs.map(({ name, label }) => ({ name, label }));
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

  const formInputs = form.getFormInputs();
  let currentInputIndex = 0;

  prompt(formInputs[currentInputIndex].label);

  process.stdin.on('data', (chunk) => {
    form.add(formInputs[currentInputIndex].name, chunk.trim());

    currentInputIndex++;
    if (currentInputIndex < formInputs.length) {
      prompt(formInputs[currentInputIndex].label);
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
