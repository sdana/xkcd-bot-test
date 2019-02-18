import React, { Component } from 'react';
import './App.css';

class App extends Component {

  state = {
    searchTerm: "",
    results: {},
    currentComic: {},
    currentArrayIndex: 0
  }

  // Update state whenever an input field is edited
  handleFieldChange = evt => {
    const stateToChange = {}
    stateToChange[evt.target.id] = evt.target.value
    this.setState(stateToChange)
  }

  search = () => {
    fetch(`http://localhost:5000/getcomic/${this.state.searchTerm}`, {headers: {'Content-Type':'application/json'}})
    .then(res => res.json()).then(res => this.setState({results: res})).then(x => {
        if (this.state.results.length > 0) {
          this.getCurrentComic(this.state.results[0])
        }
      })
  }

  getCurrentComic = (comicNumber) => {
    let fullUrl = `http://localhost:5000/comic/${comicNumber}`
    fetch((fullUrl), {headers: {"Content-Type": "application/json"}})
    .then(res => res.json()).then(res => this.setState(prevState => {
      return {
        currentComic: res
      }
    }))
  }

  getPreviousComic = () => {
    let i = this.state.currentArrayIndex + 1
    let fullUrl = `http://localhost:5000/comic/${this.state.results[i]}`
    fetch((fullUrl), {headers: {"Content-Type": "application/json"}})
    .then(res => res.json()).then(res => this.setState((prevState) => {
      return {
        currentArrayIndex: this.state.currentArrayIndex - 1,
        currentComic: res
      }
    }))
  }

  getNextComic = () => {
    let i = this.state.currentArrayIndex + 1
    let fullUrl = `http://localhost:5000/comic/${this.state.results[i]}`
    fetch((fullUrl), { headers: { "Content-Type": "application/json" } })
      .then(res => res.json()).then(res => this.setState((prevState) => {
        return {
          currentArrayIndex: this.state.currentArrayIndex + 1,
          currentComic: res
        }
      }))
  }

  render() {
    return (
      <React.Fragment>
        <form autocomplete="off" onSubmit={(e) => {e.preventDefault(); this.search();}}>
          <input type='text' placeholder="Search for xkcd comic" onChange={this.handleFieldChange} id="searchTerm"></input>
        </form>

        <button onClick={this.getPreviousComic}>Previous Comic</button><button onClick={this.getNextComic}>Next Comic</button>
        <h1>Results: {this.state.results.length}</h1>
        <div>
          {(this.state.currentComic) ? <h3>{this.state.currentComic.title}</h3> : null}
          {(this.state.currentComic) ? <img src={this.state.currentComic.img} alt={this.state.currentComic.title}/> : null}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
