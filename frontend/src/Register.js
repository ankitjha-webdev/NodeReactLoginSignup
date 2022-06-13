import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
const axios = require('axios');

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      confirm_password: ''
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  register = () => {

    axios.post('http://localhost:3001/register', {
      email: this.state.email,
      password: this.state.password,
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
      this.props.history.push('/');
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  render() {
    return (
      <div style={{ marginTop: '200px' }}>
        <div>
          <h2>Register</h2>
        </div>

        <div>
        <input
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="name"
            value={this.state.name}
            onChange={this.onChange}
            placeholder="Enter your name"
            required
          />
           <br /><br />
          <input
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            placeholder="Enter your email"
            required
          />
          <br /><br />
          <input
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            placeholder="Password"
            required
          />
          <br /><br />
          <input
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="confirm_password"
            value={this.state.confirm_password}
            onChange={this.onChange}
            placeholder="Confirm Password"
            required
          />
          <br /><br />
          <button
            className="button_style"
            variant="contained"
            disabled={this.state.email === '' && this.state.password === ''}
            onClick={this.register}
          >
            Register
          </button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/">
            Login
          </Link>
        </div>
      </div>
    );
  }
}