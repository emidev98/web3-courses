import './Loader.css'
import React from 'react';
import { Preloader } from 'react-materialize';

class AppLoader extends React.Component {

  render() {
    return (
        <div className={`lottery-loader ${!this.props.config?.loading ? 'hide-lottery-loader' : ''}`}>
            <Preloader
                active
                flashing={false}
                size="big"
            />
            <h5 className='lottery-loader-message'>{this.props.config?.message}</h5>
        </div>
    )
  }
}

export default AppLoader;
