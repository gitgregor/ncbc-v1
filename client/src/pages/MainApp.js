
import React, { Component } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';
import SignUp from '../components/SignUp'
import SignIn1 from '../components/SignIn1'
import HomePage from './Homepage'

import '../scss/main-app.scss'
import '../scss/maiinapp-wo-log.stytles.scss'

class App extends Component {

  constructor(props) {
    super(props)

    // state initialization
    this.state = {
      data: [],
      outputHash: [],
      outputHashPath: [],
      testPath: '',
      outputSourcePath: '',
      CryptoFileName: '',
      pathFileName: '',
      user: [],
      eml: '',
      pass: '',
      logged: false,
      id: 0,
      message: null,
      intervalIsSet: false,
      idToDelete: null,
      idToUpdate: null,
      objectToUpdate: null,
      inputLoadingPath: "",
      typedHash: "",
    }
  }


  // After initially mounted Components by render function all existing data are fetched from db.
  // Next, using setInterval, this bussines logic will be checking if any data has chnged so that we can easily see rendered result at UI.
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }


  // kill setInterval process due to protect against memory leakage
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }


  // use backend api to
  // fetch all data from mongoDB. 
  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));  // Use promise in order to put json data fetched from backend into React state
  };


  // axios put method that uses backend api
  // in order to create new data value at data base.
  putDataToDB = (message) => {
    // here is used the object id assigned by MongoDB to modify (here add)
    // data base properties
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('http://localhost:3001/api/putData', {  // post request sending data to DB
      id: idToBeAdded,
      message: message,
    });
  };


  // delete method that uses our backend api and id property
  // to remove existing database information
  deleteFromDB = (idTodelete) => {
    parseInt(idTodelete);
    let objIdToDelete = null;
    this.state.data.forEach((dat) => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete,
      },
    });
    // this.setState({ idToDelete: null });
  };


  // update method that uses our backend api and id property
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach((dat) => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post('http://localhost:3001/api/updateData', {
      id: objIdToUpdate,
      update: { message: updateToApply },
    });
    this.setState({ idToUpdate: null, updateToApply: null });
  };


  // Download function deal with FileSaver library and send downloading path to the data base
  handleDL = (e) => {

    // define and encoding URI in order to send safety path to the server 
    const { inputLoadingPath, eml, pass } = this.state
    const findSlash = inputLoadingPath.lastIndexOf("/")
    const fileIndex = findSlash + 1
    const fileName = inputLoadingPath.substr(fileIndex)
    const uri = encodeURIComponent(inputLoadingPath)

    // console.log(inputLoadingPath.lastIndexOf("/"));
    // console.log(findSlash)
    // console.log(fileName)

    // mongodb id property logic
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    //axios post send parameter of path to the backend
    axios.post(`http://localhost:3001/api/postDownLoadPath/${uri}`,
      {
        id: idToBeAdded,
        message: inputLoadingPath, // send to mongoDB axios post request with download path
        em: eml,
        uspass: pass,
        uid: 108,
      }
    )

    // handle FileSaver 
    this.myPromise = new Promise((resolve, reject) => {
      if (true) {
        resolve(FileSaver.saveAs(`${inputLoadingPath}`, fileName))
        // resolve(FileSaver.saveAs(`${inputLoadingPath}`, 'plik'))
        // console.log(process.env)
        // console.log(__dirname)
        // console.log(__filename)
      } else {
        reject('I have failed')
      }
    })

    this.myPromise
      .then(() => console.log("ok"))
      .catch(rejectValue => console.log(rejectValue));

    // reset inputLoadingPath state value
    // this.setState({ inputLoadingPath: "" }); 
  }


  handleInputChange = (e) => {
    e.preventDefault()
    this.setState({ inputLoadingPath: e.target.value });
  }


  // handle hash feature with sending path parameters to express
  handleHash = () => {
    const { inputLoadingPath } = this.state
    const findSlash = inputLoadingPath.lastIndexOf("/")
    const fileIndex = findSlash + 1

    console.log(inputLoadingPath.lastIndexOf("/"));
    console.log(findSlash)

    const fileName = inputLoadingPath.substr(fileIndex)
    console.log(fileName)

    // define and encoding URI in order to send safety path to the server 
    const { testPath } = this.state
    const url = encodeURIComponent(testPath)
    const var1 = encodeURIComponent(fileName)
    const path = this.state.inputLoadingPath
    const var2 = path.substr(path.length - 3, path.length)
    const var3 = fileName

    // send parameters to express by fetch get method as variables in http path
    fetch(`http://localhost:3001/api/getHash/${url}/${var1}/${var2}/${var3}`)
      .then((data) => data.json())
      .then((res) => this.setState({ outputHash: res.hash, outputHashPath: res.hashPath, outputSourcePath: res.sourcePath, CryptoFileName: res.fileName, pathFileName: res.pathWithFname }));
  }


  handleTypedHash = (e) => {
    e.preventDefault()
    this.setState({ typedHash: e.target.value });
  }


  testPathHandler = (e) => {
    e.preventDefault()
    this.setState({ testPath: e.target.value });
  }


  // Sign Up handler
  loggerHandler = (fName, lastName, email, password) => {
    axios.post(`http://localhost:3001/api/postSU/${fName}`,
      {
        fName: fName,
        lastName,
        email,
        password
      }
    )
  }


  signInHandler = (email, password) => {
    fetch('http://localhost:3001/api/getSignIN')
      .then((data) => data.json())
      .then((res) => this.setState({ user: res.user }));  // Use promise in order to put json data fetched from backend into React state

    this.setState(() => ({ eml: email }))
    this.setState(() => ({ pass: password }))
  };


  // ==== User Interface rander method =========
  render() {

    const { data, inputLoadingPath, typedHash, outputHash, testPath, outputSourcePath, CryptoFileName, pathFileName, eml, pass } = this.state;

    const userEmailFinded = this.state.user.map(x => x.emailMDB).filter(y => y === eml)
    const userPassFinded = this.state.user.map(x => x.passwordMDB).filter(y => y === pass)


    const condition = ((userEmailFinded[0] === eml && userPassFinded[0] === pass) &&
      ((userEmailFinded[0] !== '' && userPassFinded[0] !== '') ||
        (userEmailFinded[0] !== undefined && userPassFinded[0] !== undefined))
    )

    // console.log(inputLoadingPath)
    // console.log(outputHash)
    // console.log(typedHash)
    // console.log(data)
    // console.log(condition)

    return (
      <>
        <div>
          {
            condition
              ? <HomePage welcome={eml} /> : null
          }

          <div className="logging-wrapper">
            <div className="logging">
              {
                !condition
                  ? <SignUp logger={this.loggerHandler} /> : null
              }
            </div>

            <div className="logging">
              {
                !condition
                  ? <SignIn1 signIN={this.signInHandler} /> : null
              }
            </div>
          </div>

          {
            condition
              ?
              <div>


                <div className="main-app-wol__container">
                  <div className="dl-container">

                    <div className="dl-container__path">
                      <div className="download-path-2-source__title">Podaj link do pliku, który chcesz ściągnąć na dysk swojego komputera</div>

                      <textarea className="download-path-2-source__input" onChange={this.handleInputChange} value={inputLoadingPath} placeholder={'Tu wpisz link http lub https ścieżki z której ściągniesz plik na swój dysk lokalny'} />

                      <button className="dl-button" onClick={this.handleDL}>download</button>
                    </div>

                    <div className="crypto-wrapper">
                      <button className="crypto-button" onClick={this.handleHash}>Oblicz CRYPTO Hash</button>

                      <div className="input-dl-save-path__title">Wprowadź ścieżkę do pliku, który zapisałeś na dysku</div>
                      <textarea
                        className="input-dl-source-path" onChange={this.testPathHandler} value={testPath}
                        placeholder="Tu wpisz ścieżkę dostępu do zapisanego pliku"
                      />

                      <div className="title-hash-2-check__textarea">Wprowadź Hash pliku aby porównać z wyliczonym</div>
                      <textarea className="hash-2-check__textarea" onChange={this.handleTypedHash} value={typedHash}
                        placeholder="Tu wpisz hash pliku otrzymany ze strony downloadu"
                      />

                      {
                        outputHash === typedHash.toLowerCase()
                          ? <div className="good-hash" ><span className="gh-span">REZULTAT:</span> HASHE są zgodne. INTEGRALNOŚĆ PLIKU NIENARUSZONA</div>
                          : <div className="bad-hash" ><span className="bh-span">REZULTAT:</span> niewprowadzony lub niewprowidłowy HASH</div>
                      }

                      <div className="wrap">

                        <div className="hash-counted__title">
                          <div>HASH: </div>
                          <div>NAZWA PLIKU: </div>
                          <div>KATALOG:  </div>
                          <div>ŚCIEŻKA:  </div>
                        </div>

                        <div className="hash-counted__value-container">
                          <div>{outputHash}</div>
                          <div>{CryptoFileName} </div>
                          <div>{outputSourcePath}</div>
                          <div>{pathFileName}</div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>


                <div className="historia">HISTORIA PRZEGLĄDU</div>

                <div className="db-res-wrapper">

                  <div className="db-operation">

                    <div className="delete">
                      <input
                        type="text"
                        onChange={(e) => this.setState({ idToDelete: e.target.value })}
                        placeholder="wprowadź id rekordu"
                      />
                      <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
                        USUŃ
                    </button>
                    </div>

                    <div className="update">
                      <input
                        type="text"
                        onChange={(e) => this.setState({ idToUpdate: e.target.value })}
                        placeholder="wprowadź id rekordu"
                      />
                      <input
                        type="text"
                        onChange={(e) => this.setState({ updateToApply: e.target.value })}
                        placeholder="wprowadź nową wartość"
                      />
                      <button
                        onClick={() =>
                          this.updateDB(this.state.idToUpdate, this.state.updateToApply)
                        }
                      >
                        AKTUALIZACJA
                    </button>
                    </div>

                  </div>



                  <ul className="ul-list">
                    {
                      data.length <= 0
                        ? 'Czekam na dane z bazy ...'
                        : condition
                          ?
                          data.filter(y => y.em === eml).map((dat) => (
                            <li key={data.message}>
                              <span> id: </span> {dat.id}
                              <br />
                              <span > link: </span> {dat.message}
                              <br />
                              <span>użytkownik: </span> {dat.em}
                            </li>
                          ))
                          : null
                    }
                  </ul>


                </div>




              </div>

              : null
          }
        </div>
      </>
    );
  }
}

export default App;















