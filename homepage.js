import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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

  const auth = getAuth();
  const db = getFirestore();

  onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    if(loggedInUserId) {
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()){
                const userData = docSnap.data();
                document.getElementById('loggedUserFName').innerText=userData.firstName;
                document.getElementById('loggedUserEmail').innerText=userData.email;
                document.getElementById('loggedUserLName').innerText=userData.lastName;
            }
            else{
                console.log("No document found matching id")
            }
        })
        .catch((error) => {
            console.log("Error getting document");
        })
    }
    else{
        console.log("User Id not Found in Local storage");
    }
  })

  const logoutButton = document.getElementById('logout');

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(() => {
        window.location.href = 'index.html';
    })
    .catch((error) => {
        console.error('Error Signing out:', error);
    })
  })