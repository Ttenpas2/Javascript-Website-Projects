'use strict';

//DOM Manipulation
//(Document Object Model)
//this allows a structred representation of HTML documents ans allows javascript to access html elements and styles to manipulate them

//INfo is stores in a tree tructure where the documant is always the starter then the HTML at the "wife just under, and then there are 2 parents elements the "head" and the "body"  and then many child elements that are parent elements to other child elements adn some of these elements have text elements

//DOM and HTML are not Javascript---- they are WEB API's (Aplication Programming Interface)- they are downloaded form the web and allow us to interact with them useing javascript

// const secretNumber = Math.trunc(Math.random() * 20) + 1;
// //Math.trunc --- shortens the number
// //Math.random-- pick a rantom number between 0 and 1
// // that is why we has to multiply by the number we wanted to go up to. and then becasue it actially excluded the value 20 we had to add 1 to make it possible to pick the number 20
// let score = 20;
// let highScore = 0;
// //set score and highscore as numbers to keep them in our code and not just saved in the DOM

// document.querySelector('.number').textContent = '?';
// //then we assign our random number to the text content of the box

// document.querySelector('.check').addEventListener('click', function () {
//   const guess = Number(document.querySelector('.guess').value);
//   //when there is no input
//   if (!guess) {
//     document.querySelector('.message').textContent = '⛔ No Number!';
//     //when player wins
//   } else if (guess === secretNumber) {
//     document.querySelector('.message').textContent = '🎊 You got it!!';
//     document.querySelector('.number').textContent = secretNumber;
//     //to change the style of a website you have to acces the CSS code with a ".style" and then a ".something" that you want to change and that value has to be a 'string'
//     //changing color
//     document.querySelector('body').style.backgroundColor = '#60b347';
//     //changing width
//     document.querySelector('.number').style.width = '30rem';
//     //all this does not change the CSS file, but instead changes the HTML file and adds a Style indicator the the element we specified

//     if (highScore <= score) {
//       highScore = score;
//       document.querySelector('.highscore').textContent = highScore;
//     }
//     //If guess is too high
//   } else if (guess > secretNumber) {
//     if (score > 1) {
//       document.querySelector('.message').textContent = '📈 Too High!';
//       score--;
//       document.querySelector('.score').textContent = score;
//     } else {
//       document.querySelector('.message').textContent = 'You Lost the Game!';
//       document.querySelector('.score').textContent = 0;
//     }
//     //if guess is too low
//   } else if (guess < secretNumber) {
//     if (score > 1) {
//       document.querySelector('.message').textContent = '📉 Too Low!';
//       score--;
//       document.querySelector('.score').textContent = score;
//     } else {
//       document.querySelector('.message').textContent = 'You Lost the Game!';
//       document.querySelector('.score').textContent = 0;
//     }
//   }
// });
// //the document.qureryselector need to know the "class" of the object we are trying to reach--- and then possibly the "".value" or ".text" if we just want what it inside to change.
// //the EVENT LISTENER needs to things the "type" of event and then a function that will take place at that event

// document.querySelector('.again').addEventListener('click', function () {
//   const secretNumber = Math.trunc(Math.random() * 20) + 1;
//   let score = 20;
//   document.querySelector('.score').textContent = score;
//   document.querySelector('.message').textContent = 'Start guessing...';
//   document.querySelector('body').style.backgroundColor = '#222';
//   document.querySelector('.number').style.width = '15rem';
//   document.querySelector('.number').textContent = '?';
//   document.querySelector('.guess').value = '';
// });

//REFRACTORING OUR CODE: THE DRY PRINCIPLE
//basically how do we remove duplicate code

let secretNumber = Math.trunc(Math.random() * 20) + 1;

let score = 20;
let highScore = 0;
//using a function to repeatedly display the new values in the message box
const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

//sense for check button being clicked
document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  //when there is no input
  if (!guess) {
    // document.querySelector('.message').textContent = '⛔ No Number!';
    displayMessage('⛔ No Number!');

    //if correct answer
  } else if (guess === secretNumber) {
    // document.querySelector('.message').textContent = '🎊 You got it!!';
    displayMessage('🎊 You got it!!');
    document.querySelector('.number').textContent = secretNumber;

    document.querySelector('body').style.backgroundColor = '#60b347';

    document.querySelector('.number').style.width = '30rem';

    if (highScore <= score) {
      highScore = score;
      document.querySelector('.highscore').textContent = highScore;
    }
    //if guess is too high or low
  } else if (guess !== secretNumber) {
    if (score > 1) {
      //MY SOLUTION
      //   if (guess > secretNumber) {
      //     document.querySelector('.message').textContent = '📈 Too High!';
      //   } else {
      //     document.querySelector('.message').textContent = '📉 Too Low!';
      //   }
      //ANOTHER WAY USING TERINARY OPERATOR
      //MUCH SHORTER
      //   document.querySelector('.message').textContent =
      //     guess > secretNumber ? '📈 Too High!' : '📉 Too Low!';
      //EVEN SHORTER WITH OUR FUNCTION TO DISPLAY
      displayMessage(guess > secretNumber ? '📈 Too High!' : '📉 Too Low!');
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      //   document.querySelector('.message').textContent = '😭 You Lost the Game!';
      displayMessage('😭 You Lost the Game!');
      document.querySelector('.score').textContent = 0;
    }
  }
});

//sense for again button being clicked
document.querySelector('.again').addEventListener('click', function () {
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  let score = 20;
  document.querySelector('.score').textContent = score;
  //   document.querySelector('.message').textContent = 'Start guessing...';
  displayMessage('Start guessing...');
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.number').textContent = '?';
  document.querySelector('.guess').value = '';
});
