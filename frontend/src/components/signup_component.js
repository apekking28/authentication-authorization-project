import React, { Component } from "react";
import app from "./fireBase_config";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
const auth = getAuth(app);

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      mobile: "",
      password: "",
      verifyButton: false,
      verifyOtp: false,
      otp: "",
      verified: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSignInSubmit = this.onSignInSubmit.bind(this);
    this.verifyCode = this.verifyCode.bind(this);
  }

  onCaptchVerify() {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          this.onSignInSubmit();
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
      },
      auth
    );
  }

  onSignInSubmit() {
    this.onCaptchVerify();
    const phoneNumber = "+62" + this.state.mobile;
    console.log(phoneNumber);
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        alert("OTP sended");
        this.setState({ verifyOtp: true });
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
      });
  }

  verifyCode() {
    window.confirmationResult
      .confirm(this.state.otp)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        console.log(user);
        alert("Verification Done");
        this.setState({
          verified: true,
          verifyOtp: false,
        });
      })
      .catch((error) => {
        alert("Invalid OTP");
        // User couldn't sign in (bad verification code?)
        // ...
      });
  }

  changeMobile(e) {
    this.setState({ mobile: e.target.value }, function () {
      if (this.state.mobile.length === 10) {
        this.setState({
          verifyButton: true,
        });
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.verified) {
      const { fname, lname, mobile, password } = this.state;
      console.log(fname, lname, mobile, password);
      fetch("http://localhost:5000/register", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          fname,
          mobile,
          lname,
          password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "userRegister");
        });
    } else {
      alert("Please verify mobile cuk...");
    }
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Sign Up</h3>
        <div id="recaptcha-container"></div>

        <div className="mb-3">
          <label>First name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            onChange={(e) => this.setState({ fname: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Last name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Last name"
            onChange={(e) => this.setState({ lname: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>mobile</label>
          <input
            type="mobile"
            className="form-control"
            placeholder="Enter mobile"
            onChange={(e) => this.changeMobile(e)}
          />
          {this.state.verifyButton ? (
            <input
              type="button"
              value={this.state.verified ? "verified" : "verify"}
              onClick={this.onSignInSubmit}
              style={{
                backgroundColor: "#0163d2",
                width: "100%",
                padding: "8",
                color: "white",
                border: "none",
              }}
            />
          ) : null}
        </div>

        {this.state.verifyOtp ? (
          <div className="mb-3">
            <label>OTP</label>
            <input
              type="OTP"
              className="form-control"
              placeholder="Enter OTP"
              onChange={(e) => this.setState({ otp: e.target.value })}
            />
            <input
              type="button"
              value="OTP"
              onClick={this.verifyCode}
              style={{
                backgroundColor: "#0163d2",
                width: "100%",
                padding: "8",
                color: "white",
                border: "none",
              }}
            />
          </div>
        ) : null}

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) => this.setState({ password: e.target.value })}
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
        <p className="forgot-password text-right">
          Already registered <a href="/sign-in">sign in?</a>
        </p>

        <p className="forgot-password text-right">
          Forgot password <a href="/forgot-password">Forgot password?</a>
        </p>
      </form>
    );
  }
}
