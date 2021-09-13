import React from 'react';   
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";
import './App.css';
import web3 from './services/web3.service';
import lottery from './services/lottery.service';
import { Button, Col, Row } from 'react-materialize';
import AppTopbar from './components/topbar/Topbar'
import AppLoader from './components/loader/Loader'
import AppFooter from './components/footer/Footer'
import ContractInfoSection from './components/contract-info-section/ContractInfoSection';
import ContractInteractionSection from './components/contract-interaction-section/ContractInteractionSection';

class App extends React.Component {
  state = {
    loader : {
      loading : true,
      message : 'Loading...'
    },
    contract : lottery.options.address,
    manager: '',
    players: [],
    balance: '',
    value: 0
  };

  async componentDidMount() {
    // TODO: Check if Metamask is already installed in the browser
    const lotteryBalance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ 
      manager: await lottery.methods.manager().call(),
      players: await lottery.methods.getPlayers().call(),
      balance: web3.utils.fromWei(lotteryBalance, 'ether'),
      loader: {
        loading: false
      }
     });
  }

  onEnterToLottery = async (event) => {
    this.state.value = event;
    const accounts = await web3.eth.getAccounts();

    // TODO: Allow the user to chose betewen its different addresses 

    this.setState({
      loader : {
        loading : true,
        message : 'Waiting on transaction success...'
      }
    });

    try{
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      })
    }
    catch(e){
      console.log(e);
      // TODO reset state
    }

    // TODO show the success state 

    this.setState({
      loader : {
        loading : false,
        message : ''
      }
    });
  }

  onPickWinner = async (event) => {
    const accounts =  await web3.eth.getAccounts();
    
    this.setState({
      loader : {
        loading : true,
        message : 'Waiting on transaction success...'
      }
    });

    await lottery.methods.pickWinner().send({
      from : accounts[0]
    })

    // TODO display the winner
  }

  render() {
    return (
      <div className="application-wrapper">
        <AppTopbar contract={this.state.contract}/>
        <div className="application-content container">
          <Row>
            <Col
              l={6}
              s={12}>
              <ContractInfoSection config={this.state}/>
            </Col>
            <Col
              l={6}
              s={12}>
              <ContractInteractionSection onEnterToLottery={(event)=>this.onEnterToLottery(event)}/>
            </Col>
          </Row>
          <Row>
            <Col
              s={12}>
              <form onSubmit={this.onSubmit}>
                <h4>Ready to pick a winner?</h4>
                <Button onClick={this.onPickWinner}>Pick a winner!</Button>
              </form>
            </Col>
          </Row>
        </div>
        <AppLoader config={this.state.loader}/>
        <AppFooter/>
      </div>
    )
  }
}

export default App;
