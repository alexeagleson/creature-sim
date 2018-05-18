function rollDie(dieSize) {
  var value = Math.floor(Math.random() * (dieSize)) + 1;
  return value;
};

function pickRandom(arrayOfThings) {
  randomPosition = rollDie(arrayOfThings.length) - 1;
  return arrayOfThings[randomPosition];
};

function randBetween(firstNumber, lastNumber) {
  return Math.floor((Math.random() * (lastNumber - firstNumber)) + firstNumber);
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
