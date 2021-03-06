import './Footer.css'
import React from 'react';
import { Footer } from 'react-materialize';

class AppFooter extends React.Component {

  render() {
    return (
      <Footer
        copyrights="MIT License"
        moreLinks={<a className="grey-text text-lighten-4 right" href="https://github.com/emidev98/solidity-course">GitHub</a>}
      >
      </Footer>
    )
  }
}

export default AppFooter;
