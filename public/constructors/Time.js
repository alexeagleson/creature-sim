const Time = function() {
  this.millisecondsElapsed = 0;
  this.dayStartedMilliseconds = 0;

  this.startTimer = function() {
    const countDownDate = new Date().getTime();

    World.Time.mainTimer = setInterval(function() {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      World.Time.millisecondsElapsed = (0 - Math.floor(distance));
    }, 100);
  }

  this.millisecondsSinceDayStart = function() {
    return (this.millisecondsElapsed - this.dayStartedMilliseconds) * WORLD_TIME_MULTIPLIER;
  }
};

function millisecondsToHHMMSS(timeInMilliseconds) {
    let sec_num = Math.floor(timeInMilliseconds / 1000);
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);
    let ampm = "a.m.";

    if (hours === 12) {
      ampm = "p.m.";
    } else if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
      ampm = "p.m.";
    }

    if (hours   < 10) { hours   = '0' + hours; }
    if (minutes < 10) { minutes = '0' + minutes; }
    if (seconds < 10) { seconds = '0' + seconds; }

    return hours + ':' + minutes + ' ' + ampm;
}

function HHMMSSToMilliseconds(timeValueString) {
  const hourMinAmpm = timeValueString.split(":");
  if (hourMinAmpm.length != 2) {
    displayError(`${timeValueString} is not in the valid 'hh:mm a.m.' format required for HHMMSSToMilliseconds function`);
  }

  const hours = Number(hourMinAmpm[0]);
  const minAmpm = hourMinAmpm[1].split(" ");

  if (minAmpm.length != 2 || (minAmpm[1] != "a.m." && minAmpm[1] != "p.m.")) {
    displayError(`${timeValueString} is not in the valid 'hh:mm a.m.' format required for HHMMSSToMilliseconds function`);
  }

  const minutes = Number(minAmpm[0]);
  const ampm = minAmpm[1];
  const millisecondValue = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);

  if (ampm === "p.m." && Number(hours) != 12) {
    millisecondValue += (12 * 60 * 60 * 1000);
  }
  return millisecondValue;
}
