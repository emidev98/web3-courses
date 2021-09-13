import './ContractInfoSection.css'
import React from 'react';
import { Card, Table } from 'react-materialize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCubes } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from "@fortawesome/free-brands-svg-icons"

class ContractInfoSection extends React.Component {

  render() {
    return (
      <Card 
        className="card"
        textClassName="white-text">
        <div className='card-header'>
          <h5>
            <FontAwesomeIcon 
              className="card-header-icon" 
              icon={faInfoCircle}></FontAwesomeIcon>
              Game Info
          </h5>
        </div>
        <p className='card-paragraph'> 
          The lottery has a prize of
          <a className="card-custom-link" 
              href={"https://rinkeby.etherscan.io/address/" + this.props.config.contract } target="_blank"> 
              &nbsp;{ this.props.config.balance }&nbsp;<FontAwesomeIcon icon={faEthereum} />&nbsp;(ETH)&nbsp;
          </a>
          which will be send to the winner.
          This lottery is managed by&nbsp;
            <a className='card-custom-link'
              href={"https://rinkeby.etherscan.io/address/" + this.props.config.manager } target="_blank">
              <span className='card-custom-link card-custom-link-elipsis'>{ this.props.config.manager }</span>
              <FontAwesomeIcon icon={faCubes} />&nbsp;
            </a>
          There are a total of { this.props.config.players.length } players.
        </p>
        <Table>
          <thead>
            <tr>
              <th data-field="id">#</th>
              <th data-field="name">Player</th>
            </tr>
          </thead>
          <tbody>
          {this.props.config.players.map( (item, index) => {
            return (
              <tr key={index}>
                <td>{index}</td>
                <td>
                  <a className='card-custom-link'
                    href={"https://rinkeby.etherscan.io/address/" + item } target="_blank">
                      {item}&nbsp;<FontAwesomeIcon icon={faCubes} />
                  </a>
                </td>
              </tr>
            )
          })}
          </tbody>
        </Table>
      </Card>
    )
  }
}

export default ContractInfoSection;