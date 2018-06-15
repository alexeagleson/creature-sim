import { isNotObject } from './../main/filters';
import { normalizeToValue } from './../main/general-utility';

const TEMP_ADJUSTMENT_FACTOR = 20;

function Temperature(worldObject) {
  this.owner = worldObject;
  World.allObjectsTemperature.push(this.owner);
  if (!this.owner.Living) { applyLiving(this.owner); }

  this.temp = 20;
  this.takingTemperatureDamage = false;

  this.adjustTemperature = (timePassedMilliseconds) => {
    let differenceBetweenWeatherAndCurrent = this.owner.WorldMap.mapTemp - this.temp;

    if (this.owner.Equipper) {
      if (differenceBetweenWeatherAndCurrent < 0 && this.owner.Equipper.currentEquipment) {
        const protection = this.owner.Equipper.currentEquipment.Equipment.temperatureProtection;
        differenceBetweenWeatherAndCurrent *= (100 - protection) / 100;
      }
    }

    //console.log(differenceBetweenWeatherAndCurrent);

    this.temp += (differenceBetweenWeatherAndCurrent / timePassedMilliseconds) * TEMP_ADJUSTMENT_FACTOR;
    this.adjustConditionBasedOnTemperature();
  };

  this.adjustConditionBasedOnTemperature = () => {
    let tempAffectsCondition = Math.abs(20 - this.temp);
    tempAffectsCondition = normalizeToValue((tempAffectsCondition - 15), 0, 100);

    const temperatureDamage = Math.round(tempAffectsCondition / TEMP_ADJUSTMENT_FACTOR);

    this.takingTemperatureDamage = false;
    if (temperatureDamage > 0) {
      this.takingTemperatureDamage = true;
      const causeOfConditionLoss = this.temp > 35 ? 'heat exposure' : 'cold exposure';
      this.owner.Destructible.adjustConditionBy((0 - temperatureDamage), causeOfConditionLoss);
    }
  };

  this.revokePrototype = () => {
    World.allObjectsTemperature = World.allObjectsTemperature.filter(isNotObject.bind(this.owner));
    this.owner.Temperature = null;
  };
}

export default function applyTemperature(worldObject, arg = {}) {
  worldObject.Temperature = worldObject.Temperature || new Temperature(worldObject, arg);
}
