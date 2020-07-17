const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const helmet = require("helmet");
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('../models/data');
const SignUpData = require('../models/signUpSchema')
const path = require('path')
const fs = require('fs');

var crypto = require('crypto');

// const API_PORT = 3001;
const app = express();
app.use(cors());
// secure headers
app.use(helmet());
app.set('x-powered-by', false)

const router = express.Router();

// MongoDB database route on Crypto cluster
const dbRoute = "mongodb+srv://CPC:VybFOH357NcvEWSY@crypto-project-cluster.sump0.mongodb.net/crypto?retryWrites=true&w=majority"


// connect backend code with mongoDB by mongoose library
mongoose.connect(dbRoute, { useNewUrlParser: true });
let db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// parse the request body to be a readable as json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// express get method fetches all available data into database
router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });
});

// find user in DB
router.get('/getSignIN', (req, res) => {
    SignUpData.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ user: data });
    });
});

// Crypto logic, it works with hashes and node.js streams.
// Retun hexadecimal coded hash. Checksum is counted with node read stream
router.get('/getHash/:var/:var1/:var2/:var3', (req, res) => {
    const dl = () => {

        const path2file = req.params.var
        const fileNameFromDownLoadLink = req.params.var3
        const PathCounted = path.join(path2file, fileNameFromDownLoadLink)

        let hash = crypto.createHash('sha256'),
            stream = fs.createReadStream(PathCounted);

        stream.on('data', _buff => { hash.update(_buff, 'utf8'); });
        stream.on('end', () => {
            const hashCheckSum = hash.digest('hex');
            console.log(hashCheckSum)


            console.log('------------------')
            console.log(PathCounted)
            console.log('------------------')
            // console.log('__dirname')
            // console.log('------------------')
            // console.log('------------------')
            // console.log(process.env.public)
            // console.log(process.env.pwd)
            // console.log('------------------')
            // console.log('------------------')
            // console.log(' I am in postDownLoadPath')
            // console.log('------------------')
            // console.log(req.params)
            // console.log('------------------')
            // console.log(req.params.var)
            // console.log(req.params.var1)
            // console.log('------------------')
            // console.log('------------------')

            const Result = res.json({ hash: hashCheckSum, hashPath: __dirname, sourcePath: req.params.var, fileName: req.params.var1, pathWithFname: PathCounted })
            return Result
        });
    }
    dl();
})


// express post method putting download path to the mongoDB (using save method) and checking incoming variable parameter in console.
router.post('/postDownLoadPath/:variable', (req, res) => {

    // const pathWin32 = path.win32.normalize('G:\node-demos\7-node-module\demo\config.json')
    // const parsePath = path.parse(pathWin32)
    // console.log(parsePath)

    // path1 = path.parse("C:\\users\\admin\\website\\index.html");
    // console.log(path1);

    let data = new Data();

    const { id, message, em, uspass } = req.body;

    if ((!id && id !== 0) || !message) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS',
        });
    }

    data.message = message;
    data.id = id;
    data.em = em;
    data.uspass = uspass;
    data.save((err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });

    console.log('------------------')
    console.log(' I am in postDownLoadPath')
    console.log('------------------')
    // console.log(req.params)
    // console.log('------------------')
    // console.log(req.params.variable)
    // console.log('------------------')
    // console.log('------------------')
});


// express post method putting sign up data from MaterialUI Form to the mongoDB (using save method) and checking incoming variable parameter in console.
router.post('/postSU/:variable', (req, res) => {

    let data = new SignUpData();

    const { fName, lastName, email, password } = req.body;

    data.firstNameMDB = fName;
    data.lastNameMDB = lastName;
    data.emailMDB = email;
    data.passwordMDB = password;

    data.save((err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });

    console.log('------------------')
    console.log('------------------')
    console.log(' I am in postSU')
    console.log('------------------')
    console.log(req.params)
    console.log('------------------')
    console.log(req.params.variable)
    console.log('------------------')
    console.log('------------------')
});


// update method which
// overwrites existing data in database
router.post('/updateData', (req, res) => {
    const { id, update } = req.body;
    Data.findByIdAndUpdate(id, update, (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

// delete method which
// removes existing data in database
router.delete('/deleteData', (req, res) => {
    const { id } = req.body;
    Data.findByIdAndRemove(id, (err) => {
        if (err) return res.send(err);
        return res.json({ success: true });
    });
});

// create method which
// adds new data into database
router.post('/putData', (req, res) => {
    let data = new Data();

    const { id, message } = req.body;

    if ((!id && id !== 0) || !message) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS',
        });
    }
    data.message = message;
    data.id = id;
    data.save((err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

// append /api path for http requests
app.use('/api', router);

// launch backend into a port
// app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

exports.app = app;





