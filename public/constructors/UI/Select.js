const Select = function(uiObject) {
  this.owner = uiObject;
  this.objectButtons = [];

  this.promptObject = function(listOfObjects) {
    this.clear();
    listOfObjects.forEach((worldObject) => {
      const objectButton = document.createElement('button');
      objectButton.innerText = `${worldObject.name}`;
      objectButton.onclick = () => {
        this.promptAction(worldObject);
      };
      this.owner.htmlElement.append(objectButton);
      this.objectButtons.push(objectButton);
    });

    this.owner.moveToObject(World.player);
    this.owner.show();
  };

  this.promptAction = function(worldObject) {
    this.clear();

    if (worldObject.Consumable) {
      const objectButton = document.createElement('button');
      objectButton.innerText = `Consume`;
      objectButton.onclick = () => {
        World.player.Consumer.consume(worldObject);
        alert(worldObject.name + ' consumed');
        worldObject.destroy();
        this.owner.hide();
      };
      this.owner.htmlElement.append(objectButton);
      this.objectButtons.push(objectButton);
    }

    this.owner.moveToObject(World.player);
    this.owner.show();
  };

  this.clear = function() {
    this.objectButtons.forEach((buttonElement) => {
      buttonElement.parentElement.removeChild(buttonElement);
    });
    this.objectButtons = [];
  };
};
