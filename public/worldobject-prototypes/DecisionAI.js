import evaluateHunger from './../ai/hunger';
import { publishEvent } from './../constructors/WorldEvent';

import { pickRandom } from './../main/general-utility';
import { isOnAMap, isOnMapOfObject, isNotObject, isSocial, isItem, isNamed, localPathSizeSort } from './../main/filters';

import { displayDialogue } from './../ui/components/HoveringText';

function DecisionAI(worldObject) {
  this.owner = worldObject;
  World.allObjectsDecisionAI.push(this.owner);

  if (!this.owner.TurnTaking) { applyTurnTaking(this.owner); }

  this.resetObjective = () => {
    this.hasObjective = false;
    this.currentAction = () => null;
    this.successCondition = () => null;
    this.onSuccess = () => null;
    this.onFail = () => null;
  };

  this.determineAction = () => {
    const objectsOnMyMap = World.allObjects.filter(isOnMapOfObject.bind(this.owner)).filter(isNotObject.bind(this.owner));

    evaluateHunger(this.owner);
    if (this.hasObjective) { return true; }

    if (this.owner.Social && this.owner.Social.socialLevel < ProtoCs.CONCERNED_VALUE) {
      const socialObjectsOnMyMap = objectsOnMyMap.filter(isSocial);
      socialObjectsOnMyMap.sort(localPathSizeSort.bind(this.owner));

      socialObjectsOnMyMap.some((socialObject) => {
        this.owner.Pathing.createPath({ pathTo: socialObject });
        publishEvent(`${this.owner.name} wants to talk to ${socialObject.name}.`);

        this.currentAction = () => {
          return this.owner.Pathing.movePath();
        };

        this.successCondition = () => {
          return this.owner.isAdjacentTo(socialObject, ProtoCs.SPEAK_MAX_DISTANCE);
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


    if (this.owner.Temperature && this.owner.WorldMap) {
      if (this.owner.Temperature.temp > 30) {
        if (this.owner.WorldMap.mapTemp > 30) {
          World.allMaps.some((worldMap) => {
            if (worldMap.mapTemp > 30) { return false; }

            this.owner.Pathing.createPath({ pathTo: worldMap });
            publishEvent(`${this.owner.name} wants to go to ${worldMap.name} because it's cooler there.`);
            displayDialogue(this.owner, pickRandom(['its too damn hot here']));

            this.currentAction = () => {
              return this.owner.Pathing.movePath();
            };

            this.successCondition = () => {
              return this.owner.worldMap === worldMap;
            };

            this.onSuccess = () => {
              displayDialogue(this.owner, pickRandom(['ok this is much better, much cooler here']));
              return true;
            };

            this.onFail = () => {
              publishEvent(`${this.owner.name} fails to reach ${worldMap.name}.`);
            };

            this.hasObjective = true;
            return true;
          });
        }
        if (this.owner.Moving) { this.owner.Moving.moveRandom(); }
        return false;
      }
    }
    if (this.hasObjective) { return true; }


    if (this.owner.Temperature && this.owner.WorldMap) {
      if (this.owner.Temperature.temp < 5) {
        if (this.owner.WorldMap.mapTemp < 5) {
          World.allMaps.some((worldMap) => {
            if (worldMap.mapTemp < 5) { return false; }

            this.owner.Pathing.createPath({ pathTo: worldMap });
            publishEvent(`${this.owner.name} wants to go to ${worldMap.name} because it's warmer there.`);
            displayDialogue(this.owner, pickRandom(['its WAY too cold!!']));

            this.currentAction = () => {
              return this.owner.Pathing.movePath();
            };

            this.successCondition = () => {
              return this.owner.worldMap === worldMap;
            };

            this.onSuccess = () => {
              displayDialogue(this.owner, pickRandom(['ok this is much better, much warmer here']));
              return true;
            };

            this.onFail = () => {
              publishEvent(`${this.owner.name} fails to reach ${worldMap.name}.`);
            };

            this.hasObjective = true;
            return true;
          });
        }
        if (this.owner.Moving) { this.owner.Moving.moveRandom(); }
        return false;
      }
    }
    if (this.hasObjective) { return true; }


    if (this.owner.Inventory) {
      const itemObjectsOnMyMap = objectsOnMyMap.filter(isItem);
      itemObjectsOnMyMap.sort(localPathSizeSort.bind(this.owner));

      itemObjectsOnMyMap.some((itemObject) => {
        this.owner.Pathing.createPath({ pathTo: itemObject });
        publishEvent(`${this.owner.name} wants to pick up ${itemObject.name}.`);
        displayDialogue(this.owner, pickRandom(['time to go pick up some garbage', 'look at this mess']));

        this.currentAction = () => {
          return this.owner.Pathing.movePath();
        };

        this.successCondition = () => {
          return this.owner.isAdjacentTo(itemObject, ProtoCs.INTERACT_MAX_DISTANCE);
        };

        this.onSuccess = () => {
          displayDialogue(this.owner, pickRandom(['who is leaving all this shit everywhere?', 'all i do is clean']));
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
      const treasureObjects = World.allObjects.filter(isNamed.bind('Treasure')).filter(isOnAMap);

      treasureObjects.some((treasureObject) => {
        this.owner.Pathing.createPath({ pathTo: treasureObject });
        publishEvent(`${this.owner.name} wants to go search for ${treasureObject.name}.`);

        this.currentAction = () => {
          return this.owner.Pathing.movePath();
        };

        this.successCondition = () => {
          return this.owner.isAdjacentTo(treasureObject, ProtoCs.INTERACT_MAX_DISTANCE);
        };

        this.onSuccess = () => {
          return this.owner.Inventory.addToInventory(treasureObject);
        };

        this.onFail = () => {
          publishEvent(`${this.owner.name} fails to pick up ${treasureObject.name}.`);
        };

        this.hasObjective = true;
        return true;
      });
    }
    if (this.hasObjective) { return true; }

    
    if (this.owner.Moving) { this.owner.Moving.moveRandom(); }
    return false;
  };

  this.revokePrototype = () => {
    World.allObjectsDecisionAI = World.allObjectsDecisionAI.filter(isNotObject.bind(this.owner));
    this.owner.DecisionAI = null;
  };

  this.resetObjective();
}

export default function applyDecisionAI(worldObject, arg = {}) {
  worldObject.DecisionAI = worldObject.DecisionAI || new DecisionAI(worldObject, arg);
}
