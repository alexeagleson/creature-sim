import { displayError } from './../main/general-utility';

// Time
const WORLD_TIME_MULTIPLIER = 2000;

export default function Time() {
  this.millisecondsElapsed = 0;
  this.dayStartedMilliseconds = 0;
  this.daysElapsed = 0;

  this.startTimer = () => {
    World.Time.mainTimer = setInterval(() => {
      if (!World.worldPaused) {
        World.Time.millisecondsElapsed += 90;
        if (World.Time.millisecondsSinceDayStart() > 86400000) {
          World.Time.dayStartedMilliseconds = World.Time.millisecondsElapsed;
          World.Time.daysElapsed += 1;
        }
      }
    }, 90);
  };

  this.millisecondsSinceDayStart = () => (this.millisecondsElapsed - this.dayStartedMilliseconds) * WORLD_TIME_MULTIPLIER;
  this.startTimer();
}

export function millisecondsToHHMMSS(timeInMilliseconds) {
  const secNum = Math.floor(timeInMilliseconds / 1000);
  let hours = Math.floor(secNum / 3600);
  let minutes = Math.floor((secNum - (hours * 3600)) / 60);
  let seconds = secNum - (hours * 3600) - (minutes * 60);
  let ampm = 'a.m.';

  if (hours === 12) {
    ampm = 'p.m.';
  } else if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
    ampm = 'p.m.';
  }

  if (hours < 10) { hours = `0${hours}`; }
  if (minutes < 10) { minutes = `0${minutes}`; }
  if (seconds < 10) { seconds = `0${seconds}`; }

  return `${hours}:${minutes} ${ampm}`;
}

export function HHMMSSToMilliseconds(timeValueString) {
  const hourMinAmpm = timeValueString.split(':');
  if (hourMinAmpm.length !== 2) {
    displayError(`${timeValueString} is not in the valid 'hh:mm a.m.' format required for HHMMSSToMilliseconds function`);
  }

  const hours = Number(hourMinAmpm[0]);
  const minAmpm = hourMinAmpm[1].split(' ');

  if (minAmpm.length !== 2 || (minAmpm[1] !== 'a.m.' && minAmpm[1] !== 'p.m.')) {
    displayError(`${timeValueString} is not in the valid 'hh:mm a.m.' format required for HHMMSSToMilliseconds function`);
  }

  const minutes = Number(minAmpm[0]);
  const ampm = minAmpm[1];
  let millisecondValue = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);

  if (ampm === 'p.m.' && Number(hours) !== 12) {
    millisecondValue += (12 * 60 * 60 * 1000);
  }
  return millisecondValue;
}
