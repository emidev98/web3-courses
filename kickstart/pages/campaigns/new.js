import React from 'react';
import AppLayout from '../../components/AppLayout';
import { Input, Form, Button, Message } from 'semantic-ui-react';
import { Router } from '../../routes';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';


class CampaignsNew extends React.Component {
    state = {
        minimumContribution: '0',
        errorMessage : '',
        loading : false
    };

    onSubit = async (event) => {
        event.preventDefault();
        this.setState({
            errorMessage: '',
            loading: true
        });

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                });
            Router.push("/");
        }
        catch(e) {
            this.setState({
                errorMessage : e.message
            });
        }

        this.setState({
            loading: false
        });
    };

    render() {
        return (
            <AppLayout>
                <h2>Create a campaign</h2>
                <Form onSubmit={this.onSubit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum contribution</label>
                        <Input value={this.state.minimumContribution}
                            onChange={event => this.setState({ minimumContribution: event.target.value })}
                            label='wei' 
                            labelPosition='right'
                            placeholder='100' 
                            disabled={this.state.loading}/>
                    </Form.Field>
                    <Message error header='Oops!' content={this.state.errorMessage}></Message>
                    <Button primary 
                        loading={this.state.loading}
                        disabled={this.state.loading}> Create</Button>
                </Form>
            </AppLayout>
        );
    };

}

export default CampaignsNew; 