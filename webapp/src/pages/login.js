// @Flow
import React, { Component } from "react";
import styled from "styled-components";
import Wrapper from "../components/wrapper";
import Header from "../components/header";
import Button from "../components/button";

const LoginButton = styled(Button)`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

type PropTypes = {};

export default class LoginPage extends Component<PropTypes> {
  render() {
    return (
      <Wrapper>
        <Header title="Welcome back!" icons={false} />
        <p>
          With Smart Home you can turn on your lights, close your blinds and
          control the inside temperature.
        </p>
        <LoginButton google onClick={this.props.login}>
          login with Google
        </LoginButton>
      </Wrapper>
    );
  }
}
