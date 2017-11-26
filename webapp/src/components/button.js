import React, { Component } from "react";
import styled from "styled-components";
import { black, white, red } from "./variables";
import { rem, rgba } from "./helpers";

const ButtonContainer = styled.div`
  display: block;
  background: ${black};
  font-size: ${rem(18)};
  border-radius: 3px;
  text-align: center;
  color: ${white};
  line-height: 50px;
  overflow: hidden;
  height: 50px;
  transition: 0.2s all;
  box-shadow: 0 3px 15px 0 ${rgba(black, 0.2)};
  cursor: pointer;

  ${props => {
    if (props.google) {
      return `background: ${red}`;
    }
  }};

  &:hover {
    background: ${rgba(black, 0.9)};
    box-shadow: 0 3px 10px 0 ${rgba(black, 0.2)};
  }
`;

export default class Button extends Component<PropTypes> {
  render() {
    return (
      <ButtonContainer {...this.props}>{this.props.children}</ButtonContainer>
    );
  }
}
