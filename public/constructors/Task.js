import { uniqueNumber } from './../main/general-utility';
import { estimateTotalDistance } from './../main/world-utility';

export default function Task(taskOwner, taskType) {
  this.taskOwner = taskOwner;
  this.taskType = taskType;
  this.uniqueID = uniqueNumber();

  this.taskTarget = null;
  this.successProximity = 1;

  this.locateTarget = () => null;
  this.calculatePathToTarget = () => this.taskOwner.Pathing.createPath({ pathTo: this.taskTarget });
  this.pathTowardTarget = () => this.taskOwner.Pathing.movePath();
  this.successCondition = () => this.taskOwner.isAdjacentTo(this.taskTarget, this.successProximity);
  this.onSuccess = () => null;
  this.onFail = () => null;

  // this.getPriority = () => null;
  // this.estimatedActionsToComplete = () => this.target ? estimateTotalDistance(this.taskOwner, this.target) : null;
  // this.updatePriorityVsDistance = () => { this.priorityVsDistance = Math.round(this.estimatedActionsToComplete() * this.getPriority()); };
}
