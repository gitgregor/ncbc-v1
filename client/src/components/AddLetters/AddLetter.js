
import React from 'react';

import addLetterStyle from './addLetter.module.css'


class Typer extends React.Component {

    static defaultProps = {
        // heading: '',
        // heading: 'OUR Motto:',
        dataText: ["WITAM W APLIKACJI", "DOWNLOAD", "BEZPIECZNA KRYPTOGRAFIA"]
        // dataText: ["WELCOME TO MY WORLD", "THIS IS MY WEBSITE", "I AM AT YOUR SERVICE"]
    }

    constructor(props) {
        super(props);

        this.state = {
            text: '',
            loopNum: 0,
            typingSpeed: 30,
            // typingSpeed: 150,

        }
    }

    componentDidMount() {
        this.handleType();
    }

    handleType = () => {
        const { dataText } = this.props;
        const { isDeleting, loopNum, text, typingSpeed } = this.state;
        // const i = loopNum % this.props.welcomeSlogan.length;
        // const fullText = this.props.welcomeSlogan[i];
        const i = loopNum % dataText.length;
        const fullText = dataText[i];

        this.setState({
            text: isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1),
            typingSpeed: isDeleting ? 30 : 150
            // typingSpeed: isDeleting ? 30 : 150
        });

        if (!isDeleting && text === fullText) {

            setTimeout(() => this.setState({ isDeleting: true }), 500);

        } else if (isDeleting && text === '') {

            this.setState({
                isDeleting: false,
                loopNum: loopNum + 1
            });

        }

        setTimeout(this.handleType, typingSpeed);
    };

    render() {
        return (
            <h1>{this.props.heading}&nbsp;
                <span className={addLetterStyle.slogan} >{this.state.text}</span>
                <span id="cursor" />
            </h1>
        );

    }
}

export default Typer
