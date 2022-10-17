'use strict';

//MODAL WINDOWS-- pop up windows

const modal = document.querySelector('.modal');

const hidden = document.querySelector('.hidden');

const overlay = document.querySelector('.overlay');

const closeModal = document.querySelector('.close-modal');

//there are 3 elements with this same class
const btnShowModal = document.querySelectorAll('.show-modal');

const hideModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const showModal = function () {
  console.log('button clicked');
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
//so to apply effects to each element we need to use a for loop
for (let i = 0; i < btnShowModal.length; i++) {
  btnShowModal[i].addEventListener('click', showModal);
}

closeModal.addEventListener('click', hideModal);
//classes allow us to control element styles in groups instead of just individually

overlay.addEventListener('click', hideModal);

//we agrogated or saved our functions that we used multiple times into a singe variable holding th efnction that we could then use in the event listener for a click. making the code look much neater and easier to understand

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('.hidden')) {
    hideModal();
  }
});
//this event listener added to the documant is basiclaly looking for a global event not attached to any specific element
