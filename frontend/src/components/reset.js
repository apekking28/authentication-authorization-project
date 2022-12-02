import React, { Component } from "react";

export default class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const { email } = this.state;
    console.log(email);
    fetch("http://localhost:5000/forgot-password", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        alert(data.status);
      });
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Forgot Password</h3>

        <div class="mb-3">
          <label>Email Adress</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter Email"
            onChange={(e) => this.setState({ email: e.target.value })}
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>

          <p className="forgot-password text-right">
            <a href="/sign-up">Sign Up</a>
          </p>
        </div>
      </form>
    );
  }
}
