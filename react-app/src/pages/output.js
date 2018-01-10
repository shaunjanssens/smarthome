// @flow
import React from "react";
import styled from "styled-components";
import Output from "../components/output";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const renderOutputTab = (page, deviceRef) => {
  return page.devices.map(device => {
    return (
      <Output
        deviceId={device}
        deviceRef={deviceRef}
        key={`container${device}`}
      />
    );
  });
};

const OutputPage = ({ page, deviceRef }) => {
  return <Container>{renderOutputTab(page, deviceRef)}</Container>;
};

export default OutputPage;
