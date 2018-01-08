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

const renderOutputTab = (page, devices, deviceRef) => {
  return devices
    .filter(device => device.platform === page.platform)
    .map(device => {
      return (
        <Output device={device} deviceRef={deviceRef} key={device.topic} />
      );
    });
};

const OutputPage = ({ page, devices, deviceRef }) => {
  return <Container>{renderOutputTab(page, devices, deviceRef)}</Container>;
};

export default OutputPage;
