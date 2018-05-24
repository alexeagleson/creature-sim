const Temperature = function(worldObject, arg = {}) {
  this.owner = worldObject;
  this.temp = 20;

  if (!this.owner.Living) {
    displayError(`${this.owner.name} must be a Living object in order to be a Temperature object.`);
    return null;
  }

  this.adjustTemperature = function(timePassedMilliseconds) {
    let differenceBetweenWeatherAndCurrent = this.owner.WorldMap.temp - this.temp;
    this.temp += differenceBetweenWeatherAndCurrent / timePassedMilliseconds * 10;
    this.adjustConditionBasedOnTemperature();
  };

  this.adjustConditionBasedOnTemperature = function() {
    let tempAffectsCondition = Math.abs(20 - this.temp);
    tempAffectsCondition = normalizeToValue((tempAffectsCondition - 15), 0, 100);
    this.owner.Destructible.adjustConditionBy(0 - tempAffectsCondition / 10);
  };

}
