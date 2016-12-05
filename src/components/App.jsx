import React from 'react';
import Loader from './Loader';
import Shell from './Shell';
import './App.css';

function App() {
  return (
    <div className="App">
      <Shell>
        <Loader />
      </Shell>
    </div>
  );
}

export default App;
