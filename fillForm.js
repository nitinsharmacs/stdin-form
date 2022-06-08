const {
  Form,
  FormInput,
  CombinedFormInput } = require("./form.js");

const {
  validateName,
  validateDob,
  validateHobbies,
  validatePhoneNumber
} = require('./validators.js');

const prompt = (text) => {
  console.log(text);
};

const fillForm = (form) => {
  process.stdin.setEncoding('utf8');

  let currentInput = form.currentInput();
  prompt(currentInput.getPrompt());

  process.stdin.on('data', (chunk) => {
    if (currentInput.addValue(chunk.trim())) {
      currentInput = form.nextInput();
    }

    if (form.hasFormCompleted()) {
      form.storeForm();
      prompt('Thank you');
      return;
    }

    prompt(currentInput.getPrompt());
  });
};

const parseHobbies = (hobbies) => {
  if (hobbies.length === 0) {
    return [];
  }
  return hobbies.split(',');
};

const addressParser = (addresses) => {
  return addresses.join('\n');
};

const identity = (x) => x;

const createForm = () => {
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
    new CombinedFormInput('address', combinedFormInputs, addressParser)
  ];

  return new Form(formInputs);
};

const main = () => {
  fillForm(createForm());
};

main();
