const Temperature = function(worldObject, arg = {}) {
  this.owner = worldObject;
  World.allObjectsTemperature.push(this.owner);
  if (!this.owner.Living) { applyLiving(this.owner); }

  this.temp = 20;

  this.adjustTemperature = function(timePassedMilliseconds) {
    let differenceBetweenWeatherAndCurrent = this.owner.WorldMap.mapTemp - this.temp;

    if (this.owner.Equipper) {
      if (differenceBetweenWeatherAndCurrent < 0 && this.owner.Equipper.currentEquipment) {
        const protection = this.owner.Equipper.currentEquipment.temperatureProtection;
        differenceBetweenWeatherAndCurrent = differenceBetweenWeatherAndCurrent * ((100 - protection) / 100);
      }
    }

    this.temp += differenceBetweenWeatherAndCurrent / timePassedMilliseconds * 10;
    this.adjustConditionBasedOnTemperature();
  };

  this.adjustConditionBasedOnTemperature = function() {
    let tempAffectsCondition = Math.abs(20 - this.temp);
    tempAffectsCondition = normalizeToValue((tempAffectsCondition - 15), 0, 100);
    this.owner.Destructible.adjustConditionBy(0 - tempAffectsCondition / 10);
  };
};

function applyTemperature(worldObject, arg = {}) {
  worldObject.Temperature = worldObject.Temperature || new Temperature(worldObject, arg);
};
