// @flow
import React from "react";
import styled from "styled-components";
import { IconLoading } from "./svgs";

const LoadingContainer = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingContent = styled.div`
  width: 30px;
  height: 0;
  position: relative;

  svg {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const Loading = () => {
  return (
    <LoadingContainer>
      <LoadingContent>
        <IconLoading />
      </LoadingContent>
    </LoadingContainer>
  );
};

export default Loading;
