import { uniqueNumber } from './../main/general-utility';
import { estimateTotalDistance } from './../main/world-utility';

export default function Task(taskOwner, taskType) {
  this.taskOwner = taskOwner;
  this.taskType = taskType;
  this.uniqueID = uniqueNumber();
  this.currentAction = () => null;
  this.successCondition = () => null;
  this.onSuccess = () => null;
  this.onFail = () => null;

  this.prerequisiteTask = null;
  this.followUpTask = null;
  this.target = null;

  this.getPriority = () => null;

  this.estimatedActionsToComplete = () => this.target ? estimateTotalDistance(this.taskOwner, this.target) : null;

  this.updatePriorityVsDistance = () => { this.priorityVsDistance = Math.round(this.estimatedActionsToComplete() * this.getPriority()); };
}
