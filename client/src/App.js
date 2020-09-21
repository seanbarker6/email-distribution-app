import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>
          Hello
        </h2>
        <p
          className="App-into"
        >
          Learn React
        </p>
        <div>
        <a href="/auth/google">Sign in with Google</a>
      </div>
      </header>
    </div>
  );
}

export default App;
