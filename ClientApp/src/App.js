import React from "react";
import Pretraga from "./components/Pretraga";
import VideoLista from "./components/VideoLista";
import youtube, { API_DEFAULT_PARAMS } from "./apis/youtube";
import VideoOpis from "./components/VideoOpis";
import GornjaLinija from "./components/GornjaLinija";
import "./components/style.css";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from './store/Korisnici';

class App extends React.Component {
    state = {
        videoSnimci: [],
        izabranVideo: null,
        ID: null,
        ime: "",
        prezime: "",
        email: "",
        pretraga: false,
        unos: "",
        submit: false
    };

    componentDidMount = () => {
        this.onUnosSubmit('Srbija');
    }

    pozoviKorisnike = async () => {
        const url = `api/Korisnici`;
        const fetchData = await fetch(url);
        const korisnici = await fetchData.json();
        console.log(korisnici); //opciono: ukoliko zelimo da proverimo da li je novi korisnik upisan u tabelu kao i da vidimo prethodne korisnike
        var postoji = false;
        for (var i = 0; i < korisnici.length; i++) {
            if (korisnici[i].email === this.state.email) postoji = true;
        };
        if (!postoji) {
            this.dodajKorisnik();
        }
    }

    dodajKorisnik = () => {
        const korisnik = { ime: this.state.ime, prezime: this.state.prezime, email: this.state.email };
        this.props.dodajKorisnika(korisnik);
    }

    onUnosSubmit = async (unos) => {
        const response = await youtube.get("/search", {
            params: {
                ...API_DEFAULT_PARAMS,
                q: unos,
            },
        });
        this.setState({
            videoSnimci: response.data.items,
            izabranVideo: response.data.items[0],
            unos: unos
        });
        if (unos !== "Srbija") {
            if (this.proveraPretrage(unos)) this.pozoviKorisnike();
        }
    };

    proveraPretrage = (unos) => {
        const sojic = ["sojic", "Sojic", "SOJIC", "sOJIC", "šojić", "Šojić", "ŠOJIĆ", "šOJIĆ"];
        const szr = ["szr", "SZR", "Szr", "sZR", "szR", "sZr", "SZr", "SzR"];
        const belaLadja = ["belaladja", "belaLadja", "BELALADJA"];
        const okidaci = [sojic.concat(szr).concat(belaLadja)];
        var arr = unos.split(" ");
        var res = false;
        for (var i = 0; i < arr.length; i++) {
            if (okidaci[0].includes(arr[i])) {
                res = true;
            };
        };
        return res;
    };

    onVideoSelect = (video) => {
        this.setState({ izabranVideo: video });
    };

    onFormaSubmit = (e) => {
        e.preventDefault();
        if (this.state.ime.length < 1) {
            alert('Greška pri unosu imena!');
            document.querySelector('#ime').setAttribute('style', 'border-color: red;');
        } else if (this.state.prezime.length < 1) {
            alert('Greška pri unosu prezimena!');
            document.querySelector('#prezime').setAttribute('style', 'border-color: red;');
            document.querySelector('#ime').removeAttribute('style');
        } else if (this.state.email.length < 1) {
            alert('Niste uneli email!');
            document.querySelector('#email').setAttribute('style', 'border-color: red;');
            document.querySelector('#prezime').removeAttribute('style');
            document.querySelector('#ime').removeAttribute('style');
        } else if (!this.state.email.includes('@') || !this.state.email.includes('.')) {
            alert('Greška pri unosu email-a!');
            document.querySelector('#email').setAttribute('style', 'border-color: red;');
            document.querySelector('#prezime').removeAttribute('style');
            document.querySelector('#ime').removeAttribute('style');
        } else {
            document.querySelector('#prezime').removeAttribute('style');
            document.querySelector('#ime').removeAttribute('style');
            document.querySelector('#email').removeAttribute('style');
            this.setState({ submit: true });
        }
    };

    onImeChange = (e) => {
        this.setState({ ime: e.target.value });
    };

    onPrezimeChange = (e) => {
        this.setState({ prezime: e.target.value });
    };

    onEmailChange = (e) => {
        this.setState({ email: e.target.value });
        if (e.target.value.includes("@") && e.target.value.includes(".com")) {
            this.proveriPostojanje(e.target.value);
        }
    };

    proveriPostojanje = async (email) => {
        const url = `api/Korisnici`;
        const fetchData = await fetch(url);
        const korisnici = await fetchData.json();
        for (var i = 0; i < korisnici.length; i++) {
            if (korisnici[i].email === email) {
                this.setState({ prezime: korisnici[i].prezime });
                document.querySelector('#prezime').value = korisnici[i].prezime;
                this.setState({ ime: korisnici[i].ime });
                document.querySelector('#ime').value = korisnici[i].ime;
            };
        };
    }

    render() {
        return (this.state.ime.length < 1 || this.state.prezime.length < 1 || this.state.email.length < 1 || this.state.submit === false) ?
            (<div className="ui container">
                <div style={{ display: "inline-block" }}>
                    <h1 style={{
                        color: "white",
                        backgroundColor: "red",
                        padding: "5px 10px 5px 10px",
                        marginTop: "10px",
                        borderRadius: "15px"
                    }}>
                        MeTube<sup><small>RS</small></sup>
                    </h1>
                </div>
                <form className="ui form" onSubmit={this.onFormaSubmit}>
                    <div id="field" className="field">
                        <label>Email:</label>
                        <input type="text" id="email" name="email" placeholder="email@email.com" onChange={this.onEmailChange} />
                    </div>
                    <div id="field" className="field">
                        <label>Ime:</label>
                        <input type="text" id="ime" name="ime" placeholder="Ime" onChange={this.onImeChange} />
                    </div>
                    <div id="field" className="field">
                        <label>Prezime:</label>
                        <input type="text" id="prezime" name="prezime" placeholder="Prezime" onChange={this.onPrezimeChange}></input>
                    </div>
                    <button className="ui button" id="btn" type="submit">Pristupi stranici</button>
                </form>
            </div>) :
            (<div className="ui container">
                <GornjaLinija username={this.state.ime + " " + this.state.prezime} />
                <Pretraga onFormSubmit={this.onUnosSubmit} />
                <div className="ui grid">
                    <div className="ui row">
                        <div className="eleven wide column">
                            <VideoOpis video={this.state.izabranVideo} />
                        </div>
                        <div className="five wide column">
                            <VideoLista
                                onVideoSelect={this.onVideoSelect}
                                videos={this.state.videoSnimci}
                            />
                        </div>
                    </div>
                </div>
                <a href="https://icons8.com/icon/98957/user">User icon by Icons8</a>
            </div>);
    }
}

export default connect(
    state => state.radnici,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(App);
