import './ContractInteractionSection.css'
import React from 'react';
import { Button, Card } from 'react-materialize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from "@fortawesome/free-brands-svg-icons"

class ContractInteractionSection extends React.Component {
  state = {
    value : 0.1
  }

  onEnterToLottery = (event) => {
    event.preventDefault();
    this.props.onEnterToLottery(this.state.value);
  }

  render() {
    return (
      <Card
        textClassName="white-text">
        <div className='card-header'>
          <h5>
            <FontAwesomeIcon 
              className="card-header-icon" 
              icon={faDice}></FontAwesomeIcon>
              Do you want to try luck?
          </h5>
        </div>

      <form onSubmit={this.onEnterToLottery}>
        <div>
          <p>Amount of <FontAwesomeIcon icon={faEthereum} />&nbsp;(ETH)&nbsp; to join the game</p>
          <input type="number"
            min="0.1"
            value={this.state.value} 
            onChange={ event => this.setState({ value: event.target.value })}></input>
        </div>
        <Button className='form-submit-button'>Participate</Button>
      </form>
      </Card>
    )
  }
}

export default ContractInteractionSection;