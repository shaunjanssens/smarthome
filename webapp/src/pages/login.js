// @flow
import React, { Component } from "react";
import styled from "styled-components";
import { Button } from "../components/common";
import type { SystemType } from "../types";

type PropTypes = {
  system: SystemType
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

const Login = ({ system }: PropTypes) => {
  return (
    <Container>
      <Title>{system.name}</Title>
      <p>{system.description}</p>
      <Form>
        <Input type="text" placeholder="username" />
        <Input type="password" placeholder="password" />
        <Button
          value="sign in"
          onClick={() => {
            console.log("clicked");
          }}
        />
      </Form>
    </Container>
  );
};

export default Login;
