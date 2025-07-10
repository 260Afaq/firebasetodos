import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc , deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBHBETM9GafpqQIUylBaagE-tzgUhTGUXo",
    authDomain: "learning-777d8.firebaseapp.com",
    projectId: "learning-777d8",
    storageBucket: "learning-777d8.appspot.com",
    messagingSenderId: "640142347629",
    appId: "1:640142347629:web:3848d05a2a7d1351e9de64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const inputBox = document.getElementById('inputBox');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const todoCollection = collection(db, "todos");

let editTodo = null;

window.addEventListener("load", getTodos);

async function getTodos() {
    try {
        const arr = [];
        const querySnapshot = await getDocs(todoCollection);
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, doc.data());
            arr.push({
                id: doc.id,
                todo: doc.data()
            });
        });
        console.log("array", arr);
    } catch (error) {
        console.log(error.message, "error");
        alert(error.message);
    }
}

// Function to add todo
async function addTodo() {
    try {
        const inputText = inputBox.value.trim();
        if (inputText.length <= 0) {
            alert("You must write something in your to do");
            return false;
        }

        const data = {
            todo: inputText
        };

        const addRef = await addDoc(todoCollection, data);
        console.log("Document written id: ", addRef.id);

        // Creating li element
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.innerHTML = inputText;
        li.appendChild(p);
        li.id = addRef.id; // Set the li id to the document id

        // Creating Edit Btn
        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("btn", "editBtn");
        li.appendChild(editBtn);

        // Creating Delete Btn
        const deleteBtn = document.createElement("button");
        
        deleteBtn.innerText = "Remove";
        deleteBtn.classList.add("btn", "deleteBtn");
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
        inputBox.value = "";
    } catch (error) {
        console.log("error", error.message);
        alert(error.message);
    }
}

// Function to update: (Edit/Delete) todo
const updateTodo = async (e) => {
    if (e.target.innerHTML === "Remove") {
        const li = e.target.parentElement;
        await deleteDoc(doc(db, "todos", li.id)); // Delete from Firestore
        todoList.removeChild(li);
    }

    if (e.target.innerHTML === "Edit") {
        inputBox.value = e.target.previousElementSibling.innerHTML;
        inputBox.focus();
        addBtn.value = "Edit";
        editTodo = e;
        
    }
}

addBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', updateTodo);
