"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};
const createUsername = function (accts) {
  accts.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsername(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  //Display Balance
  calcDisplayBalance(acc);
  // DIsplay Summary
  calcDisplaySummary(acc);
};

let currentAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
  }

  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();

  updateUI(currentAccount);
});
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
  inputLoginPin.blur();
});
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

//        MAP
// currencies.forEach(function(value, key, map) {
//   console.log(`${key}: ${value}`)
// })

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const owners = ["Jonas", "Zach", "Adam", "Mary"];

// console.log(owners.sort());

// const numbers = [2, 5, 7, 4, 2, 7, 8, 4, 1];
// console.log(
//   movements.sort((a, b) => {
//     if (a > b) return 1;
//   })
// );
// const overAllBalance = accounts
//   .map((acc) => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);

// const overAllBalance2 = accounts
//   .flatMap((acc) => acc.movements)

//   .reduce((acc, mov) => acc + mov, 0);

// console.log(overAllBalance);
// console.log(overAllBalance2);
// console.log(movements);
// console.log(movements.includes(-130));

// const dep = movements.every((mov) => mov > 0 || mov < 0);
// console.log(dep);
// const anyDeposits = movements.some((mov) => mov > 0);
// console.log(anyDeposits);
/////////////////////////////////////////////////

// let arr = ["a", 'b', 'c', 'd', 'e']
//  SLICE
// console.log(arr.slice(2))
// console.log(arr.slice(4))
// console.log(arr)
// console.log(arr.splice(-1))
// console.log(arr)

// for(const movement of movements){
//   if (movement > 0){
//     console.log(`You deposited ${movement}`)
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`)
//   }
// }

// movements.forEach(function(movement) {
//   if (movement > 0){
//     console.log(`You deposited ${movement}`)
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`)
//   }
// })

// const euroToUsd = 1.1;

// const result = movements.map(function (mov) {
//   return mov * euroToUsd;
// });
// console.log(movements);
// console.log(result);

// const deposit = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(deposit);

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawals = movements.filter((mov) => mov < 0);
// console.log(withdrawals);

// const withdrawalsFor = [];

// for (const mov of movements) if (mov < 0) withdrawalsFor.push(mov);
// console.log(withdrawalsFor);

// console.log(movements);

// const balance = movements.reduce((acc, cur) => acc + cur, 0);

// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) balance2 += mov;

// console.log(balance2);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements);

// const highestValue = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else {
//     return mov;
//   }
// }, 0);
// console.log(highestValue);
// let newArr = [];
// const age = [5, 2, 4, 1, 15, 8, 3];

// const humanAgeChecker = age.map((mov) => {
//   if (mov <= 2) {
//     return newArr.push(mov * 2);
//   } else {
//     return newArr.push(16 + mov * 4);
//   }
// });

// const humnAge = newArr.filter((mov) => mov > 18);

// const averageHumanAge =
//   humnAge.reduce((acc, cur) => acc + cur, 0) / humnAge.length;
// console.log(averageHumanAge);
// console.log(humnAge);
// console.log(newArr);

// function reverseString(str) {
//   return str.toLowerCase().split("").reverse().join("");
// }
// const rvrStr = (str) => str.split("").reverse().join("").toLowerCase();

// let newArr = "";

// function rev(str) {
//   let rv = "";
//   const r = str.toLowerCase().split("");
//   for (let i = r.length - 1; i >= 0; i--) {
//     rv += r[i];
//   }
//   console.log(rv);
// }
// console.log(reverseString("tobIlOBa"));
// console.log(rvrStr("tobIlOBa"));
// rev("Tobiloba");

//  PIPELINE
// const eurToUsd = 1.1;
// const totalDepositInUsd = movements
//   .filter((mov) => mov > 0)
//   .map((mov, i, arr) => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositInUsd);

// const firstWithdrawal = movements.find((mov) => mov < 0);
// console.log(firstWithdrawal);

// console.log(new Array(1, 2, 3, 4, 5, 6));
// const num = [1, 2, 3, 4, 5, 6, 7];
// const x = new Array(num);
// const y = new Array(7);
// const z = Array.from({ length: 100 }, (_, i) => i + 1);

// console.log(z);
// console.log();
// console.log(num);
// console.log(num.fill(51, 2, 4));
// console.log(y.fill(2, 2, 6));
// console.log(x);
// console.log(y);

// labelBalance.addEventListener("click", function (e) {
//   e.preventDefault();
//   const movementsUI = Array.from(
//     document.querySelectorAll(".movements__value"),
//     (el) => Number(el.textContent.replace("€", ""))
//   );

//   console.log(movementsUI);
// });

const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Maltida"] },
  { weight: 12, curFood: 275, owners: ["Sarah"] },
  { weight: 32, curFood: 340, owners: ["Micheal"] },
];
//          1
dogs.forEach((dog) => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

// console.log(dogs);
//      2
// const sarahDog = dogs.find((dog) => dog.owners.includes("Sarah"));
// if (sarahDog.curFood > sarahDog.recFood) {
//   console.log("ijewuru");
// } else {
//   console.log("tush");
// }

//     3
const ownersEatTooMuch = dogs
  .filter((dog) => dog.curFood > dog.recFood)
  .flatMap((dog) => dog.owners)
  .join(" and ");
console.log(ownersEatTooMuch + "'s dogs eat too much");
const ownersEatTooLittle = dogs
  .filter((dog) => dog.recFood > dog.curFood)
  .flatMap((dog) => dog.owners)
  .join(" and ");
console.log(ownersEatTooLittle + "'s dogs eat too little");

console.log(dogs.some((dog) => dog.curFood === dog.recFood));

const eatingOkay = (dog) =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
console.log(eatingOkay);
console.log(dogs.some(eatingOkay));
const dogEatingOkay = dogs.filter(eatingOkay);
console.log(dogEatingOkay);

const dogsCopy = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsCopy);
