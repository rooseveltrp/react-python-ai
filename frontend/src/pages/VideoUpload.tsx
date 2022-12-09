import React from 'react'; 

import axios from 'axios';

class VideoUpload extends React.Component {

  state = {
    selectedFile: File,
    processing: false
  }

  onFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    console.log('selectedFile', selectedFile);
    this.setState({ selectedFile });
  };

  onFileUpload = () => {

    if (!this.state.selectedFile) {
      return;
    }

    this.setState({ processing: true });
     
    const formData: any = new FormData();
    formData.set('file', this.state.selectedFile);
    formData.set('fileName', this.state.selectedFile.name);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    console.log('formData', formData)
   
    axios.post("http://localhost:5000/api/upload", formData, config).then((response) => {
      console.log('response', response);
      this.setState({ processing: false });
    })
    .catch((error) => {
      console.log(error);
      this.setState({ processing: false });
    });
  };

  render () {
    return (
      <div className='container'>
      <div className='row'>
        <div className='col-md-12'>
          <h1 style={{marginBottom: '25px'}}>Upload a Video</h1>
          {this.state.processing &&
                  <p className='processing'>Uploading... Please Wait...</p>
                }
          <form>
            <div className='form-group' style={{marginBottom: '25px'}}>
              <input type='file' onChange={this.onFileChange} className='form-control-file' id='video' />
            </div>
            <div className="form-group">
              <button type='button' onClick={this.onFileUpload} className='btn btn-primary'>Upload</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    );
  } 
}

export default VideoUpload;