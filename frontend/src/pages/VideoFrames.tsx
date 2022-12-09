import React from 'react'; 
import { render } from 'react-dom';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

class VideoFrames extends React.Component {

  state = {
    videos: [],
    frames: [],
    selectedVideo: '',
    processing: false
  }

  componentDidMount(): void {
    fetch('http://localhost:5000/api/videos')
      .then(response => response.json())
      .then(data => {
        const videos = data["videos"];
        this.setState({ videos });
      });
  }

  onChange = (e: any) => {
    console.log('e.target.value', e.target.value)
    this.setState({ selectedVideo: e.target.value });
  }

  onFormSubmit = (event: any) => {
    event.preventDefault();
    this.setState({ processing: true });
    const { selectedVideo } = this.state;
    if (selectedVideo) {
      let data = {
        "videoFile": selectedVideo,
      }
      
      let config = {
        method: 'post',
        url: 'http://localhost:5000/api/extract-frames',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
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
    } else {
      this.setState({ processing: false });
    }
  }

  render () {
    return (
      <div className='container'>
      <div className='row'>
        <div className='col-md-12'>
          <h1>Extract Frames from Video</h1>
          <form onSubmit={this.onFormSubmit}>
            <div className='form-group'>
              <h3>Select a Video</h3>
              <Form.Select
                onChange={this.onChange}
                value={this.state.selectedVideo}
              >
                <option value="">Select a Video</option>
                {this.state.videos.map((video: any) => (
                  <option key={video} value={video}>
                    {video}
                  </option>
                ))}
              </Form.Select>
              <button type='submit' className='btn btn-primary' style={{ marginTop: '20px' }}>Extract Frames</button>
            </div>
          </form>
        </div>
        <div className='col-md-12'>
          <div className='row' style={{ marginTop: '5px' }}>
            <div className='col-md-12'>
                <h3>Extracted Frames</h3>
                {this.state.processing &&
                  <p className='processing'>Processing... Please Wait...</p>
                }
            </div>
          </div>
          <div className='row' style={{ marginTop: '5px' }}>
            {this.state.frames.map((frame, index) => (
              <div key={index} className='col-md-3'>
                <img src={`http://localhost:5000/static/${frame}`} alt='frame' style={{maxWidth:'100%'}} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    );
  } 
}

export default VideoFrames;
