const tskInput = document.getElementById("Taskinput");
const addBTn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const clearBtn = document.getElementById("clearBtn");
const themeBtn = document.getElementById("themeBtn");
let tasks = [];

// new logic for rendering the list deleting tasks and also a checkbox
function renderList() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const newLi = document.createElement("li");
    newLi.style.textDecoration = task.done ? "line-through" : "none"; // strikethrough if done

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      tasks[index].done = !tasks[index].done;
      renderList();
      saveTasks();
    });

    newLi.textContent = `${task.text} - ${task.date} ${task.time}`;
    newLi.prepend(checkbox);

    const delBtn = document.createElement("button");
    delBtn.textContent = "x";
    delBtn.style.marginLeft = "10px";
    delBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      renderList();
      saveTasks();
    });

    newLi.appendChild(delBtn);
    taskList.appendChild(newLi);
  });
}

function addTask() {
  const taskText = tskInput.value.trim();
  if (taskText !== "") {
    const newTask = {
      text: taskText,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      done: false,
    };
    tasks.push(newTask); // push the object
    renderList();
    saveTasks();
    tskInput.value = "";
  }
}

addBTn.addEventListener("click", addTask);
tskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    const parsed = JSON.parse(saved);
    tasks = parsed.map((t) => {
      if (typeof t === "string") {
        // fixed typo
        return { text: t, time: "" };
      }
      return t;
    });
    renderList();
  }
}

loadTasks();

function clearTasks() {
  tasks = [];
  renderList();
  saveTasks();
}

clearBtn.addEventListener("click", clearTasks);

// logic for dark mode toggle and also remembers choice

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("darkMode", isDark);
}

themeBtn.addEventListener("click", toggleTheme);

// Load saved theme on start
const savedDark = localStorage.getItem("darkMode") === "true";
if (savedDark) {
  document.body.classList.add("dark-mode");
  themeBtn.textContent = "☀️ Light Mode";
}
