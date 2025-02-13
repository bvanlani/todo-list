// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, googleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC2RbIjJSIj2oW35WELjmKm-0geazqQ4U",
  authDomain: "todo-list-b4f6c.firebaseapp.com",
  projectId: "todo-list-b4f6c",
  storageBucket: "todo-list-b4f6c.firebasestorage.app",
  messagingSenderId: "35323086636",
  appId: "1:35323086636:web:eb0f73fa52e34b1ff84e89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Sign-up with Email and Password
function signUpWithEmailPassword(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User signed up:", userCredential.user);
        })
        .catch((error) => {
            console.error("Error signing up:", error.message);
        });
}

// Sign-in with Email and Password
function signInWithEmailPassword(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User signed in:", userCredential.user);
        })
        .catch((error) => {
            console.error("Error signing in:", error.message);
        });
}

// Sign-in with Google
function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("User signed in with Google:", user);
        })
        .catch((error) => {
            console.error("Error with Google sign-in:", error.message);
        });
}

// Listen to authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log("User is signed in:", user);
    } else {
        // User is not signed in
        console.log("User is not signed in");
    }
});

// Sign out user
function signOutUser() {
    signOut(auth)
        .then(() => {
            console.log("User signed out");
        })
        .catch((error) => {
            console.error("Error signing out:", error.message);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("task-input");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");
    const userID = auth.currentUser ? auth.currentUser.uid : null;

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

        if(userID){
            setDoc(doc(db,"tasks", userID),{
                tasks: []
            }).then(() =>{
                console.log("Tasks saved to Firebase");
            }).catch((error) =>{
                console.error("Error saving tasks: ", error);
            })
        }
    }

    async function loadTasks() {
        const taskDocRef = doc(db, "tasks", userID);
        try{
            const docSnap = await getDoc(taskDocRef);

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
        } catch (error){
            console.error("Error loading tasks: ", error);
        }
    }

    addTaskButton.addEventListener("click", addTask);

    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    // Get references to the buttons
    const signUpBtn = document.getElementById("sign-up-btn");
    const signInBtn = document.getElementById("sign-in-btn");
    const googleSignInBtn = document.getElementById("google-sign-in-btn");
    const signOutBtn = document.getElementById("sign-out-btn");

    // Add event listeners for the buttons
    signUpBtn.addEventListener("click", () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        signUpWithEmailPassword(email, password);
    });

    signInBtn.addEventListener("click", () => {
        const email = document.getElementById("email-login").value;
        const password = document.getElementById("password-login").value;
        signInWithEmailPassword(email, password);
    });

    googleSignInBtn.addEventListener("click", () => {
        signInWithGoogle();
    });

    signOutBtn.addEventListener("click", () => {
        signOutUser();
    });
});