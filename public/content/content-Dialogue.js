
export function getDialogueByID(dialogueID, listenerObject) {
  let dialogue = null;
  switch (dialogueID) {
    case '5cb5d08d36337a277eb5e67a452d2c44':
      dialogue = 'Hello'; break;
    case '286e0c082433963be53c54e50101eb41':
      dialogue = 'Ok'; break;
    case '5ef3a151b344368b2de5355e74b50579':
      dialogue = `Good morning ${listenerObject.name}`; break;
    case 'c38a0bb682395f384684e52655f11738':
      dialogue = 'Good morning to you too'; break;
    case 'e836fbcd3447cb9c4b05da17cfa96064':
      dialogue = 'Good morning to POO'; break;
    case '78559f60c1505f3ab4a3921f62d6b882':
      dialogue = 'Dont talk to me'; break;
    case 'b9cb3efae1450b76f9e419403c5b0518':
      dialogue = `Yo ${listenerObject.name}`; break;
    case 'd4eb6639ad6a654ad7c06692079ce9dd':
      dialogue = `FINE`; break;
    case '689bfd0bc865228e4dda233b5b91bf96':
      dialogue = `Yes it is fine`; break;
    default:
      dialogue = `dialogue ID not found ${dialogueID}`;
  }
  return dialogue;
}

export function getResponsesByID(dialogueID) {
  const responses = [];
  switch (dialogueID) {
    case '5ef3a151b344368b2de5355e74b50579':
      responses.push('c38a0bb682395f384684e52655f11738', 'e836fbcd3447cb9c4b05da17cfa96064', '78559f60c1505f3ab4a3921f62d6b882'); break;
    case '78559f60c1505f3ab4a3921f62d6b882':
      responses.push('d4eb6639ad6a654ad7c06692079ce9dd'); break;
    case 'd4eb6639ad6a654ad7c06692079ce9dd':
      responses.push('689bfd0bc865228e4dda233b5b91bf96'); break;
    default:
  }
  return responses;
}
