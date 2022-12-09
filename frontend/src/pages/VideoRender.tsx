import React from 'react';
import axios from 'axios';

class VideoRender extends React.Component {

  state = {
    processing: false,
    finalVideo: false,
  }

  onFormSubmit = (event: any) => {
    event.preventDefault();
    this.setState({ processing: true });

    let config = {
      method: 'post',
      url: 'http://localhost:5000/api/render-video',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    axios(config)
      .then((response) => {
        let finalVideo = response.data["video"];
        this.setState({ finalVideo });
        this.setState({ processing: false });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ processing: false });
      });
  }

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <h1>Render a Video</h1>
            <form onSubmit={this.onFormSubmit}>
              <div className='form-group'>
                <button type='submit' className='btn btn-primary' style={{ marginTop: '20px', marginBottom: '20px' }}>Start Render</button>
              </div>
            </form>
          </div>
          <div className='col-md-12'>
            <div className='row' style={{ marginTop: '5px' }}>
              <div className='col-md-12'>
                <h3>Results</h3>
                {this.state.processing &&
                  <p className='processing'>Rendering... Please Wait...</p>
                }
              </div>
              <div className='col-md-12'>
                {this.state.finalVideo &&
                  <video width="320" height="240" controls>
                    <source src={`http://localhost:5000/static/${this.state.finalVideo}`} type="video/mp4" />
                  </video>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoRender;
