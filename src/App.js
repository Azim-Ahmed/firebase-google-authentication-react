import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [users, setUsers]  = useState({
    isSignedIn :false, 
    name : '',
    email : '',
    photo : ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleClick = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL ,email} = res.user;
      const signedInUser = {
        isSignedIn : true,
        name : displayName,
        email : email,
        photo : photoURL
      }
      setUsers(signedInUser)
      // console.log(displayName, photoURL ,email);
    })
    .catch(err => {
      console.log(err , err.message);
    })
  }
  return (
    <div className="App">
     
    <button onClick = {handleClick}>sign in</button>
    {
      users.isSignedIn && <div><p>Welcome , {users.name}</p>
      <p>Here is your Email : {users.email}</p>
      <img src={users.photo} alt=""/>
      </div>
    }
    </div>
  );
}

export default App;
