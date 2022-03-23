var rows = 6;           // 行数
var cols = 6;          // 列数
var types = 15;         // 方块种类数目
var squareSet;

const deck = document.querySelector(".deck");
let opened = [];
let matched = [];
let gameOn = "";

const modal = document.getElementById("modal");
const startModal = document.getElementById("start-modal");

const reset = document.querySelector(".reset-btn");
const playAgain = document.getElementById("play-again");
const gameStart = document.getElementById("start");

const timeCounter = document.querySelector(".timer");
let time;
let minutes = 0;
let seconds = 0;
let timeStart = false;

function showModalStart() {
  startModal.style.display = "block";
}

showModalStart();

// create the card DOM
function createSquare(row, col) {
  var temp = document.createElement("div");
  temp.classList.add("square");
  temp.row = row;
  temp.col = col;
  return temp;
}

// generate the card number set
function generateSquareNumSet() {
  var tempSet = [];
  for (var i = 0; i < rows * cols / 2; i++) {
      var tempNum = Math.floor(Math.random() * types);
      tempSet.push(tempNum); 
      tempSet.push(tempNum);
  }
  tempSet.sort(function() {
      return Math.random() - 0.5; 
  });
  return tempSet;
}

function initCard() {
  let cards = [];
  if (gameOn === "start"&&timeStart === false) {
    timeStart = true;
    timer();
  }
  var squareNumSet = generateSquareNumSet();
  squareSet = new Array(rows); 
  for (var i = 0; i < squareSet.length; i++) {
      squareSet[i] = new Array(cols);
  }

  for (var i = 1; i <= rows; i++) {
    for (var j = 1; j <= cols; j++) {
        var temp = createSquare( i, j);//创建一个方块
        updateReflection(temp);
        squareSet[i][j] = temp;
        deck.appendChild(temp);
        const addImage = document.createElement("img");
        temp.appendChild(addImage);
        addImage.setAttribute("src", "img/" + squareNumSet.pop() + ".png");
    }
  }
}

function removeCard() {
  while (deck.hasChildNodes()) {
    deck.removeChild(deck.firstChild);
  }
}

function timer() {
  time = setInterval(function () {
    seconds++;
    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }
    timeCounter.innerHTML =
      minutes.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      ":" +
      seconds.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
  }, 1000);
}

function stopTime() {
  clearInterval(time);
}

function resetEverything() {
  // Stop time, reset the minutes and seconds update the time inner HTML
  stopTime();
  timeStart = false;
  seconds = 0;
  minutes = 0;
  timeCounter.innerHTML = "00:00";
  matched = [];
  opened = [];
  removeCard();

  startModal.style.display = "block";
}

function compareTwo() {
  // When there are 2 cards in the opened array
  if (opened.length === 2) {
    // Disable any further mouse clicks on other cards
    document.body.style.pointerEvents = "none";
  }
  // Compare the two images src
  if (opened.length === 2 && opened[0].src === opened[1].src) {
    match();
  } else if (opened.length === 2 && opened[0].src != opened[1].src) {
    noMatch();
  }
}

function match() {
  /* Access the two cards in opened array and add
  the class of match to the imgages parent: the <li> tag
  */
  setTimeout(function () {
    opened[0].parentElement.classList.add("match");
    opened[1].parentElement.classList.add("match");
    matched.push(...opened);
    document.body.style.pointerEvents = "auto";
    winGame();
    opened = [];
  }, 600);
}

function noMatch() {
  /* After 700 miliseconds the two cards open will have
  the class of flip removed from the images parent element <li>*/
  setTimeout(function () {
    opened[0].parentElement.classList.remove("flip");
    opened[1].parentElement.classList.remove("flip");
    opened[0].parentElement.style.transform = '';
    opened[1].parentElement.style.transform = '';
    document.body.style.pointerEvents = "auto";
    opened = [];
  }, 700);
}

function AddStats() {
  // Access the modal content div

  const details = document.getElementById("modal-details");
  // Create three different paragraphs
  for (let i = 1; i <= 3; i++) {
    const statsElement = document.createElement("p");
    statsElement.classList.add("stats");
    details.appendChild(statsElement);
  }

  // Select all p tags with the class of stats and update the content
  let p = details.querySelectorAll("p.stats");

  p[0].innerHTML = `Time taken: ${minutes} Minutes and ${seconds} Seconds`;
}
function displayModal() {
  // Access the modal <span> element (x) that closes the modal
  const modalClose = document.getElementsByClassName("close")[0];
  // When the game is won set modal to display block to show it
  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  modalClose.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function winGame() {
  let len = 0;
  if (gameOn === "start") len = 30;

  if (matched.length === len) {
    stopTime();
    AddStats();
    displayModal();
  }
}

deck.addEventListener("click", function (evt) {
  if (evt.target.getAttribute("class") === "square") {
    // Call flipCard() function
    flipCard();
  }

  //Flip the card and display cards img
  function flipCard() {
    // When <li> is clicked add the class .flip to show img
    evt.target.classList.add("flip");
    evt.target.style.transform = `rotateX(0deg) rotateY(180deg)`;
    // Call addToOpened() function
    addToOpened();
  }

  //Add the fliped cards to the empty array of opened
  function addToOpened() {
    /* If the opened array has zero or one other img push another
      img into the array so we can compare these two to be matched
      */
    if (opened.length === 0 || opened.length === 1) {
      // Push that img to opened array
      opened.push(evt.target.firstElementChild);
    }
    // Call compareTwo() function
    compareTwo();
  }
});

reset.addEventListener("click", resetEverything);

gameStart.addEventListener("click", function () {
  startModal.style.display = "none";
  gameOn = "start";
  initCard();
});

playAgain.addEventListener("click", function () {
  modal.style.display = "none";
  resetEverything();
});

function updateReflection(card) {
  card.style.background = "green";
  card.style.backgroundSize = "cover";
}
