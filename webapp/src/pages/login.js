// @flow
import React, { Component } from "react";
import styled from "styled-components";
import * as firebase from "firebase";
import { Button } from "../components/common";
import type { SystemType } from "../types";

type PropTypes = {
  system: SystemType,
  handleLogin: Function
};

type StateTypes = {
  username: string,
  password: string,
  error?: string
};

const Container = styled.div`
  position: relative;
  height: 100%;
`;
const Title = styled.h1``;
const Form = styled.div``;
const Input = styled.input`
  width: 100%;
  height: 50px;
  text-align: center;
  font-size: 1.6rem;
  font-family: inherit;
  border: 1px solid rgba(73, 83, 92, 0.1);
  border-radius: 3px;
  outline: none;
  margin-bottom: 20px;

  &::placeholder {
    color: rgba(73, 83, 92, 0.4);
  }
`;

export default class Login extends Component<PropTypes, StateTypes> {
  state = {
    username: "",
    password: "",
    error: false
  };

  handleChange = (e: any) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
      error: false
    });
  };

  handleLogin = (username, password) => {
    const that = this;
    firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .catch(function(error) {
        that.setState({ error: error.message });
        console.error(error.code, error.message);
      });
  };

  render() {
    const { system } = this.props;
    const { username, password, error } = this.state;

    return (
      <Container>
        <Title>{system.name}</Title>
        <p>{system.description}</p>
        <Form>
          <p>{error ? error : null}</p>
          <Input
            type="emaim"
            name="username"
            placeholder="email"
            value={username}
            onChange={this.handleChange}
          />
          <Input
            type="password"
            name="password"
            placeholder="password"
            password={password}
            onChange={this.handleChange}
          />
          <Button
            value="sign in"
            onClick={() => {
              this.handleLogin(username, password);
            }}
          />
        </Form>
      </Container>
    );
  }
}
