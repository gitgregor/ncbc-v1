import React from 'react'
import { Link } from 'react-router-dom';
import './logout.styles.scss'

const Logout = () => {
    return (
        <div className="logout-container">
            <div className="logout-titles">
                <p className="title" > Jesteś Wylogowany </p>
                <p className="subtitle" > Dziękuję za wizytę na stronie</p>
            </div>

            <div className="login-link">
                <Link to="/mainapp">Chcesz się zalogować ?</Link>
            </div>
        </div>
    )
}

export default Logout