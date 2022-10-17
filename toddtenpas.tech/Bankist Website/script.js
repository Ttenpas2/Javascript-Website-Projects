'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const eurToUsd = 1.1;

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  //.slice makes a copy of the movements array so the original does not get sorted
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const deposit = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${deposit}€`;
  const withdrawls = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(withdrawls)}€`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${Math.abs(interest)}€`;
};
// calcDisplaySummary(account1.movements);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(value => value[0])
      .join('');
  });
};
createUsernames(accounts);
// console.log(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display Balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//EVENT HANDLERS
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //this prevents the auto reloading of the website on a button being clicked
  e.preventDefault();
  // console.log('LOGIN');

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //clear username and pin
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    // //Display movements
    // displayMovements(currentAccount.movements);
    // //Display Balance
    // calcDisplayBalance(currentAccount);
    // //Display summary
    // calcDisplaySummary(currentAccount);

    //refactoring all into one function
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);

  const recieverAcount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, recieverAcount);
  inputTransferAmount.value = inputTransferTo.value = '';
  // console.log(labelBalance.textContent);
  if (
    amount > 0 &&
    recieverAcount &&
    currentAccount.balance > amount &&
    currentAccount.username !== recieverAcount?.username
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    recieverAcount.movements.push(amount);
    //update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  //only approve loan if ine deposite equals 10% of the lean amount
  const loan = Number(inputLoanAmount.value);

  if (loan > 0 && currentAccount.movements.some(mov => mov >= loan * 0.1)) {
    // console.log('approved');
    //Add positive movement to UI
    currentAccount.movements.push(loan);

    //Update UI
    updateUI(currentAccount);
    //clear input feild
    inputLoanAmount.value = '';
  }
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount?.pin === Number(inputClosePin.value) &&
    currentAccount?.username === inputCloseUsername.value
  ) {
    // console.log('delete');
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    //Delete account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
//DATA TRANSFORMATIONS
//MAP......FILTER.......REDUCE.....
//MAP runs a function on each array and makes a new array
//FILTER runs a test and only those that are true will get added into a new array
//REDUCE takes all the values in an array and adds them together to create one single value-- no now array, just a returned value
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd ', 'e'];

// //'.slice' and its uses-- makes a copy and returns a new array
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// //gets last element of array
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));

// //shallow copy
// console.log(arr.slice());
// console.log(...arr);

// //".splice" --deletes items from an array and mutates the original array-- starts from the indec and removes the rest of the array
// // console.log(arr.splice(2));
// console.log(arr.splice(-1));
// //removes the last element of an array
// console.log(arr.splice(1, 2));
// //this deletes elements from i=1 and take only 2 elements

// console.log(arr);

// arr = ['a', 'b', 'c', 'd ', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// //REVERSE
// //'.reverse' --- mutates the original array
// console.log(arr2.reverse());
// console.log(arr2);

// //'.concat'- joins 2 arrays together
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// //JOIN
// console.log(letters.join('-'));

// const arr = [23, 11, 64];
// console.log(arr[0]);

// //'AT' ---Method--- useful for last element of array
// console.log(arr.at(0));

// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// //-1 get the last element of an array
// console.log(arr.at(-1));

// //the '.at' method works on strings too
// console.log('jonas'.at(-1));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// //the for each method requires a function and passes in the value of the array each time it cycles trhough
// //the 'forEach' method return more than just the current value, it actually return the VALUE 1st, the INDEX 2nd, and the entire ARRAY 3rd
// console.log('-------FOR EACH -----');
// movements.forEach(function (movement, index, array) {
//   movement > 0
//     ? console.log(`Movement ${index}: You deposited ${movement}`)
//     : console.log(`Movement ${index}: You withdrew ${Math.abs(movement)}`);
// });
// // 0: function (200)
// // 1: function (450)
// // 2: function (400)

// ///WHEN TO USE???.... fi you need to break out a loop you will have to use the FOR OF loop...the FOREACH loop can not exit the loop

// //FOREACH with MAPS and SETS
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// const currenciesUnique = new Set(['USD', 'GAP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);

// //in a SET the Key is the same as the Value because there are no indexes in an SET
// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

// const movementsUSD = movements.map(mov => Math.round(mov * eurToUsd));
// console.log(movements);
// console.log(movementsUSD);

// //for loop same solution
// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(Math.round(mov * eurToUsd));

// console.log(movementsUSDfor);

// //Map Solution-----
// const movementsDescription = movements.map(
//   (mov, i, arr) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`

//   // mov > 0
//   //   ? `Movement ${i + 1}: You deposited ${mov}`
//   //   : `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`
// );

// console.log(movementsDescription);

// //THE FILTER METHOD---- USES a CAllBACK FUNCTION
// const deposits = account1.movements.filter(mov => mov > 0);

// console.log(account1.movements);
// console.log(deposits);

// const withdrawls = account1.movements.filter(mov => mov < 0);

// console.log(account1.movements);
// console.log(withdrawls);

// console.log(movements);

// //in the REDUCE method the first value is a function which takes in 4 values, the accumilator(or snowball), the current value, the index, and the entire array...... the second value is what number to start counting from.
// // const balance = movements.reduce(function (acc, cur, i, arr) {
// //   console.log(`Iterator ${i}: ${acc}`);
// //   return acc + cur;
// // }, 0);
// const balance = movements.reduce((acc, cur) => acc + cur, 0);

