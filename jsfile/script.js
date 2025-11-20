import { Project } from "./Project.js";

const Projectcontainer = document.querySelector(".ProjectContainer");
const addbtn = document.querySelector(".AddProject");
const Dialog = document.querySelector(".ProjectDescription");
const cancelbtn = document.querySelector(".cancel");
const confirmbtn = document.querySelector(".confirm");
const input = document.getElementById("project-name");
const description = document.getElementById("description");
const MainProjectTitle = document.querySelector(".ProjectTitle");
const addTaskBtn = document.querySelector(".AddTaskBtn");
const TaskDialog = document.querySelector(".TaskDescription");
const TaskNameInput = document.getElementById("TaskName");
const SubmitTaskBtn = document.querySelector(".submitTask");
const CancelTaskBtn = document.querySelector(".cancelTask");
const ToDoListContainer = document.querySelector(".Todolist");

let Projects = [];
let activeProject = null;

/* ------------------------------------------------
   LOCAL STORAGE LOAD
-------------------------------------------------- */

function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("Projects"));
    const activeId = Number(localStorage.getItem("ActiveProjectId"));

    Projects = (data || []).map(p => {
        const proj = new Project(p.name, p.desc);
        proj.id = p.id;
        proj.todos = p.todos;
        return proj;
    });

    activeProject = Projects.find(p => p.id === activeId) || Projects[0] || null;
}

/* ------------------------------------------------
   SAVE TO LOCAL STORAGE
-------------------------------------------------- */

function saveToLocalStorage() {
    localStorage.setItem("Projects", JSON.stringify(Projects));
    localStorage.setItem("ActiveProjectId", activeProject ? activeProject.id : "");
}

/* ------------------------------------------------
   ADD PROJECT
-------------------------------------------------- */

addbtn.addEventListener("click", () => Dialog.showModal());
cancelbtn.addEventListener("click", () => Dialog.close());

confirmbtn.addEventListener("click", () => {
    const name = input.value.trim();
    const desc = description.value.trim();

    if (!name) return alert("Enter project name");

    const newProject = new Project(name, desc);
    Projects.push(newProject);
    activeProject = newProject;

    input.value = "";
    description.value = "";
    Dialog.close();

    saveToLocalStorage();
    renderUI();
});

/* ------------------------------------------------
   ADD TASK
-------------------------------------------------- */

addTaskBtn.addEventListener("click", () => {
    if (!activeProject) return alert("Select a project first");
    TaskDialog.showModal();
});

SubmitTaskBtn.addEventListener("click", () => {
    const task = TaskNameInput.value.trim();
    if (!task) return alert("Enter task");

    activeProject.addTodo(task);
    TaskDialog.close();
    TaskNameInput.value = "";

    saveToLocalStorage();
    renderUI();
});

CancelTaskBtn.addEventListener("click", () => {
    TaskDialog.close();
    TaskNameInput.value = "";
});

/* ------------------------------------------------
   DISPLAY PROJECTS
-------------------------------------------------- */

function displayProjects() {
    Projectcontainer.innerHTML = "";

    Projects.forEach(project => {
        Projectcontainer.insertAdjacentHTML(
            "beforeend",
            `
            <div class="ProjectItemSidebar" data-id="${project.id}">
                <span class="project-name">${project.name}</span>
                <button class="delete-project" data-id="${project.id}">✖</button>
            </div>
            `
        );
    });
}

/* ------------------------------------------------
   PROJECT CLICK HANDLER
-------------------------------------------------- */

Projectcontainer.addEventListener("click", (e) => {
    // DELETE PROJECT
    if (e.target.matches(".delete-project")) {
        const id = Number(e.target.dataset.id);

        Projects = Projects.filter(p => p.id !== id);

        if (activeProject?.id === id) {
            activeProject = Projects[0] || null;
        }

        saveToLocalStorage();
        renderUI();
        return;
    }

    // SELECT PROJECT
    const item = e.target.closest(".ProjectItemSidebar");
    if (!item) return;

    const id = Number(item.dataset.id);
    activeProject = Projects.find(p => p.id === id);

    saveToLocalStorage();
    renderUI();
});

/* ------------------------------------------------
   HIGHLIGHT ACTIVE PROJECT
-------------------------------------------------- */

function highlightActiveProject() {
    document.querySelectorAll(".ProjectItemSidebar").forEach(item => {
        item.classList.toggle(
            "active",
            activeProject && Number(item.dataset.id) === activeProject.id
        );
    });
}

/* ------------------------------------------------
   DISPLAY TODOS
-------------------------------------------------- */

function displayTodos() {
    ToDoListContainer.innerHTML = "";
    if (!activeProject) return;

    activeProject.getTodos().forEach((todo, index) => {
        ToDoListContainer.insertAdjacentHTML(
            "beforeend",
            `
            <li class="task-item">
                <input type="checkbox" class="task-check" data-index="${index}" ${todo.completed ? "checked" : ""}>
                <span>${todo.todoTask}</span>
                <button class="delete-task" data-index="${index}">X</button>
            </li>
            `
        );
    });
}

ToDoListContainer.addEventListener("change", (e) => {
    if (!e.target.matches(".task-check")) return;

    const idx = Number(e.target.dataset.index);
    activeProject.todos[idx].completed = e.target.checked;

    saveToLocalStorage();
    displayTodos();
});

ToDoListContainer.addEventListener("click", (e) => {
    if (!e.target.matches(".delete-task")) return;

    const idx = Number(e.target.dataset.index);
    activeProject.deleteTodo(idx);

    saveToLocalStorage();
    displayTodos();
});

/* ------------------------------------------------
   RENDER ALL
-------------------------------------------------- */

function renderUI() {
    displayProjects();
    highlightActiveProject();
    displayTodos();

    MainProjectTitle.innerText = activeProject ? activeProject.name : "No Project Selected";
}

/* ------------------------------------------------
   INIT
-------------------------------------------------- */

loadFromLocalStorage();
renderUI();
