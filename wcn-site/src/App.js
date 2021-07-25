import './App.css';
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'bootstrap/dist/css/bootstrap.min.css';

import { useState, useRef } from 'react'
import { useAuthState} from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
    apiKey: "AIzaSyA6HhdNcNykEVr3AHLlfBHexSuRtuNbX1w",
    authDomain: "wcn-site.firebaseapp.com",
    projectId: "wcn-site",
    storageBucket: "wcn-site.appspot.com",
    messagingSenderId: "178394302628",
    appId: "1:178394302628:web:a52182560b65ab64b23e31"
})

const auth = firebase.auth()
const firestore = firebase.firestore()



function App() {

  const [user] = useAuthState(auth);

  return (
      <div className="App">
        <header></header>
        <section>
          {user ? <ChatRoom /> : <SignIn />}
        </section>
      </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }

  return (
    <div>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
        
    </div>
  )


}

function ChatRoom(){

  const dummy = useRef()

  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query, {idField: 'id'})

  const [formValue, setFormValue] = useState()

  const sendMessage = async(e) => {
    e.preventDefault()

    const {uid, photoURL} = auth.currentUser

    await messagesRef.add({
      text: formValue, 
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid, 
      photoURL
    })

    setFormValue('')

    dummy.current.scrollIntoView({behavior: 'smooth'})
  }

  function SignOut() {
    return auth.currentUser && (
      <button onClick={() => auth.signOut()}>Sign Out</button>
    )
  }

  return (
    <>
      <div>
          {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} /> )}

          <div ref={dummy}></div>
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">Post</button>
      </form>
      <SignOut />
    </>
  )
}

function ChatMessage(props){

  const {text, uid, photoURL} = props.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
  return (
  <div className={`message ${messageClass}`}>
    <img src={photoURL} />
    <p>{text}</p>
  </div>

  )
}




export default App;
