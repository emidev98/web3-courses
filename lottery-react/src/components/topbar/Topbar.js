import './Topbar.css'
import React from 'react';
import { Navbar, NavItem, Icon } from 'react-materialize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';

class Topbar extends React.Component {

  render() {
    return (
      <Navbar alignLinks="right"
        brand={<a className="topbar-logo" href="/">Lottery</a>}
        id="mobile-nav"
        menuIcon={<Icon>menu</Icon>}
      >
        <NavItem href="">Getting started</NavItem>
        <NavItem href={`https://rinkeby.etherscan.io/address/${this.props.contract}`}>
          <span className="topbar-button-text">View on EtherScan</span>
          <FontAwesomeIcon icon={faNetworkWired} />
        </NavItem>
      </Navbar>
    )
  }
}

export default Topbar;
