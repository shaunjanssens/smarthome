// @flow
import React from "react";
import styled from "styled-components";

type PropTypes = {
  value: boolean,
  statusChange: Function
};

const ToggleContainer = styled.div`
  position: relative;
  width: 52px;
  height: 24px;
  background: rgba(73, 83, 92, 0.04);
  box-shadow: inset 0 1px 3px 0 rgba(73, 83, 92, 0.1);
  border-radius: 100px;
`;

const ToggleKnob = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  background: #e24e4e;
  border-radius: 50%;
  transform: translateX(0);
  transition: all 0.15s;

  ${props => {
    if (props.value === 1) {
      return `transform: translateX(28px); background: #6FD38A`;
    }
  }};
`;

export const Toggle = ({ value, statusChange }: PropTypes) => {
  return (
    <ToggleContainer
      onClick={() => {
        statusChange(value);
      }}
    >
      <ToggleKnob value={value} />
    </ToggleContainer>
  );
};

export default Toggle;
