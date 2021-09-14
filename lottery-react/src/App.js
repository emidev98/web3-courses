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
import ContractPickWinnerSection from './components/contract-pick-winner-section/ContractPickWinnerSection';

class App extends React.Component {
  state = {
    loader : {
      loading : true,
      message : 'Loading...'
    },
    contract : lottery.options.address,
    manager: '',
    currentPlayerAccounts: [],
    players: [],
    balance: '',
    value: 0
  };

  async componentDidMount() {
    await this.init();
  }

  async init(){
    // TODO: Check if Metamask is already installed in the browser
    const lotteryBalance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ 
      manager: await lottery.methods.manager().call(),
      players: await lottery.methods.getPlayers().call(),
      currentPlayerAccounts: await web3.eth.getAccounts(),
      balance: web3.utils.fromWei(lotteryBalance, 'ether'),
      loader: {
        loading: false
      }
     });
  }

  onEnterToLottery = async (event) => {
    this.state.value = event;

    this.setState({
      loader : {
        loading : true,
        message : 'Waiting on transaction success...'
      }
    });

    try{
      await lottery.methods.enter().send({
        from: this.state.currentPlayerAccounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      })
    }
    catch(e){
      console.log(e);
    }

    this.init();
    this.setState({
      loader : {
        loading : false,
        message : ''
      }
    });
  }

  onPickWinner = async () => {
    this.setState({
      loader : {
        loading : true,
        message : 'Waiting on transaction success...'
      }
    });

    await lottery.methods.pickWinner().send({
      from : this.state.currentPlayerAccounts[0]
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
              {
                this.state.manager == this.state.currentPlayerAccounts[0] &&
                <Row>
                  <Col
                    s={12}>
                      <ContractPickWinnerSection 
                        onPickWinner={()=>this.onPickWinner()}/>
                  </Col>
                </Row>
              }
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
