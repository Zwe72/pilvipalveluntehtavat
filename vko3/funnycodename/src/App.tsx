import { useEffect, useState } from 'react'
import './App.css'
import { onAuthStateChanged, type User } from 'firebase/auth';
import LoginForm from './LoginForm';
import { auth, logout } from './authService';

function App() {
  const [codename, setCodename] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  
  
  function generateCodename(): string {
  const adjectives = ["Sneaky", "Electric", "Silent", "Hyper", "Cosmic"];
  const animals = ["Fox", "Panda", "Lizard", "Dragon", "Hawk"];
  const number = Math.floor(Math.random() * 3000);

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const animal = animals[Math.floor(Math.random() * animals.length)]

  return `${adj}${animal}${number}`;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const cachedName = localStorage.getItem("codename");

    if (cachedName) {
      setCodename(cachedName);
    } else {
      const newName = generateCodename();
      localStorage.setItem("codename", newName);
      setCodename(newName);
    }
  }, []);

  return (
    <div>
      <h1>Tervetuloa FunnyCodeName!</h1>
      <p>Koodinimesi on: <strong>{codename}</strong></p>

      <button 
        style={{marginTop: "10px"}}
        onClick={() => {
        const newName = generateCodename();
        localStorage.setItem("codename", newName);
        setCodename(newName);
      }}>
        Arvo uusi koodinimi
      </button>
      {user ? (
        <>
          <p>👋 Tervetuloa, {user.email}</p>
          <button onClick={logout}>Kirjaudu ulos</button>
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  )
}

export default App;
