import React from "react";

class Pretraga extends React.Component {
  state = { unos: "" };

  onInputChange = (e) => {
    this.setState({ unos: e.target.value });
  };

  onFormSubmit = (e) => {
      e.preventDefault();
      this.props.onFormSubmit(this.state.unos);
  };

  render() {
    return (
      <div className="search-bar ui segment">
        <form onSubmit={this.onFormSubmit} className="ui form">
          <div className="field">
            <label>Pretraga</label>
            <input
              type="text"
              value={this.state.unos}
              onChange={this.onInputChange}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default Pretraga;
