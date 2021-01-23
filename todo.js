const toDoForm = document.querySelector(".js-toDoForm"),
  toDoInput = toDoForm.querySelector("input"),
  toDoList = document.querySelector(".js-toDoList"),
  doneList = document.querySelector(".js-doneList");

const TODOS_LS = "toDos";

let toDos = [];

function deleteToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  if (li.parentNode === doneList) {
    doneList.removeChild(li);
  } else {
    toDoList.removeChild(li);
  }
  toDos = toDos.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
  });
  saveToDos();
}

function finishToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const undoBtn = document.createElement("button");
  undoBtn.innerText = "🔙";
  undoBtn.addEventListener("click", undoToDo);
  li.removeChild(li.lastChild);
  li.appendChild(undoBtn);
  toDos.forEach(function (toDo) {
    if (toDo.id === parseInt(li.id)) {
      toDo.isDone = true;
    }
  });
  toDoList.removeChild(li);
  doneList.appendChild(li);
  saveToDos();
}

function undoToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const finBtn = document.createElement("button");
  finBtn.innerText = "✔";
  finBtn.addEventListener("click", finishToDo);
  li.removeChild(li.lastChild);
  li.appendChild(finBtn);
  toDos.forEach(function (toDo) {
    if (toDo.id === parseInt(li.id)) {
      toDo.isDone = false;
    }
  });

  doneList.removeChild(li);
  toDoList.appendChild(li);
  saveToDos();
}

function saveToDos() {
  localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
}

function paintToDo(text, isDone) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const span = document.createElement("span");
  const newId = toDos.length + 1;
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deleteToDo);
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.id = newId;
  if (isDone) {
    const undoBtn = document.createElement("button");
    undoBtn.innerText = "🔙";
    undoBtn.addEventListener("click", undoToDo);
    li.appendChild(undoBtn);
    doneList.appendChild(li);
  } else {
    const finBtn = document.createElement("button");
    finBtn.innerText = "✔";
    finBtn.addEventListener("click", finishToDo);
    li.appendChild(finBtn);
    toDoList.appendChild(li);
  }
  const toDoObj = {
    text: text,
    id: newId,
    isDone,
  };
  toDos.push(toDoObj);
  saveToDos();
}

function handleSubmit(event) {
  event.preventDefault();
  const currentValue = toDoInput.value;
  paintToDo(currentValue, false);
  toDoInput.value = "";
}

function loadToDos() {
  const loadedToDos = localStorage.getItem(TODOS_LS);
  if (loadedToDos !== null) {
    const parsedToDos = JSON.parse(loadedToDos);
    parsedToDos.forEach(function (toDo) {
      paintToDo(toDo.text, toDo.isDone);
    });
  }
}

function init() {
  loadToDos();
  toDoForm.addEventListener("submit", handleSubmit);
}

init();
