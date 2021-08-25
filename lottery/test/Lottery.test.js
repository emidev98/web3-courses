const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const { interface, bytecode } = require('../compile')

let accounts;
let lottery;

beforeEach(async()=>{
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts()
    
    // Use one of those accounts to deploy the contract
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode
        })
        .send({ 
            from: accounts[0],
            gas: '1000000'
        })
})

describe('Lottery',()=>{

    it('deploys a contract',() => {
        assert.ok(lottery?.options?.address)
    })

    it('alllows one account to enter', async() => {
        await lottery.methods
            .enter()
            .send({
                from : accounts[0],
                value : web3.utils.toWei('0.02', 'ether')
            })
        
        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        })

        assert.strictEqual(accounts[0], players[0])
        assert.strictEqual(1, players.length)
    })

    it('alllows multiple account to enter', async() => {
        for (const account of accounts){
            await lottery.methods
                .enter()
                .send({
                    from : account,
                    value : web3.utils.toWei('0.02', 'ether')
                })
        }
        
        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        })

        for(let index = 0; accounts.length < index; index++){
            assert.strictEqual(accounts[index], players[index])
            assert.strictEqual(index, players.length)
        }
    })

})
