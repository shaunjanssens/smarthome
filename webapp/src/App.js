// @Flow
import React, { Component } from "react";
import styled from "styled-components";
import firebase, { auth, provider } from "./services/firebase.js";
import Login from "./pages/login";
import Main from "./pages/main";

type PropTypes = {};
type StateTypes = {
  user: any
};

const Page = styled.div`
  position: relative;
  padding: 30px;
  height: 100vh;
`;

export default class App extends Component<PropTypes, StateTypes> {
  state = {
    user: null
  };

  componentDidMount() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    // Check if user is already logged in
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  login() {
    auth
      .signInWithPopup(provider)
      .then(result => {
        const user = result.user;
        this.setState({
          user
        });
      })
      .catch(error => console.error(error));
  }

  logout() {
    auth
      .signOut()
      .then(() => {
        this.setState({
          user: null
        });
      })
      .catch(error => console.error(error));
  }

  render() {
    const { user } = this.state;
    return (
      <Page>
        {user ? <Main logout={this.logout} /> : <Login login={this.login} />}
      </Page>
    );
  }
}
