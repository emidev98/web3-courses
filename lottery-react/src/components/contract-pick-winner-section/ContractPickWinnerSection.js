import './ContractPickWinnerSection.css'
import React from 'react';
import { Button, Card } from 'react-materialize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

class ContractPickWinnerSection extends React.Component {

  onPickWinner = (event) => {
    event.preventDefault();
    return;
    this.props.onPickWinner(this.state.value);
  }

  render() {
    return (
      <Card 
        className="card"
        textClassName="white-text">
        <div className='card-header'>
          <h5>
            <FontAwesomeIcon 
              className="card-header-icon" 
              icon={faTrophy}></FontAwesomeIcon>
              Ready to pick a winner?
          </h5>
        </div>
        <form className='card-paragraph'>
          <Button className='form-submit-button' 
            onClick={this.onPickWinner}>Pick a winner!</Button>
        </form>
      </Card>
    )
  }
}

export default ContractPickWinnerSection;