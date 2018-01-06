// @flow
import React from "react";
import styled from "styled-components";

const WrapperWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

export const Wrapper = props => {
  return <WrapperWrapper>{props.children}</WrapperWrapper>;
};

const ContentContent = styled.div`
  position: relative;
  padding: 30px;
`;

export const Content = props => {
  return <ContentContent>{props.children}</ContentContent>;
};

const ButtonContainer = styled.div`
  height: 50px;
  color: #fff;
  line-height: 50px;
  text-align: center;
  background: #49535c;
  box-shadow: 0 3px 15px 0 rgba(73, 83, 92, 0.2);
  border-radius: 3px;
  outline: none;

  &:hover {
    box-shadow: 0 3px 15px 0 rgba(73, 83, 92, 0.3);
  }
`;

export const Button = props => {
  return (
    <ButtonContainer
      onClick={() => {
        props.onClick();
      }}
      {...props}
    >
      {props.value}
    </ButtonContainer>
  );
};
