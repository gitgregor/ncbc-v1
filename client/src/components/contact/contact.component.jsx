import React from 'react'
import { Link } from 'react-router-dom';
import AddLetter from '../AddLetters/AddLetter'

import './contact.styles.scss'

const Contact = () => {
    return (
        <div className="contact-container">
            <div className="contact-addletter-wrapper">
                <div className="contact-addletter">
                    <AddLetter />
                </div>
            </div>
            <div className="contact-title">Grzegorz Wesołowski</div>
            <div className="contact-subtitle">Front End Developer</div>
            <div className="contact-email">Grzegorz.wesolowski108@gmail.com</div>
            <div className="mainapp-link-wrapper">
                <div className="mainapp-link">
                    <Link to="/mainappwologin"> Kliknij i ściągnij plik</Link>
                </div>
            </div>

        </div>
    )
}

export default Contact

