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

  this.objectTemp = document.createElement('p');
  this.objectTemp.innerHTML = `Temperature: ${World.player.Temperature.temp}`;
  this.owner.htmlElement.append(this.objectTemp);

  this.mapTemp = document.createElement('p');
  this.mapTemp.innerHTML = `Map Temperature: ${World.player.WorldMap.temp}`;
  this.owner.htmlElement.append(this.mapTemp);

  this.update = function() {
    this.objectCondition.innerHTML = `Condition: ${Math.round(World.player.Destructible.condition)}/100`;
    this.objectStamina.innerHTML = `Stamina: ${Math.round(World.player.Living.stamina)}/100`;
    this.objectHunger.innerHTML = `Hunger: ${Math.round(World.player.Consumer.hunger)}/100`;
    this.objectThirst.innerHTML = `Thirst: ${Math.round(World.player.Consumer.thirst)}/100`;
    this.objectTemp.innerHTML = `Temperature: ${Math.round(World.player.Temperature.temp)}`;
    this.mapTemp.innerHTML = `Map Temperature: ${Math.round(World.player.WorldMap.temp)}`;
  };

};
