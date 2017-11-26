import React, { Component } from "react";
import styled from "styled-components";

const Heading = styled.h1`
  font-size: 18px;
  color: red;
`;

export default class App extends Component {
  render() {
    return <Heading>Smart Home</Heading>;
  }
}
