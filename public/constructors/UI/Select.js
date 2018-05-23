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

    this.writtenTextElement.value = arg.writtenText
    for (let i = 0; i < arg.buttonText.length; i++) {
      const thisButton = document.createElement('button');
      thisButton.innerText = arg.buttonText[i];
      thisButton.onclick = arg.buttonFunctions[i];
      this.owner.htmlElement.append(thisButton);
      this.buttonElements.push(thisButton);
    }

    this.owner.moveToObject(World.player);
    this.owner.show();
  };

  this.clear = function() {
    this.writtenTextElement.value = '';
    this.buttonElements.forEach((buttonElement) => {
      buttonElement.parentElement.removeChild(buttonElement);
    });
    this.buttonElements = [];
  };
};

function prepareContextMenu(arg = { writtenText: null, objectActivating: null, objectBeingActivated: null }) {
  const buttonText = [];
  const buttonFunctions = [];

  if (arg.objectBeingActivated.Consumable) {
    buttonText.push('Eat');
    buttonFunctions.push(() => {
      arg.objectActivating.Consumer.consume(arg.objectBeingActivated);
      World.allUI.selectUI.hide();
    });
  }

  if (arg.objectBeingActivated.Item) {
    buttonText.push('Pick Up');
    buttonFunctions.push(() => {
      arg.objectActivating.Inventory.addToInventory(arg.objectBeingActivated);
      World.allUI.selectUI.hide();
    });
  }

  return { writtenText: arg.writtenText, buttonText: buttonText, buttonFunctions: buttonFunctions };
};
