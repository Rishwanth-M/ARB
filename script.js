import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYvFdWoLL-YAObctYXBfkqwkUbLBXTsTk",
  authDomain: "arblog-a19f3.firebaseapp.com",
  projectId: "arblog-a19f3",
  storageBucket: "arblog-a19f3.appspot.com",
  messagingSenderId: "1001446483266",
  appId: "1:1001446483266:web:436692dd843096e5eed4db",
  measurementId: "G-4C40XF2L3W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// Image preview
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');

imageUpload.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      // Show the image on the screen
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file); // Convert image file to base64 string
  }
});

// Upload Image and Save Data
const postButton = document.getElementById('postButton');
postButton.addEventListener('click', async function() {
  const file = imageUpload.files[0];
  const caption = document.getElementById('caption').value;

  if (file && caption) {
    try {
      // Upload the image to Firebase Storage
      const storageRef = ref(storage, 'images/' + file.name);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Save the image URL and caption to Firestore
      await addDoc(collection(db, 'posts'), {
        imageUrl: url,
        caption: caption,
        timestamp: serverTimestamp()
      });

      alert('Post created successfully!');
    } catch (error) {
      console.error('Error saving post: ', error);
    }
  } else {
    alert('Please upload an image and write a caption.');
  }
});
