import React, {Component} from 'react';
import {addNewSeamstress} from '../util/APIUtils';
import '../login/Login.css';

import {Form, Input, Button, Icon, notification} from 'antd';
import {withRouter} from "react-router-dom";

const FormItem = Form.Item;

class SeamstressAdd extends Component {

    render() {
        const AntWrappedSeamstressAddForm = Form.create()(SeamstressAddForm)
        return (
            <div className="login-container">
                <h1 className="page-title">Add seamstress</h1>
                <div className="login-content">
                    <AntWrappedSeamstressAddForm/>
                </div>
            </div>
        );
    }
}

class SeamstressAddForm extends Component {
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const seamstress = Object.assign({}, values);
                addNewSeamstress(seamstress)
                    .then(response => {
                        notification.success({
                            message: 'EMS',
                            description: response.message
                        })
                    }).catch(error => {
                    if (error.status === 404) {
                        notification.error({
                            message: 'EMS',
                            description: 'Please check provided seamstress credentials'
                        });
                    } else {
                        notification.error({
                            message: 'EMS',
                            description: error.message || 'Sorry! Something went wrong. Please try again!'
                        });
                    }
                });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('name', {
                        rules: [{required: true, message: 'Please provide seamstress username'}],
                    })(
                        <Input
                            prefix={<Icon type="user"/>}
                            size="large"
                            name="name"
                            placeholder="Name"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('lastName', {
                        rules: [{required: true, message: 'Please provide seamstress last name!'}],
                    })(
                        <Input
                            prefix={<Icon type="lock"/>}
                            size="large"
                            name="lastName"
                            placeholder="Last Name"/>
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">Create</Button>
                </FormItem>
            </Form>
        );
    }
}


export default withRouter(SeamstressAdd);