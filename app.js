const init = () => {
  // const init = function () {
  const addToDoButton = document.getElementById('addToDo');
  const inputField = document.getElementById('inputField');
  const ulToDo = document.querySelector('#ulToDo');

  addToDoButton.addEventListener('click', addToDo);

  const keyup = function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addToDoButton.click();
    }
  };

  inputField.addEventListener('keyup', keyup);
};

window.addEventListener('DOMContentLoaded', init);

function addToDo() {
  if (inputField.value === '') {
    alert('Bitte ein To Do eintragen.');
    return;
  }

  const span = document.createElement('span');
  span.innerText = inputField.value;
  span.classList.add('span');

  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('checkbox');

  const editToDoButton = document.createElement('button');
  editToDoButton.addEventListener('click', editToDo);
  editToDoButton.classList.add('editToDoButton');
  editToDoButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';

  const deleteToDoButton = document.createElement('button');
  deleteToDoButton.addEventListener('click', deleteToDo);
  deleteToDoButton.classList.add('deleteToDoButton');
  deleteToDoButton.innerHTML = '<i class="fas fa-trash-alt"></i>';

  const inputEdit = document.createElement('input');
  inputEdit.type = 'text';
  inputEdit.classList.add('input-hidden');
  inputEdit.classList.add('edit');

  li.appendChild(checkbox);
  li.appendChild(inputEdit);
  li.appendChild(span);
  li.appendChild(editToDoButton);
  li.appendChild(deleteToDoButton);
  ulToDo.appendChild(li);

  inputField.value = '';
}

function deleteToDo(event) {
  event.target.parentElement?.remove?.();
  // if (
  //   event.target.parentElement &&
  //   event.target.parentElement.nodeName === 'LI'
  // ) {
  //   event.target.parentElement.remove();
  // } else {
  //   event.target.parentElement.parentElement.remove();
  // }
}

function editToDo(event) {
  //BUG: Wenn man ein zweites mal bearbeitet, geht enter bestätigung nicht mehr
  let editToDoButton = event.target;
  let span = event.target.parentElement.querySelector('span');
  const inputEdit = event.target.parentElement.querySelector('.edit');

  span.classList.toggle('span-hidden');
  inputEdit.classList.toggle('input-visible');
  inputEdit.value = span.textContent;

  const editKeyUp = function (event) {
    if (event.key === 'Enter') {
      console.log('hallo');
      event.preventDefault();
      span.textContent = inputEdit.value;
      span.classList.toggle('span-hidden');
      inputEdit.classList.toggle('input-visible');
    }
  };

  inputEdit.addEventListener('keyup', editKeyUp);

  // ----- Alte Methode ↓ -----
  // const input = document.createElement('input');
  // const span = event.target.parentElement.querySelector('span');
  // input.type = 'text';
  // span.replaceWith(input);
  // input.value = span.innerText;
  // const input = document.createElement('input');
  // let text = span.textContent;
  // input.type = 'text';
  // span.replaceWith(input);
  // input.value += text;
  // input.addEventListener('keyup', function (event) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //     input.replaceWith(span);
  //     span.textContent = input.value;
  //   }
  // });
}
