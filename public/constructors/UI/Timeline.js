const Timeline = function(uiObject) {
  this.owner = uiObject;

  this.update = function() {
    removeAllChildren(this.owner.htmlElement);

    World.allEvents.forEach((event) => {
      const pElement = document.createElement('p');
      pElement.innerHTML = event.text;
      this.owner.htmlElement.append(pElement);
    });

  };

  World.allUI.mainWrapper.addChildMenu(this.owner.htmlElement);
};
