import './Topbar.css'
import React from 'react';
import { Navbar, NavItem, Icon } from 'react-materialize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from "@fortawesome/free-brands-svg-icons"

class AppTopbar extends React.Component {

  render() {
    return (
      <Navbar alignLinks="right"
        brand={<a className="topbar-logo" href="/">Lottery</a>}
        id="mobile-nav"
        menuIcon={<Icon>menu</Icon>}
      >
        <NavItem href={`https://github.com/emidev98/solidity-course`} target="_blank">
          <span className="topbar-button-text">Source Code</span>
          <FontAwesomeIcon icon={faGithub}/>
        </NavItem>
        <NavItem href={`https://rinkeby.etherscan.io/address/${this.props.contract}`} target="_blank">
          <span className="topbar-button-text">View on EtherScan</span>
          <FontAwesomeIcon icon={faNetworkWired} />
        </NavItem>
      </Navbar>
    )
  }
}

export default AppTopbar;
