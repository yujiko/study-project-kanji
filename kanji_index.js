import { toRomaji } from 'wanakana';

const checkboxes = document.querySelectorAll(".js_filter");
const input = document.querySelector(".js_input");
const send = document.querySelector(".js_send");
const button = document.querySelector(".js_button");
const animation = document.querySelector(".js_animation");
const toggler = document.querySelector(".menu-toggler-button");
const streakToggler = document.querySelector(".js_streak");
const menu = document.querySelector(".menu");
const streakContainer = document.querySelector(".streak_container");
const streakHTML = document.querySelector(".streak");
const totalHTML = document.querySelector(".total");
const resetlButton = document.querySelector(".reset")

let kanjiJSON = [];
let filtered = [];
let currentKanji = [];
let streak = 0;
let total = 0;
let localList = []

async function loadKanjiJSON() {
  try {
    const response = await (await fetch("kanjis.json")).json();
    kanjiJSON = Object.entries(response);
    filtered = Object.entries(response);
    getRandomKanji(filtered);
    return;
  } catch(error) {
    console.error(error);
  }
}

function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomKanji(kanjiArray) {
  const kanji = document.querySelector(".js_text");
  const randomObj = kanjiArray[randomNumber(0, kanjiArray.length)];
  const randomKanji = randomObj[0];
  kanji.innerHTML = `${randomKanji}`;
  currentKanji = randomObj;
  console.log(currentKanji[1]);
  return randomObj;
}

function submitAnimation(value) {
  const submited = document.querySelector(".js_send");

  if (value) {
    submited.classList.add("right");
  } else {
    submited.classList.add("wrong");
  }

  input.value = "";
  setTimeout(() => {
    submited.classList.remove("right", "wrong");
  }, 500);
}

function submit(currentKanji, input, kanjiArray) {
  const [_kanji, values] = currentKanji;
  const inputValue = input.value.toLowerCase();
  const correctAnswer = checkAnswer(values, inputValue, validInputs);
  submitAnimation(correctAnswer);

  if (correctAnswer) {
    streak = streak + 1;
    total = total +1;
    totalHTML.innerHTML = total
    streakHTML.innerHTML = streak
    return getRandomKanji(kanjiArray);
  }
  streak = 0; 
  streakHTML.innerHTML = streak
  return currentKanji;
}

function filterJSON() {
  const checkboxesElementsArr = [...checkboxes];
  const filteringBy = checkboxesElementsArr
    .map((item) => (item.checked ? item.dataset.jlpt : null))
    .filter((item) => item !== null);
  if (filteringBy.length) {
    filtered = kanjiJSON.filter(([_kanji, values]) =>
      filteringBy.some((filter) => filter == values.jlpt_new)
    );
  } else {
    filtered = kanjiJSON;
  }

  currentKanji = getRandomKanji(filtered);
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", filterJSON);
});

button.addEventListener("click", () => {
  currentKanji = getRandomKanji(filtered);
  input.focus();
});

send.addEventListener("click", () => {
  currentKanji = submit(currentKanji, input, filtered);
  input.focus();
});

input.addEventListener("keydown", (key) => {
  if (key.keyCode === 13) {
    currentKanji = submit(currentKanji, input, filtered);
  }
  if (key.keyCode === 188) {
    key.preventDefault();
    currentKanji = getRandomKanji(filtered);
  }
});

animation.addEventListener("change", () => {
  const animationDiv = document.querySelector(".js_bounce");
  if (animation.checked) {
    animationDiv.classList.remove("animate");
  } else {
    animationDiv.classList.add("animate");
  }
});

toggler.addEventListener("change", () => {
  if (toggler.checked) {
    menu.classList.add("active");
  } else {
    menu.classList.remove("active");
  }
})

streakToggler.addEventListener("change", () => {
  if (streakToggler.checked) {
    streakContainer.classList.add("active");
  } else {
    streakContainer.classList.remove("active");
  }
})

