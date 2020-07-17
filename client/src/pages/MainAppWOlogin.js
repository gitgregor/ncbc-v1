
import React, { Component } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';

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
      let interval = setInterval(this.getDataFromDb, 50000);
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
  };


  // Download feature dealt with FileSaver library and send downloading path to the data base
  handleDL = (e) => {
    // define and encoding URI in order to send safety path to the server 
    const { inputLoadingPath } = this.state
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


    axios.post(`http://localhost:3001/api/postDownLoadPath/${uri}`,
      {
        id: idToBeAdded,
        message: inputLoadingPath, // send to mongoDB axios post request with download path
      }
    )

    // handle FileSaver 
    this.myPromise = new Promise((resolve, reject) => {
      if (true) {
        resolve(FileSaver.saveAs(`${inputLoadingPath}`, fileName))
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

  // ========= test handle hash with sending path parameter
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


  // ==== User Interface rander method =========

  render() {
    const { inputLoadingPath, typedHash, outputHash, testPath, outputSourcePath, CryptoFileName, pathFileName } = this.state;

    return (
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
                ? <div className="good-hash" ><span className="gh-span">REZULTAT:</span> HASHE są zgodne. INTEGRALNOŚĆ PLIKU NIE NARUSZONA</div>
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
    );
  }
}

export default App;















