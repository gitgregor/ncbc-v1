import React from 'react';
import ReactDOM from 'react-dom';
import RouteApp from './pages/RouteApp';
import { BrowserRouter as Router } from 'react-router-dom'


ReactDOM.render(
    <Router>
        <RouteApp />
    </Router>,
    document.getElementById('root')
)

