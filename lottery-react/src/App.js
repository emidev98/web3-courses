import React from 'react';   
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";
import './App.css';
import web3 from './services/web3.service';
import lottery from './services/lottery.service';
import { Button } from 'react-materialize';
import Loader from './components/loader/Loader'
import Topbar from './components/topbar/Topbar'

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

    this.setState({ 
      manager: await lottery.methods.manager().call(),
      players: await lottery.methods.getPlayers().call(),
      balance: await web3.eth.getBalance(lottery.options.address),
      loader: {
        loading : false
      }
     });
  }

  onEnterToLottery = async (event) => {
    event.preventDefault();
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
      <div>
        <Topbar contract={this.state.contract}/>
        <div className="container">
          <div>
            <h2>Lottery Contract</h2>
            <p>This contract is managed by { this.state.manager }</p>
            <p>There are currenly { this.state.players.length } people playing.</p>
            <p>To win { web3.utils.fromWei(this.state.balance,'ether') }</p>
          </div>

          <form onSubmit={this.onEnterToLottery}>
            <h4>Do you want to try your luck?</h4>
            <div>
              <label> Amount of ether to enter</label>
              <input
                value={this.state.value} 
                onChange={ event => this.setState({ value: event.target.value })}>
              </input>
            </div>
            <Button>Enter</Button>
          </form>


          <form onSubmit={this.onSubmit}>
            <h4>Ready to pick a winner?</h4>
            <Button onClick={this.onPickWinner}>Pick a winner!</Button>
          </form>
        </div>        
        <Loader config={this.state.loader}/>
      </div>
    )
  }
}

export default App;
