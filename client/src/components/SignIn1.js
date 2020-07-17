import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';



const useStyles = makeStyles((theme) => ({
    paper: {
        height: '50vh',
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(2),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '80%',
        height: '70%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(8, 0, 2),
    },
}));

export default function SignIn({ signIN }) {

    const classes = useStyles();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [text, setText] = useState('')
    const [noLogged, setnoLogged] = useState(false)


    const emailHandler = (e) => {
        setEmail(e.target.value)
    }
    const passwordHandler = (e) => {
        setPassword(e.target.value)
    }

    const SignInButton = (e) => {
        e.preventDefault();
        signIN(email, password);
        setnoLogged(true);
        setText(' Nie ma takiego użytkownika w bazie. Proszę spróbować ponownie ');
        setEmail('');
        setPassword('');
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {noLogged ? text : 'LOGOWANIE'}
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        value={email}
                        onChange={emailHandler}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Adres Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        value={password}
                        onChange={passwordHandler}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Hasło"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={SignInButton}
                    >
                        ZALOGUJ
          </Button>
                    <Grid container>

                    </Grid>
                </form>
            </div>
        </Container>
    );
}