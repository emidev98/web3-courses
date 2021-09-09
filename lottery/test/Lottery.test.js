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

    it('allows one account to enter', async() => {
        await lottery
            .methods
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

    it('allows multiple account to enter', async() => {
        for (const account of accounts){
            await lottery
                .methods
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

    it('requires a minimum amount of ether to enter', async() => {
        try{
            await lottery
                .methods
                .enter()
                .send({
                    from : accounts[0],
                    value : 0
                })

            assert(false);
        }
        catch(err) {
            assert(err)
        }
    })

    it('only manager can pick winner', async() => {
        try{
            await lottery
                .methods
                .pickWinner()
                .send({
                    from : accounts[1]
                })

            assert(false);
        }
        catch(err) {
            assert(err)
        }
    })

    it('sends money to the winner and resets the players array', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        })

        const initialBalance = await web3.eth.getBalance(accounts[0])
        await lottery
            .methods
            .pickWinner()
            .send({
                from: accounts[0]
            })
        const finalBalance = await web3.eth.getBalance(accounts[0])
        const difference = finalBalance - initialBalance;

        assert(difference > web3.utils.toWei('1.9', 'ether'))
        assert(await lottery.methods.getPlayers().call({ from : accounts[0] }))
        assert(await web3.eth.getBalance(lottery.options.address) == 0)
    })
})
