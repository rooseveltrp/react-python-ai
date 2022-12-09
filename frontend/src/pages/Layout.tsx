import React from 'react'; 
import { render } from 'react-dom';
import { Outlet, Link } from "react-router-dom";
import '../css/Layout.css'

class Layout extends React.Component {
  render () {
    return (
      <div>

        <header>
          <div className="p-5 text-center bg-light">
            <h1 className="mb-3">Python/React AI Samples</h1>
            <h4 className="mb-3">by Roosevelt Purification</h4>
          </div>
        </header>

      <div className='container'>
            
            <div className='row'>
              <div className='col-md-3 left-menu'>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <a href="/upload">Upload a video</a>
                  </li>
                  <li>
                    <a href="/extract">Extract Frames</a>
                  </li>
                  <li>
                    <a href="/detect">Detect Objects</a>
                  </li>
                  <li>
                    <a href="/render">Render Video</a>
                  </li>
              </div>
              <div className='col-md-9 content-area'>
                  <Outlet />
              </div>
            </div>
          </div>
    </div>
    );
  } 
}

export default Layout;