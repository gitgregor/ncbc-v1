import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

import Header from '../components/header/Header.component'
import MainApp from './MainApp'
import SignUp from '../components/SignUp'
import SignIn1 from '../components/SignIn1'
import Logout from '../components/logout/logout'
import MainAppWOlogin from './MainAppWOlogin'
import Contact from '../components/contact/contact.component'

import '../scss/routeApp.styles.scss'


class App extends Component {

    render() {

        return (
            <div className="App">
                <Header />
                <Switch>
                    <Route exact path="/" component={Contact} />
                    <Route path="/signup" component={SignUp} />
                    <Route path="/signin" component={SignIn1} />
                    <Route path="/mainapp" component={MainApp} />
                    <Route path="/mainappwologin" component={MainAppWOlogin} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/logout" component={Logout} />
                </Switch>
            </div>
        );
    }
}

export default App;
