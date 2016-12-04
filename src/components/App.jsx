import React from 'react';
import Scene from './Scene';
import Shell from './Shell';
import Camera from '../gfx/camera';
import Geometry from '../gfx/geometry';
import Program from '../gfx/program';
import './App.css';

function App() {
  return (
    <Shell>
      <Scene />
    </Shell>
  );
}

export default App;
