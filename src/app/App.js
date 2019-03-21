import React, {Component} from 'react';
import './App.css';
import {
    Route,
    withRouter,
    Switch
} from 'react-router-dom';

import {getCurrentUser} from '../util/APIUtils';
import {ACCESS_TOKEN} from '../constants';


import Login from '../login/Login';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import Home from "../ems/Home"
import History from "../ems/History"


import {Layout, notification} from 'antd';
import Seamstress from "../ems/Seamstress";
import Result from "../ems/Result";
import Quilting from "../ems/Quilting";

const {Content} = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false,
            isLoading: false
        };

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 1.5,
        });
    }

    loadCurrentUser = () => {
        this.setState({
            isLoading: true
        });
        getCurrentUser()
            .then(response => {
                this.setState({
                    currentUser: response,
                    isAuthenticated: true,
                    isLoading: false
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
        });
    };

    componentDidMount() {
        this.loadCurrentUser();
    }

    handleLogout = (redirectTo = "/login", notificationType = "success", description = "You're successfully logged out.") => {
        localStorage.removeItem(ACCESS_TOKEN);

        this.setState({
            currentUser: null,
            isAuthenticated: false
        });

        this.props.history.push(redirectTo);

        notification[notificationType]({
            message: 'EMS',
            description: description,
        });
    };

    handleLogin = () => {
        notification.success({
            message: 'EMS',
            description: "You're successfully logged in.",
        });
        this.loadCurrentUser();
        this.props.history.push("/");
    };

    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator/>
        }
        return (
            <Layout className="app-container">
                <AppHeader isAuthenticated={this.state.isAuthenticated}
                           currentUser={this.state.currentUser}
                           onLogout={this.handleLogout}/>

                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <Route exact path="/" render={() => <Home history={this.props.history}
                                                                          authenticated={this.state.isAuthenticated}/>}>
                            </Route>
                            <Route exact path="/login"
                                   render={(props) => <Login  history={this.props.history} onLogin={this.handleLogin} {...props} />}>
                            </Route>
                            <Route exact path="/result/:id" component={Result}/>
                            <Route exact path="/history" render={() => <History history={this.props.history}
                                                                                      authenticated={this.state.isAuthenticated}/>}>
                            </Route>
                            <Route exact path="/seamstress" render={() => <Seamstress history={this.props.history}
                                                                                      authenticated={this.state.isAuthenticated}/>}>
                            </Route>
                            <Route exact path="/quilting" render={() => <Quilting history={this.props.history}
                                                                                      authenticated={this.state.isAuthenticated}/>}>
                            </Route>
                            <Route component={NotFound}/>
                        </Switch>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default withRouter(App);