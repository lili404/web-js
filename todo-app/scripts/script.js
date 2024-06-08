window.addEventListener("load", () => {
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const listElement = document.querySelector("#tasks");

  const getTasksFromLocalStorage = () =>
    JSON.parse(localStorage.getItem("todo-tasks") || "[]");

  const saveTasksToLocalStorage = (tasks) =>
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));

  const tasks = getTasksFromLocalStorage();
  tasks.forEach((task) => listElement.appendChild(createTaskElement(task)));

  form.addEventListener("submit", (n) => {
    n.preventDefault();

    const task = input.value.trim();
    if (!task) return alert("Fill up the task.");

    listElement.appendChild(createTaskElement(task));

    tasks.push(task);
    saveTasksToLocalStorage(tasks);
    input.value = "";
  });

  function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.innerHTML = `
      <div class="content">
        <input type="text" class="text" value="${task}" readonly>
      </div>
      <div class="actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    `;

    taskElement.classList.add("slide-in");

    const taskInput = taskElement.querySelector(".text");
    const editButton = taskElement.querySelector(".edit");
    const deleteButton = taskElement.querySelector(".delete");

    editButton.addEventListener("click", () => {
      if (editButton.innerText.toLowerCase() === "edit") {
        taskInput.removeAttribute("readonly");
        taskInput.focus();
        editButton.innerText = "Save";
      } else {
        const updatedTask = taskInput.value;
        tasks[task.indexOf(task)] = updatedTask;
        saveTasksToLocalStorage(tasks);
        taskInput.setAttribute("readonly", "readonly");
        editButton.innerText = "Edit";
      }
    });

    deleteButton.addEventListener("click", () => {
      taskElement.classList.add("slide-out");
      setTimeout(() => {
        tasks.splice(tasks.indexOf(task), 1);
        saveTasksToLocalStorage(tasks);
        listElement.removeChild(taskElement);
      }, 500);
    });

    return taskElement;
  }
});
