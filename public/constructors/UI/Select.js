const Select = function(uiObject) {
  this.owner = uiObject;
  this.writtenTextElement = document.createElement('p');
  this.owner.htmlElement.append(this.writtenTextElement);
  this.buttonElements = [];

  this.prompt = function(arg = {writtenText: null, buttonText: [], buttonFunctions: []}) {
    this.clear();

    if (arg.buttonText.length != arg.buttonFunctions.length) {
      displayError(`Length of buttonText does not match length of buttonFunctions array in prompt ${writtenText}.`)
      return null;
    }

    this.writtenTextElement.innerHTML = arg.writtenText
    for (let i = 0; i < arg.buttonText.length; i++) {
      const thisButton = document.createElement('button');
      thisButton.innerText = arg.buttonText[i];
      thisButton.onclick = arg.buttonFunctions[i];
      this.owner.htmlElement.append(thisButton);
      this.buttonElements.push(thisButton);
    }

    this.owner.show();
  };

  this.clear = function() {
    this.writtenTextElement.value = '';
    this.buttonElements.forEach((buttonElement) => {
      buttonElement.parentElement.removeChild(buttonElement);
    });
    this.buttonElements = [];
  };

  World.allUI.mainWrapper.addChildMenu(this.owner.htmlElement);
};

function promptSelectObject(listOfObjects) {
  if (listOfObjects.length === 0) { return null; }
  World.allUI.selectUI.Select.prompt({
    writtenText: 'Select Object',
    buttonText: listOfObjects.map(worldObject => worldObject.name),
    buttonFunctions: listOfObjects.map(worldObject => () => {
      World.allUI.selectUI.Select.prompt(prepareContextMenu({ writtenText: 'Take what action:', objectActivating: World.player, objectBeingActivated: worldObject }));
    })
  });
}

function prepareContextMenu(arg = { writtenText: null, objectActivating: null, objectBeingActivated: null }) {
  const buttonText = [];
  const buttonFunctions = [];

  if (arg.objectActivating.Consumer) {
    if (arg.objectActivating.Consumer.canIConsumeObject(arg.objectBeingActivated)) {
      buttonText.push('Eat');
      buttonFunctions.push(() => {
        arg.objectActivating.Consumer.consume(arg.objectBeingActivated);
        World.allUI.selectUI.hide();
      });
    }
  }

  if (arg.objectActivating.Inventory) {
    if (arg.objectActivating.Inventory.canIAddToInventory(arg.objectBeingActivated)) {
      buttonText.push('Pick Up');
      buttonFunctions.push(() => {
        arg.objectActivating.Inventory.addToInventory(arg.objectBeingActivated);
        World.allUI.selectUI.hide();
      });
    }
  }


  if (arg.objectActivating.Equipper) {
    if (arg.objectActivating.Equipper.canIEquipObject(arg.objectBeingActivated)) {
      buttonText.push('Equip');
      buttonFunctions.push(() => {
        arg.objectActivating.Equipper.equip(arg.objectBeingActivated);
        World.allUI.selectUI.hide();
      });
    }
  }

  if (arg.objectActivating.Social) {
    if (arg.objectActivating.Social.canISpeakTo(arg.objectBeingActivated)) {
      buttonText.push('Speak');
      buttonFunctions.push(() => {
        arg.objectActivating.Social.speak(arg.objectBeingActivated);
        World.allUI.selectUI.hide();
      });
    }
  }

  if (arg.objectActivating.Combat) {
    if (arg.objectActivating.Combat.canIAttackObject(arg.objectBeingActivated)) {
      buttonText.push('Attack');
      buttonFunctions.push(() => {
        arg.objectActivating.Combat.attackObject(arg.objectBeingActivated);
        World.allUI.selectUI.hide();
      });
    }
  }

  return { writtenText: arg.writtenText, buttonText: buttonText, buttonFunctions: buttonFunctions };
};
