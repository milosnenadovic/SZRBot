import React from 'react';
import './GornjaLinija.css';

class GornjaLinija extends React.Component {

    render(props) {
        return (
            <div className="row">
                <div className="column">
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
                </div>
                <div className="column">
                    <img src="https://img.icons8.com/ios-glyphs/30/000000/user--v1.png" alt="Korisnik: " height="30px" />
                    <h5>{this.props.username}</h5>
                </div>
            </div>
        )
    }
}

export default GornjaLinija;