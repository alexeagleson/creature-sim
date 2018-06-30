
import { isNotObject, isFood } from './../main/filters';

function DecisionAI(worldObject) {
  this.owner = worldObject;
  World.allObjectsDecisionAI.push(this.owner);

  this.updatePriorities = () => {
    this.priorities = [
      { need: 'Hunger', priority: this.owner.Consumer ? this.owner.Consumer.getHungerPriority() : null },
      // { need: 'Thirst', priority: this.owner.Consumer ? this.owner.Consumer.getThirstPriority() : null },
      // { need: 'Hot', priority: this.owner.Temperature ? this.owner.Temperature.getHotPriority() : null },
      { need: 'Cold', priority: this.owner.Temperature ? this.owner.Temperature.getColdPriority() : null },
      { need: 'Speak', priority: this.owner.Social ? this.owner.Social.getSocialPriority() : null },
      { need: 'Sleep', priority: this.owner.Living ? this.owner.Living.getSleepPriority() : null },
    ];
    this.priorities.sort((a, b) => a.priority - b.priority);
  };

  this.generateNewTask = () => {
    if (this.owner.Memory.knownObjects.filter(isFood).length === 0) {
      this.owner.Task.initializeTask('explore');
    } else {
      this.owner.Task.initializeTask('food');
    }

    if (!this.owner.Task.currentlyActive) this.owner.Moving.moveRandom();
    return true;
  };

  this.revokePrototype = () => {
    World.allObjectsDecisionAI = World.allObjectsDecisionAI.filter(isNotObject.bind(this.owner));
    this.owner.DecisionAI = null;
  };
}

const applyDecisionAI = (worldObject, arg = {}) => {
  worldObject.DecisionAI = worldObject.DecisionAI || new DecisionAI(worldObject, arg);
};

export default applyDecisionAI;
