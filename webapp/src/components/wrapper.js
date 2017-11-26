// @Flow
import React, { Component } from "react";
import styled from "styled-components";

type PropTypes = {};

const WrapperContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export default class Wrapper extends Component<PropTypes> {
  render() {
    return <WrapperContainer>{this.props.children}</WrapperContainer>;
  }
}
