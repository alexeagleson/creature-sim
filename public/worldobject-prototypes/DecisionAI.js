const DecisionAI = function(worldObject, arg = {}) {
  this.owner = worldObject;
  if (!this.owner.TurnTaking) { applyTurnTaking(this.owner); }

  this.resetObjective = function() {
    this.hasObjective = false;
    this.currentAction = () => null;
    this.successCondition = () => null;
    this.onSuccess = () => null;
    this.onFail = () => null;
  };

  this.determineAction = function() {
    const objectsOnMyMap = World.allObjects.filter(isOnMapOfObject.bind(this.owner)).filter(isNotObject.bind(this.owner));

    if (this.owner.Consumer && (this.owner.Consumer.hunger < CONCERNED_VALUE || this.owner.Consumer.thirst < CONCERNED_VALUE)) {
      const consumableObjectsOnMyMap = objectsOnMyMap.filter(isConsumable);
      consumableObjectsOnMyMap.sort(shortestPathToSort.bind(this.owner));

      consumableObjectsOnMyMap.some((consumableObject) => {
        if ((consumableObject.Consumable.hungerValue > 0 && this.owner.Consumer.hunger < CONCERNED_VALUE) || (consumableObject.Consumable.thirstValue > 0 && this.owner.Consumer.thirst < CONCERNED_VALUE)) {
          this.owner.Pathing.createPath({pathTo: consumableObject});
          //this.owner.Pathing.createMultiMapPath();
          publishEvent(`${this.owner.name} wants to consume ${consumableObject.name}.`);

          this.currentAction = () => {
            return this.owner.Pathing.movePath();
          };

          this.successCondition = () => {
            return this.owner.isAdjacentTo(consumableObject);
          };

          this.onSuccess = () => {
            return this.owner.Consumer.consume(consumableObject);
          };

          this.onFail = () => {
            publishEvent(`${this.owner.name} fails to consume ${consumableObject.name}.`);
            displayDialogue(this.owner, `what the fuck where did the ${consumableObject.name} go`);
          };

          this.hasObjective = true;
          return true;
        }
        return false;
      });
    }

    if (this.hasObjective) { return true; }

    if (this.owner.Social && this.owner.Social.socialLevel < CONCERNED_VALUE) {
      const socialObjectsOnMyMap = objectsOnMyMap.filter(isSocial);
      socialObjectsOnMyMap.sort(shortestPathToSort.bind(this.owner));

      socialObjectsOnMyMap.some((socialObject) => {
        this.owner.Pathing.createPath({pathTo: socialObject});
        publishEvent(`${this.owner.name} wants to talk to ${socialObject.name}.`);

        this.currentAction = () => {
          return this.owner.Pathing.movePath();
        };

        this.successCondition = () => {
          return this.owner.isAdjacentTo(socialObject, SPEAK_MAX_DISTANCE);
        };

        this.onSuccess = () => {
          return this.owner.Social.speak(socialObject);
        };

        this.onFail = () => {
          publishEvent(`${this.owner.name} fails to speak to ${socialObject.name}.`);
          displayDialogue(this.owner, `dammit ${socialObject.name} stop moving im trying to talk to you`);
        };

        this.hasObjective = true;
        return true;
      });
    }

    if (this.hasObjective) { return true; }

    if (this.owner.Inventory) {
      const itemObjectsOnMyMap = objectsOnMyMap.filter(isItem);
      itemObjectsOnMyMap.sort(shortestPathToSort.bind(this.owner));

      itemObjectsOnMyMap.some((itemObject) => {
        this.owner.Pathing.createPath({pathTo: itemObject});
        publishEvent(`${this.owner.name} wants to pick up ${itemObject.name}.`);

        this.currentAction = () => {
          return this.owner.Pathing.movePath();
        };

        this.successCondition = () => {
          return this.owner.isAdjacentTo(itemObject, INTERACT_MAX_DISTANCE);
        };

        this.onSuccess = () => {
          return this.owner.Inventory.addToInventory(itemObject);
        };

        this.onFail = () => {
          publishEvent(`${this.owner.name} fails to pick up ${itemObject.name}.`);
        };

        this.hasObjective = true;
        return true;
      });
    }

    if (this.hasObjective) { return true; }

    if (this.owner.Inventory) {
      const treasureObjects = World.allObjects.filter(isNamed.bind('Treasure'));

      treasureObjects.some((treasureObject) => {
        this.owner.Pathing.createPath({pathTo: treasureObject});
        publishEvent(`${this.owner.name} wants to go search for ${treasureObject.name}.`);

        this.currentAction = () => {
          return this.owner.Pathing.movePath();
        };

        this.successCondition = () => {
          return this.owner.isAdjacentTo(treasureObject, INTERACT_MAX_DISTANCE);
        };

        this.onSuccess = () => {
          return this.owner.Inventory.addToInventory(treasureObject);
        };

        this.onFail = () => {
          publishEvent(`${this.owner.name} fails to pick up ${itemObject.name}.`);
        };

        this.hasObjective = true;
        return true;
      });
    }

    if (this.hasObjective) { return true; }

    return false;
  };

  this.resetObjective();
};

function applyDecisionAI(worldObject, arg = {}) {
  worldObject.DecisionAI = worldObject.DecisionAI || new DecisionAI(worldObject, arg);
};
