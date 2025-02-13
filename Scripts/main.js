document.addEventListener("DOMContentLoaded", function(){
    const taskInput = document.getElementById("task-input");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");
    loadTasks();


    function addTask(){
        const taskText = taskInput.value.trim();
        if(taskText === "") return;

        const li = document.createElement("li");
        li.innerHTML = `${taskText} <button class=delete-btn>X</button>`;

        taskList.appendChild(li);
        taskInput.value = "";

        saveTasks();

        li.querySelector(".delete-btn").addEventListener("click", function(){
            li.remove();
        })
    }

    function saveTasks(){
        const tasks = [];
        document.querySelectorAll("#task-list li").forEach(li => {
            tasks.push(li.textContent.replace("X","").trim());
        })
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks(){
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task =>{
            const li = document.createElement("li");
            li.innerHTML = `${task} <button class="delete-btn">X</button>`;
            taskList.appendChild(li);

            li.querySelector(".delete-btn").addEventListener("click", function(){
                li.remove();
                saveTasks();
            })
        })
        
    }

    addTaskButton.addEventListener("click", addTask);

    taskInput.addEventListener("keypress", function(event){
        if(event.key === "Enter"){
            addTask();
        }
    });

});