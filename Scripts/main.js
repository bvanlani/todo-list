import { initializeApp } from
"https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from
"https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCC2RbIjJSIj2oW35WELjmKm-0geazqQ4U",
    authDomain: "todo-list-b4f6c.firebaseapp.com",
    projectId: "todo-list-b4f6c",
    storageBucket: "todo-list-b4f6c.firebasestorage.app",
    messagingSenderId: "35323086636",
    appId: "1:35323086636:web:eb0f73fa52e34b1ff84e89"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("task-input");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");

    loadTasks();

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        const li = document.createElement("li");
        li.innerHTML = `${taskText} <button class="delete-btn">X</button>`;

        taskList.appendChild(li);
        taskInput.value = "";

        saveTasks();

        li.querySelector(".delete-btn").addEventListener("click", function() {
            li.remove();
            saveTasks();
        });
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll("#task-list li").forEach(li => {
            tasks.push(li.textContent.replace("X", "").trim());
        });

        setDoc(doc(db,"tasks", "taskList"),{
            tasks: tasks
        }).then(() =>{
            console.log("Tasks saved to Firebase");
        }).catch(() =>{
            console.error("Error saving tasks: ", error);
        })
    }

    function loadTasks() {
        const taskDocRef = doc(db, "task", "taskList");

        getDoc(taskDocRef).then((docSnap) =>{
            if(docSnap.exists()){
                const tasks = docSnap.data().tasks;
                tasks.forEach(taskText =>{
                    const li = document.createElement("li");
                    li.innerHTML = `${taskText} <button class="delete-btn">X</button>`;
                    taskList.appendChild(li);
                    li.querySelector(".delete-btn").addEventListener("click", function() {
                        li.remove();
                        saveTasks();
                    });
                });
            } else {
                console.log("No tasks found");
            }
        }).catch((error) =>{
            console.error("Error loading tasks: ", error);
        });
    }

    addTaskButton.addEventListener("click", addTask);

    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addTask();
        }
    });
});