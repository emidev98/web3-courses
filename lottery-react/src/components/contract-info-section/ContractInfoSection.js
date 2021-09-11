import './ContractInfoSection.css'
import React from 'react';
import { Card } from 'react-materialize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

class ContractInfoSection extends React.Component {

  render() {
    return (
      <Card 
        className="blue-grey darken-1"
        textClassName="white-text">
        <div className='card-header'>
          <h5>
            <FontAwesomeIcon 
              className="card-header-icon" 
              icon={faInfoCircle}></FontAwesomeIcon>
              Game Info
          </h5>
        </div>
        <p>This contract is managed by { this.props.config.manager }</p>
        <p>There are currenly { this.props.config.players.length } people playing.</p>
        <p>To win { this.props.config.balance }</p>
      </Card>
    )
  }
}

export default ContractInfoSection;