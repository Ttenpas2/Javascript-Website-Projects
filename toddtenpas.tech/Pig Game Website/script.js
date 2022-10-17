'use strict';
//selecting elements
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const player0 = document.querySelector('.player--0');
const player1 = document.querySelector('.player--1');
const p0current = document.querySelector('#current--0');
const p1current = document.querySelector('#current--1');
//setting initial values of elements

//TURNED INTO A FUNCITON TO INITIALIZE THE GAME AND ALSO TO RESET THE GAME AT THE END SO AS NOT TO REPEAT OURSELVES
let scores = [];
let currentScore;
let activePlayer;
let player0Score;
let player1Score;
let playing;

const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  player0Score = 0;
  player1Score = 0;
  playing = true;

  score0El.textContent = 0;
  score1El.textContent = 0;
  p0current.textContent = 0;
  p1current.textContent = 0;

  diceEl.classList.add('hidden');
  player0.classList.remove('player--winner');
  player1.classList.remove('player--winner');
  player0.classList.add('player--active');
  player1.classList.remove('player--avtive');
};
init();

const switchPlayer = function () {
  document.querySelector(`#current--${activePlayer}`).textContent = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  currentScore = 0;
  player0.classList.toggle('player--active');
  player1.classList.toggle('player--active');
};

//rolling dice functionality

btnRoll.addEventListener('click', function () {
  if (playing) {
    //generate a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;
    document.querySelector('.dice').textContent = dice;

    //display dice
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;

    //check for rolling 1: if true,
    if (dice !== 1) {
      //add dice to current score
      currentScore += dice;
      document.querySelector(`#current--${activePlayer}`).textContent =
        currentScore;

      //p0current.textContent = currentScore; //change later
    } else {
      //switch to next player
      switchPlayer();
      // document.querySelector(`#current--${activePlayer}`).textContent = 0;
      // activePlayer = activePlayer === 0 ? 1 : 0;
      // currentScore = 0;
      // //MYSOLUTION
      // // for (let i = 0; i < 2; i++) {
      // //   document.querySelector(`#current--${i}`).textContent = currentScore;
      // // }
      // player0.classList.toggle('player--active');
      // player1.classList.toggle('player--active');
      //.toggle----- removes an element if it is there or adds it if it is not there
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    //add current score to active player
    scores[activePlayer] += currentScore;
    document.querySelector(`#score--${activePlayer}`).textContent =
      scores[activePlayer];
    //check if players score is >= 100
    //finish game if true
    if (scores[activePlayer] >= 100) {
      playing = false;
      diceEl.classList.add('hidden');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.toggle('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.toggle('player--active');
    } else {
      //switch active player
      switchPlayer();
    }
  }
});

//ANOTHER WAY TO RESET THE GAME
btnNew.addEventListener('click', init());

// //MY SOLUTION WORKED!!! to reset the game
// btnNew.addEventListener('click', function () {
//   if (!playing) {
//     document
//       .querySelector(`.player--${activePlayer}`)
//       .classList.toggle('player--winner');
//     document
//       .querySelector(`.player--${activePlayer}`)
//       .classList.remove('player--active');
//     currentScore = 0;
//     activePlayer = 0;
//     player0Score = 0;
//     player1Score = 0;
//     playing = true;
//     scores[0] = 0;
//     scores[1] = 0;
//     document
//       .querySelector(`.player--${activePlayer}`)
//       .classList.add('player--active');
//     document.querySelector('#score--0').textContent = 0;
//     document.querySelector('#score--1').textContent = 0;
//     //   score0El.textContent = 0;
//     //   score1El.textContent = 0;
//     document.querySelector('#current--0').textContent = 0;
//     document.querySelector('#current--1').textContent = 0;
//     //   p0current.textContent = 0;
//     //   p1current.textContent = 0;
//     playing = true;
//   }
// });
