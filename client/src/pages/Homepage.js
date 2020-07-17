import React from 'react'

import './homePage.styles.scss'

const Homepage = (welcome) => {
    return (
        <div className="welcome">
            <h1>Witaj Użytkowniku: <span className="user" >{Object.values(welcome)}</span> </h1>
            <div className="subPage">Strona  Bezpieczenstwa  i  Kryptografii</div>
        </div>
    )
}

export default Homepage


