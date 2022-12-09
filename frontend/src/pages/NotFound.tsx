import React from 'react'; 
import { render } from 'react-dom';

class NotFound extends React.Component {
  render () {
    return (
      <div className='container'>
      <div className='row'>
        <div className='col-md-12'>
          <h1>404: Page Not Found</h1>
        </div>
      </div>
    </div>
    );
  } 
}

export default NotFound;