import React from 'react'
import Axios from 'axios'

import {
  Button,
  Table,
  Form
} from 'react-bootstrap'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quote: "",
      listOfQuote: [],
      onEdit: null
    }
  }

  componentDidMount() {
    let data = JSON.parse(localStorage.getItem("listOfQuotes"))

    this.setState({ listOfQuote: data })
  }

  getQuote = () => {
    Axios.get('https://api.kanye.rest/')
      .then(res => {
        this.setState({ quote: res.data.quote })
      })
      .catch(() => {
        console.log('Failed')
      })
  }

  saveQuote = () => {
    let tempArr = this.state.listOfQuote
    tempArr.push(this.state.quote)
    let data = JSON.stringify(tempArr)
    localStorage.setItem("listOfQuotes", data);
    this.setState({ listOfQuote: tempArr })
  }

  onDelete = (index) => {
    const tempArr = this.state.listOfQuote
    tempArr.splice(index, 1)
    let data = JSON.stringify(tempArr)
    localStorage.setItem("listOfQuotes", data);
    this.setState({ listOfQuote: tempArr })
  }

  onSave = (index) => {
    const tempArr = this.state.listOfQuote
    const newQuote = this.refs.editQuote.value

    tempArr.splice(index, 1, newQuote)
    let data = JSON.stringify(tempArr)
    localStorage.setItem("listOfQuotes", data);
    this.setState({ 
                    listOfQuote: tempArr,
                    onEdit: null
                  })
  }

  render() {
    return(
      <div style={{ padding: '5vw'}}>
        <h5>This is a website to get random quotes from Kanye West</h5>
        <Button variant="primary" style={{ marginBottom: '5vh'}} onClick={this.getQuote}>Click Here</Button>
        {this.state.quote ? 
        <div>
          <h5>Quote: {this.state.quote}</h5>
          <Button variant="success" style={{ marginBottom: '5vh'}} onClick={this.saveQuote}>Save</Button>
        </div> : null}
        {this.state.listOfQuote && this.state.listOfQuote.length !== 0 ? 
        <div>
          <h5>List Of Quotes</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Quote</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {this.state.listOfQuote.map((item, index) => {
              if (this.state.onEdit === index) {
                return (
                  <tr key={index}>
                      <td>{index + 1}</td>
                      <td><Form.Control type="text" defaultValue={item} ref="editQuote" /></td>
                      <td>
                        <Button variant="success" style={{ marginRight: '1vw' }} onClick={() => this.onSave(index)}>Save</Button>
                        <Button variant="danger" onClick={() => this.setState({ onEdit: null })}>Cancel</Button>
                      </td>
                  </tr>
                )
              } else {
                return (
                  <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item}</td>
                      <td>
                        <Button variant="warning" style={{ marginRight: '1vw' }} onClick={() => this.setState({ onEdit: index })}>Edit</Button>
                        <Button variant="danger" onClick={() => this.onDelete(index)}>Delete</Button>
                      </td>
                  </tr>
                )
              }
            })}
            </tbody>
          </Table>
        </div> : null}
      </div>
    )
  }
}

export default App;