resetlButton.addEventListener("click", () => {
  total = 0;
  streak = 0;
  totalHTML.innerHTML = total
  streakHTML.innerHTML = streak
})

loadKanjiJSON();









const inputCheckBoxes = document.querySelectorAll(".js_valid_input");

let validInputs = []

const filterInputs = () => {
  validInputs = [...inputCheckBoxes]
    .map((item) => (item.checked ? item.dataset.inputtypejs : null))
    .filter((item) => item !== null);
  console.log(validInputs)
}

filterInputs();

[...inputCheckBoxes].map( (e) => {
  e.addEventListener("change", ()=> {
    filterInputs()
  });
});

const checkAnswer = (kanjiValues, value, filters) => {
  const trim = /[^一-龠|ぁ-ゔ|ァ-ヴー|a-zA-Z0-9|a-zA-Z0-9|々〆〤ヶ\s]/ug;

  const trimAndCompare = (item) => {
    return (
    toRomaji(item).toLowerCase().replace(trim, "") == value || item.replace(trim, "") == value
    )
  }

  const compareMeanings = () => {
    return (
      kanjiValues.meanings?.some(
        (item) => item.toLowerCase().replace(trim, "") == value
      ) ||
      kanjiValues.wk_meanings?.some(
        (item) => item.toLowerCase().replace(trim, "") == value
      )
    )
  }

  const compareKun = () => {
    return (
      kanjiValues.readings_kun?.some(
        (item) => trimAndCompare(item)
      ) ||
      kanjiValues.wk_readings_kun?.some(
        (item) => trimAndCompare(item)
      )
    )
  }

  const compareOn = () => {
    return (
      kanjiValues.readings_on?.some(
        (item) => trimAndCompare(item)
        ) ||
        kanjiValues.wk_readings_on?.some(
          (item) => trimAndCompare(item)
      )
    )
  }

  const compare = (
    filters.some((e) => {
      if (e === "on") {
        return compareOn()
      }
      if (e === "kun") {
        return compareKun()
      }
      if (e === "meaning") {
        return compareMeanings()
      }
    })
  )

  return compare
}











 // SEARCH

// const inputSearch = document.querySelector('.js_search');
// const sbutton = document.querySelector('.js_sbutton');

// sbutton.addEventListener("click", event => {
//   searchKanji();
// })

// const searchKanji = () => {
//   const _value = inputSearch.value.trim().toLowerCase();;
//   if (_value) {
//     clearResults();
//     const results = kanjiJSON.filter( element =>
//       checkAnswer(element[1], _value));
//     console.log(results);
//     results.forEach(element => {
//       createBox(element[0])
//     });
//   } else {
//     console.log("error")
//   }
// }

// const createBox = (kanji) => {
//   let newBox = document.createElement('div');
//   newBox.classList.add('kanji-box');
//   const boxInnerHTML = 
//   `<p class="kanji-box-result">${kanji}</p>
//   <div class="kanji-box-buttons hide">
//     <button type="button" class="add" onclick="addToList(${kanji})">+</button>
//     <button type="button" class="info" onclick="window.open('https://jisho.org/search/${kanji}%20%23kanji')">info</button>
//   </div>`
//   newBox.innerHTML = boxInnerHTML;
//   document.querySelector('.results').appendChild(newBox);
// }

// const clearResults = () => {
//   const results = document.querySelector('.results');
//   results.innerHTML = '';
// }

// const wrapper = document.querySelector(".wrapper")
// const header = wrapper.querySelector("header");

// function onDrag({ movementX, movementY }) {
//   let getStyle = window.getComputedStyle(wrapper);
//   let left = parseInt(getStyle.left);
//   let top = parseInt(getStyle.top);
//   wrapper.style.left = `${left + movementX}px`
//   wrapper.style.top = `${top + movementY}px`
// }

// header.addEventListener("mousedown", () => {
//   header.addEventListener("mousemove", onDrag);
// })

// document.addEventListener("mouseup", () => {
//   header.removeEventListener("mousemove", onDrag);
// })