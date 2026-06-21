const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button class="complete-btn" data-id="${task.id}">
          ${task.completed ? "Undo" : "Done"}
        </button>
        <button class="delete-btn" data-id="${task.id}">
          Delete
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Add task
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();

  if (text === "") {
    alert("Please enter a task");
    return;
  }

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
});

// Event Delegation
taskList.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);

  if (e.target.classList.contains("complete-btn")) {
    tasks = tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );
  }

  if (e.target.classList.contains("delete-btn")) {
    tasks = tasks.filter(task => task.id !== id);
  }

  saveTasks();
  renderTasks();
});

// Filters
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Initial Load
renderTasks();
