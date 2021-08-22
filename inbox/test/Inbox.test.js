const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const { interface, bytecode } = require('../compile')

let accounts;
let inbox;

beforeEach(async()=>{
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts()
    
    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode, 
            arguments: ['Hello World!']
        })
        .send({ 
            from: accounts[0],
            gas: '1000000'
        })
})

describe('Inbox',()=>{

    it('deploys a contract',() => {
        assert.ok(inbox?.options?.address)
    })

    it('has a default message', async() => {
        // Use the message method to get the reference
        // of the contract value and 'Call' to retreive
        // the data from the blockchain async
        const message = await inbox.methods.message().call()
        
        assert.equal(message,"Hello World!")
    })


    it('updates the default message', async() => {
        // Set a new message to the contract reference 
        // and 'Send' the message to the account in blockchain
        await inbox.methods
            .setMessage("ETH!")
            .send({from: accounts[0]})

        const message = await inbox.methods.message().call()
                
        assert.equal(message,"ETH!")
    })

})
