import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: " ",
  authDomain: "login-page-8d2ab.firebaseapp.com",
  projectId: "login-page-8d2ab",
  storageBucket: "login-page-8d2ab.appspot.com",
  messagingSenderId: "975019750593",
  appId: "1:975019750593:web:8af4a71181527b22785040"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Sign Up Functionality
const signUp = document.getElementById("submitSignUp");
signUp.addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById("rEmail").value.trim();
  const password = document.getElementById("rPassword").value.trim();
  const firstName = document.getElementById("fName").value.trim();
  const lastName = document.getElementById("lName").value.trim();

  if (!email || !password || !firstName || !lastName) {
    showMessage("Please fill in all fields", "signUpMessage");
    return;
  }

  try {
    console.log("Attempting to create user...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created successfully:", user);

    // Store user data in Firestore
    const userData = { email, firstName, lastName };
    await setDoc(doc(db, "users", user.uid), userData);
    console.log("User data saved to Firestore");

    showMessage("Account created successfully!", "signUpMessage");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === "auth/email-already-in-use") {
      showMessage("Email Address Already Exists!", "signUpMessage");
    } else if (error.code === "auth/weak-password") {
      showMessage("Password is too weak!", "signUpMessage");
    } else {
      showMessage("Unable to create user. Please try again.", "signUpMessage");
    }
  }
});

// Sign In Functionality
const signIn = document.getElementById("submitSignIn");
signIn.addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showMessage("Please enter email and password", "signInMessage");
    return;
  }

  try {
    console.log("Attempting to sign in...");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("Login successful:", user);
    showMessage("Login successful!", "signInMessage");

    localStorage.setItem("loggedInUserId", user.uid);

    setTimeout(() => {
      window.location.href = "homepage.html";
    }, 2000);
  } catch (error) {
    console.error("Login error:", error);

    if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
      showMessage("Incorrect Email or Password", "signInMessage");
    } else if (error.code === "auth/user-not-found") {
      showMessage("Account does not exist. Please sign up.", "signInMessage");
    } else {
      showMessage("An error occurred. Try again later.", "signInMessage");
    }
  }
});