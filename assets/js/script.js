var task = [];
var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  if (taskNameInput === "" || taskTypeInput === "") {
    alert("You need to fill out the task form!");
    return false;
  }

  document.querySelector("input[name='task-name']").value = "";
  document.querySelector("select[name='task-type']").selectedIndex = 0;


  var isEdit = formEl.hasAttribute("data-task-id");

  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    };

    createTaskEl(taskDataObj);
  }
};

var createTaskEl = function(taskDataObj) {
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  listItemEl.setAttribute("data-task-id", taskIdCounter);
  listItemEl.setAttribute("draggable", "true");

  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);


  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);
  tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;
    task.push(taskDataObj)

  taskIdCounter++;
};

var createTaskActions = function(taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(editButtonEl);

  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(deleteButtonEl);

  var statusSelectEl = document.createElement("select");
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  statusSelectEl.className = "select-status";
  actionContainerEl.appendChild(statusSelectEl);

  var statusChoices = ["To Do", "In Progress", "Completed"];

  for (var i = 0; i < statusChoices.length; i++) {

    var statusOptionEl = document.createElement("option");
    statusOptionEl.setAttribute("value", statusChoices[i]);
    statusOptionEl.textContent = statusChoices[i];

    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;
};

var completeEditTask = function(taskName, taskType, taskId) {
    console.log(taskName, taskType, taskId);

  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  alert("Task Updated!");

  formEl.removeAttribute("data-task-id");
  formEl.querySelector("#save-task").textContent = "Add Task";
};

var taskButtonHandler = function(event) {
  var targetEl = event.target;

  if (targetEl.matches(".edit-btn")) {
    console.log("edit", targetEl);
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } else if (targetEl.matches(".delete-btn")) {
    console.log("delete", targetEl);
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var taskStatusChangeHandler = function(event) {
  console.log(event.target.value);

  var taskId = event.target.getAttribute("data-task-id");

  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  var statusValue = event.target.value.toLowerCase();

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);

    for (var i = 0; < task.length; i++){
        if (task[i].id === parseInt(taskId)){
            task[i].status = statusValue;
        }
    }
  }
};

var editTask = function(taskId) {
  console.log(taskId);

  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  console.log(taskName);

  var taskType = taskSelected.querySelector("span.task-type").textContent;
  console.log(taskType);

  for (var i = 0; i < task.length; i++){
      task[i].name = taskName;
      task[i].type = taskType;
  }

  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  formEl.setAttribute("data-task-id", taskId);
  formEl.querySelector("#save-task").textContent = "Save Task";
};

var deleteTask = function(taskId) {
  console.log(taskId);
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();

  var updatedTaskArr = [];

  for (var i = 0; i < task.length; i++){
      if (task[i].id !== parseInt(taskId)){
          updatedTaskArr.push(task[i]);
      }
  }

  task = updatedTaskArr;
};

var dropTaskHandler = function(event) {
    event.preventDefault();
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZone = event.target.closest(".task-list");
    dropZone.removeAttribute("style");
  
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    var statusType = dropZone.id;
  
    switch (statusType) {
      case "tasks-to-do":
        statusSelectEl.selectedIndex = 0;
        break;
      case "tasks-in-progress":
        statusSelectEl.selectedIndex = 1;
        break;
      case "tasks-completed":
        statusSelectEl.selectedIndex = 2;
        break;
      default:
        console.log("Something went wrong!");
    }
  
    dropZone.appendChild(draggableElement);

    for (var i = 0; i < task.length; i++){
        if (task [i].id === parseInt(id)){
            task[i].status = statusSelectEl.vaule.toLowerCase();
        }
    }
  };
  
  var dragTaskHandler = function(event) {
    if (event.target.matches("li.task-item")) {
      var taskId = event.target.getAttribute("data-task-id");
      event.dataTransfer.setData("text/plain", taskId);
    }
  };

  var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
      event.preventDefault();
      taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
  };
  
  var dragLeaveHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
  
    if (taskListEl) {
      event.target.closest(".task-list").removeAttribute("style");
    }
  };
  
  formEl.addEventListener("submit", taskFormHandler);
  
  pageContentEl.addEventListener("click", taskButtonHandler);
  
  pageContentEl.addEventListener("change", taskStatusChangeHandler);
  
  pageContentEl.addEventListener("dragstart", dragTaskHandler);
  pageContentEl.addEventListener("dragover", dropZoneDragHandler);
  pageContentEl.addEventListener("dragleave", dragLeaveHandler);
  pageContentEl.addEventListener("drop", dropTaskHandler);
  pageContentEl.addEventListener("dragleave", dragLeaveHandler);