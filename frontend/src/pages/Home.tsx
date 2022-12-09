import React from 'react'; 
import { render } from 'react-dom';

class Home extends React.Component {
  render () {
    return (
      <div className='container'>
      <div className='row'>
        <div className='col-md-12'>
          <h1>Hi!</h1>
          <p>
            Thanks for checking out this demo.
          </p>
          <p>
            This is a simple React and Python/FastAPI application to showcase how you can detect objects (YOLOv4) in a video, extract frames, and render out a MP4.
          </p>
          <p>
            If you have any specific usecase in mind, please let me know!
          </p>
        </div>
      </div>
    </div>
    );
  } 
}

export default Home;
