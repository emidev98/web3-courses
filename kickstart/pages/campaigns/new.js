import React from 'react';
import AppLayout from '../../components/AppLayout';
import { Input, Form, Button } from 'semantic-ui-react';
import { factory } from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

class CampaignsNew extends React.Component {
    state = {
        minimumContribution: '0'
    };

    onSubit = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();
        await factory.methods
            .createCampaign(this.state.minimumContribution)
            .send({
                from: accounts[0]
            });
    };

    render() {
        return (
            <AppLayout>
                <h2>Create a campaign</h2>
                <Form onSubmit={this.onSubit}>
                    <Form.Field>
                        <label>Minimum contribution</label>
                        <Input value={this.state.minimumContribution}
                            onChange={event => this.setState({ minimumContribution: event.target.value })}
                            label='wei' 
                            labelPosition='right'
                            placeholder='100' />
                    </Form.Field>
                    <Button primary> Create</Button>
                </Form>
            </AppLayout>
        );
    };

}

export default CampaignsNew; 