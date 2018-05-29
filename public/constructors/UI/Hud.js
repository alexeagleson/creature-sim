const Hud = function(uiObject) {
  this.owner = uiObject;

  this.objectName = document.createElement('p');
  this.objectName.innerHTML = World.player.name;
  this.owner.htmlElement.append(this.objectName);

  this.objectCondition = document.createElement('p');
  this.objectCondition.innerHTML = `Condition: ${World.player.Destructible.condition}/100`;
  this.owner.htmlElement.append(this.objectCondition);

  this.objectStamina = document.createElement('p');
  this.objectStamina.innerHTML = `Stamina: ${World.player.Living.stamina}/100`;
  this.owner.htmlElement.append(this.objectStamina);

  this.objectHunger = document.createElement('p');
  this.objectHunger.innerHTML = `Hunger: ${World.player.Consumer.hunger}/100`;
  this.owner.htmlElement.append(this.objectHunger);

  this.objectThirst = document.createElement('p');
  this.objectThirst.innerHTML = `Thirst: ${World.player.Consumer.thirst}/100`;
  this.owner.htmlElement.append(this.objectThirst);

  this.objectSocial = document.createElement('p');
  this.objectSocial.innerHTML = `Social: ${World.player.Social.socialLevel}/100`;
  this.owner.htmlElement.append(this.objectSocial);

  this.objectTemp = document.createElement('p');
  this.objectTemp.innerHTML = `Temperature: ${World.player.Temperature.temp}`;
  this.owner.htmlElement.append(this.objectTemp);

  this.mapTemp = document.createElement('p');
  this.mapTemp.innerHTML = `Map Temperature: ${World.player.WorldMap.temp}`;
  this.owner.htmlElement.append(this.mapTemp);

  this.objectEquipment = document.createElement('p');
  this.objectEquipment.innerHTML = `Equipment: N/A`;
  this.owner.htmlElement.append(this.objectEquipment);

  this.update = function() {
    this.objectName.innerHTML = this.owner.hudTargetObject.name;
    this.objectCondition.innerHTML = this.owner.hudTargetObject.Destructible ? `Condition: ${Math.round(this.owner.hudTargetObject.Destructible.condition)}/100` : `Condition: N/A`;
    this.objectStamina.innerHTML = this.owner.hudTargetObject.Living ? `Stamina: ${Math.round(this.owner.hudTargetObject.Living.stamina)}/100` : `Stamina: N/A`;
    this.objectHunger.innerHTML = this.owner.hudTargetObject.Consumer ? `Hunger: ${Math.round(this.owner.hudTargetObject.Consumer.hunger)}/100` : `Hunger: N/A`;
    this.objectThirst.innerHTML = this.owner.hudTargetObject.Consumer ? `Thirst: ${Math.round(this.owner.hudTargetObject.Consumer.thirst)}/100` : `Thirst: N/A`;
    this.objectSocial.innerHTML = this.owner.hudTargetObject.Social ? `Social: ${Math.round(this.owner.hudTargetObject.Social.socialLevel)}/100` : `Social: N/A`;
    this.objectTemp.innerHTML = this.owner.hudTargetObject.Temperature ? `Temperature: ${Math.round(this.owner.hudTargetObject.Temperature.temp)}` : `Temperature: N/A`;
    this.objectEquipment.innerHTML = this.owner.hudTargetObject.Living
      ? this.owner.hudTargetObject.Equipper.currentEquipment
        ? `Equipment: ${this.owner.hudTargetObject.Equipper.currentEquipment.name}`
        : `Equipment: None`
      : `Equipment: N/A`;
  };

  // badcode add time later
  //        World.rotDisplay.drawText(2, 2, millisecondsToHHMMSS(World.Time.millisecondsSinceDayStart()), MAIN_DISPLAY_TILE_WIDTH);
  World.allUI.mainWrapper.addChildMenu(this.owner.htmlElement);
};
