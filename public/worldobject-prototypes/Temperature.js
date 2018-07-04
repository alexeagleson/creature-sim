import { isNotObject } from './../main/filters';
import { normalizeToValue } from './../main/general-utility';
import { displayDialogue } from './../ui/components/HoveringText';

const TEMP_ADJUSTMENT_FACTOR = 20;

function Temperature(worldObject) {
  this.owner = worldObject;
  World.allObjectsTemperature.push(this.owner);

  this.temp = ProtoCs.COMFORTABLE_TEMP;
  this.takingTemperatureDamage = false;

  this.adjustTemperatureActive = false;

  this.startAdjustTemperature = () => { this.adjustTemperatureActive = true; };
  this.stopAdjustTemperature = () => { this.adjustTemperatureActive = false; };
  this.adjustTemperatureTurn = () => {
    displayDialogue(this.owner, '*adjusting temp*');
    this.temp = this.temp > 20 ? this.temp - 1 : this.temp + 1;
    if (this.temp >= 15 && this.temp <= 25) this.stopAdjustTemperature();
  };

  this.coldValue = () => normalizeToValue(100 + (this.temp - ProtoCs.COMFORTABLE_TEMP), 0, 100);
  this.hotValue = () => normalizeToValue(100 - (this.temp - ProtoCs.COMFORTABLE_TEMP), 0, 100);

  this.isCold = () => this.temp < ProtoCs.COMFORTABLE_TEMP - ProtoCs.COMFORTABLE_TEMP_VARIANCE;
  this.isHot = () => this.temp > ProtoCs.COMFORTABLE_TEMP + ProtoCs.COMFORTABLE_TEMP_VARIANCE;
  this.isComfortable = () => this.temp > (ProtoCs.COMFORTABLE_TEMP - ProtoCs.COMFORTABLE_TEMP_VARIANCE) && this.temp < (ProtoCs.COMFORTABLE_TEMP + ProtoCs.COMFORTABLE_TEMP_VARIANCE);

  this.getColdPriority = () => Math.round(normalizeToValue(this.coldValue() - (100 - this.coldValue()), 0, 100));
  this.getHotPriority = () => Math.round(normalizeToValue(this.hotValue() - (100 - this.hotValue()), 0, 100));

  this.adjustTemperature = (timePassedMilliseconds) => {
    let differenceBetweenWeatherAndCurrent = this.owner.WorldMap.mapTemp - this.temp;

    if (this.owner.Equipper) {
      if (differenceBetweenWeatherAndCurrent < 0 && this.owner.Equipper.currentEquipment) {
        const protection = this.owner.Equipper.currentEquipment.Equipment.temperatureProtection;
        differenceBetweenWeatherAndCurrent *= (100 - protection) / 100;
      }
    }

    this.temp += (differenceBetweenWeatherAndCurrent / timePassedMilliseconds) * TEMP_ADJUSTMENT_FACTOR;
    this.adjustConditionBasedOnTemperature();
  };

  this.adjustConditionBasedOnTemperature = () => {
    let tempAffectsCondition = Math.abs(ProtoCs.COMFORTABLE_TEMP - this.temp);
    tempAffectsCondition = normalizeToValue((tempAffectsCondition - ProtoCs.COMFORTABLE_TEMP_VARIANCE), 0, 100);

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

const applyTemperature = (worldObject, arg = {}) => {
  worldObject.Temperature = worldObject.Temperature || new Temperature(worldObject, arg);
};

export default applyTemperature;
