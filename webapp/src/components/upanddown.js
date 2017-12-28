// @flow
import React from "react";
import styled from "styled-components";
import { IconUpDownArrow } from "./svgs";

type PropTypes = {
  value: boolean,
  statusChange: Function
};

const Container = styled.div`
  position: relative;
  width: 26px;
  height: 26px;
`;
const Arrow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(0deg);
  transition: 0.2s all;

  ${props => {
    if (props.value === 1) {
      return `transform: rotate(180deg);`;
    }
  }};
`;

export const UpAndDown = ({ value, statusChange }: PropTypes) => {
  return (
    <Container>
      <Arrow
        value={value}
        onClick={() => {
          statusChange(value);
        }}
      >
        <IconUpDownArrow />
      </Arrow>
    </Container>
  );
};

export default UpAndDown;
