import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-12'>
          <h1>Cat/Dog Detection</h1>
          <h3>By Roosevelt Purification</h3>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-4'>
            <li>Upload a video</li>
            <li>Extract Frames</li>
            <li>Detect Objects</li>
            <li>Render Video</li>
        </div>
      </div>
    </div>
  );
}

export default App;
