import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false)
  const [users, setUsers] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false,
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  var FBprovider = new firebase.auth.FacebookAuthProvider();
  const handleClick = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUsers(signedInUser)
        // console.log(displayName, photoURL ,email);
      })
      .catch(err => {
        console.log(err, err.message);
      })
  }
  const signInFB = () =>{
    firebase.auth().signInWithPopup(FBprovider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: ''
        }
        setUsers(signOutUser)
      })
      .catch(err =>
        console.log(err))
  }
  const handleBlur = (event) => {

    let isFormValid = true;

    if (event.target.name === 'email') {
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value)

    }
    if (event.target.name === 'password') {
      const signPasswordValid = event.target.value.length > 6;
      const anotherPassword = /[1-9]/.test(event.target.value)
      const anotherPasswords = /(?=.*[!@#$%^&*])/.test(event.target.value)

      isFormValid = signPasswordValid && anotherPassword && anotherPasswords;
    }
    if (isFormValid) {
      const newUserInfo = { ...users }
      newUserInfo[event.target.name] = event.target.value;
      setUsers(newUserInfo)
    }

  }
  


  // const handleBlur = (event) => {

  //   console.log(event.target.name, ":", event.target.value);

  //   if(event.target.name === 'email'){
  //     const signEmailValid = /\S+@\S+\.\S+/.test(event.target.value)
  //     console.log(signEmailValid);
  //   } 
  //   if (event.target.name === 'password') {
  //     const signPasswordValid = event.target.value.length > 6;
  //     const anotherPassword =  /[1-9]/.test(event.target.value)
  //     const anotherPasswords =  /(?=.*[!@#$%^&*])/.test(event.target.value)

  //   console.log(signPasswordValid && anotherPassword && anotherPasswords);
  //   }

  // }
  // const handleChange = (event) => {
  //   console.log(event.target.value);
  // }

  



  const handleSubmit = (e) => {
    if (newUser && users.email && users.password) {
      firebase.auth().createUserWithEmailAndPassword(users.email, users.password).then(res => {
        console.log(res);
        const newUserInfo = { ...users }
        newUserInfo.error = ''
        newUserInfo.success = true

        setUsers(newUserInfo)
        updateDisplayName(users.name)
      }).catch(error => {
        // Handle Errors here.
        const newUserInfo = { ...users }
        newUserInfo.error = error.message;
        newUserInfo.success = false
        setUsers(newUserInfo)
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // // ... 
        // console.log(errorCode, errorMessage);
      });

    }
    if (!newUser && users.email && users.password) {
      firebase.auth().signInWithEmailAndPassword(users.email, users.password)
        .then(res => {
          const newUserInfo = { ...users }
          newUserInfo.error = ''
          newUserInfo.success = true
          setUsers(newUserInfo)
          console.log( "sign in user", res.user);

        })
        .catch(function (error) {
          const newUserInfo = { ...users }
          newUserInfo.error = error.message;
          newUserInfo.success = false
          setUsers(newUserInfo)
        });
    }
    e.preventDefault()
    const updateDisplayName = name => {
      var user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name
}).then(function() {
  // Update successful.
  console.log('This Name Property Updated Successfully');
}).catch(function(error) {
  // An error happened.
  console.log(error);
});
    }

  }
  return (
    <div className="App">
      {
        users.isSignedIn ? <button onClick={handleSignOut}>sign out</button> : <button onClick={handleClick}>sign in</button>
      }
      <br/>
      <button onClick = {signInFB}>Button for Facebook Log in</button>

      {
        users.isSignedIn && <div><p>Welcome , {users.name}</p>
          <p>Here is your Email : {users.email}</p>
          <img src={users.photo} alt="" />
        </div>
      }

      <h1>Our OWn Authenication System </h1>
      <input onChange={() => setNewUser(!newUser)} type="checkbox" name="newUser" id="" />
      <label htmlFor="newUser">New User Sign up</label>

      <form onSubmit={handleSubmit}>

        {newUser && <input onBlur={handleBlur} name="name" placeholder="Enter Your name here" type="text" />} <br />
        <input onBlur={handleBlur} name="email" placeholder="Enter Your Email address" required type="text" />
        <br />
        <input onChange={handleBlur} type="password" name="password" placeholder=" Enter Your Password" required />
        <br />
        <input type="submit" value= {newUser ? "Sign Up" : "Sign In"} />
      </form>
      <p style={{ color: 'red' }}>{users.error}</p>
      {users.success && <p style={{ color: 'green' }}>SuccessFully {newUser ? "Created" : 'Logged'} In</p>}
    </div>
  );
}

export default App;
