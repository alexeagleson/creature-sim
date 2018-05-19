let errorAlertHasBeenTriggered = false;

function rollDie(dieSize) {
  var value = Math.floor(Math.random() * (dieSize)) + 1;
  return value;
};

function pickRandom(arrayOfThings) {
  randomPosition = rollDie(arrayOfThings.length) - 1;
  return arrayOfThings[randomPosition];
};

function randBetween(min, max) {
  // Function is inclusive of max number
  return Math.floor(Math.random() * (max - min + 1) + min);
};

function normalizeToValue(number, minValue, maxValue) {
  if (number < minValue) {
    number = minValue;
  } else if (number > maxValue) {
    number = maxValue;
  }
  return number;
};

uniqueNumber.previous = 0;
function uniqueNumber() {
    var date = Date.now();

    // If created at same millisecond as previous
    if (date <= uniqueNumber.previous) {
        date = ++uniqueNumber.previous;
    } else {
        uniqueNumber.previous = date;
    }
    return date;
};

function displayError(errorText) {
  if (!errorAlertHasBeenTriggered) {
    alert(`Error: ${errorText}`);
    errorAlertHasBeenTriggered = true;
  }
  console.log(`Error: ${errorText}`);
};

function directionTextToCoords(directionText) {
  if (directionText.toLowerCase() === 'up') {
    return [0, -1];
  } else if (directionText.toLowerCase() === 'down') {
    return [0, 1];
  } else if (directionText.toLowerCase() === 'left') {
    return [-1, 0];
  } else if (directionText.toLowerCase() === 'right') {
    return [1, 0];
  } else if (directionText.toLowerCase() === 'nodir') {
    return [0, 0];
  } else {
    displayError(`Invalid argument ${directionText} in function ${directionTextToCoords}.`);
    return null;
  }
};