// console.log(balance);

//MAXIMUM VALUE OF THE ARRAY
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const max = movements.reduce(
//   (acc, cur) => (acc < cur ? cur : acc),
//   movements[0]
// );

// console.log(max);

//THE POWER OF CHAINING METHODS TOGETHER

// //PIPELINE OF METHODSCHAIN
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;
// const totalDeposits = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov);

// console.log(totalDeposits);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// ///THE FIND METHOD!!____retrieves and element of the array....so just a value... usually the FIRST element that meets the requirement
// const firstWithddrawl = movements.find(mov => mov < 0);
// console.log(firstWithddrawl);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// const acc = [];
// for (const ac of accounts) {
//   if (ac.owner === 'Jessica Davis') {
//     console.log(ac);
//   }
// }

// //SOME and EVERY methods
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements);

// //checks for equality
// console.log(movements.includes(-130));

// //Checks for a condition
// const anyDeposits = movements.some(mov => mov > 1500);
// console.log(anyDeposits);

//EVERY METHOD
// console.log(movements.every(mov => mov > 0));

// //Seperate callback---- saving the common function in a variable to be called back more easily
// const deposit = mov => mov > 0;

// console.log(movements.every(deposit));
// console.log(account4.movements.every(deposit));

//FLAT and FLATMAP methods
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];

// //FLAT--- removed nested arrays and return a single array
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// //flat method only goes one layer deep with nested arrays and does not split up or flaten deep nested arrays
// console.log(arrDeep.flat());

// //By adding a number you can specify how deep to go into nested arrays
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);

// const allMovement = accountMovements.flat();
// console.log(allMovement);

// const overallBalance = allMovement.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

//Shorter way with Chainging
//FLAT method
// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// //FLATMAP method
// const overalBalance = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

//SORTING ARRAYS
// const owners = ['jonas', 'zack', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// //.sort only works with strings
// console.log(movements.sort());
// console.log(movements);

// //needs a callback  function to sort numbers
// //return < 0 A,B----keep order
// //return > 0 B,A----switch order

// console.log(
//   movements.sort((a, b) => {
//     if (a > b) {
//       return 1;
//     } else if (a < b) {
//       return -1;
//     }
//   })
// );
// //reverse order sorting--
// console.log(
//   movements.sort((a, b) => {
//     if (a > b) {
//       return -1;
//     } else if (a < b) {
//       return 1;
//     }
//   })
// );
// //Even Shorter COde usinng basic math--- the math with return a positive number or a negative number based on the size of the number
// console.log(movements.sort((a, b) => a - b));

//MORE WAYS TO FILL AND CREATE ARRAYS PROGRAMATICALLY
// console.log([1, 2, 3, 4, 5, 6, 7]);
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// //when passing in a single value to the new Array method we actually create and empty array of that length
// const x = new Array(7);
// console.log(x);

// //the FILL methos can fill up an empty aray with a value
// console.log(x.fill(3));
// //can shose the start and end positions to fill from
// console.log(x.fill(1, 2, 5));

// //Array.from method
// //filling with a value
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);
// //doing math in my function to fill values
// const z = Array.from({ length: 7 }, (cur, i) => i + 1);
// console.log(z);

// //coding challeng to make an array with 100 random dice rolls
// // const randomDice = Array.from({ length: 100 }, (cur, i) =>
// //   Math.round(Math.random(6) * 5 + 1)
// // );
// // console.log(z);
// // console.log(randomDice);

// //getting values from UI and doing math on them

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements_value'),
//     el => Number(el.textContent.replace('€', ''))
//   );

//   console.log(movementsUI);
// });

// //ARRAY METHOD PRACTICE

// //#1- total deposites
// const bankDepositSum = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .filter(mov => mov > 0)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(bankDepositSum);

// //#2- number of deposites over 1000
// // const numDeposites1000 = accounts
// //   .flatMap(acc => acc.movements)
// //   .filter(mov => mov >= 1000).length;

// // const numDeposites1000 = accounts
// //   .flatMap(acc => acc.movements)
// //   .reduce((count, mov) => (mov >= 1000 ? count + 1 : count), 0);
// //you can use reduce to counnt elements in an array
// const numDeposites1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, mov) => (mov >= 1000 ? count + 1 : count), 0);
// //could us ++count and this would increment the counter and return the changed value instead of returning the previous value and then incrementing the count which is what happens twhen the ++ is after the counter
// console.log(numDeposites1000);

// //#3 - create a new object with the reduce method
// const { deposites, withdrawls } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur >= 0 ? (sums.deposites += cur) : (sums.withdrawls += cur);
//       sums[cur >= 0 ? 'deposites' : 'withdrawls'] += cur;
//       return sums;
//     },
//     { deposites: 0, withdrawls: 0 }
//   );
// console.log(deposites, withdrawls);

// // #4) convert a string to a capital letter for frist letter
// // this is a nice title = This Is a Nice Title
// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];
//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(titleCase);
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('this is a LONG title with and EXAMPLE'));
