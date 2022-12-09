import React from 'react'; 
import { render } from 'react-dom';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

class VideoDetect extends React.Component {

  state = {
    frames: [],
    processing: false
  }

  onFormSubmit = (event: any) => {
    event.preventDefault();
    this.setState({ processing: true });

    let config = {
      method: 'post',
      url: 'http://localhost:5000/api/detect-objects',
      headers: { 
        'Content-Type': 'application/json'
      }
    };
    
    axios(config)
    .then((response) => {
      let frames = response.data["frames"];
      frames = frames.filter((frame: any) => {
        if (frame.includes('jpg')) {
          return frame;
        }
      });
      this.setState({ frames });
      this.setState({ processing: false });
    })
    .catch((error) => {
      console.log(error);
      this.setState({ processing: false });
    });
  }

  render () {
    return (
      <div className='container'>
      <div className='row'>
        <div className='col-md-12'>
          <h1>Find Cats/Videos</h1>
          <form onSubmit={this.onFormSubmit}>
            <div className='form-group'>
              <button type='submit' className='btn btn-primary' style={{ marginTop: '20px', marginBottom: '20px' }}>Start Detection</button>
            </div>
          </form>
        </div>
        <div className='col-md-12'>
          <div className='row' style={{ marginTop: '5px' }}>
            <div className='col-md-12'>
                <h3>Results</h3>
                {this.state.processing &&
                  <p className='processing'>Processing... Please Wait...</p>
                }
            </div>
          </div>
          <div className='row' style={{ marginTop: '5px' }}>
            {this.state.frames.map((frame, index) => (
              <div key={index} className='col-md-3'>
                <img src={`http://localhost:5000/static/detections/${frame}`} alt='frame' style={{maxWidth:'100%'}} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    );
  } 
}

export default VideoDetect;
